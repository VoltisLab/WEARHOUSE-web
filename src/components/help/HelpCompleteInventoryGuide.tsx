import Link from "next/link";
import { MarketingDetails } from "@/components/marketing/MarketingDetails";
import {
  IN_APP_HELP_INTRO,
  IN_APP_HELP_LEGAL_NOTE,
  IN_APP_HELP_URL_ROWS,
  PERSONA_QA_GROUPS,
  PERSONA_QA_INTRO,
} from "@/lib/help-centre-inventory-appendix";
import {
  INVENTORY_DOC_PROLOGUE,
  INVENTORY_MANIFEST_SECTIONS,
} from "@/lib/help-centre-inventory-manifest-data";
import {
  INVENTORY_GUIDE_GROUPS,
  type InventoryGuideFeature,
} from "@/lib/help-centre-inventory-guide-data";
import { BRAND_NAME } from "@/lib/branding";
import { HelpInventoryManifestSection } from "./HelpInventoryManifest";
import { InventoryBoldText } from "./InventoryBoldText";
import { InventoryRichText } from "./InventoryRichText";

function FeatureCard({ f }: { f: InventoryGuideFeature }) {
  return (
    <article id={f.id} className="scroll-mt-28 pt-10 first:pt-0">
      <h3 className="text-[18px] font-bold tracking-tight text-prel-label">
        <InventoryBoldText text={f.title} />
      </h3>
      {f.why ? (
        <p className="mt-3 text-[15px] leading-relaxed text-prel-secondary-label">
          <span className="font-semibold text-prel-label">Why it matters: </span>
          <InventoryBoldText text={f.why} />
        </p>
      ) : null}
      {f.steps.length > 0 ? (
        <div className="mt-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-tertiary-label">
            How to use it
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-prel-label">
            {f.steps.map((s, i) => (
              <li key={i}>
                <InventoryBoldText text={s} />
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {f.expect ? (
        <p className="mt-4 rounded-xl bg-prel-bg-grouped/80 px-4 py-3 text-[14px] leading-relaxed text-prel-secondary-label">
          <span className="font-semibold text-prel-label">What to expect: </span>
          <InventoryBoldText text={f.expect} />
        </p>
      ) : null}
      {f.goodToKnow ? (
        <p className="mt-3 text-[14px] leading-relaxed text-prel-secondary-label">
          <span className="font-semibold text-prel-label">Good to know: </span>
          <InventoryBoldText text={f.goodToKnow} />
        </p>
      ) : null}
    </article>
  );
}

export function HelpCompleteInventoryGuide() {
  return (
    <div className="space-y-12">
      <div className="rounded-2xl bg-prel-bg-grouped/60 px-4 py-5 md:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-prel-tertiary-label">
          Full inventory source
        </p>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-prel-secondary-label">
          {INVENTORY_DOC_PROLOGUE.map((p, i) => (
            <p key={i}>
              <InventoryRichText text={p} />
            </p>
          ))}
        </div>
        <p className="mt-4 text-[15px] leading-relaxed text-prel-secondary-label">
          Below, every section of <strong>HELP_CENTRE_FEATURE_INVENTORY.md</strong> is
          reproduced in a web-friendly shape: the commercial <strong>step-by-step</strong>{" "}
          guide first, then <strong>sections 6–7</strong> (QA + URLs), then{" "}
          <strong>sections 1–5, 8, and 9</strong> (DNS, navigation, Swift views, modals,
          services, authoring template, revision log). A few labels match current iOS copy
          (e.g.{" "}
          <strong>Buy now</strong>, <strong>Send an offer</strong>).
        </p>
        <p className="mt-3 text-[13px] text-prel-tertiary-label">
          Regenerate from the Swift repo markdown:{" "}
          <code className="rounded bg-white/80 px-1.5 py-0.5 text-[12px]">
            npm run generate:help-inventory
          </code>
        </p>
      </div>

      <nav
        className="rounded-2xl bg-white px-4 py-5 md:px-6"
        aria-label="Guide table of contents"
      >
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-prel-tertiary-label">
          On this page
        </h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVENTORY_GUIDE_GROUPS.map((g) => (
            <div key={g.title}>
              <p className="text-[14px] font-bold text-prel-label">{g.title}</p>
              <ul className="mt-2 max-h-52 space-y-1.5 overflow-y-auto pr-1 text-[13px]">
                {g.items.map((f) => (
                  <li key={f.id}>
                    <a
                      href={`#${f.id}`}
                      className="text-[var(--prel-primary)] underline-offset-2 hover:underline"
                    >
                      {f.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-prel-separator/50 pt-6">
          <p className="text-[13px] font-semibold text-prel-label">
            Technical &amp; authoring sections (same markdown file)
          </p>
          <ul className="mt-3 grid gap-2 text-[13px] sm:grid-cols-2">
            {INVENTORY_MANIFEST_SECTIONS.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-[var(--prel-primary)] underline-offset-2 hover:underline"
                >
                  {s.title.replace(/`/g, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-[13px] text-prel-secondary-label">
          <a
            href="#in-app-urls"
            className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
          >
            Section 7 — In-app article paths
          </a>
          {" · "}
          <a
            href="#persona-qa"
            className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
          >
            Section 6 — Device QA checklist
          </a>
        </p>
      </nav>

      <section className="space-y-2">
        <h2 className="text-[22px] font-bold tracking-tight text-prel-label">
          Commercial feature guide
        </h2>
        <p className="max-w-3xl text-[15px] leading-relaxed text-prel-secondary-label">
          One topic at a time — the same “why / steps / expect / tips” structure as the
          inventory file, grouped so you can skim on the web.
        </p>
      </section>

      {INVENTORY_GUIDE_GROUPS.map((g) => (
        <section key={g.title} className="space-y-8">
          <h2 className="text-[22px] font-bold tracking-tight text-prel-label">
            {g.title}
          </h2>
          <div className="space-y-10">
            {g.items.map((f) => (
              <FeatureCard key={f.id} f={f} />
            ))}
          </div>
        </section>
      ))}

      <section id="in-app-urls" className="scroll-mt-28 space-y-4">
        <h2 className="text-[20px] font-bold text-prel-label">
          Section 7 — In-app help URLs ({BRAND_NAME} app)
        </h2>
        {IN_APP_HELP_INTRO.map((p, i) => (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-prel-secondary-label"
          >
            <InventoryRichText text={p} />
          </p>
        ))}
        <ul className="space-y-2 rounded-xl bg-white px-4 py-4 text-[14px] md:px-5">
          {IN_APP_HELP_URL_ROWS.map((row) => (
            <li
              key={row.path}
              className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="shrink-0 font-mono text-[12px] text-prel-tertiary-label">
                {row.constant}
              </span>
              <Link
                href={row.path}
                className="font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
              >
                {row.path}
              </Link>
            </li>
          ))}
        </ul>
        <div className="space-y-2 text-[15px] leading-relaxed text-prel-secondary-label">
          {IN_APP_HELP_LEGAL_NOTE.map((p, i) => (
            <p key={i}>
              <InventoryRichText text={p} />
            </p>
          ))}
        </div>
      </section>

      <section id="persona-qa" className="scroll-mt-28 space-y-4">
        <h2 className="text-[20px] font-bold text-prel-label">
          Section 6 — Persona QA matrix
        </h2>
        <p className="text-[15px] leading-relaxed text-prel-secondary-label">
          <InventoryRichText text={PERSONA_QA_INTRO} />
        </p>
        <div className="space-y-3">
          {PERSONA_QA_GROUPS.map((g) => (
            <MarketingDetails key={g.title} title={g.title}>
              <ul className="list-disc space-y-2 pl-5 text-[14px] leading-relaxed">
                {g.items.map((item) => (
                  <li key={item}>
                    <InventoryRichText text={item} />
                  </li>
                ))}
              </ul>
            </MarketingDetails>
          ))}
        </div>
      </section>

      <section
        id="technical-manifest"
        className="scroll-mt-28 space-y-4 rounded-2xl bg-prel-bg-grouped/40 px-4 py-5 md:px-6"
      >
        <h2 className="text-[20px] font-bold text-prel-label">
          Sections 1–5, 8, and 9 — Technical inventory &amp; authoring
        </h2>
        <p className="text-[15px] leading-relaxed text-prel-secondary-label">
          DNS, app shell, Swift view manifest (including the full file list), modal map,
          service layer, the help-article template, and the revision log — exactly as in
          the markdown, with tables and lists you can search in-page (and in site
          search). Open a section to read it; long tables scroll inside the panel.
        </p>
        <div className="space-y-1">
          {INVENTORY_MANIFEST_SECTIONS.map((s) => (
            <div key={s.id} id={s.id} className="scroll-mt-28">
              <HelpInventoryManifestSection section={s} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
