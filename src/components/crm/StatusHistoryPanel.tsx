"use client";

import { CUSTOMER_STATUSES } from "@/lib/crm/projects";

interface Entry {
  id: string;
  status: string;
  note: string | null;
  changedBy: string | null;
  createdAt: string;
}

export function StatusHistoryPanel({ entries }: { entries: Entry[] }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {entries.length === 0 ? (
        <p className="px-4 py-10 text-center text-sm text-gray-400">Noch keine Statusänderungen</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {entries.map((e) => (
            <li key={e.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {CUSTOMER_STATUSES.find((s) => s.value === e.status)?.label ?? e.status}
                </p>
                {e.note && <p className="text-sm text-gray-500 mt-0.5">{e.note}</p>}
              </div>
              <div className="text-xs text-gray-400 text-right">
                <p>{new Date(e.createdAt).toLocaleString("de-CH")}</p>
                {e.changedBy && <p>{e.changedBy}</p>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
