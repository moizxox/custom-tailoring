"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { PortalCustomer } from "@/lib/portal/customers";
import {
  getFieldsForCategory,
  MEASUREMENT_DIAGRAM,
  UNDER_CLOTHES_OPTIONS,
} from "@/lib/portal/measurement-fields";
import { MassblattDownload } from "@/components/sections/MassblattDownload";

interface MeasurementFormProps {
  customer: PortalCustomer;
  pdfAvailable?: boolean;
  layoutPdfAvailable?: boolean;
}

function splitName(full: string): { first: string; last: string } {
  const parts = full.trim().split(/\s+/);
  if (parts.length <= 1) return { first: parts[0] ?? "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

export function MeasurementForm({
  customer,
  pdfAvailable = false,
  layoutPdfAvailable = false,
}: MeasurementFormProps) {
  const fields = getFieldsForCategory(customer.costumeCategory);
  const nameDefaults = useMemo(() => splitName(customer.name), [customer.name]);
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

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-2xl text-charcoal">Massblatt</h2>
          <p className="font-sans text-sm text-charcoal-light mt-1">
            Bitte füllen Sie nur die von uns angeforderten Masse aus. Nicht für jedes Kostüm
            werden alle Angaben benötigt. Alle Angaben in cm; das Massband soll locker anliegen
            (etwa zwei Finger darunter).
          </p>
        </div>

        {(pdfAvailable || layoutPdfAvailable) && (
          <MassblattDownload
            available={pdfAvailable}
            layoutAvailable={layoutPdfAvailable}
            className="rounded-xl border border-stone-light bg-sand-light/30 p-4"
          />
        )}

        {/* Persönliche Angaben */}
        <section className="flex flex-col gap-4">
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-warmgrey">
            Persönliche Angaben
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-xs font-sans font-medium text-charcoal-light">
                Vorname <span className="text-red-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                required
                defaultValue={nameDefaults.first}
                className="input-field"
                autoComplete="given-name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-xs font-sans font-medium text-charcoal-light">
                Nachname <span className="text-red-500">*</span>
              </label>
              <input
                id="lastName"
                name="lastName"
                required
                defaultValue={nameDefaults.last}
                className="input-field"
                autoComplete="family-name"
              />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="groupName" className="text-xs font-sans font-medium text-charcoal-light">
                Name der Gruppe oder des Vereins
              </label>
              <input id="groupName" name="groupName" className="input-field" />
            </div>
            <fieldset className="sm:col-span-2">
              <legend className="text-xs font-sans font-medium text-charcoal-light mb-2">
                Körperform für die Schnitterstellung
              </legend>
              <div className="flex flex-wrap gap-4">
                <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal">
                  <input type="radio" name="bodyShape" value="female" className="accent-periwinkle-dark" />
                  weibliche Körperform
                </label>
                <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal">
                  <input type="radio" name="bodyShape" value="male" className="accent-periwinkle-dark" />
                  männliche Körperform
                </label>
              </div>
            </fieldset>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="birthYear" className="text-xs font-sans font-medium text-charcoal-light">
                Geburtsjahr bei Kindern
              </label>
              <input
                id="birthYear"
                name="birthYear"
                type="number"
                min="1990"
                max="2030"
                className="input-field"
                placeholder="z. B. 2015"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="heightCm" className="text-xs font-sans font-medium text-charcoal-light">
                Körpergrösse (cm)
              </label>
              <input id="heightCm" name="heightCm" type="number" step="0.5" min="0" className="input-field" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sizeTop" className="text-xs font-sans font-medium text-charcoal-light">
                Übliche Konfektionsgrösse — Oberteil
              </label>
              <input id="sizeTop" name="sizeTop" className="input-field" placeholder="z. B. M / 40" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="sizeBottom" className="text-xs font-sans font-medium text-charcoal-light">
                Übliche Konfektionsgrösse — Hose
              </label>
              <input id="sizeBottom" name="sizeBottom" className="input-field" placeholder="z. B. 38 / 50" />
            </div>
          </div>
        </section>

        {/* Erreichbarkeit */}
        <section className="flex flex-col gap-4">
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-warmgrey">
            Erreichbarkeit
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-sans font-medium text-charcoal-light">
                E-Mail-Adresse
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={customer.email}
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-xs font-sans font-medium text-charcoal-light">
                Telefonnummer
              </label>
              <input id="phone" name="phone" type="tel" className="input-field" autoComplete="tel" />
            </div>
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="guardianContact" className="text-xs font-sans font-medium text-charcoal-light">
                Kontaktperson bei Minderjährigen
              </label>
              <input id="guardianContact" name="guardianContact" className="input-field" />
            </div>
          </div>
        </section>

        {/* Kleidung unter dem Kostüm */}
        <section className="flex flex-col gap-3">
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-warmgrey">
            Kleidung unter dem Kostüm
          </h3>
          <p className="font-sans text-xs text-charcoal-lighter leading-relaxed">
            Bitte tragen Sie zum Vermessen die Kleidung, die Sie später unter dem Kostüm tragen.
            Mehrfachauswahl möglich.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {UNDER_CLOTHES_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="inline-flex items-center gap-2 text-sm font-sans text-charcoal"
              >
                <input
                  type="checkbox"
                  name="underClothes"
                  value={opt.value}
                  className="accent-periwinkle-dark rounded"
                />
                {opt.label}
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="underClothesOther" className="text-xs font-sans font-medium text-charcoal-light">
              Falls «Andere»
            </label>
            <input id="underClothesOther" name="underClothesOther" className="input-field" />
          </div>
          <fieldset>
            <legend className="text-xs font-sans font-medium text-charcoal-light mb-2">Händigkeit</legend>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal">
                <input type="radio" name="handedness" value="left" className="accent-periwinkle-dark" />
                Linkshänder/in
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-sans text-charcoal">
                <input type="radio" name="handedness" value="right" className="accent-periwinkle-dark" />
                Rechtshänder/in
              </label>
            </div>
          </fieldset>
        </section>

        {/* Körpermasse */}
        <section className="flex flex-col gap-4">
          <h3 className="font-sans text-[11px] font-semibold tracking-[0.14em] uppercase text-warmgrey">
            Körpermasse (cm)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label htmlFor={field.key} className="text-xs font-sans font-medium text-charcoal-light">
                  <span className="text-periwinkle-dark font-semibold mr-1">{field.letter}</span>
                  {field.label}
                  <span className="text-charcoal-lighter font-normal"> ({field.unit})</span>
                </label>
                <input
                  id={field.key}
                  name={field.key}
                  type="number"
                  step="0.5"
                  min="0"
                  className="input-field"
                  placeholder={field.unit}
                />
                {field.hint && (
                  <p className="text-[10px] text-charcoal-lighter">{field.hint}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="notes" className="text-xs font-sans font-medium text-charcoal-light">
            Weitere Bemerkungen (optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="input-field resize-none"
            placeholder="Besonderheiten, Passformwünsche…"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="measuredAt" className="text-xs font-sans font-medium text-charcoal-light">
              Datum der Massaufnahme
            </label>
            <input id="measuredAt" name="measuredAt" type="date" className="input-field" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="inline-flex items-start gap-2 text-sm font-sans text-charcoal">
            <input
              type="checkbox"
              name="measuredPerInstructions"
              className="mt-0.5 accent-periwinkle-dark rounded"
            />
            <span>Masse gemäss Anleitung aufgenommen</span>
          </label>
          <label className="inline-flex items-start gap-2 text-sm font-sans text-charcoal">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-0.5 accent-periwinkle-dark rounded"
            />
            <span>
              Mit dem Ankreuzen erkläre ich mich einverstanden, dass meine Angaben für Beratung,
              Massanfertigung und Auftragsabwicklung verarbeitet und gespeichert werden.{" "}
              <span className="text-red-500">*</span>
            </span>
          </label>
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
