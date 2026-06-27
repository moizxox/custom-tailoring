import { ATELIER_LOCATIONS, MEASUREMENT_TIMETABLES, type LocationId } from "@/lib/site-content";
import { cn } from "@/lib/utils";

interface AtelierTimetableProps {
  className?: string;
  /** Show both locations side by side, or filter to one */
  locationId?: LocationId;
}

export function AtelierTimetable({ className, locationId }: AtelierTimetableProps) {
  const locations = locationId ? ATELIER_LOCATIONS.filter((l) => l.id === locationId) : ATELIER_LOCATIONS;

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {locations.map((location) => {
        const timetable = MEASUREMENT_TIMETABLES[location.id];
        if (!timetable.active) return null;

        return (
          <article key={location.id} className="rounded-3xl card-gradient border border-periwinkle-light/40 overflow-hidden">
            <div className="p-6 sm:p-7 border-b border-white/50">
              <p className="section-label mb-2">Massen ohne Termin</p>
              <h3 className="font-serif text-xl text-charcoal mb-2">Atelier {location.name}</h3>
              <p className="font-sans text-sm text-charcoal-light leading-relaxed">{timetable.description}</p>
            </div>

            <div className="p-6 sm:p-7">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-periwinkle-light/40">
                    <th className="pb-3 font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-charcoal-lighter">Tag</th>
                    <th className="pb-3 font-sans text-[10px] font-semibold tracking-[0.18em] uppercase text-charcoal-lighter">Zeit</th>
                  </tr>
                </thead>
                <tbody>
                  {timetable.slots.map((slot) => (
                    <tr key={`${slot.day}-${slot.time}`} className="border-b border-stone-light/50 last:border-0">
                      <td className="py-3.5 font-sans text-sm text-charcoal pr-4">{slot.day}</td>
                      <td className="py-3.5 font-sans text-sm text-charcoal-light">
                        {slot.time}
                        {slot.note && <span className="block text-[11px] text-charcoal-lighter mt-0.5">{slot.note}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-5 font-sans text-[12px] text-charcoal-lighter leading-relaxed">
                Ausserhalb dieser Zeiten: Termine nur nach Vereinbarung —{" "}
                <a href={`/termin?standort=${location.id}`} className="text-periwinkle-dark hover:underline">
                  online buchen
                </a>
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
