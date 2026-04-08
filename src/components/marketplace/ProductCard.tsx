"use client";

import Link from "next/link";
import { ProductLikeButton } from "@/components/marketplace/ProductLikeButton";
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
    id?: number | null;
    username?: string | null;
    displayName?: string | null;
    thumbnailUrl?: string | null;
  } | null;
  brand?: { id?: number | null; name?: string | null } | null;
  category?: { name?: string | null } | null;
  likes?: number | null;
  userLiked?: boolean | null;
  isFeatured?: boolean | null;
};

export type MarketplaceProductCardTryCartProps = {
  enabled: boolean;
  inBag: boolean;
  onToggle: () => void;
};

export function MarketplaceProductCard({
  p,
  tryCart,
}: {
  p: MarketplaceProductRow;
  tryCart?: MarketplaceProductCardTryCartProps;
}) {
  const href = `/product/${p.id}`;
  const img = firstProductImageUrl(p.imagesUrl);
  const conditionLabel = formatProductCondition(p.condition);
  const { sale, original } = productPriceDisplay(
    Number(p.price ?? 0),
    p.discountPrice != null && p.discountPrice !== ""
      ? Number(p.discountPrice)
      : null,
  );
  const likeCount = Math.max(0, Math.floor(Number(p.likes ?? 0)));
  const liked = p.userLiked === true;

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border transition hover:ring-[var(--prel-primary)]/40">
      <div className="relative aspect-[3/4] overflow-hidden bg-prel-bg-grouped">
        {p.isFeatured ? (
          <span className="absolute left-2 top-2 z-[5] rounded-md bg-[var(--prel-primary)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Featured
          </span>
        ) : null}
        <Link href={href} className="relative block h-full w-full">
          <SafeImage
            src={img}
            alt=""
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-[#1f0a24]/75 via-[#3d1450]/25 to-transparent"
            aria-hidden
          />
          {p.status === "SOLD" ? (
            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Sold
            </span>
          ) : null}
        </Link>
        <ProductLikeButton
          productId={p.id}
          initialLiked={liked}
          initialLikes={likeCount}
          compact
          className="absolute bottom-2 right-2 z-[6] px-2.5 py-1.5"
        />
        {tryCart?.enabled && p.status !== "SOLD" ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              tryCart.onToggle();
            }}
            className={`absolute left-2 top-2 z-[7] min-h-[36px] rounded-full px-3.5 text-[12px] font-medium shadow-md ring-1 transition [-webkit-tap-highlight-color:transparent] ${
              tryCart.inBag
                ? "bg-[var(--prel-primary)] text-white ring-[var(--prel-primary)]"
                : "bg-white/95 text-neutral-900 ring-black/10 hover:bg-white"
            }`}
          >
            {tryCart.inBag ? "In bag" : "Add to bag"}
          </button>
        ) : null}
      </div>
      <Link href={href} className="block space-y-1 p-3">
        {p.brand?.name?.trim() ? (
          <p className="line-clamp-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--prel-primary)]">
            {p.brand.name.trim()}
          </p>
        ) : null}
        <p className="line-clamp-2 text-[14px] font-semibold leading-snug text-prel-label">
          {p.name ?? "Listing"}
        </p>
        {conditionLabel !== "-" ? (
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
      </Link>
    </article>
  );
}
