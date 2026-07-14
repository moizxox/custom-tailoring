import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { convertSubmissionToCustomer } from "@/lib/crm/contact-submissions";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = (await req.json().catch(() => ({}))) as {
      createProject?: boolean;
      projectTitle?: string;
      sendAccessCode?: boolean;
    };

    const result = await convertSubmissionToCustomer(id, {
      createProject: body.createProject,
      projectTitle: body.projectTitle,
      sendAccessCode: body.sendAccessCode,
    });

    if ("error" in result && result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[crm] convert submission failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
