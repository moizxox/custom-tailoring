import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { crmCatch, crmError } from "@/lib/crm/api";

interface Params { params: Promise<{ id: string; paymentId: string }> }

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

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return crmError("Unauthorized", 401);
  try {
    const { id, paymentId } = await params;
    await prisma.projectPayment.delete({ where: { id: paymentId } });
    await recalcPaidAmount(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return crmCatch(error, "Zahlung konnte nicht gelöscht werden.");
  }
}
