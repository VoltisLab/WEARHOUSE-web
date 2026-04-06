import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Terms and conditions for using ${BRAND_NAME}.`,
};

export default function TermsPage() {
  return (
    <SimpleDocPage
      title="Terms & Conditions"
      updated="April 2026"
      lead={`These terms govern use of ${BRAND_NAME}. Replace this draft with lawyer-approved terms before relying on it in disputes.`}
    >
      <h2>1. The service</h2>
      <p>
        {BRAND_NAME} provides an online marketplace where members may list and
        purchase second-hand fashion items, subject to these terms and our
        policies.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information and keep credentials secure. You
        are responsible for activity under your account.
      </p>

      <h2>3. Listings and sales</h2>
      <p>
        Sellers warrant they have the right to sell listed items. Buyers must
        pay through authorised flows. Specific buyer/seller obligations may
        be supplemented by checkout terms and local consumer law.
      </p>

      <h2>4. Prohibited conduct</h2>
      <p>
        No illegal items, harassment, fraud, circumvention of fees, or abuse of
        the platform. We may suspend or remove accounts that breach rules.
      </p>

      <h2>5. Fees</h2>
      <p>
        Applicable fees, taxes, and currency rules are disclosed at the point of
        use. We may change fee structures with reasonable notice where required.
      </p>

      <h2>6. Intellectual property</h2>
      <p>
        {BRAND_NAME} trademarks and software are protected. You grant us a
        licence to host and display content you upload as needed to run the
        service.
      </p>

      <h2>7. Limitation of liability</h2>
      <p>
        To the extent permitted by law, we limit liability for indirect losses
        and marketplace disputes between members. Some jurisdictions do not
        allow certain limitations — those limits may not apply to you.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these terms. Continued use after changes constitutes
        acceptance where allowed by law.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms should go to your official support
        channel. See also <Link href="/privacy">Privacy Centre</Link>.
      </p>
    </SimpleDocPage>
  );
}
