import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { FAQList } from "@/components/ui/FAQList";
import { getSettings } from "@/lib/catalog";
export const metadata: Metadata = { title: "FAQs", description: "Answers about Auralune's textures, lengths, shipping, hair care and more." };
export const dynamic = "force-dynamic";

export default async function FAQPage() {
  const s = await getSettings();
  const groups = [
    { id: "products", t: "Product Selection", items: [
      { q: "Which textures will be available?", a: "Our initial collection focuses on three textures: Straight, Curly and Wavy. Additional textures may be considered in the future." },
      { q: "How do I choose between textures?", a: "Choose the texture that best matches your natural hair or the look you'd like to achieve. Our texture pages show each pattern in detail, and you can always contact us for guidance." },
    ]},
    { id: "lengths", t: "Lengths", items: [
      { q: "What lengths will be offered?", a: "Length options are shown on each product page and are configurable as our inventory is confirmed. Final availability will be announced at launch." },
      { q: "How is length measured?", a: "Length is typically measured from weft to tip with the hair stretched straight. Curly and wavy textures will appear shorter when worn naturally." },
    ]},
    { id: "shipping", t: "Shipping & Tracking", items: [
      { q: "Where do you ship?", a: "Auralune will ship nationwide within the United States." },
      { q: "What are the shipping options and costs?", a: s.shipping_note },
      { q: "How do I track my order?", a: "Once fulfilment is live, you'll receive a tracking link by email as soon as your order ships." },
    ]},
    { id: "care", t: "Hair Care", items: [
      { q: "How should I care for my hair?", a: "Visit our Hair Care page for washing, conditioning, storage and heat styling guidance. Product-specific instructions will be added when the collection is finalised." },
    ]},
    { id: "returns", t: "Returns & Exchanges", items: [
      { q: "What is your returns policy?", a: s.returns_note },
    ]},
    { id: "payment", t: "Payment", items: [
      { q: "Which payment methods will you accept?", a: "Checkout is designed to support major credit and debit cards, with Apple Pay and Google Pay where supported. The final list of payment methods will be confirmed at launch." },
      { q: "Is checkout secure?", a: "Yes. Payments are processed by a dedicated payment provider; Auralune never stores your card details." },
    ]},
  ];
  return (
    <>
      <PageHero compact eyebrow="Help" title="Frequently Asked Questions" text="Answers will be refined as we approach launch." />
      <section className="mx-auto max-w-3xl px-6 py-20 md:py-28 space-y-16">
        {groups.map((g) => (
          <div key={g.id} id={g.id} className="scroll-mt-32 reveal">
            <p className="eyebrow text-plum mb-4">{g.t}</p>
            <FAQList items={g.items} />
          </div>
        ))}
      </section>
    </>
  );
}
