"use client";

import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { useState } from "react";
import { LocationCards } from "@/components/sections/LocationCards";
import { AtelierTimetable } from "@/components/sections/AtelierTimetable";
import type { ContactFormConfig, PageHeroCms } from "@/lib/cms/helpers";
import type { SiteContactInfo } from "@/lib/cms/site-contact";
import type { CmsTimetable } from "@/lib/cms/timetables";
import type { AtelierLocation } from "@/lib/site-content";

interface KontaktPageContentProps {
  hero: PageHeroCms;
  form: ContactFormConfig;
  contact: SiteContactInfo;
  locations: AtelierLocation[];
  timetables: CmsTimetable[];
}

export function KontaktPageContent({ hero, form, contact, locations, timetables }: KontaktPageContentProps) {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    location: "pratteln",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Fehler beim Senden.");
        return;
      }
      setSent(true);
    } catch {
      setSubmitError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
        breadcrumbs={[{ label: "Kontakt", href: "/kontakt" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Unsere Standorte</p>
            <h2 className="font-serif text-3xl text-charcoal mb-3">Atelier Pratteln & Therwil</h2>
            <p className="font-sans text-sm text-charcoal-light max-w-xl mx-auto">{contact.hours}</p>
          </div>
          <LocationCards locations={locations} />
        </div>
      </section>

      <section className="py-16 section-bg-lavender border-y border-periwinkle-light/30">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl text-charcoal mb-2">Massen ohne Termin — Hochsaison</h2>
            <p className="font-sans text-sm text-charcoal-light">Feste Zeiten pro Standort während der Fasnachts-Saison</p>
          </div>
          <AtelierTimetable timetables={timetables} locations={locations} />
        </div>
      </section>

      <section className="py-20 section-bg-white">
        <div className="container-site grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <h2 className="font-serif text-2xl text-charcoal">Direkt erreichen</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Telefon", value: contact.phone, href: contact.phoneHref },
                { label: "E-Mail", value: contact.email, href: `mailto:${contact.email}` },
                { label: "WhatsApp", value: "Chat starten", href: contact.whatsapp },
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
                  <h3 className="font-serif text-2xl text-charcoal">{form.successTitle}</h3>
                  <p className="font-sans text-sm text-charcoal-light max-w-xs">{form.successMessage}</p>
                  <button type="button" onClick={() => setSent(false)} className="btn-outline-dark text-xs mt-2">
                    Neue Nachricht
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl text-charcoal mb-1">{form.title}</h2>
                  <p className="font-sans text-sm text-charcoal-lighter mb-6">{form.subtitle}</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        required
                        placeholder={form.namePlaceholder}
                        className="input-field"
                        value={contactForm.name}
                        onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <input
                        type="tel"
                        placeholder={form.phonePlaceholder}
                        className="input-field"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm((f) => ({ ...f, phone: e.target.value }))}
                      />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder={form.emailPlaceholder}
                      className="input-field"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))}
                    />
                    <select
                      className="input-field"
                      value={contactForm.location}
                      onChange={(e) => setContactForm((f) => ({ ...f, location: e.target.value }))}
                    >
                      <option value="pratteln">Atelier Pratteln</option>
                      <option value="therwil">Atelier Therwil</option>
                      <option value="unsicher">Noch unentschlossen</option>
                    </select>
                    <textarea
                      required
                      rows={5}
                      placeholder={form.messagePlaceholder}
                      className="input-field resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                    />
                    {submitError && (
                      <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                        {submitError}
                      </p>
                    )}
                    <button type="submit" disabled={sending} className="btn-primary justify-center">
                      {sending ? "Wird gesendet…" : form.submitLabel}
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
