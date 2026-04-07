"use client";

import { CookiePreferencesForm } from "@/components/marketplace/CookiePreferencesForm";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

/**
 * Live preference UI for the Cookie Policy page (`#preferences`).
 */
export function CookiePolicyPreferencesBlock() {
  const { decided, clearDecision, ready } = useCookieConsent();

  return (
    <div className="not-prose mt-6 space-y-4">
      <CookiePreferencesForm />
      {ready && decided ? (
        <p className="text-[13px] text-prel-tertiary-label">
          <button
            type="button"
            onClick={() => clearDecision()}
            className="font-semibold text-prel-primary underline-offset-2 hover:underline"
          >
            Clear saved choices and show the banner again
          </button>
        </p>
      ) : null}
    </div>
  );
}
