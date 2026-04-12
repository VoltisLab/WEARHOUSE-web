/**
 * Help Centre IA — aligned with PreluraSwift HELP_CENTRE_FEATURE_INVENTORY.md
 * and Constants.help* URL slugs (hosted help host mirrors these paths).
 */

export type HelpSidebarLink = {
  href: string;
  label: string;
  /** Only `pathname === href` counts as active (not child article paths). */
  matchExact?: boolean;
  /** Pathname matches any of these (exact or prefix) → active. */
  activePrefixes?: string[];
};

export const HELP_SIDEBAR_LINKS: HelpSidebarLink[] = [
  { href: "/help", label: "Help Centre", matchExact: true },
  { href: "/help/guide", label: "Complete app guide", matchExact: true },
  { href: "/help/selling", label: "Selling" },
  { href: "/help/buying", label: "Buying" },
  {
    href: "/help/orders-refunds",
    label: "Orders & delivery",
    activePrefixes: [
      "/help/cancel-order",
      "/help/refunds",
      "/help/delivery",
      "/help/order-shipped",
      "/help/collection-point",
      "/help/delivered-not-received",
      "/help/orders",
    ],
  },
  {
    href: "/help/profile-tools",
    label: "Profile & seller tools",
    activePrefixes: [
      "/help/lookbook-beta",
      "/help/seller-dashboard",
      "/help/favourites",
      "/help/multi-buy-discounts",
      "/help/vacation-mode",
      "/help/invite-friend",
      "/help/trusted-seller",
    ],
  },
  {
    href: "/help/account-app",
    label: "Account & app",
    activePrefixes: ["/help/how-to-use"],
  },
  { href: "/safety", label: "Trust and safety" },
];

export type HelpHomeTopicLink = {
  href: string;
  label: string;
  desc: string;
};

export type HelpHomeSection = {
  title: string;
  description?: string;
  links: HelpHomeTopicLink[];
};

/** Below the four featured cards on /help — deep links into guides and hubs. */
export const HELP_HOME_TOPIC_SECTIONS: HelpHomeSection[] = [
  {
    title: "Orders, delivery & refunds",
    description:
      "Pay with confidence: status, tracking, collection points, and when money moves back.",
    links: [
      {
        href: "/help/orders-refunds",
        label: "Orders & delivery hub",
        desc: "Overview and links to every order-related article.",
      },
      {
        href: "/help/cancel-order",
        label: "Cancel an order",
        desc: "When cancellation is available and what both sides see.",
      },
      {
        href: "/help/refunds",
        label: "Refunds",
        desc: "How reversals work after payment or disputes.",
      },
      {
        href: "/help/delivery",
        label: "Delivery timing",
        desc: "Home delivery vs pickup-style options at checkout.",
      },
      {
        href: "/help/order-shipped",
        label: "Shipped & tracking",
        desc: "Following tracking and delivery notifications.",
      },
      {
        href: "/help/collection-point",
        label: "Collection points",
        desc: "What a collection-point delivery choice means.",
      },
      {
        href: "/help/delivered-not-received",
        label: "Says delivered — not received",
        desc: "Structured help when tracking shows delivered without the parcel.",
      },
      {
        href: "/help/orders",
        label: "Orders list (bought & sold)",
        desc: "Purchases vs sales and opening order detail in the app.",
      },
    ],
  },
  {
    title: "Profile menu & seller tools",
    description:
      "Everything behind Profile → Menu: dashboard, lookbook, discounts, vacation, invites.",
    links: [
      {
        href: "/help/profile-tools",
        label: "Profile & seller tools hub",
        desc: "One index for Lookbook, dashboard, favourites, and more.",
      },
      {
        href: "/help/lookbook-beta",
        label: "Lookbook (beta)",
        desc: "Feed, create, and how lookbook fits next to your listings.",
      },
      {
        href: "/help/seller-dashboard",
        label: "Seller dashboard",
        desc: "Shop performance, earnings, and withdrawals.",
      },
      {
        href: "/help/favourites",
        label: "Favourites",
        desc: "Saved items from Menu or Discover’s heart shortcut.",
      },
      {
        href: "/help/multi-buy-discounts",
        label: "Multi-buy discounts",
        desc: "Seller rules that reward multi-item baskets.",
      },
      {
        href: "/help/vacation-mode",
        label: "Vacation mode",
        desc: "Pause listings while you’re away.",
      },
      {
        href: "/help/invite-friend",
        label: "Invite a friend",
        desc: "Share your invite link from Menu or Settings.",
      },
      {
        href: "/help/trusted-seller",
        label: "Trusted seller badge",
        desc: "Trust signals buyers see and how eligibility works.",
      },
    ],
  },
  {
    title: "Account, app & getting started",
    description:
      "Sign-in, guest mode, verification, onboarding, and the big-picture tour.",
    links: [
      {
        href: "/help/account-app",
        label: "Account & app hub",
        desc: "Auth, guest browsing, settings, and safety nets.",
      },
      {
        href: "/help/how-to-use",
        label: "How to use WEARHOUSE",
        desc: "Editorial walkthrough of tabs, buying, and selling.",
      },
      {
        href: "/how-it-works",
        label: "How it works (site tour)",
        desc: "Journeys on web and app from the marketing site.",
      },
    ],
  },
];
