export function FAQList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y hairline border-y">
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 serif text-xl md:text-2xl">
            {f.q}
            <span className="text-2xl font-light transition-transform group-open:rotate-45 shrink-0">+</span>
          </summary>
          <p className="pt-3 text-sm md:text-base text-midnight/70 leading-relaxed max-w-2xl">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
