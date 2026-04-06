"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MARKETPLACE_FEED } from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { BRAND_NAME } from "@/lib/branding";
import { useClientMounted } from "@/lib/use-client-mounted";

const DEPT_LINKS = [
  { label: "Women", dept: "WOMEN" },
  { label: "Men", dept: "MEN" },
  { label: "Girls", dept: "GIRLS" },
  { label: "Boys", dept: "BOYS" },
  { label: "Toddlers", dept: "TODDLERS" },
] as const;

export default function MarketplaceHomePage() {
  const mounted = useClientMounted();
  const { data, loading, error } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted,
    variables: {
      pageCount: 24,
      pageNumber: 1,
      filters: { status: "ACTIVE" },
      search: null,
    },
  });
  const rows = (data?.allProducts ?? []) as MarketplaceProductRow[];

  return (
    <div className="space-y-8 pb-6">
      <section className="rounded-2xl bg-gradient-to-br from-[#ab28b2]/14 via-white to-prel-bg-grouped p-6 shadow-ios ring-1 ring-[var(--prel-primary)]/18 md:p-8 lg:p-10">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-prel-label md:text-3xl lg:text-4xl">
          Discover pre-loved fashion
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-prel-secondary-label md:text-[16px]">
          Browse live listings from the {BRAND_NAME} catalogue. Buying, selling,
          and account tools stay in the mobile app — staff use the console
          separately.
        </p>
        <Link
          href="/search"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--prel-primary)] px-5 py-2.5 text-[15px] font-semibold text-white shadow-ios"
        >
          Browse all
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      <section className="space-y-4">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-prel-secondary-label">
          Shop by department
        </p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {DEPT_LINKS.map(({ label, dept }) => (
            <Link
              key={dept}
              href={`/search?dept=${dept}`}
              className="rounded-full bg-white px-4 py-2.5 text-[14px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border transition hover:bg-[#ab28b2]/10 md:px-5 md:py-3"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[20px] font-bold text-prel-label">
            Latest arrivals
          </h2>
          <Link
            href="/search"
            className="shrink-0 text-[14px] font-semibold text-[var(--prel-primary)]"
          >
            See all
          </Link>
        </div>
        {error ? (
          <p className="rounded-xl bg-red-500/10 p-4 text-[14px] text-prel-error">
            {error.message}
          </p>
        ) : null}
        {(!mounted || loading) && !data ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
              >
                <div className="aspect-[3/4] animate-pulse bg-prel-bg-grouped" />
                <div className="space-y-2 p-3">
                  <div className="h-4 animate-pulse rounded bg-prel-bg-grouped" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-prel-bg-grouped" />
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {rows.map((p) => (
            <MarketplaceProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
