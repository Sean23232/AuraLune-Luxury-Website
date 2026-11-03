import type { Metadata } from "next";
import { getSettings } from "@/lib/catalog";
import { paymentsConfigured } from "@/lib/integrations";
import { CheckoutClient } from "@/components/cart/CheckoutClient";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams]);
  return <CheckoutClient storeMode={settings.store_mode} paymentsReady={paymentsConfigured()} cancelled={sp.cancelled === "1"} />;
}
