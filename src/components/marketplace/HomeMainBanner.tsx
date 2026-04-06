import Link from "next/link";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";
import { MARKETPLACE_HOME_HERO_IMAGE_URL } from "@/lib/constants";

/**
 * Full-bleed hero: background photo fills the banner; gradients keep copy readable
 * while leaving the subjects visible on the right (see `MARKETPLACE_HOME_HERO_IMAGE_URL`).
 */
export function HomeMainBanner() {
  const src = MARKETPLACE_HOME_HERO_IMAGE_URL;

  return (
    <section className="relative isolate min-h-[min(72vw,440px)] overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 md:min-h-[400px] lg:min-h-[440px]">
      {/* Background — fills entire banner */}
      {/* eslint-disable-next-line @next/next/no-img-element -- hero may be external URL from env */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[55%_center] sm:object-[50%_center]"
        fetchPriority="high"
        decoding="async"
      />

      {/* Readability: strong wash on the left (headline + CTAs), lighter on the right (faces) */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#12051a]/95 from-0% via-[#2a0f32]/78 via-[42%] to-transparent to-[72%]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25 md:to-black/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#6b1f7a]/25 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-[min(72vw,440px)] items-center px-5 py-10 md:min-h-[400px] md:px-10 md:py-12 lg:min-h-[440px] lg:px-14 lg:py-14">
        <div className="max-w-xl text-white [text-shadow:0_2px_28px_rgba(0,0,0,0.55)]">
          <BrandWordmark className="text-[13px] uppercase tracking-[0.12em] text-white/95" />
          <h2 className="mt-2 text-[28px] font-bold leading-[1.15] tracking-tight sm:text-[34px] md:text-[40px]">
            Ready to refresh your wardrobe?
          </h2>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/95 md:text-[17px]">
            Sell pieces you no longer wear and find pre-loved fashion at great
            prices — all in one community on {BRAND_NAME}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/sell"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-white px-7 text-[16px] font-semibold text-[#6b1f7a] shadow-lg shadow-black/25 transition hover:bg-white/95 [text-shadow:none]"
            >
              Sell now
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-white/95 bg-white/10 px-7 text-[16px] font-semibold text-white backdrop-blur-[2px] transition hover:bg-white/20 [text-shadow:none]"
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
