import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

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
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";

  const quickLinks = [
    { href: "/admin/pages", label: "Seiten bearbeiten", description: "Texte und Bilder auf allen Seiten anpassen", icon: "📄", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { href: "/admin/products/new", label: "Produkt hinzufügen", description: "Neues Produkt im Shop erstellen", icon: "➕", color: "bg-green-50 border-green-200 hover:bg-green-100" },
    { href: "/admin/media", label: "Medien verwalten", description: "Bilder hochladen und verwalten", icon: "🖼️", color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { href: "/admin/settings", label: "Einstellungen", description: "Kontaktdaten und Standorte aktualisieren", icon: "⚙️", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {session?.user?.name ?? "Admin"} 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Willkommen im CMS der Kostümschneiderei Basel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Produkte</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.products}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Seiten bearbeitet</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pagesEdited}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">Medien</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.media}</p>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Schnellzugriff</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-start gap-4 p-5 rounded-xl border transition-colors ${item.color}`}
            >
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="mt-8 p-4 bg-periwinkle-50 border border-periwinkle-200 rounded-xl flex items-start gap-3">
        <svg className="w-5 h-5 text-periwinkle-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <div>
          <p className="text-sm font-medium text-periwinkle-800">CMS Phase 1</p>
          <p className="text-xs text-periwinkle-700 mt-0.5">
            Um Inhalte zu bearbeiten, verbinden Sie zuerst eine Neon-Datenbank in den Umgebungsvariablen.
            Bis dahin zeigt die Website die statischen Standardinhalte.
          </p>
        </div>
      </div>
    </div>
  );
}
