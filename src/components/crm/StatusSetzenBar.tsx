"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CUSTOMER_STATUSES } from "@/lib/crm/projects";
import { CRM_INPUT } from "@/components/crm/crm-styles";

interface Props {
  projectId: string;
  currentStatus: string;
}

export function StatusSetzenBar({ projectId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSet() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note: note.trim() || null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Fehler.");
        return;
      }
      setNote("");
      router.refresh();
    } catch {
      setError("Keine Verbindung zum Server.");
    } finally {
      setSaving(false);
    }
  }

  const label = CUSTOMER_STATUSES.find((s) => s.value === currentStatus)?.label ?? currentStatus;

  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-600 text-white font-medium">{label}</span>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${CRM_INPUT} sm:max-w-xs`}
        >
          {CUSTOMER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notiz (optional)"
          className={`${CRM_INPUT} flex-1`}
        />
        <button
          type="button"
          onClick={handleSet}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold tracking-wide disabled:opacity-50"
        >
          {saving ? "…" : "SETZEN"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
