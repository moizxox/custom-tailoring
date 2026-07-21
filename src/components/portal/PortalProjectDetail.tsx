"use client";

import { useState } from "react";
import Link from "next/link";
import type { MessagePayload } from "@/lib/socket/events";
import { PortalMessagesThread } from "./PortalMessagesThread";

interface ProjectFile {
  id: string;
  url: string;
  originalName: string | null;
  category: string;
  description: string | null;
  createdAt: string;
}

interface ProjectInfo {
  id: string;
  title: string;
  description: string | null;
  notes: string | null;
  customerStatus: string;
  customerStatusLabel: string;
  deadline: string | null;
  deliveryDate: string | null;
  quantity: number;
  costumeCategory: string | null;
  orderType: string | null;
  updatedAt: string;
}

interface Props {
  project: ProjectInfo;
  files: ProjectFile[];
  conversationId: string | null;
  initialMessages: MessagePayload[];
  customerId: string;
}

const STATUS_STEPS = [
  "request_received",
  "consultation_scheduled",
  "design_approved",
  "measurement_pending",
  "production_started",
  "fitting_scheduled",
  "alterations",
  "ready_for_pickup",
  "completed",
];

const FILE_CATEGORIES: Record<string, string> = {
  offer: "Angebot",
  invoice: "Rechnung",
  measurement: "Massblatt",
  photo: "Foto",
  design: "Entwurf",
  other: "Sonstiges",
};

