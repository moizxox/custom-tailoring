import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { isAllowedMassblattFile } from "@/lib/massblatt";
import { getPrivateMassblattPath } from "@/lib/massblatt-server";
import { getPortalCustomerId } from "@/lib/portal/session";

interface RouteParams {
  params: Promise<{ name: string }>;
}

/**
 * Serves Massblatt PDFs only to logged-in Kundenbereich customers.
 * Files live in private/documents/ — never under public/.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const customerId = await getPortalCustomerId();
  if (!customerId) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { name } = await params;
  const filename = decodeURIComponent(name);

  if (!isAllowedMassblattFile(filename)) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  const filePath = getPrivateMassblattPath(filename);
  if (!filePath) {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }

  try {
    const data = await readFile(filePath);
    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": String(data.byteLength),
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Datei nicht gefunden." }, { status: 404 });
  }
}
