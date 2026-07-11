# CRM System — Poora Flow Samjhao (Hinglish) 🇮🇳

> Yeh file tumhare liye hai — client ko samjhane se pehle khud samajh lo.
> Simple language mein, step by step.

---

## Pehle Basic Samjho — 3 Log Hain System Mein

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  1. WEBSITE     │     │  2. ADMIN       │     │  3. CUSTOMER    │
│  (Public)       │     │  (Lani team)    │     │  (Portal)       │
│                 │     │                 │     │                 │
│  Contact form   │────▶│  CRM Dashboard  │────▶│  Login + Code   │
│  /kontakt       │     │  /admin/crm     │     │  /kundenbereich │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

| Kaun? | Kahan jaata hai? | Kya karta hai? |
|-------|------------------|----------------|
| **Naya customer** | Website `/kontakt` | Form bharta hai — "mujhe costume chahiye" |
| **Lani admin** | `/admin/login` | Sab manage karta hai — customers, projects, chat |
| **Purana customer** | `/kundenbereich/login` | Apna project dekhta hai, measurements bharta hai, chat karta hai |

---

## Poora Flow — Ek Line Mein

```
Customer form bharta hai
    → Admin ko inbox mein dikhta hai
    → Admin 1 click mein customer + project banata hai
    → Customer ko email mein ACCESS CODE aata hai
    → Customer portal mein login karta hai
    → Measurements bharta hai, chat karta hai
    → Admin status update karta hai ("in production", "ready", etc.)
    → Customer har step pe notify hota hai
```

---

## Step by Step — Detail Mein

### STEP 1: Customer Website Pe Aata Hai

**Kya hota hai:**
- Customer website pe `/kontakt` page pe jaata hai
- Apna naam, email, phone, message likhta hai
- Submit karta hai

**System kya karta hai (background mein):**
1. ✅ Database mein save hota hai (`ContactSubmission` table)
2. 📧 Lani ko email jaati hai — "naya customer aaya hai"
3. 📧 Customer ko auto-reply jaati hai — "humne aapki request receive kar li"

**Email abhi kyun nahi ja rahi?**
- Tumhare `.env.local` mein `RESEND_API_KEY=REPLACE_WITH_YOUR_RESEND_KEY` hai — matlab fake/empty hai
- **Fix:** Neeche SMTP section dekho — Gmail creds daalo, emails chal jayengi

---

### STEP 2: Admin Inbox Mein Dekhta Hai

**Admin kahan jaata hai:**
```
/admin/login  →  login karo  →  Sidebar mein "CRM"  →  "Anfragen" (Submissions)
```

**URL:** `/admin/crm/submissions`

**Kya dikhta hai:**
- Saari contact form requests ki list
- "Neu" (New) badge un read wali pe
- Click karo → poori details — naam, email, message

**Admin kya karta hai:**
- Button dabata hai: **"Kunde + Projekt anlegen"** (Customer + Project create karo)
- System automatically:
  - Naya customer account banata hai
  - Uske liye project banata hai
  - Access code generate karta hai (jaise `DEMO2026`)
  - Email bhejta hai customer ko code ke saath

**Yeh pehle manually hota tha — ab 1 click mein ho jaata hai.**

---

### STEP 3: Customer Ko Access Code Milta Hai

**2 tareeqe hain customer ko code dena:**

| Tareeqa | Kaise? |
|---------|--------|
| **Email** | Admin "Code senden" button dabata hai → email jaati hai |
| **Manual** | Admin CRM mein code copy karta hai → WhatsApp/phone pe bhejta hai |

**Customer portal login:**
```
URL: /kundenbereich/login
Email: customer@example.com
Code: DEMO2026  (8 character code)
```

---

### STEP 4: Customer Portal Mein Kya Karta Hai

Login ke baad customer yeh dekh sakta hai:

| Page | URL | Kya karta hai |
|------|-----|---------------|
| **Dashboard** | `/kundenbereich` | Apne projects ki list |
| **Project detail** | `/kundenbereich/projekt/[id]` | Status, files, chat |
| **Massblatt** | `/kundenbereich/massblatt` | Apne measurements (size) bharta hai |
| **Nachrichten** | `/kundenbereich/nachrichten` | Saare project chats |

