"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { money, useCart } from "./CartProvider";
import { Icon } from "@/components/ui/Icons";
import { CrescentMark } from "@/components/brand/Logo";

export function CartDrawer({ storeMode }: { storeMode: string }) {
  const { items, isOpen, close, update, remove, subtotalCents, count } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const hasTba = items.some((i) => !i.priceCents);

  return (
    <>
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-[70] bg-midnight/50 backdrop-blur-[2px] transition-opacity duration-500 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Shopping bag"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b hairline px-6 py-5">
          <div>
            <p className="eyebrow text-plum">Your Bag</p>
            <p className="serif text-2xl mt-1">{count} {count === 1 ? "item" : "items"}</p>
          </div>
          <button onClick={close} aria-label="Close bag" className="p-2 hover:opacity-60 transition-opacity">
            <Icon.Close />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <CrescentMark size={36} className="text-lavender mb-5" />
              <p className="serif text-2xl">Your bag is empty.</p>
              <p className="mt-2 text-sm text-midnight/60 max-w-xs">Discover the beginnings of the Auralune collection.</p>
              <Link href="/shop" onClick={close} className="btn btn-primary mt-8">Explore the Collection</Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((i) => (
                <li key={i.key} className="flex gap-4">
                  <Link href={`/products/${i.slug}`} onClick={close} className="relative h-28 w-24 shrink-0 overflow-hidden bg-cloud">
                    <Image src={i.image} alt={i.name} fill sizes="96px" className="object-cover" />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <p className="serif text-lg leading-tight">{i.name}</p>
                        <p className="mt-1 text-xs tracking-wider uppercase text-midnight/60">
                          {i.texture} · {i.length}
                        </p>
                      </div>
                      <p className="text-sm">{money(i.priceCents * i.quantity)}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="inline-flex items-center border hairline">
                        <button aria-label="Decrease quantity" className="px-3 py-1.5 hover:bg-cloud" onClick={() => (i.quantity <= 1 ? remove(i.key) : update(i.key, i.quantity - 1))}>−</button>
                        <span className="w-8 text-center text-sm">{i.quantity}</span>
                        <button aria-label="Increase quantity" className="px-3 py-1.5 hover:bg-cloud disabled:opacity-30" disabled={i.quantity >= i.maxQuantity} onClick={() => update(i.key, i.quantity + 1)}>+</button>
                      </div>
                      <button onClick={() => remove(i.key)} className="text-xs tracking-wider uppercase text-midnight/50 hover:text-midnight link-underline">Remove</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t hairline px-6 py-6 space-y-4 bg-cloud/50">
            <div className="flex justify-between text-sm">
              <span className="text-midnight/70">Subtotal</span>
              <span>{hasTba ? "Pricing TBA" : money(subtotalCents)}</span>
            </div>
            <p className="text-xs text-midnight/55 leading-relaxed">
              Shipping and taxes are calculated at checkout.
              {storeMode !== "live" && " The store is currently in preview — checkout opens at launch."}
            </p>
            <Link href="/checkout" onClick={close} className="btn btn-primary w-full">Proceed to Checkout</Link>
            <Link href="/cart" onClick={close} className="block text-center text-xs tracking-[0.2em] uppercase text-midnight/60 hover:text-midnight">View full bag</Link>
          </div>
        )}
      </aside>
    </>
  );
}
