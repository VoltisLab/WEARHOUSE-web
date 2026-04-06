import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Sustainability",
  description: `How ${BRAND_NAME} supports more sustainable fashion.`,
};

export default function SustainabilityPage() {
  return (
    <SimpleDocPage
      title="Sustainability"
      lead={`Every item sold on ${BRAND_NAME} is one more garment kept in use instead of going to waste.`}
    >
      <h2>Circular fashion</h2>
      <p>
        Resale extends the life of clothing and reduces demand for new
        production. We spotlight pre-loved pieces so great style does not have
        to mean new manufacturing.
      </p>

      <h2>What we are working on</h2>
      <ul>
        <li>Clearer product journeys from listing to delivery</li>
        <li>Education for sellers on accurate condition and care</li>
        <li>Partnerships and reporting aligned with our climate goals</li>
      </ul>

      <h2>Your impact</h2>
      <p>
        When you buy or sell on {BRAND_NAME}, you support a community-driven
        alternative to fast disposal. Thank you for choosing second-hand.
      </p>
    </SimpleDocPage>
  );
}
