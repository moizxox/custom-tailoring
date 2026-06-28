import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "Keine Datei gefunden." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      // Upload to Cloudinary
      const result = await new Promise<{
        secure_url: string;
        public_id: string;
        width: number;
        height: number;
      }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "lani-kostuemschneiderei",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve(result as typeof result & { secure_url: string; public_id: string; width: number; height: number });
          }
        ).end(buffer);
      });

      const mediaFile = await prisma.mediaFile.create({
        data: {
          url: result.secure_url,
          altText: altText || null,
          filename: file.name,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        },
      });
      return NextResponse.json(mediaFile, { status: 201 });
    } else {
      // Dev fallback: return a placeholder (Cloudinary not configured)
      return NextResponse.json({
        error: "Cloudinary nicht konfiguriert. Bitte CLOUDINARY_* Umgebungsvariablen setzen.",
      }, { status: 503 });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const files = await prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(files);
  } catch {
    return NextResponse.json([]);
  }
}
