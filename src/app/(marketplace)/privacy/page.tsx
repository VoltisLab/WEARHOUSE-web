import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Privacy Centre",
  description: `Privacy information for ${BRAND_NAME}.`,
};

const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function PrivacyPage() {
  return (
    <MarketingDocShell
      eyebrow="Privacy"
      title="Privacy Centre"
      subtitle="How we collect, use, share, and retain personal data across WEARHOUSE."
      updated="April 2026"
      lead={`This Privacy Centre summarises ${BRAND_NAME} data practices for buyers, sellers, and visitors. It supports transparency goals but is not a substitute for a jurisdiction-specific privacy notice reviewed by counsel. Cross-links to cookies and terms appear throughout; data subject request channels belong in your final legal pack.`}
      heroPosition="right"
      ctaRow={
        <>
          <Link href="/cookie-policy" className={btnSecondary}>
            Cookie Policy
          </Link>
          <Link href="/terms" className={btnSecondary}>
            Terms &amp; Conditions
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Privacy UX should be understandable at a glance - details stay available for those who want depth."
        objectPosition="object-[center_30%]"
      />

      <h2>Who we are</h2>
      <p>
        The data controller is the legal entity operating {BRAND_NAME} in your
        region (insert name, registration number, and postal address). EU/UK
        representatives, DPO contact, and Brazilian LGPD articles should be
        appended where applicable.
      </p>

      <MarketingDetails title="Categories of personal data">
        <ul>
          <li>
            <strong>Identity &amp; contact</strong> - name, username, email,
            phone, date of birth where required.
          </li>
          <li>
            <strong>Account &amp; profile</strong> - bio, photo, preferences,
            connected social logins.
          </li>
          <li>
            <strong>Commercial</strong> - listings, messages, orders, shipping
            labels, payout details (often via payment partners).
          </li>
          <li>
            <strong>Technical</strong> - device IDs, IP address, logs, crash
            diagnostics, approximate location from IP.
          </li>
          <li>
            <strong>Inferences</strong> - fraud scores, content relevance,
            policy risk signals.
          </li>
        </ul>
      </MarketingDetails>

      <h2>Purposes &amp; legal bases</h2>
      <p>
        We process data to perform our contract with you (service delivery),
        pursue legitimate interests (security, product improvement, analytics
        with safeguards), comply with law (tax, AML where required), and - where
        needed - rely on consent (e.g. certain marketing cookies or emails).
      </p>

      <table>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Example activities</th>
            <th>Typical basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Operate marketplace</td>
            <td>Accounts, listings, chat, checkout</td>
            <td>Contract</td>
          </tr>
          <tr>
            <td>Keep members safe</td>
            <td>Fraud models, content moderation</td>
            <td>Legitimate interests / legal obligation</td>
          </tr>
          <tr>
            <td>Grow responsibly</td>
            <td>Aggregated analytics, A/B tests</td>
            <td>Legitimate interests / consent</td>
          </tr>
        </tbody>
      </table>

      <h2>Sharing</h2>
      <p>
        We disclose data to processors bound by contract (cloud, email,
        customer support tooling, analytics, payments, shipping carriers) and to
        other members when necessary to complete a transaction (e.g. seller sees
        buyer shipping address). Authorities receive data when legally
        compelled. We do not sell personal information as defined by U.S. state
        laws - if that changes, we update this notice and any required toggles.
      </p>

      <MarketingDetails title="International transfers">
        <p>
          Where data leaves your country, we rely on adequacy decisions or
          standard contractual clauses (SCCs) with supplementary measures as
          assessed by our privacy team. Members in the EEA/UK/Switzerland should
          see the full transfer impact analysis in the long-form notice.
        </p>
      </MarketingDetails>

      <h2>Retention</h2>
      <p>
        We keep information only as long as needed for the purposes above,
        including statutory books-and-records periods, dispute resolution, and
        model training where permitted with de-identification. Messaging content
        may be retained shorter than financial records - specifics belong in your
        retention schedule appendix.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on location, you may access, rectify, delete, restrict,
        object, port data, or withdraw consent. You may lodge a complaint with a
        supervisory authority. We respond within statutory timelines and may
        need identity verification before fulfilling sensitive requests.
      </p>

      <MarketingFigure
        caption="Automated decision-making, if any, requires extra transparency - describe logic and human review options."
        objectPosition="object-left"
      />

      <h2>Children</h2>
      <p>
        {BRAND_NAME} is not directed at children under the age where consent is
        required without parental involvement. Disable accounts if discovered.
      </p>

      <h2>Cookies &amp; similar tech</h2>
      <p>
        See the <Link href="/cookie-policy">Cookie Policy</Link> for types,
        lifetimes, and controls. Essential cookies remain on for security even
        if marketing cookies are declined.
      </p>

      <h2>Updates</h2>
      <p>
        We revise this Centre when practices or laws change. Material updates
        receive prominent notice; archived versions are available on request
        where required.
      </p>
    </MarketingDocShell>
  );
}
