import Image from "next/image";
import Link from "next/link";
import type { ShopProductDisplay } from "@/lib/products";

interface ShopProductGridProps {
  products: ShopProductDisplay[];
}

export function ShopProductGrid({ products }: ShopProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-stone-light overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 bg-white group flex flex-col"
        >
          <Link
            href={`/shop/${product.slug}`}
            className="block relative aspect-[3/4] bg-sand-light/30 overflow-hidden"
          >
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width:768px) 100vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-charcoal-lighter text-xs font-sans">
                Kein Bild
              </div>
            )}
            {product.galleryUrls.length > 1 && (
              <span className="absolute bottom-3 right-3 text-[10px] font-sans font-semibold tracking-wide uppercase bg-white/90 text-charcoal px-2.5 py-1 rounded-full">
                +{product.galleryUrls.length - 1} Fotos
              </span>
            )}
          </Link>
          <div className="p-5 flex flex-col flex-1">
            <p className="font-sans text-[10px] font-semibold tracking-[0.14em] uppercase text-warmgrey mb-1 line-clamp-2">
              {product.category}
            </p>
            <Link href={`/shop/${product.slug}`} className="block">
              <h4 className="font-serif text-lg text-charcoal mb-1 group-hover:text-periwinkle-dark transition-colors">
                {product.name}
              </h4>
            </Link>
            <p className="font-sans text-xs text-charcoal-lighter mb-3 leading-relaxed line-clamp-3 flex-1">
              {product.description}
            </p>
            <p className="font-sans text-sm font-semibold text-periwinkle-dark mb-4">{product.priceLabel}</p>
            <div className="flex flex-col gap-2">
              <Link href={`/shop/${product.slug}`} className="btn-secondary w-full justify-center text-xs">
                Details ansehen
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
