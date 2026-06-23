"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FormState { name: string; email: string; phone: string; message: string }

export function HeroContactSection() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section className="relative py-16 lg:py-20 bg-offwhite-warm border-t border-dashed border-gold-muted/40">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-10 xl:gap-16 items-start">
          <div className="max-w-xl">
            <p className="section-label mb-4">Kontakt</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal leading-snug mb-4">
              Haben Sie eine <em className="not-italic italic text-periwinkle-dark">Frage</em> oder ein Projekt?
            </h2>
            <p className="font-sans text-sm text-charcoal-light leading-relaxed mb-6">
              Schreiben Sie uns — wir melden uns persönlich und zeitnah. Für eine ausführliche
              Beratung können Sie auch direkt einen Termin buchen.
            </p>
            <Link href="/termin" className="btn-secondary inline-flex">
              Termin buchen
            </Link>
          </div>

          <div className="relative w-full">
            <div className="absolute -bottom-4 -right-4 w-32 h-32 pointer-events-none select-none opacity-[0.06]" aria-hidden>
              <Image src="/icons/sewing/sewing-machine-sewing-tailoring-cloth.svg" alt="" fill className="object-contain icon-charcoal" />
            </div>

            <div className="relative bg-white rounded-3xl shadow-card border border-stone-light ring-1 ring-gold-muted/15 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-gold-lighter via-gold-light to-gold-muted" />

              <div className="p-7 md:p-8">
                {submitted ? (
                  <div className="flex flex-col items-center text-center py-10 gap-4">
                    <div className="w-16 h-16 rounded-full bg-periwinkle-lighter flex items-center justify-center">
                      <svg className="w-7 h-7 text-periwinkle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-2xl text-charcoal">Vielen Dank!</h3>
                    <p className="font-sans text-sm text-charcoal-light max-w-[220px] leading-relaxed">
                      Wir melden uns persönlich und zeitnah bei Ihnen.
                    </p>
                    <button onClick={() => setSubmitted(false)} className="text-xs font-sans text-periwinkle-dark hover:underline mt-1">
                      Neue Anfrage senden
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-periwinkle-lighter flex items-center justify-center shrink-0">
                        <Image src="/icons/sewing/pencil-sewing-tailoring-drawing.svg" alt="" width={20} height={20} className="icon-periwinkle" />
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-charcoal leading-tight">Anfrage senden</h3>
                        <p className="font-sans text-[11px] text-charcoal-lighter">Wir antworten persönlich und zeitnah.</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Name *</label>
                          <input type="text" required placeholder="Ihr Name" className="input-field text-[13px] py-2.5" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                          <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Telefon</label>
                          <input type="tel" placeholder="+41 ..." className="input-field text-[13px] py-2.5" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                        </div>
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">E-Mail *</label>
                        <input type="email" required placeholder="ihre@email.ch" className="input-field text-[13px] py-2.5" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
                      </div>
                      <div>
                        <label className="block font-sans text-[10px] font-semibold tracking-[0.12em] uppercase text-charcoal-lighter mb-1.5">Nachricht</label>
                        <textarea rows={3} placeholder="Wie können wir Ihnen helfen?" className="input-field resize-none text-[13px]" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full mt-1 flex items-center justify-center gap-2 bg-periwinkle hover:bg-periwinkle-dark text-charcoal hover:text-white font-sans font-medium text-sm py-3 rounded-xl transition-all duration-200 disabled:opacity-50"
                      >
                        {submitting ? "Wird gesendet…" : "Anfrage absenden"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
