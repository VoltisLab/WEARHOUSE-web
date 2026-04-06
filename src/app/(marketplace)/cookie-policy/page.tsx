import type { Metadata } from "next";
import Link from "next/link";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `Cookie policy for ${BRAND_NAME}.`,
};

export default function CookiePolicyPage() {
  return (
    <SimpleDocPage
      title="Cookie Policy"
      updated="April 2026"
      lead={`How ${BRAND_NAME} uses cookies and similar technologies.`}
    >
      <h2>What are cookies?</h2>
      <p>
        Cookies are small files stored on your device. We also use similar
        technologies such as local storage and pixels where needed.
      </p>

      <h2>Types we use</h2>
      <ul>
        <li>
          <strong>Strictly necessary</strong> — security, load balancing, and
          core site function.
        </li>
        <li>
          <strong>Preferences</strong> — remember settings like language where
          applicable.
        </li>
        <li>
          <strong>Analytics</strong> — understand usage to improve performance
          (often aggregated).
        </li>
        <li>
          <strong>Marketing</strong> — measure campaigns when enabled and
          permitted.
        </li>
      </ul>

      <h2 id="preferences">Cookie settings</h2>
      <p>
        Where required, we provide controls to manage non-essential cookies.
        You can also adjust your browser settings; blocking some cookies may
        affect functionality.
      </p>

      <h2>More information</h2>
      <p>
        Read the <Link href="/privacy">Privacy Centre</Link> for how personal
        data is processed alongside cookies.
      </p>
    </SimpleDocPage>
  );
}
