/** Marketplace health heuristic (same formula as consumer app). */
export function marketplaceHealthScore(a: {
  newUsersPercentageChange?: number | null;
  totalProductViewsPercentageChange?: number | null;
}): { value: number; subtitle: string } {
  const nu = a.newUsersPercentageChange ?? 0;
  const pv = a.totalProductViewsPercentageChange ?? 0;
  const blend = (nu + pv) / 2;
  const base = 72;
  const swing = Math.min(25, Math.max(-25, Math.round(blend * 2)));
  const v = Math.min(98, Math.max(38, base + swing));
  const subtitle =
    "Heuristic from user-growth and listing-view momentum. Wire disputes and delivery KPIs when those admin metrics are exposed.";
  return { value: v, subtitle };
}
