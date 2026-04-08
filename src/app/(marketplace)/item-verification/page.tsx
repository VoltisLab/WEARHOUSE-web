import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Item verification",
  description: `Item verification and authenticity on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function ItemVerificationPage() {
  return (
    <MarketingDocShell
      eyebrow="Authenticity"
      title="Item verification"
      subtitle="How we think about fakes, high-value pieces, and expert review - without over-promising certainty."
      lead={`${BRAND_NAME} prohibits counterfeit goods. Sellers warrant they list genuine items. Where we operate optional authentication or verification programmes, eligibility, fees, SLAs, and liability caps are disclosed in-product - because authentication is probabilistic and context-dependent. This page sets expectations for everyone else trading without a formal programme.`}
      heroPosition="top"
      ctaRow={
        <>
          <Link href="/safety" className={btnPrimary}>
            Trust and safety
          </Link>
          <Link href="/help/buying" className={btnSecondary}>
            Buying guide
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Legitimate listings show serial numbers, stitching, and hardware - when in doubt, ask the seller for additional angles before purchase."
        objectPosition="object-[center_30%]"
      />

      <h2>Baseline: seller responsibility</h2>
      <p>
        Listing an item implies you have the right to sell it and that it is
        not a replica. Misrepresenting brand, material, or provenance violates
        our rules and may trigger refunds, strikes, or permanent suspension.
        Buyers should still exercise judgment - especially for luxury
        categories where replicas are sophisticated.
      </p>

      <h2>Optional verification programmes</h2>
      <p>
        In select regions or categories, {BRAND_NAME} or a partner may offer
        physical inspection, digital certification, or tag-based authenticity
        checks. When available, you will see:
      </p>
      <ul>
        <li>Clear badge copy explaining what was checked</li>
        <li>Whether the item passed, failed, or is pending</li>
        <li>Fees charged to buyer, seller, or platform</li>
        <li>What happens if authentication disagrees with the listing</li>
      </ul>

      <MarketingDetails title="What verification does not guarantee">
        <p>
          Even expert review can err. Vintage pieces may lack reference data.
          Custom alterations can look like inconsistencies. We communicate
          confidence levels where relevant and route disputes through order
          protection flows rather than absolute guarantees.
        </p>
      </MarketingDetails>

      <table>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Stronger trust</th>
            <th>Needs caution</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Photos</td>
            <td>Macro shots of labels, codes, stitching</td>
            <td>Only stock or catalogue images</td>
          </tr>
          <tr>
            <td>Price</td>
            <td>Aligned with condition &amp; rarity</td>
            <td>Far below market with vague story</td>
          </tr>
          <tr>
            <td>Seller</td>
            <td>History of similar authentic sales</td>
            <td>New account, duplicated listings</td>
          </tr>
        </tbody>
      </table>

      <h2>Reporting suspected fakes</h2>
      <p>
        Use in-app reporting on the listing or order. Include comparison photos,
        order ID, and any communication that shows misrepresentation. We may
        request return of the item for inspection where policy allows.
      </p>

      <MarketingFigure
        caption="Community reports train our models and reviewer queues - your specificity speeds resolution."
        objectPosition="object-right"
      />

      <h2>Replicas vs inspired-by</h2>
      <p>
        Items that copy trademarked designs without authorisation are not
        allowed. Generic &quot;inspired&quot; pieces may be acceptable if the
        listing does not use protected brand names or logos deceptively. Borderline
        cases are reviewed manually.
      </p>

      <h2>Further reading</h2>
      <p>
        <Link href="/terms">Terms &amp; Conditions</Link> for legal warranties,{" "}
        <Link href="/our-platform">Our Platform</Link> for enforcement, and{" "}
        <Link href="/help/selling">Selling</Link> for photography tips that
        reduce authenticity disputes.
      </p>
    </MarketingDocShell>
  );
}
