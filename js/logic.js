// e-TIN Guide BD — pure logic (no DOM). Testable with node.
// Facts verified 2026-11-10 against the NBR e-TIN portal guidance and
// multiple 2026 guides (see DATA_NOTES.md):
//   - Issuer: National Board of Revenue (NBR); portal secure.incometax.gov.bd
//   - Registration is FREE; e-TIN is a 12-digit number; NBR helpline 16555.
//   - Identity is verified against the Election Commission NID database;
//     account activation uses OTPs to mobile + email; user ID is 6+ chars.
//   - Typical time with documents ready: 15-30 minutes.
(function (root) {
  'use strict';

  var BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  function toBnDigits(v) {
    return String(v).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
  }

  function formatTaka(n, lang) {
    var s = String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return lang === 'bn' ? '৳' + toBnDigits(s) : '৳' + s;
  }

  // validateTin(raw) -> {status, reason}
  // status: 'valid12' (12 digits, current e-TIN format),
  //         'old10' (10 digits, pre-2013 TIN format — needs an e-TIN),
  //         'invalid' (reason: 'empty' | 'non-digit' | 'bad-length').
  // This checks FORMAT ONLY. It cannot confirm a TIN is real or belongs
  // to anyone — only NBR can do that.
  function validateTin(raw) {
    var s = String(raw == null ? '' : raw).replace(/[\s-]/g, '');
    if (s.length === 0) return { status: 'invalid', reason: 'empty' };
    if (/[^0-9]/.test(s)) return { status: 'invalid', reason: 'non-digit' };
    if (s.length === 12) return { status: 'valid12', reason: null };
    if (s.length === 10) return { status: 'old10', reason: null };
    return { status: 'invalid', reason: 'bad-length' };
  }

  // needTinVerdict(count) — how many "I need a TIN" situations are ticked.
  // 0 -> 'none', 1-2 -> 'likely', 3+ -> 'almost-certain'.
  function needTinVerdict(count) {
    if (typeof count !== 'number' || count < 0) return 'none';
    if (count === 0) return 'none';
    if (count <= 2) return 'likely';
    return 'almost-certain';
  }

  // Quiz scoring: answers = array of chosen option indexes (per question).
  function gradeQuiz(questions, answers) {
    var score = 0;
    var detail = [];
    questions.forEach(function (q, i) {
      var ok = answers[i] === q.answer;
      if (ok) score++;
      detail.push({ id: q.id, correct: ok });
    });
    var total = questions.length;
    var pct = total ? Math.round((score / total) * 100) : 0;
    var grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : pct >= 50 ? 'D' : 'F';
    return { score: score, total: total, pct: pct, grade: grade, detail: detail };
  }

  function guideProgress(guide, doneSteps) {
    var total = guide.steps.length;
    var done = guide.steps.filter(function (s) { return doneSteps.indexOf(s.id) !== -1; }).length;
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  function checklistProgress(list, checked) {
    var total = list.items.length;
    var done = list.items.filter(function (it) { return checked.indexOf(it.id) !== -1; }).length;
    return { done: done, total: total, pct: total ? Math.round((done / total) * 100) : 0 };
  }

  // Strict validation for the exported data blob.
  function validateImport(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'not-object' };
    if (data.app !== 'tin-certificate-bd' || typeof data.version !== 'number') return { ok: false, error: 'bad-app' };
    if (data.guideDone !== undefined) {
      if (typeof data.guideDone !== 'object' || Array.isArray(data.guideDone)) return { ok: false, error: 'bad-guideDone' };
      var gk = Object.keys(data.guideDone);
      for (var i = 0; i < gk.length; i++) {
        if (!Array.isArray(data.guideDone[gk[i]])) return { ok: false, error: 'bad-guideDone' };
        for (var j = 0; j < data.guideDone[gk[i]].length; j++) {
          if (typeof data.guideDone[gk[i]][j] !== 'string') return { ok: false, error: 'bad-guideDone' };
        }
      }
    }
    if (data.checks !== undefined) {
      if (typeof data.checks !== 'object' || Array.isArray(data.checks)) return { ok: false, error: 'bad-checks' };
      var ck = Object.keys(data.checks);
      for (var a = 0; a < ck.length; a++) {
        if (!Array.isArray(data.checks[ck[a]])) return { ok: false, error: 'bad-checks' };
      }
    }
    if (data.needTicks !== undefined) {
      if (!Array.isArray(data.needTicks)) return { ok: false, error: 'bad-needTicks' };
      for (var b = 0; b < data.needTicks.length; b++) {
        if (typeof data.needTicks[b] !== 'string') return { ok: false, error: 'bad-needTicks' };
      }
    }
    if (data.quizBest !== undefined) {
      if (typeof data.quizBest !== 'number' || data.quizBest < 0 || data.quizBest > 10) return { ok: false, error: 'bad-quizBest' };
    }
    return { ok: true };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  var api = {
    toBnDigits: toBnDigits, formatTaka: formatTaka,
    validateTin: validateTin, needTinVerdict: needTinVerdict,
    gradeQuiz: gradeQuiz,
    guideProgress: guideProgress, checklistProgress: checklistProgress,
    validateImport: validateImport, esc: esc
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.TinLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
