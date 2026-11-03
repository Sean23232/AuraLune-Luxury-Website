"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  key: string; // `${productId}-${variantId}`
  productId: number;
  variantId: number;
  slug: string;
  name: string;
  texture: string;
  length: string;
  priceCents: number;
  image: string;
  quantity: number;
  maxQuantity: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (item: Omit<CartItem, "key">) => void;
  update: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  hydrated: boolean;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "auralune:cart:v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const add = useCallback((item: Omit<CartItem, "key">) => {
    const key = `${item.productId}-${item.variantId}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        const qty = Math.min(existing.quantity + item.quantity, Math.max(1, item.maxQuantity || 99));
        return prev.map((i) => (i.key === key ? { ...i, quantity: qty } : i));
      }
      return [...prev, { ...item, key }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxQuantity || 99) } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      subtotalCents: items.reduce((n, i) => n + i.quantity * i.priceCents, 0),
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      update,
      remove,
      clear,
      hydrated,
    }),
    [items, isOpen, add, update, remove, clear, hydrated],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}

export function money(cents: number) {
  if (!cents) return "Price TBA";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}
