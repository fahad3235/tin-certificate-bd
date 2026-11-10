# TEST RESULTS — tin-certificate-bd

Run date: 2026-11-10 (15:00 slot, run #294). All tests run for real on this VM; nothing invented.

## Unit tests — `node tests/logic.test.js`

**31/31 checks passed** (exit 0), covering:

- Bengali digit conversion (`2026` → `২০২৬`) and taka formatting (EN `৳1,234,567`, BN `৳৫০০`)
- TIN format validation: 12 digits → `valid12`; spaces/dashes stripped; 10 digits → `old10`; empty / letters / 11-digit / 13-digit → `invalid` with the right reason; `null` → invalid
- Need-TIN verdicts: 0 → `none`, 1–2 → `likely`, 3–8 → `almost-certain`, negative/non-number → `none`
- Quiz grading: 3/3 → A+, 2/3 → 67% C, 0/3 → F
- Progress maths: guide 2/3 → 67%, checklist 1/2 → 50%
- Strict import validation: good payload ok; wrong app / non-object / bad guideDone / bad needTicks / quizBest out of range (11, -1) all rejected; minimal payload ok
- HTML escaping

## Smoke tests — `node tests/smoke.js`

**49/49 checks passed** (exit 0). Raw CDP against `chromium_headless_shell-1187`, `file://` URL, desktop 1440×900 then mobile 390×844.

Hand-verified in the run: page title; 6 fact chips (portal + Free present); what-is text >200 chars; 6 tabs; facts tab default; disclaimer; 2 guide cards (7 + 6 steps), tick → 1/7; 3 checklist cards, 17 items, 0/17 → 1/17; guide + checklist ticks persist across reload; need-check 8 situations, 1 tick → "likely need a TIN", 3 ticks → "almost certainly need a TIN", ticks persist in state; TIN checker 12-digit → valid/good, 10-digit → old format, 5-digit → invalid/bad, letter → "digits only"; quiz 10/10 A+ with best-score persistence across reload; export payload `tin-certificate-bd` v1 carrying guide progress + need ticks; eraseAll clears guide progress + need ticks; valid import restores; wrong-app import rejected and leaves data intact; BN toggle → Bengali title + `১২ সংখ্যার` chip, persists across reload, back to EN; 390px no horizontal overflow on facts/guides/checklists; zero non-file network requests; 0 console/page errors.

## Repairs

- 1 test-side fix: the "17 checklist items" selector also matched the need-check list (rendered in a hidden tab). Scoped to `#tab-checklists`. Re-ran: 49/49 green.
- 0 app-logic bugs found.

## Files tested

`index.html`, `css/style.css`, `js/logic.js`, `js/data.js`, `js/i18n.js`, `js/app.js`, `tests/logic.test.js`, `tests/smoke.js`.
