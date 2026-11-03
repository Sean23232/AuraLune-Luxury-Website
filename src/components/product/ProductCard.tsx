"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ProductWithVariants } from "@/lib/catalog";
import { useCart, money } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icons";

function range(p: ProductWithVariants) {
  const prices = p.variants.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (!prices.length) return "Price TBA";
  const min = Math.min(...prices), max = Math.max(...prices);
  return min === max ? money(min) : `${money(min)} – ${money(max)}`;
}

export function availabilityOf(p: ProductWithVariants, storeMode: string) {
  const purchasable = p.variants.filter((v) => v.available && v.inventory > 0 && v.priceCents > 0);
  if (storeMode !== "live") return { label: "Coming Soon", canBuy: false };
  if (purchasable.length === 0) return { label: "Sold Out", canBuy: false };
  return { label: "In Stock", canBuy: true };
}

export function ProductCard({ product: p, storeMode }: { product: ProductWithVariants; storeMode: string }) {
  const [quick, setQuick] = useState(false);
  const avail = availabilityOf(p, storeMode);
  const lengths = p.variants.filter((v) => v.available).map((v) => v.length);

  return (
    <>
      <article className="group fade-up">
        <div className="relative aspect-[4/5] overflow-hidden bg-cloud img-zoom">
          <Link href={`/products/${p.slug}`} aria-label={p.name}>
            <Image src={p.images[0] || "/images/product-straight.jpg"} alt={p.name} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover" />
          </Link>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {p.isPlaceholder && <span className="bg-ivory/90 text-midnight eyebrow !text-[0.55rem] px-2.5 py-1">Sample</span>}
            <span className={`eyebrow !text-[0.55rem] px-2.5 py-1 ${avail.canBuy ? "bg-midnight text-ivory" : "bg-lavender/90 text-midnight"}`}>{avail.label}</span>
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:flex gap-2">
            <button onClick={() => setQuick(true)} className="btn btn-light flex-1 !py-3 !text-[0.6rem]">Quick View</button>
          </div>
        </div>
        <div className="pt-4 flex items-start justify-between gap-3">
          <div>
            <Link href={`/products/${p.slug}`} className="serif text-xl leading-tight hover:text-plum transition-colors">{p.name}</Link>
            <p className="mt-1 text-[0.68rem] tracking-[0.2em] uppercase text-midnight/55">
              {p.texture} · {lengths.length ? `${lengths[0]}–${lengths[lengths.length - 1]}` : "Lengths TBA"}
            </p>
          </div>
          <p className="text-sm whitespace-nowrap pt-1">{range(p)}</p>
        </div>
        <button onClick={() => setQuick(true)} className="md:hidden mt-3 btn btn-outline w-full !py-3 !text-[0.6rem]">
          {avail.canBuy ? "Add to Bag" : "View Options"}
        </button>
      </article>
      {quick && <QuickView product={p} storeMode={storeMode} onClose={() => setQuick(false)} />}
    </>
  );
}

export function QuickView({ product: p, storeMode, onClose }: { product: ProductWithVariants; storeMode: string; onClose: () => void }) {
  const { add } = useCart();
  const [length, setLength] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const variants = p.variants.filter((v) => v.available);
  const sel = variants.find((v) => v.length === length);
  const live = storeMode === "live";

  function addToBag() {
    if (!sel) return setErr("Please select a length.");
    if (!live) return setErr("Add to Bag opens at launch — this is a preview.");
    if (sel.inventory <= 0 || sel.priceCents <= 0) return setErr("This length is currently unavailable.");
    add({ productId: p.id, variantId: sel.id, slug: p.slug, name: p.name, texture: p.texture, length: sel.length, priceCents: sel.priceCents, image: p.images[0], quantity: 1, maxQuantity: sel.inventory });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6" role="dialog" aria-modal aria-label={`Quick view: ${p.name}`}>
      <div className="absolute inset-0 bg-midnight/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-ivory w-full max-w-3xl max-h-[92vh] overflow-y-auto grid md:grid-cols-2 fade-up">
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 bg-ivory/80 p-2 rounded-full"><Icon.Close /></button>
        <div className="relative aspect-square md:aspect-auto md:min-h-[480px] bg-cloud">
          <Image src={p.images[0]} alt={p.name} fill sizes="(max-width:768px) 100vw, 400px" className="object-cover" />
        </div>
        <div className="p-7 md:p-9 flex flex-col">
          <p className="eyebrow text-plum">{p.texture} bundle{p.isPlaceholder ? " · sample" : ""}</p>
          <h3 className="serif text-3xl mt-2">{p.name}</h3>
          <p className="mt-2 text-sm">{sel ? money(sel.priceCents) : range(p)}</p>
          <p className="mt-4 text-sm text-midnight/70 leading-relaxed line-clamp-4">{p.description}</p>
          <div className="mt-6">
            <p className="eyebrow !text-[0.6rem] text-midnight/60 mb-3">Length</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const soldOut = live && (v.inventory <= 0 || v.priceCents <= 0);
                return (
                  <button key={v.id} disabled={soldOut} onClick={() => { setLength(v.length); setErr(""); }}
                    className={`px-4 py-2 text-xs border transition-colors ${length === v.length ? "bg-midnight text-ivory border-midnight" : "border-midnight/25 hover:border-midnight"} ${soldOut ? "opacity-35 line-through cursor-not-allowed" : ""}`}>
                    {v.length}
                  </button>
                );
              })}
              {variants.length === 0 && <p className="text-sm text-midnight/50">Lengths to be announced.</p>}
            </div>
          </div>
          {err && <p role="alert" className="mt-4 text-xs text-plum">{err}</p>}
          <div className="mt-auto pt-6 space-y-3">
            <button onClick={addToBag} className="btn btn-primary w-full">{live ? "Add to Bag" : "Coming Soon"}</button>
            <Link href={`/products/${p.slug}`} className="block text-center eyebrow !text-[0.6rem] text-midnight/60 hover:text-midnight">View Full Details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
