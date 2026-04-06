import { BRAND_WORDMARK } from "@/lib/branding";
import { fontBrandWordmark } from "@/lib/fonts";

type Props = {
  className?: string;
  as?: "span" | "div";
};

/**
 * WEARHOUSE logotype using Nunito Black (weight 900).
 */
export function BrandWordmark({ className = "", as: Tag = "span" }: Props) {
  return (
    <Tag className={`${fontBrandWordmark.className} ${className}`.trim()}>
      {BRAND_WORDMARK}
    </Tag>
  );
}
