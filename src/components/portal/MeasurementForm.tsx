"use client";

import Image from "next/image";
import { useState } from "react";
import type { PortalCustomer } from "@/lib/portal/customers";
import {
  getFieldsForCategory,
  MEASUREMENT_DIAGRAM,
} from "@/lib/portal/measurement-fields";

interface MeasurementFormProps {
  customer: PortalCustomer;
}

export function MeasurementForm({ customer }: MeasurementFormProps) {
  const fields = getFieldsForCategory(customer.costumeCategory);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/kundenbereich/api/massblatt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Übermittlung fehlgeschlagen.");
        return;
      }

      setSubmitted(true);
      form.reset();
      setPhotoPreview(null);
    } catch {
      setError("Verbindungsfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="glass-card p-10 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-full bg-periwinkle-lighter flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-periwinkle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-charcoal mb-2">Massblatt übermittelt</h2>
        <p className="font-sans text-sm text-charcoal-light mb-6">
          Vielen Dank. Ihre Masse wurden sicher übermittelt. Wir melden uns bei Rückfragen.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
          Weiteres Massblatt senden
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
      {/* Reference diagram — only visible to logged-in customers */}
      <div className="glass-card overflow-hidden sticky top-24">
        <div className="relative aspect-[4/5] bg-periwinkle-lighter/40 p-3">
          <Image
            src={MEASUREMENT_DIAGRAM[customer.costumeCategory]}
            alt={`Massblatt ${customer.costumeCategory}`}
            fill
            className="object-contain p-1"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
        <div className="p-5 border-t border-stone-light/80">
          <p className="font-sans text-xs text-charcoal-lighter leading-relaxed">
            Orientierungshilfe für Ihre Masse. Alle Angaben werden vertraulich behandelt
            und sind nur für Ihr Projekt «{customer.projectTitle}» bestimmt.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 flex flex-col gap-5">
        <div>
          <p className="section-label mb-2">Massblatt</p>
          <h2 className="font-serif text-2xl text-charcoal">{customer.projectTitle}</h2>
          <p className="font-sans text-sm text-charcoal-light mt-1">
            Kategorie: {customer.costumeCategory}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1.5">
              <label htmlFor={field.key} className="text-xs font-sans font-medium text-charcoal-light flex items-baseline gap-2">
                <span className="inline-flex min-w-[2rem] justify-center rounded bg-gold-lighter/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-gold-deeper">
                  {field.letter}
                </span>
                <span>
                  {field.label}
                  {field.required && <span className="text-periwinkle-dark"> *</span>}
                  <span className="text-charcoal-lighter font-normal"> ({field.unit})</span>
                </span>
              </label>
              <input
                id={field.key}
                name={field.key}
                type="number"
                step="0.5"
                min="0"
                required={field.required}
                className="input-field"
                placeholder={field.unit}
              />
              {field.hint && (
                <p className="text-[10px] text-charcoal-lighter">{field.hint}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs font-sans font-medium text-charcoal-light">
            Anmerkungen (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="input-field resize-none"
            placeholder="Besonderheiten, Passformwünsche…"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="photos" className="text-xs font-sans font-medium text-charcoal-light">
            Fotos hochladen (optional)
          </label>
          <input
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className="text-sm font-sans text-charcoal-light file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-periwinkle-lighter file:text-periwinkle-dark hover:file:bg-periwinkle-light"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoPreview(URL.createObjectURL(file));
              } else {
                setPhotoPreview(null);
              }
            }}
          />
          {photoPreview && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-light mt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Vorschau" className="object-cover w-full h-full" />
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary justify-center w-full sm:w-auto">
          {loading ? "Wird gesendet…" : "Massblatt sicher übermitteln"}
        </button>

        <p className="text-[10px] text-charcoal-lighter leading-relaxed">
          Ihre Daten werden verschlüsselt übertragen und ausschliesslich für die Anfertigung
          Ihres Kostüms verwendet.
        </p>
      </form>
    </div>
  );
}
