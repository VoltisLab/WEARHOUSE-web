"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { safeReturnPath } from "@/lib/safe-return-path";
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
import {
  DISCOVER_BANNER_LOOKBOOKS_IMAGE_URL,
  DISCOVER_BANNER_STYLE_IMAGE_URL,
  DISCOVER_BANNER_TRY_CART_IMAGE_URL,
} from "@/lib/constants";
import { useClientMounted } from "@/lib/use-client-mounted";

const FEED_PAGE = 50;
const RAIL_WIDTH = "w-[10.5rem] shrink-0 sm:w-44";

/** Matches Swift `DiscoverView` `shopByStyle` default exploration. */
const SHOP_BY_STYLE_PARAM = "CASUAL";

/** Full-width or tile promo: photo fills the card with a dark gradient overlay + copy. */
function DiscoverBannerCard({
  href,
  imageUrl,
  title,
  subtitle,
  badge,
  variant = "wide",
  imageObjectClass = "object-cover object-[center_35%]",
}: {
  href: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  badge?: string;
  variant?: "wide" | "tile";
  imageObjectClass?: string;
}) {
  return (
    <Link
      href={href}
      className="relative block overflow-hidden rounded-2xl shadow-ios ring-1 ring-black/10 [-webkit-tap-highlight-color:transparent] active:opacity-[0.98]"
    >
      <div
        className={
          variant === "wide"
            ? "relative isolate min-h-[220px] w-full sm:min-h-[260px]"
            : "relative isolate min-h-[270px] w-full sm:min-h-[300px]"
        }
      >
        <SafeImage
          src={imageUrl}
          alt=""
          className={`absolute inset-0 h-full w-full ${imageObjectClass}`}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/48 to-black/22"
          aria-hidden
        />
        {badge ? (
          <span className="absolute right-3 top-3 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
        <div className="absolute inset-0 z-10 flex flex-col justify-between px-3 py-3 sm:px-4 sm:py-4">
          <div aria-hidden className="min-h-[18px]" />
          <div className="flex flex-1 flex-col items-center justify-center px-1">
            <span
              className={`text-center font-bold leading-tight tracking-tight text-white drop-shadow-md ${
                variant === "wide"
                  ? "text-[20px] sm:text-[24px]"
                  : "text-[15px] sm:text-[16px]"
              }`}
            >
              {title}
            </span>
          </div>
          {subtitle ? (
            <p className="text-center text-[11px] font-medium leading-snug text-white/90 drop-shadow sm:text-[12px]">
              {subtitle}
            </p>
          ) : (
            <div aria-hidden className="h-2 sm:h-3" />
          )}
        </div>
      </div>
    </Link>
  );
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
  const { userToken, ready } = useAuth();
  const seeAllResolvedHref = useMemo(() => {
    if (!ready || userToken) return seeAllHref;
    const next = safeReturnPath(seeAllHref) ?? "/search";
    return `/login?next=${encodeURIComponent(next)}`;
  }, [ready, userToken, seeAllHref]);

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
          href={seeAllResolvedHref}
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

  const { data: featuredData, refetch: refetchFeatured } = useQuery(
    MARKETPLACE_FEED,
    {
      skip: !mounted,
      variables: {
        pageCount: 24,
        pageNumber: 1,
        search: null as string | null,
        sort: "NEWEST" as const,
        filters: { status: "ACTIVE", isFeatured: true },
      },
    },
  );

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

  const featuredRows = useMemo(() => {
    const raw = (featuredData?.allProducts ?? []) as MarketplaceProductRow[];
    return raw.filter((p) => p.status !== "SOLD" && p.isFeatured === true);
  }, [featuredData?.allProducts]);

  const recentRows = (recentData?.recentlyViewedProducts ??
    []) as MarketplaceProductRow[];
  const recentSorted = useMemo(() => {
    const vis = recentRows.filter((p) => p.status !== "SOLD");
    return vis.slice(0, 10);
  }, [recentRows]);

  const sectionModel = useMemo(() => {
    const used = new Set<number>();
    for (const p of recentSorted) used.add(p.id);
    for (const p of featuredRows) used.add(p.id);

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
    featuredRows,
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
      refetchFeatured(),
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
            aria-label="Favourites"
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
              Looking for a person?{" "}
              <Link
                href="/search/members"
                className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
              >
                Search members
              </Link>
              . This field searches listings.
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

          <ProductRailSection
            title="Featured"
            subtitle="Hand-picked highlights from the catalogue"
            seeAllHref="/search?browse=1&featured=1"
            rows={featuredRows}
          />

          <DiscoverBannerCard
            href="/search?browse=1&tryCart=1"
            imageUrl={DISCOVER_BANNER_TRY_CART_IMAGE_URL}
            title="Try Cart"
            subtitle="Shop all listings — same catalogue as the app"
            badge="Beta"
            variant="wide"
            imageObjectClass="object-cover object-[center_30%]"
          />

          <section className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border">
            <div className="divide-y divide-black/[0.06]">
              <div className="flex items-center gap-2 px-4 pb-2.5 pt-3.5">
                <LayoutGrid
                  className="h-[18px] w-[18px] text-[var(--prel-primary)]"
                  strokeWidth={2.25}
                />
                <h2 className="text-[16px] font-bold text-[var(--prel-primary)]">
                  Shop categories
                </h2>
              </div>
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
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <DiscoverBannerCard
              href={`/search?style=${SHOP_BY_STYLE_PARAM}`}
              imageUrl={DISCOVER_BANNER_STYLE_IMAGE_URL}
              title="Shop by style"
              variant="tile"
              imageObjectClass="object-cover object-[center_40%]"
            />
            <DiscoverBannerCard
              href="/app"
              imageUrl={DISCOVER_BANNER_LOOKBOOKS_IMAGE_URL}
              title="Lookbooks"
              subtitle="Open in app"
              variant="tile"
              imageObjectClass="object-cover object-[center_55%]"
            />
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
              <div className="flex gap-4 overflow-x-auto pb-1 pl-1 pr-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden">
                {sectionModel.topShops.map((s) => (
                  <Link
                    key={s.username}
                    href={`/profile/${encodeURIComponent(s.username)}`}
                    className="group flex w-[42vw] max-w-[200px] shrink-0 flex-col [-webkit-tap-highlight-color:transparent] sm:w-44 sm:max-w-none"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100 shadow-sm ring-1 ring-black/[0.06] transition group-hover:shadow-md">
                      {s.thumb ? (
                        <SafeImage
                          src={s.thumb}
                          alt=""
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-[var(--prel-primary)] text-[2.25rem] font-bold text-white sm:text-[2.5rem]">
                          {s.username.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <span className="mt-3 line-clamp-1 w-full text-center text-[14px] font-medium leading-snug text-neutral-900 sm:text-[15px]">
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
