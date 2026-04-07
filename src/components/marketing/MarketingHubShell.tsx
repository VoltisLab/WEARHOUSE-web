import type { ReactNode } from "react";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingRelatedStrip } from "@/components/marketing/MarketingRelatedStrip";

export function MarketingHubShell({
  title,
  eyebrow,
  subtitle,
  updated,
  heroPosition = "center",
  children,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  updated?: string;
  heroPosition?: "center" | "top" | "right" | "left" | "bottom";
  children: ReactNode;
}) {
  return (
    <div className="pb-8">
      <MarketingPageHero
        title={title}
        eyebrow={eyebrow}
        subtitle={subtitle}
        updated={updated}
        imagePosition={heroPosition}
      />
      <div className="relative z-[2] mx-auto max-w-7xl px-4 md:px-8 lg:px-10">
        {children}
      </div>
      <MarketingRelatedStrip />
    </div>
  );
}
