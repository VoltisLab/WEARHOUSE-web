import type { ReactNode } from "react";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingRelatedStrip } from "@/components/marketing/MarketingRelatedStrip";
import { MARKETING_HERO_IMAGE } from "@/lib/marketing-constants";

type HeroPos = "center" | "top" | "right" | "left" | "bottom";

export function MarketingDocShell({
  title,
  eyebrow,
  subtitle,
  updated,
  lead,
  heroImage = MARKETING_HERO_IMAGE,
  heroPosition = "center",
  children,
  ctaRow,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  updated?: string;
  lead?: string;
  heroImage?: string;
  heroPosition?: HeroPos;
  children: ReactNode;
  ctaRow?: ReactNode;
}) {
  return (
    <div className="pb-8">
      <MarketingPageHero
        title={title}
        eyebrow={eyebrow}
        subtitle={subtitle}
        updated={updated}
        imageSrc={heroImage}
        imagePosition={heroPosition}
      />

      <div className="relative z-[2] mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        <div className="-mt-10 rounded-2xl bg-white p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] ring-1 ring-prel-glass-border md:-mt-14 md:p-10 md:px-12">
          {lead ? (
            <p className="text-[17px] leading-relaxed text-prel-secondary-label md:text-[18px]">
              {lead}
            </p>
          ) : null}
          {ctaRow ? (
            <div className="mt-6 flex flex-wrap gap-3 border-b border-prel-separator pb-8">
              {ctaRow}
            </div>
          ) : null}
          <div
            className={`marketing-prose marketing-stagger-children ${lead || ctaRow ? "mt-8" : ""}`}
          >
            {children}
          </div>
        </div>
      </div>

      <MarketingRelatedStrip />
    </div>
  );
}
