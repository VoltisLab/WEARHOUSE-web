"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Home, MessageCircle, Search, Tag, User } from "lucide-react";
import { BRAND_NAME, BRAND_WORDMARK } from "@/lib/branding";
import { PUBLIC_WEB_BASE, publicWebHostname } from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";
import { VoltislabsCopyright } from "@/components/marketplace/VoltislabsCopyright";

const tabs: {
  href: string;
  label: string;
  icon: typeof Home;
}[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Discover", icon: Search },
  { href: "/sell", label: "Sell", icon: Tag },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/account", label: "Profile", icon: User },
];

function tabActive(pathname: string, href: string) {
  if (href === "/")
    return pathname === "/" || pathname === "";
  if (href === "/search")
    return (
      pathname.startsWith("/search") || pathname.startsWith("/product/")
    );
  if (href === "/messages")
    return pathname === "/messages" || pathname.startsWith("/messages/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MarketplaceDesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex flex-wrap items-center justify-center gap-1"
      aria-label="Main"
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const on = tabActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${
              on
                ? "bg-[var(--prel-primary)] text-white shadow-ios"
                : "text-prel-label hover:bg-prel-glass"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={on ? 2.25 : 2} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function MarketplaceDesktopNavFallback() {
  return (
    <div
      className="flex h-10 items-center justify-center gap-2"
      aria-hidden
    >
      {tabs.map(({ href }) => (
        <div
          key={href}
          className="h-9 w-20 animate-pulse rounded-full bg-prel-glass"
        />
      ))}
    </div>
  );
}

/** Mobile-only bottom tabs — `usePathname` isolated + Suspended. */
function MarketplaceBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-prel-separator bg-prel-nav/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg justify-around pt-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const on = tabActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[64px] flex-col items-center gap-0.5 py-2 text-[10px] font-semibold ${
                on
                  ? "text-[var(--prel-primary)]"
                  : "text-prel-secondary-label"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={on ? 2.25 : 2} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function MarketplaceBottomNavFallback() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-prel-separator bg-prel-nav/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-lg justify-around pt-1">
        {tabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex min-w-[64px] flex-col items-center gap-0.5 py-2 text-[10px] font-semibold text-prel-secondary-label"
          >
            <Icon className="h-6 w-6" strokeWidth={2} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const staffLoginHref = staffPath("/login");
  const webHost = publicWebHostname();

  return (
    <div className="flex min-h-dvh flex-col bg-prel-bg-grouped text-prel-label">
      <header className="sticky top-0 z-40 border-b border-prel-separator bg-prel-nav/95 pt-[env(safe-area-inset-top)] backdrop-blur-md md:pt-0">
        <div className="mx-auto flex h-[52px] max-w-7xl items-center gap-3 px-4 md:h-[4.25rem] md:gap-6 md:px-8 lg:px-10">
          <Link
            href="/"
            className="shrink-0 text-[20px] font-bold tracking-tight text-[var(--prel-primary)] md:text-[22px]"
          >
            {BRAND_WORDMARK}
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <Suspense fallback={<MarketplaceDesktopNavFallback />}>
              <MarketplaceDesktopNav />
            </Suspense>
          </div>

          <Link
            href="/search"
            className="ml-auto shrink-0 rounded-full bg-[var(--prel-primary)]/12 px-4 py-2 text-[14px] font-semibold text-[var(--prel-primary)] transition-colors hover:bg-[var(--prel-primary)]/18 md:ml-0 md:px-5 md:py-2.5"
          >
            Search
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-5 md:max-w-7xl md:px-8 md:pt-8 lg:px-10">
        {children}
      </main>

      <footer className="mt-auto border-t border-prel-separator bg-prel-card/90">
        <div className="mx-auto max-w-7xl px-4 py-8 pb-[calc(2rem+5.5rem+env(safe-area-inset-bottom))] md:px-8 md:py-10 md:pb-10 lg:px-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[15px] font-semibold text-prel-label">
                {BRAND_NAME} marketplace
              </p>
              <p className="mt-1 max-w-md text-[14px] leading-relaxed text-prel-secondary-label">
                Browse live listings as a guest. Sign in for account features;
                buy, sell, and manage your shop in the {BRAND_NAME} app.
              </p>
            </div>
            <a
              href={PUBLIC_WEB_BASE}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-prel-separator bg-white px-5 py-2.5 text-[14px] font-semibold text-prel-label shadow-ios transition-colors hover:border-[var(--prel-primary)]/35"
              target="_blank"
              rel="noreferrer"
            >
              Open {webHost}
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 border-t border-prel-separator pt-6 md:flex-row md:justify-between">
            <Link
              href={staffLoginHref}
              className="text-[13px] font-medium text-prel-secondary-label underline-offset-2 hover:text-prel-label hover:underline"
            >
              Staff sign in
            </Link>
            <VoltislabsCopyright className="text-[13px] text-prel-secondary-label" />
          </div>
        </div>
      </footer>

      <Suspense fallback={<MarketplaceBottomNavFallback />}>
        <MarketplaceBottomNav />
      </Suspense>
    </div>
  );
}
