import type { Metadata } from "next";
import { ShopPage } from "@/components/product/ShopPage";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shop All Bundles", description: "Explore Auralune's straight, curly and wavy luxury hair bundles." };
export default function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <ShopPage searchParams={searchParams} />;
}
