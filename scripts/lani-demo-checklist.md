# Video demo checklist for Lani (~8–12 min)

Record one continuous walkthrough. Show **each** point before asking for her final UX review.

1. **QC mindset** — “We completed internal QC before this review.”
2. **Nav hide** — Admin → Navigation → uncheck «Auf Website anzeigen» → hard refresh public site → item gone from nav but still in CMS.
3. **Create page** — Admin → Pages → Neue Seite → publish → open `/seite/…` → Navigation → add link to that path.
4. **Sections / empty pages** — Open previously empty or mis-ordered pages; confirm sections appear on the correct route.
5. **Kundenbereich** — Header «Kundenbereich» + nav/footer → login/register → Massblatt.
6. **Katalog images** — `/shop` grid + product detail: full image visible with `object-contain` (not cropped).
7. **Katalog naming** — Nav/title say Katalog; `/katalog` redirects to `/shop`; product → inline enquiry form (no “buy” wording).
8. **Business email** — Submit enquiry → show notification to `info@kostuem-schneiderei.ch` / From is business address (email header screenshot).
9. **Measurement form** — Massfertigung: PDF download when file is at `public/documents/massblatt.pdf` (or placeholder note) + portal Massblatt submit → appears in CRM.
10. **CRM Masse translations** — Project Masse tab / CRM labels say **Masse** (not «Massnahme»).
11. **CMS live publish** — Change a headline in admin → hard refresh public page → change visible immediately.
12. **Responsive** — Home, Katalog, Kontakt, portal at mobile width.

End with: “Please do your final UX review now; everything on your list has been checked on our side first.”
