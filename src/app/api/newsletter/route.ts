import { db } from "@/db";
import { newsletterSubscribers } from "@/db/schema";
import { syncNewsletterProvider } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const clean = (email || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean)) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    await db.insert(newsletterSubscribers).values({ email: clean }).onConflictDoNothing();
    const sync = await syncNewsletterProvider(clean);
    if (sync.configured && !sync.ok) {
      console.error("Newsletter provider sync failed:", sync.error);
    }
    return Response.json({ ok: true, message: "You're on the list. We'll be in touch under the next moon." });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "We couldn't add you right now. Please try again." }, { status: 500 });
  }
}
