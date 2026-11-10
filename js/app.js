// e-TIN Guide BD — app wiring (DOM + storage).
(function () {
  'use strict';
  var L = window.TinLogic;
  var DATA = window.TinData;
  var I18N = window.TinI18n.STRINGS;
  var STORE_KEY = 'tin-certificate-bd-v1';
  var LANG_KEY = 'tin-certificate-bd-lang';
  var TABS = ['facts', 'guides', 'checklists', 'needtin', 'quiz', 'data'];

  var state = {
    lang: 'en',
    tab: 'facts',
    guideDone: {},   // guideId -> [stepId]
    checks: {},      // listId -> [itemId]
    needTicks: [],   // [situationId]
    quizBest: 0,
    quiz: null       // {idx, answers[], done, result}
  };

  function $(id) { return document.getElementById(id); }
  function t(key) { return I18N[state.lang][key] || I18N.en[key] || key; }
  function num(n) { return state.lang === 'bn' ? L.toBnDigits(n) : String(n); }
  function loc(obj) { return obj[state.lang] || obj.en; }

  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d && typeof d === 'object') {
          if (d.guideDone && typeof d.guideDone === 'object') state.guideDone = d.guideDone;
          if (d.checks && typeof d.checks === 'object') state.checks = d.checks;
          if (Array.isArray(d.needTicks)) state.needTicks = d.needTicks;
          if (typeof d.quizBest === 'number') state.quizBest = d.quizBest;
        }
      }
    } catch (e) { /* corrupted storage: start fresh */ }
    try {
      var lang = localStorage.getItem(LANG_KEY);
      if (lang === 'bn' || lang === 'en') state.lang = lang;
    } catch (e) { /* ignore */ }
  }

  function saveStore() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        app: 'tin-certificate-bd', version: 1,
        guideDone: state.guideDone, checks: state.checks,
        needTicks: state.needTicks, quizBest: state.quizBest
      }));
      localStorage.setItem(LANG_KEY, state.lang);
    } catch (e) { /* storage unavailable: session-only */ }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2500);
  }

  // ---------- language ----------
  function applyLang() {
    document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
    });
    $('langBtn').textContent = state.lang === 'bn' ? 'English' : 'বাংলা';
    renderFacts();
    renderGuides();
    renderChecklists();
    renderNeedList();
    renderQuiz();
  }

  function setLang(lang) {
    state.lang = lang;
    saveStore();
    applyLang();
  }

  // ---------- facts ----------
  function renderFacts() {
    $('facts').innerHTML = DATA.FACTS.map(function (f) {
      return '<span class="fact">' + L.esc(loc(f)) + '</span>';
    }).join('');
    $('whatText').innerHTML = DATA.WHAT.map(function (p) {
      return '<p>' + L.esc(loc(p)) + '</p>';
    }).join('');
  }

  // ---------- tabs ----------
  function showTab(tab) {
    state.tab = tab;
    TABS.forEach(function (tb) {
      $('tab-' + tb).hidden = tb !== tab;
      var btn = $('tabbtn-' + tb);
      btn.classList.toggle('active', tb === tab);
      btn.setAttribute('aria-selected', tb === tab ? 'true' : 'false');
    });
  }

  // ---------- guides ----------
  function renderGuides() {
    var wrap = $('guidesList');
    wrap.innerHTML = '';
    DATA.GUIDES.forEach(function (g) {
      var done = state.guideDone[g.id] || [];
      var prog = L.guideProgress(g, done);
      var card = document.createElement('section');
      card.className = 'card guide-card';
      var head = document.createElement('div');
      head.className = 'guide-head';
      head.innerHTML = '<h3>' + L.esc(loc(g.title)) + '</h3>' +
        '<p class="muted">' + L.esc(t('guideTime')) + ': ' + L.esc(loc(g.time)) + '</p>' +
        '<div class="progress"><div class="bar" style="width:' + prog.pct + '%"></div></div>' +
        '<p class="muted">' + num(prog.done) + '/' + num(prog.total) + ' ' + L.esc(t('doneSteps')) +
        ' · ' + num(prog.pct) + '%</p>';
      card.appendChild(head);
      var ol = document.createElement('ol');
      ol.className = 'steps';
      g.steps.forEach(function (s) {
        var li = document.createElement('li');
        li.className = done.indexOf(s.id) !== -1 ? 'done' : '';
        var label = document.createElement('label');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = done.indexOf(s.id) !== -1;
        cb.setAttribute('aria-label', loc(s.title));
        cb.addEventListener('change', function () {
          var arr = state.guideDone[g.id] || [];
          if (cb.checked) { if (arr.indexOf(s.id) === -1) arr.push(s.id); }
          else { arr = arr.filter(function (x) { return x !== s.id; }); }
          state.guideDone[g.id] = arr;
          saveStore();
          renderGuides();
        });
        var txt = document.createElement('span');
        txt.innerHTML = '<strong>' + L.esc(loc(s.title)) + '</strong><br>' + L.esc(loc(s.detail));
        label.appendChild(cb);
        label.appendChild(txt);
        li.appendChild(label);
        ol.appendChild(li);
      });
      card.appendChild(ol);
      var reset = document.createElement('button');
      reset.type = 'button';
      reset.className = 'btn ghost small';
      reset.textContent = t('resetGuide');
      reset.addEventListener('click', function () {
        state.guideDone[g.id] = [];
        saveStore();
        renderGuides();
        toast(t('resetDone'));
      });
      card.appendChild(reset);
      wrap.appendChild(card);
    });
  }

  // ---------- checklists ----------
  function renderChecklists() {
    var wrap = $('checkList');
    wrap.innerHTML = '';
    var totalDone = 0, totalItems = 0;
    DATA.CHECKLISTS.forEach(function (list) {
      var checked = state.checks[list.id] || [];
      var prog = L.checklistProgress(list, checked);
      totalDone += prog.done;
      totalItems += prog.total;
      var card = document.createElement('section');
      card.className = 'card check-card';
      var head = document.createElement('div');
      head.innerHTML = '<h3>' + L.esc(loc(list.title)) + '</h3>' +
        '<div class="progress"><div class="bar" style="width:' + prog.pct + '%"></div></div>' +
        '<p class="muted">' + num(prog.done) + '/' + num(prog.total) + ' ' + L.esc(t('ready')) +
        ' · ' + num(prog.pct) + '%</p>';
      card.appendChild(head);
      var ul = document.createElement('ul');
      ul.className = 'checks';
      list.items.forEach(function (it) {
        var li = document.createElement('li');
        var label = document.createElement('label');
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = checked.indexOf(it.id) !== -1;
        cb.setAttribute('aria-label', loc(it.text));
        cb.addEventListener('change', function () {
          var arr = state.checks[list.id] || [];
          if (cb.checked) { if (arr.indexOf(it.id) === -1) arr.push(it.id); }
          else { arr = arr.filter(function (x) { return x !== it.id; }); }
          state.checks[list.id] = arr;
          saveStore();
          renderChecklists();
        });
        var span = document.createElement('span');
        span.textContent = loc(it.text);
        label.appendChild(cb);
        label.appendChild(span);
        li.appendChild(label);
        ul.appendChild(li);
      });
      card.appendChild(ul);
      wrap.appendChild(card);
    });
    var pct = totalItems ? Math.round((totalDone / totalItems) * 100) : 0;
    $('checkOverall').textContent = t('overall') + ': ' + num(totalDone) + '/' + num(totalItems) +
      ' · ' + num(pct) + '%';
    $('checkOverallBar').style.width = pct + '%';
  }

  // ---------- need a TIN? ----------
  function renderNeedList() {
    var wrap = $('needList');
    wrap.innerHTML = '';
    var ul = document.createElement('ul');
    ul.className = 'checks';
    DATA.NEED_SITUATIONS.forEach(function (s) {
      var li = document.createElement('li');
      var label = document.createElement('label');
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = state.needTicks.indexOf(s.id) !== -1;
      cb.setAttribute('aria-label', loc(s.text));
      cb.addEventListener('change', function () {
        if (cb.checked) { if (state.needTicks.indexOf(s.id) === -1) state.needTicks.push(s.id); }
        else { state.needTicks = state.needTicks.filter(function (x) { return x !== s.id; }); }
        saveStore();
      });
      var span = document.createElement('span');
      span.textContent = loc(s.text);
      label.appendChild(cb);
      label.appendChild(span);
      li.appendChild(label);
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
  }

  function runNeedCheck() {
    var count = state.needTicks.length;
    var verdict = L.needTinVerdict(count);
    var box = $('needResult');
    box.hidden = false;
    if (verdict === 'none') {
      box.className = 'result good';
      box.innerHTML = '<strong>' + L.esc(t('needNone')) + '</strong>';
    } else if (verdict === 'likely') {
      box.className = 'result warn';
      box.innerHTML = '<strong>' + num(count) + ' ' + L.esc(t('needCount')) + '</strong><br>' + L.esc(t('needLikely'));
    } else {
      box.className = 'result warn';
      box.innerHTML = '<strong>' + num(count) + ' ' + L.esc(t('needCount')) + '</strong><br>' + L.esc(t('needAlmost'));
    }
  }

  function runTinCheck() {
    var r = L.validateTin($('tinInput').value);
    var box = $('tinResult');
    box.hidden = false;
    if (r.status === 'valid12') {
      box.className = 'result good';
      box.innerHTML = '<strong>' + L.esc(t('tinValid')) + '</strong>';
    } else if (r.status === 'old10') {
      box.className = 'result warn';
      box.innerHTML = '<strong>' + L.esc(t('tinOld')) + '</strong>';
    } else {
      box.className = 'result bad';
      var key = r.reason === 'empty' ? 'tinEmpty' : r.reason === 'non-digit' ? 'tinNonDigit' : 'tinBadLength';
      box.innerHTML = '<strong>' + L.esc(t(key)) + '</strong>';
    }
  }

  // ---------- quiz ----------
  function renderQuiz() {
    var wrap = $('quizBox');
    var q = state.quiz;
    if (!q) {
      wrap.innerHTML = '<p class="muted">' + L.esc(t('quizHint')) + '</p>' +
        '<p><button type="button" class="btn primary" id="quizStartBtn">' + L.esc(t('quizStart')) + '</button></p>' +
        '<p class="muted">' + L.esc(t('quizBest')) + ': ' + num(state.quizBest) + '/' + num(DATA.QUIZ.length) + '</p>';
      $('quizStartBtn').addEventListener('click', function () {
        state.quiz = { idx: 0, answers: [], answered: false, result: null };
        renderQuiz();
      });
      return;
    }
    if (q.result) {
      var r = q.result;
      wrap.innerHTML = '<h3>' + L.esc(t('quizScore')) + ': ' + num(r.score) + '/' + num(r.total) +
        ' (' + num(r.pct) + '%) — ' + L.esc(r.grade) + '</h3>' +
        '<p class="muted">' + L.esc(t('quizBest')) + ': ' + num(state.quizBest) + '/' + num(r.total) + '</p>' +
        '<ol class="review">' + r.detail.map(function (d, i) {
          var qq = DATA.QUIZ[i];
          return '<li class="' + (d.correct ? 'ok' : 'bad') + '"><strong>' + L.esc(loc(qq.q)) + '</strong><br>' +
            L.esc(loc(qq.options[qq.answer])) + ' — ' + L.esc(loc(qq.why)) + '</li>';
        }).join('') + '</ol>' +
        '<p><button type="button" class="btn primary" id="quizAgainBtn">' + L.esc(t('quizAgain')) + '</button></p>';
      $('quizAgainBtn').addEventListener('click', function () {
        state.quiz = null;
        renderQuiz();
      });
      return;
    }
    var qq = DATA.QUIZ[q.idx];
    var html = '<p class="muted">' + L.esc(t('quizQ')) + ' ' + num(q.idx + 1) + ' ' + L.esc(t('quizOf')) +
      ' ' + num(DATA.QUIZ.length) + '</p>' +
      '<h3>' + L.esc(loc(qq.q)) + '</h3><div class="options">';
    qq.options.forEach(function (opt, i) {
      var cls = 'opt';
      if (q.answered) {
        if (i === qq.answer) cls += ' correct';
        else if (i === q.answers[q.idx]) cls += ' wrong';
      }
      html += '<button type="button" class="' + cls + '" data-opt="' + i + '"' +
        (q.answered ? ' disabled' : '') + '>' + L.esc(loc(opt)) + '</button>';
    });
    html += '</div><div id="quizFeed" class="quiz-feed">' + (q.answered ?
      '<p class="' + (q.answers[q.idx] === qq.answer ? 'good-t' : 'bad-t') + '"><strong>' +
      L.esc(q.answers[q.idx] === qq.answer ? t('quizCorrect') : t('quizWrong')) + '</strong> ' +
      L.esc(loc(qq.why)) + '</p>' : '') + '</div>';
    if (q.answered) {
      html += '<p><button type="button" class="btn primary" id="quizNextBtn">' +
        L.esc(q.idx + 1 === DATA.QUIZ.length ? t('quizFinish') : t('quizNext')) + '</button></p>';
    }
    wrap.innerHTML = html;
    wrap.querySelectorAll('.opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        q.answers[q.idx] = parseInt(btn.getAttribute('data-opt'), 10);
        q.answered = true;
        renderQuiz();
      });
    });
    var next = $('quizNextBtn');
    if (next) {
      next.addEventListener('click', function () {
        if (q.idx + 1 === DATA.QUIZ.length) {
          var r = L.gradeQuiz(DATA.QUIZ, q.answers);
          q.result = r;
          if (r.score > state.quizBest) { state.quizBest = r.score; saveStore(); }
        } else {
          q.idx++;
          q.answered = false;
        }
        renderQuiz();
      });
    }
  }

  // ---------- data tab ----------
  function exportData() {
    var payload = {
      app: 'tin-certificate-bd', version: 1,
      guideDone: state.guideDone, checks: state.checks,
      needTicks: state.needTicks, quizBest: state.quizBest,
      exportedAt: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'tin-certificate-bd-data.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    toast(t('exported'));
  }

  function importData(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var data = JSON.parse(reader.result);
        var v = L.validateImport(data);
        if (!v.ok) throw new Error(v.error);
        state.guideDone = data.guideDone || {};
        state.checks = data.checks || {};
        state.needTicks = Array.isArray(data.needTicks) ? data.needTicks : [];
        state.quizBest = typeof data.quizBest === 'number' ? data.quizBest : 0;
        saveStore();
        renderGuides();
        renderChecklists();
        renderNeedList();
        renderQuiz();
        toast(t('importOk'));
      } catch (e) {
        toast(t('importBad'));
      }
    };
    reader.readAsText(file);
  }

  function eraseAll() {
    var ans = window.prompt(t('eraseConfirm'));
    if (ans !== 'DELETE') return;
    state.guideDone = {};
    state.checks = {};
    state.needTicks = [];
    state.quizBest = 0;
    state.quiz = null;
    saveStore();
    renderGuides();
    renderChecklists();
    renderNeedList();
    renderQuiz();
    toast(t('eraseDone'));
  }

  // Test hooks (used by tests/smoke.js only).
  window.__tin = {
    state: state,
    validateTin: L.validateTin,
    needTinVerdict: L.needTinVerdict,
    runNeedCheck: runNeedCheck,
    runTinCheck: runTinCheck,
    exportPayload: function () {
      return { app: 'tin-certificate-bd', version: 1, guideDone: state.guideDone, checks: state.checks, needTicks: state.needTicks, quizBest: state.quizBest };
    },
    importPayload: function (json) {
      try {
        var data = JSON.parse(json);
        var v = L.validateImport(data);
        if (!v.ok) return { ok: false, error: v.error };
        state.guideDone = data.guideDone || {};
        state.checks = data.checks || {};
        state.needTicks = Array.isArray(data.needTicks) ? data.needTicks : [];
        state.quizBest = typeof data.quizBest === 'number' ? data.quizBest : 0;
        saveStore();
        renderGuides();
        renderChecklists();
        renderNeedList();
        renderQuiz();
        return { ok: true };
      } catch (e) { return { ok: false, error: 'parse' }; }
    },
    eraseAll: function () {
      state.guideDone = {};
      state.checks = {};
      state.needTicks = [];
      state.quizBest = 0;
      state.quiz = null;
      saveStore();
      renderGuides();
      renderChecklists();
      renderNeedList();
      renderQuiz();
    }
  };

  // ---------- init ----------
  function init() {
    loadStore();
    TABS.forEach(function (tb) {
      $('tabbtn-' + tb).addEventListener('click', function () { showTab(tb); });
    });
    $('needBtn').addEventListener('click', runNeedCheck);
    $('tinBtn').addEventListener('click', runTinCheck);
    $('tinInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); runTinCheck(); }
    });
    $('exportBtn').addEventListener('click', exportData);
    $('importBtn').addEventListener('click', function () { $('importFile').click(); });
    $('importFile').addEventListener('change', function (e) {
      if (e.target.files.length) importData(e.target.files[0]);
      e.target.value = '';
    });
    $('eraseBtn').addEventListener('click', eraseAll);
    $('langBtn').addEventListener('click', function () {
      setLang(state.lang === 'bn' ? 'en' : 'bn');
    });
    applyLang();
    showTab('facts');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
