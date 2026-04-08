"use client";

import Link from "next/link";
import { useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import { CookiePreferencesForm } from "@/components/marketplace/CookiePreferencesForm";

/**
 * Fixed consent bar above the mobile bottom nav; floating card on large screens.
 */
export function CookieConsentBanner() {
  const { ready, decided, acceptAll, declineNonEssential } = useCookieConsent();
  const [customise, setCustomise] = useState(false);

  if (!ready || decided) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px)+var(--prel-vv-bottom-inset,0px))] z-[55] px-3 sm:px-4 lg:bottom-6 lg:px-4"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-desc"
    >
      <div className="pointer-events-auto mx-auto max-w-lg lg:ml-auto lg:mr-6 lg:max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_8px_32px_rgba(0,0,0,0.12)] sm:p-5 lg:rounded-2xl lg:shadow-xl">
          <h2
            id="cookie-banner-title"
            className="text-[16px] font-bold tracking-tight text-neutral-900"
          >
            Cookies &amp; similar tech
          </h2>
          <p
            id="cookie-banner-desc"
            className="mt-2 text-[13px] leading-relaxed text-neutral-600 sm:text-[14px]"
          >
            We use cookies to run your account securely and, if you agree, to
            improve the product and measure marketing. See our{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>

          {customise ? (
            <div className="mt-4 max-h-[min(50vh,420px)] overflow-y-auto pr-1">
              <CookiePreferencesForm onSaved={() => setCustomise(false)} />
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <button
                type="button"
                onClick={() => declineNonEssential()}
                className="order-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-[13px] font-semibold text-neutral-800 transition hover:bg-neutral-50 sm:order-1 sm:px-5"
              >
                Decline non-essential
              </button>
              <button
                type="button"
                onClick={() => setCustomise(true)}
                className="order-3 rounded-full border border-neutral-200 px-4 py-2.5 text-[13px] font-semibold text-neutral-700 transition hover:bg-neutral-50 sm:order-2 sm:px-5"
              >
                Customise
              </button>
              <button
                type="button"
                onClick={() => acceptAll()}
                className="order-1 rounded-full bg-[var(--prel-primary)] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:brightness-105 sm:order-3 sm:px-6"
              >
                Accept all
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
