import { db } from "@/db";
import { productVariants } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.productId || !b.length) return Response.json({ error: "productId and length required" }, { status: 400 });
  const [row] = await db.insert(productVariants).values({
    productId: Number(b.productId), length: String(b.length), sku: b.sku || null,
    priceCents: Number(b.priceCents) || 0, inventory: Number(b.inventory) || 0, available: b.available !== false, sortOrder: Number(b.sortOrder) || 0,
  }).returning();
  return Response.json({ variant: row });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.id) return Response.json({ error: "id required" }, { status: 400 });
  const patch: Partial<typeof productVariants.$inferInsert> = {};
  if ("length" in b) patch.length = String(b.length);
  if ("sku" in b) patch.sku = b.sku || null;
  if ("priceCents" in b) patch.priceCents = Math.max(0, Number(b.priceCents) || 0);
  if ("inventory" in b) patch.inventory = Math.max(0, Number(b.inventory) || 0);
  if ("available" in b) patch.available = Boolean(b.available);
  if ("sortOrder" in b) patch.sortOrder = Number(b.sortOrder) || 0;
  const [row] = await db.update(productVariants).set(patch).where(eq(productVariants.id, Number(b.id))).returning();
  return Response.json({ variant: row });
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  await db.delete(productVariants).where(eq(productVariants.id, Number(id)));
  return Response.json({ ok: true });
}
