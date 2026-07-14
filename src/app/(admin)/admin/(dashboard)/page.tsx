import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { getAdminT } from "@/lib/i18n/admin";
import Link from "next/link";
import { FileText, ShoppingBag, ImageIcon, Settings, Plus, Menu, ArrowRight, Palette } from "lucide-react";

async function getStats() {
  try {
    const [products, media, pages] = await Promise.all([
      prisma.product.count(),
      prisma.mediaFile.count(),
      prisma.pageContent.groupBy({ by: ["pageSlug"] }),
    ]);
    return { products, media, pagesEdited: pages.length };
  } catch {
    return { products: 0, media: 0, pagesEdited: 0 };
  }
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const stats = await getStats();
  const t = getAdminT("dashboard");
  const tNav = getAdminT("nav");
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("greetingMorning") : hour < 18 ? t("greetingDay") : t("greetingEvening");

  const statCards = [
    { label: t("statProducts"), value: stats.products, icon: ShoppingBag, color: "text-blue-600 bg-blue-50" },
    { label: t("statPagesEdited"), value: stats.pagesEdited, icon: FileText, color: "text-violet-600 bg-violet-50" },
    { label: t("statMedia"), value: stats.media, icon: ImageIcon, color: "text-emerald-600 bg-emerald-50" },
  ];

  const quickLinks = [
    { href: "/admin/pages", label: t("editPages"), description: t("editPagesDesc"), icon: FileText, accent: "border-violet-200 hover:border-violet-300 hover:bg-violet-50/50" },
    { href: "/admin/navigation", label: tNav("navigation"), description: "Edit nav links, header CTA, footer content", icon: Menu, accent: "border-blue-200 hover:border-blue-300 hover:bg-blue-50/50" },
    { href: "/admin/products/new", label: t("addProduct"), description: t("addProductDesc"), icon: Plus, accent: "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/50" },
    { href: "/admin/media", label: t("manageMedia"), description: t("manageMediaDesc"), icon: ImageIcon, accent: "border-orange-200 hover:border-orange-300 hover:bg-orange-50/50" },
    { href: "/admin/settings", label: tNav("settings"), description: t("settingsDesc"), icon: Settings, accent: "border-gray-200 hover:border-gray-300 hover:bg-gray-50" },
    { href: "/admin/settings", label: "Global Colors", description: "Change your website-wide color palette", icon: Palette, accent: "border-pink-200 hover:border-pink-300 hover:bg-pink-50/50" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Greeting */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-violet-600 uppercase tracking-widest mb-1">Dashboard</p>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {session?.user?.name ?? "Admin"}
        </h1>
        <p className="text-gray-500 mt-1 text-sm">{t("welcome")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide leading-none mb-1">{label}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t("quickLinks")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map(({ href, label, description, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-4 p-5 bg-white rounded-2xl border transition-all ${accent}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-white flex items-center justify-center shrink-0 transition-colors border border-gray-200">
                <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">{description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Feature highlight banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-pink-50 to-violet-50 border border-violet-200 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-violet-100 flex items-center justify-center shrink-0 mt-0.5">
          <Palette className="w-4 h-4 text-violet-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-violet-900">New: Global Color Palette & Per-text Colors</p>
          <p className="text-xs text-violet-700 mt-0.5 leading-relaxed">
            Go to <strong>Settings → Global Colors</strong> to change your site-wide color palette.
            Individual section headings, labels, and subtext can now have custom colors — edit any page section to find color overrides per text element.
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="flex-shrink-0 px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors"
        >
          Open →
        </Link>
      </div>
    </div>
  );
}
