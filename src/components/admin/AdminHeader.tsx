"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { User } from "next-auth";
import { LogOut, Scissors } from "lucide-react";

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const t = useTranslations("nav");

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Mobile brand */}
      <div className="lg:hidden flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center shadow-sm">
          <Scissors className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-900">{t("cmsAdmin")}</span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* User info */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-xs">
            {(user.name ?? user.email ?? "A").slice(0, 1).toUpperCase()}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 leading-none">{user.name ?? user.email}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Administrator</p>
          </div>
        </div>

        <div className="w-px h-5 bg-gray-200 hidden sm:block" />

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title={t("signOut")}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline text-sm">{t("signOut")}</span>
        </button>
      </div>
    </header>
  );
}
