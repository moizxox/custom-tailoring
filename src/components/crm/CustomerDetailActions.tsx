"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Mail, Link2, RefreshCw, Loader2 } from "lucide-react";

interface Props {
  customerId: string;
  accessCode: string;
}

export function CustomerDetailActions({ customerId, accessCode }: Props) {
  const router = useRouter();
  const [code, setCode] = useState(accessCode);
  const [copied, setCopied] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [sendingLink, setSendingLink] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState("");

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendAccessCode() {
    setSendingCode(true);
    setMessage("");
    try {
      const res = await fetch(`/admin/api/crm/customers/${customerId}/send-access-code`, { method: "POST" });
      const data = await res.json();
      setMessage(res.ok ? "Zugangscode gesendet." : (data.error ?? "Fehler beim Senden."));
    } catch {
      setMessage("Verbindungsfehler.");
    } finally {
      setSendingCode(false);
    }
  }

  async function sendMagicLink() {
    setSendingLink(true);
    setMessage("");
    try {
      const res = await fetch(`/admin/api/crm/customers/${customerId}/send-magic-link`, { method: "POST" });
      const data = await res.json();
      setMessage(res.ok ? "Magic-Link gesendet." : (data.error ?? "Fehler beim Senden."));
    } catch {
      setMessage("Verbindungsfehler.");
    } finally {
      setSendingLink(false);
    }
  }

  async function regenerateCode() {
    if (!confirm("Neuen Zugangscode generieren? Der alte Code wird ungültig.")) return;
    setRegenerating(true);
    setMessage("");
    try {
      const res = await fetch(`/admin/api/crm/customers/${customerId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerateCode: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setCode(data.customer.accessCode);
        setMessage("Neuer Code generiert.");
        router.refresh();
      } else {
        setMessage(data.error ?? "Fehler.");
      }
    } catch {
      setMessage("Verbindungsfehler.");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm rounded-xl px-3 py-2">
        <span className="text-xs text-gray-500">Zugangscode:</span>
        <code className="text-sm font-mono text-emerald-600">{code}</code>
        <button
          onClick={copyCode}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title="Code kopieren"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          onClick={sendAccessCode}
          disabled={sendingCode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          {sendingCode ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
          Code senden
        </button>
        <button
          onClick={sendMagicLink}
          disabled={sendingLink}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-violet-50 text-violet-700 hover:bg-violet-100 transition-colors disabled:opacity-50"
        >
          {sendingLink ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
          Magic-Link
        </button>
        <button
          onClick={regenerateCode}
          disabled={regenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {regenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Neu generieren
        </button>
      </div>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  );
}
