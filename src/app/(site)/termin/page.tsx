"use client";

import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AtelierTimetable } from "@/components/sections/AtelierTimetable";
import { APPOINTMENT_TYPES, ATELIER_LOCATIONS, SITE_CONTACT, type LocationId } from "@/lib/site-content";
import { cn } from "@/lib/utils";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const BOOKING_DATES = Array.from({ length: 5 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index + 1);
  return {
    value: date.toISOString().slice(0, 10),
    weekday: new Intl.DateTimeFormat("de-CH", { weekday: "short" }).format(date),
    label: new Intl.DateTimeFormat("de-CH", { day: "2-digit", month: "2-digit" }).format(date),
  };
});

function TerminBooking() {
  const searchParams = useSearchParams();
  const initialLocation = (searchParams.get("standort") as LocationId) || "pratteln";
  const initialTyp = searchParams.get("typ");
  const preselected = APPOINTMENT_TYPES.find((t) => t.id === initialTyp);

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [selectedLocation, setSelectedLocation] = useState<LocationId>(
    ATELIER_LOCATIONS.some((l) => l.id === initialLocation) ? initialLocation : "pratteln",
  );
  const [selectedService, setSelectedService] = useState(preselected?.label ?? "");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const locationLabel = ATELIER_LOCATIONS.find((l) => l.id === selectedLocation)?.name ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  return (
    <>
      <section id="massen-ohne-termin" className="py-16 section-bg-lavender border-b border-periwinkle-light/30 scroll-mt-24">
        <div className="container-site max-w-5xl">
          <div className="text-center mb-10">
            <p className="section-label mb-3 justify-center">Hochsaison</p>
            <h2 className="font-serif text-3xl text-charcoal mb-3">Massen ohne Termin — feste Zeiten</h2>
            <p className="font-sans text-sm text-charcoal-light max-w-2xl mx-auto leading-relaxed">
              In der Fasnachts-Hochsaison sind wir zu festen Zeiten im Atelier. Für individuelle Beratungen und
              Anfertigungen buchen Sie bitte einen Termin nach Vereinbarung.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#termin-buchen" className="btn-primary">
                Termin buchen
              </a>
              <a href="#massen-ohne-termin" className="btn-outline-dark">
                Feste Masszeiten ansehen
              </a>
            </div>
          </div>
          <AtelierTimetable />
        </div>
      </section>

      <section id="termin-buchen" className="py-20 section-bg-white scroll-mt-24">
        <div className="container-site max-w-2xl mx-auto">
          {/* Quick book — like kostuemschneiderei.ch/bookonline */}
          <div className="mb-10">
            <h2 className="font-serif text-xl text-charcoal mb-4 text-center">Terminart direkt wählen</h2>
            <ul className="rounded-2xl border border-stone-light overflow-hidden divide-y divide-stone-light/70">
              {APPOINTMENT_TYPES.map((type) => (
                <li key={type.id} className="flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-periwinkle-lighter/30 transition-colors">
                  <div>
                    <p className="font-sans text-sm font-medium text-charcoal">{type.label}</p>
                    <p className="font-sans text-[11px] text-charcoal-lighter mt-0.5 hidden sm:block">{type.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(type.label);
                      setStep(2);
                      window.scrollTo({ top: 400, behavior: "smooth" });
                    }}
                    className="shrink-0 text-[12px] font-sans font-semibold tracking-[0.1em] uppercase text-periwinkle-dark hover:text-periwinkle-deep"
                  >
                    Buchen
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {submitted ? (
            <div className="bg-white rounded-2xl border border-stone-light p-12 text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={40} height={40} className="icon-periwinkle" />
              </div>
              <h2 className="font-serif text-3xl text-charcoal">Termin bestätigt!</h2>
              <p className="font-sans text-sm text-charcoal-light max-w-sm">
                Wir haben Ihre Buchung für Atelier {locationLabel} erhalten. Sie erhalten eine Bestätigung per E-Mail.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                }}
                className="btn-outline-dark"
              >
                Neuen Termin buchen
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-light overflow-hidden shadow-soft">
              <div className="flex border-b border-stone-light overflow-x-auto">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "flex-1 min-w-[120px] py-4 text-center text-[12px] font-sans font-medium transition-colors",
                      step >= s ? "text-periwinkle-dark bg-periwinkle-lighter/50" : "text-charcoal-lighter",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center justify-center w-5 h-5 rounded-full mr-1.5 text-[10px] font-bold",
                        step >= s ? "bg-periwinkle text-charcoal" : "bg-stone-light text-charcoal-lighter",
                      )}
                    >
                      {s}
                    </span>
                    {s === 1 ? "Standort" : s === 2 ? "Service" : s === 3 ? "Datum & Zeit" : "Kontakt"}
                  </div>
                ))}
              </div>

              <div className="p-8">
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal mb-2">Wo möchten Sie uns besuchen?</h2>
                    <p className="font-sans text-sm text-charcoal-lighter mb-6">Bitte wählen Sie Ihr Atelier.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {ATELIER_LOCATIONS.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setSelectedLocation(loc.id)}
                          className={cn(
                            "text-left p-5 rounded-2xl border transition-all duration-200",
                            selectedLocation === loc.id
                              ? "border-periwinkle bg-periwinkle-lighter/70 shadow-soft"
                              : "border-stone-light bg-white hover:border-periwinkle-light",
                          )}
                        >
                          <p className="font-serif text-xl text-periwinkle-dark mb-1">Atelier {loc.name}</p>
                          <p className="font-sans text-sm text-charcoal-light">
                            {loc.address}, {loc.city}
                          </p>
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setStep(2)} className="btn-primary mt-6 w-full justify-center">
                      Weiter →
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal mb-2">Terminart wählen</h2>
                    <p className="font-sans text-sm text-charcoal-lighter mb-6">Wie auf der Online-Terminbuchung — bitte passende Leistung auswählen.</p>
                    <div className="flex flex-col gap-3">
                      {APPOINTMENT_TYPES.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setSelectedService(type.label)}
                          className={cn(
                            "text-left px-5 py-4 rounded-xl border transition-all duration-200",
                            selectedService === type.label
                              ? "border-periwinkle bg-periwinkle-lighter shadow-soft"
                              : "border-stone-light bg-white hover:border-periwinkle-light",
                          )}
                        >
                          <span className="block font-sans text-sm font-medium text-charcoal">{type.label}</span>
                          <span className="block font-sans text-[12px] text-charcoal-lighter mt-0.5">{type.description}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(1)} className="btn-outline-dark flex-1 justify-center">
                        ← Zurück
                      </button>
                      <button
                        type="button"
                        disabled={!selectedService}
                        onClick={() => setStep(3)}
                        className="btn-primary flex-1 justify-center disabled:opacity-40"
                      >
                        Weiter →
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal mb-2">Wählen Sie Datum und Zeit</h2>
                    <p className="font-sans text-sm text-charcoal-lighter mb-6">
                      Verfügbare Termine für Atelier {locationLabel}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                      {BOOKING_DATES.map((date) => (
                        <button
                          key={date.value}
                          type="button"
                          onClick={() => setSelectedDate(date.value)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-sans font-medium transition-all duration-200",
                            selectedDate === date.value
                              ? "border-periwinkle bg-periwinkle-lighter text-charcoal"
                              : "border-stone-light bg-white text-charcoal-light hover:border-periwinkle-light",
                          )}
                        >
                          <span className="block text-[11px] uppercase tracking-[0.12em] text-charcoal-lighter">{date.weekday}</span>
                          {date.label}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTime(t)}
                          className={cn(
                            "py-3 rounded-xl border text-sm font-sans font-medium transition-all duration-200",
                            selectedTime === t
                              ? "border-periwinkle bg-periwinkle-lighter text-charcoal"
                              : "border-stone-light bg-white text-charcoal-light hover:border-periwinkle-light",
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(2)} className="btn-outline-dark flex-1 justify-center">
                        ← Zurück
                      </button>
                      <button
                        type="button"
                        disabled={!selectedDate || !selectedTime}
                        onClick={() => setStep(4)}
                        className="btn-primary flex-1 justify-center disabled:opacity-40"
                      >
                        Weiter →
                      </button>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="font-serif text-2xl text-charcoal mb-6">Ihre Kontaktdaten</h2>
                    <div className="bg-periwinkle-lighter/60 rounded-xl p-4 mb-6 text-sm font-sans text-charcoal-light flex flex-col gap-1">
                      <span>
                        <strong className="text-charcoal">Standort:</strong> Atelier {locationLabel}
                      </span>
                      <span>
                        <strong className="text-charcoal">Service:</strong> {selectedService}
                      </span>
                      <span>
                        <strong className="text-charcoal">Datum:</strong> {selectedDate}
                      </span>
                      <span>
                        <strong className="text-charcoal">Zeit:</strong> {selectedTime} Uhr
                      </span>
                    </div>
                    <div className="flex flex-col gap-4">
                      <input type="text" required placeholder="Ihr Name *" className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                      <input type="email" required placeholder="E-Mail *" className="input-field" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                      <input type="tel" placeholder="Telefon" className="input-field" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                      <textarea rows={3} placeholder="Anmerkungen (optional)" className="input-field resize-none" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                    </div>
                    <p className="text-[11px] text-charcoal-lighter mt-4">
                      Mit der Buchung akzeptieren Sie unsere{" "}
                      <a href="/agb" className="text-periwinkle-dark hover:underline">
                        AGB
                      </a>{" "}
                      und{" "}
                      <a href="/datenschutz" className="text-periwinkle-dark hover:underline">
                        Datenschutzerklärung
                      </a>
                      .
                    </p>
                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(3)} className="btn-outline-dark flex-1 justify-center">
                        ← Zurück
                      </button>
                      <button type="submit" className="btn-primary flex-1 justify-center">
                        Termin bestätigen
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          <p className="text-center font-sans text-sm text-charcoal-lighter mt-8">
            Fragen?{" "}
            <a href={SITE_CONTACT.phoneHref} className="text-periwinkle-dark hover:underline">
              {SITE_CONTACT.phone}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${SITE_CONTACT.email}`} className="text-periwinkle-dark hover:underline">
              {SITE_CONTACT.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default function TerminPage() {
  return (
    <>
      <PageHero
        label="Terminbuchung"
        title="Termin buchen"
        titleAccent="buchen"
        subtitle="Vereinbaren Sie ein persönliches Gespräch — mit Standortwahl für Pratteln oder Therwil."
        breadcrumbs={[{ label: "Termin buchen", href: "/termin" }]}
      />
      <Suspense fallback={<div className="py-20 text-center text-charcoal-lighter">Laden…</div>}>
        <TerminBooking />
      </Suspense>
    </>
  );
}
