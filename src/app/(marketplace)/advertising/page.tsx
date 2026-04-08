import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Advertising",
  description: `Advertising and brand partnerships on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function AdvertisingPage() {
  return (
    <MarketingDocShell
      eyebrow="Partnerships"
      title="Advertising"
      subtitle="Reach people who are already in a shopping mindset - without compromising trust."
      lead={`${BRAND_NAME} connects brands and agencies with audiences actively listing, browsing, and buying fashion. Inventory is pre-loved, but attention is fresh: campaigns here should respect community norms, disclose sponsorship clearly, and align with our safety and authenticity standards.`}
      heroPosition="left"
      ctaRow={
        <>
          <a href="mailto:partnerships@wearhouse.example" className={btnPrimary}>
            Talk to partnerships
          </a>
          <Link href="/press" className={btnSecondary}>
            Press enquiries
          </Link>
        </>
      }
    >
      <p className="text-[13px] text-prel-tertiary-label">
        Replace the mailbox above with your live partnerships contact.
      </p>

      <MarketingFigure
        caption="Campaigns work best when they feel native to discovery - editorial collections, not intrusive takeovers."
        objectPosition="object-[center_35%]"
      />

      <h2>Why advertisers choose {BRAND_NAME}</h2>
      <ul>
        <li>
          <strong>High-intent sessions</strong> - users compare prices, sizes,
          and sellers; attention is closer to conversion than on passive feeds.
        </li>
        <li>
          <strong>Values alignment</strong> - resale audiences skew toward
          sustainability and mindful consumption; creative can lean authentic.
        </li>
        <li>
          <strong>Brand-safe surfaces</strong> - we enforce listing rules and
          moderation; adjacency controls are available for sensitive categories.
        </li>
      </ul>

      <h2>Formats</h2>
      <p>
        Availability varies by region and inventory. Typical building blocks
        include sponsored modules in browse/search, curated brand edits,
        seasonal tentpoles, and co-created content with our studio (subject to
        capacity). Everything is labelled per policy and measurable through
        agreed KPIs - reach, clicks, attributed orders where attribution is
        technically supported.
      </p>

      <MarketingDetails title="Categories we restrict or review closely">
        <p>
          Alcohol, gambling, political, and adult categories face extra policy
          review. Competitor direct-response ads may be limited. All creative
          must respect intellectual property and not imply endorsement by
          designers featured in user listings.
        </p>
      </MarketingDetails>

      <table>
        <thead>
          <tr>
            <th>Stage</th>
            <th>You bring</th>
            <th>We deliver</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Discovery</td>
            <td>Objectives, budget band, markets</td>
            <td>Eligible formats &amp; rate guidance</td>
          </tr>
          <tr>
            <td>Planning</td>
            <td>Assets, tracking needs, flight dates</td>
            <td>Media plan &amp; brand-safety checklist</td>
          </tr>
          <tr>
            <td>Live</td>
            <td>Optimisation feedback</td>
            <td>Reporting &amp; post-campaign review</td>
          </tr>
        </tbody>
      </table>

      <h2>Measurement &amp; privacy</h2>
      <p>
        We build measurement that respects evolving privacy law: aggregated
        reporting by default, consent-gated identifiers where required, and no
        sale of personal data for off-platform ad networks. Details on data use
        sit in the <Link href="/privacy">Privacy Centre</Link>; cookie mechanics
        in the <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>

      <MarketingFigure
        caption="Partnership storytelling works when product truth matches ad promise - we decline misleading sustainability claims."
        objectPosition="object-right"
      />

      <h2>Non-ad partnerships</h2>
      <p>
        NGOs, resale coalitions, and educational institutions sometimes
        collaborate on guides, events, or research. Those programmes may not
        involve paid media but still route through partnerships for legal
        sign-off - use the same contact channel with &quot;programmatic
        partnership&quot; in the subject line.
      </p>
    </MarketingDocShell>
  );
}
