"use client";

import { CookieConsentBanner } from "@/components/marketplace/CookieConsentBanner";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";

export function MarketplaceChrome({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <MarketplaceShell>{children}</MarketplaceShell>
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}
