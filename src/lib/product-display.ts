/** Generic backend enum / snake_case → readable words (e.g. `CASUAL` → `Casual`). */
export function humanizeEnumLabel(raw: string | null | undefined): string {
  const s = (raw ?? "").trim();
  if (!s) return "—";
  return s
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Normalise backend enum / accidental spaces → UPPER_SNAKE for matching. */
function normalizeConditionKey(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "_");
}

/**
 * Maps backend condition enums to sentence-style copy (never raw `GOOD_CONDITION`).
 * Unknown values become title-style words, not screaming snake_case.
 */
export function formatProductCondition(condition: string | null | undefined): string {
  const raw = (condition ?? "").trim();
  if (!raw) return "—";
  switch (normalizeConditionKey(raw)) {
    case "BRAND_NEW_WITH_TAGS":
      return "Brand new with tags";
    case "BRAND_NEW_WITHOUT_TAGS":
      return "Brand new without tags";
    case "EXCELLENT_CONDITION":
      return "Excellent condition";
    case "GOOD_CONDITION":
      return "Good condition";
    case "HEAVILY_USED":
      return "Heavily used";
    default:
      return humanizeEnumLabel(raw);
  }
}

/** Avoid "Size One Size" doubling (ItemDetailView.swift). */
export function sizeDisplayValue(size: string | null | undefined): string {
  const t = (size ?? "").trim();
  if (t.length > 5 && t.slice(0, 5).toLowerCase() === "size ") {
    return t.slice(5).trim() || t;
  }
  return t || "—";
}

/**
 * Listing `price` is the original; `discountPrice` when set & lower is the sale price.
 */
export function productPriceDisplay(
  price: number,
  discountPrice: number | null | undefined,
): { sale: number; original: number | null; percentOff: number | null } {
  const p = Number(price);
  const d = discountPrice != null ? Number(discountPrice) : 0;
  if (d > 0 && d < p && !Number.isNaN(p)) {
    const pct = Math.round(((p - d) / p) * 100);
    return { sale: d, original: p, percentOff: pct };
  }
  if (!Number.isNaN(p)) return { sale: p, original: null, percentOff: null };
  return { sale: 0, original: null, percentOff: null };
}

export function uniqueHashtagsInText(text: string): string[] {
  const re = /#[\p{L}\p{N}_]+/gu;
  const m = text.match(re) ?? [];
  return [...new Set(m)];
}

/** Rough colour name → CSS (Theme.productColor analogue). */
export function productColorCss(name: string): string | null {
  const n = name.trim().toLowerCase();
  const map: Record<string, string> = {
    black: "#1c1c1e",
    white: "#f2f2f7",
    grey: "#8e8e93",
    gray: "#8e8e93",
    red: "#ff3b30",
    blue: "#007aff",
    navy: "#1a237e",
    green: "#34c759",
    yellow: "#ffcc00",
    orange: "#ff9500",
    pink: "#ff2d55",
    purple: "#ab28b2",
    brown: "#8b4513",
    beige: "#e8dccd",
    cream: "#faf8f3",
    gold: "#d4af37",
    silver: "#c0c0c0",
    burgundy: "#722f37",
    khaki: "#c3b091",
    tan: "#d2b48c",
    multicolour: "linear-gradient(135deg,#ff3b30,#ff9500,#34c759,#007aff)",
    multicolor: "linear-gradient(135deg,#ff3b30,#ff9500,#34c759,#007aff)",
  };
  return map[n] ?? null;
}
