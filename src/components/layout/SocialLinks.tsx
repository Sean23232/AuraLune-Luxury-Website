import { Icon } from "@/components/ui/Icons";

export function SocialLinks({ settings, tone = "dark", size = "md" }: { settings: Record<string, string>; tone?: "dark" | "light"; size?: "md" | "lg" }) {
  const links = [
    { label: "Instagram", href: settings.instagram_url, I: Icon.Instagram },
    { label: "TikTok", href: settings.tiktok_url, I: Icon.TikTok },
    { label: "Facebook", href: settings.facebook_url, I: Icon.Facebook },
  ].filter((l) => l.href);
  const cls = tone === "light" ? "border-ivory/25 text-ivory/80 hover:border-ivory hover:text-ivory" : "border-midnight/20 text-midnight/70 hover:border-midnight hover:text-midnight";
  const dim = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  return (
    <div className="flex items-center gap-3">
      {links.map(({ label, href, I }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Auralune on ${label}`} className={`${dim} rounded-full border flex items-center justify-center transition-colors ${cls}`}>
          <I />
        </a>
      ))}
    </div>
  );
}
