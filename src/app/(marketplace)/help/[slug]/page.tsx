import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HelpArticleBody } from "@/components/help/HelpArticleBody";
import { MarketingDocShell } from "@/components/marketing/MarketingDocShell";
import {
  HELP_ARTICLE_SLUGS,
  HELP_ARTICLES,
  type HelpArticleSlug,
} from "@/lib/help-centre-articles";
import { helpArticleHeroImage } from "@/lib/marketing-hero-registry";
const btnPrimary =
  "inline-flex items-center justify-center rounded-xl bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:brightness-110";
const btnSecondary =
  "inline-flex items-center justify-center rounded-xl bg-prel-bg-grouped px-5 py-2.5 text-[14px] font-semibold text-prel-label transition duration-300 hover:-translate-y-0.5 hover:bg-prel-bg-grouped/90";

export function generateStaticParams() {
  return HELP_ARTICLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = HELP_ARTICLES[slug as HelpArticleSlug];
  if (!doc) return { title: "Help" };
  return { title: doc.title, description: doc.description };
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = HELP_ARTICLES[slug as HelpArticleSlug];
  if (!doc) notFound();

  return (
    <MarketingDocShell
      eyebrow="Help"
      title={doc.title}
      subtitle={doc.description}
      updated="April 2026"
      lead={doc.lead}
      heroPosition="center"
      heroImage={helpArticleHeroImage(slug)}
      ctaRow={
        <>
          <Link href="/help" className={btnPrimary}>
            Help Centre home
          </Link>
          <Link href="/help#browse-topics" className={btnSecondary}>
            Browse all topics
          </Link>
        </>
      }
    >
      <HelpArticleBody sections={doc.sections} />
    </MarketingDocShell>
  );
}
