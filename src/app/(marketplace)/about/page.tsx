import type { Metadata } from "next";
import { SimpleDocPage } from "@/components/marketing/SimpleDocPage";
import { BRAND_NAME } from "@/lib/branding";

export const metadata: Metadata = {
  title: "About us",
  description: `Learn about ${BRAND_NAME} — the second-hand fashion marketplace.`,
};

export default function AboutPage() {
  return (
    <SimpleDocPage
      title="About WEARHOUSE"
      lead={`${BRAND_NAME} helps people buy and sell pre-loved clothing, shoes, and accessories in one trusted community.`}
    >
      <h2>Our mission</h2>
      <p>
        We make second-hand fashion easy to discover and simple to sell,
        reducing waste while helping wardrobes stay in circulation longer.
      </p>

      <h2>How we fit in</h2>
      <p>
        {BRAND_NAME} connects buyers and sellers with tools for listings,
        messaging, and safe checkout where available. We continue to improve the
        web experience alongside our mobile apps.
      </p>

      <h2>Contact</h2>
      <p>
        For press or partnerships, see our <a href="/press">Press</a> page.
        Member support is available through official in-app channels.
      </p>
    </SimpleDocPage>
  );
}
