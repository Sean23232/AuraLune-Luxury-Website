import type { Metadata } from "next";
import Link from "next/link";
import { CrescentMark } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 md:py-32 text-center">
      <CrescentMark size={32} className="text-lavender mx-auto mb-6" />
      <p className="eyebrow text-plum mb-3">Account</p>
      <h1 className="text-4xl md:text-5xl tracking-wide">Customer accounts arrive at launch.</h1>
      <p className="mt-6 text-midnight/70 leading-relaxed max-w-md mx-auto">Order history, saved details and faster checkout will be available once Auralune opens. Until then, join the list and be first to know.</p>
      <div className="mt-10 relative"><NewsletterForm /></div>
      <Link href="/contact" className="inline-block mt-10 eyebrow !text-[0.62rem] link-underline">Need help with something? Contact us</Link>
    </section>
  );
}
