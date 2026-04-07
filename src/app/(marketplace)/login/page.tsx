"use client";

import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LOGIN } from "@/graphql/mutations/auth";
import { useAuth } from "@/contexts/AuthContext";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";
import { safeReturnPath } from "@/lib/safe-return-path";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const nextSafe = safeReturnPath(nextRaw);
  const afterLogin = nextSafe ?? "/profile";
  const signupHref = nextSafe
    ? `/signup?next=${encodeURIComponent(nextSafe)}`
    : "/signup";

  const { userToken, ready, setUserToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loginMutation, { loading }] = useMutation(LOGIN);

  useEffect(() => {
    if (ready && userToken) router.replace(afterLogin);
  }, [ready, userToken, router, afterLogin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const u = username.trim();
    if (!u) {
      setErr("Enter your username.");
      return;
    }
    try {
      const { data, errors } = await loginMutation({
        variables: { username: u, password },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      const t = data?.login?.token as string | undefined;
      if (t) {
        setUserToken(t);
        router.replace(afterLogin);
        return;
      }
      setErr("Sign in failed. Check your username and password.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-center text-[22px] text-prel-label">
          <BrandWordmark className="text-[22px] text-prel-label" />
        </h1>
        <p className="text-center text-[15px] text-prel-secondary-label">
          Sign in to your {BRAND_NAME} account
        </p>
        {err && (
          <p className="rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
            {err}
          </p>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Username
            </label>
            <input
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Password
            </label>
            <input
              type="password"
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="text-center text-[14px] text-prel-secondary-label">
          New to {BRAND_NAME}?{" "}
          <Link href={signupHref} className="font-semibold text-[var(--prel-primary)]">
            Sign up
          </Link>
        </p>
        <p className="text-center text-[14px] text-prel-secondary-label">
          <Link href="/" className="font-semibold text-[var(--prel-primary)]">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="mx-auto max-w-md pb-10 pt-4 text-center text-[14px] text-prel-secondary-label md:pb-12">
      Loading…
    </div>
  );
}

export default function MarketplaceLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
