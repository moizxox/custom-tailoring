"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PAYMENT_KINDS, formatMoney } from "@/lib/crm/projects";
import { CRM_INPUT } from "@/components/crm/crm-styles";

interface Payment {
  id: string;
  amount: number | string;
  kind: string;
  paidAt: string;
  note: string | null;
}

interface Props {
  projectId: string;
  payments: Payment[];
  totalAmount: number | null;
  paidAmount: number | null;
  depositRequired: number | null;
}

export function PaymentsPanel({
  projectId,
  payments: initial,
  totalAmount,
  paidAmount,
  depositRequired,
}: Props) {
  const router = useRouter();
  const [payments, setPayments] = useState(initial);
  const [amount, setAmount] = useState("");
  const [kind, setKind] = useState("deposit");
  const [note, setNote] = useState("");
  const [paidAt, setPaidAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function addPayment(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/projects/${projectId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          kind,
          note: note.trim() || null,
          paidAt: paidAt || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data as { error?: string }).error ?? "Fehler.");
        return;
      }
      setAmount("");
      setNote("");
      setPaidAt("");
      router.refresh();
      if ((data as { payment?: Payment }).payment) {
        setPayments((prev) => [(data as { payment: Payment }).payment, ...prev]);
      }
    } catch {
      setError("Keine Verbindung.");
    } finally {
      setSaving(false);
    }
  }

  async function removePayment(paymentId: string) {
    if (!window.confirm("Zahlung löschen?")) return;
    const res = await fetch(`/admin/api/crm/projects/${projectId}/payments/${paymentId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setPayments((prev) => prev.filter((p) => p.id !== paymentId));
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Gesamtbetrag</p>
          <p className="text-lg font-semibold text-gray-900">CHF {formatMoney(totalAmount)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Anzahlung erforderlich</p>
          <p className="text-lg font-semibold text-gray-900">CHF {formatMoney(depositRequired)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs text-gray-500">Bezahlt</p>
          <p className="text-lg font-semibold text-emerald-700">CHF {formatMoney(paidAmount)}</p>
        </div>
      </div>

      <form onSubmit={addPayment} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <p className="text-sm font-medium text-gray-800">Zahlung erfassen</p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Betrag CHF"
            className={CRM_INPUT}
          />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className={CRM_INPUT}>
            {PAYMENT_KINDS.map((k) => (
              <option key={k.value} value={k.value}>{k.label}</option>
            ))}
          </select>
          <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={CRM_INPUT} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notiz" className={CRM_INPUT} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-medium disabled:opacity-50"
        >
          {saving ? "…" : "Hinzufügen"}
        </button>
      </form>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Art</th>
              <th className="px-4 py-3">Betrag</th>
              <th className="px-4 py-3">Notiz</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Noch keine Zahlungen</td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(p.paidAt).toLocaleDateString("de-CH")}
                  </td>
                  <td className="px-4 py-3">
                    {PAYMENT_KINDS.find((k) => k.value === p.kind)?.label ?? p.kind}
                  </td>
                  <td className="px-4 py-3 font-medium">CHF {formatMoney(p.amount)}</td>
                  <td className="px-4 py-3 text-gray-500">{p.note ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => removePayment(p.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Löschen
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
