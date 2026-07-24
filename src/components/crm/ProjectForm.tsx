"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CUSTOMER_STATUSES,
  INTERNAL_STATUSES,
  PROJECT_PRIORITIES,
  COSTUME_CATEGORIES,
  ORDER_TYPES,
} from "@/lib/crm/projects";
import { CRM_INPUT, CRM_TEXTAREA } from "@/components/crm/crm-styles";

export interface ProjectFormData {
  title: string;
  description: string;
  customerId: string;
  groupId: string;
  season: string;
  costumeCategory: string;
  orderType: string;
  quantity: number;
  measurementDeadline1: string;
  measurementDeadline2: string;
  measurementDeadline3: string;
  fittingDate: string;
  deadline: string;
  deliveryDate: string;
  deliveryDate2: string;
  priority: string;
  customerStatus: string;
  internalStatus: string;
  notes: string;
  internalNotes: string;
  totalAmount: string;
  paidAmount: string;
  depositRequired: string;
  paymentStatus: string;
  contactPersonId: string;
  contactPersonName: string;
  contactPersonContact: string;
  treasurerName: string;
  treasurerContact: string;
  treasurerNotes: string;
  socialMediaName: string;
  socialMediaContact: string;
  socialMediaNotes: string;
  hasMajorCostume: boolean;
  majorCostumeNotes: string;
  archived: boolean;
}

interface Props {
  projectId?: string;
  projectNumber?: string | null;
  customers?: Array<{ id: string; name: string }>;
  groups?: Array<{ id: string; name: string }>;
  initialCustomerId?: string;
  initialGroupId?: string;
  initialData?: Partial<ProjectFormData>;
  onArchived?: () => void;
  onDeleted?: () => void;
}

const emptyForm: ProjectFormData = {
  title: "",
  description: "",
  customerId: "",
  groupId: "",
  season: "",
  costumeCategory: "",
  orderType: "",
  quantity: 1,
  measurementDeadline1: "",
  measurementDeadline2: "",
  measurementDeadline3: "",
  fittingDate: "",
  deadline: "",
  deliveryDate: "",
  deliveryDate2: "",
  priority: "normal",
  customerStatus: "request_received",
  internalStatus: "new",
  notes: "",
  internalNotes: "",
  totalAmount: "",
  paidAmount: "",
  depositRequired: "",
  paymentStatus: "unpaid",
  contactPersonId: "",
  contactPersonName: "",
  contactPersonContact: "",
  treasurerName: "",
  treasurerContact: "",
  treasurerNotes: "",
  socialMediaName: "",
  socialMediaContact: "",
  socialMediaNotes: "",
  hasMajorCostume: false,
  majorCostumeNotes: "",
  archived: false,
};

