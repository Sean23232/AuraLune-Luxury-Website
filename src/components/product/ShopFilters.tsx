"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ShopFilters({ lengths, current }: { lengths: string[]; current: { texture?: string; length?: string; sort?: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function setParam(k: string, v: string) {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.push(`${pathname}?${p.toString()}`, { scroll: false });
  }
  const qs = sp.toString() ? `?${sp.toString()}` : "";
  const tabs = [["All", "/shop"], ["Straight", "/shop/straight"], ["Curly", "/shop/curly"], ["Wavy", "/shop/wavy"]];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-y hairline py-4">
      <nav aria-label="Texture" className="flex gap-6 overflow-x-auto">
        {tabs.map(([label, href]) => {
          const active = (href === "/shop" && !current.texture) || href.endsWith(current.texture || "---");
          return <Link key={href} href={href + qs} className={`eyebrow !text-[0.62rem] whitespace-nowrap pb-1 border-b transition-colors ${active ? "border-midnight" : "border-transparent text-midnight/55 hover:text-midnight"}`}>{label}</Link>;
        })}
      </nav>
      <div className="flex gap-4 items-center">
        <label className="flex items-center gap-2 text-xs">
          <span className="eyebrow !text-[0.58rem] text-midnight/55">Length</span>
          <select value={current.length || ""} onChange={(e) => setParam("length", e.target.value)} className="bg-transparent border hairline px-3 py-2 text-xs outline-none">
            <option value="">All</option>
            {lengths.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs">
          <span className="eyebrow !text-[0.58rem] text-midnight/55">Sort</span>
          <select value={current.sort || ""} onChange={(e) => setParam("sort", e.target.value)} className="bg-transparent border hairline px-3 py-2 text-xs outline-none">
            <option value="">Featured</option>
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>
    </div>
  );
}
