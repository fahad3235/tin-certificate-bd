# DATA NOTES — tin-certificate-bd

Facts used in this app, and where each came from. Checked 2026-11-10.
The app labels itself an unofficial guide and tells the user to verify on
secure.incometax.gov.bd before applying.

## Verified facts (used in the app)

| Fact | Sources (2026 guides + official pages) |
|---|---|
| Issuer: National Board of Revenue (NBR) | taxologybangladesh.com, tincertificatebd.com, bangladesh-consultant.com, businesspathsala.com — all agree |
| Official portal: secure.incometax.gov.bd (TINHome); eTax returns at etaxnbr.gov.bd | taxologybangladesh.com, indibloghub.com, bangladesh-consultant.com, etothyo.com |
| Registration is FREE | taxologybangladesh.com ("completely free"), tincertificatebd.com, bangladesh-consultant.com ("totally free of charge"), indibloghub.com ("no fees required"), etothyo.com ("completely free") |
| e-TIN is a 12-digit number; certificate PDF ready to download in seconds after NID verification | indibloghub.com, tincertificatebd.com |
| Identity verified against the Election Commission NID database | taxologybangladesh.com |
| Account: user ID 6+ characters, strong password, security question; OTPs to mobile + email to activate | indibloghub.com, taxologybangladesh.com |
| Individual documents: NID (10 or 17-digit), active mobile, email, parents' names as on NID, present + permanent address with postcode, source of income | taxologybangladesh.com, etothyo.com, bangladesh-consultant.com |
| Business documents: trade licence; companies: RJSC certificate of incorporation, Memorandum + Articles of Association; bank details | taxologybangladesh.com, bangladesh-consultant.com, businesspathsala.com |
| NBR helpline: 16555 | tincertificatebd.com |
| Typical time with documents ready: 15–30 minutes | taxologybangladesh.com |
| e-TIN introduced / digitised since 2013; old TINs were 10 digits | taxologybangladesh.com ("since 2013"), bangladesh-consultant.com ("online TIN registration system in 2013") |

## Conflicting / weak claims (NOT used as app facts, or hedged)

- **One third-party blog (eicra.com) says a registration fee must be paid by card.** Five other 2026 sources and the NBR portal guidance say registration is free. The app follows the majority ("Free") and the footer tells users never to pay a broker.
- **"Compulsory for every eligible citizen since 2023"** (bangladesh-consultant.com). Single-source, legalistic, and depends on income thresholds — the app does NOT state this. The need-checker only says "likely / almost certainly" based on common situations and labels itself a guide, not legal advice.
- **Where a TIN is "required"** (bank account, passport, trade licence, car/land registration, import/export, directorship): widely cited across the sources, but the exact legal triggers change with finance acts. The app lists them as "common situations" in the need-checker, not as a legal list.
- **PSR (Proof of Submission of Return) rules 2026**: mentioned by tincertificatebd.com as new for 2026. Not modelled in the app beyond "file your return through the eTax portal when due" in the after-checklist.

## What the app deliberately does NOT claim

- The TIN format checker only checks shape (12 vs 10 digits). It cannot verify that a TIN exists or belongs to anyone. This is stated in the UI and in the code comment.
- No live application status, no lookup, no prices/fees beyond "free" — there is nothing else to charge for.
- No legal advice: the need-checker verdicts are "likely / almost certainly", never "you must".
