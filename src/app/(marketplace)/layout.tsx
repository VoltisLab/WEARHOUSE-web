import type { Metadata } from "next";
import { MarketplaceChrome } from "./MarketplaceChrome";

export const metadata: Metadata = {
  title: "WEARHOUSE — Marketplace",
  description: "Discover pre-loved fashion listings on WEARHOUSE.",
};

export default function MarketplaceLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MarketplaceChrome>{children}</MarketplaceChrome>;
}
