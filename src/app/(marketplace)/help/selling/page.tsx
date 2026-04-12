import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";

export const metadata: Metadata = {
  title: "Selling",
  description: "Learn how selling works on the WEARHOUSE marketplace.",
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped/90";

export default function HelpSellingPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Selling on WEARHOUSE"
      subtitle="Listings that convert, shipping that protects, and payouts without surprises."
      lead={`Selling on ${BRAND_NAME} rewards clarity: buyers who trust your photos and descriptions check out faster, leave stronger reviews, and generate fewer claims. This guide covers listing creation, pricing discipline, fulfilment hygiene, and the rules that keep your shop in good standing.`}
      heroPosition="top"
      heroImage={DOC_PAGE_HERO.helpSelling}
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
        caption="Treat the first image as a shop window - full garment, even lighting, no clutter in frame."
        objectPosition="object-[center_25%]"
      />

      <h2>How to list an item in the app</h2>
      <p>
        On iPhone, tap the <strong>Sell</strong> tab. The form matches what you
        see below: you must complete every required row before{" "}
        <strong>Upload</strong> is enabled (you can also save a{" "}
        <strong>draft</strong> and reopen it from{" "}
        <strong>Upload from drafts</strong> when you return).
      </p>
      <ol>
        <li>
          <strong>Photos</strong> — Add up to <strong>20</strong> images from
          your library. Order matters: the first photo is the cover. For tricky
          condition, use many angles (front, back, label, size tag, flaws).
        </li>
        <li>
          <strong>Item Details</strong> — <strong>Title</strong> and{" "}
          <strong>Describe your item</strong> (free-text description). Put the
          story here; category, brand, and condition are separate fields next.
        </li>
        <li>
          <strong>Item Information</strong> — <strong>Category</strong> (picker),{" "}
          <strong>Brand</strong>, <strong>Condition</strong> (fixed options
          below), <strong>Colours</strong> (up to three), and{" "}
          <strong>Size</strong> for the category.
        </li>
        <li>
          <strong>Additional Details</strong> — Optional{" "}
          <strong>Measurements</strong>, <strong>Material</strong>, and{" "}
          <strong>Style</strong> (the app can send up to two style values with
          the listing).
        </li>
        <li>
          <strong>Pricing &amp; Shipping</strong> — <strong>Price</strong>{" "}
          (required), optional <strong>Discount Price</strong>, and required{" "}
          <strong>Parcel Size</strong> (small / medium / large). The form reminds
          you that <strong>the buyer pays for postage</strong>.
        </li>
      </ol>

      <h2>Creating a standout listing</h2>
      <p>
        More photos help buyers trust nuance: front, back, brand label, size
        tag, fabric close-ups, and any flaws (coin or ruler for scale). A clear
        title (brand + garment + detail) and honest description still convert
        best—keywords belong after you have filled the structured fields.
      </p>

      <MarketingDetails title="Condition options (same labels as the app)">
        <p className="mb-3 text-[13px] text-prel-secondary-label">
          When you tap <strong>Condition</strong> on the sell form, you pick
          one of these—use the same ideas in your photos and description.
        </p>
        <ul>
          <li>
            <strong>Brand New With Tags</strong> — Never worn, with original
            tags.
          </li>
          <li>
            <strong>Brand new Without Tags</strong> — Never worn, tags removed.
          </li>
          <li>
            <strong>Excellent Condition</strong> — Like new, minimal wear.
          </li>
          <li>
            <strong>Good Condition</strong> — Light wear, fully functional.
          </li>
          <li>
            <strong>Heavily Used</strong> — Visible wear, still usable (show
            every flaw in photos).
          </li>
        </ul>
      </MarketingDetails>

      <h2>Pricing &amp; demand</h2>
      <p>
        Scan sold comps when visible; otherwise compare active listings with
        similar condition tiers. Factor in shipping subsidy, platform fees, and
        potential VAT. You can run limited-time discounts where the product
        supports them - avoid yo-yo pricing that confuses buyers who saved your
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
        caption="Proof of postage: photo of sealed parcel with label next to listing screenshot - invaluable in edge cases."
        objectPosition="object-right"
      />

      <h2>Payouts &amp; verification</h2>
      <p>
        Complete KYC and tax steps early so first sales are not delayed. Payout
        schedules vary by region and risk holds - read in-wallet notices. If a
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
        Your chat history is discoverable in disputes - write as if a moderator
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
