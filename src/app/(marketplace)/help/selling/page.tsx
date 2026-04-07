import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Selling",
  description: "Learn how selling works on the WEARHOUSE marketplace.",
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function HelpSellingPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Selling on WEARHOUSE"
      subtitle="Listings that convert, shipping that protects, and payouts without surprises."
      lead={`Selling on ${BRAND_NAME} rewards clarity: buyers who trust your photos and descriptions check out faster, leave stronger reviews, and generate fewer claims. This guide covers listing creation, pricing discipline, fulfilment hygiene, and the rules that keep your shop in good standing.`}
      heroPosition="top"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre home
          </Link>
          <Link href="/our-platform" className={btnSecondary}>
            Our Platform rules
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Treat the first image as a shop window — full garment, even lighting, no clutter in frame."
        objectPosition="object-[center_25%]"
      />

      <h2>Creating a standout listing</h2>
      <p>
        Use six to ten images when condition is nuanced: front, back, brand
        label, size tag, fabric macro, and any flaws with a coin or ruler for
        scale. Write a title with brand + garment type + distinguishing detail.
        Fill structured fields before stuffing keywords into the description —
        search quality prefers honest metadata.
      </p>

      <MarketingDetails title="Condition vocabulary that reduces disputes">
        <ul>
          <li>
            <strong>New with tags</strong> — unworn, manufacturer tags attached.
          </li>
          <li>
            <strong>Excellent</strong> — minimal signs of wear, no stains.
          </li>
          <li>
            <strong>Good</strong> — visible but acceptable wear; disclose in text.
          </li>
          <li>
            <strong>Fair</strong> — obvious flaws; price accordingly and photograph each.
          </li>
        </ul>
      </MarketingDetails>

      <h2>Pricing &amp; demand</h2>
      <p>
        Scan sold comps when visible; otherwise compare active listings with
        similar condition tiers. Factor in shipping subsidy, platform fees, and
        potential VAT. You can run limited-time discounts where the product
        supports them — avoid yo-yo pricing that confuses buyers who saved your
        item.
      </p>

      <table>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Adjustment idea</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>High watchers, no sales</td>
            <td>Clarify fit or add measurement photo</td>
          </tr>
          <tr>
            <td>Low views</td>
            <td>Improve lead image; check category</td>
          </tr>
          <tr>
            <td>Seasonal item</td>
            <td>Re-list with refreshed keywords next season</td>
          </tr>
        </tbody>
      </table>

      <h2>Shipping &amp; packaging</h2>
      <p>
        Pack to survive rain and rough handling: garment bag, rigid outer box
        for accessories, void fill that does not snag delicate fabrics. Upload
        tracking promptly; buyers receive automated nudges when scans appear.
        For local pickup, confirm meeting spot in chat and mark complete only
        after handoff.
      </p>

      <MarketingFigure
        caption="Proof of postage: photo of sealed parcel with label next to listing screenshot — invaluable in edge cases."
        objectPosition="object-right"
      />

      <h2>Payouts &amp; verification</h2>
      <p>
        Complete KYC and tax steps early so first sales are not delayed. Payout
        schedules vary by region and risk holds — read in-wallet notices. If a
        payout fails, update bank details and retry; repeated failures may need
        support to clear a fraud hold.
      </p>

      <h2>Buyer messages</h2>
      <p>
        Reply within 24 hours when possible; fast response times correlate with
        higher conversion. Answer factually; if unsure, say so instead of
        guessing measurements. Never move payment off-platform or share
        personal payment handles.
      </p>

      <blockquote>
        Your chat history is discoverable in disputes — write as if a moderator
        will read every line.
      </blockquote>

      <h2>Prohibited &amp; restricted inventory</h2>
      <p>
        Counterfeits, recalled goods, hazardous materials, and items violating
        IP or local law are banned. When uncertain, consult{" "}
        <Link href="/terms">Terms</Link> and <Link href="/our-platform">Our Platform</Link>{" "}
        or ask support before listing.
      </p>

      <h2>See also</h2>
      <p>
        <Link href="/help/buying">Buying guide</Link> (understand buyer
        mindset), <Link href="/safety">Trust and safety</Link>,{" "}
        <Link href="/item-verification">Item verification</Link>.
      </p>
    </MarketingDocShell>
  );
}
