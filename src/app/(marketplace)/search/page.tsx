"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MARKETPLACE_FEED,
  POPULAR_BRANDS,
} from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { useClientMounted } from "@/lib/use-client-mounted";

const DEPT_CHIPS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "Women", value: "WOMEN" },
  { label: "Men", value: "MEN" },
  { label: "Girls", value: "GIRLS" },
  { label: "Boys", value: "BOYS" },
  { label: "Toddlers", value: "TODDLERS" },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest", value: "NEWEST" },
  { label: "Price ↑", value: "PRICE_ASC" },
  { label: "Price ↓", value: "PRICE_DESC" },
];

function buildSearchHref(opts: {
  q?: string;
  dept?: string | null;
  sort?: string;
  brand?: string | null;
}): string {
  const p = new URLSearchParams();
  if (opts.q?.trim()) p.set("q", opts.q.trim());
  if (opts.dept && opts.dept !== "ALL") p.set("dept", opts.dept);
  if (opts.sort && opts.sort !== "NEWEST") p.set("sort", opts.sort);
  if (opts.brand?.trim()) p.set("brand", opts.brand.trim());
  const s = p.toString();
  return s ? `/search?${s}` : "/search";
}

function SearchInner() {
  const mounted = useClientMounted();
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept");
  const qParam = searchParams.get("q")?.trim() ?? "";
  const sortParam = searchParams.get("sort")?.trim() ?? "NEWEST";
  const brandParam = searchParams.get("brand")?.trim() ?? "";

  const [localQ, setLocalQ] = useState(qParam);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    setLocalQ(qParam);
  }, [qParam]);

  useEffect(() => {
    setPage(1);
  }, [deptParam, qParam, sortParam, brandParam]);

  const brandId = useMemo(() => {
    const n = parseInt(brandParam, 10);
    return Number.isNaN(n) ? null : n;
  }, [brandParam]);

  const filters = useMemo(() => {
    const f: {
      status: string;
      parentCategory?: string;
      brand?: number;
    } = {
      status: "ACTIVE",
    };
    if (deptParam && deptParam !== "ALL") {
      f.parentCategory = deptParam;
    }
    if (brandId != null) {
      f.brand = brandId;
    }
    return f;
  }, [deptParam, brandId]);

  const search = qParam.length > 0 ? qParam : null;
  const sort =
    sortParam === "PRICE_ASC" || sortParam === "PRICE_DESC"
      ? sortParam
      : "NEWEST";

  const { data: brandsData } = useQuery(POPULAR_BRANDS, {
    variables: { top: 16 },
    skip: !mounted,
  });
  const popularBrands = (brandsData?.popularBrands ?? []) as {
    id: number;
    name: string;
  }[];

  const { data, loading, error, refetch } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted,
    variables: {
      pageCount: pageSize,
      pageNumber: page,
      filters,
      search,
      sort,
    },
  });

  const rows = (data?.allProducts ?? []) as MarketplaceProductRow[];

  const baseHrefOpts = {
    q: qParam,
    dept: deptParam,
    sort: sortParam,
    brand: brandParam || null,
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-[22px] font-bold text-prel-label">Discover</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Browse live listings — filter by department, brand, sort order, or
          keyword.
        </p>
      </div>

      {popularBrands.length > 0 ? (
        <section className="space-y-2">
          <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-prel-secondary-label">
            Popular brands
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {popularBrands.map((b) => {
              const on =
                brandParam === String(b.id) || brandParam === `${b.id}`;
              const href = buildSearchHref({
                ...baseHrefOpts,
                brand: on ? null : String(b.id),
              });
              return (
                <Link
                  key={b.id}
                  href={href}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold shadow-ios ring-1 transition [-webkit-tap-highlight-color:transparent] ${
                    on
                      ? "bg-[var(--prel-primary)] text-white ring-[var(--prel-primary)]"
                      : "bg-white text-prel-label ring-prel-glass-border hover:bg-prel-bg-grouped"
                  }`}
                >
                  {b.name}
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <form className="space-y-3" action="/search" method="get">
        {deptParam ? (
          <input type="hidden" name="dept" value={deptParam} />
        ) : null}
        {sort !== "NEWEST" ? (
          <input type="hidden" name="sort" value={sort} />
        ) : null}
        {brandParam ? (
          <input type="hidden" name="brand" value={brandParam} />
        ) : null}
        <label className="sr-only" htmlFor="mq">
          Search listings
        </label>
        <div className="flex gap-2">
          <input
            id="mq"
            name="q"
            value={localQ}
            onChange={(e) => setLocalQ(e.target.value)}
            placeholder="Search by title…"
            className="min-h-[48px] flex-1 rounded-xl border border-prel-separator bg-white px-4 text-[16px] text-prel-label shadow-ios outline-none ring-0 placeholder:text-prel-tertiary-label focus:border-[var(--prel-primary)]"
          />
          <button
            type="submit"
            className="min-h-[48px] shrink-0 rounded-xl bg-[var(--prel-primary)] px-4 text-[15px] font-semibold text-white shadow-ios"
          >
            Go
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-prel-secondary-label">
          Sort
        </p>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map(({ label, value }) => {
            const on = sort === value;
            const href = buildSearchHref({
              ...baseHrefOpts,
              sort: value,
            });
            return (
              <Link
                key={value}
                href={href}
                className={`inline-flex min-h-[40px] items-center rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-ios ring-1 transition [-webkit-tap-highlight-color:transparent] ${
                  on
                    ? "bg-[var(--prel-primary)] text-white ring-[var(--prel-primary)]"
                    : "bg-white text-prel-label ring-prel-glass-border hover:bg-prel-bg-grouped"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {brandParam ? (
        <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[14px] text-prel-secondary-label">
            Brand filter active
          </p>
          <Link
            href={buildSearchHref({ ...baseHrefOpts, brand: null })}
            className="text-[14px] font-semibold text-[var(--prel-primary)]"
          >
            Clear brand
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {DEPT_CHIPS.map(({ label, value }) => {
          const href = buildSearchHref({
            q: qParam,
            dept: value,
            sort: sortParam,
            brand: brandParam || null,
          });
          const on =
            (value == null && !deptParam) ||
            (value != null && deptParam === value);
          return (
            <Link
              key={label}
              href={href}
              className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-ios ring-1 transition [-webkit-tap-highlight-color:transparent] active:opacity-90 sm:px-4 ${
                on
                  ? "bg-[var(--prel-primary)] text-white ring-[var(--prel-primary)]"
                  : "bg-white text-prel-label ring-prel-glass-border hover:bg-prel-bg-grouped"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-prel-secondary-label">
          {!mounted || loading
            ? "Loading…"
            : `${rows.length} listing${rows.length === 1 ? "" : "s"} on this page`}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-[14px] font-semibold text-[var(--prel-primary)]"
        >
          Refresh
        </button>
      </div>

      {error ? (
        <p className="rounded-xl bg-red-500/10 p-4 text-[14px] text-prel-error">
          {error.message}
        </p>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {rows.map((p) => (
          <MarketplaceProductCard key={p.id} p={p} />
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-2">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={rows.length < pageSize || loading}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function MarketplaceSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pb-10 text-[15px] text-prel-secondary-label">
          Loading search…
        </div>
      }
    >
      <SearchInner />
    </Suspense>
  );
}
