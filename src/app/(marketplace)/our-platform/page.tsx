import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Our Platform",
  description: `Platform rules and transparency for ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function OurPlatformPage() {
  return (
    <MarketingDocShell
      eyebrow="Transparency"
      title="Our Platform"
      subtitle="Rules, ranking, enforcement, and appeals — how decisions behind the feed are made."
      lead={`${BRAND_NAME} is a curated marketplace, not an unmoderated bulletin board. We write rules to protect buyers and sellers, build ranking systems to surface relevant trustworthy inventory, and enforce consistently enough that outcomes feel predictable — even when you disagree with a single decision.`}
      heroPosition="left"
      ctaRow={
        <>
          <Link href="/terms" className={btnPrimary}>
            Terms &amp; Conditions
          </Link>
          <Link href="/safety" className={btnSecondary}>
            Trust and safety
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Ranking blends relevance with integrity signals — sponsored slots are labelled when shown."
        objectPosition="object-[center_25%]"
      />

      <h2>Community rules in practice</h2>
      <p>
        Listings must be lawful, accurately described, and respectful. Chat must
        stay professional. Circumventing fees, manipulating reviews, or
        coordinating fake transactions triggers escalated enforcement. The
        legal backbone lives in <Link href="/terms">Terms &amp; Conditions</Link>
        ; this page explains operational reality.
      </p>

      <h2>Search, browse, and ranking</h2>
      <p>
        Result ordering may consider text relevance, recency, engagement,
        seller performance, buyer affinity, and policy health scores.
        Experiments run with guardrails; severe quality regressions roll back.
        Paid placements, when offered, are visually distinguished and compete
        only inside approved modules — not by silently burying organic results
        without disclosure.
      </p>

      <MarketingDetails title="Signals that can demote listings">
        <ul>
          <li>High cancellation or refund rates relative to category peers</li>
          <li>Sustained negative feedback patterns</li>
          <li>Repeated policy strikes or authenticity complaints</li>
          <li>Spammy keyword stuffing or duplicate listings</li>
        </ul>
      </MarketingDetails>

      <h2>Enforcement ladder</h2>
      <p>
        Actions aim to be proportionate: educational warnings for ambiguous
        mistakes, temporary feature limits for repeated issues, listing removal
        for clear violations, account suspension for fraud or abuse, and
        permanent bans for severe or unrepentant misconduct. Automated systems
        may apply friction instantly; human review handles edge cases.
      </p>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>Typical trigger</th>
            <th>Member experience</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Warning</td>
            <td>First-time borderline photo</td>
            <td>In-app notice + policy link</td>
          </tr>
          <tr>
            <td>Restriction</td>
            <td>Repeated late shipping</td>
            <td>Limited listing volume or visibility</td>
          </tr>
          <tr>
            <td>Suspension</td>
            <td>Counterfeit sale</td>
            <td>Account frozen pending review</td>
          </tr>
        </tbody>
      </table>

      <h2>Appeals</h2>
      <p>
        If you believe we misread evidence, use the appeal flow with additional
        documentation (receipts, carrier logs, expert letters). Not all outcomes
        reverse — some strikes expire naturally after a clean period. Final
        escalation paths depend on region and product surface.
      </p>

      <MarketingFigure
        caption="Transparency does not mean publishing proprietary fraud logic — it means explaining what behaviour we reward."
        objectPosition="object-left"
      />

      <h2>Data &amp; privacy touchpoints</h2>
      <p>
        Ranking and safety systems process activity data described in the{" "}
        <Link href="/privacy">Privacy Centre</Link>. You can exercise rights
        there where applicable. Cookies and similar tech are covered in the{" "}
        <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <h2>Platform integrity research</h2>
      <p>
        We run internal simulations and partner with academics on aggregate
        studies. Individual member data is not sold for unrelated advertising
        networks; see privacy disclosures for permitted sharing categories.
      </p>
    </MarketingDocShell>
  );
}
