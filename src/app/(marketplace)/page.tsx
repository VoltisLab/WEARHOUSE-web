"use client";

import { NetworkStatus, useQuery } from "@apollo/client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { MARKETPLACE_FEED } from "@/graphql/queries/marketplace";
import { VIEW_ME } from "@/graphql/queries/admin";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { HomeDepopHero } from "@/components/marketplace/HomeDepopHero";
import { HomePopularThisWeek } from "@/components/marketplace/HomePopularThisWeek";
import { HomePromoCarousel } from "@/components/marketplace/HomePromoCarousel";
import { useAuth } from "@/contexts/AuthContext";
import {
  MARKETPLACE_TEST_USERNAMES,
  sortListingRowsStableRandom,
} from "@/lib/listing-shuffle";
import { useClientMounted } from "@/lib/use-client-mounted";

/** Logged-out home: one request, max this many products (browse more after sign-in). */
const GUEST_HOME_CAP = 30;

/** Max product cards on the home feed before showing “Shop all” (`/shop`). */
const HOME_SHOP_ALL_CAP = GUEST_HOME_CAP;

/** Logged-out: how many of the cap appear in the horizontal “Latest” strip; rest go in the grid below. */
const GUEST_LATEST_STRIP = 12;

/** Latest strip (signed-in): first page of newest only. */
const LATEST_PAGE_SIZE = 30;

/**
 * Same order as Swift `HomeView.categories` — horizontal pills under search, no separate “Filter/Sort” row
 * (home feed has no sort UI; `HomeViewModel` only passes parentCategory + search).
 */
const CATEGORY_CHIPS: {
  label: string;
  value: "All" | "Women" | "Men" | "Boys" | "Girls" | "Toddlers";
}[] = [
  { label: "All", value: "All" },
  { label: "Women", value: "Women" },
  { label: "Men", value: "Men" },
  { label: "Boys", value: "Boys" },
  { label: "Girls", value: "Girls" },
  { label: "Toddlers", value: "Toddlers" },
];

const HOME_FEED_SORT = "NEWEST" as const;

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

  const { data: meData, loading: meLoading } = useQuery(VIEW_ME, {
    skip: !authReady || !userToken,
  });
  const meUsername =
    meData?.viewMe?.username?.trim().toLowerCase() ?? "";
  /** Only after profile loads — avoids treating everyone as non-test during fetch. */
  const isDefinitelyTestUser =
    !!userToken &&
    !meLoading &&
    MARKETPLACE_TEST_USERNAMES.includes(meUsername);
  const [category, setCategory] =
    useState<(typeof CATEGORY_CHIPS)[number]["value"]>("All");
  const [draftSearch, setDraftSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState<string | null>(null);
  const [listingShuffleSeed, setListingShuffleSeed] = useState(() =>
    Math.floor(Math.random() * 0x7fffffff),
  );
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
      pageCount: isLoggedIn ? HOME_SHOP_ALL_CAP : GUEST_HOME_CAP,
      pageNumber: 1,
      filters,
      search,
      sort: HOME_FEED_SORT,
    }),
    [filters, search, isLoggedIn],
  );

  const { data: latestData, error: latestError } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted || !isLoggedIn,
    variables: latestVars,
  });

  const { data, error, networkStatus } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted,
    variables: feedVars,
  });

  const loadingInitial = networkStatus === NetworkStatus.loading;

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
   * Signed-in: hide rail IDs from the grid so the top 30 only appear in “Latest arrivals”.
   * Guest: one capped fetch — strip is first N rows, grid is the remainder (no duplicate cards).
   */
  const gridRows = useMemo(() => {
    if (!isLoggedIn) {
      return mergedMain.slice(latestRows.length);
    }
    const deduped = mergedMain.filter((p) => !latestIds.has(p.id));
    if (deduped.length > 0) return deduped;
    return mergedMain;
  }, [isLoggedIn, mergedMain, latestRows.length, latestIds]);

  const displayGridRows = useMemo(() => {
    if (isDefinitelyTestUser) return gridRows;
    return sortListingRowsStableRandom(gridRows, listingShuffleSeed);
  }, [gridRows, isDefinitelyTestUser, listingShuffleSeed]);

  const gridCap = Math.max(0, HOME_SHOP_ALL_CAP - latestRows.length);
  const homeGridRows = useMemo(
    () => displayGridRows.slice(0, gridCap),
    [displayGridRows, gridCap],
  );
  const productsShownCount = latestRows.length + homeGridRows.length;
  const showShopAll = productsShownCount >= HOME_SHOP_ALL_CAP;

  useEffect(() => {
    setListingShuffleSeed(Math.floor(Math.random() * 0x7fffffff));
  }, [category, appliedSearch, isLoggedIn]);

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
            className="h-12 rounded-full bg-[var(--prel-primary)] px-6 text-[14px] font-medium text-white shadow-sm transition hover:brightness-110"
          >
            Apply
          </button>
          {appliedSearch ? (
            <button
              type="button"
              onClick={clearSearch}
              className="h-12 rounded-full border border-neutral-200 bg-white px-4 text-[14px] font-medium text-neutral-800"
            >
              Clear
            </button>
          ) : null}
        </div>
      </form>

      {/* Swift `HomeView.categoryFiltersSection` — horizontal pills only; no home-level Sort sheet */}
      <section className="-mx-3 sm:-mx-5 md:-mx-6" aria-label="Category">
        <div className="overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max items-stretch gap-2 px-3 sm:px-5 md:px-6">
            {CATEGORY_CHIPS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setCategory(value)}
                className={`flex min-h-[44px] shrink-0 items-center rounded-full border px-4 text-[14px] font-medium leading-none transition [-webkit-tap-highlight-color:transparent] ${
                  category === value
                    ? "border-[var(--prel-primary)] bg-[var(--prel-primary)] text-white"
                    : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
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

      {showShopAll && gridCap === 0 ? (
        <div className="flex justify-center pt-2">
          <Link
            href="/shop"
            className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[16px] font-semibold text-white shadow-ios transition hover:brightness-110 sm:w-auto"
          >
            Shop all
          </Link>
        </div>
      ) : null}

      {gridCap > 0 ? (
        <section className="space-y-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[1.5rem] font-black tracking-tight text-neutral-900 sm:text-[1.65rem]">
              All listings
            </h2>
            <p className="text-[13px] font-medium text-neutral-500">
              {isLoggedIn ? (
                <>
                  Showing up to {HOME_SHOP_ALL_CAP} on the home feed. Use{" "}
                  <span className="text-neutral-700">Shop all</span> below for the
                  full catalogue.
                </>
              ) : (
                <>
                  Showing up to {GUEST_HOME_CAP} listings.{" "}
                  <Link
                    href="/login"
                    className="font-medium text-[var(--prel-primary)] underline-offset-2 hover:underline"
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
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
              {homeGridRows.map((p) => (
                <MarketplaceProductCard key={p.id} p={p} />
              ))}
            </div>
          )}

          {showShopAll ? (
            <div className="flex justify-center pt-2">
              <Link
                href="/shop"
                className="inline-flex min-h-[52px] w-full max-w-md items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[16px] font-semibold text-white shadow-ios transition hover:brightness-110 sm:w-auto"
              >
                Shop all
              </Link>
            </div>
          ) : null}
        </section>
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

      {!loadingInitial && data && gridRows.length === 0 && latestRows.length === 0 ? (
        <p className="text-center text-[15px] text-prel-secondary-label">
          Nothing to show. Try another category or clear search.
        </p>
      ) : null}
      </div>
    </div>
  );
}
