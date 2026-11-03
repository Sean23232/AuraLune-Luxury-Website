import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getSettings, listProducts, textureLabel } from "@/lib/catalog";
import { ProductGallery, ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { CrescentMark } from "@/components/brand/Logo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: { title: `${p.name} | AURALUNE`, images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, settings] = await Promise.all([getProduct(slug), getSettings()]);
  if (!p || !p.published) notFound();
  const all = await listProducts();
  const related = all.filter((x) => x.id !== p.id).slice(0, 4);
  const siblings = all
    .filter((x) => x.texture !== p.texture)
    .reduce<{ texture: string; slug: string }[]>((acc, x) => (acc.some((a) => a.texture === x.texture) ? acc : [...acc, { texture: x.texture, slug: x.slug }]), []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images,
    brand: { "@type": "Brand", name: "Auralune" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 md:px-8 pt-6 text-[0.65rem] tracking-[0.18em] uppercase text-midnight/50 flex gap-2">
        <Link href="/" className="hover:text-midnight">Home</Link><span>/</span>
        <Link href="/shop" className="hover:text-midnight">Shop</Link><span>/</span>
        <Link href={`/shop/${p.texture}`} className="hover:text-midnight">{textureLabel(p.texture)}</Link><span>/</span>
        <span className="text-midnight">{p.name}</span>
      </nav>

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-8 md:py-12 grid md:grid-cols-2 gap-10 md:gap-16 items-start">
        <ProductGallery images={p.images} name={p.name} />
        <div>
          <ProductPurchase product={p} storeMode={settings.store_mode} siblings={siblings} />

          <div className="mt-12 divide-y hairline border-y">
            <Accordion title="Shipping Information" open>
              <p>{settings.shipping_note}</p>
              <p className="mt-2">Shipping nationwide across the United States. See our <Link href="/policies/shipping" className="underline">shipping policy</Link>.</p>
            </Accordion>
            <Accordion title="Product Details">
              <p>{p.details || "Details to be confirmed."}</p>
              <ul className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">
                <li><span className="text-midnight/50">Texture</span> — {textureLabel(p.texture)}</li>
                <li><span className="text-midnight/50">Lengths</span> — {p.variants.filter((v) => v.available).map((v) => v.length).join(", ") || "TBA"}</li>
              </ul>
            </Accordion>
            <Accordion title="Hair Care">
              <p>{p.careNotes}</p>
              <Link href="/hair-care" className="inline-block mt-2 underline">Read the full hair care guide</Link>
            </Accordion>
            <Accordion title="Returns & Exchanges">
              <p>{settings.returns_note} <Link href="/policies/returns" className="underline">Learn more</Link>.</p>
            </Accordion>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-cloud py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center reveal">
              <CrescentMark size={20} className="text-lavender mx-auto mb-4" />
              <h2 className="text-3xl md:text-5xl tracking-wide">You May Also Love</h2>
            </div>
            <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {related.map((r) => <ProductCard key={r.id} product={r} storeMode={settings.store_mode} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Accordion({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group py-4" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between eyebrow !text-[0.62rem]">
        {title}
        <span className="text-lg font-light transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-3 text-sm text-midnight/70 leading-relaxed">{children}</div>
    </details>
  );
}
