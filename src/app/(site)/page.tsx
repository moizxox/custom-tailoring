import { renderHomePageSections } from "@/lib/cms/home-sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kostümschneiderei Basel – Ihre Kostüme. Unser Handwerk.",
  description:
    "Massgeschneiderte Kostüme für Guggenmusiken, Cliquen und Einzelpersonen in Basel. Individuelle Beratung, hochwertige Materialien und persönlicher Service.",
};

export default async function HomePage() {
  const sections = await renderHomePageSections();
  return <>{sections}</>;
}
