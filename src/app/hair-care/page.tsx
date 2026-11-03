import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { FAQList } from "@/components/ui/FAQList";
export const metadata: Metadata = { title: "Hair Care", description: "General care guidance for luxury hair extensions — washing, conditioning, storage and heat styling." };

const SECTIONS = [
  { t: "General Care", items: ["Handle your hair gently — detangle from the ends upward with a wide-tooth comb or soft bristle brush.", "Avoid sleeping on wet hair; a satin bonnet or pillowcase helps reduce friction and tangling.", "Keep product build-up to a minimum; use lightweight products sparingly."] },
  { t: "Washing & Conditioning", items: ["Use a sulphate-free shampoo and a moisturising conditioner, focusing conditioner on the mid-lengths and ends.", "Wash in a downward motion rather than scrubbing or bunching the hair.", "Rinse thoroughly with cool water and gently squeeze out excess moisture — never wring or twist.", "Allow to air dry where possible, or blow-dry on a low heat setting."] },
  { t: "Storage", items: ["When not in use, store bundles clean, dry and fully detangled.", "Keep hair in a breathable, dust-free bag or box, away from direct sunlight and humidity.", "Loosely tie or braid longer lengths to help preserve the pattern."] },
  { t: "Heat Styling", items: ["Always apply a heat protectant before using hot tools.", "Begin at the lowest effective temperature and increase gradually only if needed.", "Limit frequency of heat styling on textured hair to help maintain curl and wave definition.", "Specific heat tolerances will be confirmed per product once supplier samples have been evaluated."] },
];

const FAQS = [
  { q: "How often should I wash my extensions?", a: "Generally less often than your natural hair — many people wash every 1–2 weeks depending on product use and activity. We'll publish product-specific guidance once our collection is finalised." },
  { q: "Can I colour or bleach the hair?", a: "Colouring guidance depends on the specific hair and will be confirmed after sample evaluation. We'll always recommend consulting a professional stylist." },
  { q: "How do I keep curls and waves defined?", a: "Use a leave-in conditioner or light curl cream on damp hair, scrunch gently, and avoid brushing when dry. Air drying or diffusing on low heat helps preserve the pattern." },
  { q: "What should I do if my hair starts to tangle?", a: "Lightly mist with water and a leave-in conditioner, then detangle gently from the ends upward using your fingers or a wide-tooth comb." },
];

export default function HairCarePage() {
  return (
    <>
      <PageHero eyebrow="Hair Care" title="Care, Like Moonlight." text="Gentle guidance to keep your hair feeling beautiful. Product-specific instructions will be confirmed closer to launch." image="/images/portrait.jpg" />
      <section className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-32 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit reveal">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/images/texture-curly.jpg" alt="Defined curls" fill sizes="(max-width:1024px) 100vw, 33vw" className="object-cover" />
          </div>
          <p className="mt-4 text-xs text-midnight/50">This guidance is general in nature and will be refined once our hair samples have been fully evaluated.</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 space-y-14">
          {SECTIONS.map((s, i) => (
            <div key={s.t} className="reveal">
              <p className="serif text-lavender text-xl">0{i + 1}</p>
              <h2 className="text-3xl md:text-4xl tracking-wide mt-1">{s.t}</h2>
              <ul className="mt-5 space-y-3">
                {s.items.map((x) => <li key={x} className="flex gap-3 text-sm md:text-base text-midnight/75 leading-relaxed"><span className="text-lavender mt-1.5">✦</span>{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-cloud py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center reveal"><p className="eyebrow text-plum mb-4">Care Questions</p><h2 className="text-4xl tracking-wide">Frequently Asked</h2></div>
          <div className="mt-10"><FAQList items={FAQS} /></div>
        </div>
      </section>
    </>
  );
}
