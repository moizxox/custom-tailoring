import { redirect } from "next/navigation";
import Link from "next/link";
import { getPortalCustomerId } from "@/lib/portal/session";
import { prisma } from "@/lib/prisma";
import { getAccessibleProjectWhere } from "@/lib/portal/projects";
import { PortalHeader } from "@/components/portal/PortalHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nachrichten — Kundenbereich",
  robots: { index: false, follow: false },
};

export default async function PortalNachrichtenPage() {
  const customerId = await getPortalCustomerId();
  if (!customerId) redirect("/kundenbereich/login");

  const projectWhere = await getAccessibleProjectWhere(customerId);

  const projects = await prisma.project.findMany({
    where: projectWhere,
    orderBy: { updatedAt: "desc" },
    include: {
      group: { select: { name: true } },
      conversations: {
        include: {
          messages: {
            where: { isInternal: false },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        take: 1,
      },
    },
  });

  const projectIds = projects.map((p) => p.id);
  const unreadByProject = projectIds.length > 0
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          senderRole: "admin",
          isInternal: false,
          readAt: null,
          conversation: { projectId: { in: projectIds } },
        },
        _count: { id: true },
      })
    : [];

  const convToProject = new Map(
    projects.flatMap((p) =>
      p.conversations.map((c) => [c.id, p.id] as const)
    )
  );

  const unreadCountByProject = new Map<string, number>();
  for (const row of unreadByProject) {
    const projectId = convToProject.get(row.conversationId);
    if (projectId) {
      unreadCountByProject.set(
        projectId,
        (unreadCountByProject.get(projectId) ?? 0) + row._count.id
      );
    }
  }

  const unreadCount = await prisma.notification.count({
    where: { customerId, read: false },
  });

  return (
    <>
      <PortalHeader unreadCount={unreadCount} />
      <div className="container-site py-12 md:py-16 max-w-3xl">
        <div className="mb-8">
          <p className="section-label mb-2">Kommunikation</p>
          <h1 className="font-serif text-3xl text-charcoal">Nachrichten</h1>
        </div>

        {projects.length === 0 ? (
          <div className="glass-card p-10 text-center">
            <p className="font-sans text-sm text-charcoal-lighter mb-4">
              Noch kein Auftrag vorhanden.
            </p>
            <Link href="/termin" className="btn-primary">
              Termin buchen
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((project) => {
              const conv = project.conversations[0];
              const lastMsg = conv?.messages[0] ?? null;
              const unreadMessages = unreadCountByProject.get(project.id) ?? 0;

              return (
                <Link
                  key={project.id}
                  href={`/kundenbereich/projekt/${project.id}#messages`}
                  className="glass-card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-charcoal group-hover:text-periwinkle-dark transition-colors">
                        {project.title}
                      </p>
                      {project.group && (
                        <p className="font-sans text-[10px] text-charcoal-lighter mt-0.5">
                          Gruppe: {project.group.name}
                        </p>
                      )}
                      {lastMsg ? (
                        <p className="font-sans text-xs text-charcoal-lighter mt-1 truncate">
                          <span className={lastMsg.senderRole === "admin" ? "text-periwinkle-dark" : ""}>
                            {lastMsg.senderRole === "admin" ? "Atelier: " : "Sie: "}
                          </span>
                          {lastMsg.body}
                        </p>
                      ) : (
                        <p className="font-sans text-xs text-charcoal-lighter mt-1">
                          Noch keine Nachrichten — schreiben Sie uns!
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {lastMsg && (
                        <span className="text-[10px] font-sans text-charcoal-lighter">
                          {new Date(lastMsg.createdAt).toLocaleDateString("de-CH")}
                        </span>
                      )}
                      {unreadMessages > 0 && (
                        <span className="w-5 h-5 bg-periwinkle-dark text-white text-[10px] font-sans font-bold rounded-full flex items-center justify-center">
                          {unreadMessages}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
