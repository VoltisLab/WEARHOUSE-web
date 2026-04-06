"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MARKETPLACE_PRODUCT } from "@/graphql/queries/marketplace";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import { normalizeProductImageUrls } from "@/lib/product-images";
import { publicItemUrl, publicWebHostname } from "@/lib/constants";
import { useClientMounted } from "@/lib/use-client-mounted";

export default function MarketplaceProductPage() {
  const mounted = useClientMounted();
  const params = useParams();
  const id = parseInt(String(params.id), 10);
  const { data, loading, error } = useQuery(MARKETPLACE_PRODUCT, {
    variables: { id },
    skip: !mounted || Number.isNaN(id),
  });
  const p = data?.product;
  const urls = useMemo(
    () => (p?.imagesUrl ? normalizeProductImageUrls(p.imagesUrl) : []),
    [p?.imagesUrl],
  );
  const [slide, setSlide] = useState(0);
  const safeSlide = urls.length ? Math.min(slide, urls.length - 1) : 0;

  if (Number.isNaN(id)) {
    return (
      <p className="text-[15px] text-prel-error">Invalid product id.</p>
    );
  }

  if ((!mounted || loading) && !p) {
    return (
      <div className="space-y-4 pb-10">
        <div className="aspect-square animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border" />
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white" />
        <div className="h-6 w-1/3 animate-pulse rounded-lg bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-[15px] text-prel-error">{error.message}</p>
    );
  }

  if (!p) {
    return (
      <div className="space-y-4 pb-10">
        <p className="text-[15px] text-prel-secondary-label">
          This listing could not be loaded.
        </p>
        <Link
          href="/search"
          className="text-[15px] font-semibold text-[var(--prel-primary)]"
        >
          ← Back to browse
        </Link>
      </div>
    );
  }

  const price =
    p.discountPrice != null && String(p.discountPrice) !== ""
      ? p.discountPrice
      : p.price;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-10 lg:space-y-8">
      <Link
        href="/search"
        className="inline-block text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← Browse
      </Link>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border lg:sticky lg:top-24">
          <div className="relative aspect-square bg-prel-bg-grouped md:aspect-[4/5] lg:aspect-square">
            {urls.length > 0 ? (
              <SafeImage
                src={urls[safeSlide]}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[14px] text-prel-tertiary-label">
                No photos
              </div>
            )}
            {p.status === "SOLD" ? (
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase text-white">
                Sold
              </span>
            ) : null}
          </div>
          {urls.length > 1 ? (
            <div className="flex gap-2 overflow-x-auto border-t border-prel-separator p-3">
              {urls.map((u, i) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSlide(i)}
                  className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ${
                    i === safeSlide
                      ? "ring-[var(--prel-primary)]"
                      : "ring-transparent"
                  }`}
                >
                  <SafeImage
                    src={u}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-6 space-y-6 lg:mt-0">
          <div className="space-y-2">
            <h1 className="text-[22px] font-bold leading-tight text-prel-label md:text-[26px] lg:text-[28px]">
              {p.name}
            </h1>
            <p className="text-[24px] font-bold text-[var(--prel-primary)] md:text-[28px]">
              {formatMoney(price)}
            </p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-prel-secondary-label md:text-[14px]">
              {p.category?.name ? <span>{p.category.name}</span> : null}
              {p.size?.name ? <span>{p.size.name}</span> : null}
              {p.brand?.name ? <span>{p.brand.name}</span> : null}
              {p.condition ? <span>{String(p.condition)}</span> : null}
            </div>
          </div>

          <a
            href={publicItemUrl(p.listingCode, p.id)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--prel-primary)] text-[16px] font-semibold text-white shadow-ios lg:max-w-md"
          >
            Open on {publicWebHostname()}
          </a>

          {p.description ? (
            <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border md:p-6">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
                Description
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-prel-label md:text-[16px]">
                {p.description}
              </p>
            </div>
          ) : null}

          {p.seller?.username ? (
            <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border md:p-6">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
                Seller
              </p>
              <Link
                href={`/profile/${encodeURIComponent(p.seller.username)}`}
                className="mt-3 flex items-center gap-3 rounded-xl bg-prel-bg-grouped/80 p-3 ring-1 ring-prel-glass-border transition hover:ring-[var(--prel-primary)]/30"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-prel-separator">
                  <SafeImage
                    src={p.seller.thumbnailUrl ?? ""}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <p className="text-[17px] font-semibold text-prel-label">
                    {p.seller.displayName?.trim() ||
                      `@${p.seller.username}`}
                    {p.seller.isVerified ? (
                      <span className="ml-2 text-[12px] font-bold text-[var(--prel-primary)]">
                        Verified
                      </span>
                    ) : null}
                  </p>
                  <p className="text-[14px] text-[var(--prel-primary)]">
                    View shop & message →
                  </p>
                </div>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
