import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${BRAND_NAME}.`,
};

const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function TermsPage() {
  return (
    <MarketingDocShell
      eyebrow="Legal"
      title="Terms & Conditions"
      subtitle="The agreement between you and WEARHOUSE when you use the marketplace."
      updated="April 2026"
      lead={`These terms govern access to ${BRAND_NAME} websites, apps, and related services. They are a working draft for product and engineering teams - replace with counsel-approved language before production reliance. Structure below mirrors typical marketplace agreements so reviewers can navigate quickly.`}
      heroPosition="center"
      ctaRow={
        <>
          <Link href="/privacy" className={btnSecondary}>
            Privacy Centre
          </Link>
          <Link href="/cookie-policy" className={btnSecondary}>
            Cookie Policy
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Legal clarity and readable UI belong together - we surface key terms again at checkout."
        objectPosition="object-top"
      />

      <h2>1. The service</h2>
      <p>
        {BRAND_NAME} operates an online venue where registered users may list,
        market, and purchase pre-owned fashion items. We provide software,
        payments orchestration (via partners), messaging, and trust tooling. We
        are not the seller of third-party listings unless explicitly stated.
      </p>

      <MarketingDetails title="Eligibility &amp; account security">
        <p>
          You must meet minimum age and capacity rules in your jurisdiction.
          Keep credentials confidential and notify us of unauthorised use.
          You are responsible for activity under your account until you report
          compromise through official channels.
        </p>
      </MarketingDetails>

      <h2>2. Listings &amp; transactions</h2>
      <p>
        Sellers represent they have legal title and that items are authentic
        and as described. Buyers agree to pay authorised charges and provide
        accurate delivery information. Contract formation, cooling-off rights,
        and VAT treatment depend on region-specific checkout terms incorporated
        by reference.
      </p>

      <h2>3. Prohibited conduct</h2>
      <ul>
        <li>Illegal goods, stolen property, or recalled items</li>
        <li>Harassment, discrimination, or threats</li>
        <li>Fraud, chargeback abuse, or synthetic engagement</li>
        <li>Circumvention of fees or checkout flows</li>
        <li>Scraping that degrades service or violates robots policy</li>
      </ul>

      <h2>4. Fees &amp; taxes</h2>
      <p>
        Commission, listing boosts, currency conversion, and payment processing
        may apply. Fees shown at purchase authorisation prevail over marketing
        pages if they conflict. You are responsible for taxes where law places
        them on you; we collect/remit where required as a marketplace
        facilitator.
      </p>

      <table>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Typical disclosure point</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Seller fees</td>
            <td>Payout settings &amp; order summary</td>
          </tr>
          <tr>
            <td>Buyer fees</td>
            <td>Checkout review step</td>
          </tr>
          <tr>
            <td>Promotional credits</td>
            <td>Programme terms linked in-wallet</td>
          </tr>
        </tbody>
      </table>

      <h2>5. Intellectual property</h2>
      <p>
        {BRAND_NAME} trademarks, design, and codebase remain our property or
        our licensors&apos;. You grant a licence to host, display, and
        distribute content you upload as needed to operate the service,
        including moderation and ranking. Respect third-party IP in listings;
        repeat infringement may lead to termination under applicable notice
        procedures.
      </p>

      <MarketingDetails title="DMCA-style notices (template)">
        <p>
          Designate an agent, publish an address, and describe repeat
          infringer policy. This marketing draft omits statutory magic language
          - your counsel should supply complete safe-harbour text for your
          hosting jurisdiction.
        </p>
      </MarketingDetails>

      <h2>6. Disclaimers</h2>
      <p>
        The service is provided on an &quot;as is&quot; and &quot;as
        available&quot; basis to the extent permitted by law. We do not
        guarantee uninterrupted access or that listings are lawful, safe, or
        accurate - member diligence remains essential.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the maximum extent permitted, neither party is liable for indirect,
        incidental, special, consequential, or punitive damages, or for loss of
        profits/data, arising from marketplace disputes between users or from
        service outages. Caps may tie to fees paid in a rolling period - your
        counsel sets numbers.
      </p>

      <MarketingFigure
        caption="Jurisdiction-specific consumer rights may override certain limitations - local law applies where mandatory."
        objectPosition="object-[center_40%]"
      />

      <h2>8. Suspension &amp; termination</h2>
      <p>
        We may suspend or terminate accounts that risk the community or our
        ability to process payments. You may close your account subject to
        outstanding obligations and records retention rules.
      </p>

      <h2>9. Changes</h2>
      <p>
        We will notify you of material changes as required by law - often by
        email, banner, or updated effective date on this page. Continued use may
        constitute acceptance where permissible.
      </p>

      <h2>10. Contact &amp; governing law</h2>
      <p>
        Insert governing law, venue, and legal entity contact blocks. For
        privacy practices, see <Link href="/privacy">Privacy Centre</Link>. For
        enforcement transparency, see{" "}
        <Link href="/our-platform">Our Platform</Link>.
      </p>
    </MarketingDocShell>
  );
}
