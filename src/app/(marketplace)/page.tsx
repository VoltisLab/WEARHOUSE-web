"use client";

import { NetworkStatus, useQuery } from "@apollo/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { MARKETPLACE_FEED } from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { HomeDepopHero } from "@/components/marketplace/HomeDepopHero";
import { HomePopularThisWeek } from "@/components/marketplace/HomePopularThisWeek";
import { HomePromoCarousel } from "@/components/marketplace/HomePromoCarousel";
import { useAuth } from "@/contexts/AuthContext";
import { useClientMounted } from "@/lib/use-client-mounted";

/** Matches Swift `HomeViewModel.pageSize` (20). */
const HOME_PAGE_SIZE = 20;

/** Logged-out home: one request, max this many products (browse more after sign-in). */
const GUEST_HOME_CAP = 30;

/** Logged-out: how many of the cap appear in the horizontal “Latest” strip; rest go in the grid below. */
const GUEST_LATEST_STRIP = 12;

/** Latest strip (signed-in): first page of newest only. */
const LATEST_PAGE_SIZE = 30;

/** Category chips → GraphQL `ProductFiltersInput.parentCategory` (web search uses Girls/Boys, not combined Kids). */
const CATEGORY_CHIPS: {
  label: string;
  value: "All" | "Women" | "Men" | "Girls" | "Boys" | "Toddlers";
}[] = [
  { label: "All", value: "All" },
  { label: "Women", value: "Women" },
  { label: "Men", value: "Men" },
  { label: "Girls", value: "Girls" },
  { label: "Boys", value: "Boys" },
  { label: "Toddlers", value: "Toddlers" },
];

const SORT_OPTIONS: { label: string; value: "NEWEST" | "PRICE_ASC" | "PRICE_DESC" }[] = [
  { label: "Newest", value: "NEWEST" },
  { label: "Price ↑", value: "PRICE_ASC" },
  { label: "Price ↓", value: "PRICE_DESC" },
];

function parentCategoryFilter(
  category: (typeof CATEGORY_CHIPS)[number]["value"],
): { status: "ACTIVE"; parentCategory?: string } {
  const f: { status: "ACTIVE"; parentCategory?: string } = { status: "ACTIVE" };
  if (category === "All") return f;
  const map: Record<string, string> = {
    Women: "WOMEN",
    Men: "MEN",
    Girls: "GIRLS",
    Boys: "BOYS",
    Toddlers: "TODDLERS",
  };
  const gql = map[category];
  if (gql) f.parentCategory = gql;
  return f;
}

function filterListed(rows: MarketplaceProductRow[]) {
  return rows.filter((p) => p.status !== "SOLD");
}

