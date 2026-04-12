import type { Metadata } from "next";
import { HelpCompleteInventoryGuide } from "@/components/help/HelpCompleteInventoryGuide";
import { MarketingHubShell } from "@/components/marketing/MarketingHubShell";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";

export const metadata: Metadata = {
  title: "Complete app guide",
  description:
    "Full WEARHOUSE iPhone feature guide from HELP_CENTRE_FEATURE_INVENTORY.md — every capability with steps, plus URLs and QA checklists.",
};

export default function HelpInventoryGuidePage() {
  return (
    <MarketingHubShell
      eyebrow="Help"
      title="Complete app guide"
      subtitle="The full commercial inventory — grouped, expanded, and easy to scan."
      updated="April 2026"
      heroPosition="center"
      heroImage={DOC_PAGE_HERO.helpHome}
    >
      <HelpCompleteInventoryGuide />
    </MarketingHubShell>
  );
}
