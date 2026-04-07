import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";
import { SITE_FOOTER_COLUMNS } from "@/lib/site-footer-nav";
import { staffPath } from "@/lib/staff-nav";
import { VoltislabsCopyright } from "@/components/marketplace/VoltislabsCopyright";
import { AppStoreBadges } from "@/components/marketplace/AppStoreBadges";

const social = [
  { href: "https://www.instagram.com", label: "Instagram", Icon: Instagram },
  { href: "https://www.facebook.com", label: "Facebook", Icon: Facebook },
  { href: "https://twitter.com", label: "X (Twitter)", Icon: Twitter },
] as const;

export function MarketplaceSiteFooter() {
  const staffLoginHref = staffPath("/login");

  return (
    <footer className="mt-auto bg-zinc-900 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-12 pb-[calc(3rem+5.25rem+env(safe-area-inset-bottom))] md:px-8 md:pb-14 lg:px-10 lg:pb-12">
        <div className="mb-10 border-b border-zinc-700 pb-10">
          <BrandWordmark
            as="div"
            className="text-[22px] leading-tight tracking-tight text-white"
          />
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-zinc-400">
            Second-hand fashion marketplace — buy and sell with confidence on{" "}
            {BRAND_NAME}.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {SITE_FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-[14px] font-medium text-zinc-300 transition hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-zinc-700 pt-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
            Get the app
          </p>
          <div className="mt-4">
            <AppStoreBadges />
          </div>
          <Link
            href="/app"
            className="mt-3 inline-block text-[14px] font-semibold text-zinc-400 hover:text-white"
          >
            About our apps →
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 border-t border-zinc-700 pt-10">
          {social.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-600 text-zinc-400 transition hover:border-zinc-400 hover:text-white"
              aria-label={label}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
            <Link
              href={staffLoginHref}
              className="font-medium text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            >
              Staff sign in
            </Link>
            <Link
              href="/cookie-policy#preferences"
              className="font-medium text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
            >
              Cookie settings
            </Link>
          </div>
          <VoltislabsCopyright className="text-[12px] text-zinc-600" />
        </div>
      </div>
    </footer>
  );
}
