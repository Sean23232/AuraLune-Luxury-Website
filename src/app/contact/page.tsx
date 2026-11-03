import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { getSettings } from "@/lib/catalog";
import Link from "next/link";
export const metadata: Metadata = { title: "Contact", description: "Get in touch with Auralune." };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <section className="mx-auto max-w-7xl px-6 md:px-8 py-20 md:py-28 grid lg:grid-cols-12 gap-14">
      <div className="lg:col-span-4">
        <p className="eyebrow text-plum mb-4">Contact</p>
        <h1 className="text-4xl md:text-6xl leading-[1.05] tracking-wide">We&apos;d love to hear from you.</h1>
        <p className="mt-6 text-midnight/70 leading-relaxed font-light">Questions about the collection, our launch, or anything else — send us a note and we&apos;ll reply by email.</p>
        {settings.contact_email && <a href={`mailto:${settings.contact_email}`} className="block mt-6 text-sm underline">{settings.contact_email}</a>}
        <div className="mt-8"><SocialLinks settings={settings} /></div>
        <p className="mt-10 text-sm text-midnight/60">Looking for quick answers? Visit our <Link href="/faq" className="underline">FAQs</Link>.</p>
      </div>
      <div className="lg:col-span-7 lg:col-start-6 bg-cloud/60 border hairline p-7 md:p-10">
        <ContactForm />
      </div>
    </section>
  );
}
