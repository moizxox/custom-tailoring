"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2 } from "lucide-react";
import { CRM_INPUT_SM } from "@/components/crm/crm-styles";

interface Member {
  customerId: string;
  customerName: string;
  customerEmail: string;
  costumeVariant: string | null;
  measurementStatus: string;
  notes: string | null;
  sortOrder: number;
}

const MEASUREMENT_STATUS_OPTIONS = [
  { value: "pending", label: "Ausstehend", color: "text-gray-400" },
  { value: "partial", label: "Teilweise", color: "text-amber-400" },
  { value: "complete", label: "Komplett", color: "text-emerald-400" },
  { value: "checked", label: "Geprüft", color: "text-blue-400" },
];

interface Props {
  groupId: string;
  members: Member[];
}

export function GroupMemberTable({ groupId, members: initialMembers }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [newEmail, setNewEmail] = useState("");
  const [newVariant, setNewVariant] = useState("");
  const [addingMember, setAddingMember] = useState(false);
  const [addError, setAddError] = useState("");

  async function handleAddMember() {
    if (!newEmail.trim()) return;
    setAddingMember(true);
    setAddError("");
    try {
      const res = await fetch(`/admin/api/crm/groups/${groupId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, costumeVariant: newVariant }),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.error ?? "Fehler."); return; }
      setNewEmail(""); setNewVariant("");
      startTransition(() => router.refresh());
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemove(customerId: string) {
    if (!confirm("Mitglied aus Gruppe entfernen?")) return;
    await fetch(`/admin/api/crm/groups/${groupId}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId }),
    });
    startTransition(() => router.refresh());
  }

  async function handleStatusChange(customerId: string, measurementStatus: string) {
    await fetch(`/admin/api/crm/groups/${groupId}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, measurementStatus }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">Mitglieder ({initialMembers.length})</h2>
      </div>

      {/* Add member */}
      <div className="px-5 py-4 border-b border-gray-200 bg-white/[0.01]">
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="E-Mail des Kunden…"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={`flex-1 ${CRM_INPUT_SM}`}
            onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
          />
          <input
            type="text"
            placeholder="Kostümvariante (opt.)"
            value={newVariant}
            onChange={(e) => setNewVariant(e.target.value)}
            className={`w-36 ${CRM_INPUT_SM}`}
          />
          <button
            onClick={handleAddMember}
            disabled={!newEmail.trim() || addingMember}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors disabled:opacity-40 flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            {addingMember ? "…" : "Hinzufügen"}
          </button>
        </div>
        {addError && <p className="text-xs text-red-400 mt-2">{addError}</p>}
      </div>

      {initialMembers.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-600">Noch keine Mitglieder in dieser Gruppe.</p>
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium hidden md:table-cell">Kostümvariante</th>
              <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">Massnahme</th>
              <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {initialMembers.map((member) => (
              <tr key={member.customerId} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-gray-900 text-sm">{member.customerName}</p>
                  <p className="text-xs text-gray-500">{member.customerEmail}</p>
                </td>
                <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">
                  {member.costumeVariant ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={member.measurementStatus}
                    onChange={(e) => handleStatusChange(member.customerId, e.target.value)}
                    className="text-xs rounded-lg bg-white border border-gray-200 px-2 py-1 text-gray-900 focus:outline-none focus:border-violet-500"
                  >
                    {MEASUREMENT_STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleRemove(member.customerId)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                    title="Entfernen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
