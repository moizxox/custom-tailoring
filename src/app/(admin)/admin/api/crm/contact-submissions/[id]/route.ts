import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getContactSubmission, markSubmissionRead } from "@/lib/crm/contact-submissions";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const submission = await getContactSubmission(id);
  if (!submission) return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });

  return NextResponse.json({ submission });
}

export async function PATCH(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const submission = await markSubmissionRead(id);
    return NextResponse.json({ submission });
  } catch {
    return NextResponse.json({ error: "Nicht gefunden." }, { status: 404 });
  }
}