export default function MarketplaceHomePage() {
  const mounted = useClientMounted();
  const { userToken, ready: authReady } = useAuth();
  const isLoggedIn = authReady && !!userToken;
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] =
    useState<(typeof CATEGORY_CHIPS)[number]["value"]>("All");
  const [sort, setSort] = useState<"NEWEST" | "PRICE_ASC" | "PRICE_DESC">("NEWEST");
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null);
  const filters = useMemo(() => parentCategoryFilter(category), [category]);
  const search = appliedSearch?.trim() ? appliedSearch.trim() : null;

  const latestVars = useMemo(
    () => ({
      pageCount: LATEST_PAGE_SIZE,
      pageNumber: 1,
      filters,
      search,
      sort: "NEWEST" as const,
    }),
    [filters, search],
  );

  const feedVars = useMemo(
    () => ({
      pageCount: isLoggedIn ? HOME_PAGE_SIZE : GUEST_HOME_CAP,
      pageNumber: 1,
      filters,
      search,
      sort,
    }),
    [filters, search, sort, isLoggedIn],
  );

  const { data: latestData, error: latestError } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted || !isLoggedIn,
    variables: latestVars,
  });

  const { data, error, fetchMore, networkStatus } = useQuery(
    MARKETPLACE_FEED,
    {
      skip: !mounted,
      variables: feedVars,
      notifyOnNetworkStatusChange: true,
    },
  );

  const loadingInitial = networkStatus === NetworkStatus.loading;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  const mergedMain = useMemo(() => {
    const raw = (data?.allProducts ?? []) as MarketplaceProductRow[];
    return filterListed(raw);
  }, [data?.allProducts]);

  const latestRows = useMemo(() => {
    if (!isLoggedIn) {
      return mergedMain.slice(0, Math.min(GUEST_LATEST_STRIP, mergedMain.length));
    }
    return filterListed((latestData?.allProducts ?? []) as MarketplaceProductRow[]);
  }, [isLoggedIn, mergedMain, latestData?.allProducts]);

  const latestIds = useMemo(
    () => new Set(latestRows.map((p) => p.id)),
    [latestRows],
  );

  /**
   * Signed-in + NEWEST: hide rail IDs from the grid so the top 30 only appear in “Latest arrivals”.
   * Guest: one capped fetch — strip is first N rows, grid is the remainder (no duplicate cards).
   * Other sorts (signed-in): no dedupe vs rail.
   */
  const gridRows = useMemo(() => {
    if (!isLoggedIn) {
      return mergedMain.slice(latestRows.length);
    }
    if (sort !== "NEWEST") return mergedMain;
    const deduped = mergedMain.filter((p) => !latestIds.has(p.id));
    if (deduped.length > 0) return deduped;
    return mergedMain;
  }, [isLoggedIn, mergedMain, latestRows.length, latestIds, sort]);

  useEffect(() => {
    pageRef.current = 1;
    setHasMore(true);
  }, [filters, search, sort, isLoggedIn]);

  useEffect(() => {
    if (!mounted || loadingInitial) return;
    const batch = (data?.allProducts ?? []) as MarketplaceProductRow[];
    if (pageRef.current === 1) {
      if (!isLoggedIn) setHasMore(false);
      else setHasMore(batch.length >= HOME_PAGE_SIZE);
    }
  }, [mounted, loadingInitial, data?.allProducts, isLoggedIn]);

  const loadMore = useCallback(() => {
    if (!isLoggedIn || !hasMore || loadingMore) return;
    const nextPage = pageRef.current + 1;
    fetchMore({
      variables: {
        ...feedVars,
        pageNumber: nextPage,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.allProducts?.length) return prev;
        const prevList = (prev.allProducts ?? []) as MarketplaceProductRow[];
        const more = fetchMoreResult.allProducts as MarketplaceProductRow[];
        const seen = new Set(prevList.map((p) => p.id));
        const merged = [...prevList];
        for (const p of more) {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            merged.push(p);
          }
        }
        return { ...prev, allProducts: merged };
      },
    })
      .then((res) => {
        const more = (res.data?.allProducts ?? []) as MarketplaceProductRow[];
        /**
         * Apollo `fetchMore` returns only this page's `allProducts`, not the merged cache.
         * `hasMore` must mirror Swift: `products.count >= pageSize` for the page just fetched.
         */
        setHasMore(more.length >= HOME_PAGE_SIZE);
        pageRef.current = nextPage;
      })
      .catch(() => {
        /* keep hasMore true so intersection observer / user can retry */
      });
  }, [fetchMore, feedVars, hasMore, loadingMore, isLoggedIn]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !mounted) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) loadMore();
      },
      { root: null, rootMargin: "240px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, mounted]);

  /** When sort is NEWEST and page 1 is still all inside “latest 30”, fetch more until the grid gains rows. */
  useEffect(() => {
    if (!isLoggedIn) return;
    if (sort !== "NEWEST") return;
    if (!mounted || loadingInitial || loadingMore || !hasMore) return;
    const deduped = mergedMain.filter((p) => !latestIds.has(p.id));
    if (mergedMain.length > 0 && deduped.length === 0) loadMore();
  }, [
    sort,
    mounted,
    loadingInitial,
    loadingMore,
    hasMore,
    mergedMain,
    latestIds,
    loadMore,
    isLoggedIn,
  ]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(draftSearch.trim() || null);
  };

  const clearSearch = () => {
    setDraftSearch("");
    setAppliedSearch(null);
  };

  const showInitialSkeleton = (!mounted || loadingInitial) && !data;

  return (
    <div className="pb-6">
      <HomeDepopHero />

      <HomePopularThisWeek />
      <HomePromoCarousel />

      <div className="mx-auto max-w-7xl space-y-10 px-3 pb-6 pt-6 sm:px-5 sm:pt-8 md:px-6 lg:px-8">
      <form
        onSubmit={onSearchSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-[1.125rem] w-[1.125rem] -translate-y-1/2 text-neutral-400"
            aria-hidden
          />
          <input
            type="search"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Filter listings on this page…"
            className="h-12 w-full rounded-full border border-neutral-200 bg-white pl-11 pr-4 text-[15px] text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/25"
            enterKeyHint="search"
          />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="submit"
            className="h-12 rounded-full bg-black px-6 text-[14px] font-bold text-white transition hover:bg-neutral-800"
          >
            Apply
          </button>
          {appliedSearch ? (
            <button
              type="button"
              onClick={clearSearch}
              className="h-12 rounded-full border border-neutral-200 bg-white px-4 text-[14px] font-bold text-neutral-800"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      <section className="space-y-3">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          Filter feed by category
        </h3>
        <div className="-mx-1 flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className={`rounded-full px-4 py-2.5 text-[14px] font-bold transition ring-1 ${
                category === value
                  ? "bg-black text-white ring-black"
                  : "bg-white text-neutral-800 ring-black/[0.08] hover:bg-neutral-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          Sort
        </h3>
        <div className="flex flex-wrap gap-2">
          {SORT_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value)}
              className={`rounded-full px-4 py-2 text-[13px] font-bold ring-1 transition ${
                sort === value
                  ? "bg-black text-white ring-black"
                  : "bg-white text-neutral-800 ring-black/[0.08] hover:bg-neutral-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {(error || latestError) && (
        <p className="rounded-xl bg-red-500/10 p-4 text-[14px] text-prel-error">
          {(error ?? latestError)!.message}
        </p>
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-[1.5rem] font-black tracking-tight text-neutral-900 sm:text-[1.65rem]">
            Latest arrivals
          </h2>
          <span className="text-[12px] text-prel-tertiary-label">
            {isLoggedIn
              ? `Newest ${Math.min(LATEST_PAGE_SIZE, latestRows.length)} listings`
              : `Preview · ${latestRows.length} of ${mergedMain.length} shown`}
          </span>
        </div>
        {showInitialSkeleton ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[42vw] max-w-[180px] shrink-0 overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
              >
                <div className="aspect-[3/4] animate-pulse bg-prel-bg-grouped" />
              </div>
            ))}
          </div>
        ) : latestRows.length === 0 && mergedMain.length === 0 ? (
          <p className="text-[14px] text-prel-secondary-label">
            No listings match this filter yet.
          </p>
        ) : latestRows.length === 0 ? null : (
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0 [scrollbar-width:thin]">
            {latestRows.map((p) => (
              <div
                key={p.id}
                className="w-[42vw] max-w-[180px] shrink-0 sm:w-44 sm:max-w-none"
              >
                <MarketplaceProductCard p={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-[1.5rem] font-black tracking-tight text-neutral-900 sm:text-[1.65rem]">
            All listings
          </h2>
          <p className="text-[13px] font-medium text-neutral-500">
            {isLoggedIn ? (
              <>Scroll down to load more.</>
            ) : (
              <>
                Showing up to {GUEST_HOME_CAP} listings.{" "}
                <Link
                  href="/login"
                  className="font-bold text-[var(--prel-primary)] underline-offset-2 hover:underline"
                >
                  Sign in
                </Link>{" "}
                for the full feed.
              </>
            )}
          </p>
        </div>

        {showInitialSkeleton ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
          {gridRows.map((p) => (
            <MarketplaceProductCard key={p.id} p={p} />
          ))}
        </div>

        <div ref={sentinelRef} className="h-4 w-full" aria-hidden />

        {loadingMore ? (
          <p className="text-center text-[13px] text-prel-secondary-label">
            Loading more listings…
          </p>
        ) : null}

        {!isLoggedIn && mergedMain.length >= GUEST_HOME_CAP ? (
          <div className="rounded-2xl border border-prel-separator bg-prel-bg-grouped/80 p-5 text-center shadow-ios ring-1 ring-prel-glass-border">
            <p className="text-[15px] font-semibold text-prel-label">
              Want the full marketplace?
            </p>
            <p className="mt-1 text-[14px] text-prel-secondary-label">
              You&apos;ve reached the guest preview limit ({GUEST_HOME_CAP} listings).
              Sign in to keep scrolling the full catalogue.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                href="/login"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-prel-separator bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : null}

        {isLoggedIn && !hasMore && gridRows.length > 0 ? (
          <p className="text-center text-[13px] text-prel-tertiary-label">
            You&apos;re up to date — no more listings to load for this filter.
          </p>
        ) : null}

        {!loadingInitial && data && gridRows.length === 0 && latestRows.length === 0 ? (
          <p className="text-center text-[15px] text-prel-secondary-label">
            Nothing to show. Try another category or clear search.
          </p>
        ) : null}

        {isLoggedIn && hasMore && gridRows.length > 0 ? (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={() => loadMore()}
              disabled={loadingMore}
              className="min-h-[48px] rounded-full bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Load more"}
            </button>
          </div>
        ) : null}
      </section>
      </div>
    </div>
  );
}
