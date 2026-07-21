"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, Users, FolderKanban, UsersRound } from "lucide-react";

interface SearchResult {
  customers: Array<{ id: string; name: string; email: string; role: string }>;
  groups: Array<{ id: string; name: string; type: string; season: string | null }>;
  projects: Array<{
    id: string;
    title: string;
    customerStatus: string;
    customer: { name: string } | null;
    group: { name: string } | null;
  }>;
}

export function CrmSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < 2) { setResults(null); setOpen(false); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/admin/api/crm/search?q=${encodeURIComponent(query)}`);
        const data = await res.json() as SearchResult;
        setResults(data);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);
  }, [query]);

  const hasResults = results && (
    results.customers.length > 0 ||
    results.groups.length > 0 ||
    results.projects.length > 0
  );

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 focus-within:border-violet-500 transition-colors">
        <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <input
          type="search"
          placeholder="Suche…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setOpen(true)}
          className="flex-1 bg-transparent text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {loading && (
          <div className="w-3 h-3 border border-gray-300 border-t-violet-500 rounded-full animate-spin flex-shrink-0" />
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {!hasResults ? (
            <p className="text-xs text-gray-500 text-center py-4">Keine Treffer für &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="max-h-80 overflow-y-auto py-2">
              {results.customers.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3 h-3" /> Kunden
                  </p>
                  {results.customers.map((c) => (
                    <Link
                      key={c.id}
                      href={`/admin/crm/customers/${c.id}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] text-emerald-700 font-medium">{c.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-900">{c.name}</p>
                        <p className="text-[10px] text-gray-500">{c.email}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.groups.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <UsersRound className="w-3 h-3" /> Gruppen
                  </p>
                  {results.groups.map((g) => (
                    <Link
                      key={g.id}
                      href={`/admin/crm/groups/${g.id}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
                        <UsersRound className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-900">{g.name}</p>
                        {g.season && <p className="text-[10px] text-gray-500">{g.season}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.projects.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderKanban className="w-3 h-3" /> Projekte
                  </p>
                  {results.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/crm/projects/${p.id}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-violet-50 flex items-center justify-center flex-shrink-0">
                        <FolderKanban className="w-3 h-3 text-violet-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-900">{p.title}</p>
                        <p className="text-[10px] text-gray-500">
                          {p.customer?.name ?? p.group?.name ?? ""}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
