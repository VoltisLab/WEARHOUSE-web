"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { STAFF_PRODUCT } from "@/graphql/queries/admin";
import { FLAG_PRODUCT } from "@/graphql/mutations/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney, formatRelativeShort } from "@/lib/format";
import { publicItemUrl, publicWebHostname } from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";
import { normalizeProductImageUrls } from "@/lib/product-images";
import {
  formatProductCondition,
  productColorCss,
  productPriceDisplay,
  sizeDisplayValue,
  uniqueHashtagsInText,
} from "@/lib/product-display";

function Divider() {
  return <div className="h-px w-full bg-prel-separator" />;
}

function ColorSwatch({ name }: { name: string }) {
  const css = productColorCss(name);
  const isGrad = css?.includes("gradient");
  return (
    <span
      className="inline-block h-[18px] w-[18px] shrink-0 rounded-full ring-1 ring-prel-separator"
      style={
        css
          ? isGrad
            ? { backgroundImage: css, backgroundSize: "cover" }
            : { backgroundColor: css }
          : { backgroundColor: "var(--prel-glass-bg)" }
      }
      aria-hidden
    />
  );
}

function hashtagsFromField(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
  }
  return [];
}

function formatParcelSize(raw: string | null | undefined): string {
  if (!raw?.trim()) return "-";
  return raw.replace(/_/g, " ");
}

type SellerShape = {
  username?: string | null;
  displayName?: string | null;
  profilePictureUrl?: string | null;
  thumbnailUrl?: string | null;
  isVerified?: boolean | null;
  reviewStats?: { noOfReviews?: number | null; rating?: number | null } | null;
};

