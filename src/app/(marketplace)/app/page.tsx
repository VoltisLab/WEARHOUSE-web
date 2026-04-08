import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { AppStoreBadges } from "@/components/marketplace/AppStoreBadges";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Mobile apps",
  description: `Download the ${BRAND_NAME} app for iOS and Android.`,
};

const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function MobileAppsPage() {
  return (
    <MarketingDocShell
      eyebrow="Download"
      title="Mobile apps"
      subtitle="List faster, chat instantly, and get the checkout experience we ship updates to first."
      lead={`The native ${BRAND_NAME} apps for iOS and Android are where camera capture, push notifications, and full transactional flows are most polished. The website complements them for discovery and reading help - and we are steadily narrowing the gap.`}
      heroPosition="center"
      ctaRow={
        <>
          <div className="flex flex-wrap gap-3">
            <AppStoreBadges />
          </div>
          <Link href="/how-it-works" className={btnSecondary}>
            How it works
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Apps receive performance and security patches continuously - enable auto-update."
        objectPosition="object-[center_40%]"
      />

      <h2>iOS</h2>
      <p>
        Install from the App Store by searching <strong>{BRAND_NAME}</strong> or
        tapping your organisation&apos;s official link. Sign in with the same
        credentials as the web; iCloud Keychain and Face ID / Touch ID speed
        return visits. Enable notifications for offers, messages, and shipping
        events you care about - granular toggles live in system settings.
      </p>

      <MarketingDetails title="iOS permissions we may request">
        <ul>
          <li>
            <strong>Camera &amp; photos</strong> - to list items and upload
            profile imagery.
          </li>
          <li>
            <strong>Microphone</strong> - only if a feature explicitly uses
            audio; otherwise off.
          </li>
          <li>
            <strong>Location</strong> - optional for local discovery or
            shipping estimates; never required to browse.
          </li>
        </ul>
      </MarketingDetails>

      <h2>Android</h2>
      <p>
        Download from Google Play. We publish separate APK tracks for staged
        rollouts; beta programmes (if offered) are opt-in. Battery optimisations
        on some OEMs can delay notifications - if messages feel slow, disable
        aggressive background restrictions for {BRAND_NAME} while we work on
        vendor-specific guidance.
      </p>

      <table>
        <thead>
          <tr>
            <th>Capability</th>
            <th>App today</th>
            <th>Web today</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Listing with camera guides</td>
            <td>Full</td>
            <td>Varies by browser</td>
          </tr>
          <tr>
            <td>Real-time chat push</td>
            <td>Full</td>
            <td>Email / badge only</td>
          </tr>
          <tr>
            <td>Checkout</td>
            <td>Region-complete</td>
            <td>Expanding</td>
          </tr>
        </tbody>
      </table>

      <h2>Web experience</h2>
      <p>
        Use this site for long-form policies, Infoboard updates, and relaxed
        browsing sessions. Some account actions may deep-link into the app when
        a flow is not yet ported - that is intentional while we maintain quality
        bars.
      </p>

      <MarketingFigure
        caption="One account across surfaces - your messages and watchlist follow you when you sign in."
        objectPosition="object-left"
      />

      <h2>Security hygiene</h2>
      <p>
        Only install binaries from official stores or your employer&apos;s MDM.
        Report copycat apps impersonating {BRAND_NAME} immediately through{" "}
        <Link href="/safety">Trust and safety</Link>.
      </p>
    </MarketingDocShell>
  );
}
