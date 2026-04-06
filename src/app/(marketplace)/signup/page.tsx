"use client";

import { useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { REGISTER } from "@/graphql/mutations/auth";
import { useAuth } from "@/contexts/AuthContext";
import { BrandWordmark } from "@/components/branding/BrandWordmark";
import { BRAND_NAME } from "@/lib/branding";

function formatRegisterErrors(errors: unknown): string {
  if (!errors || typeof errors !== "object") return "";
  const parts: string[] = [];
  for (const val of Object.values(errors as Record<string, unknown>)) {
    if (!Array.isArray(val)) continue;
    for (const item of val) {
      if (item && typeof item === "object" && "message" in item) {
        parts.push(String((item as { message: string }).message));
      } else if (typeof item === "string") {
        parts.push(item);
      }
    }
  }
  return parts.join(" · ");
}

/** Default consumer type for web sign-up (matches `UserTypeChoices`). */
const DEFAULT_USER_TYPE = "EVERYDAY_USER";

export default function MarketplaceSignupPage() {
  const router = useRouter();
  const { userToken, ready, setUserToken } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [registerMutation, { loading }] = useMutation(REGISTER);

  useEffect(() => {
    if (ready && userToken) router.replace("/profile");
  }, [ready, userToken, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    const em = email.trim();
    const u = username.trim();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (!em) {
      setErr("Enter your email.");
      return;
    }
    if (!u) {
      setErr("Choose a username.");
      return;
    }
    if (!fn || !ln) {
      setErr("Enter your first and last name.");
      return;
    }
    if (password1.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    if (password1 !== password2) {
      setErr("Passwords do not match.");
      return;
    }
    try {
      const { data, errors } = await registerMutation({
        variables: {
          email: em,
          username: u,
          first_name: fn,
          last_name: ln,
          password1,
          password2,
          user_type: DEFAULT_USER_TYPE,
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      const reg = data?.register;
      if (!reg?.success) {
        const msg = formatRegisterErrors(reg?.errors);
        setErr(msg || "Could not create account. Try a different username or email.");
        return;
      }
      const t = reg.token as string | undefined;
      if (t) {
        setUserToken(t);
        router.replace("/profile");
        return;
      }
      setInfo(
        `Account created. If your server requires email verification, check your inbox for ${BRAND_NAME} before signing in.`
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign up failed.");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-center text-[22px] text-prel-label">
          <BrandWordmark className="text-[22px] text-prel-label" />
        </h1>
        <p className="text-center text-[15px] text-prel-secondary-label">
          Create your {BRAND_NAME} account
        </p>
        {err && (
          <p className="rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
            {err}
          </p>
        )}
        {info && (
          <p className="rounded-lg bg-[var(--prel-primary)]/10 px-3 py-2 text-[13px] text-prel-label">
            {info}{" "}
            <Link href="/login" className="font-semibold text-[var(--prel-primary)]">
              Sign in
            </Link>
          </p>
        )}
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
              Username
            </label>
            <input
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="username"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
                First name
              </label>
              <input
                className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
                Last name
              </label>
              <input
                className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/35"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
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
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="text-center text-[14px] text-prel-secondary-label">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--prel-primary)]">
            Log in
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
