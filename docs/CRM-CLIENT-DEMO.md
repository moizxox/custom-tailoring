# Kostümschneiderei Lani — CRM & Kundenportal Demo-Leitfaden

> **Für intern:** Diese Datei ist dein Skript für das Client-Demo-Video. Szene für Szene abfilmen — unten stehen Login-Daten, was zu zeigen ist und was du dazu sagen kannst.
>
> **English version:** [CRM-CLIENT-DEMO-EN.md](./CRM-CLIENT-DEMO-EN.md)
>
> **Voraussetzung:** `pnpm dev` starten (nicht `dev:next` — sonst kein Echtzeit-Chat). Datenbank: `pnpm db:push && pnpm db:seed` falls Testdaten fehlen.

---

## Kurzüberblick — Was wurde gebaut?

| Bereich | Status | Beschreibung |
|---------|--------|--------------|
| **Website Kontaktformular** | ✅ Fertig | Anfragen werden in DB gespeichert + E-Mail an Atelier + Auto-Antwort an Kunde |
| **Admin CRM** | ✅ Fertig | Kunden, Gruppen, Projekte, Aufgaben, Dateien, Masse — alles verwaltbar |
| **Kontaktanfragen-Inbox** | ✅ Fertig | Admin sieht alle Formular-Anfragen, kann mit 1 Klick Kunde + Projekt anlegen |
| **E-Mail an Kunden** | ✅ Fertig | Zugangscode & Magic-Link direkt aus dem CRM per Resend senden |
| **Kundenportal** | ✅ Fertig | Login, Dashboard, Projekte, Massblatt, Nachrichten, Dateien |
| **Echtzeit-Chat** | ✅ Fertig | Admin ↔ Kunde live (Socket.io), interne Admin-Notizen |
| **Benachrichtigungen** | ✅ Fertig | Glocke im Admin-Header + Kunden-Benachrichtigungen im Portal |
| **Gruppenbestellungen** | ✅ Fertig | Guggenmusik/Cliquen — Gruppenleiter sehen Gruppenprojekte im Portal |
| **Selbstregistrierung** | ✅ Fertig | Kunde kann Konto erstellen, E-Mail bestätigen, Zugangscode erhalten |
| **Magic-Link Login** | ✅ Fertig | Einmal-Link per E-Mail — Kunde klickt und ist eingeloggt |

---

## Test-Zugangsdaten

### Admin CMS (`/admin/login`)

| E-Mail | Passwort | Rolle |
|--------|----------|-------|
| `test.admin@lani.ch` | `Test@123` | Admin (empfohlen für Demo) |
| `mainmoiz899@gmail.com` | `Admin@123` | Admin |

### Kundenportal (`/kundenbereich/login`)

| E-Mail | Zugangscode | Demo-Szenario |
|--------|-------------|---------------|
| `sarah.neu@example.com` | `NEUKUNDE1` | Neuer Auftrag — Status: Anfrage eingegangen |
| `peter.waggis@example.com` | `PETER001` | Massblatt ausfüllen — Status: Masse ausstehend |
| `max.muster@example.com` | `DEMO2026` | Aktives Projekt + Chat — Status: In Produktion |
| `anna.beispiel@example.com` | `ANNA2026` | **Gruppenleiterin** — sieht Gruppenprojekt |
| `hans.mueller@example.com` | `HANS8765` | Gruppenmitglied — eigene Masse ausstehend |

---

## Demo-Video — Empfohlene Reihenfolge (ca. 12–18 Min.)

### Szene 1 — Einleitung (30 Sek.)

**Zeigen:** Startseite `https://lani-kostumschneiderei.ch` (lokal: `http://localhost:3000`)

**Sagen:**
> „Wir haben ein vollständiges CRM-System mit Kundenportal und Echtzeit-Kommunikation für Kostümschneiderei Lani gebaut. Ich zeige Ihnen den kompletten Ablauf — von der Kontaktanfrage bis zur fertigen Bestellung."

---

### Szene 2 — Kunde sendet Kontaktanfrage (1–2 Min.)

**URL:** `/kontakt`

**Zeigen:**
1. Formular ausfüllen (Name, E-Mail, Telefon, Standort, Nachricht)
2. Absenden → Erfolgsmeldung
3. *(Optional)* E-Mail-Postfach: Auto-Antwort an Kunde + Benachrichtigung an Atelier

