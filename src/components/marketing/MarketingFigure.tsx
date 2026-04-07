import Image from "next/image";
import { MARKETING_HERO_IMAGE } from "@/lib/marketing-constants";

/**
 * In-article wide visual — reuses the marketplace hero asset with a different crop.
 */
export function MarketingFigure({
  caption,
  objectPosition = "center",
}: {
  caption: string;
  objectPosition?: string;
}) {
  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-prel-bg-grouped shadow-ios ring-1 ring-prel-glass-border">
      <div className="relative aspect-[2/1] w-full max-h-[320px] sm:aspect-[21/9]">
        <Image
          src={MARKETING_HERO_IMAGE}
          alt=""
          fill
          className={`object-cover ${objectPosition}`}
          sizes="(max-width: 768px) 100vw, 720px"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="border-t border-prel-separator bg-white px-4 py-3 text-[13px] leading-snug text-prel-secondary-label">
        {caption}
      </figcaption>
    </figure>
  );
}
