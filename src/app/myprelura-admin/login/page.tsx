"use client";

import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ADMIN_LOGIN } from "@/graphql/mutations/auth";
import { useAuth } from "@/contexts/AuthContext";
import { IOSCard } from "@/components/ui/IOSCard";
import { IOSButton } from "@/components/ui/IOSButton";
import { BRAND_WORDMARK } from "@/lib/branding";
import { staffPath } from "@/lib/staff-nav";

export default function StaffLoginPage() {
  const router = useRouter();
  const { staffToken, ready, setStaffToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [adminLogin, { loading }] = useMutation(ADMIN_LOGIN);

  useEffect(() => {
    if (ready && staffToken) router.replace(staffPath("/dashboard"));
  }, [ready, staffToken, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const u = username.trim();
    try {
      const { data, errors } = await adminLogin({
        variables: { username: u, password },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      const payload = data?.adminLogin;
      if (payload?.success && payload?.token) {
        setStaffToken(payload.token);
        router.replace(staffPath("/dashboard"));
        return;
      }
      setErr(
        payload?.message?.trim() ||
          "Staff sign-in failed. Check username and password."
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign in failed.");
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-prel-grouped p-4">
      <IOSCard className="w-full max-w-[400px] p-6">
        <h2 className="mb-1 text-center text-xl font-semibold text-prel-label">
          {BRAND_WORDMARK}
        </h2>
        <p className="mb-6 text-center text-[15px] text-prel-secondary-label">
          Staff sign in
        </p>
        {err && (
          <p className="mb-4 rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
            {err}
          </p>
        )}
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Username
            </label>
            <input
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-prel-primary/35"
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
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-grouped px-3 py-3 text-[17px] text-prel-label outline-none focus:ring-2 focus:ring-prel-primary/35"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <IOSButton type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </IOSButton>
        </form>
      </IOSCard>
    </div>
  );
}
