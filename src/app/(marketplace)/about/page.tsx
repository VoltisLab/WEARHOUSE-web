import type { Metadata } from "next";
import Link from "next/link";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import { MarketingFigure } from "@/components/marketing/MarketingFigure";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "About us",
  description: `Learn about ${BRAND_NAME} - the second-hand fashion marketplace.`,
};

const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl border border-prel-separator bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:border-[var(--prel-primary)]/35 hover:shadow-ios";

export default function AboutPage() {
  return (
    <MarketingDocShell
      eyebrow="WEARHOUSE"
      title="About us"
      subtitle="A marketplace built for people who love clothes - and hate waste."
      updated="April 2026"
      lead={`${BRAND_NAME} exists to make second-hand fashion feel as effortless as buying new: clear listings, confident buyers, and sellers who are proud of what they pass on. We are a community-first product team shipping the web experience alongside native apps, with the same standards for trust, safety, and craft.`}
      heroPosition="center"
      ctaRow={
        <>
          <Link href="/how-it-works" className={btnPrimary}>
            How it works
          </Link>
          <Link href="/press" className={btnSecondary}>
            Press & media
          </Link>
        </>
      }
    >
      <MarketingFigure
        caption="Our community keeps garments in circulation - every resale is a small act of circular fashion."
        objectPosition="object-[center_30%]"
      />

      <h2>What we believe</h2>
      <p>
        Fashion should not be disposable. The best wardrobe is often the one
        that already exists - on racks, in closets, and now on {BRAND_NAME}.
        We believe resale should reward honesty: accurate photos, plain
        language about wear, and prices that reflect real life. When that
        happens, buyers feel confident, sellers build reputation, and fewer
        pieces end up in landfill.
      </p>
      <blockquote>
        We are not trying to replace the joy of discovery. We are trying to
        widen it - so the thrill of the find includes vintage, archive, and
        gently worn pieces alongside the new.
      </blockquote>

      <h2>How {BRAND_NAME} fits together</h2>
      <p>
        At the centre is the marketplace: listings, search, seller shops, and
        messaging. Around it sit the systems members rarely see - fraud
        signals, policy enforcement, payouts, notifications, and the
        infrastructure that keeps the service fast on both mobile and web. Our
        roadmap is public in spirit on the{" "}
        <Link href="/infoboard">Infoboard</Link>, where we note meaningful
        releases and incidents that affect trading.
      </p>

      <MarketingDetails title="Product principles we design against">
        <ul>
          <li>
            <strong>Clarity over cleverness.</strong> Labels, fees, and
            shipping expectations should never be a puzzle.
          </li>
          <li>
            <strong>Safety by default.</strong> Checkout, chat, and reporting
            live in one governed surface - not scattered across DMs and
            payment apps.
          </li>
          <li>
            <strong>Accessibility is not optional.</strong> Core flows must work
            with keyboard, zoom, and assistive tech; read our{" "}
            <Link href="/accessibility">Accessibility</Link> statement for how
            we track gaps.
          </li>
          <li>
            <strong>Regional reality.</strong> Consumer law, payments, and
            logistics differ by country - we surface what applies to you at the
            point of use.
          </li>
        </ul>
      </MarketingDetails>

      <h2>Who we serve</h2>
      <p>
        Sellers range from casual closet-clearers to power sellers running
        small businesses. Buyers include students stretching a budget,
        collectors hunting rare pieces, and anyone swapping fast fashion for
        longer-lasting wardrobes. Our job is to give both sides tools that
        respect their time: smart defaults, fast media upload, and support
        paths that do not require a law degree.
      </p>

      <table>
        <thead>
          <tr>
            <th>Audience</th>
            <th>What they need most</th>
            <th>Where we invest</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>New sellers</td>
            <td>Confidence listing &amp; shipping</td>
            <td>Guides, templates, in-flow tips</td>
          </tr>
          <tr>
            <td>Experienced sellers</td>
            <td>Throughput &amp; reputation</td>
            <td>Shop surfaces, metrics, bulk tools</td>
          </tr>
          <tr>
            <td>Buyers</td>
            <td>Trust &amp; discovery</td>
            <td>Search quality, verification info, safety</td>
          </tr>
        </tbody>
      </table>

      <h2>Sustainability in practice</h2>
      <p>
        Resale is not a marketing slogan for us - it is the business model.
        Every transaction extends useful life for garments and accessories. We
        are honest that platforms also consume energy; we work to measure and
        reduce operational footprint while amplifying the climate benefit of
        avoided production. The fuller picture lives on{" "}
        <Link href="/sustainability">Sustainability</Link>.
      </p>

      <MarketingFigure
        caption="Detail from our marketplace photography - we celebrate texture, patina, and honest condition."
        objectPosition="object-right"
      />

      <h2>Working with us</h2>
      <p>
        Brands, NGOs, and media partners reach us through the channels listed on{" "}
        <Link href="/advertising">Advertising</Link> and{" "}
        <Link href="/press">Press</Link>. If you are a member who needs help
        with an order or account, use in-app support - that routing reaches the
        team who can see your case.
      </p>

      <h2>Legal &amp; policies</h2>
      <p>
        Governance matters for a marketplace. Our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>,{" "}
        <Link href="/privacy">Privacy Centre</Link>, and{" "}
        <Link href="/our-platform">Our Platform</Link> pages explain rules,
        enforcement, and data use in depth. They are written to be readable;
        your counsel should still review any draft before production reliance.
      </p>
    </MarketingDocShell>
  );
}
