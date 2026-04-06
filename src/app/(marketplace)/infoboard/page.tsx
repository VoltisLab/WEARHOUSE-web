import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Infoboard",
  description: `Updates and notices from the ${BRAND_NAME} team.`,
};

export default function InfoboardPage() {
  return (
    <SimpleDocPage
      title="Infoboard"
      lead={`Official updates about ${BRAND_NAME} — features, incidents, and reminders.`}
    >
      <h2>April 2026</h2>
      <p>
        <strong>Web marketplace</strong> — Browse, search, and view seller
        shops from your browser. Sign in for messages and account features.
      </p>

      <h2>Stay informed</h2>
      <p>
        For personalised alerts, enable notifications in the {BRAND_NAME} app.
        For policy changes, see <Link href="/terms">Terms &amp; Conditions</Link>{" "}
        and <Link href="/privacy">Privacy Centre</Link>.
      </p>
    </SimpleDocPage>
  );
}
