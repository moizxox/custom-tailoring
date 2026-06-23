import { NextResponse } from "next/server";
import { findCustomerById, saveMeasurementSubmission } from "@/lib/portal/customers";
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
  const measurements: Record<string, string> = {};
  const photoNames: string[] = [];

  for (const [key, value] of formData.entries()) {
    if (key === "photos" && value instanceof File && value.size > 0) {
      photoNames.push(value.name);
    } else if (typeof value === "string" && key !== "notes") {
      measurements[key] = value;
    }
  }

  const notes = formData.get("notes");
  const data: MeasurementData = {
    koerpergroesse: Number(measurements.koerpergroesse) || 0,
    brust: Number(measurements.brust) || 0,
    taille: Number(measurements.taille) || 0,
    huefte: Number(measurements.huefte) || 0,
    schulterbreite: Number(measurements.schulterbreite) || 0,
    armlaenge: Number(measurements.armlaenge) || 0,
    rueckenlaenge: Number(measurements.rueckenlaenge) || 0,
    innenbeinlaenge: measurements.innenbeinlaenge
      ? Number(measurements.innenbeinlaenge)
      : undefined,
    halsgrösse: measurements.halsgrösse ? Number(measurements.halsgrösse) : undefined,
    notes: typeof notes === "string" ? notes : undefined,
  };

  const required = [
    data.koerpergroesse,
    data.brust,
    data.taille,
    data.huefte,
    data.schulterbreite,
    data.armlaenge,
    data.rueckenlaenge,
  ];
  if (required.some((v) => !v || v <= 0)) {
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
