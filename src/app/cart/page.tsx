"use client";
import Image from "next/image";
import Link from "next/link";
import { money, useCart } from "@/components/cart/CartProvider";
import { CrescentMark } from "@/components/brand/Logo";

export default function CartPage() {
  const { items, update, remove, subtotalCents, hydrated } = useCart();
  const hasTba = items.some((i) => !i.priceCents);
  return (
    <section className="mx-auto max-w-6xl px-6 md:px-8 py-16 md:py-24">
      <p className="eyebrow text-plum mb-3">Shopping Bag</p>
      <h1 className="text-4xl md:text-5xl tracking-wide">Your Bag</h1>
      {!hydrated ? null : items.length === 0 ? (
        <div className="mt-16 text-center py-20 border hairline">
          <CrescentMark size={32} className="text-lavender mx-auto mb-5" />
          <p className="serif text-3xl">Your bag is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-8">Explore the Collection</Link>
        </div>
      ) : (
        <div className="mt-12 grid lg:grid-cols-3 gap-12">
          <ul className="lg:col-span-2 divide-y hairline border-y">
            {items.map((i) => (
              <li key={i.key} className="py-6 flex gap-5">
                <Link href={`/products/${i.slug}`} className="relative h-36 w-28 shrink-0 overflow-hidden bg-cloud">
                  <Image src={i.image} alt={i.name} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/products/${i.slug}`} className="serif text-2xl leading-tight">{i.name}</Link>
                      <p className="mt-1 text-xs tracking-wider uppercase text-midnight/60">{i.texture} · {i.length}</p>
                      <p className="mt-1 text-xs text-midnight/60">{money(i.priceCents)} each</p>
                    </div>
                    <p>{money(i.priceCents * i.quantity)}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="inline-flex items-center border hairline">
                      <button aria-label="Decrease" className="px-3 py-1.5 hover:bg-cloud" onClick={() => (i.quantity <= 1 ? remove(i.key) : update(i.key, i.quantity - 1))}>−</button>
                      <span className="w-8 text-center text-sm">{i.quantity}</span>
                      <button aria-label="Increase" className="px-3 py-1.5 hover:bg-cloud disabled:opacity-30" disabled={i.quantity >= i.maxQuantity} onClick={() => update(i.key, i.quantity + 1)}>+</button>
                    </div>
                    <button onClick={() => remove(i.key)} className="text-xs tracking-wider uppercase text-midnight/50 hover:text-midnight">Remove</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="bg-cloud p-7 h-fit lg:sticky lg:top-32">
            <p className="eyebrow text-plum mb-5">Summary</p>
            <div className="flex justify-between text-sm py-2"><span>Subtotal</span><span>{hasTba ? "Pricing TBA" : money(subtotalCents)}</span></div>
            <div className="flex justify-between text-sm py-2 text-midnight/60"><span>Shipping</span><span>Calculated at checkout</span></div>
            <div className="flex justify-between py-3 mt-2 border-t hairline"><span className="serif text-xl">Total</span><span className="serif text-xl">{hasTba ? "TBA" : money(subtotalCents)}</span></div>
            <Link href="/checkout" className="btn btn-primary w-full mt-5">Proceed to Checkout</Link>
            <Link href="/shop" className="block text-center mt-4 eyebrow !text-[0.6rem] text-midnight/60 hover:text-midnight">Continue Shopping</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
