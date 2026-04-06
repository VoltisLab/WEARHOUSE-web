export const PUBLIC_WEB_BASE =
  process.env.NEXT_PUBLIC_PUBLIC_WEB_URL ?? "https://mywearhouse.com";

export const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI ??
  "https://prelura.voltislabs.uk/graphql/";

/**
 * Marketplace home hero background (full-bleed under overlay + copy).
 * Override with `NEXT_PUBLIC_HOME_HERO_IMAGE_URL` (any URL or `/path` under public).
 */
export const MARKETPLACE_HOME_HERO_IMAGE_URL =
  process.env.NEXT_PUBLIC_HOME_HERO_IMAGE_URL?.trim() ||
  "/marketplace/hero-banner.jpg";

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

/** App Store / Play Store listing URLs (set in env for production). */
export const IOS_APP_STORE_URL =
  process.env.NEXT_PUBLIC_IOS_APP_URL?.trim() || "";
export const ANDROID_PLAY_STORE_URL =
  process.env.NEXT_PUBLIC_ANDROID_APP_URL?.trim() || "";

/** Badge image sources (decorative; links use env URLs above). */
export const APP_STORE_BADGE_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg";
export const GOOGLE_PLAY_BADGE_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";
