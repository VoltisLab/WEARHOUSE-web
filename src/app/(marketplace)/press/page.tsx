import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Press",
  description: `Press and media information for ${BRAND_NAME}.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function PressPage() {
  return (
    <MarketingDocShell
      eyebrow="Media"
      title="Press"
      subtitle="Facts, contacts, and brand guardrails for journalists and producers."
      updated="April 2026"
      lead={`${BRAND_NAME} welcomes coverage that helps audiences understand resale: how marketplaces work, what buyers should expect, and how sellers build livelihoods. This page centralises how to reach us, what you can use without permission, and what requires a sign-off.`}
      heroPosition="right"
      ctaRow={
        <>
          <a href="mailto:press@wearhouse.example" className={btnPrimary}>
            Email press desk
          </a>
          <Link href="/about" className={btnSecondary}>
            Company overview
          </Link>
        </>
      }
    >
      <p className="text-[13px] text-prel-tertiary-label">
        Replace <code className="rounded bg-prel-bg-grouped px-1.5 py-0.5 text-[12px]">press@wearhouse.example</code>{" "}
        with your live communications inbox before launch.
      </p>

      <MarketingFigure
        caption="Brand imagery emphasises real closets, natural light, and diverse bodies — request high-res from the press team."
        objectPosition="object-center"
      />

      <h2>Media contact</h2>
      <p>
        For interview requests, fact-checking, broadcast licensing, and
        executive commentary, email the communications team with your outlet,
        deadline (including time zone), and whether you need B-roll or stills.
        We prioritise working press on deadline and aim to acknowledge within one
        business day where staffing allows.
      </p>

      <MarketingDetails title="What to include in your first email">
        <ul>
          <li>Publication or programme name and audience reach</li>
          <li>Story thesis and any claims you plan to attribute to us</li>
          <li>Required turnaround and preferred format (written, live, pre-record)</li>
          <li>Languages and regions the piece will appear in</li>
        </ul>
      </MarketingDetails>

      <h2>Brand name &amp; wordmark</h2>
      <p>
        Use <strong>{BRAND_NAME}</strong> in all caps as the product name. Do
        not modify the logotype, combine it with third-party marks, or imply
        endorsement from designers or brands pictured in user-generated
        listings. For co-marketing, obtain written approval from partnerships.
      </p>

      <h2>Press kit contents</h2>
      <p>
        On request we provide vector logos (light/dark), UI screenshots under
        agreed usage windows, executive bios, and boilerplate describing the
        marketplace. We do not share member data or non-public metrics without
        legal review and, where needed, anonymisation.
      </p>

      <table>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Typical turnaround</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Logo pack</td>
            <td>Same day</td>
            <td>PNG, SVG, brand colours</td>
          </tr>
          <tr>
            <td>Product screenshots</td>
            <td>1–2 days</td>
            <td>Cleared for embargo windows</td>
          </tr>
          <tr>
            <td>Executive quote</td>
            <td>Varies</td>
            <td>May require async written answers</td>
          </tr>
        </tbody>
      </table>

      <h2>Imagery ethics</h2>
      <p>
        Marketplace photography often includes people&apos;s homes and bodies.
        Press use should crop or anonymise where consent is unclear. We can
        supply alternate assets shot under studio agreements when cover art
        requires a cleaner visual.
      </p>

      <MarketingFigure
        caption="Editorial use: pair marketplace context with clear labelling so readers understand resale mechanics."
        objectPosition="object-[center_20%]"
      />

      <h2>Crises &amp; corrections</h2>
      <p>
        If you are reporting on an outage, enforcement action, or regulatory
        matter, contact press first so we can confirm facts and provide an
        on-record statement. We correct inaccuracies quickly when flagged with
        specifics.
      </p>

      <h2>Related</h2>
      <p>
        Advertising partnerships: <Link href="/advertising">Advertising</Link>.
        Product changes: <Link href="/infoboard">Infoboard</Link>. Trust &
        safety angles: <Link href="/safety">Trust and safety</Link>.
      </p>
    </MarketingDocShell>
  );
}
