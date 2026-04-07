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
  "/marketplace/hero-banner.png";

/**
 * Optional 3-up hero collage (defaults to `MARKETPLACE_HOME_HERO_IMAGE_URL`).
 * Set `NEXT_PUBLIC_HOME_HERO_COLLAGE_LEFT_URL`, `_CENTER_URL`, `_RIGHT_URL` for distinct photos.
 */
export const MARKETPLACE_HOME_HERO_COLLAGE_LEFT_URL =
  process.env.NEXT_PUBLIC_HOME_HERO_COLLAGE_LEFT_URL?.trim() ||
  MARKETPLACE_HOME_HERO_IMAGE_URL;
export const MARKETPLACE_HOME_HERO_COLLAGE_CENTER_URL =
  process.env.NEXT_PUBLIC_HOME_HERO_COLLAGE_CENTER_URL?.trim() ||
  MARKETPLACE_HOME_HERO_IMAGE_URL;
export const MARKETPLACE_HOME_HERO_COLLAGE_RIGHT_URL =
  process.env.NEXT_PUBLIC_HOME_HERO_COLLAGE_RIGHT_URL?.trim() ||
  MARKETPLACE_HOME_HERO_IMAGE_URL;

/**
 * Discover feed promotional banners (image + text overlay).
 * Each can be overridden; otherwise reuses the home hero asset.
 */
export const DISCOVER_BANNER_TRY_CART_IMAGE_URL =
  process.env.NEXT_PUBLIC_DISCOVER_TRY_CART_IMAGE_URL?.trim() ||
  "/marketplace/discover-try-cart-banner.png";
export const DISCOVER_BANNER_STYLE_IMAGE_URL =
  process.env.NEXT_PUBLIC_DISCOVER_STYLE_IMAGE_URL?.trim() ||
  "/marketplace/discover-shop-by-style-banner.png";
export const DISCOVER_BANNER_LOOKBOOKS_IMAGE_URL =
  process.env.NEXT_PUBLIC_DISCOVER_LOOKBOOKS_IMAGE_URL?.trim() ||
  MARKETPLACE_HOME_HERO_IMAGE_URL;

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

/** Badge assets (Vinted-style; links use env URLs or /app fallback). */
export const APP_STORE_BADGE_IMG = "/badges/app-store.svg";
export const GOOGLE_PLAY_BADGE_IMG = "/badges/google-play.svg";
