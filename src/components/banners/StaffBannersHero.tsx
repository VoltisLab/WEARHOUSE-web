import Link from "next/link";
import { LayoutGrid, Sparkles } from "lucide-react";
import { staffPath } from "@/lib/staff-nav";

/**
 * Page-level hero for staff banner management - primary gradient, glass panel, metric chips.
 */
export function StaffBannersHero({
  total,
  activeCount,
}: {
  total: number;
  activeCount: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-[14px] ring-1 ring-prel-glass-border">
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.35]"
        style={{
          background:
            "linear-gradient(135deg, var(--prel-primary) 0%, #5a1a5e 45%, var(--prel-metric-users) 100%)",
        }}
        aria-hidden
      />
      <div className="relative glass-card rounded-[14px] border-0 bg-prel-card/88 p-5 dark:bg-prel-card/80">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-ios"
              style={{ backgroundColor: "var(--prel-primary)" }}
            >
              <Sparkles className="h-5 w-5" strokeWidth={2} aria-hidden />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--prel-primary)]">
                In-app marketing
              </p>
              <h1 className="mt-0.5 text-[22px] font-bold leading-tight text-prel-label">
                Home banners
              </h1>
              <p className="mt-1 max-w-md text-[14px] leading-snug text-prel-secondary-label">
                Hero strips shown on the consumer home feed. Each row maps to a{" "}
                <span className="font-medium text-prel-label">style slot</span>{" "}
                (season field in API). Preview uses the same aspect as the in-app
                carousel.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-full bg-prel-metric-new/18 px-3 py-1.5 ring-1 ring-prel-metric-new/35">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-prel-metric-new">
                Live
              </span>
              <span className="ml-2 text-[15px] font-bold tabular-nums text-prel-label">
                {activeCount}
              </span>
            </div>
            <div className="rounded-full bg-prel-glass px-3 py-1.5 ring-1 ring-prel-glass-border">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-prel-secondary-label">
                Total
              </span>
              <span className="ml-2 text-[15px] font-bold tabular-nums text-prel-label">
                {total}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-prel-separator pt-4">
          <Link
            href={staffPath("/tools")}
            className="inline-flex items-center gap-1.5 rounded-full bg-prel-glass px-3 py-1.5 text-[13px] font-semibold text-prel-label ring-1 ring-prel-glass-border transition-colors hover:bg-prel-primary/12"
          >
            <LayoutGrid className="h-3.5 w-3.5 text-[var(--prel-primary)]" />
            Tools
          </Link>
          <span className="self-center text-[12px] text-prel-tertiary-label">
            Broadcast &amp; segments still use ops / push tooling.
          </span>
        </div>
      </div>
    </section>
  );
}
