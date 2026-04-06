export const PUBLIC_WEB_BASE =
  process.env.NEXT_PUBLIC_PUBLIC_WEB_URL ?? "https://prelura.uk";

export const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI ??
  "https://prelura.voltislabs.uk/graphql/";

/** Hostname for link labels (still uses `PUBLIC_WEB_BASE` href). */
export function publicWebHostname(): string {
  try {
    return new URL(PUBLIC_WEB_BASE).hostname;
  } catch {
    return "website";
  }
}

/** Optional `wss://…` endpoint for GraphQL subscriptions (`graphql-ws`). */
export const GRAPHQL_WS_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_URI?.trim() ?? "";

/**
 * Optional `wss://host` (no path) for Django Channels chat + inbox.
 * Defaults to the same host as `NEXT_PUBLIC_GRAPHQL_URI`.
 */
export const CHAT_WS_ORIGIN_HINT = process.env.NEXT_PUBLIC_CHAT_WS_ORIGIN?.trim() ?? "";

export function publicProfileUrl(username: string) {
  const u = encodeURIComponent(username);
  return `${PUBLIC_WEB_BASE}/profile/${u}`;
}

/** Universal link path uses listing code when present (Item.publicWebItemSlug). */
export function publicItemUrl(listingCode: string | null | undefined, productId: number) {
  const slug = (listingCode?.trim() || String(productId)).trim();
  return `${PUBLIC_WEB_BASE}/item/${encodeURIComponent(slug)}`;
}

/** Legacy numeric path — prefer publicItemUrl when listing code exists. */
export function publicProductUrl(productId: number) {
  return `${PUBLIC_WEB_BASE}/product/${productId}`;
}
