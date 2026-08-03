"use client";

import { useMemo } from "react";
import type { NavPageOption } from "@/lib/cms/nav-page-options";
import { findNavPageOption } from "@/lib/cms/nav-page-options";
import { cn } from "@/lib/utils";

const CUSTOM_VALUE = "__custom__";

interface PageLinkSelectProps {
  value: string;
  onChange: (href: string) => void;
  /** When selecting a known page, optionally suggest a label */
  onSelectPage?: (option: NavPageOption) => void;
  options: NavPageOption[];
  className?: string;
  selectClassName?: string;
  inputClassName?: string;
  /** Compact layout for dense nav rows */
  compact?: boolean;
}

const defaultInp =
  "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition";

/**
 * Non-technical page picker: choose a site page from a list.
 * Falls back to a free-text URL field for external / unusual links.
 */
export function PageLinkSelect({
  value,
  onChange,
  onSelectPage,
  options,
  className,
  selectClassName,
  inputClassName,
  compact = false,
}: PageLinkSelectProps) {
  const matched = findNavPageOption(value, options);
  const isCustom = !matched;

  const groups = useMemo(() => {
    const order: NavPageOption["group"][] = ["Seiten", "Eigene Seiten", "Weitere"];
    return order
      .map((group) => ({
        group,
        items: options.filter((o) => o.group === group),
      }))
      .filter((g) => g.items.length > 0);
  }, [options]);

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", compact ? "flex-1" : "", className)}>
      <select
        value={isCustom ? CUSTOM_VALUE : matched.href}
        onChange={(e) => {
          const next = e.target.value;
          if (next === CUSTOM_VALUE) {
            if (!isCustom) onChange("");
            return;
          }
          const option = options.find((o) => o.href === next);
          onChange(next);
          if (option) onSelectPage?.(option);
        }}
        className={cn(defaultInp, "font-sans", selectClassName)}
        title="Seite auswählen"
      >
        {groups.map(({ group, items }) => (
          <optgroup key={group} label={group}>
            {items.map((opt) => (
              <option key={`${group}:${opt.href}`} value={opt.href}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={CUSTOM_VALUE}>Andere Adresse…</option>
      </select>
      {isCustom && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… oder /pfad"
          className={cn(defaultInp, "font-mono text-xs", inputClassName)}
          aria-label="Eigene Adresse"
        />
      )}
      {!isCustom && !compact && (
        <p className="text-[10px] text-gray-400 font-mono truncate" title={value}>
          {value}
        </p>
      )}
    </div>
  );
}
