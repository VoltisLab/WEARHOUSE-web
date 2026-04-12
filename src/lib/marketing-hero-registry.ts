/**
 * Lifestyle / fashion hero imagery under `/public/marketing/heroes/`
 * (sourced from user-provided CompressImage.com packs).
 */

export const HEROES = {
  fashionStudio: "/marketing/heroes/hero-fashion-studio.jpg",
  editorialMirror: "/marketing/heroes/hero-editorial-mirror.jpg",
  streetStyle: "/marketing/heroes/hero-street-style.jpg",
  urbanWalk: "/marketing/heroes/hero-urban-walk.jpg",
  minimalPortrait: "/marketing/heroes/hero-minimal-portrait.jpg",
  atelier: "/marketing/heroes/hero-atelier.jpg",
  tailoring: "/marketing/heroes/hero-tailoring.jpg",
  boutique: "/marketing/heroes/hero-boutique.jpg",
  detailTexture: "/marketing/heroes/hero-detail-texture.jpg",
  runwayLight: "/marketing/heroes/hero-runway-light.jpg",
  windowDisplay: "/marketing/heroes/hero-window-display.jpg",
  accessories: "/marketing/heroes/hero-accessories.jpg",
  lifestyleA: "/marketing/heroes/hero-lifestyle-a.jpg",
  lifestyleB: "/marketing/heroes/hero-lifestyle-b.jpg",
  lifestyleC: "/marketing/heroes/hero-lifestyle-c.jpg",
} as const;

/** All paths for inline figures / hashing. */
export const HERO_IMAGE_POOL: string[] = Object.values(HEROES);

/** MarketingDocShell pages — distinct banner per route. */
export const DOC_PAGE_HERO = {
  about: HEROES.lifestyleA,
  accessibility: HEROES.detailTexture,
  advertising: HEROES.streetStyle,
  app: HEROES.windowDisplay,
  itemVerification: HEROES.tailoring,
  infoboard: HEROES.runwayLight,
  ourPlatform: HEROES.urbanWalk,
  press: HEROES.editorialMirror,
  sustainability: HEROES.lifestyleB,
  cookiePolicy: HEROES.minimalPortrait,
  privacy: HEROES.boutique,
  terms: HEROES.atelier,
  safety: HEROES.lifestyleC,
  howItWorks: HEROES.accessories,
  helpSelling: HEROES.tailoring,
  helpBuying: HEROES.boutique,
  helpOrdersRefunds: HEROES.streetStyle,
  helpProfileTools: HEROES.windowDisplay,
  helpAccountApp: HEROES.minimalPortrait,
  helpHome: HEROES.fashionStudio,
  helpBottomStrip: HEROES.editorialMirror,
} as const;

export type HelpArticleSlug =
  | "how-to-use"
  | "cancel-order"
  | "refunds"
  | "delivery"
  | "order-shipped"
  | "collection-point"
  | "delivered-not-received"
  | "vacation-mode"
  | "lookbook-beta"
  | "seller-dashboard"
  | "orders"
  | "favourites"
  | "multi-buy-discounts"
  | "invite-friend"
  | "trusted-seller";

/** One image per help article slug — no repeats. */
export const HELP_ARTICLE_HERO: Record<HelpArticleSlug, string> = {
  "how-to-use": HEROES.fashionStudio,
  "cancel-order": HEROES.atelier,
  refunds: HEROES.boutique,
  delivery: HEROES.urbanWalk,
  "order-shipped": HEROES.windowDisplay,
  "collection-point": HEROES.accessories,
  "delivered-not-received": HEROES.runwayLight,
  "vacation-mode": HEROES.lifestyleB,
  "lookbook-beta": HEROES.editorialMirror,
  "seller-dashboard": HEROES.tailoring,
  orders: HEROES.streetStyle,
  favourites: HEROES.minimalPortrait,
  "multi-buy-discounts": HEROES.detailTexture,
  "invite-friend": HEROES.lifestyleA,
  "trusted-seller": HEROES.lifestyleC,
};

export function helpArticleHeroImage(slug: string): string {
  const mapped = HELP_ARTICLE_HERO[slug as HelpArticleSlug];
  if (mapped) return mapped;
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h + slug.charCodeAt(i)) % HERO_IMAGE_POOL.length;
  return HERO_IMAGE_POOL[h] ?? HEROES.fashionStudio;
}

/** Deterministic inline figure image from caption (MarketingFigure). */
export function figureHeroForCaption(caption: string): string {
  let h = 0;
  for (let i = 0; i < caption.length; i++) {
    h = (h * 31 + caption.charCodeAt(i)) >>> 0;
  }
  return HERO_IMAGE_POOL[h % HERO_IMAGE_POOL.length] ?? HEROES.fashionStudio;
}
