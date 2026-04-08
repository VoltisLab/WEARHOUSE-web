/**
 * Mirrors MyPrelura `SellCategory.sizeApiPath` - backend `sizes(path)` uses the first two
 * path segments; Boys/Girls are normalized to Kids like the Swift app.
 */
export function computeSizeApiPath(
  leafFullPath: string | null | undefined,
  pathNames: string[],
): string {
  let raw: string;
  const fp = leafFullPath?.trim();
  if (fp) {
    const parts = fp.split(">").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      raw = `${parts[0]} > ${parts[1]}`;
    } else {
      raw = pathNames.slice(0, 2).join(" > ");
    }
  } else {
    raw = pathNames.slice(0, 2).join(" > ");
  }
  const lower = raw.toLowerCase();
  if (lower.startsWith("boys")) {
    return `Kids${raw.slice(4)}`;
  }
  if (lower.startsWith("girls")) {
    return `Kids${raw.slice(5)}`;
  }
  return raw;
}

export type SellSizeOption = { id: number; name: string };

function parseUKSize(name: string): number | null {
  const pre = "UK ";
  if (!name.startsWith(pre)) return null;
  const v = parseFloat(name.slice(pre.length).trim());
  return Number.isFinite(v) ? v : null;
}

const LETTER_ORDER = [
  "XXS",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
  "6XL",
  "7XL",
];

/** Same ordering as `SizeSelectionView.sortedSizesForDisplay` in SellView.swift. */
export function sortSizesForDisplay(list: SellSizeOption[]): SellSizeOption[] {
  return [...list].sort((a, b) => {
    const na = a.name.toUpperCase();
    const nb = b.name.toUpperCase();
    if (na === "ONE SIZE") return 1;
    if (nb === "ONE SIZE") return -1;

    const ukA = parseUKSize(na);
    const ukB = parseUKSize(nb);
    if (ukA != null || ukB != null) {
      if (ukA != null && ukB != null && ukA !== ukB) {
        return ukA - ukB;
      }
      if (ukA != null && ukB == null) return -1;
      if (ukA == null && ukB != null) return 1;
    }

    const ia = LETTER_ORDER.indexOf(na);
    const ib = LETTER_ORDER.indexOf(nb);
    const iaResolved = ia === -1 ? LETTER_ORDER.length : ia;
    const ibResolved = ib === -1 ? LETTER_ORDER.length : ib;
    if (iaResolved !== ibResolved) {
      return iaResolved - ibResolved;
    }

    const numA = Number.parseFloat(na);
    const numB = Number.parseFloat(nb);
    if (Number.isFinite(numA) && Number.isFinite(numB) && numA !== numB) {
      return numA - numB;
    }

    return na.localeCompare(nb);
  });
}
