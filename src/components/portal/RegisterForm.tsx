"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/kundenbereich/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, password: password || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Registrierung fehlgeschlagen.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-card p-8 md:p-10 max-w-md w-full text-center">
        <h1 className="font-serif text-2xl text-charcoal mb-3">E-Mail gesendet</h1>
        <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-6">
          Wir haben Ihnen einen Bestätigungslink an <strong>{email}</strong> gesendet.
          Bitte klicken Sie auf den Link, um Ihr Konto zu aktivieren.
        </p>
        <Link href="/kundenbereich/login" className="btn-primary">
          Zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 max-w-md w-full flex flex-col gap-5">
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-2">Konto erstellen</h1>
        <p className="font-sans text-sm text-charcoal-light leading-relaxed">
          Registrieren Sie sich für den Kundenbereich. Nach der E-Mail-Bestätigung erhalten Sie Ihren Zugangscode.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-sans font-medium text-charcoal-light">Name</label>
        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field" placeholder="Max Muster" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-sans font-medium text-charcoal-light">E-Mail</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="ihre@email.ch" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-xs font-sans font-medium text-charcoal-light">Telefon (optional)</label>
        <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+41 79 000 00 00" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-sans font-medium text-charcoal-light">Passwort (optional)</label>
        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Alternativ zum Zugangscode" />
        <p className="text-[11px] text-charcoal-lighter">Mit Passwort können Sie sich auch ohne Zugangscode anmelden.</p>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}

      <button type="submit" disabled={loading} className="btn-primary justify-center w-full">
        {loading ? "Wird registriert…" : "Registrieren"}
      </button>

      <p className="text-[11px] text-charcoal-lighter text-center">
        Bereits registriert?{" "}
        <Link href="/kundenbereich/login" className="text-periwinkle-dark hover:underline">Anmelden</Link>
      </p>
    </form>
  );
}
