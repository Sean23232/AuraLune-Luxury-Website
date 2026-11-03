import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { sendContactEmail } from "@/lib/integrations";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Record<string, string>;
    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const subject = (body.subject || "").trim();
    const message = (body.message || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !subject || message.length < 10) {
      return Response.json({ error: "Please complete all fields correctly." }, { status: 400 });
    }
    await db.insert(contactMessages).values({ name, email, subject, message });
    const mail = await sendContactEmail({ name, email, subject, message });
    if (mail.configured && !mail.ok) console.error("Contact email failed:", mail.error);
    return Response.json({
      ok: true,
      message: "Your message has been received. We'll reply to your email as soon as we can.",
    });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
