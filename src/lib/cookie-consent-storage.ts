/**
 * First-party cookie / localStorage consent for the marketplace web app.
 * Essential auth tokens are unaffected; this gates optional categories only.
 */

export const COOKIE_CONSENT_STORAGE_KEY = "wearhouse_cookie_consent_v1";

/** Bump when categories or vendors change enough to re-prompt. */
export const COOKIE_CONSENT_POLICY_VERSION = 1;

export type CookieConsentPrefs = {
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

export const COOKIE_CONSENT_DEFAULT_DECLINE: CookieConsentPrefs = {
  functional: false,
  analytics: false,
  marketing: false,
};

export const COOKIE_CONSENT_DEFAULT_ACCEPT: CookieConsentPrefs = {
  functional: true,
  analytics: true,
  marketing: true,
};

type StoredPayload = {
  policyVersion: number;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  updatedAt: number;
};

export function parseCookieConsent(
  raw: string | null,
): { decided: boolean; prefs: CookieConsentPrefs } {
  if (!raw) {
    return { decided: false, prefs: { ...COOKIE_CONSENT_DEFAULT_DECLINE } };
  }
  try {
    const j = JSON.parse(raw) as Partial<StoredPayload>;
    if (j.policyVersion !== COOKIE_CONSENT_POLICY_VERSION) {
      return { decided: false, prefs: { ...COOKIE_CONSENT_DEFAULT_DECLINE } };
    }
    return {
      decided: true,
      prefs: {
        functional: !!j.functional,
        analytics: !!j.analytics,
        marketing: !!j.marketing,
      },
    };
  } catch {
    return { decided: false, prefs: { ...COOKIE_CONSENT_DEFAULT_DECLINE } };
  }
}

export function serializeCookieConsent(prefs: CookieConsentPrefs): string {
  const payload: StoredPayload = {
    policyVersion: COOKIE_CONSENT_POLICY_VERSION,
    functional: prefs.functional,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    updatedAt: Date.now(),
  };
  return JSON.stringify(payload);
}

/** For future analytics / marketing tags (client-only). */
export function readCookieConsentFromStorage(): {
  decided: boolean;
  prefs: CookieConsentPrefs;
} {
  if (typeof window === "undefined") {
    return { decided: false, prefs: { ...COOKIE_CONSENT_DEFAULT_DECLINE } };
  }
  return parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY));
}
