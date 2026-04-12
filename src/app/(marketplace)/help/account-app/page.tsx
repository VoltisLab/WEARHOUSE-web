import type { Metadata } from "next";
import Link from "next/link";
import { HelpHubLinkList } from "@/components/help/HelpHubLinkList";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { HELP_HOME_TOPIC_SECTIONS } from "@/lib/help-centre-nav";
import { BRAND_NAME } from "@/lib/branding";
import { DOC_PAGE_HERO } from "@/lib/marketing-hero-registry";

export const metadata: Metadata = {
  title: "Account & app",
  description: `Sign up, guest mode, verification, onboarding, and settings on ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped/90";

const indexLinks = HELP_HOME_TOPIC_SECTIONS[2]!.links;

export default function HelpAccountAppHubPage() {
  return (
    <MarketingDocShell
      eyebrow="Help"
      title="Account & app"
      subtitle="Authentication, guest browsing, verification, onboarding, and where settings live."
      updated="April 2026"
      lead={`Covers the start of every journey on ${BRAND_NAME}: from Welcome back through first tabs and the Settings gear in Profile → Menu.`}
      heroPosition="left"
      heroImage={DOC_PAGE_HERO.helpAccountApp}
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
      <h2>Guides & tours</h2>
      <HelpHubLinkList links={indexLinks} skipHref="/help/account-app" />

      <h2>Sign up & log in</h2>
      <MarketingDetails title="Sign up">
        <ol>
          <li>Open the app. On Welcome back, tap Sign up under the form.</li>
          <li>Complete the fields and submit.</li>
          <li>
            If asked, verify your email before shopping or listing — use Enter
            verification code when offered.
          </li>
        </ol>
        <p>
          You log in later with the <strong>username</strong> you chose, not
          only a display name.
        </p>
      </MarketingDetails>
      <MarketingDetails title="Log in">
        <ol>
          <li>Enter Username and Password on Welcome back.</li>
          <li>Tap Login.</li>
          <li>
            If you see a verification error, use Enter verification code or the
            email flow the app shows.
          </li>
        </ol>
        <p>
          After login you have five tabs: Home, Discover, Sell, Inbox, Profile.
        </p>
      </MarketingDetails>
      <MarketingDetails title="Guest browsing">
        <ol>
          <li>On Welcome back, tap Continue as guest.</li>
          <li>Browse Home and Discover.</li>
          <li>
            Checkout, messaging, and other member actions prompt you to sign in
            or create an account.
          </li>
        </ol>
      </MarketingDetails>
      <MarketingDetails title="Forgot password">
        <ol>
          <li>Tap Forgot password? on Welcome back.</li>
          <li>Follow reset steps (email or in-app).</li>
          <li>Set a new password, then log in with username + password.</li>
        </ol>
      </MarketingDetails>

      <h2>Verification & onboarding</h2>
      <MarketingDetails title="Email and account verification">
        <p>
          Confirms you own the contact details on your account. You may see it
          after sign-up, on login errors, or when you change email under
          Settings → Account.
        </p>
      </MarketingDetails>
      <MarketingDetails title="First-time onboarding">
        <p>
          After first successful sign-in, a full-screen story may appear — swipe
          through Try Cart, Lookbooks, and other highlights, then continue to
          the main app. It only shows when your account is marked as needing it.
        </p>
      </MarketingDetails>
      <MarketingDetails title="Account restriction (moderation)">
        <p>
          If your account is under review, a full-screen message may appear after
          sign-in. Read it and follow instructions (e.g. contact support). There
          is no menu shortcut — it appears when it applies.
        </p>
      </MarketingDetails>

      <h2>Profile Menu (three lines)</h2>
      <p>
        Tap the <strong>three horizontal lines</strong> on Profile. The full-screen{" "}
        <strong>Menu</strong> list matches the app: <strong>Lookbook</strong> (Beta),{" "}
        <strong>Seller dashboard</strong>, <strong>Orders</strong>,{" "}
        <strong>Favourites</strong>, <strong>Multi-buy discounts</strong>,{" "}
        <strong>Vacation Mode</strong>, <strong>Invite Friend</strong>,{" "}
        <strong>Help Centre</strong>, <strong>About WEARHOUSE</strong>,{" "}
        <strong>Logout</strong>. Tap the <strong>gear</strong> on that screen for{" "}
        <strong>Settings</strong>.
      </p>

      <h2>Settings (gear on Menu)</h2>
      <p>From Menu, tap the gear. Typical rows include:</p>
      <ul>
        <li>Profile, Account, Currency, Shipping, Appearance, Language</li>
        <li>Payments, Security &amp; Privacy, Identity verification</li>
        <li>Lookbook settings, Push / Email notifications, Invite Friend</li>
      </ul>

      <h2>See also</h2>
      <p>
        <Link href="/terms" className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline">
          Terms
        </Link>
        ,{" "}
        <Link href="/privacy" className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline">
          Privacy
        </Link>
        , and{" "}
        <Link href="/how-it-works" className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline">
          How it works
        </Link>{" "}
        on the marketing site.
      </p>
    </MarketingDocShell>
  );
}
