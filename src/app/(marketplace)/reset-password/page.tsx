"use client";

import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PASSWORD_RESET_COMPLETE } from "@/graphql/mutations/auth";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";
import { useAuth } from "@/contexts/AuthContext";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserToken } = useAuth();
  const [email, setEmail] = useState(searchParams.get("email")?.trim() ?? "");
  const [code, setCode] = useState(searchParams.get("code")?.trim() ?? "");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [passwordReset, { loading }] = useMutation(PASSWORD_RESET_COMPLETE);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!email.trim() || !code.trim()) {
      setErr("Email and code from your email are required.");
      return;
    }
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (password !== password2) {
      setErr("Passwords do not match.");
      return;
    }
    try {
      const { data, errors } = await passwordReset({
        variables: {
          email: email.trim(),
          code: code.trim(),
          password,
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      const token = data?.passwordReset?.token as string | undefined;
      if (token) {
        setUserToken(token);
        router.replace("/profile");
        return;
      }
      setErr(data?.passwordReset?.message?.trim() || "Could not reset password.");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Reset failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-center text-[22px] text-prel-label">
          <BrandWordmark className="text-[22px] text-prel-label" />
        </h1>
        <p className="text-center text-[15px] text-prel-secondary-label">
          Choose a new password for {BRAND_NAME}
        </p>
        {err ? (
          <p className="rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">{err}</p>
        ) : null}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Reset code
            </label>
            <input
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="one-time-code"
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              New password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Confirm password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Update password"}
          </button>
        </form>
        <p className="text-center text-[14px] text-prel-secondary-label">
          <Link href="/login" className="font-semibold text-[var(--prel-primary)]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Fallback() {
  return (
    <div className="mx-auto max-w-md pb-10 pt-4 text-center text-[14px] text-prel-secondary-label md:pb-12">
      Loading…
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
