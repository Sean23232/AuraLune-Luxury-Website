import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SocialLinks } from "@/components/layout/SocialLinks";

const cols = [
  { title: "Shop", links: [["Shop All", "/shop"], ["Straight", "/shop/straight"], ["Curly", "/shop/curly"], ["Wavy", "/shop/wavy"]] },
  { title: "About", links: [["Our Story", "/our-story"], ["Hair Care", "/hair-care"], ["The Experience", "/our-story#experience"]] },
  { title: "Help", links: [["Contact", "/contact"], ["Shipping", "/policies/shipping"], ["Returns & Exchanges", "/policies/returns"], ["FAQs", "/faq"]] },
];

export function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="bg-midnight text-ivory relative overflow-hidden">
      <div className="absolute inset-0 stars-pattern opacity-50 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-8 pt-20 pb-10">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 text-sm text-ivory/65 leading-relaxed max-w-sm font-light">
              An upcoming luxury hair extension brand inspired by the moon, the elegance of femininity and the belief that beauty lives in every detail.
            </p>
            <div className="mt-7">
              <SocialLinks settings={settings} tone="light" />
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {cols.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-lavender mb-5">{c.title}</p>
                <ul className="space-y-3">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="text-sm text-ivory/75 hover:text-ivory transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="lg:col-span-3">
            <p className="eyebrow text-lavender mb-5">Stay in Orbit</p>
            <p className="text-sm text-ivory/65 mb-4 font-light">Collection updates and a first look at what&apos;s coming.</p>
            <NewsletterForm tone="light" compact />
          </div>
        </div>

        <div className="mt-16 pt-8 border-t hairline-light flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <p className="text-xs text-ivory/50">© {new Date().getFullYear()} Auralune. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-ivory/50">
            <Link href="/policies/privacy" className="hover:text-ivory">Privacy Policy</Link>
            <Link href="/policies/terms" className="hover:text-ivory">Terms &amp; Conditions</Link>
            <Link href="/policies/shipping" className="hover:text-ivory">Shipping</Link>
            <Link href="/policies/returns" className="hover:text-ivory">Returns</Link>
          </div>
          <div className="flex items-center gap-2" aria-label="Accepted payment methods (configured at launch)">
            {["VISA", "MC", "AMEX", "PAY"].map((p) => (
              <span key={p} className="h-6 px-2 rounded-[3px] border hairline-light text-[0.55rem] tracking-widest text-ivory/55 flex items-center">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
