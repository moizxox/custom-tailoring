import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/auth";
import { revalidateShopPage } from "@/lib/cms/revalidate";

/** Persist product list order. Body: { orderedIds: string[] } */
export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const orderedIds = body.orderedIds;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0 || !orderedIds.every((id) => typeof id === "string")) {
      return NextResponse.json({ error: "orderedIds array required" }, { status: 400 });
    }

    await prisma.$transaction(
      orderedIds.map((id: string, index: number) =>
        prisma.product.update({
          where: { id },
          data: { sortOrder: index + 1 },
        }),
      ),
    );

    revalidateShopPage();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
