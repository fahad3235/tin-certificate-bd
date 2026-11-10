// e-TIN Guide BD — node unit tests for js/logic.js (no dependencies).
// Usage: node tests/logic.test.js
const assert = require('assert');
const L = require('../js/logic.js');

let count = 0;
function check(name, fn) {
  count++;
  fn();
  console.log('ok - ' + name);
}

// --- Bengali digits / taka ---
check('toBnDigits converts 0-9', () => assert.strictEqual(L.toBnDigits('2026'), '২০২৬'));
check('toBnDigits leaves non-digits alone', () => assert.strictEqual(L.toBnDigits('a1b'), 'a১b'));
check('formatTaka EN groups thousands', () => assert.strictEqual(L.formatTaka(1234567, 'en'), '৳1,234,567'));
check('formatTaka BN uses Bengali digits', () => assert.strictEqual(L.formatTaka(500, 'bn'), '৳৫০০'));

// --- TIN format validation ---
check('validateTin: 12 digits is valid12', () => {
  assert.deepStrictEqual(L.validateTin('123456789012'), { status: 'valid12', reason: null });
});
check('validateTin: spaces and dashes are stripped', () => {
  assert.strictEqual(L.validateTin('1234 5678-9012').status, 'valid12');
});
check('validateTin: 10 digits is old10', () => {
  assert.deepStrictEqual(L.validateTin('1234567890'), { status: 'old10', reason: null });
});
check('validateTin: empty is invalid/empty', () => {
  assert.deepStrictEqual(L.validateTin(''), { status: 'invalid', reason: 'empty' });
  assert.deepStrictEqual(L.validateTin('   '), { status: 'invalid', reason: 'empty' });
});
check('validateTin: letters are invalid/non-digit', () => {
  assert.deepStrictEqual(L.validateTin('12345678901A'), { status: 'invalid', reason: 'non-digit' });
});
check('validateTin: 11 digits is invalid/bad-length', () => {
  assert.deepStrictEqual(L.validateTin('12345678901'), { status: 'invalid', reason: 'bad-length' });
});
check('validateTin: 13 digits is invalid/bad-length', () => {
  assert.deepStrictEqual(L.validateTin('1234567890123'), { status: 'invalid', reason: 'bad-length' });
});
check('validateTin: null is invalid/empty', () => {
  assert.strictEqual(L.validateTin(null).status, 'invalid');
});

// --- need-TIN verdict ---
check('needTinVerdict: 0 -> none', () => assert.strictEqual(L.needTinVerdict(0), 'none'));
check('needTinVerdict: 1 -> likely', () => assert.strictEqual(L.needTinVerdict(1), 'likely'));
check('needTinVerdict: 2 -> likely', () => assert.strictEqual(L.needTinVerdict(2), 'likely'));
check('needTinVerdict: 3 -> almost-certain', () => assert.strictEqual(L.needTinVerdict(3), 'almost-certain'));
check('needTinVerdict: 8 -> almost-certain', () => assert.strictEqual(L.needTinVerdict(8), 'almost-certain'));
check('needTinVerdict: negative/invalid -> none', () => {
  assert.strictEqual(L.needTinVerdict(-1), 'none');
  assert.strictEqual(L.needTinVerdict('x'), 'none');
});

// --- quiz grading ---
const Q = [{ id: 'a', answer: 0 }, { id: 'b', answer: 2 }, { id: 'c', answer: 1 }];
check('gradeQuiz: all correct = 3/3 A+', () => {
  const r = L.gradeQuiz(Q, [0, 2, 1]);
  assert.strictEqual(r.score, 3); assert.strictEqual(r.pct, 100); assert.strictEqual(r.grade, 'A+');
});
check('gradeQuiz: 2/3 = 67% C', () => {
  const r = L.gradeQuiz(Q, [0, 2, 0]);
  assert.strictEqual(r.score, 2); assert.strictEqual(r.pct, 67); assert.strictEqual(r.grade, 'C');
});
check('gradeQuiz: 0/3 = F', () => {
  const r = L.gradeQuiz(Q, [1, 1, 0]);
  assert.strictEqual(r.score, 0); assert.strictEqual(r.grade, 'F');
});

// --- progress helpers ---
check('guideProgress counts done steps', () => {
  const g = { steps: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
  assert.deepStrictEqual(L.guideProgress(g, ['a', 'c']), { done: 2, total: 3, pct: 67 });
  assert.deepStrictEqual(L.guideProgress(g, []), { done: 0, total: 3, pct: 0 });
});
check('checklistProgress counts checked items', () => {
  const l = { items: [{ id: 'x' }, { id: 'y' }] };
  assert.deepStrictEqual(L.checklistProgress(l, ['x']), { done: 1, total: 2, pct: 50 });
});

// --- import validation ---
check('validateImport: good payload ok', () => {
  assert.deepStrictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1, guideDone: { individual: ['ind-1'] }, checks: {}, needTicks: ['need-1'], quizBest: 7 }), { ok: true });
});
check('validateImport: wrong app rejected', () => {
  assert.strictEqual(L.validateImport({ app: 'nid-guide-bd', version: 1 }).ok, false);
});
check('validateImport: non-object rejected', () => {
  assert.strictEqual(L.validateImport(null).ok, false);
  assert.strictEqual(L.validateImport([1]).ok, false);
  assert.strictEqual(L.validateImport('x').ok, false);
});
check('validateImport: bad guideDone rejected', () => {
  assert.strictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1, guideDone: { individual: 'ind-1' } }).ok, false);
});
check('validateImport: bad needTicks rejected', () => {
  assert.strictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1, needTicks: 'need-1' }).ok, false);
});
check('validateImport: quizBest out of range rejected', () => {
  assert.strictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1, quizBest: 11 }).ok, false);
  assert.strictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1, quizBest: -1 }).ok, false);
});
check('validateImport: minimal payload ok', () => {
  assert.deepStrictEqual(L.validateImport({ app: 'tin-certificate-bd', version: 1 }), { ok: true });
});

// --- esc ---
check('esc escapes HTML', () => {
  assert.strictEqual(L.esc('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;');
});

console.log('\n' + count + ' checks passed');
