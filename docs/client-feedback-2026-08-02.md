# Client feedback notes — 2 Aug 2026 (Mian2.8.26 + message + screenshots)

Source: Lani WhatsApp/message + `Mian2.8.26.docx` + annotated screenshots.
She has **not** reviewed the whole site yet — only what she opened so far.

---

## A. Strategic CMS request (message)

1. **Edit text AND images on every page** — not only some sections.
2. **Hide / leave out** any section she does not need (without deleting the page).
3. **Same toolkit on all pages** — add text + image blocks inside sections consistently.
4. **Reorder sections with arrows** — already partly there; must work with hide + apply on every page.
5. Future pages should inherit this same section model (not one-off hardcoded layouts).

---

## B. Screenshot / document items (concrete fixes)

| # | Area | Request |
|---|------|---------|
| 1 | Footer CTA band | Add **Telefon / Mail / WhatsApp** icons between headline and CTA buttons |
| 2 | Home / section divider | Remove mistaken **dashed line** above “Details, die den Unterschied machen” |
| 3 | Footer brand | Correct **Linvara AG** / **Kostümschneiderei** branding |
| 4 | Footer social | **Remove Instagram & Facebook** for now (optional empty = hidden) |
| 5 | Illustrated banners | **No text overlays** (no breadcrumbs on picture heroes) |
| 6 | Katalog grid | Costume pictures still **cropped** → full image, no crop |
| 7 | Katalog headings | “Unsere Produkte” etc. must be **CMS-editable** |
| 8 | Terminology | Prefer **“Alle Angebote”** over “Produkt(e)” for garments |
| 9 | Termin step 4 | Contact fields show **without labels** — fix labels/placeholders |
| 10 | Termin success | “Termin bestätigt!” is wrong — booking is **received**, confirm by email later |
| 11 | Massen ohne Termin | Seasonal **Aug–Oct** only; new nav/submenu; she named it **Time Slots** |
| 12 | Time slots CMS | Edit times + accompanying text herself anytime |
| 13 | Termin admin | **Block times** (no regular hours) — needs clear admin UI + explanation |
| 14 | Termin services | **Per-service duration** (10 min vs 60 min etc.) |
| 15 | Impressum | Add/remove text sections freely; remove crossed-out hard blocks |
| 16 | Team / icons | “None” icon still shows broken image — **render nothing** when empty |
| 17 | Massblatt | Not all fields required; title **Massblatt**; remove “Aktuelles Projekt” + category line; not male-only; letter badges optional/hideable; DE labels to refine when she sends AI list |
| 18 | Logo | **Linvara AG** bigger under brand |
| 19 | Team title | Remove “Menschen hinter den Kostümen”; keep **Unser Team** |
| 20 | Footer contact | Contact details editable by herself in CMS (already partly — must be complete + clear) |
| 21 | Massfertigung | Remove “Präzision / Mass nehmen…” content block; drop word **Vertrauliche** from Massblätter heading |
| 22 | Favicon | Old favicon — change later (note only) |

---

## C. CRM / atelier system gaps (professional must-haves)

What we strengthened for a credible demo:

1. **Booking calendar admin** — blocked slots, service durations, appointment requests.
2. **Dashboard** — pending bookings + enquiries surfaced.
3. **Explainability for Lani** — in-admin help for “how do I block time?”

Still richer later (not blocking this demo): payments deep-dive, auto notifications for every portal event.

---

## D. Demo video

See `scripts/lani-demo-checklist.md` — prior QA + this round + “left on your end” closing.

---

## E. Left on your end (Moiz / ops) + Lani must do in CMS

Code alone cannot finish these. Track them before / during the demo.

### E1 — Moiz / server (ops) — do before or right after deploy

| Item | What to do | Where |
|------|------------|--------|
| **Deploy + DB** | Run `pnpm run deploy` when VPS is reachable. On server, `prisma db push` so `AppointmentRequest` + `BookingBlock` exist. | VPS / `scripts/deploy-vps.sh` |
| **Business email (SMTP)** | Set Hostinger mailbox for `info@kostuem-schneiderei.ch`: `NODEMAILER_HOST`, `NODEMAILER_PORT`, `NODEMAILER_USER`, `NODEMAILER_PASSWORD`, plus `CONTACT_NOTIFICATION_EMAIL=info@…`, `NODEMAILER_FROM=info@…`. Code already defaults notify/From to info@ — **password must be on the server**. | VPS `.env` |
| **Admin Settings contact** | Confirm Admin → Settings contact email = `info@kostuem-schneiderei.ch` (not private Gmail). | Live admin |
| **Massblatt PDF** | When Lani sends the PDF, save as `public/documents/massblatt.pdf` and redeploy (download button appears automatically). | Repo + deploy |
| **Favicon** | Swap old favicon later (she marked “later”). | `public/` / app icons |
| **Push git** | Push `main` when ready. | GitHub |

### E2 — Lani (or Moiz walking her through CMS) — content only she should set

These are **editable in CMS**; defaults may still show old wording until she saves.

| Item | Admin path | Action |
|------|------------|--------|
| **Nav label Shop → Katalog** | Navigation → Header nav | Rename any saved “Shop” label to **Katalog** (DB overrides defaults). |
| **Kundenbereich / Time Slots in nav** | Navigation | Add or show links if her saved nav predates the new defaults. Nest Time Slots under Service if she wants seasonal submenu. |
| **Hide seasonal Time Slots off-season** | Pages → Termin → Online booking → «Show Time Slots» = No | Turn off after Oct / on when Aug–Oct. |
| **Time slot hours + text** | Pages → Termin → Walk-in timetables | Edit days/times and card text per atelier. |
| **Service durations** | Pages → Termin → Appointment types → Duration (minutes) | Set 10 / 30 / 60 etc. per service. |
| **Block real unavailable times** | CRM → Termine → Zeitblöcke | She must enter her actual blocked windows (we only built the tool). |
| **Katalog headings** | Pages → Katalog (Shop) → categories / products intro | Change “Unsere Produkte” and any wrong product wording to her copy. |
| **Footer contact & brand** | Navigation → Footer | Phone, email, hours, location names, brand / Linvara subline — adjust to final legal names. |
| **Clear Instagram / Facebook** | Navigation → Footer (social URLs) **or** Settings → social | Leave **empty** so icons stay hidden. |
| **Impressum cleanup** | Pages → Impressum | Clear “Inhaberin” if unused; clear block heading if she doesn’t want OR Art. text; delete Haftung / Urheberrecht items she crossed out; add any new text blocks. |
| **Team copy / photos** | Pages → Über uns → Team | Set icons to none / clear; add photos; fix bios. |
| **Any page text/images she dislikes** | Pages → [page] → section | Edit or hide with eye toggle + save order. |
| **Custom pages** | Pages → Neue Seite | Create seasonal pages and link from Navigation. |
| **Massblatt German labels** | Waiting on her | She said she’ll send an AI-prepared label list — we apply when it arrives. |

### E3 — Explicitly waiting on Lani

1. Final **Massblatt PDF** file.
2. Corrected **German measurement field titles** (AI list).
3. Full site review (she said she only checked parts so far).
4. Confirmation that Hostinger **info@** password is available for SMTP.

---

## F. Out of scope this pass

- Deploy / live VPS push (until you run it)
- Final Massblatt DE glossary until she sends the AI list
- Favicon swap (deferred)
- Moving email hosting off Hostinger
