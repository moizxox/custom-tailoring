import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { getNavItems, getFooterContent } from "@/lib/cms/navigation";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [navItems, footerContent] = await Promise.all([getNavItems(), getFooterContent()]);

  return (
    <>
      <Navbar
        navItems={navItems}
        ctaLabel={footerContent.ctaPrimaryLabel}
        ctaUrl={footerContent.ctaPrimaryUrl}
      />
      <main className="flex-1 site-shell">{children}</main>
      <Footer footerContent={footerContent} />
      <CookieConsent />
    </>
  );
}
