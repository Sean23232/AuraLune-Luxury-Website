import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getSettings } from "@/lib/catalog";
import { RevealObserver } from "@/components/ui/RevealObserver";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "AURALUNE — Premium Hair Extensions | Where Beauty Meets Moonlight",
    template: "%s | AURALUNE",
  },
  description:
    "Auralune is an upcoming luxury human hair extension brand inspired by the moon and the elegance of femininity. Straight, curly and wavy bundles, thoughtfully envisioned.",
  keywords: ["hair extensions", "luxury hair bundles", "Auralune", "straight bundles", "curly bundles", "wavy bundles"],
  openGraph: {
    title: "AURALUNE — Your Beauty, Written in the Stars.",
    description: "An elevated hair experience is on the horizon.",
    images: ["/images/hero.jpg"],
    type: "website",
  },
  icons: { icon: "/favicon.svg" },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header announcement={settings.announcement} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer storeMode={settings.store_mode} />
          <RevealObserver />
        </CartProvider>
      </body>
    </html>
  );
}
