"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ROWS: { href: string; label: string; desc: string }[] = [
  {
    href: "/account/settings/vacation",
    label: "Vacation mode",
    desc: "Hide your listings from buyers while you are away.",
  },
  {
    href: "/account/settings/multibuy",
    label: "Multi-buy discounts",
    desc: "Reward buyers who purchase several items from your shop.",
  },
  {
    href: "/account/settings/notifications",
    label: "Notifications",
    desc: "Email, push, and in-app preferences.",
  },
  {
    href: "/account/notifications",
    label: "Activity",
    desc: "Your in-app notification feed.",
  },
];

export default function AccountSettingsHubPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/settings");
  }, [ready, userToken, router]);

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/profile"
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← Profile
      </Link>
      <div>
        <h1 className="text-[24px] font-bold text-prel-label">Settings</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Selling and account preferences on the web.
        </p>
      </div>
      <ul className="divide-y divide-prel-separator overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border">
        {ROWS.map((r) => (
          <li key={r.href}>
            <Link
              href={r.href}
              className="flex items-center gap-3 px-4 py-4 transition hover:bg-prel-bg-grouped/80"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-semibold text-prel-label">{r.label}</p>
                <p className="text-[13px] text-prel-secondary-label">{r.desc}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-prel-tertiary-label" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
