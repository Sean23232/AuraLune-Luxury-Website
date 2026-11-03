"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProductWithVariants } from "@/lib/catalog";
import { money, useCart } from "@/components/cart/CartProvider";
import { Icon } from "@/components/ui/Icons";

const TEXTURES = ["straight", "curly", "wavy"] as const;

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const list = images.length ? images : ["/images/product-straight.jpg"];
  return (
    <div className="md:sticky md:top-32">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-cloud cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
      >
        <Image
          key={list[i]}
          src={list[i]}
          alt={`${name} — image ${i + 1}`}
          fill
          priority
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 fade-up"
          style={zoom ? { transform: "scale(1.8)", transformOrigin: `${pos.x}% ${pos.y}%` } : undefined}
        />
        {list.length > 1 && (
          <>
            <button aria-label="Previous image" onClick={() => setI((i - 1 + list.length) % list.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-ivory/85 p-2 rounded-full rotate-180"><Icon.Arrow /></button>
            <button aria-label="Next image" onClick={() => setI((i + 1) % list.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-ivory/85 p-2 rounded-full"><Icon.Arrow /></button>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((src, idx) => (
            <button key={src + idx} onClick={() => setI(idx)} aria-label={`View image ${idx + 1}`} className={`relative aspect-square overflow-hidden border transition-colors ${idx === i ? "border-midnight" : "border-transparent"}`}>
              <Image src={src} alt="" fill sizes="100px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductPurchase({ product: p, storeMode, siblings }: { product: ProductWithVariants; storeMode: string; siblings: { texture: string; slug: string }[] }) {
  const router = useRouter();
  const { add } = useCart();
  const [length, setLength] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");
  const [added, setAdded] = useState(false);
  const live = storeMode === "live";
  const variants = p.variants.filter((v) => v.available);
  const sel = variants.find((v) => v.length === length);

  const status = !live
    ? { label: "Coming Soon", cls: "text-plum" }
    : sel
      ? sel.inventory > 0 && sel.priceCents > 0
        ? { label: sel.inventory <= 5 ? `Only ${sel.inventory} left` : "In Stock", cls: "text-twilight" }
        : { label: "Sold Out", cls: "text-plum" }
      : variants.some((v) => v.inventory > 0 && v.priceCents > 0)
        ? { label: "Select a length", cls: "text-midnight/60" }
        : { label: "Sold Out", cls: "text-plum" };

  function validate() {
    if (!sel) { setErr("Please select a length before adding to your bag."); return false; }
    if (!live) { setErr("Auralune is in preview — purchasing opens at launch. Join the list to be first."); return false; }
    if (sel.inventory <= 0 || sel.priceCents <= 0) { setErr("This length is currently unavailable."); return false; }
    return true;
  }
  function payload() {
    return { productId: p.id, variantId: sel!.id, slug: p.slug, name: p.name, texture: p.texture, length: sel!.length, priceCents: sel!.priceCents, image: p.images[0], quantity: qty, maxQuantity: sel!.inventory };
  }
  function addToBag() {
    if (!validate()) return;
    add(payload());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }
  function buyNow() {
    if (!validate()) return;
    add(payload());
    router.push("/checkout");
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <p className="eyebrow text-plum">{p.texture} bundle</p>
        {p.isPlaceholder && <span className="eyebrow !text-[0.55rem] border hairline px-2 py-0.5 text-midnight/60">Sample product</span>}
      </div>
      <h1 className="serif text-4xl md:text-5xl mt-3 leading-tight">{p.name}</h1>
      <div className="mt-4 flex items-baseline gap-4">
        <p className="text-lg">{sel ? money(sel.priceCents) : priceRange(p)}</p>
        <p className={`text-xs tracking-wider uppercase ${status.cls}`}>{status.label}</p>
      </div>
      <p className="mt-6 text-sm md:text-base text-midnight/72 leading-relaxed font-light">{p.description}</p>

      {/* Texture */}
      <div className="mt-8">
        <p className="eyebrow !text-[0.6rem] text-midnight/60 mb-3">Texture — <span className="normal-case tracking-normal text-midnight">{p.texture}</span></p>
        <div className="flex gap-2">
          {TEXTURES.map((t) => {
            const sib = t === p.texture ? { slug: p.slug } : siblings.find((s) => s.texture === t);
            const inner = <span className={`px-4 py-2 text-xs border capitalize transition-colors ${t === p.texture ? "bg-midnight text-ivory border-midnight" : sib ? "border-midnight/25 hover:border-midnight" : "border-midnight/10 text-midnight/35 cursor-not-allowed"}`}>{t}</span>;
            return sib && t !== p.texture ? <Link key={t} href={`/products/${sib.slug}`}>{inner}</Link> : <span key={t}>{inner}</span>;
          })}
        </div>
      </div>

      {/* Length */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <p className="eyebrow !text-[0.6rem] text-midnight/60">Length {sel && <span className="normal-case tracking-normal text-midnight">— {sel.length}</span>}</p>
          <Link href="/faq#lengths" className="text-[0.65rem] tracking-wider uppercase text-midnight/50 link-underline">Length guide</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const unavailable = live && (v.inventory <= 0 || v.priceCents <= 0);
            return (
              <button key={v.id} type="button" disabled={unavailable} aria-pressed={length === v.length}
                onClick={() => { setLength(v.length); setErr(""); setQty(1); }}
                className={`min-w-[3.25rem] px-4 py-2.5 text-xs border transition-colors ${length === v.length ? "bg-midnight text-ivory border-midnight" : "border-midnight/25 hover:border-midnight"} ${unavailable ? "opacity-35 line-through cursor-not-allowed" : ""}`}>
                {v.length}
              </button>
            );
          })}
          {variants.length === 0 && <p className="text-sm text-midnight/50">Length options will be announced closer to launch.</p>}
        </div>
      </div>

      {/* Quantity */}
      <div className="mt-6 flex items-center gap-6">
        <p className="eyebrow !text-[0.6rem] text-midnight/60">Quantity</p>
        <div className="inline-flex items-center border hairline">
          <button type="button" aria-label="Decrease" className="px-4 py-2.5 hover:bg-cloud" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
          <span className="w-10 text-center text-sm">{qty}</span>
          <button type="button" aria-label="Increase" className="px-4 py-2.5 hover:bg-cloud disabled:opacity-30" disabled={!!sel && live && qty >= sel.inventory} onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>

      {err && <p role="alert" className="mt-5 text-sm text-plum border-l-2 border-plum pl-3">{err}</p>}

      <div className="mt-8 grid gap-3">
        <button onClick={addToBag} className="btn btn-primary w-full">{added ? "✦ Added to Bag" : live ? "Add to Bag" : "Coming Soon — Add to Bag"}</button>
        <button onClick={buyNow} className="btn btn-outline w-full">Buy Now</button>
        {!live && <Link href="/#newsletter" className="text-center eyebrow !text-[0.6rem] text-plum hover:text-midnight pt-1">Join the list to be notified at launch</Link>}
      </div>
    </div>
  );
}

function priceRange(p: ProductWithVariants) {
  const prices = p.variants.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (!prices.length) return "Price TBA";
  const min = Math.min(...prices), max = Math.max(...prices);
  return min === max ? money(min) : `${money(min)} – ${money(max)}`;
}
