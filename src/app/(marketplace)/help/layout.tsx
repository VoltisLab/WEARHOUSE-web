import type { ReactNode } from "react";
import { HelpCentreSearch } from "@/components/help/HelpCentreSearch";
import { HELP_SIDEBAR_LINKS } from "@/lib/help-centre-nav";
import { HelpNavLink } from "./HelpNavLink";

export default function HelpLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 pb-24 md:flex-row md:items-start md:gap-12 lg:gap-16">
      <aside className="order-2 shrink-0 md:order-1 md:w-52 lg:w-56">
        <nav
          className="sticky top-[5.5rem] rounded-2xl bg-white p-3 md:top-28"
          aria-label="Help topics"
        >
          <HelpCentreSearch />
          <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-prel-secondary-label">
            Topics
          </p>
          <ul className="space-y-0.5">
            {HELP_SIDEBAR_LINKS.map(
              ({ href, label, matchExact, activePrefixes }) => (
                <li key={href}>
                  <HelpNavLink
                    href={href}
                    label={label}
                    matchExact={matchExact}
                    activePrefixes={activePrefixes}
                  />
                </li>
              ),
            )}
          </ul>
        </nav>
      </aside>
      <div className="order-1 min-w-0 flex-1 md:order-2">{children}</div>
    </div>
  );
}
