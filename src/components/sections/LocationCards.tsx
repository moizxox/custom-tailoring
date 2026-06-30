import Link from "next/link";
import type { AtelierLocation } from "@/lib/site-content";
import { cn } from "@/lib/utils";

interface LocationCardsProps {
  locations: AtelierLocation[];
  className?: string;
  showBookingLink?: boolean;
}

export function LocationCards({ locations, className, showBookingLink = true }: LocationCardsProps) {
  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {locations.map((location) => (
        <article
          key={location.id}
          className="rounded-3xl border border-periwinkle-light/50 bg-white shadow-card overflow-hidden flex flex-col"
        >
          <div className="p-6 sm:p-7 border-b border-stone-light/60">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-periwinkle-lighter flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-periwinkle-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-2xl text-periwinkle-dark mb-1">{location.name}</h3>
                <p className="font-sans text-sm text-charcoal-light">
                  {location.address}
                  <br />
                  {location.city}
                </p>
              </div>
            </div>
          </div>

          <div className="relative h-52 sm:h-56 bg-sand-light/40">
            <iframe
              title={`Karte ${location.name}`}
              src={location.mapsEmbed}
              className="absolute inset-0 w-full h-full border-0 grayscale-[20%] contrast-[1.05]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="p-5 sm:p-6 flex flex-wrap items-center justify-between gap-3 mt-auto">
            <a
              href={location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-sans text-charcoal-light hover:text-periwinkle-dark transition-colors"
            >
              Route planen →
            </a>
            {showBookingLink && (
              <Link
                href={`/termin?standort=${location.id}`}
                className="text-sm font-sans font-semibold tracking-[0.12em] uppercase text-periwinkle-dark hover:text-periwinkle-deep transition-colors"
              >
                Termin buchen
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
