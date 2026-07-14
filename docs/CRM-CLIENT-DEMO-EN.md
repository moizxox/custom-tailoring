# Kostümschneiderei Lani — CRM & Customer Portal Demo Guide (English)

> **For internal use:** This file is your script for the client demo video. Film scene by scene — login credentials, what to show, and what to say are all below.
>
> **Prerequisite:** Run `pnpm dev` (not `dev:next` — otherwise no real-time chat). Database: `pnpm db:push && pnpm db:seed` if test data is missing.
>
> **German version:** [CRM-CLIENT-DEMO.md](./CRM-CLIENT-DEMO.md)

---

## Quick Overview — What Was Built?

| Area | Status | Description |
|------|--------|-------------|
| **Website contact form** | ✅ Done | Submissions saved to DB + email to atelier + auto-reply to customer |
| **Admin CRM** | ✅ Done | Customers, groups, projects, tasks, files, measurements — all manageable |
| **Contact submissions inbox** | ✅ Done | Admin sees all form submissions, one-click create customer + project |
| **Customer emails** | ✅ Done | Send access code & magic link directly from CRM via Resend |
| **Customer portal** | ✅ Done | Login, dashboard, projects, measurement sheet, messages, files |
| **Real-time chat** | ✅ Done | Admin ↔ customer live (Socket.io), internal admin notes |
| **Notifications** | ✅ Done | Bell in admin header + customer notifications in portal |
| **Group orders** | ✅ Done | Guggenmusik/teams — group leaders see group projects in portal |
| **Self-registration** | ✅ Done | Customer can create account, verify email, receive access code |
| **Magic-link login** | ✅ Done | One-time email link — customer clicks and is logged in |

---

## Test Credentials

### Admin CMS (`/admin/login`)

| Email | Password | Role |
|-------|----------|------|
| `test.admin@lani.ch` | `Test@123` | Admin (recommended for demo) |
| `mainmoiz899@gmail.com` | `Admin@123` | Admin |

### Customer portal (`/kundenbereich/login`)

| Email | Access code | Demo scenario |
|-------|-------------|---------------|
| `sarah.neu@example.com` | `NEUKUNDE1` | New order — status: request received |
| `peter.waggis@example.com` | `PETER001` | Fill measurement sheet — status: measurements pending |
| `max.muster@example.com` | `DEMO2026` | Active project + chat — status: in production |
| `anna.beispiel@example.com` | `ANNA2026` | **Group leader** — sees group project |
| `hans.mueller@example.com` | `HANS8765` | Group member — own measurements pending |

---

## Demo Video — Recommended Order (approx. 12–18 min)

### Scene 1 — Introduction (30 sec)

**Show:** Homepage `https://lani-kostumschneiderei.ch` (local: `http://localhost:3000`)

**Say:**
> "We've built a complete CRM system with customer portal and real-time communication for Kostümschneiderei Lani. I'll walk you through the full flow — from contact request to completed order."

---

### Scene 2 — Customer submits contact form (1–2 min)

**URL:** `/kontakt`

**Show:**
1. Fill out the form (name, email, phone, location, message)
2. Submit → success message
3. *(Optional)* Email inbox: auto-reply to customer + notification to atelier

**Say:**
> "When someone fills out the contact form, the request is automatically saved to the database. The customer gets an immediate confirmation email, and the atelier is notified."

---

### Scene 3 — Admin: contact submissions inbox (2 min)

**URL:** `/admin/login` → log in → sidebar **CRM → Anfragen** (Submissions)

**Show:**
1. List of contact submissions (badge "New" on unread)
2. Open a submission → read contact details + message
3. Click **"Kunde + Projekt anlegen"** (Create customer + project)
4. Optional: keep "Send access code by email" enabled
5. Link to the newly created customer and project

**Say:**
> "In the admin area, you see all incoming requests at a glance. With one click, you convert a request into a customer and project — the access code is sent automatically by email. No more manual copy-paste."

---

### Scene 4 — Admin CRM dashboard (1 min)

**URL:** `/admin/crm`

**Show:**
- Stat cards: customers, groups, projects, unread messages, new submissions
- Urgent projects
- Quick-action buttons

**Say:**
> "The CRM dashboard gives you a live overview of all customers, projects, and open requests."

