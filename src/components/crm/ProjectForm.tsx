"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CUSTOMER_STATUSES,
  INTERNAL_STATUSES,
  PROJECT_PRIORITIES,
} from "@/lib/crm/projects";
import { CRM_INPUT, CRM_TEXTAREA, CRM_SELECT } from "@/components/crm/crm-styles";

interface Props {
  projectId?: string;
  customers?: Array<{ id: string; name: string }>;
  groups?: Array<{ id: string; name: string }>;
  initialCustomerId?: string;
  initialGroupId?: string;
  initialData?: {
    title: string;
    description: string;
    customerId: string;
    groupId: string;
    costumeCategory: string;
    quantity: number;
    deadline: string;
    priority: string;
    customerStatus: string;
    internalStatus: string;
    internalNotes: string;
    totalAmount: string;
    paidAmount: string;
    paymentStatus: string;
  };
}

export function ProjectForm({
  projectId,
  customers = [],
  groups = [],
  initialCustomerId,
  initialGroupId,
  initialData,
}: Props) {
  const router = useRouter();
  const isEditing = !!projectId;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    customerId: initialData?.customerId ?? initialCustomerId ?? "",
    groupId: initialData?.groupId ?? initialGroupId ?? "",
    costumeCategory: initialData?.costumeCategory ?? "",
    quantity: initialData?.quantity ?? 1,
    deadline: initialData?.deadline ?? "",
    priority: initialData?.priority ?? "normal",
    customerStatus: initialData?.customerStatus ?? "request_received",
    internalStatus: initialData?.internalStatus ?? "new",
    internalNotes: initialData?.internalNotes ?? "",
    totalAmount: initialData?.totalAmount ?? "",
    paidAmount: initialData?.paidAmount ?? "",
    paymentStatus: initialData?.paymentStatus ?? "unpaid",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const url = isEditing ? `/admin/api/crm/projects/${projectId}` : "/admin/api/crm/projects";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customerId: form.customerId || undefined,
          groupId: form.groupId || undefined,
          deadline: form.deadline || undefined,
          quantity: Number(form.quantity),
          totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
          paidAmount: form.paidAmount ? Number(form.paidAmount) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Fehler."); return; }
      if (isEditing) { setSuccess("Gespeichert."); router.refresh(); }
      else { router.push(`/admin/crm/projects/${data.project.id}`); }
    } catch { setError("Verbindungsfehler."); }
    finally { setSaving(false); }
  }

  const inputClass = CRM_INPUT;
  const labelClass = "block text-xs text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className={labelClass}>Projekttitel *</label>
        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Guggenmusik Kostüme 2026" />
      </div>

      <div>
        <label className={labelClass}>Beschreibung</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={CRM_TEXTAREA} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {customers.length > 0 && (
          <div>
            <label className={labelClass}>Kunde</label>
            <select name="customerId" value={form.customerId} onChange={handleChange} className={inputClass}>
              <option value="">— Keiner —</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        {groups.length > 0 && (
          <div>
            <label className={labelClass}>Gruppe</label>
            <select name="groupId" value={form.groupId} onChange={handleChange} className={inputClass}>
              <option value="">— Keine —</option>
              {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>Kostümkategorie</label>
          <select name="costumeCategory" value={form.costumeCategory} onChange={handleChange} className={inputClass}>
            <option value="">— Keine —</option>
            <option value="Herren">Herren</option>
            <option value="Damen">Damen</option>
            <option value="Kinder">Kinder</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Menge</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min={1} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Liefertermin</label>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Priorität</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            {PROJECT_PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>
      </div>

      {isEditing && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label className={labelClass}>Kundenstatus</label>
              <select name="customerStatus" value={form.customerStatus} onChange={handleChange} className={inputClass}>
                {CUSTOMER_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Interner Status</label>
              <select name="internalStatus" value={form.internalStatus} onChange={handleChange} className={inputClass}>
                {INTERNAL_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label className={labelClass}>Gesamtbetrag (CHF)</label>
              <input type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} step="0.01" className={inputClass} placeholder="0.00" />
            </div>
            <div>
              <label className={labelClass}>Bezahlt (CHF)</label>
              <input type="number" name="paidAmount" value={form.paidAmount} onChange={handleChange} step="0.01" className={inputClass} placeholder="0.00" />
            </div>
            <div>
              <label className={labelClass}>Zahlungsstatus</label>
              <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange} className={inputClass}>
                <option value="unpaid">Unbezahlt</option>
                <option value="partial">Teilweise</option>
                <option value="paid">Bezahlt</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>Interne Notizen</label>
        <textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} rows={3} className={`${inputClass} resize-y`} placeholder="Nur für Adminbereich sichtbar…" />
      </div>

      {error && <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">{success}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
          {saving ? "…" : isEditing ? "Speichern" : "Projekt erstellen"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
