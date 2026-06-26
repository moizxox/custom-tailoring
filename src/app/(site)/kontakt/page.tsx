"use client";

import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { useState } from "react";
// Note: client component — add metadata via a parent layout.tsx if needed

const CONTACT_INFO = [
  {
    icon: "sewing-shop-fashion-sewing-tailoring.svg",
    label: "Adresse",
    lines: ["Greifengasse 20", "4052 Basel, Schweiz"],
  },
  {
    icon: "tape-measure-sewing-tailoring-size.svg",
    label: "Telefon",
    lines: ["+41 31 312 45 67"],
    href: "tel:+41313124567",
  },
  {
    icon: "pencil-sewing-tailoring-drawing.svg",
    label: "E-Mail",
    lines: ["hallo@kostuemschneiderei-basel.ch"],
    href: "mailto:hallo@kostuemschneiderei-basel.ch",
  },
  {
    icon: "pin-cushion-handcraft-sewing-tailoring.svg",
    label: "Öffnungszeiten",
    lines: ["Mo – Fr: 08:30 – 17:30 Uhr", "Sa: nach Vereinbarung"],
  },
];

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setSent(true);
  };

  return (
    <>
      <PageHero
        label="Sprechen wir"
        title="Kontakt"
        titleAccent="Kontakt"
        subtitle="Wir freuen uns auf Ihre Nachricht. Persönlich, per Telefon oder E-Mail."
        iconSlug="pencil-sewing-tailoring-drawing.svg"
        breadcrumbs={[{ label: "Kontakt", href: "/kontakt" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info cards */}
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-charcoal">So erreichen Sie uns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CONTACT_INFO.map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-stone-light p-5 flex flex-col gap-3">
                  <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center">
                    <Image src={`/icons/sewing/${item.icon}`} alt="" width={20} height={20} className="icon-periwinkle" />
                  </div>
                  <div>
                    <p className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-warmgrey mb-1.5">{item.label}</p>
                    {item.lines.map((line) =>
                      item.href ? (
                        <a key={line} href={item.href} className="block font-sans text-sm text-charcoal hover:text-periwinkle-dark transition-colors">{line}</a>
                      ) : (
                        <p key={line} className="font-sans text-sm text-charcoal-light">{line}</p>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden border border-stone-light bg-gradient-to-br from-periwinkle-lighter to-sand-light flex items-center justify-center h-48">
              <div className="text-center">
                <Image src="/icons/sewing/sewing-shop-fashion-sewing-tailoring.svg" alt="" width={40} height={40} className="icon-stone mx-auto mb-3" />
                <p className="font-sans text-sm text-charcoal-lighter">Greifengasse 20, Basel</p>
                <a href="https://maps.google.com/?q=Greifengasse+20+Basel" target="_blank" rel="noopener noreferrer" className="text-xs text-periwinkle-dark hover:underline mt-1 block">
                  In Google Maps öffnen →
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div>
            <div className="bg-white rounded-2xl border border-stone-light p-8">
              {sent ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-16 h-16 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                    <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={32} height={32} className="icon-periwinkle" />
                  </div>
                  <h3 className="font-serif text-2xl text-charcoal">Vielen Dank!</h3>
                  <p className="font-sans text-sm text-charcoal-light max-w-xs">Wir haben Ihre Nachricht erhalten und melden uns so schnell wie möglich.</p>
                  <button onClick={() => setSent(false)} className="btn-outline-dark text-xs mt-2">Neue Nachricht</button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-charcoal mb-1">Nachricht senden</h2>
                  <p className="font-sans text-sm text-charcoal-lighter mb-6">Wir antworten innerhalb von 24 Stunden.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-charcoal-lighter mb-1.5">Name *</label>
                        <input type="text" required placeholder="Ihr Name" className="input-field" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-charcoal-lighter mb-1.5">Telefon</label>
                        <input type="tel" placeholder="+41 ..." className="input-field" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-charcoal-lighter mb-1.5">E-Mail *</label>
                      <input type="email" required placeholder="ihre@email.ch" className="input-field" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-charcoal-lighter mb-1.5">Nachricht *</label>
                      <textarea required rows={5} placeholder="Wie können wir Ihnen helfen?" className="input-field resize-none" value={form.message} onChange={(e) => setForm(f => ({...f, message: e.target.value}))} />
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary justify-center mt-1">
                      {sending ? "Wird gesendet…" : "Nachricht senden"}
                    </button>
                    <p className="text-[11px] text-charcoal-lighter text-center">Mit dem Absenden stimmen Sie unserer <a href="/datenschutz" className="underline hover:text-charcoal">Datenschutzerklärung</a> zu.</p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