---

### Scene 5 — Customer management + email (2 min)

**URL:** `/admin/crm/customers`

**Show:**
1. Customer list with search and filters
2. Copy access code (copy button)
3. Email icon → send access code
4. Open customer detail:
   - **Code senden** (Send code) — access code by email
   - **Magic-Link** — one-time login link by email (valid 72h)
   - **Neu generieren** (Regenerate) — generate new code

**Say:**
> "For every customer, you have the access code right at hand. You can copy it, send it by email, or send a magic link — the customer clicks once and is logged into the portal."

---

### Scene 6 — Manage a project (3 min)

**URL:** `/admin/crm/projects` → open a project (e.g. `demo-project-001`)

**Show all 5 tabs:**

| Tab | What to show |
|-----|--------------|
| **Übersicht** (Overview) | Customer status (visible to customer) + internal production status (admin only) |
| **Nachrichten** (Messages) | Real-time chat with customer + **internal notes** (admin only) |
| **Tasks** | Create tasks per project, priority, due date |
| **Dateien** (Files) | Upload quotes, invoices, photos, designs (categories) |
| **Masse** (Measurements) | Edit measurement sheet per customer/group member |

**Change status** (Overview tab):
- Set customer status to e.g. "Massnahme ausstehend" (measurements pending) → customer is notified in portal

**Say:**
> "Each project has five areas: overview with dual status system, live chat, tasks, files, and measurements. Internal notes in chat are only visible to the atelier — the customer never sees them."

---

### Scene 7 — Demonstrate real-time chat live (2–3 min)

**Two browser windows side by side:**

| Window 1 | Window 2 |
|----------|----------|
| Admin: Project → **Nachrichten** tab | Customer: `/kundenbereich/login` as `max.muster@example.com` / `DEMO2026` |

**Show:**
1. Customer sends message → appears **instantly** for admin (no page reload)
2. Admin replies → appears **instantly** for customer
3. Admin writes **internal note** (lock icon) → only visible in admin
4. Admin bell top-right → notification "Neue Kundennachricht" (new customer message)

**Say:**
> "Communication runs in real time — like WhatsApp, but directly inside the project. When the customer writes, you get an instant notification. Internal team notes stay invisible to the customer."

---

### Scene 8 — Customer portal (2–3 min)

**URL:** `/kundenbereich/login` → `max.muster@example.com` / `DEMO2026`

**Show:**
1. **Dashboard** — welcome, project list, quick actions
2. **Open project** — status timeline, files, messages tab
3. **Measurement sheet** (`/kundenbereich/massblatt`) — enter & save measurements
4. **Messages** (`/kundenbereich/nachrichten`) — all project chats, unread counters

**Say:**
> "The customer logs in with email and personal code. They see their project status, can enter measurements, view files, and chat directly with the atelier."

---

### Scene 9 — Group order (2 min)

**Admin:** `/admin/crm/groups` → open a group (e.g. "Fasnacht 2026")

**Portal:** Log in as `anna.beispiel@example.com` / `ANNA2026`

**Show:**
1. Anna (group leader) sees the **group project** in the portal (not just her own individual projects)
2. Admin: group members, measurement status per member
3. Group project in admin with measurements per member

**Say:**
> "For Guggenmusik and teams: the group leader sees the shared group project in the portal. In admin, you manage all members and their measurements centrally."

---

### Scene 10 — Self-registration (1–2 min)

**URL:** `/kundenbereich/register`

**Show:**
1. Form: name, email, phone, optional password
2. Click "Registrieren" (Register) → "Email sent" confirmation
3. *(With Resend configured)* Click verification link in email
4. Automatic login → dashboard
5. Access code arrives via welcome email

**Say:**
> "Customers can also register themselves. After email confirmation, they automatically receive their access code. Optionally, they can also log in with a password."

---

### Scene 11 — Magic link (30 sec)

**Admin:** Customer detail → click **Magic-Link**

**Customer:** Open email → click link → `/kundenbereich/zugang/[token]` → logged in directly

**Say:**
> "As an alternative to the access code: a magic link by email — one click and the customer is in. No need to remember a code."

---

### Scene 12 — Closing (30 sec)

