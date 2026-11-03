import Image from "next/image";
import Link from "next/link";
import { getSettings, listProducts, TEXTURES } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { CrescentMark } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icons";

export const dynamic = "force-dynamic";

const PILLARS = [
  { n: "01", t: "Quality First", d: "Thoughtfully exploring hair sourcing and quality as the foundation of every collection." },
  { n: "02", t: "Beauty in Every Texture", d: "Designed around the beauty of different textures and lengths." },
  { n: "03", t: "An Elevated Experience", d: "From discovering your hair to the moment your package arrives, every detail deserves attention." },
  { n: "04", t: "Made to Feel Personal", d: "A feminine brand identity inspired by individuality, beauty, and self-expression." },
];

const GALLERY = [
  "/images/portrait.jpg",
  "/images/texture-curly.jpg",
  "/images/packaging.jpg",
  "/images/texture-wavy.jpg",
  "/images/product-straight.jpg",
  "/images/moon-story.jpg",
];

export default async function HomePage() {
  const [settings, featured] = await Promise.all([getSettings(), listProducts({ featuredOnly: true })]);
  const storeMode = settings.store_mode;

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 md:-mt-20 min-h-[100svh] flex items-end md:items-center overflow-hidden bg-midnight text-ivory">
        <Image src="/images/hero.jpg" alt="Woman with long flowing hair under a luminous moon" fill priority sizes="100vw" className="object-cover object-[70%_center] md:object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/30 to-midnight/20 md:bg-gradient-to-r md:from-midnight/80 md:via-midnight/30 md:to-transparent" />
        <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />
        <Icon.Star className="absolute top-[22%] left-[8%] text-ivory/70 twinkle hidden md:block" />
        <Icon.Star className="absolute top-[34%] left-[38%] text-ivory/50 twinkle twinkle-delay hidden md:block" />
        <Icon.Star className="absolute bottom-[28%] right-[12%] text-ivory/60 twinkle hidden md:block" />

        <div className="relative mx-auto w-full max-w-7xl px-6 md:px-8 pb-20 pt-40 md:py-40">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6 fade-up">
              <CrescentMark size={18} className="text-lavender" />
              <p className="eyebrow text-lavender">A New Era of Hair Beauty</p>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-wide fade-up delay-1">
              Your Beauty,<br />
              <span className="italic font-light">Written</span> in the Stars.
            </h1>
            <p className="mt-7 text-ivory/80 text-base md:text-lg font-light leading-relaxed max-w-md fade-up delay-2">
              Discover a more elevated hair experience with Auralune. Thoughtfully envisioned for those who believe beauty lives in every detail.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 fade-up delay-3">
              <Link href="/shop" className="btn btn-light">Explore the Collection</Link>
              <Link href="/our-story" className="btn btn-outline-light">Discover Our Story</Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-ivory/50">
          <span className="eyebrow !text-[0.55rem]">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-ivory/60 to-transparent" />
        </div>
      </section>

      {/* BRAND INTRO */}
      <section className="bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid md:grid-cols-12 gap-12 md:gap-8 items-center">
          <div className="md:col-span-5 reveal">
            <div className="relative aspect-[4/5] overflow-hidden img-zoom">
              <Image src="/images/portrait.jpg" alt="Close-up portrait with flowing hair" fill sizes="(max-width:768px) 100vw, 40vw" className="object-cover" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 reveal">
            <p className="eyebrow text-plum mb-5">The Auralune Vision</p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-[1.08] tracking-wide">Beauty That Feels Like You.</h2>
            <p className="mt-7 text-midnight/70 text-base md:text-lg font-light leading-relaxed">
              At Auralune, beauty is more than a look. It&apos;s a feeling, a moment, and an expression of individuality. Inspired by the beauty of the moon and the elegance of femininity, we&apos;re creating a hair experience where every detail matters.
            </p>
            <Link href="/our-story" className="btn btn-outline mt-10">The Auralune Vision</Link>
          </div>
        </div>
      </section>

      {/* SHOP BY TEXTURE */}
      <section className="bg-cloud py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading eyebrow="Shop by Texture" title="Find Your Natural Rhythm." text="Discover the textures that let your beauty flow." />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {TEXTURES.map((t, i) => (
              <Link key={t.slug} href={`/shop/${t.slug}`} className={`group relative aspect-[3/4] overflow-hidden img-zoom reveal`} style={{ transitionDelay: `${i * 100}ms` }}>
                <Image src={t.image} alt={`${t.name} hair`} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/15 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-7 text-ivory">
                  <p className="eyebrow text-lavender">{t.tagline}</p>
                  <h3 className="text-4xl mt-2 tracking-wide">{t.name}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 eyebrow !text-[0.62rem] border-b border-ivory/40 pb-1 group-hover:border-ivory transition-colors">
                    Explore {t.name} <Icon.Arrow className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <SectionHeading align="left" eyebrow="Featured Collection" title="The Art of Beautiful Hair." text="Explore the beginnings of the Auralune collection." />
            <Link href="/shop" className="eyebrow !text-[0.62rem] link-underline shrink-0 reveal">View All Bundles</Link>
          </div>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {featured.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} storeMode={storeMode} />)}
          </div>
          {featured.some((p) => p.isPlaceholder) && (
            <p className="mt-10 text-center text-xs text-midnight/45 max-w-lg mx-auto">
              Products shown are design placeholders. Names, pricing, lengths and availability are editable and will be confirmed before launch.
            </p>
          )}
        </div>
      </section>

      {/* WHY AURALUNE */}
      <section className="bg-twilight text-ivory py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 stars-pattern opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading tone="light" eyebrow="Why Auralune" title="Beauty Is in Every Detail." />
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {PILLARS.map((p, i) => (
              <div key={p.n} className="reveal border-t border-ivory/15 pt-6" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <span className="serif text-lavender text-xl">{p.n}</span>
                  <CrescentMark size={16} className="text-lavender/70" />
                </div>
                <h3 className="text-2xl mt-5 tracking-wide">{p.t}</h3>
                <p className="mt-3 text-sm text-ivory/65 font-light leading-relaxed">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="bg-ivory py-24 md:py-36">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid md:grid-cols-12 gap-12 md:gap-8 items-center">
          <div className="md:col-span-5 md:order-2 reveal">
            <p className="eyebrow text-plum mb-5">The Auralune Experience</p>
            <h2 className="text-4xl md:text-5xl leading-[1.08] tracking-wide">An Experience Beyond the Ordinary.</h2>
            <p className="mt-7 text-midnight/70 text-base md:text-lg font-light leading-relaxed">
              Because the little details make the difference. From the way your hair is presented to the moment you open your package, Auralune is envisioned to make every part of your experience feel special.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-midnight/70">
              {["Signature ivory box with lavender tissue", "Crescent-embossed bundle tag", "Personalised thank-you card", "Branded shopping bag", "Satin bonnet — a future inclusion"].map((x) => (
                <li key={x} className="flex items-center gap-3"><Icon.Star className="text-lavender shrink-0" />{x}</li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-midnight/45">Packaging concept — components are being finalised.</p>
          </div>
          <div className="md:col-span-7 md:order-1 reveal">
            <div className="relative aspect-[5/4] overflow-hidden img-zoom">
              <Image src="/images/packaging.jpg" alt="Auralune packaging concept with box, tissue, tag and shopping bag" fill sizes="(max-width:768px) 100vw, 60vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="relative py-32 md:py-48 overflow-hidden bg-midnight text-ivory">
        <Image src="/images/moon-story.jpg" alt="" fill sizes="100vw" className="object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-midnight/30 to-midnight/80" />
        <div className="relative mx-auto max-w-3xl px-6 text-center reveal">
          <CrescentMark size={30} className="text-lavender mx-auto mb-7" />
          <h2 className="text-4xl md:text-6xl leading-[1.08] tracking-wide">Inspired by the Moon.<br />Created for Your Beauty.</h2>
          <p className="mt-8 text-ivory/80 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Auralune was born from a vision of beauty, femininity, and individuality. Inspired by the moon and the magic of twilight, our brand represents the beauty of embracing your own expression.
          </p>
          <Link href="/our-story" className="btn btn-light mt-10">Discover Auralune</Link>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="bg-ivory py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <SectionHeading eyebrow="@auralune" title="Follow the Auralune Journey." text="Stay connected as we bring the Auralune vision to life." />
          <div className="mt-8 flex justify-center reveal"><SocialLinks settings={settings} /></div>
          <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {GALLERY.map((src, i) => (
              <a key={src} href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="relative aspect-square overflow-hidden img-zoom group reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <Image src={src} alt="Auralune gallery" fill sizes="(max-width:768px) 33vw, 16vw" className="object-cover" />
                <div className="absolute inset-0 bg-midnight/0 group-hover:bg-midnight/30 transition-colors flex items-center justify-center">
                  <Icon.Instagram className="text-ivory opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          <p className="mt-6 text-center text-xs text-midnight/45">Gallery placeholders — ready for a live Instagram feed integration.</p>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section id="newsletter" className="relative bg-midnight text-ivory py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 stars-pattern opacity-70 pointer-events-none" />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-lavender/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <SectionHeading tone="light" eyebrow="Join the List" title="Be First to Discover What's Written in the Stars." text="Join the Auralune list for collection updates, brand news, and a first look at what's coming." />
          <div className="mt-10 reveal relative"><NewsletterForm tone="light" /></div>
        </div>
      </section>
    </>
  );
}