**Customer NAHI dekh sakta:**
- Internal admin notes
- Internal production status
- Doosre customers ke projects

---

### STEP 5: Admin Project Manage Karta Hai

**URL:** `/admin/crm/projects` → koi project kholo

**5 Tabs hain:**

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  Übersicht  │  Nachrichten│    Tasks    │   Dateien   │    Masse    │
│  (Overview) │  (Messages) │  (Tasks)    │   (Files)   │(Measurements)│
├─────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ 2 statuses: │ Live chat   │ To-do list  │ Upload PDFs │ Edit sizes  │
│ - Customer  │ with        │ for team    │ photos      │ per member  │
│   status    │ customer    │             │ invoices    │             │
│ - Internal  │ + internal  │             │             │             │
│   status    │ notes       │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

**Status change example:**
1. Admin status set karta hai → "Massnahme ausstehend" (measurements pending)
2. Customer portal mein notification aati hai
3. Customer massblatt bharta hai
4. Admin status change karta hai → "In Produktion" (in production)
5. ...eventually → "Abholbereit" (ready for pickup)

---

### STEP 6: Real-Time Chat (Sabse Cool Feature)

**Kaise kaam karta hai:**
- Admin project ke Messages tab mein hai
- Customer apne portal mein project khol ke message likhta hai
- **Bina page reload ke** dono ko message dikhta hai (Socket.io — jaise WhatsApp)

**Internal notes:**
- Admin chat mein 🔒 lock icon se "internal note" likh sakta hai
- Yeh SIRF admin team ko dikhta hai — customer ko KABHI nahi

**Test karne ke liye:**
- 2 browser windows kholo side by side
- Window 1: Admin logged in
- Window 2: Customer logged in (`max.muster@example.com` / `DEMO2026`)
- Ek mein message likho → doosre mein turant dikhega

**⚠️ Important:** `pnpm dev` chalao (NOT `pnpm dev:next`) — warna chat nahi chalega

---

### STEP 7: Group Orders (Guggenmusik / Cliquen)

**Scenario:** 20 log ek saath costume order karte hain (jaise Fasnacht group)

**Admin:**
1. `/admin/crm/groups` → group banata hai
2. Members add karta hai (har member = 1 customer)
3. 1 group project banata hai

**Group leader (Anna):**
- Login: `anna.beispiel@example.com` / `ANNA2026`
- Portal mein **poora group project** dikhta hai
- Chat kar sakti hai atelier se

**Regular member (Hans):**
- Login: `hans.mueller@example.com` / `HANS8765`
- Apna massblatt bharta hai
- Group project bhi dekh sakta hai

---

## Email System — Kaise Setup Karein?

### Abhi kya problem hai?

Tumhare `.env.local` mein:
```
RESEND_API_KEY=REPLACE_WITH_YOUR_RESEND_KEY   ← yeh FAKE hai, kaam nahi karega
```

Isliye jab bhi system email bhejne ki koshish karta hai → **kuch nahi jaata**, sirf console mein warning aati hai.

### Kaunsi emails jaati hain system se?

| Kab? | Kisko? | Kya? |
|------|--------|------|
| Contact form submit | Lani (business) | "Naya customer aaya" |
| Contact form submit | Customer | "Humne receive kar liya" |
| Admin converts submission | Customer | Access code |
| Admin clicks "Code senden" | Customer | Access code |
| Admin clicks "Magic-Link" | Customer | One-click login link |
| Customer self-registers | Customer | Email verification link |
| After verification | Customer | Welcome + access code |
| Admin forgot password | Admin | Reset link |

### Fix: Nodemailer / Gmail SMTP (Testing Ke Liye)

Ab maine code update kar diya hai — **Nodemailer support add ho gaya**. Gmail creds daalo, emails chal jayengi.

**Apne `.env.local` mein yeh add karo** (already configured if using gyromaster55@gmail.com):

```env
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=465
NODEMAILER_SECURE=true
NODEMAILER_USER=your@gmail.com
NODEMAILER_PASSWORD=your-app-password-no-spaces
NODEMAILER_FROM="Your Name <your@gmail.com>"
CONTACT_NOTIFICATION_EMAIL=your@gmail.com
```

