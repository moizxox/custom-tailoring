/**
 * Copy Cloudinary assets from SOURCE cloud → DEST cloud, then rewrite URLs in Neon.
 *
 * Usage:
 *   SOURCE_CLOUDINARY_CLOUD_NAME=... SOURCE_CLOUDINARY_API_KEY=... SOURCE_CLOUDINARY_API_SECRET=... \
 *   DEST_CLOUDINARY_CLOUD_NAME=... DEST_CLOUDINARY_API_KEY=... DEST_CLOUDINARY_API_SECRET=... \
 *   DATABASE_URL="<client neon pooled url>" \
 *   pnpm exec tsx scripts/migrate-cloudinary.ts
 *
 * Optional:
 *   CLOUDINARY_FOLDER=lani-kostuemschneiderei   (default)
 *   DRY_RUN=1                                   (list only, no upload/rewrite)
 */

import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";

/** Set CLOUDINARY_FOLDER=* (or MIGRATE_ALL=1) to copy every upload, not just one folder. */
const FOLDER = process.env.CLOUDINARY_FOLDER || "lani-kostuemschneiderei";
const MIGRATE_ALL = process.env.MIGRATE_ALL === "1" || FOLDER === "*";
const DRY = process.env.DRY_RUN === "1";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

const source = {
  cloud_name: requireEnv("SOURCE_CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("SOURCE_CLOUDINARY_API_KEY"),
  api_secret: requireEnv("SOURCE_CLOUDINARY_API_SECRET"),
};

const dest = {
  cloud_name: requireEnv("DEST_CLOUDINARY_CLOUD_NAME"),
  api_key: requireEnv("DEST_CLOUDINARY_API_KEY"),
  api_secret: requireEnv("DEST_CLOUDINARY_API_SECRET"),
};

requireEnv("DATABASE_URL");

type Resource = {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format?: string;
  bytes?: number;
};

async function listSourceResources(): Promise<Resource[]> {
  cloudinary.config(source);
  const out: Resource[] = [];
  let next: string | undefined;
  do {
    const r = (await cloudinary.api.resources({
      type: "upload",
      max_results: 500,
      next_cursor: next,
      ...(MIGRATE_ALL ? {} : { prefix: FOLDER }),
    })) as { resources: Resource[]; next_cursor?: string };
    out.push(...r.resources);
    next = r.next_cursor;
  } while (next);
  return out;
}

async function uploadToDest(src: Resource): Promise<string> {
  cloudinary.config(dest);
  const result = await cloudinary.uploader.upload(src.secure_url, {
    public_id: src.public_id,
    overwrite: true,
    resource_type: "image",
  });
  return result.secure_url as string;
}

function rewriteJsonUrls(value: unknown, map: Map<string, string>): unknown {
  if (typeof value === "string") {
    return map.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((v) => rewriteJsonUrls(v, map));
  }
  if (value && typeof value === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      o[k] = rewriteJsonUrls(v, map);
    }
    return o;
  }
  return value;
}

async function main() {
  console.log(`Source cloud: ${source.cloud_name}  folder: ${FOLDER}`);
  console.log(`Dest cloud:   ${dest.cloud_name}`);
  console.log(DRY ? "DRY RUN — no uploads / DB writes" : "LIVE migration");

  const resources = await listSourceResources();
  console.log(`Found ${resources.length} source assets`);

  const urlMap = new Map<string, string>();
  let i = 0;
  for (const res of resources) {
    i += 1;
    if (DRY) {
      urlMap.set(
        res.secure_url,
        res.secure_url.replace(`/${source.cloud_name}/`, `/${dest.cloud_name}/`)
      );
      continue;
    }
    process.stdout.write(`[${i}/${resources.length}] ${res.public_id}… `);
    try {
      const newUrl = await uploadToDest(res);
      urlMap.set(res.secure_url, newUrl);
      // also map http→https / versionless variants loosely by public_id rewrite later
      console.log("ok");
    } catch (err) {
      console.log("FAIL", err instanceof Error ? err.message : err);
    }
  }

  // Extra: map any URL containing /<sourceCloud>/ to dest by string replace of cloud name
  function mapUrl(url: string): string {
    if (urlMap.has(url)) return urlMap.get(url)!;
    if (url.includes(`res.cloudinary.com/${source.cloud_name}/`)) {
      return url.replace(
        `res.cloudinary.com/${source.cloud_name}/`,
        `res.cloudinary.com/${dest.cloud_name}/`
      );
    }
    return url;
  }

  if (DRY) {
    console.log("Sample map entries:", [...urlMap.entries()].slice(0, 3));
    return;
  }

  const prisma = new PrismaClient();
  let mediaUpdated = 0;
  let productUpdated = 0;
  let fileUpdated = 0;
  let pageUpdated = 0;

  const media = await prisma.mediaFile.findMany();
  for (const m of media) {
    const next = mapUrl(m.url);
    if (next !== m.url) {
      await prisma.mediaFile.update({ where: { id: m.id }, data: { url: next } });
      mediaUpdated++;
    }
  }

  const products = await prisma.product.findMany();
  for (const p of products) {
    const imageUrl = p.imageUrl ? mapUrl(p.imageUrl) : p.imageUrl;
    const galleryUrls = p.galleryUrls
      ? (rewriteJsonUrls(p.galleryUrls, urlMap) as object)
      : p.galleryUrls;
    // gallery may need cloud-name replace too
    const galleryFixed = galleryUrls
      ? JSON.parse(
          JSON.stringify(galleryUrls).replaceAll(
            `res.cloudinary.com/${source.cloud_name}/`,
            `res.cloudinary.com/${dest.cloud_name}/`
          )
        )
      : galleryUrls;
    if (imageUrl !== p.imageUrl || JSON.stringify(galleryFixed) !== JSON.stringify(p.galleryUrls)) {
      await prisma.product.update({
        where: { id: p.id },
        data: { imageUrl, galleryUrls: galleryFixed ?? undefined },
      });
      productUpdated++;
    }
  }

  const files = await prisma.projectFile.findMany();
  for (const f of files) {
    const next = mapUrl(f.url);
    if (next !== f.url) {
      await prisma.projectFile.update({ where: { id: f.id }, data: { url: next } });
      fileUpdated++;
    }
  }

  const pages = await prisma.pageContent.findMany();
  for (const page of pages) {
    const raw = JSON.stringify(page.content);
    const nextRaw = raw.replaceAll(
      `res.cloudinary.com/${source.cloud_name}/`,
      `res.cloudinary.com/${dest.cloud_name}/`
    );
    if (nextRaw !== raw) {
      await prisma.pageContent.update({
        where: { id: page.id },
        data: { content: JSON.parse(nextRaw) },
      });
      pageUpdated++;
    }
  }

  // SiteSettings JSON may also hold image URLs
  const settings = await prisma.siteSettings.findMany();
  let settingsUpdated = 0;
  for (const s of settings) {
    const raw = JSON.stringify(s.value);
    const nextRaw = raw.replaceAll(
      `res.cloudinary.com/${source.cloud_name}/`,
      `res.cloudinary.com/${dest.cloud_name}/`
    );
    if (nextRaw !== raw) {
      await prisma.siteSettings.update({
        where: { key: s.key },
        data: { value: JSON.parse(nextRaw) },
      });
      settingsUpdated++;
    }
  }

  console.log({
    uploaded: urlMap.size,
    mediaUpdated,
    productUpdated,
    fileUpdated,
    pageUpdated,
    settingsUpdated,
  });
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
