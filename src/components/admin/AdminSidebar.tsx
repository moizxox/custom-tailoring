"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, ShoppingBag, ImageIcon, Menu, Settings,
  UserPlus, ExternalLink, Scissors,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/admin/pages", key: "pages" as const, icon: FileText },
  { href: "/admin/navigation", key: "navigation" as const, icon: Menu },
  { href: "/admin/products", key: "products" as const, icon: ShoppingBag },
  { href: "/admin/media", key: "media" as const, icon: ImageIcon },
  { href: "/admin/settings", key: "settings" as const, icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col bg-gray-950 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/30">
          <Scissors className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-tight">Kostümschneiderei</p>
          <p className="text-[11px] text-gray-500">{t("cmsAdmin")}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all",
                isActive
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", isActive ? "text-white" : "text-gray-500")} />
              {t(item.key)}
            </Link>
          );
        })}
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
      </div>
    </aside>
  );
}
