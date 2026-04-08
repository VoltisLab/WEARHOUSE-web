/**
 * Stable “random” order for listing grids: same product id + seed always maps to the
 * same sort key, so when more pages load, existing cards keep their relative order
 * and new items slot in by their own keys (no full-grid jump).
 */

export function listingOrderKey(productId: number, seed: number): number {
  let h = Math.imul(seed >>> 0, 0x9e3779b9) ^ productId;
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  return h >>> 0;
}

export function sortListingRowsStableRandom<T extends { id: number }>(
  rows: T[],
  seed: number,
): T[] {
  return [...rows].sort(
    (a, b) => listingOrderKey(a.id, seed) - listingOrderKey(b.id, seed),
  );
}

/** Usernames (lowercase) that should see API order — useful for QA. */
export const MARKETPLACE_TEST_USERNAMES: string[] = (() => {
  const multi = process.env.NEXT_PUBLIC_MARKETPLACE_TEST_USERNAMES?.trim();
  if (multi) {
    return multi
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
  }
  const one = process.env.NEXT_PUBLIC_MARKETPLACE_TEST_USERNAME?.trim().toLowerCase();
  if (one) return [one];
  return ["testuser"];
})();
