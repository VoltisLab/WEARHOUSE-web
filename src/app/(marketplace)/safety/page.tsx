import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Trust and safety",
  description: `Trust and safety on ${BRAND_NAME}.`,
};

export default function SafetyPage() {
  return (
    <SimpleDocPage
      title="Trust and safety"
      lead={`${BRAND_NAME} is built on trust. Here is how to stay safe and what we do to protect members.`}
    >
      <h2>Staying safe</h2>
      <ul>
        <li>Keep payments and communication inside {BRAND_NAME} where required.</li>
        <li>Meet in public places for local pickup; avoid sharing unnecessary personal data.</li>
        <li>Be wary of deals that seem too good to be true or rushed off-platform.</li>
      </ul>

      <h2>Counterfeits and misrepresentation</h2>
      <p>
        Report listings that appear fake or misleading. We investigate and may
        remove items or suspend sellers. See{" "}
        <Link href="/item-verification">Item verification</Link> for more.
      </p>

      <h2>Harassment and abuse</h2>
      <p>
        Hate speech, threats, and unwanted contact are not tolerated. Block
        users and report conversations through the tools in your account.
      </p>

      <h2>Orders and disputes</h2>
      <p>
        If an item does not arrive or is not as described, use the order help
        flow. Keep photos of packaging and the item received.
      </p>

      <h2>Law enforcement</h2>
      <p>
        We cooperate with valid legal requests and prioritise member safety in
        line with applicable law and our policies.
      </p>

      <h2>More help</h2>
      <p>
        Visit the <Link href="/help">Help Centre</Link> for buying and selling
        guides, or read <Link href="/our-platform">Our Platform</Link> for rule
        enforcement detail.
      </p>
    </SimpleDocPage>
  );
}
