import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { isAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/catalog";
import { paymentsConfigured } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  return Response.json({
    settings: await getSettings(),
    integrations: {
      payments: paymentsConfigured(),
      newsletter: Boolean((process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) || (process.env.KLAVIYO_API_KEY && process.env.KLAVIYO_LIST_ID)),
      email: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL),
    },
  });
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json()) as Record<string, string>;
  for (const [key, value] of Object.entries(body)) {
    if (key === "store_mode" && !["preview", "live"].includes(value)) continue;
    await db.insert(siteSettings).values({ key, value: String(value) }).onConflictDoUpdate({ target: siteSettings.key, set: { value: String(value), updatedAt: new Date() } });
  }
  return Response.json({ settings: await getSettings() });
}
