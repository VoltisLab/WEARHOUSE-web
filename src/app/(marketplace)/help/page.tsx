import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingHubShell } from "@/components/marketing/MarketingHubShell";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";
import { MARKETING_HERO_IMAGE } from "@/lib/marketing-constants";
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
    desc: "Listings, pricing, shipping, payouts, and growing a trusted shop.",
    Icon: Package,
    imageClass: "object-[center_35%]",
  },
  {
    href: "/help/buying",
    title: "Buying",
    desc: "Discovery, checkout, delivery, claims, and leaving useful reviews.",
    Icon: ShoppingBag,
    imageClass: "object-[center_20%]",
  },
  {
    href: "/safety",
    title: "Trust and safety",
    desc: "Scams, reporting, counterfeits, and how we enforce community rules.",
    Icon: Shield,
    imageClass: "object-left",
  },
  {
    href: "/how-it-works",
    title: "How WEARHOUSE works",
    desc: "End-to-end journeys for sellers and buyers on web and app.",
    Icon: HelpCircle,
    imageClass: "object-right",
  },
] as const;

export default function HelpCentrePage() {
  return (
    <MarketingHubShell
      eyebrow="Support"
      title="Help Centre"
      subtitle="Deep guides for the moments that matter - before you list, when you pay, and after the parcel lands."
      updated="April 2026"
      heroPosition="center"
    >
      <div className="-mt-10 space-y-12 pb-8">
        <p className="max-w-3xl text-[17px] leading-relaxed text-prel-secondary-label md:text-[18px]">
          These articles mirror how members actually use {BRAND_NAME}: fast
          answers up front, scenarios below, and links into policy pages when
          the law or platform rules matter. For account-specific issues, route
          through in-app support so agents can see orders and messages.
        </p>

        <ul className="marketing-stagger-children grid gap-5 sm:grid-cols-2">
          {CARDS.map(({ href, title, desc, Icon, imageClass }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] ring-1 ring-prel-glass-border transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-12px_rgba(0,0,0,0.18)] hover:ring-[var(--prel-primary)]/25"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={MARKETING_HERO_IMAGE}
                    alt=""
                    fill
                    className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${imageClass}`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-[var(--prel-primary)] shadow-ios backdrop-blur-sm">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                </div>
                <span className="flex flex-1 flex-col px-5 pb-5 pt-4">
                  <span className="text-[18px] font-bold text-prel-label transition group-hover:text-[var(--prel-primary)]">
                    {title}
                  </span>
                  <span className="mt-2 flex-1 text-[14px] leading-relaxed text-prel-secondary-label">
                    {desc}
                  </span>
                  <span className="mt-4 text-[13px] font-semibold text-[var(--prel-primary)]">
                    Open guide →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-10">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-prel-tertiary-label">
            Quick answers
          </h2>
          <p className="mt-2 text-[22px] font-bold text-prel-label">
            Before you open a ticket
          </p>
          <div className="mt-6 space-y-1">
            <MarketingDetails title="I paid but the seller never shipped - what now?">
              <p>
                Open the order from your purchases tab and start the official
                help flow. Upload evidence (screenshots of chat, promised ship
                dates). Avoid chargebacks before exhausting in-platform steps -
                they can complicate seller payouts and your own account standing.
              </p>
            </MarketingDetails>
            <MarketingDetails title="Can I complete payment outside WEARHOUSE?">
              <p>
                No. Off-platform payments remove protections and violate our
                rules. If someone asks, report the message and cease the trade.
              </p>
            </MarketingDetails>
            <MarketingDetails title="How do I prove an item is authentic?">
              <p>
                Provide label photos, receipt if available, and macro shots of
                hardware/stitching. Optional verification programmes - when live
                in your region - appear at listing or checkout. Read{" "}
                <Link
                  href="/item-verification"
                  className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
                >
                  Item verification
                </Link>{" "}
                for programme detail.
              </p>
            </MarketingDetails>
            <MarketingDetails title="Where are policy updates announced?">
              <p>
                Check the <Link href="/infoboard" className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline">Infoboard</Link>{" "}
                for operational updates and the{" "}
                <Link href="/terms" className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline">Terms</Link>{" "}
                for binding changes with effective dates.
              </p>
            </MarketingDetails>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl ring-1 ring-prel-glass-border">
          <div className="relative aspect-[21/8] min-h-[120px] w-full sm:aspect-[21/6]">
            <Image
              src={MARKETING_HERO_IMAGE}
              alt=""
              fill
              className="object-cover object-[center_40%]"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#1a0520]/90 via-[#3d0f4a]/65 to-transparent"
              aria-hidden
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-6 py-6 md:px-12">
            <p className="max-w-lg text-[18px] font-bold leading-snug text-white md:text-[20px]">
              Still stuck? Support can see live order state - describe what you
              tapped, what you expected, and what happened instead.
            </p>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/85">
              This Help Centre is general guidance only and does not replace
              professional or legal advice.
            </p>
          </div>
        </div>
      </div>
    </MarketingHubShell>
  );
}
