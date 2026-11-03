import { db } from "@/db";
import { products, productVariants, siteSettings } from "@/db/schema";
import type { Product, ProductVariant } from "@/db/schema";
import { and, asc, eq, ilike, inArray, or, sql } from "drizzle-orm";

export type Texture = "straight" | "curly" | "wavy";
export const TEXTURES: { slug: Texture; name: string; tagline: string; image: string }[] = [
  { slug: "straight", name: "Straight", tagline: "Sleek, smooth, luminous.", image: "/images/texture-straight.jpg" },
  { slug: "curly", name: "Curly", tagline: "Defined, full, radiant.", image: "/images/texture-curly.jpg" },
  { slug: "wavy", name: "Wavy", tagline: "Soft, flowing, effortless.", image: "/images/texture-wavy.jpg" },
];

export type ProductWithVariants = Product & { variants: ProductVariant[] };

export const DEFAULT_SETTINGS: Record<string, string> = {
  store_mode: "preview", // preview | live
  announcement: "AN ELEVATED HAIR EXPERIENCE IS ON THE HORIZON.",
  instagram_url: "https://instagram.com/",
  tiktok_url: "https://tiktok.com/",
  facebook_url: "https://facebook.com/",
  contact_email: "",
  shipping_note:
    "Shipping options and rates will be published once fulfillment is confirmed. Complimentary shipping thresholds are being considered.",
  returns_note:
    "Returns & exchange terms are being finalized and will be published before launch.",
};

/* ---------- Seed (idempotent) ---------- */
const SEED_LENGTHS = ['14"', '16"', '18"', '20"', '22"', '24"'];

const SEED_PRODUCTS = [
  {
    slug: "luna-straight-bundle",
    name: "Luna Straight Bundle",
    texture: "straight",
    description:
      "A sleek, luminous straight bundle envisioned as the signature of the Auralune collection. Sample product for design preview — specifications to be confirmed.",
    images: ["/images/product-straight.jpg", "/images/texture-straight.jpg"],
    basePriceCents: 0,
    featured: true,
  },
  {
    slug: "celeste-curly-bundle",
    name: "Celeste Curly Bundle",
    texture: "curly",
    description:
      "Defined, voluminous curls with a soft, natural movement. Sample product for design preview — specifications to be confirmed.",
    images: ["/images/product-curly.jpg", "/images/texture-curly.jpg"],
    basePriceCents: 0,
    featured: true,
  },
  {
    slug: "aurora-wavy-bundle",
    name: "Aurora Wavy Bundle",
    texture: "wavy",
    description:
      "Soft, flowing body waves with an effortless finish. Sample product for design preview — specifications to be confirmed.",
    images: ["/images/product-wavy.jpg", "/images/texture-wavy.jpg"],
    basePriceCents: 0,
    featured: true,
  },
  {
    slug: "nova-straight-bundle",
    name: "Nova Straight Bundle",
    texture: "straight",
    description:
      "A second straight offering demonstrating how the catalog scales. Sample product for design preview — specifications to be confirmed.",
    images: ["/images/product-straight.jpg", "/images/portrait.jpg"],
    basePriceCents: 0,
    featured: true,
  },
];

let seeded = false;
export async function ensureSeeded() {
  if (seeded) return;
  seeded = true;
  try {
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(products);
    if (Number(count) === 0) {
      for (const [i, p] of SEED_PRODUCTS.entries()) {
        const [row] = await db
          .insert(products)
          .values({
            ...p,
            details:
              "Product specifications (origin, weight per bundle, wefting, colour) will be added after supplier samples are evaluated.",
            careNotes:
              "Care guidance will be confirmed per product. See our Hair Care page for general recommendations.",
            published: true,
            isPlaceholder: true,
            sortOrder: i,
          })
          .returning();
        await db.insert(productVariants).values(
          SEED_LENGTHS.map((length, idx) => ({
            productId: row.id,
            length,
            sku: `${p.slug}-${length.replace('"', "")}`,
            priceCents: 0,
            inventory: 0,
            available: true,
            sortOrder: idx,
          })),
        );
      }
    }
    for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
      await db.insert(siteSettings).values({ key, value }).onConflictDoNothing();
    }
  } catch (e) {
    seeded = false;
    console.error("Seed failed", e);
  }
}

/* ---------- Settings ---------- */
export async function getSettings(): Promise<Record<string, string>> {
  await ensureSeeded();
  try {
    const rows = await db.select().from(siteSettings);
    const out = { ...DEFAULT_SETTINGS };
    for (const r of rows) out[r.key] = r.value;
    return out;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function isLive() {
  const s = await getSettings();
  return s.store_mode === "live";
}

/* ---------- Catalog ---------- */
function attach(prods: Product[], vars: ProductVariant[]): ProductWithVariants[] {
  return prods.map((p) => ({
    ...p,
    variants: vars
      .filter((v) => v.productId === p.id)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  }));
}

export async function listProducts(opts: {
  texture?: string;
  length?: string;
  sort?: string;
  q?: string;
  featuredOnly?: boolean;
  includeUnpublished?: boolean;
} = {}): Promise<ProductWithVariants[]> {
  await ensureSeeded();
  const where = [];
  if (!opts.includeUnpublished) where.push(eq(products.published, true));
  if (opts.texture && ["straight", "curly", "wavy"].includes(opts.texture))
    where.push(eq(products.texture, opts.texture));
  if (opts.featuredOnly) where.push(eq(products.featured, true));
  if (opts.q) {
    const like = `%${opts.q}%`;
    where.push(
      or(ilike(products.name, like), ilike(products.description, like), ilike(products.texture, like))!,
    );
  }
  let prods = await db
    .select()
    .from(products)
    .where(where.length ? and(...where) : undefined)
    .orderBy(asc(products.sortOrder), asc(products.id));
  if (prods.length === 0) return [];
  const vars = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, prods.map((p) => p.id)));
  let result = attach(prods, vars);
  if (opts.length) {
    result = result.filter((p) => p.variants.some((v) => v.length === opts.length && v.available));
  }
  if (opts.sort === "price-asc" || opts.sort === "price-desc") {
    const low = (p: ProductWithVariants) => Math.min(...p.variants.map((v) => v.priceCents), p.basePriceCents || Infinity);
    result.sort((a, b) => (opts.sort === "price-asc" ? low(a) - low(b) : low(b) - low(a)));
  } else if (opts.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }
  prods = [];
  return result;
}

export async function getProduct(slug: string): Promise<ProductWithVariants | null> {
  await ensureSeeded();
  const [p] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!p) return null;
  const vars = await db.select().from(productVariants).where(eq(productVariants.productId, p.id));
  return attach([p], vars)[0];
}

export async function getProductById(id: number): Promise<ProductWithVariants | null> {
  const [p] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (!p) return null;
  const vars = await db.select().from(productVariants).where(eq(productVariants.productId, p.id));
  return attach([p], vars)[0];
}

export async function getAllLengths(): Promise<string[]> {
  await ensureSeeded();
  const rows = await db
    .selectDistinct({ length: productVariants.length })
    .from(productVariants);
  return rows
    .map((r) => r.length)
    .sort((a, b) => parseFloat(a) - parseFloat(b));
}

export function formatPrice(cents: number) {
  if (!cents) return "Price TBA";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function priceRange(p: ProductWithVariants) {
  const prices = p.variants.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (!prices.length) return p.basePriceCents ? formatPrice(p.basePriceCents) : "Price TBA";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;
}

export function textureLabel(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
