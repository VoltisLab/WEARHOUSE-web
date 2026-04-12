import type { Metadata } from "next";
import Link from "next/link";
import { HelpHubLinkList } from "@/components/help/HelpHubLinkList";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { HELP_HOME_TOPIC_SECTIONS } from "@/lib/help-centre-nav";
import { BRAND_NAME } from "@/lib/branding";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";

export const metadata: Metadata = {
  title: "Orders & delivery",
  description: `Orders, delivery, tracking, collection points, and refunds on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped/90";

const links = HELP_HOME_TOPIC_SECTIONS[0]!.links;

export default function HelpOrdersRefundsHubPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Orders & delivery"
      subtitle="Track purchases and sales, understand delivery choices, and fix stuck refunds."
      updated="April 2026"
      lead={`These guides mirror the iPhone app: open orders from Profile → Menu → Orders, switch bought/sold at the top, then open an order for tracking, Cancel order when shown, refunds, and item-not-received help. Delivery type at checkout follows the same home vs collection-style options the app offers.`}
      heroPosition="top"
      heroImage={DOC_PAGE_HERO.helpOrdersRefunds}
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre home
          </Link>
          <Link href="/help/buying" className={btnSecondary}>
            Buying guide
          </Link>
        </>
      }
    >
      <h2>Articles</h2>
      <p>
        Pick a topic below. The same paths power in-app Help Centre links on
        iPhone.
      </p>
      <HelpHubLinkList links={links} skipHref="/help/orders-refunds" />
    </MarketingDocShell>
  );
}
