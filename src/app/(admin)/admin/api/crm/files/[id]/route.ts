import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface Params { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;

  try {
    const { id } = await params;
    const file = await prisma.projectFile.findUnique({ where: { id } });
    if (!file) return crmError("Nicht gefunden.", 404);

    const visibleToCustomer =
      file.category === "internal"
        ? false
        : typeof parsed.body.visibleToCustomer === "boolean"
          ? parsed.body.visibleToCustomer
          : file.visibleToCustomer;

    const updated = await prisma.projectFile.update({
      where: { id },
      data: { visibleToCustomer },
    });
    return NextResponse.json({ file: updated });
  } catch (error) {
    return crmCatch(error, "Datei konnte nicht aktualisiert werden.");
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    const file = await prisma.projectFile.findUnique({ where: { id } });
    if (!file) return crmError("Nicht gefunden.", 404);

    if (process.env.CLOUDINARY_CLOUD_NAME && !file.cloudinaryId.startsWith("local_")) {
      try {
        await cloudinary.uploader.destroy(file.cloudinaryId);
      } catch (err) {
        console.error("[files] Cloudinary delete error", err);
      }
    }

    await prisma.projectFile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return crmCatch(error, "Datei konnte nicht gelöscht werden.");
  }
}
