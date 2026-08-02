import Image from "next/image";
import Link from "next/link";
import type { ShopProductDisplay } from "@/lib/products";

interface ShopProductGridProps {
  products: ShopProductDisplay[];
}

export function ShopProductGrid({ products }: ShopProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-stone-light overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white group flex flex-col h-full"
        >
          {/* Square frame + cover so every card image area matches */}
          <Link
            href={`/shop/${product.slug}`}
            className="block relative w-full aspect-square shrink-0 bg-sand-light/40 overflow-hidden"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain object-center p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-charcoal-lighter text-xs font-sans">
                Kein Bild
              </div>
            )}
            {product.galleryUrls.length > 1 && (
              <span className="absolute bottom-3 right-3 z-10 text-[10px] font-sans font-semibold tracking-wide uppercase bg-white/90 text-charcoal px-2.5 py-1 rounded-full shadow-sm">
                +{product.galleryUrls.length - 1} Fotos
              </span>
            )}
          </Link>

          <div className="p-5 flex flex-col flex-1 min-h-0">
            <p className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-warmgrey mb-1 line-clamp-1 min-h-[1.25rem]">
              {product.category}
            </p>
            <Link href={`/shop/${product.slug}`} className="block">
              <h4 className="font-serif text-lg text-charcoal mb-1 group-hover:text-periwinkle-dark transition-colors line-clamp-2 min-h-[3.25rem]">
                {product.name}
              </h4>
            </Link>
            <p className="font-sans text-xs text-charcoal-lighter mb-3 leading-relaxed line-clamp-3 min-h-[3.6rem]">
              {product.description}
            </p>
            <p className="font-sans text-sm font-semibold text-periwinkle-dark mb-4 min-h-[1.25rem]">
              {product.priceLabel}
            </p>
            <div className="mt-auto flex flex-col gap-2">
              <Link href={`/shop/${product.slug}`} className="btn-secondary w-full justify-center text-xs">
                Angebot ansehen
              </Link>
              <Link
                href={`/kontakt?produkt=${encodeURIComponent(product.name)}`}
                className="btn-outline-dark w-full justify-center text-xs"
              >
                Anfrage senden
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
