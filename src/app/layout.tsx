import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { SiteReveal } from "@/components/motion/SiteReveal";
import { getGlobalColors, buildColorStyleTag } from "@/lib/cms/global-colors";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
    template: "%s | Kostümschneiderei Basel",
  },
  description: "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel. Individuelle Beratung, hochwertige Materialien, professionelle Umsetzung.",
  keywords: ["Kostüm", "Schneiderei", "Basel", "Fasnacht", "Guggenmusik", "Massanfertigung", "Kostüm Basel", "Clique"],
  authors: [{ name: "Kostümschneiderei Basel" }],
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.kostuemschneiderei.ch",
    siteName: "Kostümschneiderei Basel",
    title: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
    description: "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalColors = await getGlobalColors();
  const colorCSS = buildColorStyleTag(globalColors);

  return (
    <html lang="de" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/* Dynamic global color palette override — set in CMS Settings → Colors */}
        <style dangerouslySetInnerHTML={{ __html: colorCSS }} />
      </head>
      <body className="min-h-screen flex flex-col bg-offwhite text-charcoal antialiased">
        <SiteReveal />
        {children}
      </body>
    </html>
  );
}
