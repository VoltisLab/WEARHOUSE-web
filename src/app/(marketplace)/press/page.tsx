import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Press",
  description: `Press and media information for ${BRAND_NAME}.`,
};

export default function PressPage() {
  return (
    <SimpleDocPage
      title="Press"
      lead="Media enquiries and brand assets for WEARHOUSE."
    >
      <h2>Media contact</h2>
      <p>
        Journalists and producers can reach the {BRAND_NAME} communications team
        through your official company contact email (configure this address
        for your organisation).
      </p>

      <h2>Brand guidelines</h2>
      <p>
        Please use the name <strong>{BRAND_NAME}</strong> and approved logos
        only. Do not imply partnership without written consent.
      </p>

      <h2>Press kit</h2>
      <p>
        High-resolution logos and product screenshots can be provided on
        request. Include your outlet, deadline, and story angle.
      </p>
    </SimpleDocPage>
  );
}
