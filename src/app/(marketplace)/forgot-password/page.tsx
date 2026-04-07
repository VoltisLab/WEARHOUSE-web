"use client";

import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { RESET_PASSWORD_REQUEST } from "@/graphql/mutations/auth";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD_REQUEST);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    const em = email.trim();
    if (!em) {
      setErr("Enter the email address on your account.");
      return;
    }
    try {
      const { data, errors } = await resetPassword({
        variables: { email: em },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      setMsg(
        data?.resetPassword?.message?.trim() ||
          "If an account exists for that email, we sent reset instructions.",
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Request failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-center text-[22px] text-prel-label">
          <BrandWordmark className="text-[22px] text-prel-label" />
        </h1>
        <p className="text-center text-[15px] text-prel-secondary-label">
          Reset your {BRAND_NAME} password
        </p>
        {err ? (
          <p className="rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">{err}</p>
        ) : null}
        {msg ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-[13px] text-emerald-800">{msg}</p>
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
          <button
            type="submit"
            disabled={loading}
            className="min-h-[48px] rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios transition-opacity hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="text-center text-[14px] text-prel-secondary-label">
          <Link href="/login" className="font-semibold text-[var(--prel-primary)]">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
