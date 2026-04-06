import type { ReactNode } from "react";
import { HelpNavLink } from "./HelpNavLink";

const HELP_LINKS = [
  { href: "/help", label: "Help Centre" },
  { href: "/help/selling", label: "Selling" },
  { href: "/help/buying", label: "Buying" },
  { href: "/safety", label: "Trust and safety" },
] as const;

export default function HelpLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-24 md:flex-row md:items-start md:gap-12 lg:gap-16">
      <aside className="shrink-0 md:w-52 lg:w-56">
        <nav
          className="sticky top-[5.5rem] rounded-2xl border border-prel-separator bg-white p-3 shadow-ios md:top-28"
          aria-label="Help topics"
        >
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-prel-secondary-label">
            Topics
          </p>
          <ul className="space-y-0.5">
            {HELP_LINKS.map(({ href, label }) => (
              <li key={href}>
                <HelpNavLink href={href} label={label} />
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
