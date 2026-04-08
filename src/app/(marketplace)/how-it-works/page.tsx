import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "How it works",
  description: `How buying and selling work on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function HowItWorksPage() {
  return (
    <MarketingDocShell
      eyebrow="Guide"
      title="How it works"
      subtitle="From first photo to delivered parcel - the full journey on WEARHOUSE."
      lead={`${BRAND_NAME} is a peer-to-peer marketplace for second-hand fashion. Buyers discover items through search, filters, and seller shops; sellers list with photos and structured fields; both sides coordinate in chat and complete payment through official checkout where enabled. This page walks through each phase so you know what to expect before you start.`}
      heroPosition="center"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre
          </Link>
          <Link href="/search" className={btnSecondary}>
            Browse Discover
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Discovery blends algorithmic ranking with your taste - save searches and favourite sellers to train the feed."
        objectPosition="object-[center_25%]"
      />

      <h2>For sellers</h2>
      <ol>
        <li>
          <strong>Account &amp; verification</strong> - create your profile,
          complete any regional identity or payout steps so funds are not held
          up later.
        </li>
        <li>
          <strong>Listing build</strong> - shoot in daylight, capture labels and
          flaws, pick category, size, condition, and shipping options supported
          in your area.
        </li>
        <li>
          <strong>Publish &amp; promote</strong> - set a fair price using
          comparable listings; respond quickly to questions to improve ranking
          signals.
        </li>
        <li>
          <strong>Sale &amp; fulfilment</strong> - once a buyer pays through{" "}
          {BRAND_NAME}, pack securely, add tracking, and mark dispatched inside
          the order timeline.
        </li>
        <li>
          <strong>After delivery</strong> - buyers confirm receipt; payouts
          follow policy schedules. Handle any disputes through official
          channels only.
        </li>
      </ol>

      <MarketingDetails title="What good listings have in common">
        <ul>
          <li>First image shows the full garment on a neutral background</li>
          <li>Close-ups of fabric, hardware, and any damage</li>
          <li>Measurements where fit is ambiguous (rise, inseam, pit-to-pit)</li>
          <li>Honest condition tier - slightly worn beats &quot;like new&quot; disputes</li>
        </ul>
      </MarketingDetails>

      <h2>For buyers</h2>
      <ol>
        <li>
          <strong>Browse or search</strong> - filter by size, brand, price, and
          condition. Open <Link href="/search">Discover</Link> from the main
          navigation.
        </li>
        <li>
          <strong>Evaluate the listing</strong> - read the description, zoom
          photos, check seller reviews. Message before purchase if anything is
          unclear.
        </li>
        <li>
          <strong>Checkout</strong> - pay with supported methods inside the
          app or web flow. Avoid wire transfers or external payment links.
        </li>
        <li>
          <strong>Track &amp; receive</strong> - follow tracking in your
          account; inspect on arrival and report issues within the stated
          window with photos.
        </li>
        <li>
          <strong>Leave structured feedback</strong> - helps the community and
          improves search quality for the next buyer.
        </li>
      </ol>

      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>Buyer tip</th>
            <th>Seller tip</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Before deal</td>
            <td>Ask about stretch and shrinkage</td>
            <td>Answer within hours when possible</td>
          </tr>
          <tr>
            <td>Payment</td>
            <td>Use only in-platform checkout</td>
            <td>Never share personal bank details in chat</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td>Confirm address in account</td>
            <td>Photograph package with label</td>
          </tr>
        </tbody>
      </table>

      <MarketingFigure
        caption="Trust is layered: member behaviour, platform rules, and payment protection together reduce bad outcomes."
        objectPosition="object-left"
      />

      <h2>Trust, safety, and rules</h2>
      <p>
        We combine automated signals with human review for policy breaches.
        Counterfeits, harassment, and fee circumvention can lead to listing
        removal or account suspension. Read{" "}
        <Link href="/safety">Trust and safety</Link>,{" "}
        <Link href="/item-verification">Item verification</Link>, and{" "}
        <Link href="/our-platform">Our Platform</Link> for enforcement detail.
      </p>

      <h2>Web vs app</h2>
      <p>
        Native apps carry the fullest feature set today - push notifications,
        camera tools, and some checkout paths. The website is ideal for
        discovery and reading long-form help; parity grows each quarter. See{" "}
        <Link href="/app">Mobile apps</Link> for download links.
      </p>
    </MarketingDocShell>
  );
}
