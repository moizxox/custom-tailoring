import { NextResponse } from "next/server";
import { findCustomerById } from "@/lib/portal/customers";
import {
  formatPersonalNotes,
  getRequiredFieldKeys,
  MEASUREMENT_LETTER_KEYS,
  parsePersonalFromFormData,
} from "@/lib/portal/measurement-fields";
import { getPortalCustomerId } from "@/lib/portal/session";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const customerId = await getPortalCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const customer = await findCustomerById(customerId);
  if (!customer) {
    return NextResponse.json({ error: "Kunde nicht gefunden." }, { status: 404 });
  }

  const formData = await request.formData();
  const personal = parsePersonalFromFormData(formData);

  if (!personal.firstName || !personal.lastName) {
    return NextResponse.json(
      { error: "Bitte Vorname und Nachname angeben." },
      { status: 400 },
    );
  }

  if (!personal.consent) {
    return NextResponse.json(
      { error: "Bitte bestätigen Sie die Einverständniserklärung." },
      { status: 400 },
    );
  }

  const values: Record<string, number> = {};
  for (const key of MEASUREMENT_LETTER_KEYS) {
    const raw = formData.get(key);
    if (typeof raw !== "string" || !raw.trim()) continue;
    const num = Number(raw);
    if (!Number.isNaN(num) && num > 0) {
      values[key] = num;
    }
  }

  // Sync Körpergrösse from personal section into letter O when provided
  if (personal.heightCm && !values.o) {
    const h = Number(personal.heightCm);
    if (!Number.isNaN(h) && h > 0) values.o = h;
  }

  const freeNotes = formData.get("notes");
  const freeNotesText =
    typeof freeNotes === "string" && freeNotes.trim() ? freeNotes.trim() : "";

  const notesParts = [formatPersonalNotes(personal)];
  if (freeNotesText) {
    notesParts.push("", "Weitere Bemerkungen:", freeNotesText);
  }
  const notes = notesParts.join("\n");

  const requiredKeys = getRequiredFieldKeys(customer.costumeCategory);
  const missing = requiredKeys.filter((key) => !values[key] || values[key] <= 0);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Bitte füllen Sie alle Pflichtfelder aus." },
      { status: 400 },
    );
  }

  if (Object.keys(values).length === 0) {
    return NextResponse.json(
      { error: "Bitte mindestens ein Mass eintragen." },
      { status: 400 },
    );
  }

  const project = await prisma.project.findFirst({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });

  await prisma.measurement.create({
    data: {
      customerId,
      projectId: project?.id ?? null,
      fields: {
        ...values,
        _personal: personal,
      } as object,
      notes,
      status: "complete",
    },
  });

  return NextResponse.json({ ok: true });
}
