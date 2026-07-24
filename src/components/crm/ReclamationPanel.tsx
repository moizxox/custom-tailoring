"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RECLAMATION_STATUSES } from "@/lib/crm/projects";
import { CRM_INPUT, CRM_TEXTAREA } from "@/components/crm/crm-styles";

interface Reclamation {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}

export function ReclamationPanel({
  projectId,
  reclamations: initial,
}: {
  projectId: string;
  reclamations: Reclamation[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/reclamations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Fehler.");
        return;
      }
      const rec = (data as { reclamation?: Reclamation }).reclamation;
      if (rec) setItems((prev) => [rec, ...prev]);
      setTitle("");
      setDescription("");
      router.refresh();
    } catch {
      setError("Keine Verbindung.");
    } finally {
      setSaving(false);
    }
  }

  async function setStatus(id: string, status: string) {
    const res = await fetch(`/admin/api/crm/projects/${projectId}/reclamations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = (data as { reclamation: Reclamation }).reclamation;
      setItems((prev) => prev.map((r) => (r.id === id ? updated : r)));
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-sm font-medium text-gray-800">Neue Reklamation</p>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titel"
          className={CRM_INPUT}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Beschreibung"
          className={CRM_TEXTAREA}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? "…" : "Erstellen"}
        </button>
      </form>

      <ul className="space-y-3">
        {items.length === 0 ? (
          <li className="rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-400">
            Keine Reklamationen
          </li>
        ) : (
          items.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{r.title}</p>
                  {r.description && <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{r.description}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(r.createdAt).toLocaleString("de-CH")}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                  className={`${CRM_INPUT} w-auto`}
                >
                  {RECLAMATION_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