**Say:**
> "In summary: contact request → CRM inbox → create customer → send access code → customer in portal → measurements, chat, files in real time → group orders — everything from one system. The atelier has full control; the customer only sees what's relevant to them."

---

## Complete End-to-End Workflow

```
Customer fills out /kontakt
        ↓
Request lands in Admin → CRM → Anfragen (Submissions)
        ↓
Admin: "Create customer + project" (+ email with access code)
        ↓
Customer logs in at /kundenbereich/login
        ↓
Admin sets status → "Measurements pending"
        ↓
Customer fills out measurement sheet
        ↓
Admin + customer chat live (real time)
        ↓
Admin uploads quote/invoice → customer sees file in portal
        ↓
Admin changes status → "In production" → "Ready for pickup" → "Completed"
        ↓
Customer is notified at every step
```

---

## Admin Area — All CRM Pages

| Page | URL | Function |
|------|-----|----------|
| CRM Dashboard | `/admin/crm` | Overview, statistics, quick access |
| Submissions | `/admin/crm/submissions` | Contact form inbox, conversion |
| Customers | `/admin/crm/customers` | CRUD, access code, email, magic link |
| Groups | `/admin/crm/groups` | Guggenmusik/teams, members |
| Projects | `/admin/crm/projects` | All orders with filters |
| Project detail | `/admin/crm/projects/[id]` | 5 tabs: overview, chat, tasks, files, measurements |
| Notifications | `/admin/crm/notifications` | All admin notifications |
| Global search | Sidebar search field | Search customers, groups, projects |

---

## Customer Portal — All Pages

| Page | URL | Function |
|------|-----|----------|
| Login | `/kundenbereich/login` | Email + access code (or password) |
| Register | `/kundenbereich/register` | Self-registration + email verification |
| Dashboard | `/kundenbereich` | Projects, quick actions |
| Project | `/kundenbereich/projekt/[id]` | Status, files, chat |
| Measurement sheet | `/kundenbereich/massblatt` | Enter measurements |
| Messages | `/kundenbereich/nachrichten` | All project chats |
| Magic link | `/kundenbereich/zugang/[token]` | Auto-login via email link |
| Email verification | `/kundenbereich/verify/[token]` | Activate account after registration |

---

## Project Status (Customer View)

| Status (German UI) | Meaning |
|--------------------|---------|
| Anfrage eingegangen | Contact received, still in planning |
| Beratung geplant | Consultation scheduled |
| Design bestätigt | Costume design approved by customer |
| Massnahme ausstehend | Customer should fill measurement sheet |
| In Produktion | Sewing in progress |
| Anprobe geplant | Fitting appointment scheduled |
| Anpassungen | Alterations |
| Abholbereit | Costume ready for pickup |
| Abgeschlossen | Order completed |

---

## Technical Notes (for developers / not for client video)

- **Dev server:** `pnpm dev` (custom `server.ts` with Socket.io)
- **Without chat:** `pnpm dev:next` — static tests only, no real-time
- **Database:** `pnpm db:push` + `pnpm db:seed`
- **Emails:** `RESEND_API_KEY` + `RESEND_FROM_EMAIL` required in `.env.local`
- **Magic links / verification:** `NEXT_PUBLIC_APP_URL` must point to the correct domain
- **Deployment:** Socket.io needs VPS/Railway/Render — not pure Vercel serverless

---

## Pre-Filming Checklist

- [ ] `pnpm dev` is running
- [ ] `pnpm db:seed` executed (test data present)
- [ ] Admin login works (`test.admin@lani.ch` / `Test@123`)
- [ ] Two browser windows ready (admin + customer) for chat demo
- [ ] Resend configured (for email demo) — or skip scenes 2/5/10/11
- [ ] Screen recording software ready (QuickTime, OBS, Loom, etc.)

---

## Optional Short Version (5 min)

If the client has limited time, film only these 5 scenes:

1. **Contact form** submission (Scene 2)
2. **Admin: submission → create customer** (Scene 3)
3. **Project detail with chat** — two windows live (Scene 7)
4. **Customer portal** dashboard + measurement sheet (Scene 8)
5. **Closing** — summary of what's done (Scene 12)

---

*Last updated: July 2026 — Phase 1 (CRM MVP) + Phase 2 (workflow automation) fully implemented.*
