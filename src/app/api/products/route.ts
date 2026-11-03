import { listProducts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const products = await listProducts({
    texture: url.searchParams.get("texture") || undefined,
    length: url.searchParams.get("length") || undefined,
    sort: url.searchParams.get("sort") || undefined,
    q: url.searchParams.get("q") || undefined,
  });
  return Response.json({ products });
}
