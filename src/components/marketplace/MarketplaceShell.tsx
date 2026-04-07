"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { MarketplaceHomeDepopHeader } from "@/components/marketplace/MarketplaceHomeDepopHeader";
import { MarketplaceSiteFooter } from "@/components/marketplace/MarketplaceSiteFooter";
import { useAuth } from "@/contexts/AuthContext";

type TabDef = { href: string; label: string };

const TAB_HOME: TabDef = { href: "/", label: "Home" };
const TAB_DISCOVER: TabDef = { href: "/search", label: "Discover" };
const TAB_SELL: TabDef = { href: "/sell", label: "Sell" };
const TAB_INBOX: TabDef = { href: "/messages", label: "Inbox" };
const TAB_YOU: TabDef = { href: "/profile", label: "You" };

function tabActive(pathname: string, href: string) {
  if (href === "/")
    return pathname === "/" || pathname === "";
  if (href === "/sell")
    return pathname === "/sell" || pathname.startsWith("/sell/");
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
      pathname.startsWith("/account/") ||
      pathname === "/saved" ||
      pathname.startsWith("/saved/")
    );
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavTab({
  tab,
  pathname,
  compact,
}: {
  tab: TabDef;
  pathname: string;
  compact?: boolean;
}) {
  const on = tabActive(pathname, tab.href);
  const inactive = "text-neutral-500";
  const active = "text-[var(--prel-primary)]";
  return (
    <Link
      href={tab.href}
      className={`flex items-center justify-center rounded-lg transition-colors hover:bg-neutral-50 ${
        compact ? "min-w-0 flex-1 py-2.5" : "px-3 py-2"
      }`}
    >
      <span
        className={`truncate text-center font-medium ${
          compact ? "text-[11px] leading-tight" : "text-[14px]"
        } ${on ? active : inactive}`}
      >
        {tab.label}
      </span>
    </Link>
  );
}

function MarketplaceDesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden items-center justify-center gap-0.5 md:flex"
      aria-label="Main"
    >
      <NavTab tab={TAB_HOME} pathname={pathname} />
      <NavTab tab={TAB_DISCOVER} pathname={pathname} />
      <NavTab tab={TAB_SELL} pathname={pathname} />
      <NavTab tab={TAB_INBOX} pathname={pathname} />
      <NavTab tab={TAB_YOU} pathname={pathname} />
    </nav>
  );
}

function MarketplaceDesktopNavFallback() {
  return (
    <div className="hidden h-10 w-[min(520px,50vw)] animate-pulse rounded-full bg-neutral-100 md:block" />
  );
}

function MarketplaceBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)] lg:hidden"
      aria-label="Primary"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-stretch px-0.5 py-1">
        <NavTab tab={TAB_HOME} pathname={pathname} compact />
        <NavTab tab={TAB_DISCOVER} pathname={pathname} compact />
        <NavTab tab={TAB_SELL} pathname={pathname} compact />
        <NavTab tab={TAB_INBOX} pathname={pathname} compact />
        <NavTab tab={TAB_YOU} pathname={pathname} compact />
      </div>
    </nav>
  );
}

function MarketplaceHeaderAuth() {
  const { userToken, ready, logoutUser } = useAuth();
  const router = useRouter();

  if (!ready) {
    return (
      <div className="flex items-center gap-2" aria-hidden>
        <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-100" />
        <div className="h-8 w-16 animate-pulse rounded-full bg-neutral-100" />
      </div>
    );
  }

  if (userToken) {
    return (
      <button
        type="button"
        onClick={() => {
          logoutUser();
          router.replace("/");
        }}
        className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-50 sm:px-4 sm:text-[14px]"
      >
        Log out
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link
        href="/login"
        className="rounded-lg px-3 py-2 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-4 sm:text-[14px]"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-lg border border-[var(--prel-primary)] px-3 py-2 text-[13px] font-medium text-[var(--prel-primary)] transition hover:bg-[var(--prel-primary)]/5 sm:px-4 sm:text-[14px]"
      >
        Sign up
      </Link>
    </div>
  );
}

function MarketplaceBottomNavFallback() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[56px] border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Primary"
    />
  );
}

function HeaderSearchLink() {
  const pathname = usePathname();
  const on =
    pathname.startsWith("/search") || pathname.startsWith("/product/");
  return (
    <Link
      href="/search"
      className={`shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors hover:bg-neutral-50 sm:px-4 sm:text-[14px] ${
        on ? "text-[var(--prel-primary)]" : "text-neutral-600"
      }`}
    >
      Search
    </Link>
  );
}

function DefaultMarketplaceHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white pt-[env(safe-area-inset-top)] shadow-sm md:pt-0">
      <div className="mx-auto flex min-h-[52px] max-w-7xl items-center gap-2 px-3 sm:gap-3 sm:px-4 md:h-14 md:gap-4 md:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-[var(--prel-primary)] leading-none tracking-tight"
        >
          <BrandWordmark className="text-[18px] md:text-[20px]" />
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <Suspense fallback={<MarketplaceDesktopNavFallback />}>
            <MarketplaceDesktopNav />
          </Suspense>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
          <MarketplaceHeaderAuth />
          <HeaderSearchLink />
        </div>
      </div>
    </header>
  );
}

export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMarketplaceHome = pathname === "/" || pathname === "";

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-[#fafafa] text-neutral-900">
      {isMarketplaceHome ? (
        <div className="sticky top-0 z-[100]">
          <MarketplaceHomeDepopHeader />
        </div>
      ) : (
        <DefaultMarketplaceHeader />
      )}

      <main
        className={`mx-auto w-full flex-1 pb-24 lg:pb-8 ${
          isMarketplaceHome
            ? "relative z-0 max-w-none px-0 pt-0"
            : "max-w-lg px-3 pt-4 sm:max-w-2xl sm:px-5 sm:pt-5 md:max-w-7xl md:px-6 md:pt-6 lg:px-8"
        }`}
      >
        {children}
      </main>

      <MarketplaceSiteFooter />

      <Suspense fallback={<MarketplaceBottomNavFallback />}>
        <MarketplaceBottomNav />
      </Suspense>
    </div>
  );
}
