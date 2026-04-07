"use client";

import { NetworkStatus, useQuery } from "@apollo/client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LIKED_PRODUCTS } from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { BRAND_NAME } from "@/lib/branding";
import { safeReturnPath } from "@/lib/safe-return-path";
import { useAuth } from "@/contexts/AuthContext";
import { useClientMounted } from "@/lib/use-client-mounted";

const PAGE_SIZE = 20;

function filterListed(rows: MarketplaceProductRow[]) {
  return rows.filter((p) => p.status !== "SOLD");
}

function edgesToRows(
  edges: { product?: MarketplaceProductRow | null }[] | undefined,
): MarketplaceProductRow[] {
  if (!edges?.length) return [];
  return filterListed(
    edges
      .map((e) => e.product)
      .filter((p): p is MarketplaceProductRow => p != null),
  );
}

export function FavouritesPageContent() {
  const mounted = useClientMounted();
  const { userToken, ready } = useAuth();
  const [searchQ, setSearchQ] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const { data, error, fetchMore, networkStatus } = useQuery(LIKED_PRODUCTS, {
    skip: !mounted || !ready || !userToken,
    variables: { pageCount: PAGE_SIZE, pageNumber: 1 },
    notifyOnNetworkStatusChange: true,
  });

  const loadingInitial = networkStatus === NetworkStatus.loading;
  const loadingMore = networkStatus === NetworkStatus.fetchMore;

  const allRows = useMemo(
    () => edgesToRows(data?.likedProducts as { product?: MarketplaceProductRow | null }[]),
    [data?.likedProducts],
  );

  useEffect(() => {
    pageRef.current = 1;
    setHasMore(true);
  }, [userToken]);

  useEffect(() => {
    if (!data?.likedProducts || loadingInitial) return;
    const n = (data.likedProducts as { product?: unknown }[]).length;
    if (n < PAGE_SIZE) setHasMore(false);
  }, [data?.likedProducts, loadingInitial]);

  const loadMore = useCallback(() => {
    if (!userToken || loadingMore || !hasMore) return;
    const nextPage = pageRef.current + 1;
    fetchMore({
      variables: { pageCount: PAGE_SIZE, pageNumber: nextPage },
      updateQuery: (prev, { fetchMoreResult }) => {
        const more = fetchMoreResult?.likedProducts as
          | { product?: MarketplaceProductRow | null }[]
          | undefined;
        if (!more?.length) {
          setHasMore(false);
          return prev;
        }
        if (more.length < PAGE_SIZE) setHasMore(false);

        const prevEdges = (prev.likedProducts ?? []) as {
          product?: MarketplaceProductRow | null;
        }[];
        const seen = new Set(
          prevEdges.map((e) => e.product?.id).filter((id): id is number => id != null),
        );
        const merged = [...prevEdges];
        for (const e of more) {
          const id = e.product?.id;
          if (id != null && !seen.has(id)) {
            seen.add(id);
            merged.push(e);
          }
        }
        return { ...prev, likedProducts: merged };
      },
    })
      .then(() => {
        pageRef.current = nextPage;
      })
      .catch(() => {
        setHasMore(false);
      });
  }, [userToken, loadingMore, hasMore, fetchMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !mounted || !userToken || !hasMore) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { root: null, rootMargin: "200px 0px", threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, mounted, userToken, hasMore, allRows.length]);

  const visibleRows = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter((p) => (p.name ?? "").toLowerCase().includes(q));
  }, [allRows, searchQ]);

  const loginHref = `/login?next=${encodeURIComponent(safeReturnPath("/saved") ?? "/saved")}`;

  if (!mounted || !ready) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 pb-10 md:pb-12">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-prel-bg-grouped" />
        <div className="h-12 animate-pulse rounded-2xl bg-prel-bg-grouped" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
            >
              <div className="aspect-[3/4] animate-pulse bg-prel-bg-grouped" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!userToken) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 pb-10 md:pb-12">
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
          <h1 className="text-[22px] font-bold text-prel-label">Favourites</h1>
          <p className="text-[15px] leading-relaxed text-prel-secondary-label">
            Sign in to see items you&apos;ve liked. Your favourites sync with your{" "}
            {BRAND_NAME} account — same as the app.
          </p>
          <Link
            href={loginHref}
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-10 md:max-w-4xl md:pb-12">
      <h1 className="text-[22px] font-bold text-prel-label">Favourites</h1>

      <label className="sr-only" htmlFor="favourites-search">
        Search favourites
      </label>
      <input
        id="favourites-search"
        type="search"
        value={searchQ}
        onChange={(e) => setSearchQ(e.target.value)}
        placeholder="Search favourites"
        className="min-h-[48px] w-full rounded-2xl border border-prel-separator bg-white px-4 text-[16px] text-prel-label shadow-ios outline-none placeholder:text-prel-tertiary-label focus:border-[var(--prel-primary)]/40 focus:ring-2 focus:ring-[var(--prel-primary)]/20"
        enterKeyHint="search"
      />

      {error ? (
        <p className="rounded-xl bg-red-500/10 p-4 text-[14px] text-prel-error">
          {error.message}
        </p>
      ) : null}

      {loadingInitial && !data ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
            >
              <div className="aspect-[3/4] animate-pulse bg-prel-bg-grouped" />
            </div>
          ))}
        </div>
      ) : null}

      {!loadingInitial && allRows.length === 0 ? (
        <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[16px] font-medium text-prel-label">
            No favourites yet
          </p>
          <p className="mt-2 text-[14px] text-prel-secondary-label">
            Items you save as favourites will appear here.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
          >
            Discover listings
          </Link>
        </div>
      ) : null}

      {allRows.length > 0 && visibleRows.length === 0 && searchQ.trim() ? (
        <p className="py-8 text-center text-[15px] text-prel-secondary-label">
          No results for &quot;{searchQ.trim()}&quot;
        </p>
      ) : null}

      {visibleRows.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
            {visibleRows.map((p) => (
              <MarketplaceProductCard key={p.id} p={{ ...p, userLiked: true }} />
            ))}
          </div>
          {hasMore ? (
            <div ref={sentinelRef} className="h-4 w-full" aria-hidden />
          ) : null}
          {loadingMore ? (
            <p className="text-center text-[13px] text-prel-secondary-label">
              Loading more…
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
