"use client";

import { MarketplaceShell } from "@/components/marketplace/MarketplaceShell";

export function MarketplaceChrome({ children }: { children: React.ReactNode }) {
  return <MarketplaceShell>{children}</MarketplaceShell>;
}
