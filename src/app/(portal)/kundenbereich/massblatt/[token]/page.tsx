import { redirect } from "next/navigation";
import { resolveAccessToken } from "@/lib/portal/customers";
import { createPortalSession } from "@/lib/portal/session";
import { MeasurementForm } from "@/components/portal/MeasurementForm";
import { PortalHeader } from "@/components/portal/PortalHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Persönliches Massblatt",
  robots: { index: false, follow: false },
};

interface TokenPageProps {
  params: Promise<{ token: string }>;
}

export default async function MassblattTokenPage({ params }: TokenPageProps) {
  const { token } = await params;
  const customer = await resolveAccessToken(token);

  if (!customer) {
    redirect("/kundenbereich/login?error=invalid-link");
  }

  await createPortalSession(customer.id);

  return (
    <>
      <PortalHeader customerName={customer.name} />
      <div className="container-site py-10 md:py-14">
        <div className="mb-6 p-4 rounded-xl bg-periwinkle-lighter/40 border border-periwinkle-light/50 text-sm font-sans text-charcoal-light">
          Persönlicher Zugangslink für <strong className="text-charcoal">{customer.name}</strong>.
          Diese Seite ist nicht öffentlich zugänglich.
        </div>
        <MeasurementForm customer={customer} />
      </div>
    </>
  );
}
