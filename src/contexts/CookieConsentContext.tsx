"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentPrefs,
  COOKIE_CONSENT_DEFAULT_ACCEPT,
  COOKIE_CONSENT_DEFAULT_DECLINE,
  parseCookieConsent,
  serializeCookieConsent,
} from "@/lib/cookie-consent-storage";

type CookieConsentContextValue = {
  ready: boolean;
  /** User has saved a choice for the current policy version. */
  decided: boolean;
  prefs: CookieConsentPrefs;
  acceptAll: () => void;
  declineNonEssential: () => void;
  savePrefs: (prefs: CookieConsentPrefs) => void;
  /** Clear saved choice so the banner appears again (e.g. after policy bump). */
  clearDecision: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null,
);

export function CookieConsentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const [decided, setDecided] = useState(false);
  const [prefs, setPrefsState] = useState<CookieConsentPrefs>({
    ...COOKIE_CONSENT_DEFAULT_DECLINE,
  });

  useEffect(() => {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    const { decided: d, prefs: p } = parseCookieConsent(raw);
    setDecided(d);
    setPrefsState(p);
    setReady(true);
  }, []);

  const persist = useCallback((next: CookieConsentPrefs) => {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serializeCookieConsent(next));
    setPrefsState(next);
    setDecided(true);
    window.dispatchEvent(new Event("wearhouse-cookie-consent-updated"));
  }, []);

  const acceptAll = useCallback(() => {
    persist({ ...COOKIE_CONSENT_DEFAULT_ACCEPT });
  }, [persist]);

  const declineNonEssential = useCallback(() => {
    persist({ ...COOKIE_CONSENT_DEFAULT_DECLINE });
  }, [persist]);

  const savePrefs = useCallback(
    (next: CookieConsentPrefs) => {
      persist(next);
    },
    [persist],
  );

  const clearDecision = useCallback(() => {
    localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
    setDecided(false);
    setPrefsState({ ...COOKIE_CONSENT_DEFAULT_DECLINE });
    window.dispatchEvent(new Event("wearhouse-cookie-consent-updated"));
  }, []);

  const value = useMemo(
    () => ({
      ready,
      decided,
      prefs,
      acceptAll,
      declineNonEssential,
      savePrefs,
      clearDecision,
    }),
    [
      ready,
      decided,
      prefs,
      acceptAll,
      declineNonEssential,
      savePrefs,
      clearDecision,
    ],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}
