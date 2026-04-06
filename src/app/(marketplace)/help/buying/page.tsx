import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Buying",
  description: "Learn how buying works on the WEARHOUSE marketplace.",
};

export default function HelpBuyingPage() {
  return (
    <SimpleDocPage
      title="Buying on WEARHOUSE"
      lead={`How to shop second-hand fashion safely and get the best experience on ${BRAND_NAME}.`}
    >
      <h2>Before you buy</h2>
      <p>
        Read the full description, check photos, and ask the seller anything
        unclear (size, flaws, authenticity). Save items you like and compare
        similar listings.
      </p>

      <h2>Paying</h2>
      <p>
        Complete payment only through {BRAND_NAME}&apos;s official checkout.
        Never send money off-platform — it removes protections and makes
        disputes much harder to resolve.
      </p>

      <h2>After you order</h2>
      <p>
        You&apos;ll typically see order status and tracking in your account.
        If something is wrong (wrong item, damage, not as described), use
        in-app help or report the order according to our{" "}
        <a href="/safety">Trust and safety</a> guidance.
      </p>

      <h2>Returns and refunds</h2>
      <p>
        Policies depend on the listing, local consumer law, and {BRAND_NAME}{" "}
        rules at the time of purchase. Keep all packaging and photos if you
        need to open a claim.
      </p>

      <h2>Leaving feedback</h2>
      <p>
        Honest reviews help the community. Focus on facts: shipping speed,
        accuracy of description, and communication.
      </p>
    </SimpleDocPage>
  );
}
