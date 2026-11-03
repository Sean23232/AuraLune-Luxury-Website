import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { CrescentMark } from "@/components/brand/Logo";
export const metadata: Metadata = { title: "Our Story", description: "The inspiration behind Auralune — the moonlit goddess, twilight, and beauty that feels like you." };

export default function OurStoryPage() {
  return (
    <>
      <PageHero eyebrow="Our Story" title="Where Beauty Meets Moonlight." text="The inspiration behind Auralune." image="/images/moon-story.jpg" />

      <section className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-6 reveal">
          <p className="eyebrow text-plum mb-5">The Moonlit Goddess</p>
          <h2 className="text-4xl md:text-5xl leading-[1.08] tracking-wide">Inspired by the moon. Created for your beauty.</h2>
          <div className="prose-brand mt-8">
            <p>Auralune was born from a vision of beauty, femininity, and individuality. Inspired by the moon and the magic of twilight, our brand represents the beauty of embracing your own expression.</p>
            <p>The name joins <em>aura</em> — the light that surrounds you — with <em>lune</em>, the moon. It speaks to the quiet confidence of a woman who knows her own glow, and to the gentle transformation that beautiful hair can bring.</p>
            <p>Everything we create is guided by the soft colours of dusk, the stillness of a full moon, and the belief that beauty lives in every detail.</p>
          </div>
        </div>
        <div className="md:col-span-5 md:col-start-8 reveal">
          <div className="relative aspect-[4/5] overflow-hidden img-zoom">
            <Image src="/images/texture-wavy.jpg" alt="Flowing waves in twilight light" fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-cloud py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto reveal">
            <CrescentMark size={24} className="text-lavender mx-auto mb-5" />
            <h2 className="text-4xl md:text-5xl tracking-wide">What Guides Us</h2>
          </div>
          <div className="mt-14 grid md:grid-cols-3 gap-10">
            {[
              ["Beauty that feels like you", "Hair should enhance who you already are. We design around different textures, lengths and expressions — not a single ideal."],
              ["Every detail matters", "From the first sample we evaluate to the way a package is opened, we believe small details create the most memorable experiences."],
              ["Thoughtfully, honestly", "We're building Auralune in the open — finalising hair samples, vendors and packaging before we make a single promise."],
            ].map(([t, d], i) => (
              <div key={t} className="reveal border-t hairline pt-6" style={{ transitionDelay: `${i * 100}ms` }}>
                <h3 className="text-2xl tracking-wide">{t}</h3>
                <p className="mt-3 text-sm text-midnight/70 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-7xl px-6 md:px-8 py-24 md:py-32 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[5/4] overflow-hidden img-zoom reveal">
          <Image src="/images/packaging.jpg" alt="Auralune packaging concept" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="reveal">
          <p className="eyebrow text-plum mb-5">The Experience</p>
          <h2 className="text-4xl md:text-5xl leading-[1.08] tracking-wide">An experience beyond the ordinary.</h2>
          <p className="mt-7 text-midnight/70 leading-relaxed font-light text-lg">Because the little details make the difference. Auralune is envisioned as a complete experience — soft ivory packaging, dusk lavender accents, a crescent-embossed tag and a personal note — so that opening your order feels as special as wearing it.</p>
          <Link href="/shop" className="btn btn-primary mt-10">Explore the Collection</Link>
        </div>
      </section>

      <section className="relative bg-midnight text-ivory py-28 overflow-hidden">
        <div className="absolute inset-0 stars-pattern opacity-60" />
        <div className="relative mx-auto max-w-2xl px-6 text-center reveal">
          <p className="eyebrow text-lavender mb-5">Coming Soon</p>
          <h2 className="text-4xl md:text-5xl tracking-wide">We&apos;re just getting started.</h2>
          <p className="mt-6 text-ivory/70 font-light leading-relaxed">Auralune is in its pre-launch chapter. Follow along as we finalise our first collection, and be first to know when the doors open.</p>
          <Link href="/#newsletter" className="btn btn-light mt-10">Join the List</Link>
        </div>
      </section>
    </>
  );
}
