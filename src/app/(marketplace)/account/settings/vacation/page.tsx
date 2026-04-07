"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UPDATE_PROFILE } from "@/graphql/mutations/account";
import { VIEW_ME } from "@/graphql/queries/admin";
import { useAuth } from "@/contexts/AuthContext";

export default function VacationSettingsPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, refetch } = useQuery(VIEW_ME, { skip: !ready || !userToken });
  const [updateProfile, { loading }] = useMutation(UPDATE_PROFILE);
  const [on, setOn] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/settings/vacation");
  }, [ready, userToken, router]);

  useEffect(() => {
    setOn(!!data?.viewMe?.isVacationMode);
  }, [data?.viewMe?.isVacationMode]);

  async function save(next: boolean) {
    setMsg(null);
    try {
      const { errors } = await updateProfile({
        variables: { isVacationMode: next },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setMsg(errors.map((e) => e.message).join(" · "));
        return;
      }
      setOn(next);
      await refetch();
      setMsg(next ? "Vacation mode is on." : "Vacation mode is off.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Update failed.");
    }
  }

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/account/settings"
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← Settings
      </Link>
      <div>
        <h1 className="text-[24px] font-bold text-prel-label">Vacation mode</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-prel-secondary-label">
          When vacation mode is on, buyers typically will not see your active listings in browse
          and search (same behaviour as the mobile app).
        </p>
      </div>
      {msg ? (
        <p className="rounded-xl bg-prel-bg-grouped px-4 py-3 text-[14px] text-prel-label">{msg}</p>
      ) : null}
      <div className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
        <span className="text-[16px] font-semibold text-prel-label">Vacation mode</span>
        <button
          type="button"
          disabled={loading}
          onClick={() => save(!on)}
          className={`relative inline-flex h-9 w-[52px] shrink-0 rounded-full transition-colors ${
            on ? "bg-[var(--prel-primary)]" : "bg-prel-separator"
          } disabled:opacity-50`}
          aria-pressed={on}
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
              on ? "left-1 translate-x-5" : "left-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
