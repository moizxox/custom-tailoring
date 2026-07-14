"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, UserPlus, Check, Loader2 } from "lucide-react";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  message: string;
  read: boolean;
  convertedCustomerId: string | null;
  convertedAt: string | null;
  createdAt: string;
}

interface Props {
  submission: Submission;
}

export function ConvertSubmissionPanel({ submission }: Props) {
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState(`Anfrage — ${submission.name}`);
  const [sendAccessCode, setSendAccessCode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ customerId: string; projectId?: string } | null>(null);

  async function handleConvert() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/admin/api/crm/contact-submissions/${submission.id}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ createProject: true, projectTitle, sendAccessCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Konvertierung fehlgeschlagen.");
        return;
      }
      setSuccess({
        customerId: data.customer.id,
        projectId: data.project?.id,
      });
      router.refresh();
    } catch {
      setError("Verbindungsfehler.");
    } finally {
      setLoading(false);
    }
  }

  if (submission.convertedCustomerId || success) {
    const customerId = success?.customerId ?? submission.convertedCustomerId!;
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-emerald-700 mb-3">
          <Check className="w-4 h-4" />
          <p className="text-sm font-medium">Als Kunde angelegt</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/admin/crm/customers/${customerId}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Kunde anzeigen
          </Link>
          {success?.projectId && (
            <Link
              href={`/admin/crm/projects/${success.projectId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
            >
              Projekt anzeigen
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">In Kunde umwandeln</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Projekttitel</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-violet-500"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={sendAccessCode}
            onChange={(e) => setSendAccessCode(e.target.checked)}
            className="rounded"
          />
          Zugangscode per E-Mail senden
        </label>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
        )}
        <button
          onClick={handleConvert}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          Kunde + Projekt anlegen
        </button>
      </div>
    </div>
  );
}

export function MarkReadButton({ submissionId, isRead }: { submissionId: string; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (isRead) return null;

  async function handleMarkRead() {
    setLoading(true);
    try {
      await fetch(`/admin/api/crm/contact-submissions/${submissionId}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleMarkRead}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors disabled:opacity-50"
    >
      <Mail className="w-3.5 h-3.5" />
      Als gelesen markieren
    </button>
  );
}
