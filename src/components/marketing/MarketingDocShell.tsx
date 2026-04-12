import type { ReactNode } from "react";
import { MarketingPageHero } from "@/components/marketing/MarketingPageHero";
import { MarketingRelatedStrip } from "@/components/marketing/MarketingRelatedStrip";
import { HEROES } from "@/lib/marketing-hero-registry";

type HeroPos = "center" | "top" | "right" | "left" | "bottom";

export function MarketingDocShell({
  title,
  eyebrow,
  subtitle,
  updated,
  lead,
  heroImage = HEROES.fashionStudio,
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
    <div className="pb-0">
      <MarketingPageHero
        title={title}
        eyebrow={eyebrow}
        subtitle={subtitle}
        updated={updated}
        imageSrc={heroImage}
        imagePosition={heroPosition}
      />

      <section className="relative bg-prel-bg-grouped px-4 pt-10 pb-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-none md:p-10 md:px-12">
          {lead ? (
            <p className="text-[17px] leading-relaxed text-prel-secondary-label md:text-[18px]">
              {lead}
            </p>
          ) : null}
          {ctaRow ? (
            <div className="mt-6 flex flex-wrap gap-3 pb-8">
              {ctaRow}
            </div>
          ) : null}
          <div
            className={`marketing-prose marketing-stagger-children ${lead || ctaRow ? "mt-8" : ""}`}
          >
            {children}
          </div>
        </div>
      </section>

      <MarketingRelatedStrip />
    </div>
  );
}
