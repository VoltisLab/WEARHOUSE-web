"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronRight, LayoutGrid, Heart, RefreshCw } from "lucide-react";
import {
  MARKETPLACE_FEED,
  POPULAR_BRANDS,
  RECENTLY_VIEWED_PRODUCTS,
  RECOMMENDED_SELLERS,
} from "@/graphql/queries/marketplace";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { useAuth } from "@/contexts/AuthContext";
import { useClientMounted } from "@/lib/use-client-mounted";

const FEED_PAGE = 50;
const RAIL_WIDTH = "w-[10.5rem] shrink-0 sm:w-44";

/** Matches Swift `DiscoverView` `shopByStyle` default exploration. */
const SHOP_BY_STYLE_PARAM = "CASUAL";

function divider() {
  return <div className="h-px bg-prel-separator" />;
}

function ProductRailSection({
  title,
  subtitle,
  seeAllHref,
  rows,
}: {
  title: string;
  subtitle?: string;
  seeAllHref: string;
  rows: MarketplaceProductRow[];
}) {
  if (rows.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-prel-label">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-[13px] text-prel-secondary-label">
              {subtitle}
            </p>
          ) : null}
        </div>
        <Link
          href={seeAllHref}
          className="shrink-0 text-[14px] font-semibold text-[var(--prel-primary)]"
        >
          See all
        </Link>
      </div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {rows.map((p) => (
          <div key={p.id} className={RAIL_WIDTH}>
            <MarketplaceProductCard p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function DiscoverFeed() {
  const mounted = useClientMounted();
  const router = useRouter();
  const { userToken } = useAuth();
  const [listingQ, setListingQ] = useState("");

  const { data: brandsData } = useQuery(POPULAR_BRANDS, {
    variables: { top: 20 },
    skip: !mounted,
  });
  const popularBrands = (brandsData?.popularBrands ?? []) as {
    id: number;
    name: string;
  }[];

  const baseFeedVars = {
    pageCount: FEED_PAGE,
    pageNumber: 1,
    search: null as string | null,
    sort: "NEWEST" as const,
  };

  const { data: mainData, loading: mainLoad, refetch: refetchMain } =
    useQuery(MARKETPLACE_FEED, {
      skip: !mounted,
      variables: {
        ...baseFeedVars,
        filters: { status: "ACTIVE" },
      },
    });

  const { data: onSaleData, refetch: refetchOnSale } = useQuery(
    MARKETPLACE_FEED,
    {
      skip: !mounted,
      variables: {
        ...baseFeedVars,
        filters: { status: "ACTIVE", discountPrice: true },
      },
    },
  );

  const { data: bargainsData, refetch: refetchBargains } = useQuery(
    MARKETPLACE_FEED,
    {
      skip: !mounted,
      variables: {
        ...baseFeedVars,
        filters: { status: "ACTIVE", maxPrice: 15 },
      },
    },
  );

  const { data: recentData, refetch: refetchRecent } = useQuery(
    RECENTLY_VIEWED_PRODUCTS,
    {
      skip: !mounted || !userToken,
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  );

  const { data: recData, refetch: refetchRec } = useQuery(
    RECOMMENDED_SELLERS,
    {
      skip: !mounted,
      variables: { pageCount: 20, pageNumber: 1 },
      errorPolicy: "all",
    },
  );

  const mainRows = (mainData?.allProducts ?? []) as MarketplaceProductRow[];
  const activeMain = useMemo(
    () => mainRows.filter((p) => p.status !== "SOLD"),
    [mainRows],
  );

  const recentRows = (recentData?.recentlyViewedProducts ??
    []) as MarketplaceProductRow[];
  const recentSorted = useMemo(() => {
    const vis = recentRows.filter((p) => p.status !== "SOLD");
    return vis.slice(0, 10);
  }, [recentRows]);

  const sectionModel = useMemo(() => {
    const used = new Set<number>();
    for (const p of recentSorted) used.add(p.id);

    const brandsYouLove: MarketplaceProductRow[] = [];
    const seenBrands = new Set<string>();
    for (const p of activeMain) {
      const b = p.brand?.name?.trim();
      if (b && !seenBrands.has(b) && !used.has(p.id)) {
        seenBrands.add(b);
        brandsYouLove.push(p);
        used.add(p.id);
        if (brandsYouLove.length >= 5) break;
      }
    }
    if (brandsYouLove.length < 5) {
      for (const p of activeMain) {
        if (brandsYouLove.length >= 5) break;
        if (!used.has(p.id)) {
          brandsYouLove.push(p);
          used.add(p.id);
        }
      }
    }

    const recSellers = (recData?.recommendedSellers ?? []) as {
      seller?: {
        username?: string | null;
        displayName?: string | null;
        thumbnailUrl?: string | null;
        profilePictureUrl?: string | null;
      } | null;
    }[];

    let topShops: {
      username: string;
      thumb: string;
    }[] = [];

    if (recSellers.length > 0) {
      topShops = recSellers
        .map((r) => r.seller)
        .filter(Boolean)
        .map((s) => ({
          username: String(s!.username ?? "").trim(),
          thumb:
            s!.thumbnailUrl?.trim() ||
            s!.profilePictureUrl?.trim() ||
            "",
        }))
        .filter((s) => s.username.length > 0)
        .slice(0, 10);
    }

    if (topShops.length === 0) {
      const map = new Map<
        string,
        { username: string; thumb: string }
      >();
      for (const p of activeMain) {
        const u = p.seller?.username?.trim();
        if (!u) continue;
        if (!map.has(u)) {
          map.set(u, {
            username: u,
            thumb: p.seller?.thumbnailUrl?.trim() ?? "",
          });
        }
      }
      topShops = [...map.values()].slice(0, 10);
    }

    const bargainPool = (bargainsData?.allProducts ??
      []) as MarketplaceProductRow[];
    const bargainsVis = bargainPool.filter(
      (p) => p.status !== "SOLD" && !used.has(p.id),
    );
    const shopBargains = bargainsVis.slice(0, 5);
    for (const p of shopBargains) used.add(p.id);

    const salePool = (onSaleData?.allProducts ?? []) as MarketplaceProductRow[];
    const saleVis = salePool.filter(
      (p) => p.status !== "SOLD" && !used.has(p.id),
    );
    const onSale = saleVis.slice(0, 5);

    return {
      brandsYouLove,
      topShops,
      shopBargains,
      onSale,
    };
  }, [
    activeMain,
    recentSorted,
    recData,
    bargainsData,
    onSaleData,
  ]);

  const brandRow1 = popularBrands.slice(0, 10);
  const brandRow2 = popularBrands.slice(10, 20);

  const refreshing =
    mainLoad && activeMain.length === 0 && !mainData;

  async function onRefreshAll() {
    await Promise.all([
      refetchMain(),
      refetchOnSale(),
      refetchBargains(),
      refetchRec(),
      userToken ? refetchRecent() : Promise.resolve(),
    ]);
  }

  function onSubmitListingSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = listingQ.trim();
    if (!q) return;
    router.push(
      `/search?browse=1&q=${encodeURIComponent(q)}`,
    );
  }

  if (!mounted) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold text-prel-label">Discover</h1>
        <div className="flex items-center gap-1">
          <Link
            href="/saved"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-prel-label [-webkit-tap-highlight-color:transparent] hover:bg-black/5"
            aria-label="Saved"
          >
            <Heart className="h-5 w-5" strokeWidth={2} />
          </Link>
          <button
            type="button"
            onClick={() => onRefreshAll()}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-prel-secondary-label [-webkit-tap-highlight-color:transparent] hover:bg-black/5 hover:text-prel-label"
            aria-label="Refresh"
          >
            <RefreshCw
              className={`h-5 w-5 ${mainLoad ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {refreshing ? (
        <div className="space-y-4">
          <div className="h-12 animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border" />
          <div className="h-24 animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
              >
                <div className="aspect-[3/4] animate-pulse bg-prel-bg-grouped" />
                <div className="space-y-2 p-3">
                  <div className="h-3 animate-pulse rounded bg-prel-bg-grouped" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-prel-bg-grouped" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!refreshing ? (
        <>
          <form onSubmit={onSubmitListingSearch} className="space-y-2">
            <label className="sr-only" htmlFor="discover-q">
              Search listings
            </label>
            <input
              id="discover-q"
              value={listingQ}
              onChange={(e) => setListingQ(e.target.value)}
              placeholder="Search listings, brands…"
              className="min-h-[48px] w-full rounded-[1.25rem] border border-prel-separator bg-prel-bg-grouped px-4 text-[16px] text-prel-label shadow-ios outline-none placeholder:text-prel-tertiary-label focus:border-[var(--prel-primary)]"
            />
            <p className="px-1 text-[12px] text-prel-tertiary-label">
              Member search lives in the app — this field searches the catalogue.
            </p>
          </form>

          {(brandRow1.length > 0 || brandRow2.length > 0) ? (
            <div className="space-y-2">
              {brandRow1.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {brandRow1.map((b) => (
                    <Link
                      key={b.id}
                      href={`/search?brand=${b.id}`}
                      className="shrink-0 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[13px] font-medium text-prel-label shadow-sm [-webkit-tap-highlight-color:transparent] hover:bg-prel-bg-grouped"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {brandRow2.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {brandRow2.map((b) => (
                    <Link
                      key={b.id}
                      href={`/search?brand=${b.id}`}
                      className="shrink-0 rounded-full border border-black/10 bg-white px-3.5 py-2 text-[13px] font-medium text-prel-label shadow-sm [-webkit-tap-highlight-color:transparent] hover:bg-prel-bg-grouped"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          <Link
            href="/search?browse=1"
            className="relative block overflow-hidden rounded-2xl shadow-ios ring-1 ring-black/10 [-webkit-tap-highlight-color:transparent]"
          >
            <div className="relative h-[150px] w-full bg-gradient-to-br from-[#2d0a35] via-[#6b1f7a] to-[#ab28b2]">
              <div className="absolute inset-0 bg-black/35" />
              <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold uppercase text-white">
                Beta
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[26px] font-bold tracking-tight text-white">
                  Try Cart
                </span>
              </div>
              <p className="absolute bottom-3 left-0 right-0 text-center text-[12px] font-medium text-white/85">
                Shop all listings — same catalogue as the app
              </p>
            </div>
          </Link>

          <section className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border">
            <div className="flex items-center gap-2 px-4 pb-2 pt-3.5">
              <LayoutGrid
                className="h-[18px] w-[18px] text-[var(--prel-primary)]"
                strokeWidth={2.25}
              />
              <h2 className="text-[16px] font-bold text-[var(--prel-primary)]">
                Shop categories
              </h2>
            </div>
            {divider()}
            <Link
              href="/search?dept=WOMEN"
              className="flex items-center justify-between px-4 py-3.5 text-[15px] text-prel-label [-webkit-tap-highlight-color:transparent] hover:bg-prel-bg-grouped/80"
            >
              Women
              <ChevronRight
                className="h-4 w-4 text-prel-tertiary-label"
                strokeWidth={2}
              />
            </Link>
            {divider()}
            <Link
              href="/search?dept=MEN"
              className="flex items-center justify-between px-4 py-3.5 text-[15px] text-prel-label [-webkit-tap-highlight-color:transparent] hover:bg-prel-bg-grouped/80"
            >
              Men
              <ChevronRight
                className="h-4 w-4 text-prel-tertiary-label"
                strokeWidth={2}
              />
            </Link>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Link
              href={`/search?style=${SHOP_BY_STYLE_PARAM}`}
              className="relative flex min-h-[215px] overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900/90 to-[#5c1a6e] shadow-ios ring-1 ring-white/10 [-webkit-tap-highlight-color:transparent] active:opacity-95"
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative m-auto px-2 text-center text-[16px] font-bold leading-snug text-white">
                Shop by style
              </span>
            </Link>
            <Link
              href="/app"
              className="relative flex min-h-[215px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a3d4a] to-[#0f766e] shadow-ios ring-1 ring-white/10 [-webkit-tap-highlight-color:transparent] active:opacity-95"
            >
              <div className="absolute inset-0 bg-black/40" />
              <span className="relative m-auto px-2 text-center text-[16px] font-bold leading-snug text-white">
                Lookbooks
              </span>
              <span className="absolute bottom-2 left-2 right-2 text-center text-[11px] font-medium text-white/80">
                Open in app
              </span>
            </Link>
          </div>

          {userToken && recentSorted.length > 0 ? (
            <ProductRailSection
              title="Recently viewed"
              seeAllHref="/search?recent=1"
              rows={recentSorted}
            />
          ) : null}

          <ProductRailSection
            title="Brands you love"
            subtitle="Recommended from your favourite brands"
            seeAllHref="/search?browse=1"
            rows={sectionModel.brandsYouLove}
          />

          {sectionModel.topShops.length > 0 ? (
            <section className="space-y-3">
              <div className="px-1">
                <h2 className="text-[17px] font-bold text-prel-label">
                  Top shops
                </h2>
                <p className="mt-0.5 text-[13px] text-prel-secondary-label">
                  Buy from trusted and popular sellers
                </p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-1 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {sectionModel.topShops.map((s) => (
                  <Link
                    key={s.username}
                    href={`/profile/${encodeURIComponent(s.username)}`}
                    className="flex w-[100px] shrink-0 flex-col items-center gap-1.5 [-webkit-tap-highlight-color:transparent]"
                  >
                    <div className="relative h-[100px] w-[100px] overflow-hidden rounded-lg bg-[var(--prel-primary)] ring-1 ring-black/10">
                      {s.thumb ? (
                        <SafeImage
                          src={s.thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[28px] font-bold text-white">
                          {s.username.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="line-clamp-1 w-full text-center text-[12px] text-prel-label">
                      {s.username}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <ProductRailSection
            title="Shop bargains"
            subtitle="Steals under £15"
            seeAllHref="/search?maxPrice=15"
            rows={sectionModel.shopBargains}
          />

          <ProductRailSection
            title="On sale"
            subtitle="Discounted items"
            seeAllHref="/search?sale=1"
            rows={sectionModel.onSale}
          />
        </>
      ) : null}
    </div>
  );
}
