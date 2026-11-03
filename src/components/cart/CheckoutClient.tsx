"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { money, useCart } from "./CartProvider";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function CheckoutClient({ storeMode, paymentsReady, cancelled }: { storeMode: string; paymentsReady: boolean; cancelled: boolean }) {
  const { items, subtotalCents, hydrated, update, remove } = useCart();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState(cancelled ? "Checkout was cancelled. Your bag has been kept for you." : "");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<string[]>([]);
  const live = storeMode === "live";

  // Re-validate items against the catalog so stale prices/stock never reach checkout.
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    fetch("/api/cart/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantIds: items.map((i) => i.variantId) }) })
      .then((r) => r.json())
      .then((d: { variants: { id: number; priceCents: number; inventory: number; available: boolean; published: boolean; name: string; length: string }[] }) => {
        const found: string[] = [];
        for (const i of items) {
          const v = d.variants.find((x) => x.id === i.variantId);
          if (!v || !v.published || !v.available) { found.push(`${i.name} (${i.length}) is no longer available.`); remove(i.key); continue; }
          if (v.inventory < i.quantity) { found.push(`${i.name} (${i.length}) — only ${v.inventory} available; quantity adjusted.`); if (v.inventory <= 0) remove(i.key); else update(i.key, v.inventory); }
        }
        setIssues(found);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  async function pay() {
    setErr("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr("Please enter a valid email address for your order confirmation.");
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, lines: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })) }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to start checkout.");
      window.location.href = data.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unable to start checkout.");
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-24">
      <p className="eyebrow text-plum mb-3">Secure Checkout</p>
      <h1 className="text-4xl md:text-5xl tracking-wide">Almost Yours.</h1>

      {!live && (
        <div className="mt-10 border border-lavender/60 bg-cloud p-7 md:p-10 max-w-2xl">
          <p className="serif text-3xl">Checkout opens at launch.</p>
          <p className="mt-3 text-sm text-midnight/70 leading-relaxed">
            Auralune is currently in preview while we finalise hair samples, vendors and inventory. Your bag is saved on this device. Join the list and we&apos;ll let you know the moment purchasing opens.
          </p>
          <div className="mt-6 relative"><NewsletterForm /></div>
        </div>
      )}

      {live && !paymentsReady && (
        <div className="mt-10 border border-plum/40 bg-cloud p-7 max-w-2xl">
          <p className="serif text-2xl">Payments need configuration.</p>
          <p className="mt-2 text-sm text-midnight/70">Add <code>STRIPE_SECRET_KEY</code> (and optionally <code>NEXT_PUBLIC_SITE_URL</code>) to enable hosted Stripe Checkout with cards, Apple Pay and Google Pay. No payment is ever simulated.</p>
        </div>
      )}

      {hydrated && items.length > 0 && (
        <div className="mt-12 grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-3 space-y-8">
            {issues.length > 0 && (
              <ul role="alert" className="border border-plum/40 p-4 text-sm text-plum space-y-1">{issues.map((x) => <li key={x}>{x}</li>)}</ul>
            )}
            <div>
              <p className="eyebrow !text-[0.62rem] text-midnight/60 mb-3">Contact</p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email for order confirmation" className="input" aria-label="Email" />
            </div>
            <div>
              <p className="eyebrow !text-[0.62rem] text-midnight/60 mb-3">Shipping &amp; Payment</p>
              <p className="text-sm text-midnight/65 leading-relaxed">
                Shipping address, shipping method and payment (credit &amp; debit cards, Apple Pay and Google Pay where supported) are collected securely on the next step, hosted by our payment provider. US shipping only at this time.
              </p>
            </div>
            {err && <p role="alert" className="text-sm text-plum border-l-2 border-plum pl-3">{err}</p>}
            <button onClick={pay} disabled={!live || !paymentsReady || loading} className="btn btn-primary w-full sm:w-auto">
              {loading ? "Redirecting…" : "Continue to Secure Payment"}
            </button>
          </div>
          <aside className="lg:col-span-2 bg-cloud p-7 h-fit">
            <p className="eyebrow text-plum mb-5">Order Summary</p>
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4 items-center">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-ivory"><Image src={i.image} alt="" fill sizes="56px" className="object-cover" /></div>
                  <div className="flex-1 text-sm"><p className="serif text-lg leading-tight">{i.name}</p><p className="text-xs text-midnight/60 uppercase tracking-wider">{i.texture} · {i.length} × {i.quantity}</p></div>
                  <p className="text-sm">{money(i.priceCents * i.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between pt-5 mt-5 border-t hairline"><span className="serif text-xl">Subtotal</span><span className="serif text-xl">{money(subtotalCents)}</span></div>
            <p className="text-xs text-midnight/55 mt-2">Shipping &amp; taxes calculated at payment.</p>
          </aside>
        </div>
      )}
      {hydrated && items.length === 0 && (
        <p className="mt-10 text-sm text-midnight/60">Your bag is empty. <Link href="/shop" className="underline">Explore the collection</Link>.</p>
      )}
    </section>
  );
}
