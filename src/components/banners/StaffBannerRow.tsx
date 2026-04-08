"use client";

import { useMemo, useState } from "react";
import { Calendar, ImageIcon, Layers, User } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { normalizeProductImageUrls } from "@/lib/product-images";
import { formatDateTime } from "@/lib/format";

export type StaffBannerRowData = {
  id: number | string;
  title?: string | null;
  season?: string | null;
  isActive?: boolean | null;
  bannerUrl?: unknown;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: { username?: string | null; displayName?: string | null } | null;
  updatedBy?: { username?: string | null; displayName?: string | null } | null;
};

function rawUrlList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string" && raw.trim()) return [raw];
  return [];
}

/**
 * Single home-banner admin row: accent chrome, status colours, in-app aspect preview, carousel.
 */
export function StaffBannerRow({ banner }: { banner: StaffBannerRowData }) {
  const urls = useMemo(
    () => normalizeProductImageUrls(rawUrlList(banner.bannerUrl)),
    [banner.bannerUrl],
  );
  const [slide, setSlide] = useState(0);
  const safeSlide = urls.length ? Math.min(slide, urls.length - 1) : 0;

  const title = banner.title?.trim() || "Untitled banner";
  const season = banner.season?.trim();
  const active = banner.isActive === true;

  return (
    <article className="overflow-hidden rounded-[14px] bg-prel-card ring-1 ring-prel-glass-border shadow-ios dark:shadow-none">
      {/* Top accent - brand strip */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, var(--prel-primary) 0%, color-mix(in srgb, var(--prel-primary) 55%, var(--prel-metric-users)) 100%)`,
        }}
        aria-hidden
      />

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-bold leading-tight text-prel-label">
                {title}
              </h2>
              {active ? (
                <span className="rounded-full bg-prel-metric-new/22 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-prel-metric-new ring-1 ring-prel-metric-new/40">
                  Active
                </span>
              ) : (
                <span className="rounded-full bg-prel-glass px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-prel-secondary-label ring-1 ring-prel-separator">
                  Inactive
                </span>
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-prel-secondary-label">
              <span className="inline-flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[var(--prel-primary)]" />
                <span className="text-prel-tertiary-label">Style / slot</span>
                <span className="font-medium text-prel-label">
                  {season || "-"}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-prel-metric-views" />
                <span className="text-prel-tertiary-label">Assets</span>
                <span className="font-medium tabular-nums text-prel-label">
                  {urls.length}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Device frame - mimics home carousel container */}
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-prel-tertiary-label">
            In-app preview
          </p>
          <div
            className="rounded-[1.35rem] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black p-2.5 ring-1 ring-white/10 dark:from-neutral-950 dark:via-black dark:to-neutral-950"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.35)" }}
          >
            <div className="overflow-hidden rounded-[1rem] bg-black ring-1 ring-white/5">
              {/* ~ consumer hero ratio: wide strip */}
              <div
                className="relative w-full bg-neutral-950"
                style={{ aspectRatio: "343 / 120" }}
              >
                {urls.length > 0 ? (
                  <SafeImage
                    src={urls[safeSlide]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-prel-tertiary-label">
                    <ImageIcon className="h-8 w-8 opacity-40" />
                    <span className="text-[12px]">No image URLs</span>
                  </div>
                )}
                {urls.length > 1 && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1">
                    {urls.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all ${
                          i === safeSlide
                            ? "w-4 bg-[var(--prel-primary)]"
                            : "w-1.5 bg-white/35"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {urls.length > 0 && (
            <>
              {/* Desktop: every asset visible in a grid (Swift-style full strip, no tiny-only picker). */}
              <div className="mt-3 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {urls.map((url, i) => (
                  <button
                    key={`${url}-${i}`}
                    type="button"
                    onClick={() => setSlide(i)}
                    className={`relative overflow-hidden rounded-xl ring-2 transition-shadow ${
                      i === safeSlide
                        ? "ring-[var(--prel-primary)] shadow-ios"
                        : "ring-prel-glass-border opacity-95 hover:opacity-100"
                    }`}
                    style={{ aspectRatio: "343 / 120" }}
                  >
                    <SafeImage
                      src={url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-2 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {i + 1}/{urls.length}
                    </span>
                  </button>
                ))}
              </div>
              {/* Mobile: compact picker */}
              {urls.length > 1 ? (
                <div className="mt-2 flex flex-wrap gap-2 md:hidden">
                  {urls.map((url, i) => (
                    <button
                      key={`${url}-${i}`}
                      type="button"
                      onClick={() => setSlide(i)}
                      className={`h-11 w-20 overflow-hidden rounded-lg ring-2 transition-shadow ${
                        i === safeSlide
                          ? "ring-[var(--prel-primary)]"
                          : "ring-prel-glass-border opacity-90 hover:opacity-100"
                      }`}
                    >
                      <SafeImage
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Meta footer */}
        <div className="mt-4 grid gap-2 border-t border-prel-separator pt-4 text-[12px] text-prel-secondary-label sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--prel-primary)]" />
            <div>
              <p className="font-medium text-prel-label">Timeline</p>
              <p>
                Created{" "}
                <span className="text-prel-label">
                  {formatDateTime(banner.createdAt ?? undefined)}
                </span>
              </p>
              <p>
                Updated{" "}
                <span className="text-prel-label">
                  {formatDateTime(banner.updatedAt ?? undefined)}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-prel-metric-users" />
            <div>
              <p className="font-medium text-prel-label">People</p>
              <p>
                Created by{" "}
                <span className="text-prel-label">
                  @
                  {banner.createdBy?.username ??
                    banner.createdBy?.displayName ??
                    "-"}
                </span>
              </p>
              <p>
                Updated by{" "}
                <span className="text-prel-label">
                  @
                  {banner.updatedBy?.username ??
                    banner.updatedBy?.displayName ??
                    "-"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
