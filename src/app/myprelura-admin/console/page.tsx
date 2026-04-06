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
  ADMIN_ALL_ORDERS,
  USER_ADMIN_STATS,
} from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  GRAPHQL_URI,
  GRAPHQL_WS_URI,
  PUBLIC_WEB_BASE,
} from "@/lib/constants";

type Line = { id: string; name: string; up: boolean; detail: string; ms: number };

/** Per-probe ceiling so one stuck request cannot block the rest of the console. */
const PROBE_MS = 14_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${label} timed out (${Math.round(ms / 1000)}s)`)),
      ms,
    );
  });
  return Promise.race([
    promise.finally(() => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }),
    timeoutPromise,
  ]);
}

function errMsg(e: unknown): string {
  return e instanceof Error ? e.message : "Error";
}

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
  const [runAdminOrders] = useLazyQuery(ADMIN_ALL_ORDERS, {
    fetchPolicy: "network-only",
  });
  const [runUserAdminStats] = useLazyQuery(USER_ADMIN_STATS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    setSimGql(localStorage.getItem(LS.gql) === "1");
    setSimAn(localStorage.getItem(LS.an) === "1");
    setSimRp(localStorage.getItem(LS.rp) === "1");
    setSimWeb(localStorage.getItem(LS.web) === "1");
  }, []);

  const runProbes = useCallback(async () => {
    const probeGql = async (): Promise<Line> => {
      if (simGql) {
        return {
          id: "gql",
          name: "GraphQL API",
          up: false,
          detail: "Simulated down (this browser only).",
          ms: 0,
        };
      }
      const t0 = performance.now();
      try {
        const r = await withTimeout(runVm(), PROBE_MS, "GraphQL API");
        if (r.error) throw r.error;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "gql",
          name: "GraphQL API",
          up: true,
          detail: `viewMe OK · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "gql",
          name: "GraphQL API",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeAn = async (): Promise<Line> => {
      if (simAn) {
        return {
          id: "an",
          name: "Analytics",
          up: false,
          detail: "Simulated down.",
          ms: 0,
        };
      }
      const t0 = performance.now();
      try {
        const r = await withTimeout(runAo(), PROBE_MS, "Analytics");
        if (r.error) throw r.error;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "an",
          name: "Analytics",
          up: true,
          detail: `analyticsOverview OK · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "an",
          name: "Analytics",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeRp = async (): Promise<Line> => {
      if (simRp) {
        return {
          id: "rp",
          name: "Reports",
          up: false,
          detail: "Simulated down.",
          ms: 0,
        };
      }
      const t0 = performance.now();
      try {
        const r = await withTimeout(runAr(), PROBE_MS, "Reports");
        if (r.error) throw r.error;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "rp",
          name: "Reports",
          up: true,
          detail: `allReports OK · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "rp",
          name: "Reports",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeWeb = async (): Promise<Line> => {
      if (simWeb) {
        return {
          id: "web",
          name: "Public web",
          up: false,
          detail: "Simulated down.",
          ms: 0,
        };
      }
      const t0 = performance.now();
      try {
        const res = await withTimeout(
          fetch(PUBLIC_WEB_BASE, { method: "HEAD", mode: "cors" }),
          PROBE_MS,
          "Public web",
        );
        const ms = Math.round(performance.now() - t0);
        const code = res.status;
        const up = (code >= 200 && code < 400) || code === 405;
        return {
          id: "web",
          name: "Public web",
          up,
          detail: up
            ? `${new URL(PUBLIC_WEB_BASE).host} · ${ms} ms (HTTP ${code})`
            : `HTTP ${code}`,
          ms,
        };
      } catch (e) {
        return {
          id: "web",
          name: "Public web",
          up: false,
          detail:
            e instanceof Error
              ? e.message
              : "Network / CORS (expected from localhost)",
          ms: 0,
        };
      }
    };

    const gqlwsLine: Line = {
      id: "gqlws",
      name: "graphql-ws lib",
      up: true,
      detail: GRAPHQL_WS_URI
        ? `Client ready · ${GRAPHQL_WS_URI.slice(0, 48)}…`
        : "Installed; set NEXT_PUBLIC_GRAPHQL_WS_URI for subscriptions",
      ms: 0,
    };

    const probeOrd = async (): Promise<Line> => {
      const t0 = performance.now();
      try {
        const r = await withTimeout(
          runAdminOrders({ variables: { pageCount: 12, pageNumber: 1 } }),
          PROBE_MS,
          "Admin orders",
        );
        if (r.error) throw r.error;
        const rows = r.data?.adminAllOrders ?? [];
        const total = r.data?.adminAllOrdersTotalNumber ?? 0;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "ord",
          name: "Admin orders",
          up: true,
          detail: `adminAllOrders page 1 · ${rows.length} row(s) · total ${total} · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "ord",
          name: "Admin orders",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeUsr = async (): Promise<Line> => {
      const t0 = performance.now();
      try {
        const r = await withTimeout(
          runUserAdminStats({
            variables: { search: null, pageCount: 20, pageNumber: 1 },
          }),
          PROBE_MS,
          "User directory",
        );
        if (r.error) throw r.error;
        const n = (r.data?.userAdminStats ?? []).length;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "usr",
          name: "User directory",
          up: true,
          detail: `userAdminStats page 1 · ${n} row(s) · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "usr",
          name: "User directory",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeIss = async (): Promise<Line> => {
      const t0 = performance.now();
      try {
        const r = await withTimeout(runIssues(), PROBE_MS, "Order issues");
        if (r.error) throw r.error;
        const n = (r.data?.allOrderIssues ?? []).length;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "iss",
          name: "Order issues",
          up: true,
          detail: `allOrderIssues · ${n} row(s) · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "iss",
          name: "Order issues",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probeBnr = async (): Promise<Line> => {
      const t0 = performance.now();
      try {
        const r = await withTimeout(runBanners(), PROBE_MS, "Banners");
        if (r.error) throw r.error;
        const n = (r.data?.banners ?? []).length;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "bnr",
          name: "Banners",
          up: true,
          detail: `banners · ${n} row(s) · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "bnr",
          name: "Banners",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const probePrd = async (): Promise<Line> => {
      const t0 = performance.now();
      try {
        const r = await withTimeout(
          runProducts({
            variables: { pageCount: 15, pageNumber: 1, filters: null },
          }),
          PROBE_MS,
          "Listings sample",
        );
        if (r.error) throw r.error;
        const n = (r.data?.allProducts ?? []).length;
        const ms = Math.round(performance.now() - t0);
        return {
          id: "prd",
          name: "Listings sample",
          up: true,
          detail: `allProducts page 1 · ${n} row(s) · ${ms} ms`,
          ms,
        };
      } catch (e) {
        return {
          id: "prd",
          name: "Listings sample",
          up: false,
          detail: errMsg(e),
          ms: 0,
        };
      }
    };

    const [
      gqlLine,
      anLine,
      rpLine,
      webLine,
      ordLine,
      usrLine,
      issLine,
      bnrLine,
      prdLine,
    ] = await Promise.all([
      probeGql(),
      probeAn(),
      probeRp(),
      probeWeb(),
      probeOrd(),
      probeUsr(),
      probeIss(),
      probeBnr(),
      probePrd(),
    ]);

    const next: Line[] = [
      gqlLine,
      anLine,
      rpLine,
      webLine,
      gqlwsLine,
      ordLine,
      usrLine,
      issLine,
      bnrLine,
      prdLine,
    ];

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
    runAdminOrders,
    runUserAdminStats,
  ]);

  useEffect(() => {
    runProbes();
  }, [runProbes]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-[13px] text-prel-secondary-label">
        Private probes mirror MyPrelura staff <code className="text-prel-primary">Console</code>{" "}
        (GraphQL, analytics, reports, public web) plus staff list surfaces (orders, users,
        issues, banners, listings). GraphQL checks run in parallel with a {PROBE_MS / 1000}s cap
        each so one slow field cannot hide the rest. Simulated outages are{" "}
        <code className="text-prel-primary">localStorage</code> only.
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

      <div className="-mx-3 overflow-x-auto border-b border-prel-separator pb-3 sm:mx-0">
        <div className="flex min-w-min flex-nowrap items-end gap-3 px-3 sm:gap-4 sm:px-0">
        {lines.map((l) => (
          <div key={l.id} className="flex w-14 shrink-0 flex-col items-center gap-1">
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
