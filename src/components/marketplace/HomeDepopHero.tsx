"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BRAND_NAME } from "@/lib/branding";
import {
  MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL,
  MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_CENTER_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_LEFT_URL,
  MARKETPLACE_HOME_HERO_SELL_COLLAGE_RIGHT_URL,
} from "@/lib/constants";
import { AppStoreBadges } from "@/components/marketplace/AppStoreBadges";

type HomeHeroMode = "buy" | "sell";

const HERO_ROTATE_MS = 10_000;
/** Cycle the single portrait through left / center / right URLs while a mode is active. */
const HERO_IMAGE_CYCLE_MS = 5000;

const portraitFrame =
  "overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12),0_4px_16px_rgba(0,0,0,0.06)] ring-2 ring-[color-mix(in_srgb,var(--prel-primary)_22%,transparent)]";

const peekFrame =
  "overflow-hidden rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-[color-mix(in_srgb,var(--prel-primary)_14%,transparent)]";

function panelClass(active: boolean) {
  return [
    "[grid-area:stack] col-start-1 row-start-1 min-w-0 transition-opacity duration-700 ease-in-out motion-reduce:transition-none",
    active
      ? "z-10 opacity-100"
      : "pointer-events-none z-0 opacity-0",
  ].join(" ");
}

function uniqueOrdered(urls: string[]) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const u of urls) {
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

function tripleIndices(center: number, n: number) {
  const prev = (center - 1 + n) % n;
  const curr = center % n;
  const next = (center + 1) % n;
  return { prev, curr, next };
}

/**
 * Exactly three on-screen panels: previous (peek) · main · next (peek).
 * Cycles indices on a timer; no off-screen strip, so at most three images show.
 */
function HeroPeekCarousel({
  urls,
  resetKey,
}: {
  urls: string[];
  resetKey: string | number;
}) {
  const safe = urls.length > 0 ? urls : [""];
  const nn = safe.length;

  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
  }, [resetKey]);

  const goNext = useCallback(() => {
    if (nn <= 1) return;
    setSlide((s) => (s + 1) % nn);
  }, [nn]);

  useEffect(() => {
    if (nn <= 1) return;
    const id = window.setInterval(goNext, HERO_IMAGE_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [nn, goNext]);

  const { prev, curr, next } = tripleIndices(slide, nn);

  const mainH =
    "h-[calc(min(85vw,17.5rem)*4/3)] sm:h-[calc(min(82vw,19rem)*4/3)] md:h-[calc(min(78vw,20rem)*4/3)] lg:h-[min(100%,calc(min(40rem,calc(100%-1.25rem))*4/3))] lg:max-h-[min(calc(40rem*4/3),calc((100%-1.25rem)*4/3))] lg:min-h-[min(calc(18rem*4/3),50vh)]";

  const viewportClass =
    "relative mx-auto min-w-0 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl " +
    "w-[calc(min(85vw,17.5rem)*2)] sm:w-[calc(min(82vw,19rem)*2)] md:w-[calc(min(78vw,20rem)*2)] " +
    "lg:w-[min(calc(100%-1rem),44rem)] lg:mx-0 lg:max-w-none";

  function PeekSlot({
    src,
    side,
  }: {
    src: string;
    side: "left" | "right";
  }) {
    return (
      <div className={`relative h-full min-w-0 ${peekFrame}`} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element -- hero may be external URL from env */}
        <img
          src={src}
          alt=""
          className={[
            "h-full w-[200%] max-w-none object-cover",
            side === "left" ? "object-right" : "object-left",
          ].join(" ")}
        />
      </div>
    );
  }

  function MainSlot({ src, slideKey }: { src: string; slideKey: number }) {
    return (
      <figure
        className={`relative z-10 h-full min-w-0 ${portraitFrame}`}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={slideKey}
          src={src}
          alt=""
          className="h-full w-full object-cover"
        />
      </figure>
    );
  }

  if (nn <= 1) {
    const src = safe[0];
    return (
      <div
        className={`relative mx-auto flex w-[min(85vw,17.5rem)] justify-center sm:w-[min(82vw,19rem)] md:w-[min(78vw,20rem)] lg:mx-0 lg:w-auto lg:max-w-none ${mainH}`}
      >
        <figure
          className={`relative aspect-[3/4] w-full max-w-[min(85vw,17.5rem)] lg:aspect-auto lg:h-full lg:max-h-[min(40rem,calc(100%-1.25rem))] lg:w-auto lg:min-h-[18rem] ${portraitFrame}`}
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" className="h-full w-full object-cover" />
        </figure>
      </div>
    );
  }

  return (
    <div className={`${viewportClass} ${mainH}`}>
      <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] items-stretch gap-0">
        <PeekSlot src={safe[prev]} side="left" />
        <MainSlot src={safe[curr]} slideKey={slide} />
        <PeekSlot src={safe[next]} side="right" />
      </div>
    </div>
  );
}

