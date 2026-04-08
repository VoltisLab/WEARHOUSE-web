import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `Accessibility statement for ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function AccessibilityPage() {
  return (
    <MarketingDocShell
      eyebrow="Inclusion"
      title="Accessibility"
      subtitle="We design for keyboard, screen readers, motion preferences, and zoom - not only for mouse and perfect vision."
      updated="April 2026"
      lead={`${BRAND_NAME} is committed to WCAG-inspired practices on the web: perceivable content, operable UI, understandable copy, and robust implementation. We will not always be perfect on day one of a feature, but we treat regressions as bugs and prioritise fixes that unblock core commerce flows.`}
      heroPosition="bottom"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre
          </Link>
          <a href="mailto:accessibility@wearhouse.example" className={btnSecondary}>
            Report a barrier
          </a>
        </>
      }
    >
      <MarketingFigure
        caption="Clear hierarchy, large tap targets, and readable type benefit everyone - not only assistive tech users."
        objectPosition="object-top"
      />

      <h2>How we test</h2>
      <p>
        Automated scanners catch a subset of issues (missing labels, colour
        contrast failures). Human review covers focus order, screen reader
        announcements, and real-device zoom behaviour. New components ship with
        keyboard paths before we consider them complete.
      </p>

      <MarketingDetails title="Assistive technologies we routinely verify">
        <ul>
          <li>VoiceOver on latest iOS Safari</li>
          <li>TalkBack on current Android Chrome</li>
          <li>NVDA or JAWS on Windows + Chrome/Edge</li>
          <li>Keyboard-only navigation without pointer</li>
        </ul>
      </MarketingDetails>

      <h2>Conformance goal</h2>
      <p>
        We target WCAG 2.2 Level AA for primary journeys: sign-in, search,
        listing detail, checkout (where web checkout exists), messages, and
        account settings. Some marketing pages or legacy surfaces may lag; we
        document known gaps here as we become aware of them and ship remedial
        work in normal release cadence.
      </p>

      <table>
        <thead>
          <tr>
            <th>Area</th>
            <th>Status</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Core UI components</td>
            <td>Continuous improvement</td>
            <td>Labels tied to inputs, focus rings</td>
          </tr>
          <tr>
            <td>User-generated images</td>
            <td>Varies</td>
            <td>Sellers should describe key details in text</td>
          </tr>
          <tr>
            <td>Embedded third parties</td>
            <td>Varies</td>
            <td>May not meet our full baseline</td>
          </tr>
        </tbody>
      </table>

      <h2>Motion &amp; vestibular comfort</h2>
      <p>
        Hero imagery uses slow drift animation; if you prefer reduced motion,
        your OS setting should minimise non-essential movement across the site.
        We avoid flashing content above seizure-safe thresholds.
      </p>

      <blockquote>
        If something feels broken with your setup, tell us the browser, OS, and
        assistive tool - we reproduce with the same stack whenever possible.
      </blockquote>

      <h2>Third-party content</h2>
      <p>
        Payment providers, maps, or embedded players may introduce their own
        accessibility characteristics. We select vendors partly on usability
        and escalate issues to partners when members are blocked.
      </p>

      <MarketingFigure
        caption="Feedback from members directly shapes our backlog - accessibility is not a one-time audit."
        objectPosition="object-[center_45%]"
      />

      <h2>Legal context</h2>
      <p>
        Depending on jurisdiction, you may have rights to reasonable
        accommodations or to lodge complaints with regulators. This statement
        does not constitute legal advice; see also{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </MarketingDocShell>
  );
}
