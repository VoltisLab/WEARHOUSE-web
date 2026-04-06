import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Privacy Centre",
  description: `Privacy information for ${BRAND_NAME}.`,
};

export default function PrivacyPage() {
  return (
    <SimpleDocPage
      title="Privacy Centre"
      updated="April 2026"
      lead={`This page explains how ${BRAND_NAME} handles personal data on our marketplace. It is a summary — your final legal text should be reviewed by counsel.`}
    >
      <h2>Who we are</h2>
      <p>
        The data controller for {BRAND_NAME} is the legal entity operating the
        service in your region (insert registered name and address).
      </p>

      <h2>Data we collect</h2>
      <ul>
        <li>Account details (e.g. name, username, email, phone)</li>
        <li>Listings, photos, messages, and order information</li>
        <li>Device and usage data (e.g. logs, approximate location)</li>
        <li>Payment-related data processed by payment partners</li>
      </ul>

      <h2>Why we use data</h2>
      <ul>
        <li>Provide the marketplace and customer support</li>
        <li>Keep the platform safe and prevent fraud</li>
        <li>Improve features and measure performance</li>
        <li>Send service messages and (where allowed) marketing</li>
      </ul>

      <h2>Legal bases</h2>
      <p>
        Depending on region, we rely on contract, legitimate interests, legal
        obligation, and consent. You may withdraw consent where processing is
        consent-based.
      </p>

      <h2>Sharing</h2>
      <p>
        We share data with service providers (hosting, analytics, payments,
        shipping), authorities when required, and other members when you trade
        (e.g. shipping address to a seller).
      </p>

      <h2>Retention</h2>
      <p>
        We keep data only as long as needed for the purposes above, including
        legal, tax, and dispute resolution requirements.
      </p>

      <h2>Your rights</h2>
      <p>
        You may have rights to access, correct, delete, restrict, or object to
        processing, and to lodge a complaint with a supervisory authority.
        Contact your organisation&apos;s designated privacy inbox (add the
        official address here).
      </p>

      <h2>Cookies</h2>
      <p>
        See our <Link href="/cookie-policy">Cookie Policy</Link> for details on
        cookies and similar technologies.
      </p>
    </SimpleDocPage>
  );
}
