import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "How it works",
  description: `How buying and selling work on ${BRAND_NAME}.`,
};

export default function HowItWorksPage() {
  return (
    <SimpleDocPage
      title="How it works"
      lead={`${BRAND_NAME} is a community marketplace for second-hand fashion. Here is the journey in a few steps.`}
    >
      <h2>For sellers</h2>
      <ol>
        <li>Create an account and build your profile.</li>
        <li>Photograph your item and write an honest description.</li>
        <li>Set a fair price and publish your listing.</li>
        <li>Chat with buyers, ship when sold, and complete the order flow.</li>
      </ol>

      <h2>For buyers</h2>
      <ol>
        <li>Browse <Link href="/search">Discover</Link> or search for brands and sizes.</li>
        <li>Open a listing, read details, and message the seller if needed.</li>
        <li>Pay through {BRAND_NAME} checkout when available.</li>
        <li>Track delivery and confirm when your item arrives.</li>
      </ol>

      <h2>Trust</h2>
      <p>
        We combine member reviews, reporting tools, and platform rules to keep
        trades fair. Read more under{" "}
        <Link href="/safety">Trust and safety</Link>.
      </p>
    </SimpleDocPage>
  );
}
