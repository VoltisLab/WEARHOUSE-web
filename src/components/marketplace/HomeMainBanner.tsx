import Link from "next/link";
import { BRAND_NAME } from "@/lib/branding";
import { MARKETPLACE_HOME_HERO_IMAGE_URL } from "@/lib/constants";

const VINTED_TEAL = "#09B1BA";

/**
 * Full-width hero (parent should break out of `main` horizontal padding).
 * Vinted-style: edge-to-edge photo, white CTA card, teal primary action.
 */
export function HomeMainBanner() {
  const src = MARKETPLACE_HOME_HERO_IMAGE_URL;

  return (
    <section className="relative isolate min-h-[min(52vw,320px)] w-full overflow-hidden md:min-h-[min(42vw,420px)] lg:min-h-[440px]">
      {/* eslint-disable-next-line @next/next/no-img-element -- hero may be external URL from env */}
      <img
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[52%_center] sm:object-[48%_center]"
        fetchPriority="high"
        decoding="async"
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[min(52vw,320px)] max-w-7xl items-stretch px-4 py-8 sm:px-5 md:min-h-[min(42vw,420px)] md:py-10 md:pl-6 md:pr-8 lg:min-h-[440px] lg:pl-8 lg:pr-10 lg:py-12">
        <div className="w-full max-w-[min(100%,380px)] self-center rounded-2xl bg-white p-6 shadow-[0_12px_48px_rgba(0,0,0,0.14)] sm:p-7 md:max-w-[400px] md:p-8">
          <h2 className="text-[22px] font-bold leading-tight tracking-tight text-neutral-900 sm:text-[26px] md:text-[28px]">
            Ready to refresh your wardrobe?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 md:text-[16px]">
            Sell pieces you no longer wear and find pre-loved fashion at great
            prices — all in one community on {BRAND_NAME}.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/sell"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-7 text-[16px] font-bold text-white shadow-md transition hover:brightness-105"
              style={{ backgroundColor: VINTED_TEAL }}
            >
              Sell now
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex min-h-[44px] items-center justify-center text-[15px] font-semibold transition hover:opacity-80"
              style={{ color: VINTED_TEAL }}
            >
              Learn how it works
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
