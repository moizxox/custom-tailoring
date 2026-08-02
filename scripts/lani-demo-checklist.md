# Video demo checklist for Lani (full — Aug 2026 round)

Record one continuous walkthrough (~12–15 min). Cover **prior QA items** and **new feedback**.

## Opening
1. **QC mindset** — “We finished another internal QC pass with your document notes before asking you to review.”

## CMS flexibility (her core request)
2. **Section hide** — Admin → Pages → any page → Eye toggle «Ausgeblendet» → Save order → hard refresh public page → section gone (still in CMS).
3. **Section reorder** — arrows up/down → save → live order updates.
4. **Edit text + images** — open a section, change headline + image, save, show live.
5. **Custom page** — Neue Seite → publish `/seite/…` → add to Navigation.
6. **Nav hide** — Navigation → «Auf Website anzeigen» off → item stays in CMS, hidden live.

## Screenshot / document fixes
7. **Footer CTA icons** — phone / mail / WhatsApp between headline and buttons.
8. **Footer brand** — Linvara AG + Kostümschneiderei; Instagram/Facebook hidden when empty.
9. **Footer contact editable** — Admin → Navigation → Footer fields.
10. **No breadcrumb text on Katalog hero** — illustrated banners without Start › Shop overlay.
11. **Katalog images** — grid shows full costume (`object-contain`), not cropped.
12. **Katalog wording** — «Alle Angebote» / Angebot ansehen (not Produkt-buy language).
13. **CMS headings** — show editing «Unsere Produkte» / categories texts in Shop page CMS.
14. **Termin form labels** — step 4 shows Name / E-Mail / Telefon / Nachricht labels.
15. **Termin success** — «Buchungsanfrage erhalten» (not «bestätigt»).
16. **Time Slots** — Termin page Hochsaison band + CMS toggle to hide off-season; nav/service «Time Slots».
17. **Time slots editable** — Admin → Termin → timetables + walk-in text.
18. **Block times** — CRM → Termine → create block → show booking rejected in that window.
19. **Service duration** — Appointment type duration (10 vs 60) in CMS + shown in booking.
20. **Impressum** — empty owner/title hides lines; Additional sections add/remove text blocks.
21. **Team** — no broken icon when none; only «Unser Team» (no wrong subtitle).
22. **Logo** — Linvara AG larger under brand.
23. **Massfertigung** — Präzision block removed; title without «Vertrauliche».
24. **Massblatt** — title Massblatt; no Aktuelles Projekt/Kategorie; no letter badges; submit with partial fields.
25. **Dashed mistake** — cleaner section borders (no wrong dashed stitch line on contact band).

## Portal / CRM professional
26. **Kundenbereich** — find in header → login → Massblatt.
27. **CRM dashboard** — Anfragen, Termine, Kunden, Projekte.
28. **CRM Termine** — list requests, confirm/cancel, block calendar with help text.
29. **CRM Masse** — project Masse labels (not Massnahme).
30. **Business email** — enquiry From/notify info@ (show if available).

## Responsive
31. Home, Katalog, Kontakt, Termin, portal at mobile width.

## Close
“Please review now — everything from your document and message is covered on our side first. Favicon later as noted.”

---

## Left on our / her end (say this in the video)

Do **not** pretend these are finished in code alone:

### You (Moiz) before go-live
- Deploy + `prisma db push` on VPS  
- Hostinger **SMTP password** for `info@kostuem-schneiderei.ch` in VPS `.env`  
- Confirm Admin Settings contact = info@  
- Drop Massblatt PDF into `public/documents/massblatt.pdf` when she sends it  
- Favicon later  

### Lani in CMS (walk her through these)
- Rename nav **Shop → Katalog** if still old in saved nav  
- Edit Katalog headings (“Unsere Produkte” etc.) under Pages → Katalog  
- Footer contact / brand / empty social URLs under Navigation → Footer  
- Impressum: remove unused lines & extra sections she crossed out  
- Termin: set service **durations**, edit Time Slots text/times, toggle Time Slots off off-season  
- CRM → Termine: enter her real **blocked times**  
- Team photos / none icons; any other text she still wants changed  
- Send Massblatt AI label list + PDF when ready  
