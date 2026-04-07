"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  MARKETPLACE_FEED,
  POPULAR_BRANDS,
  RECENTLY_VIEWED_PRODUCTS,
} from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { DiscoverFeed } from "@/components/marketplace/DiscoverFeed";
import { useAuth } from "@/contexts/AuthContext";
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

type BrowseHrefCtx = {
  browse: string | null;
  q: string;
  dept: string | null;
  sort: string;
  brand: string | null;
  style: string | null;
  sale: string | null;
  maxPrice: string | null;
  recent: string | null;
};

function buildBrowseHref(opts: BrowseHrefCtx): string {
  const p = new URLSearchParams();
  const browse = opts.browse ?? null;
  if (browse === "1") p.set("browse", "1");
  if (opts.q?.trim()) p.set("q", opts.q.trim());
  if (opts.dept && opts.dept !== "ALL") p.set("dept", opts.dept);
  if (opts.sort && opts.sort !== "NEWEST") p.set("sort", opts.sort);
  if (opts.brand?.trim()) p.set("brand", opts.brand.trim());
  if (opts.style?.trim()) p.set("style", opts.style.trim());
  if (opts.sale === "1") p.set("sale", "1");
  if (opts.maxPrice != null && opts.maxPrice !== "")
    p.set("maxPrice", opts.maxPrice);
  if (opts.recent === "1") p.set("recent", "1");
  const s = p.toString();
  return s ? `/search?${s}` : "/search";
}

function useIsDiscoverHome(): boolean {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const brand = searchParams.get("brand")?.trim() ?? "";
  const dept = searchParams.get("dept");
  const sort = searchParams.get("sort")?.trim() ?? "NEWEST";
  const style = searchParams.get("style")?.trim() ?? "";
  const browse = searchParams.get("browse");
  const sale = searchParams.get("sale");
  const maxPrice = searchParams.get("maxPrice");
  const recent = searchParams.get("recent");
  if (browse === "1") return false;
  if (q.length > 0) return false;
  if (brand.length > 0) return false;
  if (style.length > 0) return false;
  if (sale === "1") return false;
  if (maxPrice != null && maxPrice !== "") return false;
  if (recent === "1") return false;
  if (dept != null && dept !== "" && dept !== "ALL") return false;
  if (sort !== "NEWEST") return false;
  return true;
}

