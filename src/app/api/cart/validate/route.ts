import { db } from "@/db";
import { productVariants, products } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

/** Re-validates cart lines against live catalog data (price, availability, stock). */
export async function POST(req: Request) {
  const { variantIds } = (await req.json()) as { variantIds: number[] };
  if (!Array.isArray(variantIds) || variantIds.length === 0) return Response.json({ variants: [] });
  const rows = await db
    .select({
      id: productVariants.id,
      priceCents: productVariants.priceCents,
      inventory: productVariants.inventory,
      available: productVariants.available,
      published: products.published,
      length: productVariants.length,
      name: products.name,
    })
    .from(productVariants)
    .innerJoin(products, eq(products.id, productVariants.productId))
    .where(inArray(productVariants.id, variantIds));
  return Response.json({ variants: rows });
}
