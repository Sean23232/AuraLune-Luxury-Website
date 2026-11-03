import Image from "next/image";

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  compact = false,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  compact?: boolean;
}) {
  return (
    <section className={`relative overflow-hidden bg-midnight text-ivory ${compact ? "py-20 md:py-24" : "py-28 md:py-40"}`}>
      {image && (
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-midnight/40 via-midnight/50 to-midnight/80" />
      <div className="absolute inset-0 stars-pattern opacity-60" />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        {eyebrow && <p className="eyebrow text-lavender mb-5 fade-up">{eyebrow}</p>}
        <h1 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-wide fade-up delay-1">{title}</h1>
        {text && <p className="mt-6 text-ivory/75 max-w-xl mx-auto font-light text-base md:text-lg leading-relaxed fade-up delay-2">{text}</p>}
      </div>
    </section>
  );
}
