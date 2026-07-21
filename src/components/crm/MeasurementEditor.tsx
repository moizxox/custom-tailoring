"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CRM_INPUT, CRM_TEXTAREA } from "@/components/crm/crm-styles";
import {
  getFieldsForCategory,
  getRequiredFieldKeys,
  type MeasurementField,
} from "@/lib/portal/measurement-fields";
import type { CostumeCategory } from "@/lib/portal/customers";

interface Measurement {
  id: string;
  customerId: string;
  customerName?: string | null;
  fields: Record<string, number>;
  status: string;
  notes: string | null;
  updatedAt: string;
}

interface Person {
  id: string;
  name: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Ausstehend", color: "bg-gray-100 text-gray-600" },
  { value: "partial", label: "Teilweise", color: "bg-amber-50 text-amber-700" },
  { value: "complete", label: "Komplett", color: "bg-emerald-50 text-emerald-700" },
  { value: "checked", label: "Geprüft", color: "bg-blue-50 text-blue-700" },
];

function resolveCategory(raw: string | null | undefined): CostumeCategory {
  if (raw === "Damen" || raw === "Kinder" || raw === "Herren") return raw;
  return "Herren";
}

function missingKeys(
  fields: Record<string, number>,
  category: CostumeCategory
): string[] {
  return getRequiredFieldKeys(category).filter((key) => {
    const v = fields[key];
    return v == null || Number.isNaN(Number(v)) || Number(v) <= 0;
  });
}

interface Props {
  projectId: string;
  initialMeasurements: Measurement[];
  people: Person[];
  costumeCategory: string | null;
}

