import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Item verification",
  description: `Item verification and authenticity on ${BRAND_NAME}.`,
};

export default function ItemVerificationPage() {
  return (
    <SimpleDocPage
      title="Item verification"
      lead={`How ${BRAND_NAME} approaches authenticity and high-value items.`}
    >
      <h2>Member responsibility</h2>
      <p>
        Sellers must only list genuine items and describe condition accurately.
        Counterfeits are prohibited and may lead to account action.
      </p>

      <h2>Verification programmes</h2>
      <p>
        Where {BRAND_NAME} operates optional verification or authentication
        services, eligibility, fees, and timelines will be shown at checkout or
        in the listing flow. Not all categories or regions offer verification
        today.
      </p>

      <h2>Reporting fakes</h2>
      <p>
        If you believe a listing is counterfeit, use in-app reporting or
        follow <a href="/safety">Trust and safety</a> guidance. Include photos
        and order details when applicable.
      </p>
    </SimpleDocPage>
  );
}
