import Link from "next/link";

export function CrescentMark({ className = "", size = 22 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M15.5 3.2a9.3 9.3 0 1 0 5.3 15.9A8 8 0 0 1 15.5 3.2Z"
        fill="currentColor"
      />
      <circle cx="18.6" cy="6.2" r="0.9" fill="currentColor" opacity="0.8" />
      <circle cx="21.4" cy="10" r="0.6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  size = "md",
  href = "/",
}: {
  tone?: "dark" | "light";
  size?: "sm" | "md" | "lg";
  href?: string | null;
}) {
  const color = tone === "dark" ? "text-midnight" : "text-ivory";
  const text =
    size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-lg" : "text-xl md:text-2xl";
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${color}`}>
      <CrescentMark size={size === "lg" ? 30 : size === "sm" ? 16 : 20} />
      <span className={`serif tracking-[0.34em] font-medium ${text}`}>AURALUNE</span>
    </span>
  );
  if (!href) return inner;
  return (
    <Link href={href} aria-label="Auralune home" className="inline-flex">
      {inner}
    </Link>
  );
}
