import Image from "next/image";
import { MARKETING_HERO_IMAGE } from "@/lib/marketing-constants";

type HeroPos = "center" | "top" | "right" | "left" | "bottom";

const posClass: Record<HeroPos, string> = {
  center: "object-center",
  top: "object-top",
  right: "object-right",
  left: "object-left",
  bottom: "object-bottom",
};

export function MarketingPageHero({
  title,
  eyebrow,
  subtitle,
  updated,
  imageSrc = MARKETING_HERO_IMAGE,
  imagePosition = "center",
  minHeightClass = "min-h-[min(52vh,420px)]",
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  updated?: string;
  imageSrc?: string;
  imagePosition?: HeroPos;
  minHeightClass?: string;
}) {
  return (
    <header
      className={`relative isolate ${minHeightClass} overflow-hidden`}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        className={`marketing-hero-drift ${posClass[imagePosition]}`}
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1a0520]/92 via-[#3d0f4a]/78 to-[#ab28b2]/45"
        aria-hidden
      />
      <div
        className="marketing-hero-grain absolute inset-0 opacity-[0.12] mix-blend-overlay"
        aria-hidden
      />
      <div
        className={`relative z-[1] mx-auto flex ${minHeightClass} max-w-7xl flex-col justify-end px-4 pb-12 pt-24 md:px-8 lg:px-10`}
      >
        {eyebrow ? (
          <p className="mb-3 inline-flex w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-[1.08] tracking-tight text-white">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-white/85 md:text-[17px]">
            {subtitle}
          </p>
        ) : null}
        {updated ? (
          <p className="mt-3 text-[13px] font-medium text-white/70">
            Last updated {updated}
          </p>
        ) : null}
      </div>
    </header>
  );
}
