import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_BASE = "https://mywearhouse.com";
const SERVER_PROBE_MS = 12_000;

function normalizeBase(raw: string | undefined): string {
  const t = (raw?.trim() || DEFAULT_BASE).replace(/\/+$/, "");
  try {
    return new URL(t).origin;
  } catch {
    return DEFAULT_BASE.replace(/\/+$/, "");
  }
}

/**
 * Server-side reachability check for the public storefront (no browser CORS).
 * Used by staff Console → “Public web” probe.
 */
export async function GET() {
  const origin = normalizeBase(process.env.NEXT_PUBLIC_PUBLIC_WEB_URL);
  const url = `${origin}/`;
  const t0 = Date.now();
  const ac = new AbortController();
  const tid = setTimeout(() => ac.abort(), SERVER_PROBE_MS);

  async function tryFetch(method: "HEAD" | "GET"): Promise<Response> {
    return fetch(url, {
      method,
      redirect: "follow",
      cache: "no-store",
      signal: ac.signal,
      headers: {
        "User-Agent": "WEARHOUSE-ConsoleProbe/1.0",
        Accept: method === "HEAD" ? "*/*" : "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      },
    });
  }

  try {
    let res = await tryFetch("HEAD");
    if (res.status === 405 || res.status === 501) {
      res = await tryFetch("GET");
    }
    const ms = Date.now() - t0;
    const up =
      (res.status >= 200 && res.status < 400) ||
      res.status === 304 ||
      res.status === 405;
    return NextResponse.json({
      ok: up,
      status: res.status,
      ms,
      hostname: new URL(url).hostname,
      url,
    });
  } catch (e) {
    const ms = Date.now() - t0;
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({
      ok: false,
      status: 0,
      ms,
      hostname: new URL(url).hostname,
      url,
      error: ac.signal.aborted ? `Timed out (${Math.round(SERVER_PROBE_MS / 1000)}s)` : msg,
    });
  } finally {
    clearTimeout(tid);
  }
}
