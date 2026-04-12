"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE_FOOTER_COLUMNS } from "@/lib/site-footer-nav";

export function MarketingRelatedStrip({ excludeHref }: { excludeHref?: string }) {
  const pathname = usePathname();
  const links = useMemo(() => {
    const flat = SITE_FOOTER_COLUMNS.flatMap((c) =>
      c.links.map((l) => ({ ...l, column: c.title })),
    );
    const skip = excludeHref ?? pathname;
    return flat.filter((l) => l.href !== skip).slice(0, 8);
  }, [pathname, excludeHref]);

  if (links.length === 0) return null;

  return (
    <section className="bg-prel-bg-grouped/80 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-prel-tertiary-label">
          Explore next
        </h2>
        <p className="mt-2 text-[20px] font-bold text-prel-label">
          More on WEARHOUSE
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped"
              >
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-wide text-prel-tertiary-label">
                    {l.column}
                  </span>
                  <span className="mt-0.5 block">{l.label}</span>
                </span>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-prel-tertiary-label transition group-hover:text-[var(--prel-primary)]"
                  strokeWidth={2}
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
