"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Trash2 } from "lucide-react";
import { CRM_INPUT_SM } from "@/components/crm/crm-styles";

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

const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-gray-500/10 text-gray-400",
  normal: "bg-blue-500/10 text-blue-400",
  high: "bg-amber-500/10 text-amber-400",
  urgent: "bg-red-500/10 text-red-400",
};

const STATUS_OPTIONS = [
  { value: "todo", label: "Todo" },
  { value: "in_progress", label: "In Bearbeitung" },
  { value: "done", label: "Erledigt" },
  { value: "cancelled", label: "Abgebrochen" },
];

interface Props {
  projectId: string;
  initialTasks: Task[];
}

export function TaskList({ projectId, initialTasks }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [newTitle, setNewTitle] = useState("");
  const [newDueAt, setNewDueAt] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [newAssignee, setNewAssignee] = useState("");
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleAddTask() {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await fetch(`/admin/api/crm/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, dueAt: newDueAt || undefined, priority: newPriority, assignedTo: newAssignee || undefined }),
      });
      setNewTitle(""); setNewDueAt(""); setNewPriority("normal"); setNewAssignee("");
      setShowForm(false);
      startTransition(() => router.refresh());
    } finally {
      setAdding(false);
    }
  }

  async function handleStatusChange(taskId: string, status: string) {
    await fetch(`/admin/api/crm/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    startTransition(() => router.refresh());
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Task löschen?")) return;
    await fetch(`/admin/api/crm/tasks/${taskId}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  const pending = initialTasks.filter((t) => t.status !== "done" && t.status !== "cancelled");
  const done = initialTasks.filter((t) => t.status === "done" || t.status === "cancelled");

  const inputClass = CRM_INPUT_SM;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Tasks ({initialTasks.length})</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Task hinzufügen
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4 space-y-3">
          <input className={`${inputClass} w-full`} placeholder="Task-Titel…" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddTask()} />
          <div className="flex flex-wrap gap-2">
            <input type="date" className={inputClass} value={newDueAt} onChange={(e) => setNewDueAt(e.target.value)} />
            <select className={inputClass} value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
              <option value="low">Niedrig</option>
              <option value="normal">Normal</option>
              <option value="high">Hoch</option>
              <option value="urgent">Dringend</option>
            </select>
            <input className={`${inputClass} w-40`} placeholder="Zugewiesen an…" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} />
            <button onClick={handleAddTask} disabled={!newTitle.trim() || adding} className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-40">
              {adding ? "…" : "Hinzufügen"}
            </button>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
          {pending.map((task) => (
            <div key={task.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-200 last:border-0 hover:bg-gray-50">
              <button
                onClick={() => handleStatusChange(task.id, task.status === "todo" ? "in_progress" : "done")}
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.status === "in_progress" ? "border-violet-500 bg-violet-500/20" : "border-gray-600 hover:border-violet-400"
                }`}
              >
                {task.status === "in_progress" && <div className="w-2 h-2 bg-violet-500 rounded-full" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{task.title}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.normal}`}>
                    {task.priority}
                  </span>
                  {task.dueAt && (
                    <span className="text-[10px] text-gray-500">
                      Fällig: {new Date(task.dueAt).toLocaleDateString("de-CH")}
                    </span>
                  )}
                  {task.assignedTo && (
                    <span className="text-[10px] text-gray-500">@{task.assignedTo}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(task.id, "done")}
                  className="text-gray-600 hover:text-emerald-400 transition-colors" title="Erledigen"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="text-gray-600 hover:text-red-400 transition-colors" title="Löschen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {done.length > 0 && (
        <details className="group">
          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-900 transition-colors">
            {done.length} erledigte Task{done.length !== 1 ? "s" : ""}
          </summary>
          <div className="mt-2 bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden opacity-60">
            {done.map((task) => (
              <div key={task.id} className="flex items-start gap-3 px-4 py-3 border-b border-gray-200 last:border-0">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-400 line-through">{task.title}</p>
              </div>
            ))}
          </div>
        </details>
      )}

      {initialTasks.length === 0 && (
        <p className="text-sm text-gray-600 text-center py-8">Noch keine Tasks.</p>
      )}
    </div>
  );
}
