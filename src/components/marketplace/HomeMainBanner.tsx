import Link from "next/link";
import { BRAND_NAME } from "@/lib/branding";

/**
 * Full-width hero in the spirit of leading marketplace homepages: strong headline,
 * short supporting line, primary + secondary CTAs (original copy for WEARHOUSE).
 */
export function HomeMainBanner() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5c1a6e] via-[#8b2199] to-[#ab28b2] px-5 py-10 text-white shadow-lg sm:px-8 sm:py-12 md:px-12 md:py-14">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-1/4 h-56 w-56 rounded-full bg-black/10 blur-3xl"
        aria-hidden
      />
      <div className="relative max-w-2xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/80">
          {BRAND_NAME}
        </p>
        <h2 className="mt-2 text-[28px] font-bold leading-[1.15] tracking-tight sm:text-[34px] md:text-[40px]">
          Ready to refresh your wardrobe?
        </h2>
        <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/90 md:text-[17px]">
          Sell pieces you no longer wear and find pre-loved fashion at great prices
          — all in one community on {BRAND_NAME}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/sell"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-7 text-[16px] font-semibold text-[#6b1f7a] shadow-md transition hover:bg-white/95"
          >
            Sell now
          </Link>
          <Link
            href="/how-it-works"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/90 bg-transparent px-7 text-[16px] font-semibold text-white transition hover:bg-white/10"
          >
            Learn how it works
          </Link>
        </div>
      </div>
    </section>
  );
}
