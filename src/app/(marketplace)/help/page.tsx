import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarketingHubShell } from "@/components/marketing/MarketingHubShell";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";
import { HelpCircle, Package, ShoppingBag, Shield } from "lucide-react";
import { HELP_HOME_TOPIC_SECTIONS } from "@/lib/help-centre-nav";

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
    imageSrc: DOC_PAGE_HERO.helpSelling,
  },
  {
    href: "/help/buying",
    title: "Buying",
    desc: "Discovery, checkout, delivery, claims, and leaving useful reviews.",
    Icon: ShoppingBag,
    imageClass: "object-[center_20%]",
    imageSrc: DOC_PAGE_HERO.helpBuying,
  },
  {
    href: "/safety",
    title: "Trust and safety",
    desc: "Scams, reporting, counterfeits, and how we enforce community rules.",
    Icon: Shield,
    imageClass: "object-left",
    imageSrc: DOC_PAGE_HERO.safety,
  },
  {
    href: "/how-it-works",
    title: "How WEARHOUSE works",
    desc: "End-to-end journeys for sellers and buyers on web and app.",
    Icon: HelpCircle,
    imageClass: "object-right",
    imageSrc: DOC_PAGE_HERO.howItWorks,
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
      heroImage={DOC_PAGE_HERO.helpHome}
    >
      <div className="space-y-12">
        <p className="max-w-3xl text-[17px] leading-relaxed text-prel-secondary-label md:text-[18px]">
          These articles are written to match the <strong>iPhone app</strong>{" "}
          (tabs, Profile → Menu, Sell form, Orders, Help Centre). The web
          marketplace may differ in places — when a step says “tap”, it means
          the app. For account-specific issues, use{" "}
          <strong>Help Centre → Start a conversation</strong> in the app so
          agents can see orders and messages.
        </p>

        <Link
          href="/help/guide"
          className="block rounded-2xl bg-[var(--prel-primary)] px-6 py-5 text-white transition hover:brightness-110 md:px-8 md:py-6"
        >
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
            Master reference
          </p>
          <p className="mt-2 text-[20px] font-bold leading-snug md:text-[22px]">
            Complete app guide
          </p>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-white/90">
            Every topic from the product team&apos;s{" "}
            <strong>HELP_CENTRE_FEATURE_INVENTORY</strong> — 66 features with why /
            steps / tips, plus in-app help URLs and device QA checklists.
          </p>
          <span className="mt-4 inline-block text-[14px] font-semibold underline underline-offset-2">
            Open the full guide →
          </span>
        </Link>

        <ul className="marketing-stagger-children grid gap-5 sm:grid-cols-2">
          {CARDS.map(({ href, title, desc, Icon, imageClass, imageSrc }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped"
              >
                <div className="relative h-36 w-full overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    className={`object-cover transition duration-700 ease-out group-hover:scale-105 ${imageClass}`}
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-[var(--prel-primary)] backdrop-blur-sm">
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

        <div className="space-y-10">
          <div
            id="browse-topics"
            className="scroll-mt-28 pt-10"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-prel-tertiary-label">
              Browse by topic
            </h2>
            <p className="mt-2 max-w-3xl text-[17px] leading-relaxed text-prel-secondary-label md:text-[18px]">
              Step-by-step help aligned with the in-app experience (tabs, Menu
              rows, and Settings). Open a hub or jump straight to an article —
              URLs match the mobile Help Centre where noted in our inventory.
            </p>
          </div>

          {HELP_HOME_TOPIC_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl bg-white p-6 md:p-8"
            >
              <h3 className="text-[20px] font-bold text-prel-label">
                {section.title}
              </h3>
              {section.description ? (
                <p className="mt-2 text-[15px] leading-relaxed text-prel-secondary-label">
                  {section.description}
                </p>
              ) : null}
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex h-full flex-col rounded-xl bg-prel-bg-grouped/60 p-4 transition hover:bg-prel-bg-grouped"
                    >
                      <span className="text-[15px] font-bold text-prel-label">
                        {link.label}
                      </span>
                      <span className="mt-1 flex-1 text-[13px] leading-relaxed text-prel-secondary-label">
                        {link.desc}
                      </span>
                      <span className="mt-3 text-[12px] font-semibold text-[var(--prel-primary)]">
                        Open →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white p-6 md:p-10">
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

        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[21/8] min-h-[120px] w-full sm:aspect-[21/6]">
            <Image
              src={DOC_PAGE_HERO.helpBottomStrip}
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
