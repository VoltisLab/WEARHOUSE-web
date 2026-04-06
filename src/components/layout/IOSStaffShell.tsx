"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  AlertTriangle,
  Flag,
  Menu,
  LogOut,
  Package,
  Users,
  LineChart,
  Terminal,
  ImageIcon,
  Settings,
  Wrench,
  MapIcon,
  Store,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_WORDMARK } from "@/lib/branding";
import {
  LIVE_OPS,
  MOBILE_TABS,
  ROADMAP_OPS,
  STAFF_BASE,
  staffPath,
  titleForPath,
  TOOLS_OPS,
} from "@/lib/staff-nav";

const LIVE_ICONS = [
  LayoutDashboard,
  MessageCircle,
  Package,
  ShoppingBag,
  AlertTriangle,
  Flag,
  Users,
] as const;

const mobileIcon: Record<string, typeof LayoutDashboard> = {
  [staffPath("/dashboard")]: LayoutDashboard,
  [staffPath("/chat")]: MessageCircle,
  [staffPath("/orders")]: ShoppingBag,
  [staffPath("/issues")]: AlertTriangle,
  [staffPath("/more")]: Menu,
};

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
}: {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-ios-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
        active
          ? "bg-prel-primary/15 text-prel-primary"
          : "text-prel-label hover:bg-prel-glass"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0 opacity-85" strokeWidth={1.75} />
      {label}
    </Link>
  );
}

function IOSStaffShellReady({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutStaff } = useAuth();
  const title = titleForPath(pathname);

  function onLogout() {
    logoutStaff();
    router.replace(staffPath("/login"));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-prel-grouped font-ios md:flex-row md:pb-0">
      <aside className="hidden w-[280px] shrink-0 border-r border-prel-separator bg-prel-nav/95 backdrop-blur-md md:flex md:flex-col md:pt-12">
        <div className="px-4 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-prel-secondary-label">
            {BRAND_WORDMARK}
          </p>
          <p className="text-lg font-bold text-prel-label">Staff admin</p>
        </div>

        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 pb-4">
          <div>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-prel-tertiary-label">
              Live operations
            </p>
            <div className="flex flex-col gap-0.5">
              {LIVE_OPS.map((item, i) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  pathname={pathname}
                  icon={LIVE_ICONS[i] ?? LayoutDashboard}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-prel-tertiary-label">
              Tools
            </p>
            <div className="flex flex-col gap-0.5">
              {TOOLS_OPS.map(({ href, label }) => (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  pathname={pathname}
                  icon={
                    href.includes("analytics")
                      ? LineChart
                      : href.includes("console")
                        ? Terminal
                        : ImageIcon
                  }
                />
              ))}
              <NavLink
                href={staffPath("/tools")}
                label="All tools"
                pathname={pathname}
                icon={Wrench}
              />
            </div>
          </div>

          <div>
            <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-prel-tertiary-label">
              Roadmap
            </p>
            <div className="flex flex-col gap-0.5">
              {ROADMAP_OPS.map(({ href, label }) => (
                <NavLink
                  key={href}
                  href={href}
                  label={label}
                  pathname={pathname}
                  icon={MapIcon}
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="mt-auto space-y-1 border-t border-prel-separator p-2">
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-ios-lg px-3 py-2.5 text-[15px] font-medium text-prel-label ring-1 ring-transparent transition-colors hover:bg-prel-primary/10 hover:ring-prel-primary/20"
          >
            <Store className="h-5 w-5 shrink-0 text-prel-primary" strokeWidth={1.75} />
            Return to marketplace
          </Link>
          <NavLink
            href={staffPath("/settings")}
            label="Settings"
            pathname={pathname}
            icon={Settings}
          />
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-ios-lg px-3 py-2.5 text-left text-[15px] font-medium text-prel-error hover:bg-prel-glass"
          >
            <LogOut className="h-5 w-5" strokeWidth={1.75} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-prel-separator bg-prel-card/90 px-4 py-3 backdrop-blur-md md:px-8 md:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <h1 className="min-w-0 text-[28px] font-bold leading-8 tracking-tight text-prel-label md:text-[34px]">
              {title}
            </h1>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-prel-separator bg-prel-glass px-3 py-2 text-[13px] font-semibold text-prel-label transition-colors hover:border-[var(--prel-primary)]/35 hover:bg-prel-primary/10 md:px-4 md:text-[14px]"
              >
                <Store className="h-4 w-4 text-prel-primary" strokeWidth={2} />
                Return to marketplace
              </Link>
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-full bg-prel-error/15 px-3 py-2 text-[13px] font-semibold text-prel-error transition-colors hover:bg-prel-error/22 md:px-4 md:text-[14px]"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-3 pb-24 pt-4 sm:px-5 md:px-8 md:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-prel-separator bg-prel-card/95 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-lg md:hidden">
        {MOBILE_TABS.map(({ href, label }) => {
          const moreActive =
            pathname === staffPath("/more") ||
            pathname.startsWith(`${STAFF_BASE}/settings`) ||
            pathname.startsWith(`${STAFF_BASE}/tools`) ||
            pathname.startsWith(`${STAFF_BASE}/products`) ||
            pathname.startsWith(`${STAFF_BASE}/users`) ||
            pathname.startsWith(`${STAFF_BASE}/analytics`) ||
            pathname.startsWith(`${STAFF_BASE}/console`) ||
            pathname.startsWith(`${STAFF_BASE}/banners`) ||
            pathname.startsWith(`${STAFF_BASE}/roadmap`);
          const active =
            href === staffPath("/more")
              ? moreActive
              : pathname === href || pathname.startsWith(href + "/");
          const Icon = mobileIcon[href] ?? Menu;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${
                active ? "text-prel-primary" : "text-prel-secondary-label"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={active ? 2.25 : 1.5} />
              <span className="max-w-[64px] truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function IOSStaffShellFallback({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-prel-grouped font-ios md:flex-row md:pb-0">
      <aside className="hidden w-[280px] shrink-0 animate-pulse border-r border-prel-separator bg-prel-nav/95 md:flex md:flex-col md:pt-12" />

      <div className="flex min-h-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-prel-separator bg-prel-card/90 px-4 py-3 backdrop-blur-md md:px-8 md:py-4">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-prel-glass md:h-9 md:w-48" />
        </header>

        <main className="flex-1 overflow-auto px-3 pb-24 pt-4 sm:px-5 md:px-8 md:pb-8">
          {children}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-20 flex h-[52px] border-t border-prel-separator bg-prel-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden" />
    </div>
  );
}

export function IOSStaffShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<IOSStaffShellFallback>{children}</IOSStaffShellFallback>}>
      <IOSStaffShellReady>{children}</IOSStaffShellReady>
    </Suspense>
  );
}
