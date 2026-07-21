import { NextResponse } from "next/server";

/** Convert empty strings / undefined to null for optional FK fields. */
export function emptyToNull(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s.length > 0 ? s : null;
}

export function parseOptionalDate(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const d = new Date(String(value));
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function crmError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function crmCatch(error: unknown, fallback = "Serverfehler. Bitte erneut versuchen.") {
  console.error("[crm]", error);
  const message =
    error instanceof Error && error.message.includes("Foreign key")
      ? "Ungültige Verknüpfung (Kunde/Gruppe/Leitung)."
      : fallback;
  return crmError(message, 500);
}

/** Parse JSON body; return null response if invalid. */
export async function readJsonBody(req: Request): Promise<
  { ok: true; body: Record<string, unknown> } | { ok: false; response: NextResponse }
> {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    return { ok: true, body };
  } catch {
    return { ok: false, response: crmError("Ungültige Anfrage.", 400) };
  }
}
