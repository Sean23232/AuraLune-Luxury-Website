import type { Metadata } from "next";
import { getSettings, listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [products, settings] = await Promise.all([q ? listProducts({ q }) : Promise.resolve([]), getSettings()]);
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-16 md:py-24">
      <p className="eyebrow text-plum mb-3">Search</p>
      <h1 className="text-4xl md:text-5xl tracking-wide">{q ? <>Results for &ldquo;{q}&rdquo;</> : "Search the collection"}</h1>
      <form className="mt-8 max-w-lg flex gap-3" action="/search">
        <input name="q" defaultValue={q} placeholder="Search bundles, textures…" className="input flex-1" aria-label="Search" />
        <button className="btn btn-primary">Search</button>
      </form>
      <p className="mt-10 mb-8 text-xs text-midnight/50">{q ? `${products.length} result${products.length === 1 ? "" : "s"}` : "Try “straight”, “curly” or “wavy”."}</p>
      {q && <ProductGrid products={products} storeMode={settings.store_mode} />}
    </section>
  );
}
