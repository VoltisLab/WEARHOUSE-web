import { BRAND_NAME } from "@/lib/branding";
import {
  HELP_ARTICLES,
  HELP_ARTICLE_SLUGS,
  type HelpArticleDoc,
} from "@/lib/help-centre-articles";
import {
  HELP_HOME_TOPIC_SECTIONS,
  HELP_SIDEBAR_LINKS,
} from "@/lib/help-centre-nav";
import {
  IN_APP_HELP_INTRO,
  IN_APP_HELP_LEGAL_NOTE,
  IN_APP_HELP_URL_ROWS,
  PERSONA_QA_GROUPS,
  PERSONA_QA_INTRO,
} from "@/lib/help-centre-inventory-appendix";
import { INVENTORY_GUIDE_GROUPS } from "@/lib/help-centre-inventory-guide-data";
import {
  INVENTORY_DOC_PROLOGUE,
  INVENTORY_MANIFEST_SECTIONS,
} from "@/lib/help-centre-inventory-manifest-data";

export type HelpSearchHit = {
  href: string;
  title: string;
  snippet: string;
};

type IndexEntry = {
  href: string;
  title: string;
  snippet: string;
  haystack: string;
};

function articleHaystack(doc: HelpArticleDoc): string {
  const parts = [doc.title, doc.description, doc.lead ?? ""];
  for (const s of doc.sections) {
    if (s.heading) parts.push(s.heading);
    s.paragraphs?.forEach((p) => parts.push(p));
    s.steps?.forEach((st) => parts.push(st));
    s.bullets?.forEach((b) => parts.push(b));
  }
  return parts.join("\n");
}

/** Long-form hub copy for recall (not shown in UI). */
const HELP_HUB_ENTRIES: IndexEntry[] = [
  {
    href: "/help/selling",
    title: "Selling on WEARHOUSE",
    snippet:
      "Listings, pricing, shipping, payouts, and growing a trusted shop.",
    haystack: [
      "Selling on WEARHOUSE",
      "Listings that convert, shipping that protects, and payouts without surprises.",
      `Selling on ${BRAND_NAME} rewards clarity: buyers who trust your photos and descriptions check out faster, leave stronger reviews, and generate fewer claims.`,
      "Sell tab Upload Sell an item 20 photos draft Item Details Describe your item Item Information Category Brand Condition Colours Size Additional Details Measurements Material Style Pricing Shipping Parcel Size discount buyer pays postage Brand New With Tags Heavily Used",
    ].join("\n"),
  },
  {
    href: "/help/buying",
    title: "Buying on WEARHOUSE",
    snippet:
      "Discovery, checkout, delivery, claims, and leaving useful reviews.",
    haystack: [
      "Buying on WEARHOUSE",
      "From discovery to delivery - how to shop second-hand with confidence.",
      `Buying pre-loved fashion should feel exciting, not risky. Pay only through ${BRAND_NAME}, chat, claims, evidence moderators reviews.`,
      "Buy now Send an offer checkout delivery tracking disputes refunds reviews Try Cart Shop All Profile Menu Orders",
    ].join("\n"),
  },
  {
    href: "/help/orders-refunds",
    title: "Orders & delivery",
    snippet:
      "Track purchases and sales, understand delivery choices, and fix stuck refunds.",
    haystack: [
      "Orders delivery refunds tracking",
      `These guides mirror the flows in the ${BRAND_NAME} app: Order detail, tracking, cancellation where allowed, and help when tracking says delivered but you have no parcel.`,
      "Orders, delivery, tracking, collection points, and refunds",
    ].join("\n"),
  },
  {
    href: "/help/profile-tools",
    title: "Profile & seller tools",
    snippet:
      "Lookbook, seller dashboard, favourites, multi-buy, vacation mode, and invites.",
    haystack: [
      "Profile Menu seller tools",
      "Everything behind Profile → Menu: dashboard, lookbook, discounts, vacation, and more.",
      `Use this index when you know the feature lives in the Profile menu (three lines, top right) on ${BRAND_NAME}.`,
      "Lookbook dashboard favourites multi-buy vacation invite",
    ].join("\n"),
  },
  {
    href: "/help/account-app",
    title: "Account & app",
    snippet:
      "Authentication, guest browsing, verification, onboarding, and settings.",
    haystack: [
      "Account app settings sign in sign up guest verification onboarding",
      "Authentication, guest browsing, verification, onboarding, and where settings live.",
      `Covers the start of every journey on ${BRAND_NAME}: from Welcome back through first tabs and the Settings gear in Profile → Menu.`,
      "Sign up, guest mode, verification, onboarding, and settings",
    ].join("\n"),
  },
];

