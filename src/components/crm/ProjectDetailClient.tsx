"use client";

import { useState } from "react";
import { ConversationPanel } from "./ConversationPanel";
import { TaskList } from "./TaskList";
import { FilesPanel } from "./FilesPanel";
import { MeasurementEditor } from "./MeasurementEditor";
import { ProjectForm, type ProjectFormData } from "./ProjectForm";
import { StatusSetzenBar } from "./StatusSetzenBar";
import { PaymentsPanel } from "./PaymentsPanel";
import { StatusHistoryPanel } from "./StatusHistoryPanel";
import { ReclamationPanel } from "./ReclamationPanel";
import { formatMoney } from "@/lib/crm/projects";
import type { MessagePayload } from "@/lib/socket/events";

interface ProjectInfo {
  id: string;
  projectNumber: string | null;
  title: string;
  customerStatus: string;
  internalStatus: string;
  priority: string;
  totalAmount: number | null;
  paidAmount: number | null;
  depositRequired: number | null;
  paymentStatus: string;
  archived: boolean;
  season: string | null;
  updatedAt: string;
  customer: { id: string; name: string; email: string } | null;
  group: { id: string; name: string } | null;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  assignedTo: string | null;
  priority: string;
  status: string;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

interface ProjectFileInfo {
  id: string;
  url: string;
  originalName: string | null;
  category: string;
  description: string | null;
  uploadedBy: string;
  visibleToCustomer: boolean;
  createdAt: string;
}

interface Measurement {
  id: string;
  customerId: string;
  customerName?: string | null;
  fields: Record<string, number>;
  status: string;
  notes: string | null;
  updatedAt: string;
}

interface MeasurementPerson {
  id: string;
  name: string;
}

interface PaymentInfo {
  id: string;
  amount: number | string;
  kind: string;
  paidAt: string;
  note: string | null;
}

interface StatusHistoryEntry {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}

interface ReclamationInfo {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

interface Props {
  project: ProjectInfo;
  formData: Partial<ProjectFormData>;
  tasks: Task[];
  files: ProjectFileInfo[];
  measurements: Measurement[];
  people: MeasurementPerson[];
  costumeCategory: string | null;
  conversationId: string | null;
  initialMessages: MessagePayload[];
  customers: Array<{ id: string; name: string }>;
  groups: Array<{ id: string; name: string }>;
  customerStatuses: Array<{ value: string; label: string }>;
  internalStatuses: Array<{ value: string; label: string }>;
  payments: PaymentInfo[];
  statusHistory: StatusHistoryEntry[];
  reclamations: ReclamationInfo[];
}

const TABS = [
  { id: "overview", label: "Übersicht" },
  { id: "measurements", label: "Masse" },
  { id: "files", label: "Dokumente" },
  { id: "messages", label: "Nachrichten" },
  { id: "payments", label: "Zahlungen" },
  { id: "history", label: "Status-Historie" },
  { id: "reclamation", label: "Reklamation" },
  { id: "tasks", label: "Tasks" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const PRIORITY_COLORS: Record<string, string> = {
  low: "text-gray-400", normal: "text-blue-400", high: "text-amber-400", urgent: "text-red-400",
};
const STATUS_BADGE = "text-[10px] px-2 py-0.5 rounded-full font-medium";

export function ProjectDetailClient({
  project,
  formData,
  tasks,
  files,
  measurements,
  people,
  costumeCategory,
  conversationId,
  initialMessages,
  customers,
  groups,
  customerStatuses,
  internalStatuses,
  payments,
  statusHistory,
  reclamations,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const csLabel = (v: string) => customerStatuses.find((s) => s.value === v)?.label ?? v;
  const isLabel = (v: string) => internalStatuses.find((s) => s.value === v)?.label ?? v;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-gray-900">{project.title}</h1>
            {project.projectNumber && (
              <span className="text-sm font-mono text-violet-700 bg-violet-50 border border-violet-200 rounded-lg px-2 py-0.5">
                {project.projectNumber}
              </span>
            )}
            {project.archived && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 font-medium">Archiviert</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {project.customer && (
              <a href={`/admin/crm/customers/${project.customer.id}`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                {project.customer.name}
              </a>
            )}
            {project.group && (
              <a href={`/admin/crm/groups/${project.group.id}`} className="text-xs text-gray-400 hover:text-gray-900 transition-colors">
                Gruppe: {project.group.name}
              </a>
            )}
            {project.season && <span className="text-xs text-gray-500">Saison {project.season}</span>}
            <span className={`${STATUS_BADGE} bg-blue-500/10 text-blue-500`}>{isLabel(project.internalStatus)}</span>
            <span className={`text-xs font-medium ${PRIORITY_COLORS[project.priority] ?? PRIORITY_COLORS.normal}`}>
              {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {project.customer && (
            <a
              href={`/kundenbereich/projekt/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-xl px-3 py-1.5 transition-colors"
            >
              Kundenansicht ↗
            </a>
          )}
        </div>
      </div>

      <div className="mb-6">
        <StatusSetzenBar projectId={project.id} currentStatus={project.customerStatus} />
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.id === "tasks" && tasks.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
            )}
            {tab.id === "files" && files.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{files.length}</span>
            )}
            {tab.id === "messages" && (
              <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{initialMessages.length}</span>
            )}
            {tab.id === "measurements" && measurements.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{measurements.length}</span>
            )}
            {tab.id === "payments" && payments.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{payments.length}</span>
            )}
            {tab.id === "reclamation" && reclamations.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">{reclamations.length}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Auftrag bearbeiten</h2>
            <ProjectForm
              projectId={project.id}
              projectNumber={project.projectNumber}
              customers={customers}
              groups={groups}
              initialData={formData}
            />
          </div>
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Finanzen</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Gesamt</span>
                  <span className="text-gray-900 font-medium">CHF {formatMoney(project.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Anzahlung erforderlich</span>
                  <span className="text-gray-900 font-medium">CHF {formatMoney(project.depositRequired)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bezahlt</span>
                  <span className="text-emerald-600 font-medium">CHF {formatMoney(project.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Status</span>
                  <span className={`text-[10px] ${STATUS_BADGE} ${
                    project.paymentStatus === "paid" ? "bg-emerald-500/10 text-emerald-600" :
                    project.paymentStatus === "partial" ? "bg-amber-500/10 text-amber-600" :
                    "bg-red-500/10 text-red-600"
                  }`}>
                    {project.paymentStatus === "paid" ? "Bezahlt" : project.paymentStatus === "partial" ? "Teilweise" : "Unbezahlt"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick-Status</p>
              <p className="text-xs text-gray-500">Tasks: {tasks.filter((t) => t.status === "done").length}/{tasks.length} erledigt</p>
              <p className="text-xs text-gray-500 mt-1">Dokumente: {files.length}</p>
              <p className="text-xs text-gray-500 mt-1">Masse: {measurements.length}</p>
              <p className="text-xs text-gray-500 mt-1">Personen: {people.length}</p>
              <p className="text-xs text-gray-500 mt-1">Nachrichten: {initialMessages.length}</p>
              <p className="text-xs text-gray-500 mt-1">Zahlungen: {payments.length}</p>
              <p className="text-xs text-gray-500 mt-1">Reklamationen: {reclamations.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "messages" && (
        <ConversationPanel
          projectId={project.id}
          conversationId={conversationId}
          initialMessages={initialMessages}
        />
      )}

      {activeTab === "tasks" && (
        <TaskList projectId={project.id} initialTasks={tasks} />
      )}

      {activeTab === "files" && (
        <FilesPanel projectId={project.id} initialFiles={files} />
      )}

      {activeTab === "measurements" && (
        <MeasurementEditor
          projectId={project.id}
          initialMeasurements={measurements}
          people={people}
          costumeCategory={costumeCategory}
        />
      )}

      {activeTab === "payments" && (
        <PaymentsPanel
          projectId={project.id}
          payments={payments}
          totalAmount={project.totalAmount}
          paidAmount={project.paidAmount}
          depositRequired={project.depositRequired}
        />
      )}

      {activeTab === "history" && <StatusHistoryPanel entries={statusHistory} />}

      {activeTab === "reclamation" && (
        <ReclamationPanel projectId={project.id} reclamations={reclamations} />
      )}
    </div>
  );
}
