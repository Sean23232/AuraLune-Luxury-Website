import { db } from "@/db";
import { orders, productVariants, products } from "@/db/schema";
import { getSettings } from "@/lib/catalog";
import { paymentsConfigured } from "@/lib/integrations";
import { eq, inArray } from "drizzle-orm";

type Line = { variantId: number; quantity: number };

/**
 * Creates a Stripe Checkout Session (hosted, PCI-compliant checkout supporting
 * cards, Apple Pay / Google Pay and Link when enabled in the Stripe dashboard).
 * Requires STRIPE_SECRET_KEY. Prices/stock are always re-read from the database,
 * never trusted from the client.
 */
export async function POST(req: Request) {
  try {
    const settings = await getSettings();
    if (settings.store_mode !== "live") {
      return Response.json(
        { error: "The store is in preview mode. Checkout will open when Auralune launches.", code: "preview" },
        { status: 409 },
      );
    }
    if (!paymentsConfigured()) {
      return Response.json(
        { error: "Payments are not configured yet. Add STRIPE_SECRET_KEY to enable checkout.", code: "not_configured" },
        { status: 503 },
      );
    }

    const { lines, email } = (await req.json()) as { lines: Line[]; email?: string };
    if (!Array.isArray(lines) || lines.length === 0) return Response.json({ error: "Your bag is empty." }, { status: 400 });

    const rows = await db
      .select({
        id: productVariants.id,
        priceCents: productVariants.priceCents,
        inventory: productVariants.inventory,
        available: productVariants.available,
        length: productVariants.length,
        name: products.name,
        texture: products.texture,
        images: products.images,
        published: products.published,
      })
      .from(productVariants)
      .innerJoin(products, eq(products.id, productVariants.productId))
      .where(inArray(productVariants.id, lines.map((l) => l.variantId)));

    const items = [];
    for (const l of lines) {
      const v = rows.find((r) => r.id === l.variantId);
      if (!v || !v.published || !v.available || v.inventory < l.quantity || v.priceCents <= 0) {
        return Response.json({ error: `"${v?.name ?? "An item"}" is no longer available in the selected option.` }, { status: 409 });
      }
      items.push({ variantId: v.id, productName: v.name, texture: v.texture, length: v.length, quantity: l.quantity, priceCents: v.priceCents, image: v.images?.[0] });
    }
    const subtotal = items.reduce((n, i) => n + i.priceCents * i.quantity, 0);
    const [order] = await db.insert(orders).values({ provider: "stripe", status: "pending", email: email || null, items, subtotalCents: subtotal }).returning();

    const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${site}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${site}/checkout?cancelled=1`);
    params.set("client_reference_id", String(order.id));
    params.set("shipping_address_collection[allowed_countries][0]", "US");
    params.set("phone_number_collection[enabled]", "true");
    if (email) params.set("customer_email", email);
    items.forEach((i, idx) => {
      params.set(`line_items[${idx}][quantity]`, String(i.quantity));
      params.set(`line_items[${idx}][price_data][currency]`, "usd");
      params.set(`line_items[${idx}][price_data][unit_amount]`, String(i.priceCents));
      params.set(`line_items[${idx}][price_data][product_data][name]`, `${i.productName} — ${i.length}`);
      params.set(`line_items[${idx}][price_data][product_data][description]`, `${i.texture} texture`);
      if (i.image) params.set(`line_items[${idx}][price_data][product_data][images][0]`, `${site}${i.image}`);
    });

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const session = await res.json();
    if (!res.ok) {
      console.error("Stripe error", session);
      return Response.json({ error: session?.error?.message || "Payment provider error." }, { status: 502 });
    }
    await db.update(orders).set({ providerSessionId: session.id, updatedAt: new Date() }).where(eq(orders.id, order.id));
    return Response.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Unable to start checkout." }, { status: 500 });
  }
}
