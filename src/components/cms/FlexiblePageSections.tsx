import Link from "next/link";
import { ContentSection } from "@/components/sections/ContentSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { FaqAccordion, type FaqItemData } from "@/components/sections/FaqAccordion";
import { CmsSectionShell } from "@/components/cms/CmsSectionShell";
import { getCmsContent } from "@/lib/cms/content";
import {
  isModularSectionKey,
  MODULAR_SECTION_DEFAULTS,
} from "@/lib/cms/modular-sections";
import { parseSectionAppearance } from "@/lib/cms/section-appearance";
import { AccentHeadingText } from "@/components/ui/AccentHeadingText";

function splitParagraphs(text: unknown): string[] {
  if (typeof text !== "string" || !text.trim()) return [];
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Renders one modular (flex_*) section for a CMS page. */
export async function renderModularSection(
  pageSlug: string,
  sectionKey: string,
): Promise<React.ReactNode | null> {
  if (!isModularSectionKey(sectionKey)) return null;

  const defaults = MODULAR_SECTION_DEFAULTS[sectionKey] ?? {};
  const content = await getCmsContent(pageSlug, sectionKey, defaults);
  const appearance = parseSectionAppearance(content);

  switch (sectionKey) {
    case "flex_richText": {
      const heading = String(content.heading ?? "");
      const body = splitParagraphs(content.body);
      if (!heading && body.length === 0) return null;
      return (
        <CmsSectionShell appearance={appearance} defaultClassName="section-bg-white" className="py-16 lg:py-20">
          <div className="container-site max-w-3xl mx-auto text-center">
            {content.label ? <p className="section-label mb-4">{String(content.label)}</p> : null}
            {heading ? (
              <h2 className="section-heading mb-6">
                <AccentHeadingText heading={heading} accent={String(content.headingAccent ?? "")} />
              </h2>
            ) : null}
            <div className="space-y-4">
              {body.map((p) => (
                <p key={p.slice(0, 48)} className="font-sans text-sm text-charcoal-light leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </CmsSectionShell>
      );
    }
    case "flex_imageText": {
      const paragraphs = splitParagraphs(content.paragraphs);
      return (
        <ContentSection
          label={String(content.label ?? "") || undefined}
          heading={String(content.heading ?? "Bild und Text")}
          headingAccent={String(content.headingAccent ?? "") || undefined}
          paragraphs={paragraphs.length ? paragraphs : ["—"]}
          imageSrc={String(content.imageSrc ?? "") || "/icons/sewing/fabric-cloth-sewing-tailoring.svg"}
          imageAlt={String(content.imageAlt ?? "")}
          imagePosition={content.imagePosition === "left" ? "left" : "right"}
          ctaLabel={String(content.ctaLabel ?? "") || undefined}
          ctaHref={String(content.ctaUrl ?? "") || undefined}
          appearance={appearance}
        />
      );
    }
    case "flex_cta": {
      return (
        <CmsSectionShell appearance={appearance} defaultClassName="bg-periwinkle-lighter" className="py-16 text-center">
          <div className="container-site max-w-xl mx-auto">
            <h2 className="font-serif text-3xl text-charcoal mb-3">{String(content.heading ?? "")}</h2>
            {content.subtext ? (
              <p className="font-sans text-sm text-charcoal-light mb-7">{String(content.subtext)}</p>
            ) : null}
            {content.buttonLabel && content.buttonUrl ? (
              <Link href={String(content.buttonUrl)} className="btn-primary inline-flex">
                {String(content.buttonLabel)}
              </Link>
            ) : null}
          </div>
        </CmsSectionShell>
      );
    }
    case "flex_process": {
      return (
        <ProcessSection
          acf={{
            acf_fc_layout: "process",
            section_label: String(content.section_label ?? ""),
            heading: String(content.heading ?? ""),
            heading_accent: String(content.heading_accent ?? ""),
            steps: Array.isArray(content.steps)
              ? (content.steps as { number: string; title: string; description: string }[])
              : [],
            ...content,
          }}
        />
      );
    }
    case "flex_gallery": {
      return (
        <GalleryPreview
          acf={{
            acf_fc_layout: "gallery_preview",
            section_label: String(content.section_label ?? ""),
            heading: String(content.heading ?? ""),
            heading_accent: String(content.heading_accent ?? ""),
            subtext: String(content.subtext ?? ""),
            show_cta: content.show_cta !== false && content.show_cta !== "false",
            cta_label: String(content.cta_label ?? "Zur Galerie"),
            cta_url: String(content.cta_url ?? "/galerie"),
            preview_items: Array.isArray(content.preview_items)
              ? (content.preview_items as { src: string; category: string; title: string }[])
              : [],
            ...content,
          }}
        />
      );
    }
    case "flex_faq": {
      const items = (Array.isArray(content.items) ? content.items : []) as FaqItemData[];
      return (
        <CmsSectionShell appearance={appearance} defaultClassName="section-bg-white" className="py-16 lg:py-20">
          <div className="container-site max-w-3xl mx-auto">
            {content.section_label ? (
              <p className="section-label mb-3 text-center">{String(content.section_label)}</p>
            ) : null}
            {content.heading ? (
              <h2 className="section-heading text-center mb-10">{String(content.heading)}</h2>
            ) : null}
            <FaqAccordion items={items} />
          </div>
        </CmsSectionShell>
      );
    }
    case "flex_contactBand": {
      return (
        <CmsSectionShell appearance={appearance} defaultClassName="section-bg-white" className="py-16 text-center">
          <div className="container-site max-w-xl mx-auto">
            {content.label ? <p className="section-label mb-3">{String(content.label)}</p> : null}
            <h2 className="font-serif text-3xl text-charcoal mb-3">{String(content.heading ?? "")}</h2>
            {content.subtext ? (
              <p className="font-sans text-sm text-charcoal-light mb-7">{String(content.subtext)}</p>
            ) : null}
            {content.buttonLabel && content.buttonUrl ? (
              <Link href={String(content.buttonUrl)} className="btn-primary inline-flex">
                {String(content.buttonLabel)}
              </Link>
            ) : null}
          </div>
        </CmsSectionShell>
      );
    }
    default:
      return null;
  }
}

/**
 * Renders all visible modular flex_* sections for a page (ordered).
 * Use on pages whose native layout is not yet fully order-driven.
 */
export async function FlexiblePageSections({
  pageSlug,
  onlyModular = true,
}: {
  pageSlug: string;
  onlyModular?: boolean;
}) {
  const { filterVisibleSectionKeys, getPageHiddenSections, getPageSectionOrder } = await import(
    "@/lib/cms/section-order"
  );
  const [order, hidden] = await Promise.all([
    getPageSectionOrder(pageSlug),
    getPageHiddenSections(pageSlug),
  ]);
  const visible = filterVisibleSectionKeys(order, hidden).filter((key) =>
    onlyModular ? isModularSectionKey(key) : true,
  );

  const nodes = await Promise.all(
    visible.map(async (key) => {
      const node = await renderModularSection(pageSlug, key);
      return node ? <div key={key}>{node}</div> : null;
    }),
  );

  return <>{nodes}</>;
}