/**
 * Home hero: gradient banner, copy left, single portrait image right that rotates through
 * buy/sell photo sets; buy/sell panels alternate on a timer with dot controls.
 */
export function HomeDepopHero() {
  const [mode, setMode] = useState<HomeHeroMode>("buy");

  const buyUrls = useMemo(
    () =>
      uniqueOrdered([
        MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL,
        MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL,
        MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL,
      ]),
    [],
  );

  const sellUrls = useMemo(
    () =>
      uniqueOrdered([
        MARKETPLACE_HOME_HERO_SELL_COLLAGE_LEFT_URL,
        MARKETPLACE_HOME_HERO_SELL_COLLAGE_CENTER_URL,
        MARKETPLACE_HOME_HERO_SELL_COLLAGE_RIGHT_URL,
      ]),
    [],
  );

  useEffect(() => {
    const id = window.setInterval(() => {
      setMode((m) => (m === "buy" ? "sell" : "buy"));
    }, HERO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="home-depop-hero-bg relative isolate w-full overflow-hidden">
      <div
        className="pointer-events-none absolute -right-20 -top-28 h-[min(70vw,24rem)] w-[min(70vw,24rem)] rounded-full bg-[var(--prel-primary)] opacity-[0.2] blur-[64px] dark:opacity-[0.32]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-36 -left-24 h-80 w-80 rounded-full bg-[var(--prel-primary)] opacity-[0.14] blur-[56px] dark:opacity-[0.26]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:gap-14 sm:px-8 sm:py-14 md:gap-16 md:px-10 md:py-16 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:py-[4.5rem] xl:gap-20">
        <div className="min-w-0 lg:flex lg:flex-col lg:justify-center">
          <div className="grid [grid-template-areas:'stack']">
            <div className={panelClass(mode === "buy")}>
              <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
                <span className="block">Buy preloved.</span>
                <span className="mt-1 block text-[var(--prel-primary)] sm:mt-1.5">
                  Wear it your way
                </span>
              </h1>
              <p className="mt-5 max-w-md text-[16px] font-normal leading-relaxed text-neutral-800 sm:text-[17px] md:text-lg">
                Together, we&apos;re keeping fashion circular.
              </p>

              <div className="mt-8 sm:mt-10">
                <Link
                  href="/search"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-9 text-[15px] font-bold text-white shadow-md transition hover:brightness-110 sm:min-h-[52px] sm:px-10 sm:text-[16px]"
                >
                  Discover
                </Link>
              </div>
            </div>

            <div className={panelClass(mode === "sell")}>
              <h1 className="text-[2.25rem] font-black leading-[1.05] tracking-[-0.03em] text-neutral-950 sm:text-5xl md:text-[3.25rem] lg:text-[3.5rem]">
                <span className="block">Sell smarter.</span>
                <span className="mt-1 block text-[var(--prel-primary)] sm:mt-1.5">
                  On {BRAND_NAME}.
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-neutral-800 sm:text-[17px]">
                List from the web, chat with buyers, and ship when you sell —
                same flow as the app.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/sell"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[15px] font-bold text-white shadow-md transition hover:brightness-110 sm:min-h-[52px] sm:px-10 sm:text-[16px]"
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
                      ? "bg-[var(--prel-primary)]"
                      : "bg-neutral-300 hover:bg-neutral-400 dark:bg-neutral-600 dark:hover:bg-neutral-500",
                  ].join(" ")}
                />
              );
            })}
          </div>

          <div className="mt-8 sm:mt-10">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-neutral-500">
              Get the app
            </p>
            <AppStoreBadges />
          </div>
        </div>

        <div className="flex min-h-[min(56vw,22rem)] w-full min-w-0 items-stretch justify-center sm:min-h-[min(52vw,24rem)] lg:h-full lg:min-h-0 lg:py-1">
          <div className="flex h-full w-full max-w-md min-w-0 items-center justify-center self-stretch md:max-w-lg lg:max-w-none lg:justify-end">
            <HeroPeekCarousel
              urls={mode === "buy" ? buyUrls : sellUrls}
              resetKey={mode}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
