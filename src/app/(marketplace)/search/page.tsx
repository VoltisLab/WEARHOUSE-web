"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MARKETPLACE_FEED } from "@/graphql/queries/marketplace";
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

function SearchInner() {
  const mounted = useClientMounted();
  const searchParams = useSearchParams();
  const deptParam = searchParams.get("dept");
  const qParam = searchParams.get("q")?.trim() ?? "";

  const [localQ, setLocalQ] = useState(qParam);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    setLocalQ(qParam);
  }, [qParam]);

  useEffect(() => {
    setPage(1);
  }, [deptParam, qParam]);

  const filters = useMemo(() => {
    const f: { status: string; parentCategory?: string } = {
      status: "ACTIVE",
    };
    if (deptParam && deptParam !== "ALL") {
      f.parentCategory = deptParam;
    }
    return f;
  }, [deptParam]);

  const search = qParam.length > 0 ? qParam : null;

  const { data, loading, error, refetch } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted,
    variables: {
      pageCount: pageSize,
      pageNumber: page,
      filters,
      search,
    },
  });

  const rows = (data?.allProducts ?? []) as MarketplaceProductRow[];

  return (
    <div className="space-y-6 pb-8">
      <form className="space-y-3" action="/search" method="get">
        {deptParam ? (
          <input type="hidden" name="dept" value={deptParam} />
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

      <div className="flex flex-wrap gap-2">
        {DEPT_CHIPS.map(({ label, value }) => {
          const href =
            value == null
              ? qParam
                ? `/search?q=${encodeURIComponent(qParam)}`
                : "/search"
              : qParam
                ? `/search?dept=${value}&q=${encodeURIComponent(qParam)}`
                : `/search?dept=${value}`;
          const on =
            (value == null && !deptParam) ||
            (value != null && deptParam === value);
          return (
            <Link
              key={label}
              href={href}
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-ios ring-1 transition ${
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

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
