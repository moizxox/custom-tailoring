import Link from "next/link";
import { redirect } from "next/navigation";
import { findCustomerById } from "@/lib/portal/customers";
import { getPortalCustomerId } from "@/lib/portal/session";
import { PortalHeader } from "@/components/portal/PortalHeader";

export default async function KundenbereichDashboard() {
  const customerId = await getPortalCustomerId();
  if (!customerId) redirect("/kundenbereich/login");

  const customer = findCustomerById(customerId);
  if (!customer) redirect("/kundenbereich/login");

  return (
    <>
      <PortalHeader customerName={customer.name} />
      <div className="container-site py-12 md:py-16">
        <p className="section-label mb-3">Willkommen</p>
        <h1 className="font-serif text-3xl text-charcoal mb-2">
          Hallo, {customer.name.split(" ")[0]}
        </h1>
        <p className="font-sans text-sm text-charcoal-light mb-10 max-w-xl">
          Hier verwalten Sie Ihre Massangaben und Projektunterlagen — vertraulich und nur
          für Ihren Auftrag.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
          <Link
            href="/kundenbereich/massblatt"
            className="glass-card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center mb-4">
              <span className="font-serif text-lg text-periwinkle-dark">M</span>
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-2 group-hover:text-periwinkle-dark transition-colors">
              Massblatt ausfüllen
            </h2>
            <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">
              Masse eingeben, Fotos hochladen und sicher an unser Atelier senden.
            </p>
            <p className="font-sans text-xs text-periwinkle-dark mt-4">Projekt: {customer.projectTitle}</p>
          </Link>

          <div className="glass-card p-6 opacity-90">
            <div className="w-10 h-10 rounded-xl bg-sand-light flex items-center justify-center mb-4">
              <span className="font-serif text-lg text-charcoal-lighter">D</span>
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-2">Dokumente</h2>
            <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">
              Angebote, Rechnungen und weitere Unterlagen — demnächst verfügbar.
            </p>
            <span className="inline-block mt-4 text-[10px] font-sans uppercase tracking-wider text-charcoal-lighter">
              Phase 2
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
