"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ALL_REPORTS } from "@/graphql/queries/admin";
import { IOSCard } from "@/components/ui/IOSCard";
import { formatRelativeShort } from "@/lib/format";
import { staffPath } from "@/lib/staff-nav";

export default function ReportsPage() {
  const { data, loading, error } = useQuery(ALL_REPORTS);
  const rows = data?.allReports ?? [];
  const [q, setQ] = useState("");
  const [typeTag, setTypeTag] = useState<string | null>(null);

  const typeTags = useMemo(() => {
    const s = new Set<string>();
    for (const r of rows) {
      const t = (r as { reportType?: string }).reportType;
      if (t) s.add(t);
    }
    return [...s].sort();
  }, [rows]);

  const filtered = useMemo(() => {
    let list = rows as Record<string, unknown>[];
    if (typeTag) {
      list = list.filter((r) => (r.reportType as string) === typeTag);
    }
    const qq = q.trim().toLowerCase();
    if (!qq) return list;
    return list.filter((r) => {
      const hay = [
        r.reason,
        r.reportType,
        r.reportedByUsername,
        r.accountReportedUsername,
        r.productName,
        r.context,
      ]
        .map((x) => String(x ?? "").toLowerCase())
        .join(" ");
      return hay.includes(qq);
    });
  }, [rows, q, typeTag]);

  if (loading) {
    return <p className="text-prel-secondary-label">Loading…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }

  return (
    <div className="space-y-4">
      <input
        type="search"
        placeholder="Filter queue…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-3 text-[16px] text-prel-label outline-none focus:ring-2 focus:ring-prel-primary/30"
      />
      {typeTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTypeTag(null)}
            className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
              typeTag == null
                ? "bg-prel-primary/35 text-prel-label ring-1 ring-prel-primary"
                : "bg-prel-glass text-prel-label ring-1 ring-prel-glass-border"
            }`}
          >
            All
          </button>
          {typeTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeTag(t)}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold ${
                typeTag === t
                  ? "bg-prel-primary/35 text-prel-label ring-1 ring-prel-primary"
                  : "bg-prel-glass text-prel-label ring-1 ring-prel-glass-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <IOSCard className="divide-y divide-prel-separator">
        {filtered.map((r) => {
          const id = r.id as number;
          return (
            <Link
              key={`${r.reportType}-${id}`}
              href={staffPath(`/reports/${id}`)}
              className="block px-4 py-4 transition-colors hover:bg-prel-glass/40"
            >
              <div className="flex justify-between gap-2">
                <span className="rounded-full bg-prel-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase text-prel-primary">
                  {String(r.reportType ?? "REPORT")}
                </span>
                <span className="text-[12px] text-prel-secondary-label">
                  {String(r.status ?? "")}
                </span>
              </div>
              <p className="mt-2 font-semibold text-prel-label">
                {String(r.reason ?? "-")}
              </p>
              {r.context != null && String(r.context).length > 0 ? (
                <p className="mt-1 line-clamp-3 text-[13px] text-prel-secondary-label">
                  {String(r.context)}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-prel-tertiary-label">
                {r.dateCreated
                  ? formatRelativeShort(String(r.dateCreated))
                  : ""}
              </p>
            </Link>
          );
        })}
      </IOSCard>
    </div>
  );
}
