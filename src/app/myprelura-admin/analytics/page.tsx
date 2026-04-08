"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { ANALYTICS_OVERVIEW } from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { marketplaceHealthScore } from "@/lib/marketplace-health";
import { staffPath } from "@/lib/staff-nav";

export default function AnalyticsPage() {
  const { data, loading, error, refetch } = useQuery(ANALYTICS_OVERVIEW, {
    fetchPolicy: "network-only",
  });
  const a = data?.analyticsOverview;
  const health = a ? marketplaceHealthScore(a) : null;

  function delta(pct: number | null | undefined) {
    if (pct == null) return "-";
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(1)}% vs prior day`;
  }

  if (loading && !data) {
    return <p className="text-prel-secondary-label">Loading…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }
  if (!a) {
    return <p className="text-prel-secondary-label">No analytics payload.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <button
        type="button"
        onClick={() => refetch()}
        className="text-[14px] font-semibold text-prel-primary"
      >
        Refresh
      </button>

      <GlassCard>
        <p className="text-[17px] font-semibold text-prel-label">Audience</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat label="Total users" value={String(a.totalUsers ?? 0)} foot={delta(a.totalUsersPercentageChange)} />
          <Stat label="New today" value={String(a.totalNewUsersToday ?? 0)} foot={delta(a.newUsersPercentageChange)} />
        </div>
      </GlassCard>

      <GlassCard>
        <p className="text-[17px] font-semibold text-prel-label">Listing traffic</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Stat label="Listing views" value={String(a.totalProductViews ?? 0)} foot={delta(a.totalProductViewsPercentageChange)} />
          <Stat label="Views today" value={String(a.totalProductViewsToday ?? 0)} foot="Intraday" />
        </div>
      </GlassCard>

      {health && (
        <GlassCard>
          <p className="text-[40px] font-bold text-prel-metric-health">{health.value}</p>
          <p className="text-[14px] text-prel-secondary-label">{health.subtitle}</p>
        </GlassCard>
      )}

      <p className="text-[12px] text-prel-tertiary-label">
        Figures mirror production{" "}
        <code className="text-prel-primary">analyticsOverview</code>. Seller funnels ship
        when admin fields exist.
      </p>

      <Link
        href={staffPath("/dashboard")}
        className="text-[15px] font-semibold text-prel-primary"
      >
        ← Home
      </Link>
    </div>
  );
}

function Stat({
  label,
  value,
  foot,
}: {
  label: string;
  value: string;
  foot: string;
}) {
  return (
    <div>
      <p className="text-[12px] text-prel-secondary-label">{label}</p>
      <p className="text-[22px] font-bold text-prel-label">{value}</p>
      <p className="text-[11px] text-prel-tertiary-label">{foot}</p>
    </div>
  );
}
