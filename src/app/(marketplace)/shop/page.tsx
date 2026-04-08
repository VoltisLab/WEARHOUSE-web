"use client";

import { Suspense } from "react";
import { MarketplaceShopBrowse } from "@/components/marketplace/MarketplaceShopBrowse";

export default function MarketplaceShopPage() {
  return (
    <Suspense
      fallback={
        <div className="pb-10 text-[15px] text-prel-secondary-label">
          Loading…
        </div>
      }
    >
      <MarketplaceShopBrowse />
    </Suspense>
  );
}
