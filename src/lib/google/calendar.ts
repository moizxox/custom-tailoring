import { google } from "googleapis";
import { prisma } from "@/lib/db/prisma";

const SETTINGS_KEY = "google_calendar";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
];
const TZ = "Europe/Zurich";

export type GoogleCalendarTokens = {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  token_type?: string | null;
  scope?: string | null;
  email?: string | null;
  connectedAt?: string | null;
};

function clientId() {
  return process.env.GOOGLE_CLIENT_ID?.trim() ?? "";
}

function clientSecret() {
  return process.env.GOOGLE_CLIENT_SECRET?.trim() ?? "";
}

export function googleRedirectUri() {
  return (
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    "https://kostuemschneiderei.ch/admin/api/integrations/google/callback"
  );
}

export function isGoogleCalendarConfigured() {
  return Boolean(clientId() && clientSecret());
}

export function createOAuthClient() {
  return new google.auth.OAuth2(clientId(), clientSecret(), googleRedirectUri());
}

export function getGoogleAuthUrl() {
  const oauth2 = createOAuthClient();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
}

export async function getStoredGoogleTokens(): Promise<GoogleCalendarTokens | null> {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: SETTINGS_KEY } });
    if (!row?.value || typeof row.value !== "object") return null;
    return row.value as GoogleCalendarTokens;
  } catch {
    return null;
  }
}

export async function saveGoogleTokens(tokens: GoogleCalendarTokens) {
  const existing = (await getStoredGoogleTokens()) ?? {};
  const merged: GoogleCalendarTokens = {
    ...existing,
    ...tokens,
    connectedAt: tokens.connectedAt ?? existing.connectedAt ?? new Date().toISOString(),
  };
  await prisma.siteSettings.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: merged as object },
    update: { value: merged as object },
  });
  return merged;
}

export async function clearGoogleTokens() {
  try {
    await prisma.siteSettings.delete({ where: { key: SETTINGS_KEY } });
  } catch {
    // ignore missing
  }
}

export async function getGoogleCalendarStatus() {
  const configured = isGoogleCalendarConfigured();
  const tokens = await getStoredGoogleTokens();
  const connected = Boolean(tokens?.refresh_token || tokens?.access_token);
  return {
    configured,
    connected,
    email: tokens?.email ?? null,
    connectedAt: tokens?.connectedAt ?? null,
  };
}

async function getAuthedClient() {
  const tokens = await getStoredGoogleTokens();
  if (!tokens?.refresh_token && !tokens?.access_token) {
    throw new Error("Google Calendar is not connected.");
  }
  const oauth2 = createOAuthClient();
  oauth2.setCredentials({
    access_token: tokens.access_token ?? undefined,
    refresh_token: tokens.refresh_token ?? undefined,
    expiry_date: tokens.expiry_date ?? undefined,
    token_type: tokens.token_type ?? undefined,
    scope: tokens.scope ?? undefined,
  });

  oauth2.on("tokens", (fresh) => {
    void saveGoogleTokens({
      access_token: fresh.access_token ?? tokens.access_token,
      refresh_token: fresh.refresh_token ?? tokens.refresh_token,
      expiry_date: fresh.expiry_date ?? tokens.expiry_date,
      token_type: fresh.token_type ?? tokens.token_type,
      scope: fresh.scope ?? tokens.scope,
      email: tokens.email,
      connectedAt: tokens.connectedAt,
    });
  });

  return oauth2;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Wall-clock range in Europe/Zurich (Google applies timeZone). */
export function appointmentRange(date: string, time: string, durationMin: number) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const startMin = hh * 60 + mm;
  const endTotal = startMin + Math.max(durationMin, 1);
  const dayAdd = Math.floor(endTotal / (24 * 60));
  const endOfDay = endTotal % (24 * 60);
  const endH = Math.floor(endOfDay / 60);
  const endM = endOfDay % 60;

  const startLocal = `${date}T${pad(hh)}:${pad(mm)}:00`;
  const endDay = new Date(y, m - 1, d);
  endDay.setDate(endDay.getDate() + dayAdd);
  const endLocal = `${endDay.getFullYear()}-${pad(endDay.getMonth() + 1)}-${pad(endDay.getDate())}T${pad(endH)}:${pad(endM)}:00`;

  return { startLocal, endLocal, timeZone: TZ };
}

export async function createCalendarEventForAppointment(appt: {
  id: string;
  locationId: string;
  serviceLabel: string;
  date: string;
  time: string;
  durationMin: number;
  name: string;
  email: string;
  phone?: string | null;
  notes?: string | null;
}) {
  const auth = await getAuthedClient();
  const calendar = google.calendar({ version: "v3", auth });
  const { startLocal, endLocal, timeZone } = appointmentRange(
    appt.date,
    appt.time,
    appt.durationMin || 30,
  );

  const locationLabel =
    appt.locationId === "therwil"
      ? "Atelier Therwil"
      : appt.locationId === "pratteln"
        ? "Atelier Pratteln"
        : appt.locationId;

  const description = [
    `Kunde: ${appt.name}`,
    `E-Mail: ${appt.email}`,
    appt.phone ? `Telefon: ${appt.phone}` : null,
    `Leistung: ${appt.serviceLabel}`,
    `Standort: ${locationLabel}`,
    appt.notes ? `Notiz: ${appt.notes}` : null,
    `Booking-ID: ${appt.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
      summary: `${appt.serviceLabel} — ${appt.name}`,
      description,
      location: locationLabel,
      start: { dateTime: startLocal, timeZone },
      end: { dateTime: endLocal, timeZone },
      attendees: appt.email ? [{ email: appt.email }] : undefined,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 60 },
          { method: "popup", minutes: 30 },
        ],
      },
    },
  });

  return res.data.id ?? null;
}
