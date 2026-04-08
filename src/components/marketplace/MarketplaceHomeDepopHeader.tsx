"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { useAuth } from "@/contexts/AuthContext";
import { HOME_DEPOP_NAV_ITEMS } from "@/lib/home-depop-nav";

/** Matches Depop’s header search hint (quoted example query). */
const HOME_SEARCH_PLACEHOLDER = 'Search for "black dickies cargos"';

const primaryCtaClass =
  "rounded-full bg-[var(--prel-primary)] font-semibold text-white transition hover:brightness-110";

const APP_NAV_TABS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Discover" },
  { href: "/sell", label: "Sell" },
  { href: "/messages", label: "Inbox" },
  { href: "/profile", label: "You" },
];

function appTabActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/" || pathname === "";
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

function HomeHeaderAuth() {
  const { userToken, ready, logoutUser } = useAuth();
  const router = useRouter();

  if (!ready) {
    return (
      <div className="flex items-center gap-2" aria-hidden>
        <div className="h-8 w-14 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-8 w-14 animate-pulse rounded-md bg-neutral-100" />
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
        className="rounded-md px-2 py-1.5 text-[13px] font-medium text-neutral-700 transition hover:bg-neutral-100 sm:px-3 sm:text-[14px]"
      >
        Log out
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link
        href="/signup"
        className="whitespace-nowrap rounded-full border-2 border-[var(--prel-primary)] bg-transparent px-3 py-1.5 text-[13px] font-semibold text-[var(--prel-primary)] transition hover:bg-[var(--prel-primary)]/10 sm:py-2 sm:text-[14px]"
      >
        Sign up
      </Link>
      <Link
        href="/login"
        className="whitespace-nowrap text-[13px] font-medium text-black underline-offset-4 hover:underline sm:text-[14px]"
      >
        Log in
      </Link>
    </div>
  );
}

const MENU_CLOSE_MS = 200;

/**
 * Home header: logo, search, actions; category row opens one full mega-menu on hover (md+).
 */
export function MarketplaceHomeDepopHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { userToken, ready: authReady } = useAuth();
  const [q, setQ] = useState("");
  const [megaOpen, setMegaOpen] = useState(false);
  const closeMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCloseMenu = () => {
    if (closeMenuTimer.current != null) {
      clearTimeout(closeMenuTimer.current);
      closeMenuTimer.current = null;
    }
  };

  const scheduleCloseMenu = () => {
    cancelCloseMenu();
    closeMenuTimer.current = setTimeout(() => {
      setMegaOpen(false);
      closeMenuTimer.current = null;
    }, MENU_CLOSE_MS);
  };

  const openMegaMenu = () => {
    cancelCloseMenu();
    setMegaOpen(true);
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = q.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}&browse=1`);
    } else {
      router.push("/search");
    }
  };

  const itemsWithSub = HOME_DEPOP_NAV_ITEMS.filter((i) => i.submenu?.length);

  return (
    <header className="border-b border-neutral-200 bg-white pt-[env(safe-area-inset-top)] md:pt-0">
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex min-h-[52px] items-center gap-2 py-2 md:h-auto md:min-h-[56px] md:py-2.5">
          <Link
            href="/"
            className="shrink-0 text-[var(--prel-primary)] leading-none"
          >
            <BrandWordmark className="text-[17px] sm:text-[18px] md:text-[20px]" />
          </Link>

          <form
            onSubmit={onSearch}
            className="mx-2 hidden min-w-0 max-w-xl flex-1 md:mx-6 md:block lg:max-w-3xl"
          >
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-neutral-400"
                aria-hidden
              />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={HOME_SEARCH_PLACEHOLDER}
                className="h-11 w-full rounded-full border-0 bg-[#f0f1f3] pl-10 pr-4 text-[14px] text-neutral-900 shadow-inner outline-none ring-1 ring-black/[0.06] transition placeholder:text-neutral-500 focus:bg-white focus:ring-1 focus:ring-black/20"
                enterKeyHint="search"
                aria-label="Search"
              />
            </div>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1 md:gap-2">
            <Link
              href="/saved"
              className="rounded-full p-2 text-neutral-900 hover:bg-neutral-100"
              aria-label="Saved"
            >
              <Heart className="h-[1.15rem] w-[1.15rem]" strokeWidth={1.75} />
            </Link>
            <Link
              href="/search?browse=1"
              className="rounded-full p-2 text-neutral-900 hover:bg-neutral-100"
              aria-label="Browse"
            >
              <ShoppingBag
                className="h-[1.15rem] w-[1.15rem]"
                strokeWidth={1.75}
              />
            </Link>
            <Link
              href="/sell"
              className={`ml-0.5 px-2.5 py-1.5 text-[12px] sm:hidden ${primaryCtaClass}`}
            >
              Sell
            </Link>
            <Link
              href="/sell"
              className={`ml-0.5 hidden px-3.5 py-2 text-[13px] sm:inline-flex md:px-5 md:text-[14px] ${primaryCtaClass}`}
            >
              Sell now
            </Link>
            <HomeHeaderAuth />
          </div>
        </div>

        {authReady && userToken ? (
          <nav
            className="-mx-3 flex justify-center gap-7 overflow-x-auto border-b border-neutral-100 px-3 py-2.5 scrollbar-none sm:-mx-4 sm:gap-9 sm:px-4 md:mx-0 md:gap-10 md:px-0 md:py-3 lg:gap-12"
            aria-label="App"
          >
            {APP_NAV_TABS.map((tab) => {
              const on = appTabActive(pathname, tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`shrink-0 text-[14px] transition ${
                    on
                      ? "font-semibold text-[var(--prel-primary)]"
                      : "font-medium text-[#555555] hover:text-neutral-800"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        ) : null}

        <form onSubmit={onSearch} className="pb-3 md:hidden">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-[1.05rem] w-[1.05rem] -translate-y-1/2 text-neutral-400"
              aria-hidden
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={HOME_SEARCH_PLACEHOLDER}
              className="h-11 w-full rounded-full border-0 bg-[#f0f1f3] pl-9 pr-3 text-[14px] text-neutral-900 shadow-inner outline-none ring-1 ring-black/[0.06] placeholder:text-neutral-500 focus:bg-white focus:ring-1 focus:ring-black/20"
              enterKeyHint="search"
              aria-label="Search"
            />
          </div>
        </form>

        <div
          className="relative border-t border-neutral-200"
          onMouseEnter={openMegaMenu}
          onMouseLeave={scheduleCloseMenu}
        >
          <nav
            className="-mx-3 flex justify-start gap-5 overflow-x-auto px-3 py-3 scrollbar-none sm:-mx-4 sm:gap-6 sm:px-4 md:mx-0 md:px-0 md:py-2.5"
            aria-label="Browse categories"
          >
            {HOME_DEPOP_NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`shrink-0 text-[14px] font-semibold transition hover:opacity-80 ${
                  item.highlight
                    ? "text-[var(--prel-primary)]"
                    : "text-neutral-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {megaOpen ? (
            <div
              className="absolute inset-x-0 top-full z-[110] -mt-1 hidden pt-1 md:block"
              role="navigation"
              aria-label="Browse all categories"
              onMouseEnter={cancelCloseMenu}
              onMouseLeave={scheduleCloseMenu}
            >
              <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-2xl ring-1 ring-black/5 sm:p-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                  {itemsWithSub.map((item) => (
                    <div key={item.label} className="min-w-0">
                      <Link
                        href={item.href}
                        className={`text-[13px] font-medium uppercase tracking-wide sm:text-[12px] ${
                          item.highlight
                            ? "text-[var(--prel-primary)]"
                            : "text-neutral-900"
                        }`}
                        onClick={() => {
                          cancelCloseMenu();
                          setMegaOpen(false);
                        }}
                      >
                        {item.label}
                      </Link>
                      <ul className="mt-3 space-y-2">
                        {item.submenu!.map((sub) => (
                          <li key={sub.label}>
                            <Link
                              href={sub.href}
                              className="block text-[14px] font-medium text-neutral-600 transition hover:text-neutral-900"
                              onClick={() => {
                                cancelCloseMenu();
                                setMegaOpen(false);
                              }}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
