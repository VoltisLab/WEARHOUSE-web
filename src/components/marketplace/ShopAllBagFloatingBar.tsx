"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useShopAllBag } from "@/contexts/ShopAllBagContext";

/**
 * Swift `shopAllFloatingBar` - primary pill linking to full bag + checkout.
 */
export function ShopAllBagFloatingBar() {
  const { items, formattedTotal, hydrated } = useShopAllBag();

  if (!hydrated) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px)+var(--prel-vv-bottom-inset,0px))] z-[90] flex justify-center px-3 lg:bottom-6">
      <Link
        href="/search/bag"
        className="pointer-events-auto relative flex min-h-[52px] w-[min(100%,24rem)] items-center gap-2 rounded-full bg-[var(--prel-primary)] px-5 py-3 text-[15px] font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-1 ring-black/10 transition hover:brightness-110"
      >
        <ShoppingBag className="h-5 w-5 shrink-0" strokeWidth={2} />
        <span>Shopping bag</span>
        <span className="ml-auto tabular-nums">{formattedTotal}</span>
        {items.length > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-black text-[var(--prel-primary)]">
            {items.length > 99 ? "99+" : items.length}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