export function MeasurementEditor({
  projectId,
  initialMeasurements,
  people,
  costumeCategory,
}: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const category = resolveCategory(costumeCategory);
  const fieldDefs: MeasurementField[] = useMemo(
    () => getFieldsForCategory(category),
    [category]
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    initialMeasurements[0]?.id ?? null
  );
  const selected = initialMeasurements.find((m) => m.id === selectedId) ?? null;
  const [fields, setFields] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fieldDefs.map((f) => [f.key, selected?.fields[f.key]?.toString() ?? ""])
    )
  );
  const [status, setStatus] = useState(selected?.status ?? "pending");
  const [notes, setNotes] = useState(selected?.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [newCustomerId, setNewCustomerId] = useState(people[0]?.id ?? "");

  function selectMeasurement(m: Measurement) {
    setSelectedId(m.id);
    setFields(
      Object.fromEntries(fieldDefs.map((f) => [f.key, m.fields[f.key]?.toString() ?? ""]))
    );
    setStatus(m.status);
    setNotes(m.notes ?? "");
    setError("");
  }

  async function handleSave() {
    if (!selected) return;
    setSaving(true);
    setError("");
    const values: Record<string, number> = {};
    for (const [key, val] of Object.entries(fields)) {
      const num = parseFloat(val);
      if (!Number.isNaN(num) && num > 0) values[key] = num;
    }
    const missing = missingKeys(values, category);
    const nextStatus =
      status === "checked"
        ? "checked"
        : missing.length === 0
          ? "complete"
          : Object.keys(values).length === 0
            ? "pending"
            : "partial";
    try {
      const res = await fetch(`/admin/api/crm/measurements/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields: values, status: nextStatus, notes }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Masse konnten nicht gespeichert werden.");
        return;
      }
      setStatus(nextStatus);
      startTransition(() => router.refresh());
    } catch {
      setError("Keine Verbindung zum Server.");
    } finally {
      setSaving(false);
    }
  }

  async function handleNew(customerId?: string) {
    const target = customerId || newCustomerId || people[0]?.id;
    if (!target) {
      setError("Bitte zuerst einen Kunden oder Gruppenmitglied zuweisen.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/measurements`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, customerId: target }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Massnahme konnte nicht erstellt werden.");
        return;
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Keine Verbindung zum Server.");
    } finally {
      setCreating(false);
    }
  }

  async function handleCreateMissing() {
    const existing = new Set(initialMeasurements.map((m) => m.customerId));
    const missingPeople = people.filter((p) => !existing.has(p.id));
    if (missingPeople.length === 0) {
      setError("Für alle Personen gibt es bereits Masse.");
      return;
    }
    setCreating(true);
    setError("");
    try {
      for (const person of missingPeople) {
        const res = await fetch(`/admin/api/crm/measurements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId, customerId: person.id }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? `Fehler bei ${person.name}`);
          return;
        }
      }
      startTransition(() => router.refresh());
    } catch {
      setError("Keine Verbindung zum Server.");
    } finally {
      setCreating(false);
    }
  }

  const overview = people.map((person) => {
    const m = initialMeasurements.find((x) => x.customerId === person.id);
    const missing = m ? missingKeys(m.fields, category) : getRequiredFieldKeys(category);
    return { person, measurement: m ?? null, missing };
  });

  const completeCount = overview.filter(
    (o) => o.measurement && o.missing.length === 0
  ).length;
  const missingPeopleCount = overview.filter((o) => !o.measurement || o.missing.length > 0).length;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Masse-Übersicht</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {completeCount}/{people.length || overview.length} komplett · {missingPeopleCount} mit fehlenden Angaben
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {people.length > 0 && (
              <>
                <select
                  value={newCustomerId}
                  onChange={(e) => setNewCustomerId(e.target.value)}
                  className="text-xs rounded-xl bg-white border border-gray-200 px-3 py-1.5 text-gray-900"
                >
                  {people.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={creating || !newCustomerId}
                  onClick={() => handleNew()}
                  className="text-xs px-3 py-1.5 rounded-xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {creating ? "…" : "+ Massnahme"}
                </button>
                <button
                  type="button"
                  disabled={creating}
                  onClick={handleCreateMissing}
                  className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Fehlende anlegen
                </button>
              </>
            )}
          </div>
        </div>

        {people.length === 0 ? (
          <p className="text-sm text-gray-500">
            Keine Personen. Bitte Kunde oder Gruppe mit Mitgliedern im Projekt hinterlegen und speichern.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                  <th className="py-2 pr-3 font-medium">Person</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 pr-3 font-medium">Fehlend</th>
                  <th className="py-2 font-medium">Aktion</th>
                </tr>
              </thead>
              <tbody>
                {overview.map(({ person, measurement, missing }) => {
                  const statusOpt = STATUS_OPTIONS.find((s) => s.value === (measurement?.status ?? "pending"));
                  return (
                    <tr key={person.id} className="border-b border-gray-50">
                      <td className="py-2.5 pr-3 text-gray-900">{person.name}</td>
                      <td className="py-2.5 pr-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusOpt?.color ?? ""}`}>
                          {measurement ? statusOpt?.label ?? measurement.status : "Keine Masse"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-gray-500">
                        {missing.length === 0
                          ? "—"
                          : missing
                              .slice(0, 8)
                              .map((k) => fieldDefs.find((f) => f.key === k)?.letter ?? k)
                              .join(", ") + (missing.length > 8 ? "…" : "")}
                      </td>
                      <td className="py-2.5">
                        {measurement ? (
                          <button
                            type="button"
                            onClick={() => selectMeasurement(measurement)}
                            className="text-xs text-violet-600 hover:underline"
                          >
                            Bearbeiten
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={creating}
                            onClick={() => handleNew(person.id)}
                            className="text-xs text-violet-600 hover:underline disabled:opacity-50"
                          >
                            Anlegen
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
      )}

      {!selected && initialMeasurements.length === 0 && people.length > 0 && (
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 mb-3">Noch keine Masse erfasst.</p>
          <button
            type="button"
            onClick={() => handleNew()}
            disabled={creating || !newCustomerId}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50"
          >
            + Massnahme erstellen
          </button>
        </div>
      )}

      {selected && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Masse bearbeiten — {selected.customerName ?? people.find((p) => p.id === selected.customerId)?.name ?? "Person"}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Massblatt-Felder ({category}) · zuletzt {new Date(selected.updatedAt).toLocaleDateString("de-CH")}
              </p>
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="text-xs rounded-xl bg-white border border-gray-200 px-3 py-1.5 text-gray-900"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {initialMeasurements.length > 1 && (
            <div className="flex gap-2 flex-wrap mb-4">
              {initialMeasurements.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMeasurement(m)}
                  className={`text-xs px-3 py-1.5 rounded-xl transition-colors ${
                    selected.id === m.id
                      ? "bg-violet-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {m.customerName ?? people.find((p) => p.id === m.customerId)?.name ?? m.customerId.slice(0, 6)}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-5">
            {fieldDefs.map((field) => (
              <div key={field.key}>
                <label className="block text-[10px] text-gray-500 mb-1">
                  {field.letter} · {field.label} ({field.unit})
                  {field.required ? " *" : ""}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={fields[field.key] ?? ""}
                  onChange={(e) =>
                    setFields((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className={`${CRM_INPUT} text-right`}
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
              className={CRM_TEXTAREA}
              placeholder="Besonderheiten, Kommentare…"
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Wird gespeichert…" : "Masse speichern"}
          </button>
        </div>
      )}
    </div>
  );
}
