"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MEASUREMENT_TYPES = [
  { src: "/images/figures/man-measurement.png", label: "Herren", desc: "Massblatt für Herrenkostüme" },
  { src: "/images/figures/woman-measurement.png", label: "Damen", desc: "Massblatt für Damenkostüme" },
  { src: "/images/figures/child-measurement.png", label: "Kinder", desc: "Massblatt für Kinderkostüme" },
];

export function MeasurementCards() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {MEASUREMENT_TYPES.map((m) => {
        const isActive = active === m.label;

        return (
          <button
            key={m.label}
            type="button"
            onClick={() => setActive(isActive ? null : m.label)}
            className={cn(
              "glass-card rounded-2xl overflow-hidden flex flex-col text-left w-full",
              "transition-all duration-300 cursor-pointer",
              "hover:shadow-card-hover hover:-translate-y-0.5",
              isActive && "ring-2 ring-periwinkle-dark/50 shadow-card-hover -translate-y-0.5"
            )}
          >
            <div
              className={cn(
                "relative aspect-[4/3] p-3 transition-colors duration-300",
                "bg-[#2c2c30]",
                isActive ? "bg-[#242428]" : "hover:bg-[#26262a]"
              )}
            >
              <Image
                src={m.src}
                alt={`Massblatt ${m.label}`}
                fill
                className={cn(
                  "object-contain p-1 transition-all duration-300",
                  "outline-measurement-periwinkle",
                  isActive
                    ? "opacity-100 scale-[1.03] brightness-110 saturate-125"
                    : "opacity-[0.82] hover:opacity-95 hover:brightness-105"
                )}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div
              className={cn(
                "p-5 border-t transition-colors duration-300",
                isActive ? "border-periwinkle/30 bg-periwinkle-lighter/20" : "border-stone-light/80"
              )}
            >
              <h3 className="font-serif text-lg text-charcoal">{m.label}</h3>
              <p className="font-sans text-sm text-charcoal-lighter mt-1">{m.desc}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
