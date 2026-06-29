/**
 * Bulk-upload all site images to Cloudinary and record them in the DB.
 * Run with:  npm run upload:cloudinary
 *
 * What it does:
 *  1. Finds every image under public/images (excluding /garbage)
 *  2. Uploads each one to Cloudinary under "lani-kostuemschneiderei/<subfolder>"
 *  3. Upserts a MediaFile row in Postgres (skips files already tracked)
 *  4. Prints a final mapping of local path → Cloudinary URL
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

const PUBLIC_DIR = path.join(process.cwd(), "public", "images");
const CLOUDINARY_FOLDER = "lani-kostuemschneiderei";

// Folders to upload (relative to public/images)
const INCLUDE_FOLDERS = ["atelier", "gallery", "figures", "backgrounds"];
const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

interface UploadResult {
  localPath: string;  // e.g. /images/gallery/foo.jpeg
  cloudinaryUrl: string;
  publicId: string;
  width: number;
  height: number;
  skipped?: boolean;
}

function getFilesRecursive(dir: string): string[] {
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFilesRecursive(full));
    } else if (IMAGE_EXTS.has(path.extname(entry.name).toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function uploadFile(absPath: string): Promise<{ secure_url: string; public_id: string; width: number; height: number }> {
  // Derive the Cloudinary folder from the relative path
  // e.g. public/images/gallery/foo.jpeg → lani-kostuemschneiderei/gallery
  const rel = path.relative(PUBLIC_DIR, absPath);               // gallery/foo.jpeg
  const subFolder = rel.split(path.sep).slice(0, -1).join("/"); // gallery
  const publicFolder = subFolder
    ? `${CLOUDINARY_FOLDER}/${subFolder}`
    : CLOUDINARY_FOLDER;

  const basename = path.basename(absPath, path.extname(absPath));

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      absPath,
      {
        folder: publicFolder,
        public_id: basename,
        overwrite: false,         // don't re-upload if already there
        resource_type: "image",
        unique_filename: false,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result as typeof result & { secure_url: string; public_id: string; width: number; height: number });
      }
    );
  });
}

async function main() {
  console.log("🌤  Cloudinary bulk upload — Kostümschneiderei\n");

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("❌  CLOUDINARY_CLOUD_NAME is not set. Check your .env.local");
    process.exit(1);
  }

  // Collect all image files in the selected folders
  const allFiles: string[] = [];
  for (const folder of INCLUDE_FOLDERS) {
    const dir = path.join(PUBLIC_DIR, folder);
    if (fs.existsSync(dir)) {
      allFiles.push(...getFilesRecursive(dir));
    }
  }

  console.log(`📂  Found ${allFiles.length} images to process\n`);

  const results: UploadResult[] = [];

  for (const absPath of allFiles) {
    const filename = path.basename(absPath);
    // localPath as it would appear in <img src="..."> e.g. /images/gallery/foo.jpeg
    const rel = path.relative(path.join(process.cwd(), "public"), absPath);
    const localPath = "/" + rel.split(path.sep).join("/");

    // Check if already in DB
    const existing = await prisma.mediaFile.findFirst({
      where: { filename },
    });

    if (existing) {
      console.log(`  ⏭  ${filename} — already in DB, skipping`);
      results.push({ localPath, cloudinaryUrl: existing.url, publicId: existing.publicId ?? "", width: existing.width ?? 0, height: existing.height ?? 0, skipped: true });
      continue;
    }

    try {
      process.stdout.write(`  ⬆  ${filename} … `);
      const uploaded = await uploadFile(absPath);

      // Save to DB
      await prisma.mediaFile.create({
        data: {
          url: uploaded.secure_url,
          filename,
          altText: filename.replace(/\.[^.]+$/, "").replace(/-/g, " "),
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
        },
      });

      console.log(`✅  ${uploaded.secure_url}`);
      results.push({
        localPath,
        cloudinaryUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        width: uploaded.width,
        height: uploaded.height,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌  ${msg}`);
      results.push({ localPath, cloudinaryUrl: "", publicId: "", width: 0, height: 0 });
    }
  }

  // Print final mapping
  const uploaded = results.filter((r) => r.cloudinaryUrl && !r.skipped);
  const skipped = results.filter((r) => r.skipped);
  const failed = results.filter((r) => !r.cloudinaryUrl);

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log(`✅  Uploaded: ${uploaded.length}`);
  console.log(`⏭  Skipped (already existed): ${skipped.length}`);
  console.log(`❌  Failed: ${failed.length}`);

  if (uploaded.length > 0 || skipped.length > 0) {
    console.log("\n📋  URL mapping (paste into default-content.ts as needed):\n");
    for (const r of [...uploaded, ...skipped]) {
      console.log(`  "${r.localPath}" → "${r.cloudinaryUrl}"`);
    }
  }

  console.log("\n🎉  Done. All images are now available in the admin Media Library.\n");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
