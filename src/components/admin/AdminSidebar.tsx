"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, ShoppingBag, ImageIcon, Menu, Settings,
  UserPlus, ExternalLink, Scissors, Palette, Users, FolderKanban, UsersRound, Inbox,
} from "lucide-react";
import { CrmSearchBar } from "@/components/crm/CrmSearchBar";

const CRM_NAV_ITEMS = [
  { href: "/admin/crm", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/crm/submissions", label: "Anfragen", icon: Inbox, exact: false, badgeKey: "submissions" as const },
  { href: "/admin/crm/customers", label: "Kunden", icon: Users, exact: false },
  { href: "/admin/crm/groups", label: "Gruppen", icon: UsersRound, exact: false },
  { href: "/admin/crm/projects", label: "Projekte", icon: FolderKanban, exact: false },
];

const NAV_ITEMS = [
  { href: "/admin", key: "dashboard" as const, icon: LayoutDashboard, exact: true },
  { href: "/admin/pages", key: "pages" as const, icon: FileText, exact: false },
  { href: "/admin/navigation", key: "navigation" as const, icon: Menu, exact: false },
  { href: "/admin/products", key: "products" as const, icon: ShoppingBag, exact: false },
  { href: "/admin/media", key: "media" as const, icon: ImageIcon, exact: false },
  { href: "/admin/settings", key: "settings" as const, icon: Settings, exact: false },
];

export default function AdminSidebar({ unreadSubmissions = 0 }: { unreadSubmissions?: number }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const isColorsActive = pathname === "/admin/settings";

  return (
    <aside className="w-[220px] shrink-0 hidden lg:flex flex-col bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-200">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shrink-0 shadow-sm">
          <Scissors className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-gray-900 leading-tight">Kostümschneiderei</p>
          <p className="text-[11px] text-gray-500">{t("cmsAdmin")}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="px-3 pb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Content</p>
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
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700")} />
              {t(item.key)}
              {item.key === "settings" && !isActive && (
                <span className="ml-auto flex items-center gap-0.5">
                  {["#9da5d0", "#d4c9b8", "#2c2a28"].map((c) => (
                    <span key={c} className="w-2 h-2 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                  ))}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-3 pb-1">
          <p className="px-3 pb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">CRM</p>
          <div className="px-1 mb-2">
            <CrmSearchBar />
          </div>
          {CRM_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400",
                  isActive
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700")} />
                {item.label}
                {"badgeKey" in item && item.badgeKey === "submissions" && unreadSubmissions > 0 && (
                  <span className="ml-auto text-[10px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                    {unreadSubmissions > 9 ? "9+" : unreadSubmissions}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-3 pb-1">
          <p className="px-3 pb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Design</p>
          <Link
            href="/admin/settings#colors"
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400",
              isColorsActive
                ? "bg-pink-50 text-pink-700 border border-pink-200"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            <Palette className="w-4 h-4 shrink-0 text-pink-500" />
            <span>Global Colors</span>
            <span className="ml-auto text-[10px] bg-pink-100 text-pink-600 px-1.5 py-0.5 rounded font-semibold">New</span>
          </Link>
        </div>
      </nav>

      <div className="px-3 py-4 border-t border-gray-200 space-y-0.5">
        <Link
          href="/admin/register"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <UserPlus className="w-4 h-4 shrink-0 text-gray-500" />
          {t("addAdmin")}
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <ExternalLink className="w-4 h-4 shrink-0 text-gray-500" />
          {t("viewWebsite")}
        </Link>
        <div className="px-3 pt-2">
          <span className="text-[10px] text-gray-400 font-mono">CMS v2.0</span>
        </div>
      </div>
    </aside>
  );
}
