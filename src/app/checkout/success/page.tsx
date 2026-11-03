import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CrescentMark } from "@/components/brand/Logo";
import { ClearCart } from "@/components/cart/ClearCart";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Confirmation" };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string; session_id?: string }> }) {
  const { order, session_id } = await searchParams;
  let confirmed = false;
  let orderRow: typeof orders.$inferSelect | undefined;
  if (order && session_id && process.env.STRIPE_SECRET_KEY) {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${session_id}`, { headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` }, cache: "no-store" });
    const s = await res.json();
    if (res.ok && String(s.client_reference_id) === order && s.payment_status === "paid") {
      confirmed = true;
      [orderRow] = await db.update(orders).set({ status: "paid", email: s.customer_details?.email ?? null, updatedAt: new Date() }).where(eq(orders.id, Number(order))).returning();
    }
  }
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:py-36 text-center">
      <CrescentMark size={36} className="text-lavender mx-auto mb-6" />
      {confirmed ? (
        <>
          <ClearCart />
          <p className="eyebrow text-plum mb-3">Order #{order}</p>
          <h1 className="text-4xl md:text-6xl tracking-wide">Thank You.</h1>
          <p className="mt-6 text-midnight/70 leading-relaxed">Your payment was received. A confirmation has been sent{orderRow?.email ? ` to ${orderRow.email}` : ""}. We&apos;ll be in touch when your order ships.</p>
        </>
      ) : (
        <>
          <h1 className="text-4xl md:text-5xl tracking-wide">We couldn&apos;t verify this order.</h1>
          <p className="mt-6 text-midnight/70 leading-relaxed">If you completed payment, please contact us with your email and we&apos;ll confirm it for you.</p>
        </>
      )}
      <Link href="/shop" className="btn btn-primary mt-10">Continue Shopping</Link>
    </section>
  );
}
