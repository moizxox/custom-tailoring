"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GROUP_TYPES, BILLING_MODES } from "@/lib/crm/groups";
import { CRM_INPUT } from "@/components/crm/crm-styles";

interface Props {
  groupId?: string;
  customers?: Array<{ id: string; name: string }>;
  initialData?: {
    name: string;
    description: string;
    type: string;
    season: string;
    leaderId: string;
    location: string;
    notes: string;
    billingMode: string;
    archived: boolean;
  };
}

export function GroupForm({ groupId, customers = [], initialData }: Props) {
  const router = useRouter();
  const isEditing = !!groupId;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    type: initialData?.type ?? "group",
    season: initialData?.season ?? "",
    leaderId: initialData?.leaderId ?? "",
    location: initialData?.location ?? "",
    notes: initialData?.notes ?? "",
    billingMode: initialData?.billingMode ?? "collective",
    archived: initialData?.archived ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const url = isEditing ? `/admin/api/crm/groups/${groupId}` : "/admin/api/crm/groups";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          leaderId: form.leaderId || null,
        }),
      });
      let data: { error?: string; group?: { id: string } } = {};
      try {
        data = await res.json();
      } catch {
        setError(res.ok ? "Unerwartete Serverantwort." : `Fehler (${res.status}). Bitte erneut versuchen.`);
        return;
      }
      if (!res.ok) { setError(data.error ?? "Fehler."); return; }
      if (isEditing) { setSuccess("Gespeichert."); router.refresh(); }
      else if (data.group?.id) { router.push(`/admin/crm/groups/${data.group.id}`); }
      else { setError("Gruppe erstellt, aber keine ID erhalten."); }
    } catch {
      setError("Keine Verbindung zum Server. Bitte Netzwerk prüfen und erneut versuchen.");
    }
    finally { setSaving(false); }
  }

  async function handleArchive(archived: boolean) {
    if (!groupId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/groups/${groupId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Archivieren fehlgeschlagen.");
        return;
      }
      setForm((f) => ({ ...f, archived }));
      setSuccess(archived ? "Archiviert." : "Wiederhergestellt.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!groupId) return;
    if (!window.confirm("Gruppe wirklich endgültig löschen? Mitglieder-Zuordnungen gehen verloren.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/admin/api/crm/groups/${groupId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Löschen fehlgeschlagen.");
        return;
      }
      router.push("/admin/crm/groups");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = CRM_INPUT;
  const labelClass = "block text-xs text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Guggenmusik Luzern" />
        </div>
        <div>
          <label className={labelClass}>Typ</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {GROUP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Saison / Jahr</label>
          <input name="season" value={form.season} onChange={handleChange} className={inputClass} placeholder="Fasnacht 2026" />
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Basel" />
        </div>
        <div>
          <label className={labelClass}>Rechnung</label>
          <select name="billingMode" value={form.billingMode} onChange={handleChange} className={inputClass}>
            {BILLING_MODES.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>
        {customers.length > 0 && (
          <div>
            <label className={labelClass}>Hauptperson / Leiter:in</label>
            <select name="leaderId" value={form.leaderId} onChange={handleChange} className={inputClass}>
              <option value="">— keine —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={`${inputClass} resize-y`} placeholder="Kurzbeschreibung…" />
      </div>
      <div>
        <label className={labelClass}>Notizen (intern)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={`${inputClass} resize-y`} />
      </div>
      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">{success}</p>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleArchive(!form.archived)}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium disabled:opacity-50"
            >
              {form.archived ? "Wiederherstellen" : "Archivieren"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-sm font-medium disabled:opacity-50"
            >
              Löschen
            </button>
          </div>
        ) : (
          <span />
        )}
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
            Abbrechen
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
            {saving ? "…" : isEditing ? "Speichern" : "Gruppe erstellen"}
          </button>
        </div>
      </div>
    </form>
  );
}
