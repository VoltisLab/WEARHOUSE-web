import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Infoboard",
  description: `Updates and notices from the ${BRAND_NAME} team.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function InfoboardPage() {
  return (
    <MarketingDocShell
      eyebrow="Updates"
      title="Infoboard"
      subtitle="Release notes, incident summaries, and reminders — the public heartbeat of the product."
      updated="April 2026"
      lead={`The Infoboard is where ${BRAND_NAME} posts meaningful changes that affect trading: new web capabilities, policy clarifications, known outages, and seasonal reminders. It is not a substitute for legal terms or personalised account notices, but it is the best place to scan what changed recently.`}
      heroPosition="right"
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre
          </Link>
          <Link href="/terms" className={btnSecondary}>
            Terms &amp; Conditions
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="We timestamp entries and keep a short archive so teams can reference what shipped when."
        objectPosition="object-[center_35%]"
      />

      <h2>April 2026</h2>
      <p>
        <strong>Web marketplace depth.</strong> Footer destinations now ship
        with richer layouts: imagery, motion, and structured content for
        policies and guides. Browse and account flows continue on their own
        release train — watch this board for parity milestones.
      </p>
      <p>
        <strong>Help content refresh.</strong> Buying and selling guides were
        expanded with tables, scenarios, and cross-links to safety resources.
        Suggest gaps via support with the URL you were reading.
      </p>

      <MarketingDetails title="How we classify posts">
        <ul>
          <li>
            <strong>Feature</strong> — user-visible product change or experiment
            graduation.
          </li>
          <li>
            <strong>Policy</strong> — clarification or material rule change
            (also reflected in legal docs when binding).
          </li>
          <li>
            <strong>Incident</strong> — degraded performance or outage with
            customer impact.
          </li>
          <li>
            <strong>Reminder</strong> — seasonal tips (e.g. holiday shipping
            cutoffs).
          </li>
        </ul>
      </MarketingDetails>

      <h2>Incident communication</h2>
      <p>
        During active incidents we prioritise status accuracy over speed. Posts
        may start minimal and expand as engineering confirms scope. For
        account-specific credits or adjustments, members receive direct
        messaging where applicable — not only a public note here.
      </p>

      <table>
        <thead>
          <tr>
            <th>Channel</th>
            <th>Best for</th>
            <th>Latency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Infoboard</td>
            <td>General awareness</td>
            <td>Hours, not minutes</td>
          </tr>
          <tr>
            <td>In-app banner</td>
            <td>Active degradation</td>
            <td>Minutes when severe</td>
          </tr>
          <tr>
            <td>Email to affected users</td>
            <td>Data or payout impact</td>
            <td>As soon as verified</td>
          </tr>
        </tbody>
      </table>

      <h2>Roadmap philosophy</h2>
      <p>
        We do not publish long private roadmaps, but we do signal direction:
        web parity, trust investments, and seller tooling show up repeatedly
        because they unblock scale. Competitive surprises stay unannounced until
        ready for members.
      </p>

      <MarketingFigure
        caption="Subscribe in-app for push; the web Infoboard is the durable archive."
        objectPosition="object-bottom"
      />

      <h2>Stay informed</h2>
      <p>
        Binding legal changes always appear in{" "}
        <Link href="/terms">Terms &amp; Conditions</Link> and{" "}
        <Link href="/privacy">Privacy Centre</Link> with effective dates. Cookie
        and tracking updates cross-link from the{" "}
        <Link href="/cookie-policy">Cookie Policy</Link>.
      </p>
    </MarketingDocShell>
  );
}