function mergeEntry(map: Map<string, IndexEntry>, e: IndexEntry) {
  const cur = map.get(e.href);
  if (!cur) {
    map.set(e.href, { ...e });
    return;
  }
  map.set(e.href, {
    href: e.href,
    title: cur.title,
    snippet: cur.snippet.length >= e.snippet.length ? cur.snippet : e.snippet,
    haystack: `${cur.haystack}\n${e.haystack}`,
  });
}

const SEARCH_INDEX: IndexEntry[] = (() => {
  const map = new Map<string, IndexEntry>();

  for (const slug of HELP_ARTICLE_SLUGS) {
    const doc = HELP_ARTICLES[slug];
    mergeEntry(map, {
      href: `/help/${slug}`,
      title: doc.title,
      snippet: doc.description,
      haystack: articleHaystack(doc),
    });
  }

  for (const h of HELP_HUB_ENTRIES) mergeEntry(map, h);

  for (const sec of HELP_HOME_TOPIC_SECTIONS) {
    for (const l of sec.links) {
      mergeEntry(map, {
        href: l.href,
        title: l.label,
        snippet: l.desc,
        haystack: [l.label, l.desc, sec.title, sec.description ?? ""].join(
          "\n",
        ),
      });
    }
  }

  for (const s of HELP_SIDEBAR_LINKS) {
    if (s.href === "/help") continue;
    mergeEntry(map, {
      href: s.href,
      title: s.label,
      snippet: `Help: ${s.label}`,
      haystack: `${s.label} help ${BRAND_NAME} support`,
    });
  }

  mergeEntry(map, {
    href: "/help",
    title: "Help Centre home",
    snippet: "All guides, topic hubs, and quick answers.",
    haystack: `Help Centre support guides ${BRAND_NAME} FAQ topics`,
  });

  const inventoryGuideHaystack = INVENTORY_GUIDE_GROUPS.flatMap((g) =>
    g.items.flatMap((f) => [
      f.title,
      f.why,
      ...f.steps,
      f.expect ?? "",
      f.goodToKnow ?? "",
    ]),
  ).join("\n");

  const inventoryManifestHaystackParts: string[] = [...INVENTORY_DOC_PROLOGUE];
  for (const sec of INVENTORY_MANIFEST_SECTIONS) {
    inventoryManifestHaystackParts.push(sec.title);
    for (const b of sec.blocks) {
      switch (b.type) {
        case "paragraph":
        case "h3":
        case "code":
          inventoryManifestHaystackParts.push(b.text);
          break;
        case "list":
        case "ordered":
          inventoryManifestHaystackParts.push(...b.items);
          break;
        case "table":
          if (b.headers) inventoryManifestHaystackParts.push(...b.headers);
          for (const row of b.rows) inventoryManifestHaystackParts.push(...row);
          break;
        default:
          break;
      }
    }
  }
  const inventoryManifestHaystack = inventoryManifestHaystackParts.join("\n");

  const inventoryAppendixHaystack = [
    ...IN_APP_HELP_INTRO,
    ...IN_APP_HELP_LEGAL_NOTE,
    PERSONA_QA_INTRO,
    ...PERSONA_QA_GROUPS.flatMap((g) => [g.title, ...g.items]),
    ...IN_APP_HELP_URL_ROWS.flatMap((r) => [r.constant, r.path]),
  ].join("\n");

  const inventoryHaystack = [
    inventoryGuideHaystack,
    inventoryManifestHaystack,
    inventoryAppendixHaystack,
  ].join("\n");

  mergeEntry(map, {
    href: "/help/guide",
    title: "Complete app guide",
    snippet:
      "Full HELP_CENTRE_FEATURE_INVENTORY.md on the web — features, QA, URLs, DNS, Swift views, modals, services, authoring.",
    haystack: `inventory feature guide master list ${BRAND_NAME} iPhone DNS TLS navigation Swift views modals services persona QA Constants help URLs ${inventoryHaystack}`,
  });

  return Array.from(map.values());
})();

/**
 * Keyword search across help articles, hubs, topic links, and main nav destinations.
 * Minimum query length: 2 characters.
 */
export function searchHelpCentre(query: string, limit = 12): HelpSearchHit[] {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < 2) return [];

  const terms = normalized.split(/\s+/).filter((t) => t.length >= 2);
  if (terms.length === 0) return [];

  const scored: { entry: IndexEntry; score: number }[] = [];

  for (const entry of SEARCH_INDEX) {
    const titleLower = entry.title.toLowerCase();
    const hayLower = entry.haystack.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (titleLower.includes(term)) score += 28;
      else if (hayLower.includes(term)) score += 6;
    }
    if (score > 0) scored.push({ entry, score });
  }

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(({ entry }) => ({
    href: entry.href,
    title: entry.title,
    snippet:
      entry.snippet.length > 160
        ? `${entry.snippet.slice(0, 157)}…`
        : entry.snippet,
  }));
}
