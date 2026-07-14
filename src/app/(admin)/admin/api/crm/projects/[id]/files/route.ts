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

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;
  const files = await prisma.projectFile.findMany({ where: { projectId }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ files });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: projectId } = await params;

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const category = (formData.get("category") as string) || "other";
  const description = (formData.get("description") as string) || null;

  if (!file) return NextResponse.json({ error: "Keine Datei." }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let url = "";
  let cloudinaryId = "";

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `crm/projects/${projectId}`, resource_type: "auto" },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    url = result.secure_url;
    cloudinaryId = result.public_id;
  } else {
    url = `data:${file.type};base64,${buffer.toString("base64")}`;
    cloudinaryId = `local_${Date.now()}`;
  }

  const projectFile = await prisma.projectFile.create({
    data: {
      projectId,
      cloudinaryId,
      url,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      category,
      description,
      uploadedBy: "admin",
    },
  });

  return NextResponse.json({ file: projectFile }, { status: 201 });
}
