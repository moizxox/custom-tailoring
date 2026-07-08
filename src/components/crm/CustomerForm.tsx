"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerFormProps {
  customerId?: string;
  initialData?: {
    name: string;
    email: string;
    phone: string;
    notes: string;
    location: string;
    role: "customer" | "group_leader";
  };
}

export function CustomerForm({ customerId, initialData }: CustomerFormProps) {
  const router = useRouter();
  const isEditing = !!customerId;

  const [form, setForm] = useState({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    notes: initialData?.notes ?? "",
    location: initialData?.location ?? "",
    role: initialData?.role ?? "customer",
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
      const url = isEditing
        ? `/admin/api/crm/customers/${customerId}`
        : "/admin/api/crm/customers";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Fehler beim Speichern.");
        return;
      }

      if (isEditing) {
        setSuccess("Gespeichert.");
        router.refresh();
      } else {
        router.push(`/admin/crm/customers/${data.customer.id}`);
      }
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors";
  const labelClass = "block text-xs text-gray-500 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="Max Muster" />
        </div>
        <div>
          <label className={labelClass}>E-Mail *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className={inputClass} placeholder="max@example.com" />
        </div>
        <div>
          <label className={labelClass}>Telefon</label>
          <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+41 79 000 00 00" />
        </div>
        <div>
          <label className={labelClass}>Ort</label>
          <input name="location" value={form.location} onChange={handleChange} className={inputClass} placeholder="Basel" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Rolle</label>
        <select name="role" value={form.role} onChange={handleChange} className={inputClass}>
          <option value="customer">Kunde</option>
          <option value="group_leader">Gruppenleiter</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>Notizen (intern)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Interne Notizen zum Kunden…"
        />
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
          {success}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? "Wird gespeichert…" : isEditing ? "Speichern" : "Kunde erstellen"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
