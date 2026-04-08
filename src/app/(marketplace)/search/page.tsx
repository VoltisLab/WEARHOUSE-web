"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { DiscoverFeed } from "@/components/marketplace/DiscoverFeed";
import { MarketplaceShopBrowse } from "@/components/marketplace/MarketplaceShopBrowse";

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
  const featured = searchParams.get("featured");
  if (browse === "1") return false;
  if (featured === "1") return false;
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

function SearchRouter() {
  const discoverHome = useIsDiscoverHome();
  if (discoverHome) {
    return <DiscoverFeed />;
  }
  return <MarketplaceShopBrowse />;
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
