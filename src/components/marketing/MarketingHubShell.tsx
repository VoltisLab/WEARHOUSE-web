import type { ReactNode } from "react";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingRelatedStrip } from "@/components/marketing/MarketingRelatedStrip";

export function MarketingHubShell({
  title,
  eyebrow,
  subtitle,
  updated,
  heroPosition = "center",
  heroImage,
  children,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  updated?: string;
  heroPosition?: "center" | "top" | "right" | "left" | "bottom";
  heroImage?: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-0">
      <MarketingPageHero
        title={title}
        eyebrow={eyebrow}
        subtitle={subtitle}
        updated={updated}
        imageSrc={heroImage}
        imagePosition={heroPosition}
      />
      <section className="relative bg-prel-bg-grouped px-4 pt-10 pb-10 md:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">{children}</div>
      </section>
      <MarketingRelatedStrip />
    </div>
  );
}
