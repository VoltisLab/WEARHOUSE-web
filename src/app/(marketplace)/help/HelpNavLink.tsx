"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HelpNavLink({
  href,
  label,
  matchExact,
  activePrefixes,
}: {
  href: string;
  label: string;
  /** When true, only an exact `pathname === href` match is active. */
  matchExact?: boolean;
  /** Treat pathname as active if it equals or starts with any of these (e.g. article URLs under a hub). */
  activePrefixes?: string[];
}) {
  const pathname = usePathname();

  const prefixHit =
    activePrefixes?.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    ) ?? false;

  const active = matchExact
    ? pathname === href
    : prefixHit || pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-[14px] font-medium transition ${
        active
          ? "bg-[var(--prel-primary)]/12 text-[var(--prel-primary)]"
          : "text-prel-label hover:bg-prel-bg-grouped"
      }`}
    >
      {label}
    </Link>
  );
}
