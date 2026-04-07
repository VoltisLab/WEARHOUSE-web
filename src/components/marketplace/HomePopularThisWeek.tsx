"use client";

import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TrendItem = {
  title: string;
  searches: string;
  href: string;
};

const TRENDS: TrendItem[] = [
  {
    title: "Dr. Martens Mary Janes",
    searches: "+3.3k searches",
    href: "/search?q=mary+janes&browse=1",
  },
  {
    title: "Carhartt Detroit jacket",
    searches: "+2.1k searches",
    href: "/search?q=carhartt+detroit&browse=1",
  },
  {
    title: "Ariat barrel jeans",
    searches: "+1.8k searches",
    href: "/search?q=ariat+barrel+jeans&browse=1",
  },
  {
    title: "Timberland 6-inch boots",
    searches: "+1.4k searches",
    href: "/search?q=timberland+boots&browse=1",
  },
];

/**
 * Depop-style “Popular this week”: horizontal row + chevron nav (placeholder tiles until real images).
 */
export function HomePopularThisWeek() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByDir = useCallback((dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const delta = Math.min(el.clientWidth * 0.85, 320) * dir;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  return (
    <section className="border-t border-neutral-100 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-[1.5rem] font-black tracking-tight text-black sm:text-[1.65rem]">
            Popular this week
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => scrollByDir(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition hover:bg-neutral-50"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => scrollByDir(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-800 shadow-sm transition hover:bg-neutral-50"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="-mx-1 flex gap-4 overflow-x-auto pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        >
          {TRENDS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group w-[42vw] max-w-[200px] shrink-0 [-webkit-tap-highlight-color:transparent] sm:w-44 sm:max-w-none"
            >
              <div className="aspect-square w-full rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/[0.06] transition group-hover:shadow-md" />
              <p className="mt-3 text-[14px] font-bold leading-snug text-black sm:text-[15px]">
                {item.title}
              </p>
              <p className="mt-1 text-[13px] font-normal text-neutral-500">
                {item.searches}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
