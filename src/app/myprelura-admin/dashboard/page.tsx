"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { Users, Sparkles, Eye, TrendingUp, HeartPulse } from "lucide-react";
import { ANALYTICS_OVERVIEW, ALL_REPORTS } from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { marketplaceHealthScore } from "@/lib/marketplace-health";
import { formatRelativeShort } from "@/lib/format";
import { staffPath } from "@/lib/staff-nav";

export default function DashboardPage() {
  const { data: aData, loading: aLoad, error: aErr } = useQuery(
    ANALYTICS_OVERVIEW,
    { fetchPolicy: "network-only" }
  );
  const { data: rData, loading: rLoad, error: rErr } = useQuery(ALL_REPORTS, {
    fetchPolicy: "network-only",
  });

  const a = aData?.analyticsOverview;
  const reports = (rData?.allReports ?? []).slice(0, 15);
  const health = a ? marketplaceHealthScore(a) : null;

  function delta(pct: number | null | undefined) {
    if (pct == null) return "—";
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(1)}% vs prior day`;
  }

  const loading = (aLoad && !aData) || (rLoad && !rData);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {(aErr || rErr) && (
        <p className="text-[14px] text-prel-error">
          {[aErr?.message, rErr?.message].filter(Boolean).join(" · ")}
        </p>
      )}

      {loading && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <GlassCard key={i} className="h-28 animate-pulse bg-prel-glass/50">
              {" "}
            </GlassCard>
          ))}
        </div>
      )}

      {a && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={staffPath("/analytics")}
              className="block min-h-0 w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-prel-metric-users/25 text-prel-metric-users">
                    <Users className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] text-prel-secondary-label">
                      Total users
                    </p>
                    <p className="text-[22px] font-bold text-prel-label">
                      {a.totalUsers ?? 0}
                    </p>
                    <p className="text-[12px] text-prel-tertiary-label">
                      {delta(a.totalUsersPercentageChange)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
            <Link
              href={staffPath("/analytics")}
              className="block min-h-0 w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-prel-metric-new/25 text-prel-metric-new">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] text-prel-secondary-label">
                      New today
                    </p>
                    <p className="text-[22px] font-bold text-prel-label">
                      {a.totalNewUsersToday ?? 0}
                    </p>
                    <p className="text-[12px] text-prel-tertiary-label">
                      {delta(a.newUsersPercentageChange)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
            <Link
              href={staffPath("/analytics")}
              className="block min-h-0 w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-prel-metric-views/25 text-prel-metric-views">
                    <Eye className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] text-prel-secondary-label">
                      Listing views
                    </p>
                    <p className="text-[22px] font-bold text-prel-label">
                      {a.totalProductViews ?? 0}
                    </p>
                    <p className="text-[12px] text-prel-tertiary-label">
                      {delta(a.totalProductViewsPercentageChange)}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
            <Link
              href={staffPath("/analytics")}
              className="block min-h-0 w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-prel-metric-views-today/25 text-prel-metric-views-today">
                    <TrendingUp className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[13px] text-prel-secondary-label">
                      Views today
                    </p>
                    <p className="text-[22px] font-bold text-prel-label">
                      {a.totalProductViewsToday ?? 0}
                    </p>
                    <p className="text-[12px] text-prel-tertiary-label">
                      Intraday traffic
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>

          {health && (
            <Link
              href={staffPath("/analytics")}
              className="block w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex flex-wrap items-center gap-3">
                  <HeartPulse className="h-8 w-8 shrink-0 text-prel-metric-health" />
                  <div className="flex-1">
                    <p className="text-[17px] font-semibold text-prel-label">
                      Marketplace health score
                    </p>
                    <p className="text-[13px] text-prel-secondary-label">
                      {health.subtitle}
                    </p>
                  </div>
                  <p className="text-[40px] font-bold tabular-nums text-prel-metric-health">
                    {health.value}
                  </p>
                </div>
              </GlassCard>
            </Link>
          )}
        </>
      )}

      <GlassCard>
        <p className="text-[15px] font-semibold text-prel-label">Live activity</p>
        <p className="mt-1 text-[13px] text-prel-secondary-label">
          Latest account, listing, and order-issue reports. Tap a row for evidence
          and linked chats.
        </p>
      </GlassCard>

      <div className="flex flex-col gap-5 md:gap-6">
        {reports.length === 0 && !rLoad && (
          <p className="text-[13px] text-prel-secondary-label">
            No recent reports, or your token cannot read the admin queue.
          </p>
        )}
        {reports.map((r: Record<string, unknown>) => {
          const id = r.id as number;
          const href = staffPath(`/reports/${id}`);
          return (
            <Link
              key={`${r.reportType}-${id}`}
              href={href}
              className="block w-full"
            >
              <GlassCard className="block transition-opacity hover:opacity-95">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <span className="rounded-full bg-prel-primary/20 px-2 py-0.5 text-[11px] font-semibold uppercase text-prel-primary">
                    {String(r.reportType ?? "REPORT")}
                  </span>
                  <span className="text-[12px] text-prel-secondary-label">
                    {String(r.status ?? "")}
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-semibold text-prel-label">
                  {String(r.reason ?? "No reason")}
                </p>
                {r.context ? (
                  <p className="mt-1 line-clamp-3 text-[13px] text-prel-secondary-label">
                    {String(r.context)}
                  </p>
                ) : null}
                <p className="mt-2 text-[12px] text-prel-tertiary-label">
                  {r.dateCreated
                    ? formatRelativeShort(String(r.dateCreated))
                    : ""}
                </p>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
