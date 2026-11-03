import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopPage } from "@/components/product/ShopPage";
import { TEXTURES } from "@/lib/catalog";
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ texture: string }> }): Promise<Metadata> {
  const { texture } = await params;
  const t = TEXTURES.find((x) => x.slug === texture);
  return { title: t ? `${t.name} Bundles` : "Collection", description: t ? `Auralune ${t.name.toLowerCase()} hair bundles — ${t.tagline}` : undefined };
}

export default async function Page({ params, searchParams }: { params: Promise<{ texture: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { texture } = await params;
  if (!TEXTURES.some((t) => t.slug === texture)) notFound();
  return <ShopPage texture={texture} searchParams={searchParams} />;
}
