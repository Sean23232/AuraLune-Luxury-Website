import { db } from "@/db";
import { products, productVariants } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { listProducts } from "@/lib/catalog";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({ products: await listProducts({ includeUnpublished: true }) });
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const slug = String(b.slug || b.name || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  if (!slug || !b.name || !["straight", "curly", "wavy"].includes(b.texture)) return Response.json({ error: "name, slug and texture are required" }, { status: 400 });
  const [row] = await db.insert(products).values({
    slug, name: b.name, texture: b.texture, description: b.description || "", details: b.details || "", careNotes: b.careNotes || "",
    images: Array.isArray(b.images) ? b.images : [], basePriceCents: Number(b.basePriceCents) || 0,
    published: Boolean(b.published), isPlaceholder: b.isPlaceholder !== false, featured: Boolean(b.featured), sortOrder: Number(b.sortOrder) || 0,
  }).returning();
  const lengths: string[] = Array.isArray(b.lengths) ? b.lengths : [];
  if (lengths.length) {
    await db.insert(productVariants).values(lengths.map((length, i) => ({ productId: row.id, length, priceCents: Number(b.basePriceCents) || 0, inventory: 0, available: true, sortOrder: i })));
  }
  return Response.json({ product: row });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.id) return Response.json({ error: "id required" }, { status: 400 });
  const patch: Partial<typeof products.$inferInsert> = { updatedAt: new Date() };
  for (const k of ["name", "description", "details", "careNotes", "texture", "slug"] as const) if (k in b) patch[k] = b[k];
  if ("images" in b) patch.images = b.images;
  if ("basePriceCents" in b) patch.basePriceCents = Number(b.basePriceCents) || 0;
  for (const k of ["published", "isPlaceholder", "featured"] as const) if (k in b) patch[k] = Boolean(b[k]);
  if ("sortOrder" in b) patch.sortOrder = Number(b.sortOrder) || 0;
  const [row] = await db.update(products).set(patch).where(eq(products.id, Number(b.id))).returning();
  return Response.json({ product: row });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(products).where(eq(products.id, Number(id)));
  return Response.json({ ok: true });
}
