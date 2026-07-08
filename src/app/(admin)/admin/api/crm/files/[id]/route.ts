import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface Params { params: Promise<{ id: string }> }

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const file = await prisma.projectFile.findUnique({ where: { id } });
  if (!file) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });

  // Delete from Cloudinary if possible
  if (process.env.CLOUDINARY_CLOUD_NAME && !file.cloudinaryId.startsWith("local_")) {
    try {
      await cloudinary.uploader.destroy(file.cloudinaryId);
    } catch (err) {
      console.error("[files] Cloudinary delete error", err);
    }
  }

  await prisma.projectFile.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
