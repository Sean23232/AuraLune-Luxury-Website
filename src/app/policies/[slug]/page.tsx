import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { getSettings } from "@/lib/catalog";
export const dynamic = "force-dynamic";

const POLICIES: Record<string, { title: string; intro: string; settingKey?: string; sections: string[] }> = {
  shipping: { title: "Shipping Policy", intro: "How Auralune orders will be shipped.", settingKey: "shipping_note", sections: ["Shipping Destinations", "Processing Times", "Shipping Methods & Rates", "Tracking", "Lost or Damaged Parcels"] },
  returns: { title: "Returns & Exchanges", intro: "Our approach to returns and exchanges.", settingKey: "returns_note", sections: ["Eligibility", "How to Request a Return", "Exchanges", "Refunds", "Final Sale Items"] },
  privacy: { title: "Privacy Policy", intro: "How we collect, use and protect your information.", sections: ["Information We Collect", "How We Use Your Information", "Email Marketing", "Cookies", "Your Rights", "Contact"] },
  terms: { title: "Terms & Conditions", intro: "The terms that govern use of the Auralune website and store.", sections: ["Use of the Website", "Products & Pricing", "Orders & Payment", "Intellectual Property", "Limitation of Liability", "Governing Law"] },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: POLICIES[slug]?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POLICIES[slug];
  if (!p) notFound();
  const s = await getSettings();
  const note = p.settingKey ? s[p.settingKey] : undefined;
  return (
    <>
      <PageHero compact eyebrow="Policies" title={p.title} text={p.intro} />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <div className="border border-lavender/60 bg-cloud p-6 mb-14">
          <p className="eyebrow !text-[0.6rem] text-plum mb-2">Pending Approval</p>
          <p className="text-sm text-midnight/75 leading-relaxed">{note || "This policy is being prepared and will be published once reviewed and approved by Auralune before launch. No terms on this page are final."}</p>
        </div>
        <div className="prose-brand">
          {p.sections.map((h, i) => (
            <div key={h}>
              <h3>{i + 1}. {h}</h3>
              <p className="italic text-midnight/50">Content to be provided and approved by the business owner. Editable from site settings or the page template.</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-midnight/45">Last updated: pending publication.</p>
      </section>
    </>
  );
}
