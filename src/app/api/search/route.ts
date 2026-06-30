import { buildSearchIndex, searchSiteWithIndex } from "@/lib/search-index";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 8), 50);

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const index = await buildSearchIndex();
  const results = searchSiteWithIndex(index, q, limit);
  return NextResponse.json({ results });
}
