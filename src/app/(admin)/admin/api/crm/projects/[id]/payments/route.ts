import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError, readJsonBody } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string }> }

async function recalcPaidAmount(projectId: string) {
  const payments = await prisma.projectPayment.findMany({ where: { projectId } });
  const paid = payments.reduce((sum, p) => {
    const amount = Number(p.amount);
    if (p.kind === "refund") return sum - amount;
    return sum + amount;
  }, 0);
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  const total = project?.totalAmount != null ? Number(project.totalAmount) : null;
  let paymentStatus = "unpaid";
  if (paid > 0 && total != null && paid >= total) paymentStatus = "paid";
  else if (paid > 0) paymentStatus = "partial";
  await prisma.project.update({
    where: { id: projectId },
    data: { paidAmount: paid, paymentStatus },
  });
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id } = await params;
    const payments = await prisma.projectPayment.findMany({
      where: { projectId: id },
      orderBy: { paidAt: "desc" },
    });
    return NextResponse.json({ payments });
  } catch (error) {
    return crmCatch(error, "Zahlungen konnten nicht geladen werden.");
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  const parsed = await readJsonBody(req);
  if (!parsed.ok) return parsed.response;
  const amount = Number(parsed.body.amount);
  if (!Number.isFinite(amount) || amount === 0) return crmError("Betrag ungültig.", 400);
  const kind = typeof parsed.body.kind === "string" ? parsed.body.kind : "partial";
  const note = typeof parsed.body.note === "string" ? parsed.body.note : null;
  const paidAtRaw = parsed.body.paidAt;
  const paidAt =
    paidAtRaw && typeof paidAtRaw === "string" && paidAtRaw.trim()
      ? new Date(paidAtRaw)
      : new Date();

  try {
    const { id } = await params;
    const payment = await prisma.projectPayment.create({
      data: { projectId: id, amount, kind, note, paidAt },
    });
    await recalcPaidAmount(id);
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return crmCatch(error, "Zahlung konnte nicht erfasst werden.");
  }
}
