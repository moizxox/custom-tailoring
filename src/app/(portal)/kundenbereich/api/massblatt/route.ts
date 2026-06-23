import { NextResponse } from "next/server";
import { findCustomerById, saveMeasurementSubmission } from "@/lib/portal/customers";
import { getRequiredFieldKeys } from "@/lib/portal/measurement-fields";
import { getPortalCustomerId } from "@/lib/portal/session";
import type { MeasurementData } from "@/types";

export async function POST(request: Request) {
  const customerId = await getPortalCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const customer = findCustomerById(customerId);
  if (!customer) {
    return NextResponse.json({ error: "Kunde nicht gefunden." }, { status: 404 });
  }

  const formData = await request.formData();
  const raw: Record<string, string> = {};
  const photoNames: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key === "photos" && value instanceof File && value.size > 0) {
      photoNames.push(value.name);
    } else if (typeof value === "string" && key !== "notes") {
      raw[key] = value;
    }
  }

  const values: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    const num = Number(value);
    if (value.trim() !== "" && !Number.isNaN(num)) {
      values[key] = num;
    }
  }

  const notes = formData.get("notes");
  const data: MeasurementData = {
    values,
    notes: typeof notes === "string" && notes.trim() ? notes.trim() : undefined,
  };

  const requiredKeys = getRequiredFieldKeys(customer.costumeCategory);
  const missing = requiredKeys.filter((key) => !values[key] || values[key] <= 0);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: "Bitte füllen Sie alle Pflichtfelder aus." },
      { status: 400 }
    );
  }

  saveMeasurementSubmission({
    customerId: customer.id,
    projectTitle: customer.projectTitle,
    costumeCategory: customer.costumeCategory,
    measurements: data,
    photoNames,
    submittedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
