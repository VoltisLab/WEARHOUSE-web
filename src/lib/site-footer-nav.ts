/** Site map mirroring common marketplace footer structure (link targets are WEARHOUSE pages). */
export type FooterColumn = {
  title: string;
  links: { href: string; label: string }[];
};

export const SITE_FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "WEARHOUSE",
    links: [
      { href: "/about", label: "About us" },
      { href: "/sustainability", label: "Sustainability" },
      { href: "/press", label: "Press" },
      { href: "/advertising", label: "Advertising" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/item-verification", label: "Item verification" },
      { href: "/app", label: "Mobile apps" },
      { href: "/infoboard", label: "Infoboard" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/help", label: "Help Centre" },
      { href: "/help/selling", label: "Selling" },
      { href: "/help/buying", label: "Buying" },
      { href: "/safety", label: "Trust and safety" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Centre" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/our-platform", label: "Our Platform" },
    ],
  },
];
