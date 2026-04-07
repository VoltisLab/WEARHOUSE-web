"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Home,
  LayoutGrid,
  MessageCircle,
  Plus,
  Search,
  User,
} from "lucide-react";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { MarketplaceSiteFooter } from "@/components/marketplace/MarketplaceSiteFooter";
import { useAuth } from "@/contexts/AuthContext";

type TabDef = { href: string; label: string; icon: typeof Home };

const TAB_HOME: TabDef = { href: "/", label: "Home", icon: Home };
const TAB_DISCOVER: TabDef = {
  href: "/search",
  label: "Discover",
  icon: LayoutGrid,
};
const TAB_INBOX: TabDef = {
  href: "/messages",
  label: "Inbox",
  icon: MessageCircle,
};
const TAB_YOU: TabDef = { href: "/profile", label: "You", icon: User };

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
  const Icon = tab.icon;
  const inactive = "text-neutral-500";
  const active = "text-[var(--prel-primary)]";
  return (
    <Link
      href={tab.href}
      className={`flex flex-col items-center justify-end gap-0.5 ${
        compact ? "min-w-0 flex-1 py-1" : "px-3 py-2"
      }`}
    >
      <Icon
        className={`${compact ? "h-6 w-6" : "h-5 w-5"} ${on ? active : inactive}`}
        strokeWidth={on ? 2.25 : 2}
      />
      <span
        className={`max-w-[4.5rem] truncate text-center ${
          compact ? "text-[10px] leading-tight" : "text-[13px]"
        } font-medium ${on ? active : inactive}`}
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
      className="hidden items-center justify-center gap-1 md:flex"
      aria-label="Main"
    >
      <NavTab tab={TAB_HOME} pathname={pathname} />
      <NavTab tab={TAB_DISCOVER} pathname={pathname} />
      <Link
        href="/sell"
        className="mx-2 flex h-11 min-w-[5.5rem] items-center justify-center gap-1.5 rounded-full bg-[var(--prel-primary)] px-5 text-[14px] font-bold text-white shadow-md transition hover:brightness-105"
      >
        <Plus className="h-5 w-5" strokeWidth={2.5} />
        Sell
      </Link>
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
      <div className="mx-auto grid max-w-lg grid-cols-5 items-end px-1 pt-1">
        <NavTab tab={TAB_HOME} pathname={pathname} compact />
        <NavTab tab={TAB_DISCOVER} pathname={pathname} compact />
        <div className="flex flex-col items-center justify-start pb-0.5">
          <Link
            href="/sell"
            className="flex h-14 w-14 -translate-y-3 items-center justify-center rounded-full bg-[var(--prel-primary)] text-white shadow-lg ring-4 ring-white transition hover:brightness-105"
            aria-label="Sell"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </Link>
          <span
            className="-mt-2 text-[10px] font-medium text-neutral-500"
            aria-hidden
          >
            Sell
          </span>
        </div>
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
        className="shrink-0 rounded-full border border-neutral-200 bg-white px-3 py-2 text-[13px] font-semibold text-neutral-700 transition hover:bg-neutral-50 sm:px-4 sm:text-[14px]"
      >
        Log out
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <Link
        href="/login"
        className="rounded-full px-3 py-2 text-[13px] font-semibold text-neutral-700 transition hover:bg-neutral-100 sm:px-4 sm:text-[14px]"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-[var(--prel-primary)] px-3 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105 sm:px-4 sm:text-[14px]"
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

export function MarketplaceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-[#fafafa] text-neutral-900">
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
            <Link
              href="/search"
              className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition hover:bg-neutral-100 md:h-11 md:w-11"
              aria-label="Search discover"
            >
              <Search className="h-5 w-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-3 pb-24 pt-4 sm:max-w-2xl sm:px-5 sm:pt-5 md:max-w-7xl md:px-6 md:pt-6 lg:px-8 lg:pb-8">
        {children}
      </main>

      <MarketplaceSiteFooter />

      <Suspense fallback={<MarketplaceBottomNavFallback />}>
        <MarketplaceBottomNav />
      </Suspense>
    </div>
  );
}