export default function StaffProductDetailPage() {
  const params = useParams();
  const productId = parseInt(String(params.productId), 10);

  const { data, loading, error } = useQuery(STAFF_PRODUCT, {
    variables: { id: productId },
    skip: Number.isNaN(productId),
  });
  const [flagProduct, { loading: flagging }] = useMutation(FLAG_PRODUCT);
  const [flagOpen, setFlagOpen] = useState(false);
  const [reason, setReason] = useState("SPAM");
  const [flagType, setFlagType] = useState("HIDDEN");
  const [notes, setNotes] = useState("");
  const [flagMsg, setFlagMsg] = useState<string | null>(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [bioOpen, setBioOpen] = useState(false);

  const p = data?.product;

  useEffect(() => {
    setImgIdx(0);
  }, [productId]);

  async function submitFlag() {
    setFlagMsg(null);
    const { data: d } = await flagProduct({
      variables: {
        id: String(productId),
        reason,
        flagType,
        notes: notes.trim() || null,
      },
    });
    const ok = d?.flagProduct?.success;
    setFlagMsg(d?.flagProduct?.message ?? (ok ? "Queued." : "Failed."));
    if (ok) setFlagOpen(false);
  }

  const imgs = useMemo(() => normalizeProductImageUrls(p?.imagesUrl), [p?.imagesUrl]);

  if (Number.isNaN(productId)) {
    return <p className="text-prel-error">Invalid product id</p>;
  }
  if (loading) {
    return <p className="text-prel-secondary-label">Loading…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }
  if (!p) {
    return <p className="text-prel-secondary-label">Product not found.</p>;
  }

  const priceNum = Number(p.price);
  const discNum =
    p.discountPrice != null && p.discountPrice !== ""
      ? Number(p.discountPrice)
      : 0;
  const { sale, original, percentOff } = productPriceDisplay(priceNum, discNum);

  const brandName =
    (p.brand as { name?: string } | null)?.name?.trim() ||
    (p.customBrand as string | null)?.trim() ||
    null;
  const sizeName = (p.size as { name?: string } | null)?.name ?? null;
  const categoryName = (p.category as { name?: string } | null)?.name ?? null;
  const materials = Array.isArray(p.materials)
    ? (p.materials as { name?: string }[])
        .map((m) => m.name)
        .filter(Boolean)
        .join(", ")
    : "";
  const colors = Array.isArray(p.color) ? (p.color as string[]) : [];
  const stylesList = Array.isArray(p.styles)
    ? (p.styles as string[]).filter(Boolean)
    : p.style
      ? [String(p.style)]
      : [];

  const desc = String(p.description ?? "");
  const tagFromDesc = uniqueHashtagsInText(desc);
  const tagFromField = hashtagsFromField(p.hashtags);
  const allTags = [...new Set([...tagFromField, ...tagFromDesc])];

  const seller = p.seller as SellerShape | null | undefined;
  const sellerPic = seller?.profilePictureUrl ?? seller?.thumbnailUrl;
  const reviewCount = seller?.reviewStats?.noOfReviews ?? 0;

  const statusUp = String(p.status ?? "").toUpperCase();
  const isSold = statusUp === "SOLD";

  const safeIdx = imgs.length ? Math.min(imgIdx, imgs.length - 1) : 0;
  const mainSrc = imgs[safeIdx];

  return (
    <div className="mx-auto max-w-lg pb-8">
      <div
        className="relative w-full overflow-hidden bg-prel-card"
        style={{
          aspectRatio: "585 / 826",
          maxHeight: "65vh",
        }}
      >
        {imgs.length > 0 ? (
          <SafeImage
            src={mainSrc}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full min-h-[220px] items-center justify-center bg-prel-glass text-prel-secondary-label">
            No images
          </div>
        )}

        {p.isFeatured && (
          <span className="absolute left-3 top-3 rounded-lg bg-black/55 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Featured
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-3 pb-3">
          {imgs.length > 1 && (
            <div className="pointer-events-auto flex flex-1 justify-center gap-1.5">
              {imgs.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setImgIdx(i)}
                  className={`rounded-full transition-all ${
                    i === safeIdx
                      ? "h-[7px] w-[7px] bg-[var(--prel-primary)]"
                      : "h-[5px] w-[5px] bg-black"
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
          <div
            className={`pointer-events-auto rounded-full bg-black/45 px-3 py-1.5 text-[13px] font-medium text-white ${imgs.length > 1 ? "ml-2 shrink-0" : "ml-auto"}`}
          >
            ♥ {p.likes ?? 0}
            {p.userLiked ? " · You" : ""}
          </div>
        </div>
      </div>

      {imgs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-3 py-2">
          {imgs.map((url, i) => (
            <button
              key={`${url}-${i}`}
              type="button"
              onClick={() => setImgIdx(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-ios-lg ring-2 ${
                i === safeIdx ? "ring-[var(--prel-primary)]" : "ring-prel-glass-border"
              }`}
            >
              <SafeImage src={url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="space-y-0 bg-prel-bg px-4 pb-2 pt-5">
        <h1 className="text-[17px] font-semibold leading-snug text-prel-label">
          {p.name}
        </h1>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            {brandName && (
              <span className="prel-text-accent text-[15px] font-medium">
                {brandName}
              </span>
            )}
          </div>
          {sizeName && (
            <span className="prel-text-accent shrink-0 text-[15px] font-medium">
              {sizeDisplayValue(sizeName)}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] text-prel-secondary-label">
              {formatProductCondition(p.condition as string)}
            </span>
            {isSold && <span className="prel-sold-badge">Sold</span>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {original != null && percentOff != null ? (
              <>
                <span className="text-[17px] font-semibold text-prel-secondary-label line-through">
                  {formatMoney(original)}
                </span>
                <span className="text-[17px] font-semibold text-prel-label">
                  {formatMoney(sale)}
                </span>
                <span className="prel-discount-badge">{percentOff}%</span>
              </>
            ) : (
              <span className="text-[17px] font-semibold text-prel-label">
                {formatMoney(sale)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-3">
          {colors.length === 0 ? (
            <span className="text-[15px] text-prel-secondary-label">-</span>
          ) : (
            colors.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-[15px] text-prel-label">
                <ColorSwatch name={c} />
                {c}
              </span>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Link
            href={staffPath(`/users/${encodeURIComponent(String(seller?.username ?? ""))}`)}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--prel-primary)] ring-1 ring-prel-glass-border">
              {sellerPic ? (
                <SafeImage src={sellerPic} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[14px] font-bold text-white">
                  {(seller?.username ?? "?").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-prel-label">
                @{seller?.username}
                {seller?.isVerified ? (
                  <span className="ml-1 text-[12px] font-semibold text-green-500">
                    ✓
                  </span>
                ) : null}
              </p>
              <p className="text-[12px] text-prel-secondary-label">
                ★★★★★ ({reviewCount})
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-prel-bg">
        <div className="px-4 py-3">
          {desc ? (
            desc.length > 280 && !bioOpen ? (
              <>
                <p className="whitespace-pre-wrap text-[15px] text-prel-label">
                  {desc.slice(0, 280)}…
                </p>
                <button
                  type="button"
                  onClick={() => setBioOpen(true)}
                  className="prel-text-accent mt-2 text-[14px] font-semibold"
                >
                  Read more
                </button>
              </>
            ) : (
              <p className="whitespace-pre-wrap text-[15px] text-prel-label">{desc}</p>
            )
          ) : (
            <p className="text-prel-secondary-label">-</p>
          )}
        </div>
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pb-4">
            {allTags.map((t) => (
              <span key={t} className="prel-hashtag-chip">
                {t.startsWith("#") ? t : `#${t}`}
              </span>
            ))}
          </div>
        )}
        <Divider />
      </div>

      <div className="bg-prel-bg pb-4">
        {[
          { label: "Category", value: categoryName ?? "-" },
          {
            label: "Materials",
            value: materials || "-",
          },
          {
            label: "Style",
            value: stylesList.length ? stylesList.join(", ") : "-",
          },
          {
            label: "Size",
            value: sizeName ? sizeDisplayValue(sizeName) : "-",
          },
          {
            label: "Condition",
            value: formatProductCondition(p.condition as string),
          },
          { label: "Views", value: String(p.views ?? 0) },
          { label: "Likes", value: String(p.likes ?? 0) },
          {
            label: "Uploaded",
            value: formatRelativeShort(String(p.createdAt ?? "")),
          },
          {
            label: "Updated",
            value: formatRelativeShort(String(p.updatedAt ?? "")),
          },
          {
            label: "Postage",
            value: formatParcelSize(p.parcelSize as string),
          },
          { label: "Listing code", value: String(p.listingCode ?? "-") },
          { label: "Product id", value: String(p.id) },
        ].map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <span className="text-[17px] font-semibold text-prel-label">
                {row.label}
              </span>
              <span className="max-w-[55%] text-right text-[15px] text-prel-label">
                {row.value}
              </span>
            </div>
            <Divider />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-3 px-1">
        <div className="flex flex-wrap gap-2">
          <a
            href={publicItemUrl(p.listingCode as string | null, productId)}
            target="_blank"
            rel="noreferrer"
            className="prel-btn-primary inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold"
          >
            Open on {publicWebHostname()}
          </a>
          <button
            type="button"
            onClick={() => {
              setFlagOpen(true);
              setFlagMsg(null);
            }}
            className="inline-flex min-h-[44px] items-center justify-center rounded-[10px] bg-prel-error/15 px-4 text-[15px] font-semibold text-prel-error"
          >
            Flag listing…
          </button>
          <Link
            href={staffPath("/products")}
            className="prel-btn-ghost inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold"
          >
            ← Listings
          </Link>
        </div>

        {flagOpen && (
          <GlassCard>
            <p className="mb-3 text-[15px] font-semibold text-prel-label">
              Flag product
            </p>
            <label className="mb-1 block text-[12px] text-prel-secondary-label">
              Reason
            </label>
            <select
              className="mb-3 w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-2 text-prel-label"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="SPAM">Spam</option>
              <option value="INAPPROPRIATE_CONTENT">Inappropriate</option>
              <option value="COPYRIGHT_INFRINGEMENT">Copyright</option>
              <option value="COMMUNITY_GUIDELINES">Community</option>
              <option value="OTHER">Other</option>
            </select>
            <label className="mb-1 block text-[12px] text-prel-secondary-label">
              Action
            </label>
            <select
              className="mb-3 w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-2 text-prel-label"
              value={flagType}
              onChange={(e) => setFlagType(e.target.value)}
            >
              <option value="HIDDEN">Hide</option>
              <option value="REMOVED">Remove</option>
              <option value="FLAGGED">Flag</option>
            </select>
            <textarea
              className="mb-3 w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-2 text-prel-label"
              rows={3}
              placeholder="Optional notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            {flagMsg && (
              <p className="mb-2 text-[13px] text-prel-secondary-label">{flagMsg}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={flagging}
                onClick={submitFlag}
                className="prel-btn-danger flex-1 rounded-[10px] py-2.5 text-[15px] font-semibold disabled:opacity-40"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setFlagOpen(false)}
                className="prel-btn-secondary rounded-[10px] px-4 py-2.5 text-[15px] font-semibold"
              >
                Cancel
              </button>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
