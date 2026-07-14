import { PageHero } from "@/components/layout/PageHero";
import { getDefaultSectionContent } from "@/lib/cms/default-content";
import { getCmsContent } from "@/lib/cms/content";
import { mapPageHeroContent } from "@/lib/cms/helpers";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal",
  description: "Einblicke in das Kostümhandwerk – Tipps, Inspirationen und Neuigkeiten.",
};

interface JournalPost {
  slug: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
}

export default async function JournalPage() {
  const [heroContent, postsContent] = await Promise.all([
    getCmsContent("journal", "hero", {}),
    getCmsContent("journal", "posts", {}),
  ]);
  const hero = mapPageHeroContent(heroContent, {
    label: "Wissen & Inspiration",
    title: "Journal",
    titleAccent: "Journal",
    subtitle: "Einblicke in das Kostümhandwerk – Tipps, Trends und Geschichten aus unserem Atelier.",
    headingTag: "h1",
  });
  const defaults = getDefaultSectionContent("journal", "posts");
  const postsData = { ...defaults, ...postsContent } as { items: JournalPost[] };
  const posts = postsData.items ?? [];

  return (
    <>
      <PageHero
        label={hero.label}
        title={hero.title}
        titleAccent={hero.titleAccent}
        subtitle={hero.subtitle}
        headingTag={hero.headingTag}
        textColor={hero.textColor}
        accentColor={hero.accentColor}
        appearance={hero.appearance}
        breadcrumbs={[{ label: "Journal", href: "/journal" }]}
      />

      <section className="py-20 section-bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-stone-light hover:border-periwinkle-light hover:shadow-card-hover transition-all duration-300 group overflow-hidden flex flex-col"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-sans font-semibold tracking-[0.15em] uppercase text-periwinkle-dark bg-periwinkle-lighter px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-[11px] text-charcoal-lighter font-sans">{post.date}</span>
                  </div>
                  <h2 className="font-serif text-lg text-charcoal mb-2 leading-snug group-hover:text-periwinkle-dark transition-colors">
                    {post.title}
                  </h2>
                  <p className="font-sans text-sm text-charcoal-lighter leading-relaxed flex-1">{post.excerpt}</p>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="mt-4 text-xs font-sans font-medium text-periwinkle-dark hover:underline inline-flex items-center gap-1"
                  >
                    Weiterlesen →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
