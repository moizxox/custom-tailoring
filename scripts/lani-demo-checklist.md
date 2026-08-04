# Video demo checklist for Lani (full — Aug 2026 round)

## CMS flexibility (her core request)

1. **Section hide** — Admin → Pages → any page → Eye toggle «Ausgeblendet» (sidebar or section) → Save visibility → hard refresh public page → section gone (still in CMS).
2. **Section reorder** — arrows up/down (sidebar or section) → save → live order updates.
3. **Edit text + images** — open a section, change headline + image, save, show live.
3b. **Modular Flex-Bausteine** — every page lists the same Flex blocks (Textblock, Bild+Text, CTA, Ablauf, Galerie, FAQ, Kontakt-Band). They start hidden; turn Eye on, fill content, save order — appears live.
4. **Custom page** — Neue Seite → type title → Web-Adresse auto-fills (editable) → publish `/seite/…`.
5. **Nav page picker** — Navigation → pick a page from the dropdown (no typing `/shop`) → Save → live link works. Same for Footer links.
6. **Nav hide** — Navigation → «Auf Website anzeigen» off → item stays in CMS, hidden live.



## Screenshot / document fixes

1. **Footer CTA icons** — phone / mail / WhatsApp between headline and buttons.
2. **Footer brand** — Linvara AG + Kostümschneiderei; Instagram/Facebook hidden when empty.
3. **Footer contact editable** — Admin → Navigation → Footer fields.
4. **No breadcrumb text on Katalog hero** — illustrated banners without Start › Shop overlay.
5. **Katalog images** — grid shows full costume (`object-contain`), not cropped.
5b. **Square costume photos** — Home marquee, Galerie preview, Galerie grid, Atelier slider: square frames + full image visible (not cropped landscape).
6. **Katalog wording** — «Alle Angebote» / Angebot ansehen (not Produkt-buy language).
7. **CMS headings** — show editing «Unsere Produkte» / categories texts in Shop page CMS.
8. **Termin form labels** — step 4 shows Name / E-Mail / Telefon / Nachricht labels.
9. **Termin success** — «Buchungsanfrage erhalten» (not «bestätigt»).
10. **Time Slots** — Termin page Hochsaison band + CMS toggle to hide off-season; nav/service «Time Slots».
11. **Time slots editable** — Admin → Termin → timetables + walk-in text.
12. **Block times** — CRM → Termine → create block → show booking rejected in that window.
13. **Service duration** — Appointment type duration (10 vs 60) in CMS + shown in booking.
14. **Impressum** — empty owner/title hides lines; Additional sections add/remove text blocks.
15. **Team** — no broken icon when none; only «Unser Team» (no wrong subtitle).
16. **Logo** — Linvara AG larger under brand.
17. **Massfertigung** — Präzision block removed; title without «Vertrauliche».
18. **Massblatt (portal)** — title Massblatt; no Aktuelles Projekt/Kategorie; no letter badges; submit with partial fields; labels match her Massformular PDF (Kopfumfang, Halsumfang, Bundumfang…).
19. **Massblatt PDF protected** — `/massfertigung` has NO public PDF buttons (only Kundenbereich link). Login → Massblatt → PDF downloads work. Direct `/documents/massblatt.pdf` must 404.
20. **Dashed mistake** — cleaner section borders (no wrong dashed stitch line on contact band).



## Portal / CRM professional

1. **Kundenbereich** — find in header → login → Massblatt (same DE labels as PDF).
2. **CRM dashboard** — Anfragen, Termine, Kunden, Projekte.
3. **CRM Termine** — list requests, confirm/cancel, block calendar with help text.
4. **CRM Masse** — project Masse labels match PDF wording (letter + DE title).
5. **Business email** — enquiry From/notify info@ (show if available).



## Responsive

1. Home, Katalog, Kontakt, Termin, portal at mobile width.



## Close

“Please review now — everything from your document and message is covered on our side first. Favicon later as noted.”

---



## Left on our / her end (say this in the video)

Do **not** pretend these are finished in code alone:

### You (Moiz) before go-live

- Deploy + `prisma db push` on VPS (so Massblatt PDFs + label updates are live)
- Hostinger **SMTP password** for `info@kostuem-schneiderei.ch` in VPS `.env`
- Confirm Admin Settings contact = info@
- Favicon later

### Lani and Moiz Updates

- Rename nav **Shop → Katalog** if still old in saved nav
- Edit Katalog headings (“Unsere Produkte” etc.) under Pages → Katalog
- Footer contact / brand / empty social URLs under Navigation → Footer
- Impressum: remove unused lines & extra sections she crossed out
- Termin: set service **durations**, edit Time Slots text/times, toggle Time Slots off off-season
- CRM → Termine: enter her real **blocked times**
- Team photos / none icons; any other text she still wants changed
- Confirm the two Massformular PDFs in Kundenbereich (not public) are the versions she wants; replace files in `private/documents/` when freelancer delivers new fillable forms

