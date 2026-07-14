import Link from "next/link";
import { redirect } from "next/navigation";
import { findCustomerById } from "@/lib/portal/customers";
import { getPortalCustomerId } from "@/lib/portal/session";
import { getAccessibleProjectWhere } from "@/lib/portal/projects";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { prisma } from "@/lib/prisma";

export default async function KundenbereichDashboard() {
  const customerId = await getPortalCustomerId();
  if (!customerId) redirect("/kundenbereich/login");

  const customer = await findCustomerById(customerId);
  if (!customer) redirect("/kundenbereich/login");

  // Fetch customer's projects and unread notification count
  const projectWhere = await getAccessibleProjectWhere(customerId);
  const [projects, unreadCount] = await Promise.all([
    prisma.project.findMany({
      where: projectWhere,
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        customerStatus: true,
        deadline: true,
        updatedAt: true,
      },
    }),
    prisma.notification.count({
      where: { customerId, read: false },
    }),
  ]);

  return (
    <>
      <PortalHeader customerName={customer.name} unreadCount={unreadCount} />
      <div className="container-site py-12 md:py-16">
        <p className="section-label mb-3">Willkommen</p>
        <h1 className="font-serif text-3xl text-charcoal mb-2">
          Hallo, {customer.name.split(" ")[0]}
        </h1>
        <p className="font-sans text-sm text-charcoal-light mb-10 max-w-xl">
          Hier verwalten Sie Ihre Massangaben und Projektunterlagen — vertraulich und nur
          für Ihren Auftrag.
        </p>

        {/* Projects section */}
        {projects.length > 0 && (
          <div className="mb-10">
            <h2 className="font-serif text-xl text-charcoal mb-4">Ihre Projekte</h2>
            <div className="flex flex-col gap-3 max-w-2xl">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/kundenbereich/projekt/${project.id}`}
                  className="glass-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group flex items-center justify-between"
                >
                  <div>
                    <p className="font-serif text-base text-charcoal group-hover:text-periwinkle-dark transition-colors">
                      {project.title}
                    </p>
                    <p className="font-sans text-xs text-charcoal-lighter mt-1">
                      Status: <span className="text-periwinkle-dark font-medium">{formatStatus(project.customerStatus)}</span>
                    </p>
                  </div>
                  <span className="text-charcoal-lighter group-hover:text-periwinkle-dark transition-colors text-xs font-sans">
                    Details →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
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
            {customer.projectTitle !== "Aktuelles Projekt" && (
              <p className="font-sans text-xs text-periwinkle-dark mt-4">
                Projekt: {customer.projectTitle}
              </p>
            )}
          </Link>

          <Link
            href="/kundenbereich/nachrichten"
            className="glass-card p-6 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sand-light flex items-center justify-center mb-4 relative">
              <span className="font-serif text-lg text-charcoal-lighter">N</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-periwinkle-dark text-white text-[10px] font-sans font-medium rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl text-charcoal mb-2 group-hover:text-periwinkle-dark transition-colors">
              Nachrichten
            </h2>
            <p className="font-sans text-sm text-charcoal-lighter leading-relaxed">
              Direkter Kontakt mit unserem Atelier zu Ihrem Auftrag.
            </p>
            {unreadCount > 0 && (
              <p className="font-sans text-xs text-periwinkle-dark mt-4">
                {unreadCount} ungelesene Nachricht{unreadCount !== 1 ? "en" : ""}
              </p>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    request_received: "Anfrage eingegangen",
    consultation_scheduled: "Beratung geplant",
    design_approved: "Design bestätigt",
    measurement_pending: "Massnahme ausstehend",
    production_started: "In Produktion",
    fitting_scheduled: "Anprobe geplant",
    alterations: "Anpassungen",
    ready_for_pickup: "Abholbereit",
    completed: "Abgeschlossen",
  };
  return map[status] ?? status;
}
