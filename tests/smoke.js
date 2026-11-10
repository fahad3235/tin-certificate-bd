// e-TIN Guide BD — headless-Chrome smoke test via raw CDP (no puppeteer dependency).
// Usage: node tests/smoke.js
// Exits non-zero on any failed assertion; fails on page console errors.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 9348;
const FILE = 'file://' + path.resolve(__dirname, '..', 'index.html');
let failures = 0;
let count = 0;
const pageErrors = [];
function check(name, cond, extra) {
  count++;
  console.log((cond ? 'ok - ' : 'FAIL - ') + name + (cond ? '' : ' :: ' + (extra || '')));
  if (!cond) failures++;
}
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const CHROME_BIN = process.env.CHROME_BIN ||
    require('os').homedir() + '/.cache/ms-playwright/chromium_headless_shell-1187/chrome-linux/headless_shell';
  const chrome = spawn(CHROME_BIN, [
    '--headless=new', '--no-sandbox', '--disable-gpu',
    '--remote-debugging-port=' + PORT, '--user-data-dir=/tmp/tin-smoke-' + process.pid,
    'about:blank',
  ], { stdio: 'ignore' });
  let targets = [];
  for (let i = 0; i < 50 && targets.length === 0; i++) {
    await wait(200);
    try {
      targets = JSON.parse(await new Promise((res, rej) => {
        http.get('http://127.0.0.1:' + PORT + '/json/list', (r) => {
          let d = ''; r.on('data', (c) => (d += c)); r.on('end', () => res(d));
        }).on('error', rej);
      }));
    } catch (e) { /* retry */ }
  }
  if (!targets.length) { console.log('FAIL - chrome did not start'); process.exit(2); }
  const wsUrl = targets[0].webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((res) => { ws.onopen = res; });
  let seq = 0; const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    if (msg.method === 'Runtime.exceptionThrown') {
      pageErrors.push('exception: ' + JSON.stringify(msg.params.exceptionDetails).slice(0, 300));
    }
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push('console.error: ' + JSON.stringify(msg.params.args).slice(0, 300));
    }
  };
  function send(method, params) {
    return new Promise((res) => {
      const id = ++seq;
      pending.set(id, res);
      ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: FILE });
  await wait(1500);
  const ev = async (expr) => {
    const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.result && r.result.exceptionDetails) return { error: JSON.stringify(r.result.exceptionDetails).slice(0, 300) };
    return r.result ? r.result.result.value : undefined;
  };

  check('page title contains e-TIN Guide', (await ev('document.title'))?.includes('e-TIN Guide'));
  check('6 fact chips render', (await ev(`document.querySelectorAll('#facts .fact').length`)) === 6);
  check('facts mention portal', (await ev(`document.getElementById('facts').textContent`)).includes('secure.incometax.gov.bd'));
  check('facts mention Free', (await ev(`document.getElementById('facts').textContent`)).includes('Free'));
  check('what-is text renders', (await ev(`document.getElementById('whatText').textContent.length`)) > 200);
  check('6 tabs render', (await ev(`document.querySelectorAll('.tab').length`)) === 6);
  check('facts tab visible by default', (await ev(`document.getElementById('tab-facts').hidden`)) === false);
  check('disclaimer renders', (await ev(`document.querySelector('footer p').textContent.length`)) > 40);

  // Guides tab: 2 guides, individual 7 steps, business 6 steps; tick persists.
  await ev(`document.getElementById('tabbtn-guides').click()`);
  check('2 guide cards render', (await ev(`document.querySelectorAll('.guide-card').length`)) === 2);
  check('guide 1 has 7 steps', (await ev(`document.querySelectorAll('.guide-card')[0].querySelectorAll('.steps li').length`)) === 7);
  check('guide 2 has 6 steps', (await ev(`document.querySelectorAll('.guide-card')[1].querySelectorAll('.steps li').length`)) === 6);
  await ev(`document.querySelectorAll('.guide-card')[0].querySelector('.steps input[type=checkbox]').click()`);
  check('guide progress 1/7 after tick', (await ev(`document.querySelectorAll('.guide-card')[0].textContent`)).includes('1/7'));

  // Checklists tab: 3 lists, 17 items, overall 0/17 -> 1/17 after tick.
  await ev(`document.getElementById('tabbtn-checklists').click()`);
  check('3 checklist cards render', (await ev(`document.querySelectorAll('.check-card').length`)) === 3);
  check('17 checklist items total', (await ev(`document.querySelectorAll('#tab-checklists .checks input[type=checkbox]').length`)) === 17);
  check('overall starts 0/17', (await ev(`document.getElementById('checkOverall').textContent`)).includes('0/17'));
  await ev(`document.querySelectorAll('.check-card')[0].querySelector('.checks input[type=checkbox]').click()`);
  check('overall 1/17 after tick', (await ev(`document.getElementById('checkOverall').textContent`)).includes('1/17'));

  // Reload persistence of guides + checklists.
  await send('Page.navigate', { url: FILE });
  await wait(1200);
  await ev(`document.getElementById('tabbtn-guides').click()`);
  check('guide tick persists after reload', (await ev(`document.querySelectorAll('.guide-card')[0].textContent`)).includes('1/7'));
  await ev(`document.getElementById('tabbtn-checklists').click()`);
  check('checklist tick persists after reload', (await ev(`document.getElementById('checkOverall').textContent`)).includes('1/17'));

  // Need-a-TIN tab: 8 situations; tick 1 -> likely; tick 3 -> almost certain.
  await ev(`document.getElementById('tabbtn-needtin').click()`);
  check('8 situations render', (await ev(`document.querySelectorAll('#needList .checks input[type=checkbox]').length`)) === 8);
  await ev(`document.querySelectorAll('#needList .checks input[type=checkbox]')[0].click()`);
  await ev(`document.getElementById('needBtn').click()`);
  check('1 situation -> likely verdict', (await ev(`document.getElementById('needResult').textContent`)).includes('likely need a TIN'));
  await ev(`document.querySelectorAll('#needList .checks input[type=checkbox]')[1].click()`);
  await ev(`document.querySelectorAll('#needList .checks input[type=checkbox]')[2].click()`);
  await ev(`document.getElementById('needBtn').click()`);
  check('3 situations -> almost certainly verdict', (await ev(`document.getElementById('needResult').textContent`)).includes('almost certainly need a TIN'));
  check('need ticks persist in state', (await ev(`window.__tin.state.needTicks.length`)) === 3);

  // TIN format checker: 12 digits valid, 10 digits old, bad input invalid.
  await ev(`document.getElementById('tinInput').value='123456789012'; document.getElementById('tinBtn').click();`);
  check('12-digit TIN -> valid format', (await ev(`document.getElementById('tinResult').textContent`)).includes('Valid format'));
  check('12-digit result is good', (await ev(`document.getElementById('tinResult').className`)).includes('good'));
  await ev(`document.getElementById('tinInput').value='1234567890'; document.getElementById('tinBtn').click();`);
  check('10-digit TIN -> old format', (await ev(`document.getElementById('tinResult').textContent`)).includes('Old format'));
  await ev(`document.getElementById('tinInput').value='12345'; document.getElementById('tinBtn').click();`);
  check('5-digit TIN -> invalid', (await ev(`document.getElementById('tinResult').className`)).includes('bad'));
  await ev(`document.getElementById('tinInput').value='12345678901A'; document.getElementById('tinBtn').click();`);
  check('letter in TIN -> invalid', (await ev(`document.getElementById('tinResult').textContent`)).includes('digits only'));

  // Quiz: start, answer all 10 correctly, score 10/10, best persists.
  await ev(`document.getElementById('tabbtn-quiz').click()`);
  await ev(`document.getElementById('quizStartBtn').click()`);
  const answers = [0, 2, 2, 0, 1, 1, 1, 2, 1, 0];
  for (let i = 0; i < 10; i++) {
    await ev(`document.querySelectorAll('#quizBox .opt')[${answers[i]}].click()`);
    await wait(80);
    if (i === 0) check('Q1 correct feedback shows', (await ev(`document.getElementById('quizFeed').textContent`)).includes('Correct!'));
    await ev(`document.getElementById('quizNextBtn').click()`);
    await wait(80);
  }
  check('quiz result 10/10', (await ev(`document.getElementById('quizBox').textContent`)).includes('10/10'));
  check('quiz grade A+ shown', (await ev(`document.getElementById('quizBox').textContent`)).includes('A+'));
  await send('Page.navigate', { url: FILE });
  await wait(1200);
  await ev(`document.getElementById('tabbtn-quiz').click()`);
  check('best score 10 persists after reload', (await ev(`document.getElementById('quizBox').textContent`)).includes('10/10'));

  // Export / import round-trip + invalid import via test hooks.
  const payload = await ev(`JSON.stringify(window.__tin.exportPayload())`);
  check('export payload is tin-certificate-bd v1', payload.includes('"app":"tin-certificate-bd"') && payload.includes('"version":1'), payload);
  check('export payload carries guide progress', payload.includes('"individual":["ind-1"]'), payload);
  check('export payload carries need ticks', payload.includes('"needTicks":["need-1","need-2","need-3"]'), payload);
  await ev(`window.__tin.eraseAll()`);
  check('eraseAll clears guide progress', (await ev(`JSON.stringify(window.__tin.exportPayload())`)).includes('"guideDone":{}'));
  check('eraseAll clears need ticks', (await ev(`JSON.stringify(window.__tin.exportPayload())`)).includes('"needTicks":[]'));
  const imp = await ev(`JSON.stringify(window.__tin.importPayload(${JSON.stringify(payload)}))`);
  check('import valid payload ok', imp.includes('"ok":true'), imp);
  check('import restores guide progress', (await ev(`JSON.stringify(window.__tin.exportPayload())`)).includes('ind-1'));
  const badImp = await ev(`JSON.stringify(window.__tin.importPayload('{"app":"nid-guide-bd","version":1}'))`);
  check('import wrong app rejected', badImp.includes('"ok":false'));
  check('invalid import leaves data intact', (await ev(`JSON.stringify(window.__tin.exportPayload())`)).includes('ind-1'));
  await ev(`window.__tin.eraseAll()`);

  // Language toggle: Bengali title, persists after reload.
  await ev(`document.getElementById('langBtn').click()`);
  check('BN toggle: title in Bengali', (await ev(`document.getElementById('title').textContent`)) === 'ই-টিআইএন গাইড বিডি');
  check('BN toggle: fact chip in Bengali digits', (await ev(`document.getElementById('facts').textContent`)).includes('১২ সংখ্যার'));
  await send('Page.navigate', { url: FILE });
  await wait(1200);
  check('BN toggle persists after reload', (await ev(`window.__tin.state.lang`)) === 'bn');
  await ev(`document.getElementById('langBtn').click()`);
  check('back to EN', (await ev(`window.__tin.state.lang`)) === 'en');

  // Mobile 390px: no horizontal overflow on facts + guides + checklists tabs.
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: FILE });
  await wait(1200);
  const overflow = await ev(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  check('390px no horizontal overflow (facts)', overflow <= 0, 'overflow=' + overflow);
  await ev(`document.getElementById('tabbtn-guides').click()`);
  const overflow2 = await ev(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  check('390px no horizontal overflow (guides)', overflow2 <= 0, 'overflow=' + overflow2);
  await ev(`document.getElementById('tabbtn-checklists').click()`);
  const overflow3 = await ev(`document.documentElement.scrollWidth - document.documentElement.clientWidth`);
  check('390px no horizontal overflow (checklists)', overflow3 <= 0, 'overflow=' + overflow3);

  // Zero network requests: app is fully offline (only file:// loads).
  const reqs = await ev(`performance.getEntriesByType('resource').map(r => r.name).filter(n => !n.startsWith('file://')).length`);
  check('zero non-file network requests', reqs === 0, 'non-file=' + reqs);

  check('no console/page errors', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

  chrome.kill();
  console.log('\n' + count + ' checks, ' + failures + ' failed');
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.log('FAIL - harness error: ' + e.message); try { chrome.kill(); } catch (_) {} process.exit(2); });
