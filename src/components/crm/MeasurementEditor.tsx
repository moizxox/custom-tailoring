"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface Measurement {
  id: string;
  customerId: string;
  fields: Record<string, number>;
  status: string;
  notes: string | null;
  updatedAt: string;
}

const MEASUREMENT_FIELDS = [
  { key: "chest", label: "Brustumfang", unit: "cm" },
  { key: "waist", label: "Taillenumfang", unit: "cm" },
  { key: "hips", label: "Hüftumfang", unit: "cm" },
  { key: "shoulder_width", label: "Schulterbreite", unit: "cm" },
  { key: "sleeve_length", label: "Ärmellänge", unit: "cm" },
  { key: "torso_length", label: "Rückenlänge", unit: "cm" },
  { key: "inseam", label: "Innenbeinlänge", unit: "cm" },
  { key: "neck", label: "Halsumfang", unit: "cm" },
  { key: "height", label: "Körpergrösse", unit: "cm" },
  { key: "weight", label: "Gewicht", unit: "kg" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Ausstehend", color: "bg-gray-500/10 text-gray-400" },
  { value: "partial", label: "Teilweise", color: "bg-amber-500/10 text-amber-400" },
  { value: "complete", label: "Komplett", color: "bg-emerald-500/10 text-emerald-400" },
  { value: "checked", label: "Geprüft", color: "bg-blue-500/10 text-blue-400" },
];

interface Props {
  projectId: string;
  initialMeasurements: Measurement[];
}

export function MeasurementEditor({ projectId, initialMeasurements }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [selected, setSelected] = useState<Measurement | null>(
    initialMeasurements[0] ?? null
  );
  const [fields, setFields] = useState<Record<string, string>>(
    Object.fromEntries(
      MEASUREMENT_FIELDS.map((f) => [f.key, selected?.fields[f.key]?.toString() ?? ""])
    )
  );
  const [status, setStatus] = useState(selected?.status ?? "pending");
  const [notes, setNotes] = useState(selected?.notes ?? "");
  const [saving, setSaving] = useState(false);

  function selectMeasurement(m: Measurement) {
    setSelected(m);
    setFields(Object.fromEntries(MEASUREMENT_FIELDS.map((f) => [f.key, m.fields[f.key]?.toString() ?? ""])));
    setStatus(m.status);
    setNotes(m.notes ?? "");
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    const values: Record<string, number> = {};
    for (const [key, val] of Object.entries(fields)) {
      const num = parseFloat(val);
      if (!Number.isNaN(num) && num > 0) values[key] = num;
    }
    try {
      await fetch(`/admin/api/crm/measurements/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: values, status, notes }),
      });
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  }

  async function handleNew() {
    const res = await fetch(`/admin/api/crm/measurements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    if (res.ok) startTransition(() => router.refresh());
  }

  const inputClass = "w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors text-right";

  return (
    <div className="space-y-4">
      {/* Select measurement */}
      {initialMeasurements.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {initialMeasurements.map((m, i) => (
            <button
              key={m.id}
              onClick={() => selectMeasurement(m)}
              className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                selected?.id === m.id ? "bg-violet-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Masse #{i + 1} · {new Date(m.updatedAt).toLocaleDateString("de-CH")}
            </button>
          ))}
          <button onClick={handleNew} className="text-xs px-3 py-1.5 rounded-xl bg-gray-800 text-gray-500 hover:text-white transition-colors">
            + Neue Massnahme
          </button>
        </div>
      )}

      {initialMeasurements.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500 mb-4">Noch keine Masse erfasst.</p>
          <button onClick={handleNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors">
            + Massnahme erstellen
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Masse bearbeiten</h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs rounded-xl bg-gray-800 border border-white/10 px-3 py-1.5 text-white focus:outline-none"
            >
              {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
            {MEASUREMENT_FIELDS.map((field) => (
              <div key={field.key}>
                <label className="block text-[10px] text-gray-500 mb-1">
                  {field.label} ({field.unit})
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={fields[field.key] ?? ""}
                  onChange={(e) => setFields((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className={inputClass}
                  placeholder="—"
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1.5">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-violet-500 transition-colors resize-y"
              placeholder="Besonderheiten, Kommentare…"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? "Wird gespeichert…" : "Masse speichern"}
          </button>
        </div>
      )}
    </div>
  );
}
