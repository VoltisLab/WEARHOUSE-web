import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/branding";
import { HelpCircle, Package, ShoppingBag, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Centre",
  description:
    "Help and support for WEARHOUSE buyers and sellers on the marketplace.",
};

const CARDS = [
  {
    href: "/help/selling",
    title: "Selling",
    desc: "Listings, pricing, shipping, and getting paid on WEARHOUSE.",
    Icon: Package,
  },
  {
    href: "/help/buying",
    title: "Buying",
    desc: "Finding items, paying safely, and what happens after you order.",
    Icon: ShoppingBag,
  },
  {
    href: "/safety",
    title: "Trust and safety",
    desc: "Reporting issues, staying safe, and how we protect the community.",
    Icon: Shield,
  },
  {
    href: "/how-it-works",
    title: "How WEARHOUSE works",
    desc: "A quick overview of buying and selling second-hand fashion.",
    Icon: HelpCircle,
  },
] as const;

export default function HelpCentrePage() {
  return (
    <div className="pb-8">
      <h1 className="text-[28px] font-bold tracking-tight text-prel-label md:text-[32px]">
        Help Centre
      </h1>
      <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-prel-secondary-label">
        Find answers about {BRAND_NAME}. These guides are written for our web
        marketplace and match how most members use the platform.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {CARDS.map(({ href, title, desc, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex gap-4 rounded-2xl border border-prel-separator bg-white p-5 shadow-ios transition hover:border-[var(--prel-primary)]/35 hover:shadow-md"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--prel-primary)]/12 text-[var(--prel-primary)]">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-[17px] font-bold text-prel-label group-hover:text-[var(--prel-primary)]">
                {title}
              </span>
              <span className="mt-1 block text-[14px] leading-snug text-prel-secondary-label">
                {desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-[13px] leading-relaxed text-prel-tertiary-label">
        Content is for general guidance only and does not replace professional
        or legal advice. For account-specific issues, contact support through
        your {BRAND_NAME} app or official channels.
      </p>
    </div>
  );
}
