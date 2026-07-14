import { redirect } from "next/navigation";
import { resolveAccessToken } from "@/lib/portal/customers";
import { createPortalSession } from "@/lib/portal/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anmeldung — Kundenbereich",
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ZugangTokenPage({ params }: Props) {
  const { token } = await params;
  const customer = await resolveAccessToken(token);

  if (!customer) {
    redirect("/kundenbereich/login?error=invalid-link");
  }

  await createPortalSession(customer.id);
  redirect("/kundenbereich");
}
