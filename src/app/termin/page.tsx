"use client";

import { PageHero } from "@/components/layout/PageHero";
import Image from "next/image";
import { useState } from "react";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const SERVICE_TYPES = [
  "Erstberatung (kostenlos)",
  "Massanfertigung",
  "Änderungen & Anpassungen",
  "Reparaturen",
  "Gruppenausstattung",
  "Sonstiges",
];

export default function TerminPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  return (
    <>
      <PageHero
        label="Terminbuchung"
        title="Beratung buchen"
        titleAccent="buchen"
        subtitle="Vereinbaren Sie ein persönliches Gespräch – kostenlos und unverbindlich."
        iconSlug="pin-cushion-handcraft-sewing-tailoring.svg"
        breadcrumbs={[{ label: "Termin buchen", href: "/termin" }]}
      />

      <section className="py-20 bg-offwhite-warm">
        <div className="container-site max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white rounded-2xl border border-stone-light p-12 text-center flex flex-col items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                <Image src="/icons/sewing/tailor-dummy-fashion-sewing-tailoring.svg" alt="" width={40} height={40} className="icon-periwinkle" />
              </div>
              <h2 className="font-serif text-3xl text-charcoal">Termin bestätigt!</h2>
              <p className="font-sans text-sm text-charcoal-light max-w-sm">
                Wir haben Ihre Buchung erhalten. Sie erhalten eine Bestätigung per E-Mail.
              </p>
              <button onClick={() => { setSubmitted(false); setStep(1); }} className="btn-outline-dark">
                Neuen Termin buchen
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-light overflow-hidden">
              {/* Step indicator */}
              <div className="flex border-b border-stone-light">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex-1 py-4 text-center text-[12px] font-sans font-medium transition-colors ${step >= s ? "text-periwinkle-dark bg-periwinkle-lighter/50" : "text-charcoal-lighter"}`}>
                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-1.5 text-[10px] font-bold ${step >= s ? "bg-periwinkle text-charcoal" : "bg-stone-light text-charcoal-lighter"}`}>{s}</span>
                    {s === 1 ? "Service" : s === 2 ? "Zeitwahl" : "Kontakt"}
                  </div>
                ))}
              </div>

              <div className="p-8">
                {/* Step 1: Service type */}
                {step === 1 && (
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal mb-6">Welche Leistung benötigen Sie?</h2>
                    <div className="flex flex-col gap-3">
                      {SERVICE_TYPES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSelectedService(s)}
                          className={`text-left px-5 py-4 rounded-xl border text-sm font-sans transition-all duration-200 ${
                            selectedService === s
                              ? "border-periwinkle bg-periwinkle-lighter text-charcoal"
                              : "border-stone-light bg-white text-charcoal-light hover:border-periwinkle-light"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <button
                      disabled={!selectedService}
                      onClick={() => setStep(2)}
                      className="btn-primary mt-6 w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Weiter →
                    </button>
                  </div>
                )}

                {/* Step 2: Time */}
                {step === 2 && (
                  <div>
                    <h2 className="font-serif text-2xl text-charcoal mb-2">Wählen Sie eine Zeit</h2>
                    <p className="font-sans text-sm text-charcoal-lighter mb-6">Verfügbare Zeiten für nächste Woche</p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                      {TIME_SLOTS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-3 rounded-xl border text-sm font-sans font-medium transition-all duration-200 ${
                            selectedTime === t
                              ? "border-periwinkle bg-periwinkle-lighter text-charcoal"
                              : "border-stone-light bg-white text-charcoal-light hover:border-periwinkle-light"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(1)} className="btn-outline-dark flex-1 justify-center">← Zurück</button>
                      <button disabled={!selectedTime} onClick={() => setStep(3)} className="btn-primary flex-1 justify-center disabled:opacity-40">Weiter →</button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact details */}
                {step === 3 && (
                  <form onSubmit={handleSubmit}>
                    <h2 className="font-serif text-2xl text-charcoal mb-6">Ihre Kontaktdaten</h2>

                    {/* Summary */}
                    <div className="bg-periwinkle-lighter/60 rounded-xl p-4 mb-6 text-sm font-sans text-charcoal-light flex flex-col gap-1">
                      <span><strong className="text-charcoal">Service:</strong> {selectedService}</span>
                      <span><strong className="text-charcoal">Zeit:</strong> {selectedTime} Uhr</span>
                    </div>

                    <div className="flex flex-col gap-4">
                      <input type="text" required placeholder="Ihr Name *" className="input-field" value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} />
                      <input type="email" required placeholder="E-Mail *" className="input-field" value={form.email} onChange={(e) => setForm(f => ({...f, email: e.target.value}))} />
                      <input type="tel" placeholder="Telefon" className="input-field" value={form.phone} onChange={(e) => setForm(f => ({...f, phone: e.target.value}))} />
                      <textarea rows={3} placeholder="Anmerkungen (optional)" className="input-field resize-none" value={form.notes} onChange={(e) => setForm(f => ({...f, notes: e.target.value}))} />
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button type="button" onClick={() => setStep(2)} className="btn-outline-dark flex-1 justify-center">← Zurück</button>
                      <button type="submit" className="btn-primary flex-1 justify-center">Termin bestätigen</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
