import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Accessibility",
  description: `Accessibility statement for ${BRAND_NAME}.`,
};

export default function AccessibilityPage() {
  return (
    <SimpleDocPage
      title="Accessibility"
      updated="April 2026"
      lead={`${BRAND_NAME} is committed to making our marketplace usable for as many people as possible.`}
    >
      <h2>Our approach</h2>
      <p>
        We aim to meet sensible accessibility practices on the web: readable
        typography, keyboard-friendly controls, descriptive labels, and
        sufficient colour contrast on core flows.
      </p>
      <h2>Ongoing improvements</h2>
      <p>
        The site evolves continuously. If you encounter a barrier — for example
        with a screen reader, keyboard navigation, or zoom — please tell us
        through support so we can prioritise a fix.
      </p>

      <h2>Third-party content</h2>
      <p>
        Some embedded content or linked experiences may be provided by partners
        and may not fully match {BRAND_NAME}&apos;s accessibility baseline.
      </p>
    </SimpleDocPage>
  );
}
