"use client";
import { useState } from "react";
import type { ProductWithVariants } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products, storeMode, pageSize = 8 }: { products: ProductWithVariants[]; storeMode: string; pageSize?: number }) {
  const [shown, setShown] = useState(pageSize);
  if (products.length === 0) {
    return (
      <div className="py-24 text-center border hairline">
        <p className="serif text-3xl">Nothing here yet.</p>
        <p className="mt-3 text-sm text-midnight/60">Try a different filter, or check back as the collection grows.</p>
      </div>
    );
  }
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
        {products.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} storeMode={storeMode} />)}
      </div>
      {shown < products.length && (
        <div className="mt-14 text-center">
          <button onClick={() => setShown(shown + pageSize)} className="btn btn-outline">Load More</button>
        </div>
      )}
    </>
  );
}
