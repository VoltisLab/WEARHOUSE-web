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

/**
 * Split promo banner with dark copy panel + image, dots + next control (Depop-style).
 */
export function HomePromoCarousel() {
  const [i, setI] = useState(0);
  const slide = SLIDES[i]!;
  const next = useCallback(() => setI((n) => (n + 1) % SLIDES.length), []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 lg:px-10">
      <div className="overflow-hidden rounded-lg shadow-md ring-1 ring-black/10 sm:flex sm:min-h-[280px] md:min-h-[320px]">
        <div className="flex w-full flex-col justify-center bg-[#3e4143] px-6 py-8 sm:w-[42%] sm:max-w-md sm:shrink-0 sm:self-stretch sm:py-10 sm:pl-8 sm:pr-6 lg:pl-10">
          <h2 className="text-[1.5rem] font-black leading-tight tracking-tight text-white sm:text-[1.65rem]">
            {slide.title}
          </h2>
          <p className="mt-2 text-[15px] font-normal leading-snug text-white/90">
            {slide.body}
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-7 text-[14px] font-bold text-white transition hover:brightness-110"
          >
            Discover
          </Link>
        </div>
        <div className="relative min-h-[220px] flex-1 sm:min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Light bottom scrim only — keeps dots readable without washing the photo */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />

          <button
            type="button"
            onClick={next}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition hover:bg-neutral-100 md:right-4 md:h-12 md:w-12"
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
                className={`h-2 w-2 rounded-full transition ${
                  idx === i ? "bg-white" : "bg-white/50 hover:bg-white/75"
                }`}
                aria-label={`Slide ${idx + 1}`}
                aria-current={idx === i}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
