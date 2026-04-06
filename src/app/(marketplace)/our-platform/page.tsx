import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Our Platform",
  description: `Platform rules and transparency for ${BRAND_NAME}.`,
};

export default function OurPlatformPage() {
  return (
    <SimpleDocPage
      title="Our Platform"
      lead={`How ${BRAND_NAME} works for members — moderation, ranking, and transparency.`}
    >
      <h2>Marketplace rules</h2>
      <p>
        Everyone must follow our community standards: honest listings, respectful
        chat, and compliance with law. We remove content and restrict accounts
        when rules are broken.
      </p>

      <h2>Ranking and search</h2>
      <p>
        Results may be ordered by relevance, recency, popularity, and policy
        signals designed to improve trust. Sponsored placements, if any, are
        labelled according to policy.
      </p>

      <h2>Enforcement</h2>
      <p>
        Actions can include warnings, listing removal, temporary suspension, or
        permanent bans. Serious cases may be referred to authorities.
      </p>

      <h2>Appeals</h2>
      <p>
        If you believe a decision was wrong, use the in-app appeal or support
        flow with evidence. Not all decisions are reversible.
      </p>

      <h2>Related policies</h2>
      <p>
        <Link href="/terms">Terms &amp; Conditions</Link>,{" "}
        <Link href="/privacy">Privacy Centre</Link>, and{" "}
        <Link href="/safety">Trust and safety</Link>.
      </p>
    </SimpleDocPage>
  );
}
