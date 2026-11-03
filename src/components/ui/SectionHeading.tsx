export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "dark",
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: "dark" | "light";
  align?: "center" | "left";
}) {
  const t = tone === "dark" ? "text-midnight" : "text-ivory";
  const sub = tone === "dark" ? "text-midnight/65" : "text-ivory/70";
  const eb = tone === "dark" ? "text-plum" : "text-lavender";
  return (
    <div className={`reveal ${align === "center" ? "text-center mx-auto" : ""} max-w-2xl`}>
      {eyebrow && <p className={`eyebrow ${eb} mb-4`}>{eyebrow}</p>}
      <h2 className={`${t} text-3xl md:text-5xl leading-[1.1] tracking-wide`}>{title}</h2>
      {text && <p className={`${sub} mt-5 text-base md:text-lg font-light leading-relaxed`}>{text}</p>}
    </div>
  );
}