function DiscoverBrowseInner() {
  const mounted = useClientMounted();
  const searchParams = useSearchParams();
  const { userToken } = useAuth();

  const browseParam = searchParams.get("browse");
  const deptParam = searchParams.get("dept");
  const qParam = searchParams.get("q")?.trim() ?? "";
  const sortParam = searchParams.get("sort")?.trim() ?? "NEWEST";
  const brandParam = searchParams.get("brand")?.trim() ?? "";
  const styleParam = searchParams.get("style")?.trim() ?? "";
  const saleParam = searchParams.get("sale");
  const maxPriceParam = searchParams.get("maxPrice");
  const recentParam = searchParams.get("recent");

  const isRecentMode = recentParam === "1";

  const [localQ, setLocalQ] = useState(qParam);
  const [page, setPage] = useState(1);
  const pageSize = 30;

  useEffect(() => {
    setLocalQ(qParam);
  }, [qParam]);

  useEffect(() => {
    setPage(1);
  }, [
    deptParam,
    qParam,
    sortParam,
    brandParam,
    styleParam,
    saleParam,
    maxPriceParam,
    recentParam,
    browseParam,
  ]);

  const brandId = useMemo(() => {
    const n = parseInt(brandParam, 10);
    return Number.isNaN(n) ? null : n;
  }, [brandParam]);

  const filters = useMemo(() => {
    const f: {
      status: string;
      parentCategory?: string;
      brand?: number;
      style?: string;
      discountPrice?: boolean;
      maxPrice?: number;
    } = {
      status: "ACTIVE",
    };
    if (deptParam && deptParam !== "ALL") {
      f.parentCategory = deptParam;
    }
    if (brandId != null) {
      f.brand = brandId;
    }
    if (styleParam) {
      f.style = styleParam;
    }
    if (saleParam === "1") {
      f.discountPrice = true;
    }
    if (maxPriceParam != null && maxPriceParam !== "") {
      const n = parseFloat(maxPriceParam);
      if (!Number.isNaN(n)) f.maxPrice = n;
    }
    return f;
  }, [deptParam, brandId, styleParam, saleParam, maxPriceParam]);

  const search = qParam.length > 0 ? qParam : null;
  const sort =
    sortParam === "PRICE_ASC" || sortParam === "PRICE_DESC"
      ? sortParam
      : "NEWEST";

  const ctxBase: BrowseHrefCtx = {
    browse: browseParam === "1" ? "1" : null,
    q: qParam,
    dept: deptParam,
    sort: sortParam,
    brand: brandParam || null,
    style: styleParam || null,
    sale: saleParam === "1" ? "1" : null,
    maxPrice: maxPriceParam,
    recent: recentParam === "1" ? "1" : null,
  };

  const { data: brandsData } = useQuery(POPULAR_BRANDS, {
    variables: { top: 16 },
    skip: !mounted,
  });
  const popularBrands = (brandsData?.popularBrands ?? []) as {
    id: number;
    name: string;
  }[];

  const {
    data: feedData,
    loading: feedLoading,
    error: feedError,
    refetch: refetchFeed,
  } = useQuery(MARKETPLACE_FEED, {
    skip: !mounted || isRecentMode,
    variables: {
      pageCount: pageSize,
      pageNumber: page,
      filters,
      search,
      sort,
    },
  });

  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
    refetch: refetchRecent,
  } = useQuery(RECENTLY_VIEWED_PRODUCTS, {
    skip: !mounted || !isRecentMode || !userToken,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const allRecentRows = (recentData?.recentlyViewedProducts ??
    []) as MarketplaceProductRow[];
  const recentVisible = useMemo(
    () => allRecentRows.filter((p) => p.status !== "SOLD"),
    [allRecentRows],
  );
  const recentPageRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return recentVisible.slice(start, start + pageSize);
  }, [recentVisible, page, pageSize]);

  const feedRows = (feedData?.allProducts ?? []) as MarketplaceProductRow[];
  const rows = isRecentMode ? recentPageRows : feedRows;
  const loading = isRecentMode ? recentLoading : feedLoading;
  const error = isRecentMode ? recentError : feedError;
  const refetch = isRecentMode ? refetchRecent : refetchFeed;

  const browseTitle = useMemo(() => {
    if (isRecentMode) return "Recently viewed";
    if (saleParam === "1") return "On sale";
    if (maxPriceParam === "15") return "Shop bargains";
    if (styleParam) return "Shop by style";
    if (browseParam === "1" && !deptParam && !qParam && !brandParam)
      return "Shop all";
    return "Browse";
  }, [
    isRecentMode,
    saleParam,
    maxPriceParam,
    styleParam,
    browseParam,
    deptParam,
    qParam,
    brandParam,
  ]);

  if (isRecentMode && !userToken) {
    return (
      <div className="space-y-4 pb-10">
        <Link
          href="/search"
          className="text-[14px] font-semibold text-[var(--prel-primary)]"
        >
          ← Discover
        </Link>
        <p className="text-[15px] text-prel-secondary-label">
          Sign in to see items you&apos;ve recently viewed.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <Link
        href="/search"
        className="inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
      >
        ← Discover
      </Link>

      <div>
        <h1 className="text-[22px] font-bold text-prel-label">{browseTitle}</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Filters apply server-side. Open any card for the full listing.
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
              const href = buildBrowseHref({
                ...ctxBase,
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
        {browseParam === "1" ? (
          <input type="hidden" name="browse" value="1" />
        ) : null}
        {deptParam ? <input type="hidden" name="dept" value={deptParam} /> : null}
        {sort !== "NEWEST" ? (
          <input type="hidden" name="sort" value={sort} />
        ) : null}
        {brandParam ? (
          <input type="hidden" name="brand" value={brandParam} />
        ) : null}
        {styleParam ? (
          <input type="hidden" name="style" value={styleParam} />
        ) : null}
        {saleParam === "1" ? (
          <input type="hidden" name="sale" value="1" />
        ) : null}
        {maxPriceParam ? (
          <input type="hidden" name="maxPrice" value={maxPriceParam} />
        ) : null}
        {recentParam === "1" ? (
          <input type="hidden" name="recent" value="1" />
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
            const href = buildBrowseHref({
              ...ctxBase,
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
            href={buildBrowseHref({ ...ctxBase, brand: null })}
            className="text-[14px] font-semibold text-[var(--prel-primary)]"
          >
            Clear brand
          </Link>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {DEPT_CHIPS.map(({ label, value }) => {
          const href = buildBrowseHref({
            ...ctxBase,
            dept: value,
          });
          const on =
            (value == null && (!deptParam || deptParam === "ALL")) ||
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
          disabled={
            loading ||
            (isRecentMode
              ? page * pageSize >= recentVisible.length
              : rows.length < pageSize)
          }
          onClick={() => setPage((p) => p + 1)}
          className="rounded-full bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios ring-1 ring-prel-glass-border disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function SearchRouter() {
  const discoverHome = useIsDiscoverHome();
  if (discoverHome) {
    return <DiscoverFeed />;
  }
  return <DiscoverBrowseInner />;
}

export default function MarketplaceSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="pb-10 text-[15px] text-prel-secondary-label">
          Loading…
        </div>
      }
    >
      <SearchRouter />
    </Suspense>
  );
}
