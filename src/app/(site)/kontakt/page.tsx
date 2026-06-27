"use client";

import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { useState } from "react";
import { LocationCards } from "@/components/sections/LocationCards";
import { AtelierTimetable } from "@/components/sections/AtelierTimetable";
import { SITE_CONTACT } from "@/lib/site-content";

export default function KontaktPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "", location: "pratteln" });
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
        subtitle="Zwei Ateliers in Pratteln und Therwil — persönlich, per Telefon oder E-Mail."
        breadcrumbs={[{ label: "Kontakt", href: "/kontakt" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Unsere Standorte</p>
            <h2 className="font-serif text-3xl text-charcoal mb-3">Atelier Pratteln & Therwil</h2>
            <p className="font-sans text-sm text-charcoal-light max-w-xl mx-auto">{SITE_CONTACT.hoursDefault}</p>
          </div>
          <LocationCards />
        </div>
      </section>

      <section className="py-16 section-bg-lavender border-y border-periwinkle-light/30">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-2">Massen ohne Termin — Hochsaison</h2>
            <p className="font-sans text-sm text-charcoal-light">Feste Zeiten pro Standort während der Fasnachts-Saison</p>
          </div>
          <AtelierTimetable />
        </div>
      </section>

      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-charcoal">Direkt erreichen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Telefon", value: SITE_CONTACT.phone, href: SITE_CONTACT.phoneHref },
                { label: "E-Mail", value: SITE_CONTACT.email, href: `mailto:${SITE_CONTACT.email}` },
                { label: "WhatsApp", value: "Chat starten", href: SITE_CONTACT.whatsapp },
                { label: "Termin", value: "Online buchen", href: "/termin" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="bg-white rounded-2xl border border-stone-light p-5 hover:border-periwinkle-light hover:shadow-soft transition-all"
                >
                  <p className="font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-warmgrey mb-1.5">{item.label}</p>
                  <p className="font-sans text-sm text-charcoal">{item.value}</p>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-stone-light p-8 shadow-soft">
              {sent ? (
                <div className="flex flex-col items-center text-center py-10 gap-4">
                  <div className="w-16 h-16 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                    <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={32} height={32} className="icon-periwinkle" />
                  </div>
                  <h3 className="font-serif text-2xl text-charcoal">Vielen Dank!</h3>
                  <p className="font-sans text-sm text-charcoal-light max-w-xs">Wir melden uns persönlich und zeitnah.</p>
                  <button type="button" onClick={() => setSent(false)} className="btn-outline-dark text-xs mt-2">
                    Neue Nachricht
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-charcoal mb-1">Nachricht senden</h2>
                  <p className="font-sans text-sm text-charcoal-lighter mb-6">Wir antworten innerhalb von 24 Stunden.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input type="text" required placeholder="Name *" className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                      <input type="tel" placeholder="Telefon" className="input-field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                    </div>
                    <input type="email" required placeholder="E-Mail *" className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                    <select className="input-field" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}>
                      <option value="pratteln">Atelier Pratteln</option>
                      <option value="therwil">Atelier Therwil</option>
                      <option value="unsicher">Noch unentschlossen</option>
                    </select>
                    <textarea required rows={5} placeholder="Ihre Nachricht *" className="input-field resize-none" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                    <button type="submit" disabled={sending} className="btn-primary justify-center">
                      {sending ? "Wird gesendet…" : "Nachricht senden"}
                    </button>
                    <p className="text-[11px] text-charcoal-lighter text-center">
                      Mit dem Absenden stimmen Sie unserer{" "}
                      <a href="/datenschutz" className="underline hover:text-charcoal">
                        Datenschutzerklärung
                      </a>{" "}
                      zu.
                    </p>
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
