import { redirect } from "next/navigation";
import { findCustomerById } from "@/lib/portal/customers";
import { getPortalCustomerId } from "@/lib/portal/session";
import { MeasurementForm } from "@/components/portal/MeasurementForm";
import { PortalHeader } from "@/components/portal/PortalHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massblatt",
  robots: { index: false, follow: false },
};

export default async function MassblattPage() {
  const customerId = await getPortalCustomerId();
  if (!customerId) redirect("/kundenbereich/login?next=/kundenbereich/massblatt");

  const customer = findCustomerById(customerId);
  if (!customer) redirect("/kundenbereich/login");

  return (
    <>
      <PortalHeader customerName={customer.name} />
      <div className="container-site py-10 md:py-14">
        <MeasurementForm customer={customer} />
      </div>
    </>
  );
}