export function PortalProjectDetail({
  project,
  files,
  conversationId,
  initialMessages,
  customerId,
}: Props) {
  const [activeTab, setActiveTab] = useState<"overview" | "files" | "messages">(
    "overview"
  );

  const currentStepIndex = STATUS_STEPS.indexOf(project.customerStatus);

  return (
    <div className="container-site py-10 md:py-14 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/kundenbereich"
          className="text-xs font-sans text-charcoal-lighter hover:text-periwinkle-dark transition-colors"
        >
          Kundenbereich
        </Link>
        <span className="text-charcoal-lighter text-xs">/</span>
        <span className="text-xs font-sans text-charcoal">{project.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <p className="section-label mb-2">Projekt</p>
        <h1 className="font-serif text-3xl text-charcoal mb-3">{project.title}</h1>
        {project.description && (
          <p className="font-sans text-sm text-charcoal-light max-w-2xl">
            {project.description}
          </p>
        )}
      </div>

      {/* Status timeline */}
      <div className="glass-card p-6 mb-8">
        <p className="font-sans text-xs font-medium text-charcoal-lighter uppercase tracking-wider mb-4">
          Auftragsstatus
        </p>
        <div className="relative">
          <div className="flex items-start justify-between gap-1 overflow-x-auto pb-2">
            {STATUS_STEPS.map((step, i) => {
              const isPast = i < currentStepIndex;
              const isCurrent = i === currentStepIndex;
              const labels: Record<string, string> = {
                request_received: "Anfrage",
                consultation_scheduled: "Beratung",
                design_approved: "Design",
                measurement_pending: "Masse",
                production_started: "Produktion",
                fitting_scheduled: "Anprobe",
                alterations: "Anpassung",
                ready_for_pickup: "Abholbereit",
                completed: "Fertig",
              };
              return (
                <div key={step} className="flex flex-col items-center flex-1 min-w-[50px]">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-sans font-bold transition-all ${
                      isPast
                        ? "bg-periwinkle-dark border-periwinkle-dark text-white"
                        : isCurrent
                        ? "bg-periwinkle-lighter border-periwinkle-dark text-periwinkle-dark ring-4 ring-periwinkle-lighter/40"
                        : "bg-offwhite-pure border-stone-light text-charcoal-lighter"
                    }`}
                  >
                    {isPast ? "✓" : i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute h-0.5 transition-all ${
                        isPast ? "bg-periwinkle-dark" : "bg-stone-light"
                      }`}
                      style={{
                        top: "14px",
                        left: `calc(${((i + 0.5) / (STATUS_STEPS.length - 1)) * 100}% - 14px)`,
                        width: `calc(${(1 / (STATUS_STEPS.length - 1)) * 100}%)`,
                      }}
                    />
                  )}
                  <p
                    className={`text-[9px] font-sans text-center mt-1.5 leading-tight ${
                      isCurrent ? "text-periwinkle-dark font-medium" : "text-charcoal-lighter"
                    }`}
                  >
                    {labels[step]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-stone-light/50 flex flex-wrap gap-4 text-xs font-sans text-charcoal-lighter">
          {project.deadline && (
            <span>
              Abholtermin 1:{" "}
              <span className="text-charcoal">
                {new Date(project.deadline).toLocaleDateString("de-CH")}
              </span>
            </span>
          )}
          {project.deliveryDate && (
            <span>
              Abholtermin 2:{" "}
              <span className="text-charcoal">
                {new Date(project.deliveryDate).toLocaleDateString("de-CH")}
              </span>
            </span>
          )}
          {project.quantity > 1 && (
            <span>
              Menge: <span className="text-charcoal">{project.quantity}</span>
            </span>
          )}
          {project.costumeCategory && (
            <span>
              Passform: <span className="text-charcoal">{project.costumeCategory}</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-stone-light mb-6">
        {(["overview", "files", "messages"] as const).map((tab) => {
          const labels = { overview: "Übersicht", files: "Dokumente", messages: "Nachrichten" };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-sans font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-periwinkle-dark text-periwinkle-dark"
                  : "border-transparent text-charcoal-lighter hover:text-charcoal"
              }`}
            >
              {labels[tab]}
              {tab === "files" && files.length > 0 && (
                <span className="ml-1.5 bg-stone-light text-charcoal-lighter rounded-full px-1.5 py-0.5 text-[10px]">
                  {files.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-serif text-base text-charcoal mb-3">Auftragdetails</h3>
            <dl className="grid grid-cols-2 gap-3">
              <div>
                <dt className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider">Status</dt>
                <dd className="font-sans text-sm text-charcoal mt-0.5">{project.customerStatusLabel}</dd>
              </div>
              {project.costumeCategory && (
                <div>
                  <dt className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider">Passform</dt>
                  <dd className="font-sans text-sm text-charcoal mt-0.5">{project.costumeCategory}</dd>
                </div>
              )}
              {project.quantity > 1 && (
                <div>
                  <dt className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider">Menge</dt>
                  <dd className="font-sans text-sm text-charcoal mt-0.5">{project.quantity}</dd>
                </div>
              )}
              {project.deadline && (
                <div>
                  <dt className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider">Abholtermin 1</dt>
                  <dd className="font-sans text-sm text-charcoal mt-0.5">
                    {new Date(project.deadline).toLocaleDateString("de-CH")}
                  </dd>
                </div>
              )}
              {project.deliveryDate && (
                <div>
                  <dt className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider">Abholtermin 2</dt>
                  <dd className="font-sans text-sm text-charcoal mt-0.5">
                    {new Date(project.deliveryDate).toLocaleDateString("de-CH")}
                  </dd>
                </div>
              )}
            </dl>
            {project.notes && (
              <div className="mt-4 pt-4 border-t border-stone-light/50">
                <p className="text-[10px] font-sans text-charcoal-lighter uppercase tracking-wider mb-1">
                  Hinweise vom Atelier
                </p>
                <p className="font-sans text-sm text-charcoal whitespace-pre-wrap">{project.notes}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab("messages")}
            className="w-full glass-card p-5 text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base text-charcoal group-hover:text-periwinkle-dark transition-colors">
                  Nachrichten
                </h3>
                <p className="font-sans text-xs text-charcoal-lighter mt-1">
                  Direkter Kontakt mit unserem Atelier
                </p>
              </div>
              <span className="text-charcoal-lighter group-hover:text-periwinkle-dark text-sm">→</span>
            </div>
          </button>
        </div>
      )}

      {activeTab === "files" && (
        <div className="space-y-3">
          {files.length === 0 ? (
            <p className="text-sm font-sans text-charcoal-lighter text-center py-12">
              Noch keine Dokumente vorhanden.
            </p>
          ) : (
            files.map((file) => (
              <div
                key={file.id}
                className="glass-card p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-periwinkle-lighter flex items-center justify-center flex-shrink-0">
                  <span className="text-periwinkle-dark text-xs font-sans font-bold uppercase">
                    {file.originalName?.split(".").pop() ?? "DOC"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-charcoal truncate">
                    {file.originalName ?? "Dokument"}
                  </p>
                  <p className="font-sans text-xs text-charcoal-lighter mt-0.5">
                    {FILE_CATEGORIES[file.category] ?? file.category} •{" "}
                    {new Date(file.createdAt).toLocaleDateString("de-CH")}
                  </p>
                  {file.description && (
                    <p className="font-sans text-xs text-charcoal-lighter mt-0.5 truncate">
                      {file.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <a
                    href={file.url}
                    download={file.originalName ?? undefined}
                    className="text-xs font-sans text-periwinkle-dark hover:underline"
                  >
                    Download
                  </a>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-sans text-charcoal-lighter hover:text-charcoal"
                  >
                    Öffnen
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "messages" && (
        <PortalMessagesThread
          projectId={project.id}
          conversationId={conversationId}
          initialMessages={initialMessages}
          customerId={customerId}
        />
      )}
    </div>
  );
}
