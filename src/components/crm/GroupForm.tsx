"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GROUP_TYPES } from "@/lib/crm/groups";
import { CRM_INPUT, CRM_TEXTAREA } from "@/components/crm/crm-styles";

interface Props {
  groupId?: string;
  initialData?: {
    name: string;
    description: string;
    type: string;
    season: string;
    leaderId: string;
    location: string;
    notes: string;
  };
}

export function GroupForm({ groupId, initialData }: Props) {
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
  });
  const [saving, setSaving] = useState(false);
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
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Fehler."); return; }
      if (isEditing) { setSuccess("Gespeichert."); router.refresh(); }
      else { router.push(`/admin/crm/groups/${data.group.id}`); }
    } catch { setError("Verbindungsfehler."); }
    finally { setSaving(false); }
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
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
          {saving ? "…" : isEditing ? "Speichern" : "Gruppe erstellen"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
