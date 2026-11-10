# e-TIN Guide BD

[![Offline](https://img.shields.io/badge/offline-yes-brightgreen)](#)
[![Bilingual](https://img.shields.io/badge/EN-%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-blue)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A free, fully offline, bilingual (English / বাংলা) guide to getting an **e-TIN (Taxpayer Identification Number)** certificate in Bangladesh — from the National Board of Revenue (NBR).

> **Unofficial learning guide, not a government publication.** Steps and facts were checked on 2026-11-10 — always verify on [secure.incometax.gov.bd](https://secure.incometax.gov.bd) before you apply. Registration is free: never pay a broker, and never share your OTP or password with anyone.

## The problem

Millions of Bangladeshis need a TIN — for a job, a trade licence, a bank account, a passport, a car or land registration — but the process is surrounded by brokers charging for a registration that NBR gives away free. This app puts the whole process in one offline page: what a TIN is, the exact steps, the documents to have ready, a "do I need one?" check, a TIN format checker, and a quiz to test what you learned.

## Features

1. **Key facts** — issuer (NBR), official portal (secure.incometax.gov.bd), fee (Free), 12-digit e-TIN, helpline 16555, typical time 15–30 minutes; plus a plain-language "What is an e-TIN?" explainer.
2. **Step-by-step guides** — individual e-TIN (7 steps) and business/company e-TIN (6 steps), each with tick-off progress saved in the browser.
3. **Document checklists** — 3 lists, 17 items (individual 6, business 6, after-you-get-your-TIN 5) with per-list and overall progress.
4. **Do I need a TIN?** — tick 8 common situations (job, business, bank account, passport, car, land, import/export, directorship) and get a plain verdict; includes a **TIN format checker** (12 digits = current e-TIN, 10 digits = old pre-2013 format, anything else = invalid — format only, it cannot confirm a TIN is real).
5. **Quiz** — 10 hand-checked questions with explanations, instant feedback, grade (A+–F) and a persisted best score.
6. **My data** — JSON export / strict import / typed-DELETE erase-all. Everything lives in `localStorage`; nothing leaves the device.
7. **Bilingual + mobile** — EN/বাংলা toggle persisted, Bengali digits, responsive down to 390px, zero network requests.

## Stack

- Plain HTML + CSS + vanilla JavaScript. No framework, no build step, no dependencies.
- `js/logic.js` — pure, testable logic (TIN validation, verdicts, quiz grading, progress, import validation).
- `js/data.js` — all content (facts, guides, checklists, situations, quiz) in EN + BN.
- `js/i18n.js` — UI strings in EN + BN.
- `js/app.js` — DOM wiring + `localStorage` persistence.

## Prerequisites

Any modern browser. To run the tests: [Node.js](https://nodejs.org/) 18+ (for the unit tests) and the headless-Chromium shell used by the smoke test (see Testing).

## Install & run

```bash
# Clone, then open index.html directly — no server or build needed.
# Or serve locally:
python3 -m http.server 8000
# then open http://localhost:8000
```

## Development commands

```bash
node tests/logic.test.js   # unit tests (31 checks, no dependencies)
node tests/smoke.js        # headless-Chrome smoke test (49 checks)
```

## Testing

- **Unit tests** — `node tests/logic.test.js`: 31/31 checks pass (TIN validation, need-TIN verdicts, quiz grading, progress maths, strict import validation, HTML escaping).
- **Smoke tests** — `node tests/smoke.js` (raw CDP against `chromium_headless_shell-1187`, `file://`): 49/49 checks pass — facts/guides/checklists render, ticks persist across reload, need-check verdicts (1 → likely, 3 → almost certainly), TIN checker (12 valid / 10 old / short + letter invalid), quiz 10/10 A+ with best-score persistence, export/import round-trip + wrong-app rejection, BN toggle + persistence, 390px no-overflow on facts/guides/checklists, zero non-file network requests, 0 console/page errors.
- One test-side fix during development: the checklist-count selector also matched the need-check list (hidden tab); scoped to `#tab-checklists`. No app-logic bugs found.

## Deployment

Static site — copy the files to any static host, or enable GitHub Pages (main branch, root). Live: https://fahad3235.github.io/tin-certificate-bd/

## Limitations

- **Guide only, not legal advice.** Whether you legally need a TIN depends on your income and situation; when in doubt, ask a tax professional or call NBR on 16555.
- **The TIN checker validates format only.** A 12-digit number can still be fake, mistyped, or someone else's. Only NBR can confirm a TIN.
- **Facts are reported figures checked 2026-11-10** (see `DATA_NOTES.md`). NBR can change the portal, steps or helpline — verify on secure.incometax.gov.bd before you apply.
- **No live data.** The app never contacts the internet; it cannot check your application status or look up a TIN.

## Status

Complete MVP — built, tested and published 2026-11-10. No personal data is collected, stored on any server, or shipped with the app.
