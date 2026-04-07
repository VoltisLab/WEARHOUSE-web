import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Trust and safety",
  description: `Trust and safety on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function SafetyPage() {
  return (
    <MarketingDocShell
      eyebrow="Community"
      title="Trust and safety"
      subtitle="Practical guidance for trading with confidence — and what we do when things go wrong."
      lead={`${BRAND_NAME} only works when members treat one another with respect and follow the rules. We combine preventive design (checkout in-platform, reporting tools, fraud models) with responsive enforcement (strikes, suspensions, cooperation with authorities). This page translates policy into everyday behaviour.`}
      heroPosition="top"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre
          </Link>
          <Link href="/item-verification" className={btnSecondary}>
            Item verification
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Most trades complete without drama — these practices keep you in that majority."
        objectPosition="object-[center_30%]"
      />

      <h2>Payments &amp; off-platform pressure</h2>
      <p>
        Complete purchases through {BRAND_NAME} checkout whenever it is
        available for your region. Off-platform payment removes protections,
        complicates disputes, and is a common fraud pattern. If someone asks
        you to pay via wire, gift cards, or a personal PayPal link, decline and
        report the conversation.
      </p>

      <MarketingDetails title="Red flags in chat">
        <ul>
          <li>Rushing you to leave the platform &quot;to save fees&quot;</li>
          <li>Refusing to answer reasonable authenticity questions</li>
          <li>Shipping from a different country than stated without explanation</li>
          <li>Pressure to cancel an order after payment to &quot;settle privately&quot;</li>
        </ul>
      </MarketingDetails>

      <h2>Meetups &amp; local pickup</h2>
      <p>
        Choose busy public places, daylight hours, and consider a friend nearby.
        Do not share home addresses unnecessarily. Inspect the item before
        handing over payment if the flow allows; for remote buyers, rely on
        tracked shipping and documented condition.
      </p>

      <h2>Counterfeits &amp; misrepresentation</h2>
      <p>
        Report listings that appear fake or materially different from their
        description. We may remove items, freeze payouts, or suspend sellers
        pending review. See{" "}
        <Link href="/item-verification">Item verification</Link> for programme
        specifics and <Link href="/our-platform">Our Platform</Link> for
        enforcement stages.
      </p>

      <table>
        <thead>
          <tr>
            <th>Issue</th>
            <th>Evidence to gather</th>
            <th>Where to report</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Wrong item / damage</td>
            <td>Photos of packaging, label, defects</td>
            <td>Order help flow</td>
          </tr>
          <tr>
            <td>Harassment</td>
            <td>Screenshots, timestamps</td>
            <td>Conversation report</td>
          </tr>
          <tr>
            <td>Counterfeit suspicion</td>
            <td>Detail photos vs listing</td>
            <td>Listing report</td>
          </tr>
        </tbody>
      </table>

      <h2>Harassment, hate, and abuse</h2>
      <p>
        We do not tolerate slurs, sexual harassment, threats, or stalking.
        Block users who pressure you after a declined offer. If behaviour
        escalates, report and, when appropriate, contact local authorities with
        the evidence bundle we can provide under lawful process.
      </p>

      <MarketingFigure
        caption="Moderation scales with context — detailed reports get triaged faster than single-word flags."
        objectPosition="object-right"
      />

      <h2>Children &amp; vulnerable users</h2>
      <p>
        Our service is intended for adults able to enter contracts in their
        jurisdiction. Content that sexualises minors or exploits vulnerable
        people is removed, preserved for investigation, and referred to law
        enforcement when required.
      </p>

      <h2>Law enforcement &amp; legal requests</h2>
      <p>
        We respond to valid legal process while pushing back on overbroad
        requests. Emergency disclosures follow applicable law. Members are
        notified when not legally prohibited.
      </p>

      <h2>More resources</h2>
      <p>
        Guides: <Link href="/help/buying">Buying</Link>,{" "}
        <Link href="/help/selling">Selling</Link>. Rules depth:{" "}
        <Link href="/terms">Terms</Link>. Data:{" "}
        <Link href="/privacy">Privacy Centre</Link>.
      </p>
    </MarketingDocShell>
  );
}
