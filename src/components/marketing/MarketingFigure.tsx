import Image from "next/image";
import { figureHeroForCaption } from "@/lib/marketing-hero-registry";

/**
 * In-article wide visual — image is chosen from the marketing hero pool (by caption hash) or overridden.
 */
export function MarketingFigure({
  caption,
  objectPosition = "center",
  imageSrc,
}: {
  caption: string;
  objectPosition?: string;
  /** Optional fixed asset under `/public` (e.g. from `HEROES` registry). */
  imageSrc?: string;
}) {
  const src = imageSrc ?? figureHeroForCaption(caption);
  return (
    <figure className="my-10 overflow-hidden rounded-2xl bg-prel-bg-grouped shadow-none">
      <div className="relative aspect-[2/1] w-full max-h-[320px] sm:aspect-[21/9]">
        <Image
          src={src}
          alt=""
          fill
          className={`object-cover ${objectPosition}`}
          sizes="(max-width: 768px) 100vw, 720px"
        />
      </div>
      <figcaption className="bg-white px-4 py-3 text-[13px] leading-snug text-prel-secondary-label">
        {caption}
      </figcaption>
    </figure>
  );
}
