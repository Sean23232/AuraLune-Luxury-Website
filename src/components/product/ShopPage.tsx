import Image from "next/image";
import { Suspense } from "react";
import { getAllLengths, getSettings, listProducts, TEXTURES } from "@/lib/catalog";
import { ProductGrid } from "./ProductGrid";
import { ShopFilters } from "./ShopFilters";

export async function ShopPage({ texture, searchParams }: { texture?: string; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const length = typeof sp.length === "string" ? sp.length : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const [products, lengths, settings] = await Promise.all([listProducts({ texture, length, sort }), getAllLengths(), getSettings()]);
  const t = TEXTURES.find((x) => x.slug === texture);
  const title = t ? `${t.name} Bundles` : "Shop All Bundles";
  const intro = t ? t.tagline : "The beginnings of the Auralune collection — straight, curly and wavy bundles, thoughtfully envisioned.";

  return (
    <>
      <section className="relative overflow-hidden bg-midnight text-ivory py-24 md:py-32">
        <Image src={t?.image || "/images/texture-wavy.jpg"} alt="" fill priority sizes="100vw" className="object-cover object-top opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/85 to-midnight/30" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <p className="eyebrow text-lavender mb-4 fade-up">{t ? "Collection" : "The Collection"}</p>
          <h1 className="text-5xl md:text-7xl tracking-wide fade-up delay-1">{title}</h1>
          <p className="mt-5 text-ivory/75 max-w-md font-light fade-up delay-2">{intro}</p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-10 md:py-14">
        <Suspense><ShopFilters lengths={lengths} current={{ texture, length, sort }} /></Suspense>
        <p className="mt-5 mb-8 text-xs text-midnight/50">{products.length} {products.length === 1 ? "bundle" : "bundles"}{settings.store_mode !== "live" && " · Store in preview — purchasing opens at launch"}</p>
        <ProductGrid products={products} storeMode={settings.store_mode} />
      </section>
    </>
  );
}
