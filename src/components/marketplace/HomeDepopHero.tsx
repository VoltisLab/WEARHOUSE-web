import Link from "next/link";
import { BRAND_NAME } from "@/lib/branding";
import {
  MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL,
  MARKETPLACE_HOME_HERO_IMAGE_URL,
} from "@/lib/constants";
import { HomeBuySellSwitch } from "@/components/marketplace/HomeBuySellSwitch";

type HomeHeroMode = "buy" | "sell";

const collageShadow =
  "shadow-[0_10px_40px_rgba(0,0,0,0.09),0_2px_8px_rgba(0,0,0,0.04)]";

/**
 * Hero wash: three stops only — white → cool neutral → whisper of brand at the
 * trailing corner (avoids the busy multi-stop color-mix sweep).
 */
const heroBannerClass =
  "border-b border-neutral-200/80 bg-[linear-gradient(152deg,#ffffff_0%,#f6f7f8_52%,color-mix(in_srgb,var(--prel-primary)_10%,#ececef)_100%)]";

/**
 * Home hero: soft gradient banner, copy left, collage right, pill primary CTAs.
 */
export function HomeDepopHero({
  mode,
  onModeChange,
}: {
  mode: HomeHeroMode;
  onModeChange: (m: HomeHeroMode) => void;
}) {
  const src = MARKETPLACE_HOME_HERO_IMAGE_URL;
  const collageL = MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL;
  const collageC = MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL;
  const collageR = MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL;
  const isBuy = mode === "buy";

  return (
    <section className={`relative isolate w-full overflow-hidden ${heroBannerClass}`}>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:gap-14 sm:px-8 sm:py-14 md:gap-16 md:px-10 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-[4.5rem]">
        <div className="min-w-0">
          <div className="mb-7 flex justify-start sm:mb-9">
            <HomeBuySellSwitch
              mode={mode}
              onModeChange={onModeChange}
              variant="panel"
              align="start"
            />
          </div>

          {isBuy ? (
            <>
              <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
                <span className="block">Buy preloved.</span>
                <span className="mt-1 block sm:mt-1.5">Wear it your way</span>
              </h1>
              <p className="mt-5 max-w-md text-[16px] font-normal leading-relaxed text-neutral-700 sm:text-[17px] md:text-lg">
                Together, we&apos;re keeping fashion circular.
              </p>

              <div className="mt-8 sm:mt-10">
                <Link
                  href="/search"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-9 text-[15px] font-bold text-white transition hover:brightness-110 sm:min-h-[52px] sm:px-10 sm:text-[16px]"
                >
                  Discover
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-[3.25rem]">
                <span className="block">Sell smarter.</span>
                <span className="mt-1 block text-neutral-800 sm:mt-1.5">
                  On {BRAND_NAME}.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-neutral-700 sm:text-[17px]">
                List from the web, chat with buyers, and ship when you sell —
                same flow as the app.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[15px] font-bold text-white shadow-sm transition hover:brightness-110 sm:min-h-[52px] sm:px-10 sm:text-[16px]"
                >
                  Start selling
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-neutral-300 bg-white px-6 text-[15px] font-bold text-neutral-900 transition hover:bg-neutral-50 sm:min-h-[52px] sm:px-8"
                >
                  How it works
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="relative mx-auto flex h-[min(56vw,24rem)] w-full max-w-md items-center justify-center sm:h-[min(50vw,28rem)] md:max-w-none md:justify-end lg:h-[min(38vw,30rem)] xl:h-[34rem]">
          {isBuy ? (
            <div
              className="relative h-full w-full max-w-[21rem] sm:max-w-[26rem] md:max-w-[30rem]"
              aria-hidden
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- hero may be external URL from env */}
              <img
                src={collageL}
                alt=""
                className={`absolute left-[2%] top-[10%] h-[58%] w-[42%] rotate-[-9deg] rounded-xl object-cover object-bottom ${collageShadow} ring-1 ring-black/[0.06]`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={collageC}
                alt=""
                className={`absolute left-[26%] top-[0%] z-10 h-[64%] w-[46%] rotate-[2deg] rounded-xl object-cover object-top ${collageShadow} ring-1 ring-black/[0.06]`}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={collageR}
                alt=""
                className={`absolute right-[0%] top-[16%] z-[5] h-[58%] w-[42%] rotate-[11deg] rounded-xl object-cover object-center ${collageShadow} ring-1 ring-black/[0.06]`}
              />
            </div>
          ) : (
            <div className="relative h-full w-full max-w-[20rem] opacity-90 sm:max-w-[24rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="absolute inset-[5%] h-[90%] w-[70%] rounded-2xl object-cover object-center shadow-lg ring-1 ring-black/10"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
