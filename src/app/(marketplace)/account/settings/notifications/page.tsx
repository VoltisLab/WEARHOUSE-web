"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UPDATE_NOTIFICATION_PREFERENCE } from "@/graphql/mutations/account";
import { NOTIFICATION_PREFERENCE } from "@/graphql/queries/notifications";
import { useAuth } from "@/contexts/AuthContext";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, refetch, loading: qLoad } = useQuery(NOTIFICATION_PREFERENCE, {
    skip: !ready || !userToken,
  });
  const [mutate, { loading: mLoad }] = useMutation(UPDATE_NOTIFICATION_PREFERENCE);
  const [quiet, setQuiet] = useState(false);
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/settings/notifications");
  }, [ready, userToken, router]);

  useEffect(() => {
    const p = data?.notificationPreference;
    if (!p) return;
    const q = !p.isPushNotification && !p.isEmailNotification;
    setQuiet(q);
    setPush(!!p.isPushNotification);
    setEmail(!!p.isEmailNotification);
  }, [data?.notificationPreference]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const { errors } = await mutate({
        variables: {
          isSilentModeOn: quiet,
          isPushNotification: quiet ? false : push,
          isEmailNotification: quiet ? false : email,
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setMsg(errors.map((er) => er.message).join(" · "));
        return;
      }
      await refetch();
      setMsg("Saved.");
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Save failed.");
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
        <h1 className="text-[24px] font-bold text-prel-label">Notifications</h1>
        <p className="mt-2 text-[14px] text-prel-secondary-label">
          Quiet mode turns off both push and email. Otherwise you can mix push and email.
        </p>
      </div>
      {msg ? (
        <p className="rounded-xl bg-prel-bg-grouped px-4 py-3 text-[14px] text-prel-label">{msg}</p>
      ) : null}
      {qLoad ? <p className="text-[14px] text-prel-secondary-label">Loading…</p> : null}
      <form
        onSubmit={onSave}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border"
      >
        <ToggleRow label="Quiet mode (all off)" checked={quiet} onChange={setQuiet} />
        <ToggleRow
          label="Push notifications"
          checked={push}
          onChange={setPush}
          disabled={quiet}
        />
        <ToggleRow
          label="Email notifications"
          checked={email}
          onChange={setEmail}
          disabled={quiet}
        />
        <button
          type="submit"
          disabled={mLoad}
          className="min-h-[48px] w-full rounded-full bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios disabled:opacity-50"
        >
          {mLoad ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 opacity-100">
      <span className={`text-[16px] font-medium ${disabled ? "text-prel-tertiary-label" : "text-prel-label"}`}>
        {label}
      </span>
      <input
        type="checkbox"
        className="h-5 w-5 accent-[var(--prel-primary)]"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
