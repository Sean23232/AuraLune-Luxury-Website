"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icons";
import { useCart } from "@/components/cart/CartProvider";

const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Shop Bundles",
    href: "/shop",
    children: [
      { label: "Shop All", href: "/shop" },
      { label: "Straight", href: "/shop/straight" },
      { label: "Curly", href: "/shop/curly" },
      { label: "Wavy", href: "/shop/wavy" },
    ],
  },
  { label: "Our Story", href: "/our-story" },
  { label: "Hair Care", href: "/hair-care" },
  { label: "Contact", href: "/contact" },
];

export function Header({ announcement }: { announcement: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, open, hydrated } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  const transparent = pathname === "/" && !scrolled && !menu;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenu(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const tone = transparent ? "text-ivory" : "text-midnight";

  return (
    <header className="sticky top-0 z-[60]">
      {announcement && (
        <div className="bg-midnight text-ivory/85 text-center eyebrow py-2.5 px-4 text-[0.62rem] md:text-[0.68rem]">
          {announcement}
        </div>
      )}
      <div
        className={`transition-all duration-500 ${transparent ? "bg-transparent" : "bg-ivory/90 backdrop-blur-md border-b hairline"} ${tone}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8 h-16 md:h-20">
          <button className="md:hidden p-2 -ml-2" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Icon.Menu />
          </button>

          <div className="flex-1 md:flex-none flex justify-center md:justify-start">
            <Logo tone={transparent ? "light" : "dark"} />
          </div>

          <nav className="hidden md:flex items-center gap-9 absolute left-1/2 -translate-x-1/2" aria-label="Primary">
            {NAV.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`eyebrow !text-[0.66rem] py-3 inline-flex items-center gap-1.5 link-underline ${pathname === item.href ? "opacity-100" : "opacity-80 hover:opacity-100"}`}
                >
                  {item.label}
                  {item.children && <Icon.Chevron className="opacity-60" />}
                </Link>
                {item.children && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                    <div className="bg-ivory text-midnight border hairline shadow-xl shadow-midnight/10 min-w-[200px] py-3">
                      {item.children.map((c) => (
                        <Link key={c.href} href={c.href} className="block px-6 py-2.5 text-sm hover:bg-cloud transition-colors">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button aria-label="Search" onClick={() => setSearch((s) => !s)} className="p-2 hover:opacity-60 transition-opacity hidden sm:block">
              <Icon.Search />
            </button>
            <Link href="/account" aria-label="Account" className="p-2 hover:opacity-60 transition-opacity hidden sm:block">
              <Icon.User />
            </Link>
            <button aria-label={`Shopping bag, ${count} items`} onClick={open} className="relative p-2 hover:opacity-60 transition-opacity">
              <Icon.Bag />
              {hydrated && count > 0 && (
                <span className={`absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full text-[0.6rem] flex items-center justify-center font-semibold ${transparent ? "bg-ivory text-midnight" : "bg-midnight text-ivory"}`}>
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={`overflow-hidden transition-all duration-400 ${search ? "max-h-24 border-t hairline" : "max-h-0"} bg-ivory text-midnight`}>
          <form
            className="mx-auto max-w-3xl px-6 py-4 flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) {
                router.push(`/search?q=${encodeURIComponent(q.trim())}`);
                setSearch(false);
              }
            }}
          >
            <Icon.Search className="opacity-50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search bundles, textures, lengths…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-midnight/40 py-1"
              aria-label="Search the store"
            />
            <button type="submit" className="eyebrow !text-[0.62rem]">Search</button>
          </form>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[90] md:hidden transition ${menu ? "visible" : "invisible"}`} aria-hidden={!menu}>
        <div onClick={() => setMenu(false)} className={`absolute inset-0 bg-midnight/50 transition-opacity duration-500 ${menu ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute left-0 top-0 h-full w-[86%] max-w-sm bg-ivory text-midnight flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] ${menu ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 h-16 border-b hairline">
            <Logo size="sm" />
            <button aria-label="Close menu" onClick={() => setMenu(false)} className="p-2"><Icon.Close /></button>
          </div>
          <form
            className="px-6 py-4 border-b hairline flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
            }}
          >
            <Icon.Search className="opacity-50" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="flex-1 bg-transparent outline-none text-sm" aria-label="Search" />
          </form>
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1" aria-label="Mobile">
            {NAV.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="serif text-2xl block py-2.5">{item.label}</Link>
                {item.children && (
                  <div className="pl-4 pb-2 space-y-1">
                    {item.children.map((c) => (
                      <Link key={c.href} href={c.href} className="block py-1.5 text-sm text-midnight/70">{c.label}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-6 border-t hairline mt-4 space-y-3">
              <Link href="/account" className="flex items-center gap-3 text-sm"><Icon.User /> Account</Link>
              <Link href="/faq" className="block text-sm pl-8">FAQs</Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
