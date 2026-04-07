"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  DISCOVER_BANNER_STYLE_IMAGE_URL,
  DISCOVER_BANNER_TRY_CART_IMAGE_URL,
  MARKETPLACE_HOME_HERO_IMAGE_URL,
} from "@/lib/constants";

type Slide = {
  title: string;
  body: string;
  href: string;
  image: string;
};

const SLIDES: Slide[] = [
  {
    title: "Blouse season",
    body: "Get vintage styles under £10",
    href: "/search?q=vintage+blouse&browse=1",
    image: MARKETPLACE_HOME_HERO_IMAGE_URL,
  },
  {
    title: "Bring main stage energy",
    body: "Discover one-off festival finds",
    href: "/search?q=festival&browse=1",
    image: DISCOVER_BANNER_STYLE_IMAGE_URL,
  },
  {
    title: "Come out of hibernation",
    body: "Swap your winter coat for a lightweight style",
    href: "/search?q=spring+jacket&browse=1",
    image: DISCOVER_BANNER_TRY_CART_IMAGE_URL,
  },
];

/** Flat light tint of brand primary (no gradients); dark text for contrast. */
const promoCopyBgClass =
  "bg-[color-mix(in_srgb,var(--prel-primary)_14%,#ffffff)]";

/**
 * Split promo: copy on solid light-primary panel + image strip with carousel chrome.
 */
export function HomePromoCarousel() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i]!;
  const next = useCallback(() => setI((n) => (n + 1) % SLIDES.length), []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 lg:px-10">
      <div className="overflow-hidden rounded-2xl shadow-ios ring-1 ring-black/[0.08] sm:flex sm:min-h-[280px] md:min-h-[320px] dark:ring-white/10">
        <div
          className={`flex w-full flex-col justify-center border-b border-black/[0.08] border-l-4 border-l-[var(--prel-primary)] px-6 py-8 pl-7 max-sm:border-b sm:w-[42%] sm:max-w-md sm:shrink-0 sm:self-stretch sm:border-b-0 sm:border-r sm:py-10 sm:pl-8 sm:pr-6 lg:pl-10 dark:border-white/15 ${promoCopyBgClass}`}
        >
          <div
            className="min-w-0"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--prel-primary)_72%,#171717)]">
              Spotlight
            </p>
            <h2 className="mt-1.5 text-[1.5rem] font-black leading-tight tracking-tight text-neutral-900 sm:text-[1.65rem]">
              {slide.title}
            </h2>
            <p className="mt-2 max-w-sm text-[15px] leading-snug text-neutral-700">
              {slide.body}
            </p>
          </div>
          <Link
            href={slide.href}
            className="mt-6 inline-flex min-h-[44px] w-fit items-center justify-center rounded-full bg-[var(--prel-primary)] px-7 text-[14px] font-bold text-white shadow-sm transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--prel-primary)]"
          >
            Discover
          </Link>
        </div>

        <div className="relative min-h-[220px] flex-1 sm:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={i}
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
            aria-hidden
          />

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-md ring-1 ring-black/10 transition hover:bg-neutral-50 md:right-4 md:h-12 md:w-12 dark:bg-neutral-100 dark:ring-black/20"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={2} aria-hidden />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setI(idx)}
                className={`h-2.5 w-2.5 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  idx === i
                    ? "bg-white shadow-sm ring-1 ring-black/20"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Go to slide ${idx + 1} of ${SLIDES.length}`}
                aria-current={idx === i ? "true" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
