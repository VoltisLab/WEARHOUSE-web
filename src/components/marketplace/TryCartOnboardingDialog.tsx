"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wearhouse_try_cart_onboarding_seen_v1";

const PAGES = [
  {
    title: "One bag, many sellers",
    body: "Try Cart lets you add pieces from different shops into a single bag. Keep browsing - your picks stay with you while you shop.",
  },
  {
    title: "Save time on every haul",
    body: "No more jumping seller by seller. Search, tap Add to bag, and build your haul in one flow - with a running total so you always know where you stand.",
  },
  {
    title: "Shop smarter, checkout clearer",
    body: "Use Try Cart from Shop all. Mix brands freely, open your shopping bag anytime, then check out when you’re ready.",
  },
] as const;

export function TryCartOnboardingDialog() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setOpen(true), 420);
    return () => window.clearTimeout(t);
  }, []);

  const finish = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  if (!open) return null;

  const p = PAGES[page]!;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="try-cart-onboard-title"
    >
      <div className="max-h-[min(720px,92vh)] w-full max-w-[420px] overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07040C] via-[#12081C] to-[#0A0610] text-white shadow-2xl">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              WEARHOUSE
            </p>
            <h2 id="try-cart-onboard-title" className="text-base font-semibold">
              Try Cart
            </h2>
          </div>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/50">
            {page + 1} / {PAGES.length}
          </span>
          <button
            type="button"
            onClick={finish}
            className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white/90"
          >
            Skip
          </button>
        </div>

        <div className="px-5 py-6">
          <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-[var(--prel-primary)]/25 ring-1 ring-white/20">
            <span className="text-4xl" aria-hidden>
              🛍️
            </span>
          </div>
          <h3 className="text-center text-[1.35rem] font-bold leading-tight">
            {p.title}
          </h3>
          <p className="mt-3 text-center text-sm leading-relaxed text-white/80">
            {p.body}
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4">
          <div className="flex justify-center gap-1.5">
            {PAGES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-6 bg-white" : "w-1.5 bg-white/30"
                }`}
              />
            ))}
          </div>
          {page < PAGES.length - 1 ? (
            <button
              type="button"
              onClick={() => setPage((x) => x + 1)}
              className="min-h-[48px] w-full rounded-full bg-white/15 py-3 text-[15px] font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/20"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              className="min-h-[48px] w-full rounded-full bg-[var(--prel-primary)] py-3 text-[15px] font-bold text-white shadow-lg transition hover:brightness-110"
            >
              Start shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
