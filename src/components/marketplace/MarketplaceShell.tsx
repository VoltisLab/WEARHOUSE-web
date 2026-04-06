"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Home, MessageCircle, Search, Tag, User } from "lucide-react";
import { BRAND_WORDMARK } from "@/lib/branding";
import { MarketplaceSiteFooter } from "@/components/marketplace/MarketplaceSiteFooter";
import { useAuth } from "@/contexts/AuthContext";

const tabs: {
  href: string;
  label: string;
  icon: typeof Home;
}[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Discover", icon: Search },
  { href: "/sell", label: "Sell", icon: Tag },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/profile", label: "Profile", icon: User },
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
  if (href === "/profile")
    return (
      pathname === "/profile" ||
      pathname.startsWith("/profile/") ||
      pathname === "/account" ||
      pathname.startsWith("/account/")
    );
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

/** Top-right auth actions — links to live `/login` and `/signup` (GraphQL). */
function MarketplaceHeaderAuth() {
  const { userToken, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden>
        <div className="h-9 w-[4.25rem] animate-pulse rounded-full bg-prel-glass" />
        <div className="h-9 w-[4.5rem] animate-pulse rounded-full bg-prel-glass" />
      </div>
    );
  }

  if (userToken) {
    return (
      <Link
        href="/profile"
        className="shrink-0 rounded-full border border-prel-separator bg-white px-3 py-2 text-[13px] font-semibold text-prel-label shadow-ios transition-colors hover:border-[var(--prel-primary)]/35 sm:px-4 sm:text-[14px]"
      >
        Profile
      </Link>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        className="rounded-full px-3 py-2 text-[13px] font-semibold text-prel-label transition-colors hover:bg-prel-glass sm:px-4 sm:text-[14px]"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-[var(--prel-primary)] px-3 py-2 text-[13px] font-semibold text-white shadow-ios transition-opacity hover:opacity-95 sm:px-4 sm:text-[14px]"
      >
        Sign up
      </Link>
    </div>
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
  return (
    <div className="flex min-h-dvh flex-col bg-prel-bg-grouped text-prel-label">
      <header className="sticky top-0 z-40 border-b border-prel-separator bg-prel-nav/95 pt-[env(safe-area-inset-top)] backdrop-blur-md md:pt-0">
        <div className="mx-auto flex min-h-[52px] max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:h-[4.25rem] md:gap-6 md:px-8 lg:px-10">
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

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0 md:gap-3">
            <MarketplaceHeaderAuth />
            <Link
              href="/search"
              className="rounded-full bg-[var(--prel-primary)]/12 px-3 py-2 text-[13px] font-semibold text-[var(--prel-primary)] transition-colors hover:bg-[var(--prel-primary)]/18 sm:px-4 sm:text-[14px] md:px-5 md:py-2.5"
            >
              Search
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-3 pt-4 sm:max-w-2xl sm:px-5 sm:pt-5 md:max-w-7xl md:px-8 md:pt-8 lg:px-10">
        {children}
      </main>

      <MarketplaceSiteFooter />

      <Suspense fallback={<MarketplaceBottomNavFallback />}>
        <MarketplaceBottomNav />
      </Suspense>
    </div>
  );
}