**Test email bhejne ke liye:**
```bash
pnpm exec dotenv -e .env.local -- tsx scripts/test-email.ts
```

### Gmail App Password kaise banayein?

1. Google Account → Security
2. "2-Step Verification" ON karo (agar nahi hai)
3. Search karo "App passwords"
4. App name: "Lani CRM" → Generate
5. 16 character password milega — woh `SMTP_PASS` mein daalo (spaces hata do)

### Priority (kaunsa use hoga):

```
SMTP configured?  →  Nodemailer use hoga  ✅ (testing)
     ↓ nahi
Resend configured?  →  Resend use hoga  ✅ (production)
     ↓ nahi
Kuch nahi?  →  Console mein log hoga, email NAHI jayegi  ❌
```

---

## Test Accounts (Demo Ke Liye)

### Admin Login — `/admin/login`
```
Email:    test.admin@lani.ch
Password: Test@123
```

### Customer Portal — `/kundenbereich/login`

| Email | Code | Use case |
|-------|------|----------|
| `max.muster@example.com` | `DEMO2026` | Chat demo — project in production |
| `sarah.neu@example.com` | `NEUKUNDE1` | New customer — just submitted |
| `peter.waggis@example.com` | `PETER001` | Needs to fill measurements |
| `anna.beispiel@example.com` | `ANNA2026` | Group leader demo |
| `hans.mueller@example.com` | `HANS8765` | Group member |

---

## Demo Video Kaise Banayein — Simple 5 Steps

```
1. Contact form bharo (/kontakt)
       ↓
2. Admin login → Anfragen → "Kunde + Projekt anlegen"
       ↓
3. 2 browsers: Admin chat + Customer chat (live dikhao)
       ↓
4. Customer portal: dashboard, massblatt, project
       ↓
5. Bol do: "sab ek system mein — contact se lekar delivery tak"
```

**Server:** `pnpm dev` chalao pehle
**Test data:** `pnpm db:seed` (agar accounts nahi hain)

---

## Common Confusion — FAQ

### "Resend kya hai? Nodemailer kya hai?"
- **Resend** = paid email service (production ke liye, domain verify karna padta hai)
- **Nodemailer** = free, Gmail/Outlook se email bhejta hai (testing ke liye perfect)
- Ab dono supported hain — SMTP pehle try karta hai

### "Access code kya hai?"
- 8 character code jaise `DEMO2026`
- Har customer ka unique hota hai
- Portal login ke liye password ki jagah use hota hai
- Customer apna email + code daal ke login karta hai

### "Magic link kya hai?"
- Admin customer ko email bhejta hai
- Customer link click karta hai → seedha login ho jaata hai, code type karne ki zaroorat nahi

### "Socket.io kya hai?"
- Real-time chat ke liye
- Bina page reload ke messages aate hain
- `pnpm dev` se chalta hai (custom server)
- `pnpm dev:next` se NAHI chalega

### "Database kahan hai?"
- Neon PostgreSQL (cloud)
- `pnpm db:push` = schema sync
- `pnpm db:seed` = test data daalo

---

## Mujhe Email Creds Dene Hain — Kya Bhejun?

Mujhe yeh bhejo (chat mein ya directly `.env.local` mein daal do):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=???
SMTP_PASS=???   (Gmail App Password, NOT normal password)
SMTP_FROM=???
CONTACT_NOTIFICATION_EMAIL=???  (jahan contact form alerts aayen)
```

Main `.env.local` update kar dunga aur test kar ke confirm kar dunga ke emails ja rahi hain.

---

## Files Reference

| File | Kya hai |
|------|---------|
| `docs/CRM-FLOW-HINGLISH.md` | Yeh file — flow samjhao |
| `docs/CRM-CLIENT-DEMO.md` | German demo script (client ke liye) |
| `docs/CRM-CLIENT-DEMO-EN.md` | English demo script |
| `src/lib/email/send.ts` | Email sender (Nodemailer + Resend) |
| `.env.local` | Tumhari secrets (gitignore mein hai) |
| `.env.example` | Template — kya variables chahiye |

---

*Last updated: July 2026*
