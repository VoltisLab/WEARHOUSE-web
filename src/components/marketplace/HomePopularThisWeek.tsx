"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TrendItem = {
  id: string;
  title: string;
  searches: string;
  href: string;
  image: string;
};

const TRENDS: TrendItem[] = [
  {
    id: "p1",
    title: "New-season shop edits",
    searches: "+3.1k searches",
    href: "/search?q=streetwear&browse=1",
    image: "/marketplace/popular/01.png",
  },
  {
    id: "p2",
    title: "Chunky sneakers",
    searches: "+2.8k searches",
    href: "/search?q=dad+sneakers&browse=1",
    image: "/marketplace/popular/02.png",
  },
  {
    id: "p3",
    title: "Film-camera aesthetic",
    searches: "+1.9k searches",
    href: "/search?q=vintage+camera&browse=1",
    image: "/marketplace/popular/03.png",
  },
  {
    id: "p4",
    title: "Technical trainers",
    searches: "+2.4k searches",
    href: "/search?q=trail+sneakers&browse=1",
    image: "/marketplace/popular/04.png",
  },
  {
    id: "p5",
    title: "Wide-leg tailoring",
    searches: "+1.2k searches",
    href: "/search?q=wide+leg+trousers&browse=1",
    image: "/marketplace/popular/05.png",
  },
  {
    id: "p6",
    title: "Street colour blocks",
    searches: "+980 searches",
    href: "/search?q=streetwear&browse=1",
    image: "/marketplace/popular/06.png",
  },
  {
    id: "p7",
    title: "Roller & retro sport",
    searches: "+1.5k searches",
    href: "/search?q=roller+skates&browse=1",
    image: "/marketplace/popular/07.png",
  },
  {
    id: "p8",
    title: "70s lounge layers",
    searches: "+890 searches",
    href: "/search?q=vintage+70s&browse=1",
    image: "/marketplace/popular/08.png",
  },
  {
    id: "p9",
    title: "Editorial duos",
    searches: "+1.1k searches",
    href: "/search?q=editorial+fashion&browse=1",
    image: "/marketplace/popular/09.png",
  },
  {
    id: "p10",
    title: "Quirky fleece layers",
    searches: "+1.3k searches",
    href: "/search?q=fleece+jacket&browse=1",
    image: "/marketplace/popular/10.png",
  },
];

/**
 * Horizontal “Popular this week” rail with real photography tiles.
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
          {TRENDS.map((item, index) => (
            <Link
              key={item.id}
              href={item.href}
              className="group w-[42vw] max-w-[200px] shrink-0 [-webkit-tap-highlight-color:transparent] sm:w-44 sm:max-w-none"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/[0.06] transition group-hover:shadow-md">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 42vw, 176px"
                  priority={index === 0}
                />
              </div>
              <p className="mt-3 text-[14px] font-medium leading-snug text-black sm:text-[15px]">
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
