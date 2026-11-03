import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/catalog";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const statics = ["", "/shop", "/shop/straight", "/shop/curly", "/shop/wavy", "/our-story", "/hair-care", "/contact", "/faq", "/policies/shipping", "/policies/returns", "/policies/privacy", "/policies/terms"];
  let products: { slug: string; updatedAt: Date }[] = [];
  try { products = await listProducts(); } catch {}
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
