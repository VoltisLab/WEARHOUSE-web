import Link from "next/link";
import type { HelpHomeTopicLink } from "@/lib/help-centre-nav";

export function HelpHubLinkList({
  links,
  skipHref,
}: {
  links: HelpHomeTopicLink[];
  /** Omit the hub’s own link from the list (e.g. first “hub” row on the index). */
  skipHref?: string;
}) {
  const items = skipHref
    ? links.filter((l) => l.href !== skipHref)
    : links;

  return (
    <ul className="not-prose space-y-3">
      {items.map((l) => (
        <li key={l.href}>
          <Link
            href={l.href}
            className="block rounded-xl bg-prel-bg-grouped/80 p-4 transition hover:bg-prel-bg-grouped"
          >
            <span className="text-[16px] font-bold text-prel-label">{l.label}</span>
            <span className="mt-1 block text-[14px] leading-relaxed text-prel-secondary-label">
              {l.desc}
            </span>
            <span className="mt-2 inline-block text-[13px] font-semibold text-[var(--prel-primary)]">
              Open →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