export function ProjectForm({
  projectId,
  projectNumber,
  customers = [],
  groups = [],
  initialCustomerId,
  initialGroupId,
  initialData,
  onArchived,
  onDeleted,
}: Props) {
  const router = useRouter();
  const isEditing = !!projectId;

  const [form, setForm] = useState<ProjectFormData>({
    ...emptyForm,
    ...initialData,
    customerId: initialData?.customerId ?? initialCustomerId ?? "",
    groupId: initialData?.groupId ?? initialGroupId ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
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
          customerId: form.customerId || null,
          groupId: form.groupId || null,
          contactPersonId: form.contactPersonId || null,
          costumeCategory: form.costumeCategory || null,
          orderType: form.orderType || null,
          season: form.season || null,
          measurementDeadline1: form.measurementDeadline1 || null,
          measurementDeadline2: form.measurementDeadline2 || null,
          measurementDeadline3: form.measurementDeadline3 || null,
          fittingDate: form.fittingDate || null,
          deadline: form.deadline || null,
          deliveryDate: form.deliveryDate || null,
          deliveryDate2: form.deliveryDate2 || null,
          quantity: Number(form.quantity),
          totalAmount: form.totalAmount ? Number(form.totalAmount) : null,
          paidAmount: form.paidAmount ? Number(form.paidAmount) : null,
          depositRequired: form.depositRequired ? Number(form.depositRequired) : null,
        }),
      });
      let data: { error?: string; project?: { id: string } } = {};
      try {
        data = await res.json();
      } catch {
        setError(res.ok ? "Unerwartete Serverantwort." : `Fehler (${res.status}).`);
        return;
      }
      if (!res.ok) {
        setError(data.error ?? "Fehler.");
        return;
      }
      if (isEditing) {
        setSuccess("Gespeichert.");
        router.refresh();
      } else if (data.project?.id) {
        router.push(`/admin/crm/projects/${data.project.id}`);
      } else {
        setError("Projekt erstellt, aber keine ID erhalten.");
      }
    } catch {
      setError("Keine Verbindung zum Server. Bitte Netzwerk prüfen und erneut versuchen.");
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(archived: boolean) {
    if (!projectId) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}`, {
        method: "PATCH",
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
      onArchived?.();
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!projectId) return;
    if (!window.confirm("Projekt wirklich endgültig löschen?")) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError((data as { error?: string }).error ?? "Löschen fehlgeschlagen.");
        return;
      }
      onDeleted?.();
      router.push("/admin/crm/projects");
    } finally {
      setBusy(false);
    }
  }

  const inputClass = CRM_INPUT;
  const labelClass = "block text-xs text-gray-500 mb-1.5";
  const sectionClass = "pt-4 border-t border-gray-200 space-y-4";
  const sectionTitle = "text-xs font-semibold uppercase tracking-wide text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {projectNumber && (
        <p className="text-sm text-violet-700 font-medium">
          Auftragsnummer: <span className="font-mono">{projectNumber}</span>
        </p>
      )}

      <div>
        <label className={labelClass}>Titel *</label>
        <input name="title" value={form.title} onChange={handleChange} required className={inputClass} placeholder="Syydebölle" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Saison</label>
          <input name="season" value={form.season} onChange={handleChange} className={inputClass} placeholder="2027" />
        </div>
        <div>
          <label className={labelClass}>Anzahl Mitglieder</label>
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min={1} className={inputClass} />
        </div>
        {customers.length > 0 && (
          <div>
            <label className={labelClass}>Kunde (Einzel)</label>
            <select name="customerId" value={form.customerId} onChange={handleChange} className={inputClass}>
              <option value="">— keine —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        {groups.length > 0 && (
          <div>
            <label className={labelClass}>Gruppe</label>
            <select name="groupId" value={form.groupId} onChange={handleChange} className={inputClass}>
              <option value="">— keine —</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className={labelClass}>Kostüm-Typ / Auftragstyp</label>
          <select name="orderType" value={form.orderType} onChange={handleChange} className={inputClass}>
            <option value="">— keiner —</option>
            {ORDER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Passform</label>
          <select name="costumeCategory" value={form.costumeCategory} onChange={handleChange} className={inputClass}>
            <option value="">— keine —</option>
            {COSTUME_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Priorität</label>
          <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
            {PROJECT_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionTitle}>Ansprechperson</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customers.length > 0 && (
            <div>
              <label className={labelClass}>Ansprechperson (User aus System)</label>
              <select name="contactPersonId" value={form.contactPersonId} onChange={handleChange} className={inputClass}>
                <option value="">— keine —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className={labelClass}>… oder Name frei eintippen</label>
            <input name="contactPersonName" value={form.contactPersonName} onChange={handleChange} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>E-Mail / Telefon</label>
            <input name="contactPersonContact" value={form.contactPersonContact} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionTitle}>Weitere Kontaktpersonen (Freitext)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-800">Kassier</p>
            <input name="treasurerName" value={form.treasurerName} onChange={handleChange} className={inputClass} placeholder="Name" />
            <input name="treasurerContact" value={form.treasurerContact} onChange={handleChange} className={inputClass} placeholder="E-Mail / Telefon" />
            <textarea name="treasurerNotes" value={form.treasurerNotes} onChange={handleChange} rows={2} className={CRM_TEXTAREA} placeholder="Notizen (z.B. Zahlungswünsche, Erreichbarkeit)" />
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 space-y-3">
            <p className="text-sm font-medium text-gray-800">Social-Media-Verantwortliche</p>
            <input name="socialMediaName" value={form.socialMediaName} onChange={handleChange} className={inputClass} placeholder="Name" />
            <input name="socialMediaContact" value={form.socialMediaContact} onChange={handleChange} className={inputClass} placeholder="E-Mail / Telefon / Instagram" />
            <textarea name="socialMediaNotes" value={form.socialMediaNotes} onChange={handleChange} rows={2} className={CRM_TEXTAREA} placeholder="Notizen (Kanäle, Verlinkungen)" />
          </div>
        </div>
      </div>

      <div className={sectionClass}>
        <p className={sectionTitle}>Termine</p>
        <p className="text-xs text-gray-500">Masse-Fristen (bis zu 3 Termine)</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="date" name="measurementDeadline1" value={form.measurementDeadline1} onChange={handleChange} className={inputClass} />
          <input type="date" name="measurementDeadline2" value={form.measurementDeadline2} onChange={handleChange} className={inputClass} />
          <input type="date" name="measurementDeadline3" value={form.measurementDeadline3} onChange={handleChange} className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Anprobe</label>
            <input type="date" name="fittingDate" value={form.fittingDate} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Abholung (geplant)</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <p className="text-xs text-gray-500">Lieferung (bis zu 2 Termine)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange} className={inputClass} />
          <input type="date" name="deliveryDate2" value={form.deliveryDate2} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className={`${sectionClass} rounded-xl bg-amber-50 border border-amber-200 p-4`}>
        <label className="flex items-center gap-2 text-sm text-gray-800 font-medium">
          <input type="checkbox" name="hasMajorCostume" checked={form.hasMajorCostume} onChange={handleChange} className="rounded border-gray-300" />
          Mit Major-Kostüm
        </label>
        {form.hasMajorCostume && (
          <div className="mt-3">
            <label className={labelClass}>Notizen Majorkostüm (nur intern sichtbar)</label>
            <textarea name="majorCostumeNotes" value={form.majorCostumeNotes} onChange={handleChange} rows={3} className={CRM_TEXTAREA} placeholder="Interne Notizen zum Major-Kostüm…" />
          </div>
        )}
      </div>

      {isEditing && (
        <>
          <div className={sectionClass}>
            <p className={sectionTitle}>Status (auch über SETZEN im Kopf)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Kundenstatus / Workflow</label>
                <select name="customerStatus" value={form.customerStatus} onChange={handleChange} className={inputClass}>
                  {CUSTOMER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Interner Status</label>
                <select name="internalStatus" value={form.internalStatus} onChange={handleChange} className={inputClass}>
                  {INTERNAL_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={sectionClass}>
            <p className={sectionTitle}>Finanzen</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Gesamtbetrag CHF</label>
                <input type="number" name="totalAmount" value={form.totalAmount} onChange={handleChange} step="0.01" className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Anzahlung erforderlich CHF</label>
                <input type="number" name="depositRequired" value={form.depositRequired} onChange={handleChange} step="0.01" className={inputClass} placeholder="0.00" />
              </div>
              <div>
                <label className={labelClass}>Bezahlt CHF</label>
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
          </div>
        </>
      )}

      <div>
        <label className={labelClass}>Beschreibung (für Kunde sichtbar)</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={CRM_TEXTAREA} />
      </div>
      <div>
        <label className={labelClass}>Notizen für Kunden (Portal)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={CRM_TEXTAREA} />
      </div>
      <div>
        <label className={labelClass}>Interne Notiz</label>
        <textarea name="internalNotes" value={form.internalNotes} onChange={handleChange} rows={3} className={CRM_TEXTAREA} />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
      {success && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">{success}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium">
            Abbrechen
          </button>
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50">
            {saving ? "…" : isEditing ? "Speichern" : "Auftrag erstellen"}
          </button>
        </div>
      </div>
    </form>
  );
}
