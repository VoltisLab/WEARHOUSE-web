"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import {
  formatProductCondition,
  productPriceDisplay,
} from "@/lib/product-display";
import { firstProductImageUrl } from "@/lib/product-images";

export type MarketplaceProductRow = {
  id: number;
  name?: string | null;
  listingCode?: string | null;
  status?: string | null;
  condition?: string | null;
  price?: number | string | null;
  discountPrice?: number | string | null;
  imagesUrl?: unknown;
  seller?: {
    username?: string | null;
    displayName?: string | null;
    thumbnailUrl?: string | null;
  } | null;
  brand?: { id?: number | null; name?: string | null } | null;
  category?: { name?: string | null } | null;
};

export function MarketplaceProductCard({
  p,
  hideSellerUsername = false,
}: {
  p: MarketplaceProductRow;
  /** Hide @seller on own shop / profile (redundant for the viewer). */
  hideSellerUsername?: boolean;
}) {
  const img = firstProductImageUrl(p.imagesUrl);
  const conditionLabel = formatProductCondition(p.condition);
  const { sale, original } = productPriceDisplay(
    Number(p.price ?? 0),
    p.discountPrice != null && p.discountPrice !== ""
      ? Number(p.discountPrice)
      : null,
  );
  return (
    <Link
      href={`/product/${p.id}`}
      className="group block overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border transition hover:ring-[var(--prel-primary)]/40"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-prel-bg-grouped">
        <SafeImage
          src={img}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        {/* Bottom vignette — Discover-style legibility + depth (matches home banner purple) */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#1f0a24]/75 via-[#3d1450]/25 to-transparent"
          aria-hidden
        />
        {p.status === "SOLD" ? (
          <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            Sold
          </span>
        ) : null}
      </div>
      <div className="space-y-1 p-3">
        {p.brand?.name?.trim() ? (
          <p className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wide text-prel-tertiary-label">
            {p.brand.name.trim()}
          </p>
        ) : null}
        <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-prel-label">
          {p.name ?? "Listing"}
        </p>
        {conditionLabel !== "—" ? (
          <p className="line-clamp-1 text-[12px] text-prel-secondary-label">
            {conditionLabel}
          </p>
        ) : null}
        <p className="text-[15px] font-bold text-[var(--prel-primary)]">
          {original != null ? (
            <>
              <span className="mr-2 text-[13px] font-semibold text-prel-secondary-label line-through">
                {formatMoney(original)}
              </span>
              {formatMoney(sale)}
            </>
          ) : (
            formatMoney(sale)
          )}
        </p>
        {!hideSellerUsername && p.seller?.username ? (
          <p className="text-[12px] text-prel-secondary-label">
            @{p.seller.username}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
