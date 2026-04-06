"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BRAND_NAME } from "@/lib/branding";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketplaceAccountPage() {
  const router = useRouter();
  const { userToken, ready, logoutUser } = useAuth();
  const signedIn = ready && !!userToken;

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-[22px] font-bold text-prel-label">Account</h1>
        {!ready ? (
          <p className="text-[15px] text-prel-secondary-label">Loading…</p>
        ) : signedIn ? (
          <>
            <p className="text-[15px] leading-relaxed text-prel-secondary-label">
              You&apos;re signed in. Orders, messages, and full account tools
              are also in the {BRAND_NAME} app.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/profile"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-prel-separator bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios"
              >
                My profile
              </Link>
              <Link
                href="/messages"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
              >
                Messages
              </Link>
              <Link
                href="/sell"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-prel-separator bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios"
              >
                Sell
              </Link>
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  router.replace("/account");
                }}
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-prel-separator bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios"
              >
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[15px] leading-relaxed text-prel-secondary-label">
              Sign in with your {BRAND_NAME} username and password to use web
              features tied to your account.
            </p>
            <Link
              href="/login"
              className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
