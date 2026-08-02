"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface AppointmentRow {
  id: string;
  locationId: string;
  serviceLabel: string;
  date: string;
  time: string;
  durationMin: number;
  name: string;
  email: string;
  phone: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
}

interface BlockRow {
  id: string;
  locationId: string | null;
  startAt: string;
  endAt: string;
  reason: string | null;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Ausstehend",
  confirmed: "Bestätigt",
  cancelled: "Storniert",
  completed: "Erledigt",
};

export function BookingAdminClient({
  initialAppointments,
  initialBlocks,
}: {
  initialAppointments: AppointmentRow[];
  initialBlocks: BlockRow[];
}) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [blocks, setBlocks] = useState(initialBlocks);
  const [blockForm, setBlockForm] = useState({
    locationId: "",
    startAt: "",
    endAt: "",
    reason: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/admin/api/crm/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      alert("Status konnte nicht gespeichert werden.");
      return;
    }
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    router.refresh();
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/admin/api/crm/booking-blocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationId: blockForm.locationId || null,
          startAt: blockForm.startAt,
          endAt: blockForm.endAt,
          reason: blockForm.reason || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Block konnte nicht erstellt werden.");
        return;
      }
      setBlocks((prev) => [data.block, ...prev]);
      setBlockForm({ locationId: "", startAt: "", endAt: "", reason: "" });
      router.refresh();
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setSaving(false);
    }
  }

  async function removeBlock(id: string) {
    if (!confirm("Zeitblock wirklich löschen?")) return;
    const res = await fetch(`/admin/api/crm/booking-blocks/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Löschen fehlgeschlagen.");
      return;
    }
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="bg-violet-50 border border-violet-100 rounded-2xl p-5 text-sm text-violet-900 leading-relaxed">
        <p className="font-semibold mb-1">So blockieren Sie Zeiten</p>
        <p>
          Unten können Sie Zeiträume sperren (ganzer Tag oder einzelne Stunden). Online-Buchungen in diesem
          Fenster werden abgelehnt. Pro Terminart stellen Sie die Dauer unter{" "}
          <strong>Admin → Seiten → Termin → Online booking → Appointment types</strong> ein (z. B. 10 oder 60 Min.).
        </p>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Zeitblöcke</h2>
        <form onSubmit={addBlock} className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <label className="text-xs text-gray-600 md:col-span-1">
            Standort
            <select
              value={blockForm.locationId}
              onChange={(e) => setBlockForm((f) => ({ ...f, locationId: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            >
              <option value="">Alle</option>
              <option value="pratteln">Pratteln</option>
              <option value="therwil">Therwil</option>
            </select>
          </label>
          <label className="text-xs text-gray-600">
            Von
            <input
              type="datetime-local"
              required
              value={blockForm.startAt}
              onChange={(e) => setBlockForm((f) => ({ ...f, startAt: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-gray-600">
            Bis
            <input
              type="datetime-local"
              required
              value={blockForm.endAt}
              onChange={(e) => setBlockForm((f) => ({ ...f, endAt: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-gray-600 md:col-span-1">
            Grund
            <input
              value={blockForm.reason}
              onChange={(e) => setBlockForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Urlaub, Anprobe…"
              className="mt-1 w-full border border-gray-200 rounded-lg px-2 py-2 text-sm"
            />
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium disabled:opacity-50"
            >
              {saving ? "…" : "Blocken"}
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {blocks.length === 0 ? (
            <p className="px-4 py-8 text-sm text-gray-500 text-center">Keine aktiven Sperrzeiten.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {blocks.map((b) => (
                <li key={b.id} className="px-4 py-3 flex items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(b.startAt).toLocaleString("de-CH")} → {new Date(b.endAt).toLocaleString("de-CH")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {b.locationId ?? "Alle Standorte"}
                      {b.reason ? ` · ${b.reason}` : ""}
                    </p>
                  </div>
                  <button type="button" onClick={() => removeBlock(b.id)} className="text-xs text-red-500 hover:text-red-600">
                    Löschen
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Termin-Anfragen</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {appointments.length === 0 ? (
            <p className="px-4 py-8 text-sm text-gray-500 text-center">Noch keine Anfragen.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
                  <th className="px-4 py-3">Wann</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Kunde</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {a.date} · {a.time}
                      </p>
                      <p className="text-xs text-gray-500">
                        {a.locationId} · {a.durationMin} Min.
                      </p>
                    </td>
                    <td className="px-4 py-3">{a.serviceLabel}</td>
                    <td className="px-4 py-3">
                      <p>{a.name}</p>
                      <p className="text-xs text-gray-500">{a.email}</p>
                      {a.phone && <p className="text-xs text-gray-500">{a.phone}</p>}
                      {a.notes && <p className="text-xs text-gray-400 mt-1">{a.notes}</p>}
                    </td>
                    <td className="px-4 py-3">{STATUS_LABELS[a.status] ?? a.status}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {a.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(a.id, "confirmed")}
                          className="text-xs font-medium text-emerald-600 hover:underline"
                        >
                          Bestätigen
                        </button>
                      )}
                      {a.status !== "cancelled" && (
                        <button
                          type="button"
                          onClick={() => updateStatus(a.id, "cancelled")}
                          className="text-xs font-medium text-red-500 hover:underline"
                        >
                          Stornieren
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
