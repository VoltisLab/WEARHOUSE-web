import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Buying",
  description: "Learn how buying works on the WEARHOUSE marketplace.",
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function HelpBuyingPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Buying on WEARHOUSE"
      subtitle="From discovery to delivery - how to shop second-hand with confidence."
      lead={`Buying pre-loved fashion should feel exciting, not risky. This guide walks through evaluating listings, using chat wisely, paying only through ${BRAND_NAME}, and opening claims with the evidence moderators need. Pair it with Trust and safety for scam patterns.`}
      heroPosition="right"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre home
          </Link>
          <Link href="/safety" className={btnSecondary}>
            Trust and safety
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Use every photo: zoom fabric, compare colour to daylight shots, read the full description before messaging."
        objectPosition="object-[center_30%]"
      />

      <h2>Before you buy</h2>
      <p>
        Build a short checklist: size and measurements, material care,
        alterations, included accessories, and whether returns are possible for
        that listing type. If anything material is missing, ask in chat and wait
        for a written answer you can reference later. Save the listing to watch
        for price drops or competing items.
      </p>

      <MarketingDetails title="Questions worth asking the seller">
        <ul>
          <li>Has the item been washed or dry-cleaned since last wear?</li>
          <li>Any odours, pet exposure, or storage issues?</li>
          <li>Does the colour match a specific Pantone or brand campaign name?</li>
          <li>For shoes: outsole wear pattern and insole condition</li>
        </ul>
      </MarketingDetails>

      <h2>Paying safely</h2>
      <p>
        Complete checkout inside {BRAND_NAME}. If a seller sends an external
        payment link, it is a red flag - cancel the conversation and report.
        Official flows show fees, taxes, and delivery estimates before you
        authorise; screenshot that summary for your records.
      </p>

      <table>
        <thead>
          <tr>
            <th>Scenario</th>
            <th>Recommended action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Seller asks for &quot;friends &amp; family&quot; transfer</td>
            <td>Decline; pay in-app only</td>
          </tr>
          <tr>
            <td>Price drops right after you message</td>
            <td>Verify listing still matches photos/description</td>
          </tr>
          <tr>
            <td>Multiple duplicate listings same photos</td>
            <td>Report; may be fraud or dropshipping</td>
          </tr>
        </tbody>
      </table>

      <h2>After you order</h2>
      <p>
        Track the shipment from your purchases view. If tracking stalls,
        message the seller once through official channels, then escalate via
        order help if the SLA passes. Keep packaging until you confirm the item
        matches the listing.
      </p>

      <MarketingFigure
        caption="Photograph unboxing: outer box, label, inner wrap, and the garment laid flat - claims move faster with visuals."
        objectPosition="object-left"
      />

      <h2>Returns, refunds, and claims</h2>
      <p>
        Eligibility depends on listing type, seller policy disclosures, and
        mandatory consumer law in your country. When filing, narrate the timeline,
        attach photos, and propose a fair resolution (refund, partial credit,
        return with tracked label). Agents may mediate if parties disagree on
        facts.
      </p>

      <blockquote>
        Calm, factual messages resolve most disputes faster than accusations.
        Stick to observable differences between listing copy and what arrived.
      </blockquote>

      <h2>Reviews that help everyone</h2>
      <p>
        Rate shipping speed, accuracy of description, packaging quality, and
        communication. Avoid personal insults or revealing private details.
        Reviews inform ranking - thoughtful feedback improves discovery for the
        next buyer.
      </p>

      <h2>See also</h2>
      <p>
        <Link href="/how-it-works">How it works</Link>,{" "}
        <Link href="/item-verification">Item verification</Link>,{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </MarketingDocShell>
  );
}
