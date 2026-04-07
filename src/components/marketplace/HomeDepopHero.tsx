"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BRAND_NAME } from "@/lib/branding";
import {
  MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_CENTER_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_LEFT_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_RIGHT_URL,
} from "@/lib/constants";

type HomeHeroMode = "buy" | "sell";

const HERO_ROTATE_MS = 10_000;

const collageShadow =
  "shadow-[0_10px_40px_rgba(0,0,0,0.09),0_2px_8px_rgba(0,0,0,0.04)]";

const frameBase = `rounded-xl object-cover ${collageShadow} ring-1 ring-black/[0.06]`;

/**
 * Shared 3-card layout for buy + sell: wide back plane, left + right forward cards
 * (different from the old “tall center stack” so reads as a new composition).
 */
const COLLAGE_LAYOUT = {
  /** Recedes — anchor layer */
  center: `absolute left-[18%] top-[20%] z-[1] h-[54%] w-[58%] rotate-[2deg] object-center ${frameBase}`,
  /** Mid depth, left rail */
  left: `absolute left-[-1%] top-[8%] z-[5] h-[58%] w-[42%] -rotate-[11deg] object-left ${frameBase}`,
  /** Front — tallest, right */
  right: `absolute right-[-2%] top-[4%] z-[10] h-[64%] w-[44%] rotate-[12deg] object-right ${frameBase}`,
} as const;

function HeroCollageTriptych({
  leftSrc,
  centerSrc,
  rightSrc,
}: {
  leftSrc: string;
  centerSrc: string;
  rightSrc: string;
}) {
  return (
    <div
      className="relative h-full w-full max-w-[21rem] sm:max-w-[26rem] md:max-w-[30rem]"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- hero may be external URL from env */}
      <img src={leftSrc} alt="" className={COLLAGE_LAYOUT.left} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={centerSrc} alt="" className={COLLAGE_LAYOUT.center} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={rightSrc} alt="" className={COLLAGE_LAYOUT.right} />
    </div>
  );
}

function panelClass(active: boolean) {
  return [
    "[grid-area:stack] col-start-1 row-start-1 min-w-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
    active
      ? "z-10 opacity-100"
      : "pointer-events-none z-0 opacity-0",
  ].join(" ");
}

/**
 * Home hero: soft gradient banner, copy left, shared 3-up collage right (buy vs sell assets).
 * Alternates buy/sell on a timer with crossfade and dot controls (page content below stays unchanged).
 */
export function HomeDepopHero() {
  const [mode, setMode] = useState<HomeHeroMode>("buy");

  const buyCollage = {
    left: MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL,
    center: MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL,
    right: MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL,
  };

  const sellCollage = {
    left: MARKETPLACE_HOME_HERO_SELL_COLLAGE_LEFT_URL,
    center: MARKETPLACE_HOME_HERO_SELL_COLLAGE_CENTER_URL,
    right: MARKETPLACE_HOME_HERO_SELL_COLLAGE_RIGHT_URL,
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      setMode((m) => (m === "buy" ? "sell" : "buy"));
    }, HERO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, [mode]);

  return (
    <section className="home-depop-hero-bg relative isolate w-full overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:gap-14 sm:px-8 sm:py-14 md:gap-16 md:px-10 md:py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-[4.5rem]">
        <div className="min-w-0">
          <div className="grid [grid-template-areas:'stack']">
            <div className={panelClass(mode === "buy")}>
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
            </div>

            <div className={panelClass(mode === "sell")}>
              <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
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
            </div>
          </div>

          <div
            className="mt-8 flex gap-2.5 sm:mt-9"
            role="tablist"
            aria-label="Hero focus"
          >
            {(["buy", "sell"] as const).map((m) => {
              const selected = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-label={m === "buy" ? "Buying" : "Selling"}
                  onClick={() => setMode(m)}
                  className={[
                    "h-2 w-2 rounded-full transition-colors duration-300",
                    selected
                      ? "bg-neutral-900"
                      : "bg-neutral-300 hover:bg-neutral-400",
                  ].join(" ")}
                />
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto flex h-[min(56vw,24rem)] w-full max-w-md items-center justify-center sm:h-[min(50vw,28rem)] md:max-w-none md:justify-end lg:h-[min(38vw,30rem)] xl:h-[34rem]">
          <div className="grid h-full w-full [grid-template-areas:'stack'] place-items-center md:place-items-end">
            <div
              className={[
                "[grid-area:stack] col-start-1 row-start-1 flex h-full w-full items-center justify-center md:justify-end",
                "transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
                mode === "buy"
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0",
              ].join(" ")}
            >
              <HeroCollageTriptych
                leftSrc={buyCollage.left}
                centerSrc={buyCollage.center}
                rightSrc={buyCollage.right}
              />
            </div>
            <div
              className={[
                "[grid-area:stack] col-start-1 row-start-1 flex h-full w-full items-center justify-center md:justify-end",
                "transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
                mode === "sell"
                  ? "z-10 opacity-100"
                  : "pointer-events-none z-0 opacity-0",
              ].join(" ")}
            >
              <HeroCollageTriptych
                leftSrc={sellCollage.left}
                centerSrc={sellCollage.center}
                rightSrc={sellCollage.right}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
