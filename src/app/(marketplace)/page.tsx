"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MARKETPLACE_FEED } from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { HomeMainBanner } from "@/components/marketplace/HomeMainBanner";
import { AppStoreBadges } from "@/components/marketplace/AppStoreBadges";
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
      sort: "NEWEST",
    },
  });
  const rows = (data?.allProducts ?? []) as MarketplaceProductRow[];

  return (
    <div className="space-y-8 pb-6">
      <HomeMainBanner />

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#5c1a6e] via-[#8b2199] to-[#ab28b2] p-4 text-white shadow-lg sm:p-6 md:p-8">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-black/10 blur-3xl"
          aria-hidden
        />
        <div className="relative max-w-xl">
          <h2 className="text-[20px] font-bold leading-tight md:text-[22px]">
            Discover pre-loved fashion
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-white/90">
            Browse live listings from the {BRAND_NAME} catalogue — search by
            department or keyword.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-[#6b1f7a] shadow-md transition hover:bg-white/95"
            >
              Browse all
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <div className="[&_img]:brightness-0 [&_img]:invert">
              <AppStoreBadges className="opacity-95" />
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
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
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {rows.map((p) => (
            <MarketplaceProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
