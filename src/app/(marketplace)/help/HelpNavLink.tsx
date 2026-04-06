"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function HelpNavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active =
    href === "/help"
      ? pathname === "/help"
      : pathname === href || pathname.startsWith(`${href}/`);

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
