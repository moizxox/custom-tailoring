import { createElement } from "react";
import type { HeadingTag } from "@/lib/cms/helpers";

export interface CmsDocumentSection {
  title: string;
  headingTag?: string;
  body: string;
}

function parseHeadingTag(tag?: string): HeadingTag {
  if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") return tag;
  return "h2";
}

export function CmsDocumentSections({ sections }: { sections: CmsDocumentSection[] }) {
  return (
    <div className="flex flex-col gap-8 font-sans text-sm text-charcoal-light leading-relaxed">
      {sections.map((section) => {
        const Tag = parseHeadingTag(section.headingTag);
        const paragraphs = section.body.split(/\n\n+/).filter(Boolean);
        return (
          <div key={`${section.title}-${section.body.slice(0, 24)}`}>
            {createElement(
              Tag,
              { className: "font-serif text-xl text-charcoal mb-3" },
              section.title,
            )}
            <div className="flex flex-col gap-2">
              {paragraphs.map((p) => (
                <p key={p.slice(0, 48)}>{p}</p>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
