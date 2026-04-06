import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Selling",
  description: "Learn how selling works on the WEARHOUSE marketplace.",
};

export default function HelpSellingPage() {
  return (
    <SimpleDocPage
      title="Selling on WEARHOUSE"
      lead={`Everything you need to list items, ship orders, and build a trusted shop on ${BRAND_NAME}.`}
    >
      <h2>Creating a listing</h2>
      <p>
        Add clear photos, an honest title, and accurate details (size, brand,
        condition, flaws). Buyers rely on your description — accurate listings
        lead to fewer returns and better reviews.
      </p>

      <h2>Pricing</h2>
      <p>
        Check similar items on {BRAND_NAME} to gauge fair pricing. You can
        adjust your price or run promotions where the product supports it.
      </p>

      <h2>Shipping</h2>
      <p>
        Pack items securely and ship within the timeframe you advertise. Use
        tracking when available and keep proof of postage. If you offer local
        pickup, agree a safe public meeting place.
      </p>

      <h2>Getting paid</h2>
      <p>
        Payout rules depend on your region and payment setup in the {BRAND_NAME}{" "}
        app or connected services. Complete any identity or payout verification
        steps so funds are not delayed.
      </p>

      <h2>Buyer messages</h2>
      <p>
        Reply promptly and professionally. Answer questions about fit,
        measurements, and condition. Avoid taking payments or sharing personal
        details outside approved checkout flows.
      </p>

      <h2>Prohibited items</h2>
      <p>
        Do not list counterfeit goods, recalled products, or anything that
        violates {BRAND_NAME} rules or local law. When in doubt, check our{" "}
        <a href="/our-platform">Our Platform</a> and <a href="/terms">Terms</a>{" "}
        pages or contact support.
      </p>
    </SimpleDocPage>
  );
}
