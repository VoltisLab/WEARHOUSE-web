import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Advertising",
  description: `Advertising and brand partnerships on ${BRAND_NAME}.`,
};

export default function AdvertisingPage() {
  return (
    <SimpleDocPage
      title="Advertising"
      lead={`Reach engaged fashion shoppers through ${BRAND_NAME} advertising products.`}
    >
      <h2>Why advertise with us</h2>
      <p>
        {BRAND_NAME} audiences are actively browsing, listing, and buying
        fashion. Campaigns can support awareness, launches, and seasonal
        pushes.
      </p>

      <h2>Formats</h2>
      <ul>
        <li>Sponsored placements in browse and search surfaces (where available)</li>
        <li>Brand storytelling and curated collections</li>
        <li>Co-marketing with aligned sustainability or resale initiatives</li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        Contact your {BRAND_NAME} partnerships lead with objectives, budget
        range, and target markets. All ads must meet our brand safety and legal
        standards.
      </p>
    </SimpleDocPage>
  );
}
