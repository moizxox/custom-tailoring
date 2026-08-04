import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { FlexiblePageSections } from "@/components/cms/FlexiblePageSections";
import { prisma } from "@/lib/db/prisma";
import { normalizeCustomPageContent } from "@/lib/cms/custom-pages";
import { isReservedCustomSlug } from "@/lib/cms/custom-page-routes";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isReservedCustomSlug(slug)) return { title: "Seite" };
  try {
    const page = await prisma.customPage.findFirst({
      where: { slug, published: true },
      select: { title: true, content: true },
    });
    if (!page) return { title: "Seite" };
    const content = normalizeCustomPageContent(page.content);
    return {
      title: page.title,
      description: content.hero.subtitle || undefined,
    };
  } catch {
    return { title: "Seite" };
  }
}

export default async function CustomPublicPage({ params }: Props) {
  const { slug } = await params;
  if (isReservedCustomSlug(slug)) notFound();

  let page;
  try {
    page = await prisma.customPage.findFirst({
      where: { slug, published: true },
    });
  } catch {
    notFound();
  }
  if (!page) notFound();

  const content = normalizeCustomPageContent(page.content);
  const heroTitle = content.hero.title || page.title;
  const navLabel = page.navLabel || page.title;

  return (
    <>
      <PageHero
        label={content.hero.label}
        title={heroTitle}
        titleAccent={content.hero.titleAccent}
        subtitle={content.hero.subtitle}
        breadcrumbs={[{ label: navLabel, href: `/${page.slug}` }]}
      />
      {content.blocks.length > 0 && (
        <section className="py-16 section-bg-white">
          <div className="container-site max-w-3xl mx-auto space-y-10">
            {content.blocks.map((block) => (
              <article key={block.id} className="space-y-3">
                {block.title && (
                  <h2 className="font-serif text-2xl text-charcoal">{block.title}</h2>
                )}
                {block.body
                  .split(/\n\n+/)
                  .map((para) => para.trim())
                  .filter(Boolean)
                  .map((para) => (
                    <p
                      key={para.slice(0, 40)}
                      className="font-sans text-[15px] text-charcoal-light leading-relaxed whitespace-pre-line"
                    >
                      {para}
                    </p>
                  ))}
              </article>
            ))}
          </div>
        </section>
      )}
      <FlexiblePageSections pageSlug={page.slug} onlyModular />
    </>
  );
}
