/**
 * Integration helpers. Each one is a no-op (returns {configured:false})
 * until the matching environment variable is provided.
 *
 *  NEWSLETTER:  MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID   (or)  KLAVIYO_API_KEY + KLAVIYO_LIST_ID
 *  EMAIL:       RESEND_API_KEY + CONTACT_TO_EMAIL (+ optional CONTACT_FROM_EMAIL)
 *  PAYMENTS:    STRIPE_SECRET_KEY (+ NEXT_PUBLIC_SITE_URL)
 */

export async function syncNewsletterProvider(email: string): Promise<{ configured: boolean; ok: boolean; error?: string }> {
  const mcKey = process.env.MAILCHIMP_API_KEY;
  const mcList = process.env.MAILCHIMP_LIST_ID;
  if (mcKey && mcList) {
    const dc = mcKey.split("-").pop();
    const res = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${mcList}/members`, {
      method: "POST",
      headers: { Authorization: `Basic ${Buffer.from(`any:${mcKey}`).toString("base64")}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, status: "subscribed", tags: ["auralune-website"] }),
    });
    if (res.ok) return { configured: true, ok: true };
    const data = await res.json().catch(() => ({}));
    if (data?.title === "Member Exists") return { configured: true, ok: true };
    return { configured: true, ok: false, error: data?.detail || "Mailchimp error" };
  }
  const klKey = process.env.KLAVIYO_API_KEY;
  const klList = process.env.KLAVIYO_LIST_ID;
  if (klKey && klList) {
    const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
      method: "POST",
      headers: { Authorization: `Klaviyo-API-Key ${klKey}`, "Content-Type": "application/json", revision: "2024-10-15" },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: { profiles: { data: [{ type: "profile", attributes: { email, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } } }] } },
          relationships: { list: { data: { type: "list", id: klList } } },
        },
      }),
    });
    return { configured: true, ok: res.ok, error: res.ok ? undefined : "Klaviyo error" };
  }
  return { configured: false, ok: true };
}

export async function sendContactEmail(payload: { name: string; email: string; subject: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return { configured: false, ok: true };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Auralune Website <onboarding@resend.dev>",
      to: [to],
      reply_to: payload.email,
      subject: `[Auralune] ${payload.subject} — ${payload.name}`,
      text: `From: ${payload.name} <${payload.email}>\nSubject: ${payload.subject}\n\n${payload.message}`,
    }),
  });
  return { configured: true, ok: res.ok, error: res.ok ? undefined : "Email provider error" };
}

export function paymentsConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
