import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie policy for ${BRAND_NAME}.`,
};

const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function CookiePolicyPage() {
  return (
    <MarketingDocShell
      eyebrow="Cookies"
      title="Cookie Policy"
      subtitle="What we store in the browser, why, and how you can control it."
      updated="April 2026"
      lead={`${BRAND_NAME} uses cookies, local storage, session tokens, and similar technologies to keep you signed in, protect against abuse, remember preferences, and — where you agree — measure campaigns. This page groups them by purpose so you can make informed choices.`}
      heroPosition="bottom"
      ctaRow={
        <>
          <Link href="/privacy" className={btnSecondary}>
            Privacy Centre
          </Link>
          <Link href="/cookie-policy#preferences" className={btnSecondary}>
            Preferences (anchor)
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Essential cookies power sessions and CSRF protection — they are not optional for a secure account."
        objectPosition="object-center"
      />

      <h2>What are cookies?</h2>
      <p>
        Cookies are small text files placed on your device. Pixels and SDK
        counterparts exist in apps. Together they let us recognise returning
        visitors, attribute conversions, and debug performance — within the
        bounds of consent law in your region.
      </p>

      <h2>Categories we use</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — authentication, load balancing,
          security hardening, fraud prevention. No consent banner required in
          many jurisdictions because they are essential to deliver the
          service you asked for.
        </li>
        <li>
          <strong>Functional</strong> — language, accessibility settings, UI
          experiments you opt into. Can often be first-party only.
        </li>
        <li>
          <strong>Analytics</strong> — aggregated usage to prioritise roadmap
          work. We prefer privacy-preserving configurations and data minimisation.
        </li>
        <li>
          <strong>Marketing / attribution</strong> — measure ad performance,
          build audiences where permitted. Requires consent in GDPR/EEA-like
          regimes before non-essential tags fire.
        </li>
      </ul>

      <MarketingDetails title="Example cookie names (illustrative)">
        <table>
          <thead>
            <tr>
              <th>Name (example)</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>session_id</td>
              <td>Keeps you signed in</td>
              <td>Session / rolling</td>
            </tr>
            <tr>
              <td>csrf_token</td>
              <td>Prevents cross-site request forgery</td>
              <td>Session</td>
            </tr>
            <tr>
              <td>consent_v1</td>
              <td>Stores marketing opt-in state</td>
              <td>12 months</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-[13px] text-prel-tertiary-label">
          Replace with your real table exported from the consent management
          platform.
        </p>
      </MarketingDetails>

      <h2 id="preferences">Your choices</h2>
      <p>
        Where required, we show a consent banner or settings modal with granular
        toggles. You can also block categories in the browser; blocking strictly
        necessary cookies may break login or checkout. App users manage
        tracking permissions via OS dialogs (ATT on iOS, etc.).
      </p>

      <table>
        <thead>
          <tr>
            <th>Control surface</th>
            <th>What it affects</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{BRAND_NAME} cookie settings</td>
            <td>Non-essential web tags we operate</td>
          </tr>
          <tr>
            <td>Browser &quot;block third-party cookies&quot;</td>
            <td>May limit analytics &amp; ads</td>
          </tr>
          <tr>
            <td>Industry opt-outs (e.g. DAA, EDAA)</td>
            <td>Participating ad networks only</td>
          </tr>
        </tbody>
      </table>

      <h2>Updates</h2>
      <p>
        When we add new vendors or change retention, we refresh this Policy and
        re-solicit consent where mandated. Historical snapshots are retained for
        regulatory inquiries.
      </p>

      <MarketingFigure
        caption="Link this page from the footer and from any consent UI for a coherent member experience."
        objectPosition="object-right"
      />

      <h2>More detail</h2>
      <p>
        Personal data processing beyond storage on-device is described in the{" "}
        <Link href="/privacy">Privacy Centre</Link>. Marketplace rules live in{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </MarketingDocShell>
  );
}
