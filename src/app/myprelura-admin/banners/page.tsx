"use client";

import { useQuery } from "@apollo/client";
import { RefreshCw } from "lucide-react";
import { BANNERS } from "@/graphql/queries/admin";
import { StaffBannersHero } from "@/components/banners/StaffBannersHero";
import {
  StaffBannerRow,
  type StaffBannerRowData,
} from "@/components/banners/StaffBannerRow";

function BannersLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-36 animate-pulse rounded-[14px] bg-prel-glass ring-1 ring-prel-glass-border" />
      {[1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[14px] ring-1 ring-prel-glass-border"
        >
          <div
            className="h-1 animate-pulse"
            style={{ backgroundColor: "var(--prel-primary)", opacity: 0.45 }}
          />
          <div className="space-y-3 p-5">
            <div className="h-5 w-[66%] max-w-xs animate-pulse rounded-md bg-prel-glass" />
            <div className="h-4 w-40 animate-pulse rounded-md bg-prel-glass/80" />
            <div
              className="h-40 animate-pulse rounded-[1.25rem] bg-neutral-800/40"
              style={{ aspectRatio: "343 / 120" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BannersPage() {
  const { data, loading, error, refetch, networkStatus } = useQuery(BANNERS, {
    notifyOnNetworkStatusChange: true,
  });

  const rows = (data?.banners ?? []) as StaffBannerRowData[];
  const activeCount = rows.filter((b) => b.isActive === true).length;
  const refetching = networkStatus === 4;

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <BannersLoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl space-y-4">
        <StaffBannersHero total={0} activeCount={0} />
        <div
          className="rounded-[14px] border border-prel-error/35 bg-prel-error/10 p-4 text-[14px] text-prel-error"
          role="alert"
        >
          {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <StaffBannersHero total={rows.length} activeCount={activeCount} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-prel-secondary-label">
          <span className="font-semibold text-prel-label">
            {rows.length} slot{rows.length === 1 ? "" : "s"}
          </span>
          {" · "}
          Each row lists every creative at desktop width; tap any tile to preview
          in the device frame.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={refetching}
          className="prel-btn-secondary inline-flex min-h-[40px] items-center gap-2 rounded-[10px] px-4 text-[14px] font-semibold disabled:opacity-40"
        >
          <RefreshCw
            className={`h-4 w-4 ${refetching ? "animate-spin" : ""}`}
            aria-hidden
          />
          Refresh
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[var(--prel-primary)]/30 bg-prel-card/60 p-10 text-center ring-1 ring-prel-glass-border">
          <p className="text-[17px] font-semibold text-prel-label">
            No banners configured
          </p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] text-prel-secondary-label">
            When the API returns rows, each appears here with status colours, asset
            count, and a device-framed preview matching the home carousel aspect.
          </p>
        </div>
      ) : (
        <ul className="space-y-8">
          {rows.map((b) => (
            <li key={String(b.id)}>
              <StaffBannerRow banner={b} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
