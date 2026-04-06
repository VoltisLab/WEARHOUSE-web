"use client";

import { useLazyQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import {
  VIEW_ME,
  ANALYTICS_OVERVIEW,
  ALL_REPORTS,
  ALL_ORDER_ISSUES,
  BANNERS,
  ALL_PRODUCTS,
} from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  GRAPHQL_URI,
  GRAPHQL_WS_URI,
  PUBLIC_WEB_BASE,
} from "@/lib/constants";

type Line = { id: string; name: string; up: boolean; detail: string; ms: number };

const LS = {
  gql: "wearhouse.console.sim.gql",
  an: "wearhouse.console.sim.analytics",
  rp: "wearhouse.console.sim.reports",
  web: "wearhouse.console.sim.web",
};

export default function ConsolePage() {
  const [simGql, setSimGql] = useState(false);
  const [simAn, setSimAn] = useState(false);
  const [simRp, setSimRp] = useState(false);
  const [simWeb, setSimWeb] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const [probedAt, setProbedAt] = useState<string | null>(null);

  const [runVm] = useLazyQuery(VIEW_ME, { fetchPolicy: "network-only" });
  const [runAo] = useLazyQuery(ANALYTICS_OVERVIEW, { fetchPolicy: "network-only" });
  const [runAr] = useLazyQuery(ALL_REPORTS, { fetchPolicy: "network-only" });
  const [runIssues] = useLazyQuery(ALL_ORDER_ISSUES, {
    fetchPolicy: "network-only",
  });
  const [runBanners] = useLazyQuery(BANNERS, { fetchPolicy: "network-only" });
  const [runProducts] = useLazyQuery(ALL_PRODUCTS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setSimGql(localStorage.getItem(LS.gql) === "1");
    setSimAn(localStorage.getItem(LS.an) === "1");
    setSimRp(localStorage.getItem(LS.rp) === "1");
    setSimWeb(localStorage.getItem(LS.web) === "1");
  }, []);

  const runProbes = useCallback(async () => {
    const next: Line[] = [];
    const push = (x: Line) => next.push(x);

    if (simGql) {
      push({
        id: "gql",
        name: "GraphQL API",
        up: false,
        detail: "Simulated down (this browser only).",
        ms: 0,
      });
    } else {
      const t0 = performance.now();
      try {
        const r = await runVm();
        if (r.error) throw r.error;
        push({
          id: "gql",
          name: "GraphQL API",
          up: true,
          detail: `viewMe OK · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "gql",
          name: "GraphQL API",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    if (simAn) {
      push({
        id: "an",
        name: "Analytics",
        up: false,
        detail: "Simulated down.",
        ms: 0,
      });
    } else {
      const t0 = performance.now();
      try {
        const r = await runAo();
        if (r.error) throw r.error;
        push({
          id: "an",
          name: "Analytics",
          up: true,
          detail: `analyticsOverview OK · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "an",
          name: "Analytics",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    if (simRp) {
      push({
        id: "rp",
        name: "Reports",
        up: false,
        detail: "Simulated down.",
        ms: 0,
      });
    } else {
      const t0 = performance.now();
      try {
        const r = await runAr();
        if (r.error) throw r.error;
        push({
          id: "rp",
          name: "Reports",
          up: true,
          detail: `allReports OK · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "rp",
          name: "Reports",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    if (simWeb) {
      push({
        id: "web",
        name: "Public web",
        up: false,
        detail: "Simulated down.",
        ms: 0,
      });
    } else {
      const t0 = performance.now();
      try {
        const res = await fetch(PUBLIC_WEB_BASE, {
          method: "HEAD",
          mode: "cors",
        });
        const ms = Math.round(performance.now() - t0);
        const code = res.status;
        const up = (code >= 200 && code < 400) || code === 405;
        push({
          id: "web",
          name: "Public web",
          up,
          detail: up
            ? `${new URL(PUBLIC_WEB_BASE).host} · ${ms} ms (HTTP ${code})`
            : `HTTP ${code}`,
          ms,
        });
      } catch (e) {
        push({
          id: "web",
          name: "Public web",
          up: false,
          detail:
            e instanceof Error
              ? e.message
              : "Network / CORS (expected from localhost)",
          ms: 0,
        });
      }
    }

    push({
      id: "gqlws",
      name: "graphql-ws lib",
      up: true,
      detail: GRAPHQL_WS_URI
        ? `Client ready · ${GRAPHQL_WS_URI.slice(0, 48)}…`
        : "Installed; set NEXT_PUBLIC_GRAPHQL_WS_URI for subscriptions",
      ms: 0,
    });

    {
      const t0 = performance.now();
      try {
        const r = await runIssues();
        if (r.error) throw r.error;
        const n = (r.data?.allOrderIssues ?? []).length;
        push({
          id: "iss",
          name: "Order issues",
          up: true,
          detail: `allOrderIssues · ${n} open rows · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "iss",
          name: "Order issues",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    {
      const t0 = performance.now();
      try {
        const r = await runBanners();
        if (r.error) throw r.error;
        const n = (r.data?.banners ?? []).length;
        push({
          id: "bnr",
          name: "Banners",
          up: true,
          detail: `banners · ${n} row(s) · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "bnr",
          name: "Banners",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    {
      const t0 = performance.now();
      try {
        const r = await runProducts({
          variables: { pageCount: 1, pageNumber: 1, filters: null },
        });
        if (r.error) throw r.error;
        const n = (r.data?.allProducts ?? []).length;
        push({
          id: "prd",
          name: "Listings sample",
          up: true,
          detail: `allProducts page 1 · ${n} row(s) · ${Math.round(performance.now() - t0)} ms`,
          ms: Math.round(performance.now() - t0),
        });
      } catch (e) {
        push({
          id: "prd",
          name: "Listings sample",
          up: false,
          detail: e instanceof Error ? e.message : "Error",
          ms: 0,
        });
      }
    }

    setLines(next);
    setProbedAt(new Date().toLocaleTimeString());
  }, [
    simGql,
    simAn,
    simRp,
    simWeb,
    runVm,
    runAo,
    runAr,
    runIssues,
    runBanners,
    runProducts,
  ]);

  useEffect(() => {
    runProbes();
  }, [runProbes]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-[13px] text-prel-secondary-label">
        Private probes (same idea as the consumer Console). Simulated outages are stored
        in <code className="text-prel-primary">localStorage</code> only.
      </p>
      <p className="font-mono text-[11px] text-prel-tertiary-label">{GRAPHQL_URI}</p>
      <p className="font-mono text-[11px] text-prel-tertiary-label">
        WS subscriptions:{" "}
        {GRAPHQL_WS_URI || "(NEXT_PUBLIC_GRAPHQL_WS_URI not set)"}
      </p>
      <p className="text-[12px] text-prel-secondary-label">
        Live chat on iOS uses Django Channels{" "}
        <code className="text-prel-primary">ws/chat/&lt;id&gt;/</code> with a JWT
        header; browsers cannot set WS auth headers — this admin uses GraphQL
        polling. <code className="text-prel-primary">graphql-ws</code> is wired
        for future GraphQL subscriptions when the API exposes them.
      </p>

      <GlassCard>
        <p className="mb-3 text-[15px] font-semibold text-prel-label">
          Simulate outage (local)
        </p>
        <div className="space-y-2 text-[14px]">
          <label className="flex items-center justify-between gap-2">
            <span>GraphQL API</span>
            <input
              type="checkbox"
              checked={simGql}
              onChange={(e) => {
                const v = e.target.checked;
                setSimGql(v);
                localStorage.setItem(LS.gql, v ? "1" : "0");
              }}
              className="accent-prel-primary"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Analytics field</span>
            <input
              type="checkbox"
              checked={simAn}
              onChange={(e) => {
                const v = e.target.checked;
                setSimAn(v);
                localStorage.setItem(LS.an, v ? "1" : "0");
              }}
              className="accent-prel-primary"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Reports field</span>
            <input
              type="checkbox"
              checked={simRp}
              onChange={(e) => {
                const v = e.target.checked;
                setSimRp(v);
                localStorage.setItem(LS.rp, v ? "1" : "0");
              }}
              className="accent-prel-primary"
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span>Public web</span>
            <input
              type="checkbox"
              checked={simWeb}
              onChange={(e) => {
                const v = e.target.checked;
                setSimWeb(v);
                localStorage.setItem(LS.web, v ? "1" : "0");
              }}
              className="accent-prel-primary"
            />
          </label>
        </div>
      </GlassCard>

      {probedAt && (
        <p className="text-[12px] text-prel-tertiary-label">Last probe: {probedAt}</p>
      )}

      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-prel-separator pb-3">
        {lines.map((l) => (
          <div key={l.id} className="flex w-14 flex-col items-center gap-1">
            <div
              className={`h-7 w-7 rounded-full shadow-md ${
                l.up ? "bg-prel-metric-new" : "bg-prel-error"
              }`}
            />
            <div
              className="w-1.5 rounded-sm bg-prel-secondary-label/40"
              style={{ height: `${24 + Math.min(l.ms, 400) / 20}px` }}
            />
            <span className="whitespace-pre-line text-center text-[9px] font-semibold leading-tight text-prel-tertiary-label">
              {l.name.replace(/ /g, "\n")}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {lines.map((l) => (
          <GlassCard key={l.id}>
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                  l.up ? "bg-prel-metric-new" : "bg-prel-error"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-prel-label">{l.name}</p>
                <p className="text-[13px] text-prel-secondary-label">{l.detail}</p>
              </div>
              <span
                className={`text-[11px] font-bold ${
                  l.up ? "text-prel-metric-new" : "text-prel-error"
                }`}
              >
                {l.up ? "UP" : "DOWN"}
              </span>
            </div>
          </GlassCard>
        ))}
      </div>

      <button
        type="button"
        onClick={() => runProbes()}
        className="prel-btn-primary w-full rounded-[10px] py-3 text-[16px] font-semibold"
      >
        Run probes again
      </button>
    </div>
  );
}