**Sagen:**
> „Wenn ein Interessent das Kontaktformular ausfüllt, wird die Anfrage automatisch in der Datenbank gespeichert. Der Kunde erhält sofort eine Bestätigungs-E-Mail, und das Atelier wird benachrichtigt."

---

### Szene 3 — Admin: Kontaktanfragen-Inbox (2 Min.)

**URL:** `/admin/login` → einloggen → Sidebar **CRM → Anfragen**

**Zeigen:**
1. Liste der Kontaktanfragen (Badge „Neu" bei ungelesenen)
2. Anfrage öffnen → Kontaktdaten + Nachricht lesen
3. **„Kunde + Projekt anlegen"** klicken
4. Optional: „Zugangscode per E-Mail senden" aktiviert lassen
5. Link zum neu erstellten Kunden und Projekt

**Sagen:**
> „Im Admin-Bereich sehen Sie alle eingehenden Anfragen auf einen Blick. Mit einem Klick wandeln Sie eine Anfrage in einen Kunden und ein Projekt um — der Zugangscode wird automatisch per E-Mail verschickt. Kein manuelles Kopieren mehr."

---

### Szene 4 — Admin CRM Dashboard (1 Min.)

**URL:** `/admin/crm`

**Zeigen:**
- Statistik-Karten: Kunden, Gruppen, Projekte, ungelesene Nachrichten, neue Anfragen
- Dringende Projekte
- Schnellzugriff-Buttons

**Sagen:**
> „Das CRM-Dashboard gibt Ihnen eine Live-Übersicht über alle Kunden, Projekte und offene Anfragen."

---

### Szene 5 — Kundenverwaltung + E-Mail (2 Min.)

**URL:** `/admin/crm/customers`

**Zeigen:**
1. Kundenliste mit Suche und Filter
2. Zugangscode kopieren (Kopier-Button)
3. E-Mail-Symbol → Zugangscode senden
4. Kundendetail öffnen:
   - **Code senden** — Zugangscode per E-Mail
   - **Magic-Link** — Einmal-Login-Link per E-Mail (72h gültig)
   - **Neu generieren** — neuen Code erzeugen

**Sagen:**
> „Für jeden Kunden haben Sie den Zugangscode direkt zur Hand. Sie können ihn kopieren, per E-Mail senden oder einen Magic-Link schicken — der Kunde klickt einmal und ist im Portal eingeloggt."

---

### Szene 6 — Projekt verwalten (3 Min.)

**URL:** `/admin/crm/projects` → Projekt öffnen (z.B. `demo-project-001`)

**Zeigen alle 5 Tabs:**

| Tab | Was zeigen |
|-----|------------|
| **Übersicht** | Kundenstatus (sichtbar für Kunde) + interner Produktionsstatus (nur Admin) |
| **Nachrichten** | Echtzeit-Chat mit Kunde + **interne Notizen** (nur Admin sieht diese) |
| **Tasks** | Aufgaben pro Projekt anlegen, Priorität, Fälligkeit |
| **Dateien** | Angebote, Rechnungen, Fotos, Designs hochladen (Kategorien) |
| **Masse** | Massblatt pro Kunde/Gruppenmitglied bearbeiten |

**Status ändern** (Übersicht-Tab):
- Kundenstatus z.B. auf „Massnahme ausstehend" setzen → Kunde wird im Portal benachrichtigt

**Sagen:**
> „Jedes Projekt hat fünf Bereiche: Übersicht mit doppeltem Status-System, Live-Chat, Aufgaben, Dateien und Masse. Interne Notizen im Chat sind nur für das Atelier sichtbar — der Kunde sieht sie nie."

---

### Szene 7 — Echtzeit-Chat live demonstrieren (2–3 Min.)

**Zwei Browser-Fenster nebeneinander:**

| Fenster 1 | Fenster 2 |
|-----------|-----------|
| Admin: Projekt → Tab **Nachrichten** | Kunde: `/kundenbereich/login` als `max.muster@example.com` / `DEMO2026` |

**Zeigen:**
1. Kunde schreibt Nachricht → erscheint **sofort** beim Admin (ohne Seite neu laden)
2. Admin antwortet → erscheint **sofort** beim Kunden
3. Admin schreibt **interne Notiz** (Schloss-Symbol) → nur im Admin sichtbar
4. Admin-Glocke oben rechts → Benachrichtigung „Neue Kundennachricht"

**Sagen:**
> „Die Kommunikation läuft in Echtzeit — wie WhatsApp, aber direkt im Projekt. Wenn der Kunde schreibt, bekommen Sie sofort eine Benachrichtigung. Interne Notizen für das Team bleiben für den Kunden unsichtbar."

---

### Szene 8 — Kundenportal (2–3 Min.)

**URL:** `/kundenbereich/login` → `max.muster@example.com` / `DEMO2026`

**Zeigen:**
1. **Dashboard** — Willkommen, Projektliste, Schnellaktionen
2. **Projekt öffnen** — Status-Timeline, Dateien, Nachrichten-Tab
3. **Massblatt** (`/kundenbereich/massblatt`) — Masse eingeben & speichern
4. **Nachrichten** (`/kundenbereich/nachrichten`) — alle Projekt-Chats, ungelesene Zähler

**Sagen:**
> „Der Kunde loggt sich mit E-Mail und persönlichem Code ein. Er sieht seinen Projektstatus, kann Masse eingeben, Dateien ansehen und direkt mit dem Atelier chatten."

---

### Szene 9 — Gruppenbestellung (2 Min.)

**Admin:** `/admin/crm/groups` → Gruppe anzeigen (z.B. „Fasnacht 2026")

**Portal:** Login als `anna.beispiel@example.com` / `ANNA2026`

**Zeigen:**
1. Anna (Gruppenleiterin) sieht das **Gruppenprojekt** im Portal (nicht nur eigene Einzelprojekte)
2. Admin: Gruppenmitglieder, Masse-Status pro Mitglied
3. Gruppenprojekt im Admin mit Masse pro Mitglied

**Sagen:**
> „Für Guggenmusik und Cliquen: Der Gruppenleiter sieht das gemeinsame Gruppenprojekt im Portal. Im Admin verwalten Sie alle Mitglieder und deren Massen zentral."

---

### Szene 10 — Selbstregistrierung (1–2 Min.)

**URL:** `/kundenbereich/register`

**Zeigen:**
1. Formular: Name, E-Mail, Telefon, optional Passwort
2. „Registrieren" → Hinweis „E-Mail gesendet"
3. *(Mit Resend konfiguriert)* Bestätigungslink in E-Mail klicken
4. Automatischer Login → Dashboard
5. Zugangscode kommt per Willkommens-E-Mail

**Sagen:**
> „Kunden können sich auch selbst registrieren. Nach E-Mail-Bestätigung erhalten sie automatisch ihren Zugangscode. Optional können sie sich auch mit Passwort anmelden."

---

### Szene 11 — Magic-Link (30 Sek.)

**Admin:** Kundendetail → **Magic-Link** klicken

**Kunde:** E-Mail öffnen → Link klicken → `/kundenbereich/zugang/[token]` → direkt eingeloggt

**Sagen:**
> „Alternativ zum Zugangscode: Ein Magic-Link per E-Mail — ein Klick und der Kunde ist drin. Kein Code merken nötig."

---

### Szene 12 — Abschluss (30 Sek.)

**Sagen:**
> „Zusammengefasst: Kontaktanfrage → CRM-Inbox → Kunde anlegen → Zugangscode senden → Kunde im Portal → Massen, Chat, Dateien in Echtzeit → Gruppenbestellungen → alles aus einem System. Das Atelier hat volle Kontrolle, der Kunde sieht nur was relevant ist."

---

## Kompletter End-to-End Workflow

```
Kunde füllt /kontakt aus
        ↓
Anfrage landet in Admin → CRM → Anfragen
        ↓
Admin: „Kunde + Projekt anlegen" (+ E-Mail mit Zugangscode)
        ↓
Kunde loggt ein unter /kundenbereich/login
        ↓
Admin setzt Status → „Massnahme ausstehend"
        ↓
Kunde füllt Massblatt aus
        ↓
Admin + Kunde chatten live (Echtzeit)
        ↓
Admin lädt Angebot/Rechnung hoch → Kunde sieht Datei im Portal
        ↓
Admin ändert Status → „In Produktion" → „Abholbereit" → „Fertig"
        ↓
Kunde wird bei jedem Schritt benachrichtigt
```

---

## Admin-Bereich — Alle CRM-Seiten

| Seite | URL | Funktion |
|-------|-----|----------|
| CRM Dashboard | `/admin/crm` | Übersicht, Statistiken, Schnellzugriff |
| Anfragen | `/admin/crm/submissions` | Kontaktformular-Inbox, Konvertierung |
| Kunden | `/admin/crm/customers` | CRUD, Zugangscode, E-Mail, Magic-Link |
| Gruppen | `/admin/crm/groups` | Guggenmusik/Cliquen, Mitglieder |
| Projekte | `/admin/crm/projects` | Alle Aufträge mit Filtern |
| Projekt-Detail | `/admin/crm/projects/[id]` | 5 Tabs: Übersicht, Chat, Tasks, Dateien, Masse |
| Benachrichtigungen | `/admin/crm/notifications` | Alle Admin-Benachrichtigungen |
| Globale Suche | Sidebar-Suchfeld | Kunden, Gruppen, Projekte durchsuchen |

---

## Kundenportal — Alle Seiten

| Seite | URL | Funktion |
|-------|-----|----------|
| Login | `/kundenbereich/login` | E-Mail + Zugangscode (oder Passwort) |
| Registrieren | `/kundenbereich/register` | Selbstregistrierung + E-Mail-Verifizierung |
| Dashboard | `/kundenbereich` | Projekte, Schnellaktionen |
| Projekt | `/kundenbereich/projekt/[id]` | Status, Dateien, Chat |
| Massblatt | `/kundenbereich/massblatt` | Masse eingeben |
| Nachrichten | `/kundenbereich/nachrichten` | Alle Projekt-Chats |
| Magic-Link | `/kundenbereich/zugang/[token]` | Auto-Login per E-Mail-Link |
| E-Mail-Verifizierung | `/kundenbereich/verify/[token]` | Konto aktivieren nach Registrierung |

---

## Projekt-Status (Kundensicht)

| Status | Bedeutung |
|--------|-----------|
| Anfrage eingegangen | Kontakt erhalten, noch in Planung |
| Beratung geplant | Termin steht |
| Design bestätigt | Kostüm-Design vom Kunden genehmigt |
| Massnahme ausstehend | Kunde soll Massblatt ausfüllen |
| In Produktion | Nähen läuft |
| Anprobe geplant | Anprobe-Termin |
| Anpassungen | Nacharbeiten |
| Abholbereit | Kostüm fertig zur Abholung |
| Abgeschlossen | Auftrag erledigt |

---

## Technische Hinweise (für Entwickler / nicht im Client-Video)

- **Dev-Server:** `pnpm dev` (Custom `server.ts` mit Socket.io)
- **Ohne Chat:** `pnpm dev:next` — nur für statische Tests, kein Echtzeit
- **Datenbank:** `pnpm db:push` + `pnpm db:seed`
- **E-Mails:** `RESEND_API_KEY` + `RESEND_FROM_EMAIL` in `.env.local` nötig
- **Magic-Links / Verifizierung:** `NEXT_PUBLIC_APP_URL` muss auf die richtige Domain zeigen
- **Deployment:** Socket.io braucht VPS/Railway/Render — nicht reines Vercel Serverless

---

## Demo-Checkliste vor dem Filmen

- [ ] `pnpm dev` läuft
- [ ] `pnpm db:seed` ausgeführt (Testdaten vorhanden)
- [ ] Admin-Login funktioniert (`test.admin@lani.ch` / `Test@123`)
- [ ] Zwei Browser-Fenster bereit (Admin + Kunde) für Chat-Demo
- [ ] Resend konfiguriert (für E-Mail-Demo) — oder Szene 2/5/10/11 überspringen
- [ ] Bildschirmaufnahme-Software bereit (QuickTime, OBS, Loom, etc.)

---

## Optionale Kurzversion (5 Min.)

Wenn der Client wenig Zeit hat, nur diese 5 Szenen filmen:

1. **Kontaktformular** absenden (Szene 2)
2. **Admin: Anfrage → Kunde anlegen** (Szene 3)
3. **Projekt-Detail mit Chat** — zwei Fenster live (Szene 7)
4. **Kundenportal** Dashboard + Massblatt (Szene 8)
5. **Abschluss** — was alles fertig ist (Szene 12)

---

*Stand: Juli 2026 — Phase 1 (CRM MVP) + Phase 2 (Workflow-Automatisierung) vollständig implementiert.*
