import type { Metadata } from "next";
import Link from "next/link";
import { HelpHubLinkList } from "@/components/help/HelpHubLinkList";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { HELP_HOME_TOPIC_SECTIONS } from "@/lib/help-centre-nav";
import { BRAND_NAME } from "@/lib/branding";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";

export const metadata: Metadata = {
  title: "Profile & seller tools",
  description: `Lookbook, seller dashboard, favourites, multi-buy, vacation mode, and invites on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped/90";

const links = HELP_HOME_TOPIC_SECTIONS[1]!.links;

export default function HelpProfileToolsHubPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Profile & seller tools"
      subtitle="Everything behind Profile → Menu: dashboard, lookbook, discounts, vacation, and more."
      updated="April 2026"
      lead={`These tools open from Profile → Menu (three lines): Lookbook (Beta) first, then Seller dashboard, Orders, Favourites, Multi-buy discounts, Vacation Mode, Invite Friend, Help Centre, and more. The gear icon on that Menu screen opens Settings (e.g. Lookbook settings, notifications).`}
      heroPosition="right"
      heroImage={DOC_PAGE_HERO.helpProfileTools}
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre home
          </Link>
          <Link href="/help/selling" className={btnSecondary}>
            Selling guide
          </Link>
        </>
      }
    >
      <h2>Articles</h2>
      <HelpHubLinkList links={links} skipHref="/help/profile-tools" />
    </MarketingDocShell>
  );
}
