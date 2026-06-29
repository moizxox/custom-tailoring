"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LoginFormProps {
  nextPath?: string;
  tokenHint?: string;
}

export function LoginForm({ nextPath = "/kundenbereich", tokenHint }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/kundenbereich/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, accessCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }

      router.push(data.redirect ?? nextPath);
      router.refresh();
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 max-w-md w-full flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-2">Kundenbereich</h1>
        <p className="font-sans text-sm text-charcoal-light leading-relaxed">
          Massblätter und Projektunterlagen sind nur für Kundinnen und Kunden mit
          laufendem Auftrag zugänglich.
        </p>
      </div>

      {tokenHint && (
        <p className="text-xs font-sans text-periwinkle-dark bg-periwinkle-lighter/50 rounded-lg px-3 py-2">
          {tokenHint}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-sans font-medium text-charcoal-light">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          placeholder="ihre@email.ch"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-xs font-sans font-medium text-charcoal-light">
          Persönlicher Zugangscode
        </label>
        <input
          id="code"
          type="text"
          autoComplete="one-time-code"
          required
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          className="input-field"
          placeholder="Code aus Ihrer Auftragsbestätigung"
        />
        <p className="text-[11px] text-charcoal-lighter">
          Den Code erhalten Sie per E-Mail, sobald Ihr Auftrag bestätigt wurde.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary justify-center w-full">
        {loading ? "Wird angemeldet…" : "Anmelden"}
      </button>

      <p className="text-[11px] text-charcoal-lighter text-center leading-relaxed">
        Noch kein Auftrag?{" "}
        <Link href="/termin" className="text-periwinkle-dark hover:underline">
          Termin buchen
        </Link>
      </p>
    </form>
  );
}
