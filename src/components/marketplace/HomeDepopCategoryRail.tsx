"use client";

import Link from "next/link";

const TILES: {
  label: string;
  href: string;
  surface: string;
}[] = [
  {
    label: "Women",
    href: "/search?dept=WOMEN&browse=1",
    surface: "bg-gradient-to-br from-rose-50 to-rose-100/90",
  },
  {
    label: "Men",
    href: "/search?dept=MEN&browse=1",
    surface: "bg-gradient-to-br from-slate-100 to-slate-200/85",
  },
  {
    label: "Girls",
    href: "/search?dept=GIRLS&browse=1",
    surface: "bg-gradient-to-br from-amber-50 to-orange-100/80",
  },
  {
    label: "Boys",
    href: "/search?dept=BOYS&browse=1",
    surface: "bg-gradient-to-br from-emerald-50 to-teal-100/85",
  },
  {
    label: "Toddlers",
    href: "/search?dept=TODDLERS&browse=1",
    surface: "bg-gradient-to-br from-violet-50 to-purple-100/80",
  },
  {
    label: "Browse all",
    href: "/search?browse=1",
    surface: "bg-gradient-to-br from-neutral-100 to-neutral-200/75",
  },
];

/**
 * Depop-style “Shop by category”: horizontal tiles with bold section title.
 */
export function HomeDepopCategoryRail() {
  return (
    <section className="space-y-4">
      <h2 className="px-1 text-[1.75rem] font-black leading-none tracking-tight text-neutral-900 sm:text-[2rem]">
        Shop by category
      </h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
        {TILES.map(({ label, href, surface }) => (
          <Link
            key={label}
            href={href}
            className="group shrink-0 [-webkit-tap-highlight-color:transparent]"
          >
            <div
              className={`flex h-[7.5rem] w-[6.25rem] flex-col justify-end overflow-hidden rounded-2xl p-3 shadow-sm ring-1 ring-black/[0.08] transition group-hover:ring-black/14 group-active:scale-[0.98] sm:h-[8.5rem] sm:w-[7rem] ${surface}`}
            >
              <span className="text-[14px] font-medium leading-tight text-neutral-900 sm:text-[15px]">
                {label}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
