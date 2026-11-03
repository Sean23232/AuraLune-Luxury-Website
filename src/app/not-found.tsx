import Link from "next/link";
import { CrescentMark } from "@/components/brand/Logo";
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-6 py-32 text-center">
      <CrescentMark size={32} className="text-lavender mx-auto mb-6" />
      <p className="eyebrow text-plum mb-3">404</p>
      <h1 className="text-4xl md:text-5xl tracking-wide">Lost among the stars.</h1>
      <p className="mt-5 text-midnight/65">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <Link href="/" className="btn btn-primary mt-10">Return Home</Link>
    </section>
  );
}
