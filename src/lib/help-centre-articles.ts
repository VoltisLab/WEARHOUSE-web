/**
 * Consumer help articles — sourced from HELP_CENTRE_FEATURE_INVENTORY.md (PreluraSwift).
 * Paths match `Constants.help*` slugs for parity with the iOS in-app WebView.
 */

export type HelpArticleSection = {
  heading?: string;
  paragraphs?: string[];
  /** Numbered “Step 1 …” lines */
  steps?: string[];
  bullets?: string[];
};

export type HelpArticleDoc = {
  title: string;
  description: string;
  lead?: string;
  sections: HelpArticleSection[];
};

export const HELP_ARTICLE_SLUGS = [
  "how-to-use",
  "cancel-order",
  "refunds",
  "delivery",
  "order-shipped",
  "collection-point",
  "delivered-not-received",
  "vacation-mode",
  "lookbook-beta",
  "seller-dashboard",
  "orders",
  "favourites",
  "multi-buy-discounts",
  "invite-friend",
  "trusted-seller",
] as const;

export type HelpArticleSlug = (typeof HELP_ARTICLE_SLUGS)[number];

export const HELP_ARTICLES: Record<HelpArticleSlug, HelpArticleDoc> = {
  "how-to-use": {
    title: "How to use WEARHOUSE",
    description:
      "Overview of tabs, shopping, selling, and where to find orders and messages.",
    lead: "WEARHOUSE is a pre-loved fashion marketplace. This guide follows the iPhone app: Profile → Menu is the full-screen list (with a gear icon for Settings). The website may differ in places — use these steps when you are in the app.",
    sections: [
      {
        heading: "Bottom tabs (iPhone)",
        bullets: [
          "Home — feed, category chips, search, notifications bell, AI shopping chat from the search row.",
          "Discover — curated rows, brands, member search, favourites shortcut (heart), Lookbook banner, Try Cart / Shop All (beta).",
          "Sell — Sell an item: up to 20 photos, title, Describe your item, category, brand, condition, colours, size, optional measurements/material/styles, price, optional discount price, parcel size, then Upload (or save and use Upload from drafts).",
          "Inbox — chats and offers; order updates and payment steps appear in threads when the app shows them.",
          "Profile — your shop; tap the three lines (top right) for Menu — Lookbook (Beta), Seller dashboard, Orders, Favourites, Multi-buy discounts, Vacation Mode, Invite Friend, Help Centre, About WEARHOUSE, Logout. Tap the gear on that Menu screen for Settings.",
        ],
      },
      {
        heading: "Buying at a glance",
        steps: [
          "Browse Home or Discover and open a listing.",
          "Tap Buy now or Send an offer; complete checkout in the app when you purchase.",
          "Track purchases from Profile → Menu → Orders (switch to your purchases at the top).",
        ],
      },
      {
        heading: "Selling at a glance",
        steps: [
          "Use the Sell tab to build a listing or resume a draft.",
          "Use Profile → Menu for Seller dashboard, Multi-buy discounts, Vacation Mode, and Help Centre.",
          "After a sale, confirm shipped from order detail when you hand the parcel to the carrier.",
        ],
      },
      {
        heading: "Help & support",
        paragraphs: [
          "Profile → Menu → Help Centre lists FAQ topics that match many pages on this site. Tap Start a conversation for in-app support chat. This website mirrors those articles for sharing in a browser.",
        ],
      },
    ],
  },
  "cancel-order": {
    title: "How can I cancel an existing order?",
    description:
      "Cancelling a WEARHOUSE order when the app allows it — buyer and seller paths.",
    lead: "Cancellation depends on order state. Always use in-app controls so both parties and payouts stay in sync.",
    sections: [
      {
        heading: "Buyer or seller",
        steps: [
          "Open Profile → Menu (three lines) → Orders and select the order.",
          "If Cancel order appears, tap it and follow the flow (buyer or seller request, depending on state).",
          "Confirm. Status updates in Orders and often in Inbox.",
        ],
      },
      {
        heading: "If money already moved",
        paragraphs: [
          "Refunds follow platform and payment rules and may take several days to appear on your statement. See the Refunds article for typical timing.",
        ],
      },
      {
        heading: "Good to know",
        bullets: [
          "Not every stage allows cancellation — options depend on fulfilment and payment state.",
          "Avoid arranging refunds outside the app; protections apply to in-platform flows only.",
        ],
      },
    ],
  },
  refunds: {
    title: "How long does a refund normally take?",
    description:
      "Refunds after cancellation, disputes, or failed delivery on WEARHOUSE.",
    lead: "Refunds are issued back to the original payment method unless support instructs otherwise. Banks and card networks add their own processing windows.",
    sections: [
      {
        heading: "What affects timing",
        bullets: [
          "Whether the payment was captured or only authorised.",
          "Your card issuer or bank’s settlement cycle (often several business days).",
          "Weekends, holidays, and risk or compliance checks in edge cases.",
        ],
      },
      {
        heading: "What you should do",
        steps: [
          "Check the order’s status in Profile → Menu → Orders.",
          "If status shows refunded but funds are missing, wait the full bank window, then contact your bank with the transaction reference.",
          "Use Help Centre → Start a conversation if the order state looks wrong versus what you experienced.",
        ],
      },
    ],
  },
  delivery: {
    title: "When will I receive my item?",
    description:
      "Delivery expectations for home delivery vs collection / pickup-style options.",
    lead: "Estimated delivery depends on the seller’s handling time, carrier, and the option you chose at checkout.",
    sections: [
      {
        heading: "At checkout",
        bullets: [
          "Home delivery — parcel ships to the address you provide; tracking may appear after the seller posts the item.",
          "Collection-point or pickup-style options — follow the carrier or location instructions shown after purchase.",
        ],
      },
      {
        heading: "If dates slip",
        steps: [
          "Message the seller once through the order or chat thread.",
          "If there is no meaningful update, use order help from the order detail screen.",
        ],
      },
    ],
  },
  "order-shipped": {
    title: "How will I know if my order has been shipped?",
    description:
      "Shipped, in transit, and tracking on WEARHOUSE orders.",
    lead: "You’ll see status updates on the order and may receive notifications when the seller confirms shipped or when tracking scans appear.",
    sections: [
      {
        heading: "In the app",
        steps: [
          "Open Profile → Menu → Orders, switch to purchases, and select the order.",
          "Open tracking when a tracking link or code is shown.",
          "Watch for push notifications if you enabled them under Settings → Notifications.",
        ],
      },
      {
        heading: "Seller side",
        paragraphs: [
          "Sellers should confirm shipped only after handing the parcel to the carrier. Buyers see that transition in the same order detail view.",
        ],
      },
    ],
  },
  "collection-point": {
    title: "What’s a collection point?",
    description:
      "Choosing pickup or collection-style delivery at checkout on WEARHOUSE.",
    lead: "Some listings support delivery to a locker, shop, or pickup point instead of your door. The checkout screen explains the carrier or partner when available.",
    sections: [
      {
        heading: "How it works",
        steps: [
          "At payment, pick the collection option if offered alongside home delivery.",
          "Complete purchase; follow any email or in-app instructions for the code or location.",
          "Collect within the carrier’s time window to avoid returns to sender.",
        ],
      },
    ],
  },
  "delivered-not-received": {
    title: "Item says “Delivered” but I don’t have it",
    description:
      "What to do when tracking shows delivered but the parcel hasn’t reached you.",
    lead: "Start with practical checks, then use the official order-help flow so support can see tracking and timestamps.",
    sections: [
      {
        heading: "Check first",
        bullets: [
          "Ask household members and neighbours; check safe places and building reception.",
          "Confirm the address on the order matches where you expected delivery.",
        ],
      },
      {
        heading: "Use order help",
        steps: [
          "Open the order from Profile → Menu → Orders.",
          "Choose the help path for delivery or item-not-received (wording may vary by build).",
          "Submit accurate details and photos if asked — moderators rely on this evidence.",
        ],
      },
    ],
  },
  "vacation-mode": {
    title: "What's Vacation mode?",
    description:
      "Pause your WEARHOUSE shop while you’re away.",
    lead: "Vacation mode hides active listings from normal shopping and can show a holiday message on your profile so buyers aren’t left waiting.",
    sections: [
      {
        heading: "Turn it on or off",
        steps: [
          "Open Profile → Menu (three lines, top right).",
          "Tap Vacation Mode (same wording as the menu row).",
          "Toggle on and save if prompted. The row shows On or Off next to Vacation Mode.",
        ],
      },
      {
        heading: "What buyers see",
        paragraphs: [
          "Your shop reflects that you’re away; discovery and search typically exclude vacation sellers until you return.",
        ],
      },
    ],
  },
  "lookbook-beta": {
    title: "Lookbook (beta)",
    description:
      "Outfit-style posts linked to real listings on WEARHOUSE.",
    lead: "Lookbook is a social layer for inspiration — it complements your listing grid; it doesn’t replace normal listings.",
    sections: [
      {
        heading: "Browse and create",
        steps: [
          "Open Profile → Menu → Lookbook (Beta), or open Discover and tap the Lookbook banner.",
          "Scroll the feed; open posts, like, comment, or share as the app allows.",
          "To publish, use upload flows to add media, tag products, and publish when you’re a seller or creator.",
        ],
      },
      {
        heading: "Good to know",
        bullets: [
          "Beta means behaviour may evolve; watch in-app prompts for changes.",
          "Lookbook settings live under Settings when you need to tune notifications or visibility.",
        ],
      },
    ],
  },
  "seller-dashboard": {
    title: "Seller dashboard",
    description:
      "Shop value, performance, earnings, and withdrawals on WEARHOUSE.",
    lead: "The seller dashboard (shop value) summarises how your shop is doing and links to money movement such as withdrawals.",
    sections: [
      {
        heading: "Open it",
        steps: [
          "Tap Profile → Menu (three lines) → Seller dashboard.",
          "Review sales-oriented metrics and shortcuts shown for your region.",
          "Use Withdraw or Payout when you’re ready to move balance to your bank (labels may vary by build).",
        ],
      },
      {
        heading: "Withdrawals",
        paragraphs: [
          "You need a valid payout method under Settings (gear on Menu) → Payments. Complete any security checks the app requests.",
        ],
      },
    ],
  },
  orders: {
    title: "Orders (bought and sold)",
    description:
      "One list for purchases and sales on WEARHOUSE.",
    lead: "Orders is the operational hub for tracking, shipping, feedback, and help.",
    sections: [
      {
        heading: "Open orders",
        steps: [
          "Profile → Menu (three lines) → Orders.",
          "Switch between purchases and sales with the control at the top of the list.",
          "Tap an order for detail — tracking, Cancel order when shown, confirm shipped (seller), help and feedback.",
        ],
      },
      {
        heading: "Order detail",
        bullets: [
          "Buyers: tracking, labels if provided, feedback after delivery, help if something’s wrong.",
          "Sellers: confirm shipped when posted, respond to issues, cancellation flows when allowed.",
        ],
      },
    ],
  },
  favourites: {
    title: "Favourites",
    description:
      "Your saved items across WEARHOUSE.",
    lead: "Favourites sync with your account so you can shortlist pieces without losing them in the feed.",
    sections: [
      {
        heading: "Save and view",
        steps: [
          "Tap the heart on a card or product page.",
          "Open Profile → Menu → Favourites, or tap the heart in Discover’s top bar.",
          "Tap an item to open it or remove it from favourites as the UI allows.",
        ],
      },
    ],
  },
  "multi-buy-discounts": {
    title: "Multi-buy discounts",
    description:
      "Seller-controlled savings when buyers take multiple pieces from your closet.",
    lead: "You define tiers; buyers who qualify see better pricing at checkout. The Menu row shows On or Off next to Multi-buy discounts.",
    sections: [
      {
        heading: "Configure",
        steps: [
          "Profile → Menu (three lines) → Multi-buy discounts.",
          "Turn rules on or off and set tiers as the form shows.",
          "Save so buyers see updated pricing on eligible baskets.",
        ],
      },
      {
        heading: "Buyer side",
        paragraphs: [
          "On a seller’s profile, tap Multi-buy to enter selection mode, tap listings to select them (at least two), then open the floating shopping bag to review Multi-buy checkout when the seller’s rules apply.",
        ],
      },
    ],
  },
  "invite-friend": {
    title: "Invite Friend",
    description:
      "Share WEARHOUSE with people you trust.",
    lead: "Invites use a standard share sheet so friends get a clean install and join path.",
    sections: [
      {
        heading: "Send an invite",
        steps: [
          "Open Profile → Menu → Invite Friend, or Settings (gear on Menu) → Invite Friend.",
          "Choose Messages, Mail, or another channel from the share sheet.",
          "Send the link your friend can use to install and join.",
        ],
      },
    ],
  },
  "trusted-seller": {
    title: "How do I earn a trusted seller badge?",
    description:
      "Trust signals buyers see on WEARHOUSE.",
    lead: "Eligibility is defined by platform rules — shipping history, reviews, verification, and policy compliance. The iOS app has no dedicated “trusted badge” settings screen; this article sets expectations only.",
    sections: [
      {
        heading: "What usually helps",
        bullets: [
          "Ship on time and confirm shipped accurately.",
          "Describe condition honestly; pack securely.",
          "Resolve issues in-platform; avoid off-platform payment requests.",
          "Complete identity or verification steps when WEARHOUSE asks.",
        ],
      },
      {
        heading: "Official criteria",
        paragraphs: [
          "Exact badge rules may change by region. Check current marketing copy in Discover and any in-app notices, or ask in-app support for the latest eligibility summary — there is no badge toggle in Settings.",
        ],
      },
    ],
  },
};
