"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BRAND_NAME } from "@/lib/branding";
import { useAuth } from "@/contexts/AuthContext";
import { VIEW_ME } from "@/graphql/queries/admin";

/**
 * `/account` exists for legacy links. Signed-in users go straight to their
 * shop profile (photo, bio, listings). Guests see a short sign-in prompt.
 */
export default function AccountRedirectPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();

  const { data, loading, error } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
    fetchPolicy: "network-only",
  });

  const username = data?.viewMe?.username;

  useEffect(() => {
    if (!ready || !userToken || !username) return;
    router.replace(`/profile/${encodeURIComponent(username)}`);
  }, [ready, userToken, username, router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-md pb-10">
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border" />
      </div>
    );
  }

  if (!userToken) {
    return (
      <div className="mx-auto max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-[22px] font-bold text-prel-label">Account</h1>
        <p className="text-[15px] leading-relaxed text-prel-secondary-label">
          Sign in to see your profile, listings, orders, and messages on the
          web.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/login"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-prel-separator bg-white px-6 text-[15px] font-semibold text-prel-label shadow-ios"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <p className="rounded-xl bg-prel-error/10 p-4 text-[14px] text-prel-error">
        {error.message}
      </p>
    );
  }

  if (loading || !username) {
    return (
      <div className="mx-auto max-w-md space-y-4 pb-10">
        <p className="text-[14px] text-prel-secondary-label">
          Loading your profile…
        </p>
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border" />
      </div>
    );
  }

  return (
    <p className="text-[14px] text-prel-secondary-label">
      Opening your {BRAND_NAME} profile…
    </p>
  );
}
