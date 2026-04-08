"use client";

import { CookieConsentBanner } from "@/components/marketplace/CookieConsentBanner";
import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";
import { VisualViewportBottomInset } from "@/components/marketplace/VisualViewportBottomInset";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { ShopAllBagProvider } from "@/contexts/ShopAllBagContext";

export function MarketplaceChrome({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <VisualViewportBottomInset />
      <ShopAllBagProvider>
        <MarketplaceShell>{children}</MarketplaceShell>
      </ShopAllBagProvider>
      <CookieConsentBanner />
    </CookieConsentProvider>
  );
}
