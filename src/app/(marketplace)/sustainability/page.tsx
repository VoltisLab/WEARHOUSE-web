import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "Sustainability",
  description: `How ${BRAND_NAME} supports more sustainable fashion.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function SustainabilityPage() {
  return (
    <MarketingDocShell
      eyebrow="Impact"
      title="Sustainability"
      subtitle="Keeping clothes in use is the most direct climate lever a wardrobe can pull."
      lead={`Every completed sale on ${BRAND_NAME} is a garment that continues its life with a new owner - displacing demand for virgin production, reducing pressure on water and chemistry-intensive manufacturing, and cutting the likelihood of incineration or landfill. We are a technology company; our environmental story is inseparable from what millions of small decisions on the platform add up to.`}
      heroPosition="top"
      ctaRow={
        <>
          <Link href="/how-it-works" className={btnPrimary}>
            See how trading works
          </Link>
          <Link href="/about" className={btnSecondary}>
            Our mission
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Second-hand does not mean second-best - quality pieces age with character."
        objectPosition="object-[center_40%]"
      />

      <h2>The physics of circular fashion</h2>
      <p>
        Most of a garment&apos;s lifetime footprint is locked in before it ever
        reaches a closet: fibre production, dyeing, finishing, and assembly.
        Extending wear by even a few months across many items compounds into
        meaningful avoided emissions. Marketplaces like ours do not erase
        shipping or packaging impact - we work to right-size both - but the
        dominant win comes from substituting reused inventory for new.
      </p>

      <blockquote>
        The most sustainable piece is often the one that already exists. Our
        job is to make finding it feel modern, fast, and safe.
      </blockquote>

      <h2>What we optimise for</h2>
      <ul>
        <li>
          <strong>Longer wear cycles</strong> - accurate condition reporting so
          buyers know what they are getting and keep items longer.
        </li>
        <li>
          <strong>Lower return waste</strong> - better photos and sizing context
          to reduce back-and-forth shipping.
        </li>
        <li>
          <strong>Responsible operations</strong> - efficient infrastructure,
          mindful defaults in product, and transparent reporting as we mature.
        </li>
      </ul>

      <MarketingDetails title="Measuring impact (how we talk about numbers)">
        <p>
          We avoid greenwashing. Where we publish estimates, we aim to show
          methodology, data sources, and uncertainty. Member-level &quot;you
          saved X kg CO₂&quot; badges can motivate behaviour but must be
          defensible; we prefer conservative assumptions and third-party review
          for public claims.
        </p>
      </MarketingDetails>

      <h2>Seller education</h2>
      <p>
        Care labels, fabric composition, and honest flaw photography help buyers
        trust pre-loved stock. We surface tips in the listing flow and in{" "}
        <Link href="/help/selling">Selling</Link> guides - not as nagging, but
        as shortcuts to faster sales and happier recipients.
      </p>

      <table>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Why it matters</th>
            <th>Member action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Materials</td>
            <td>Fibres have different recycling paths</td>
            <td>Tag fabric in listings when known</td>
          </tr>
          <tr>
            <td>Care</td>
            <td>Proper washing extends life</td>
            <td>Share care habits in description</td>
          </tr>
          <tr>
            <td>Packaging</td>
            <td>Reuse beats single-use</td>
            <td>Ship in clean, reused boxes</td>
          </tr>
        </tbody>
      </table>

      <MarketingFigure
        caption="Circularity is a network effect: more listings mean better matches and less idle stock."
        objectPosition="object-left"
      />

      <h2>Partnerships &amp; reporting</h2>
      <p>
        We engage brands, charities, and industry groups where aligned programs
        can divert quality stock from disposal or support resale education.
        Material updates appear on the <Link href="/infoboard">Infoboard</Link>{" "}
        and, when formal, in filings or sustainability reports your team
        maintains outside this marketing site.
      </p>

      <h2>Your role</h2>
      <p>
        Choosing second-hand is already a meaningful act. When you also sell
        pieces you no longer wear, you shrink your own footprint and put
        something wonderful into another person&apos;s rotation. Thank you for
        trading on {BRAND_NAME}.
      </p>
    </MarketingDocShell>
  );
}
