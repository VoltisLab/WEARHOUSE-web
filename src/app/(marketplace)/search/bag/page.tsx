"use client";

import Link from "next/link";
import { useShopAllBag } from "@/contexts/ShopAllBagContext";
import {
  ShopAllBagCheckoutForm,
  ShopAllBagLineList,
} from "@/components/marketplace/ShopAllBagCheckoutForm";
import type { MarketplaceProductRow } from "@/components/marketplace/ProductCard";
import { formatMoney } from "@/lib/format";
import { productPriceDisplay } from "@/lib/product-display";

function subtotal(items: MarketplaceProductRow[]) {
  return items.reduce((sum, p) => {
    const { sale } = productPriceDisplay(
      Number(p.price ?? 0),
      p.discountPrice != null && p.discountPrice !== ""
        ? Number(p.discountPrice)
        : null,
    );
    return sum + sale;
  }, 0);
}

export default function ShopAllBagPage() {
  const { items, hydrated } = useShopAllBag();

  if (!hydrated) {
    return (
      <div className="pb-10 text-[15px] text-prel-secondary-label">Loading…</div>
    );
  }

  const total = subtotal(items);

  return (
    <div className="space-y-6 pb-[calc(7rem+var(--prel-vv-bottom-inset,0px))]">
      <Link
        href="/search?browse=1&tryCart=1"
        className="inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
      >
        ← Try Cart shop all
      </Link>

      <div>
        <h1 className="text-[22px] font-bold text-prel-label">Shopping bag</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Items from multiple sellers share one delivery address. The API creates
          one order per seller (Try Cart) with matching postage rows, same as
          the iOS app.
        </p>
      </div>

      <ShopAllBagLineList items={items} />

      {items.length > 0 ? (
        <>
          <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-ios ring-1 ring-prel-glass-border">
            <span className="text-[16px] font-bold text-prel-label">Total</span>
            <span className="text-[18px] font-black text-[var(--prel-primary)]">
              {formatMoney(total)}
            </span>
          </div>
          <ShopAllBagCheckoutForm items={items} />
        </>
      ) : null}
    </div>
  );
}
