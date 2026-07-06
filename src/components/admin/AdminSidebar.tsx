"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, ShoppingBag, ImageIcon, Menu, Settings,
  UserPlus, ExternalLink, Scissors, Palette,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", key: "dashboard" as const, icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", key: "pages" as const, icon: FileText, exact: false },
  { href: "/admin/navigation", key: "navigation" as const, icon: Menu, exact: false },
  { href: "/admin/products", key: "products" as const, icon: ShoppingBag, exact: false },
  { href: "/admin/media", key: "media" as const, icon: ImageIcon, exact: false },
  { href: "/admin/settings", key: "settings" as const, icon: Settings, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isColorsActive = pathname === "/admin/settings";

  return (
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col bg-gray-950 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
          <Scissors className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-tight">Kostümschneiderei</p>
          <p className="text-[11px] text-gray-500">{t("cmsAdmin")}</p>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Content</p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300")} />
              {t(item.key)}
              {/* Badge for settings — shows colors indicator */}
              {item.key === "settings" && !isActive && (
                <span className="ml-auto flex items-center gap-0.5">
                  {["#9da5d0", "#d4c9b8", "#2c2a28"].map((c) => (
                    <span key={c} className="w-2 h-2 rounded-full border border-gray-700" style={{ backgroundColor: c }} />
                  ))}
                </span>
              )}
            </Link>
          );
        })}

        {/* Design section hint */}
        <div className="pt-3 pb-1">
          <p className="px-3 pb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Design</p>
          <Link
            href="/admin/settings#colors"
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
              isColorsActive
                ? "bg-pink-600/20 text-pink-300 border border-pink-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Palette className="w-4 h-4 shrink-0 text-pink-400" />
            <span>Global Colors</span>
            <span className="ml-auto text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded font-semibold">New</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/admin/register"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <UserPlus className="w-4 h-4 shrink-0 text-gray-600" />
          {t("addAdmin")}
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-gray-600" />
          {t("viewWebsite")}
        </Link>
        {/* Version badge */}
        <div className="px-3 pt-2">
          <span className="text-[10px] text-gray-700 font-mono">CMS v2.0</span>
        </div>
      </div>
    </aside>
  );
}
