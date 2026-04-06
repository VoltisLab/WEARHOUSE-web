"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { MARKETPLACE_PRODUCT } from "@/graphql/queries/marketplace";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import {
  formatProductCondition,
  humanizeEnumLabel,
  productPriceDisplay,
  sizeDisplayValue,
} from "@/lib/product-display";
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

  const { sale, original } = productPriceDisplay(
    Number(p.price ?? 0),
    p.discountPrice != null && String(p.discountPrice) !== ""
      ? Number(p.discountPrice)
      : null,
  );

  const metaRows: { label: string; value: string }[] = [];
  if (p.category?.name?.trim())
    metaRows.push({ label: "Category", value: p.category.name.trim() });
  if (p.size?.name?.trim()) {
    const sz = sizeDisplayValue(p.size.name);
    if (sz && sz !== "—") metaRows.push({ label: "Size", value: sz });
  }
  if (p.brand?.name?.trim())
    metaRows.push({ label: "Brand", value: p.brand.name.trim() });
  if (p.condition) {
    const cond = formatProductCondition(String(p.condition));
    if (cond && cond !== "—") metaRows.push({ label: "Condition", value: cond });
  }
  if (p.style?.trim()) {
    const st = humanizeEnumLabel(p.style.trim());
    if (st && st !== "—") metaRows.push({ label: "Style", value: st });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 pb-10 sm:space-y-6 md:space-y-8">
      <Link
        href="/search"
        className="inline-block min-h-[44px] py-2 text-[15px] font-semibold text-[var(--prel-primary)] [-webkit-tap-highlight-color:transparent]"
      >
        ← Browse
      </Link>

      <div className="md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start md:gap-6 lg:gap-10 xl:gap-12">
        <div className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border md:sticky md:top-[4.75rem] lg:top-24">
          <div className="relative aspect-square w-full bg-prel-bg-grouped md:aspect-[4/5] lg:aspect-square">
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

        <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6 md:mt-0">
          <div className="space-y-3">
            <h1 className="text-[22px] font-bold leading-tight text-prel-label sm:text-[24px] md:text-[26px] lg:text-[28px]">
              {p.name}
            </h1>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <p className="text-[24px] font-bold text-[var(--prel-primary)] sm:text-[26px] md:text-[28px]">
                {formatMoney(sale)}
              </p>
              {original != null ? (
                <p className="text-[17px] font-semibold text-prel-secondary-label line-through">
                  {formatMoney(original)}
                </p>
              ) : null}
            </div>
            {metaRows.length > 0 ? (
              <dl className="mt-1 space-y-2 rounded-xl bg-white/80 px-4 py-3 shadow-ios ring-1 ring-prel-glass-border sm:px-4 sm:py-3.5">
                {metaRows.map(({ label, value }) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-prel-tertiary-label">
                      {label}
                    </dt>
                    <dd className="text-[15px] font-medium leading-snug text-prel-label">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>

          <a
            href={publicItemUrl(p.listingCode, p.id)}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-[52px] w-full items-center justify-center rounded-2xl bg-[var(--prel-primary)] text-[16px] font-semibold text-white shadow-ios [-webkit-tap-highlight-color:transparent] active:opacity-95 md:max-w-md"
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
