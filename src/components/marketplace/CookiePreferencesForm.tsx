"use client";

import { useEffect, useState } from "react";
import { useCookieConsent } from "@/contexts/CookieConsentContext";
import type { CookieConsentPrefs } from "@/lib/cookie-consent-storage";

function ToggleRow({
  id,
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-3 sm:p-4">
      <div className="min-w-0 flex-1">
        <label htmlFor={id} className="text-[14px] font-semibold text-neutral-900">
          {label}
        </label>
        <p className="mt-1 text-[13px] leading-snug text-neutral-600">
          {description}
        </p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors ${
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
        } ${checked ? "bg-[var(--prel-primary)]" : "bg-neutral-200"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

type Props = {
  /** Called after save (e.g. collapse banner customise). */
  onSaved?: () => void;
  className?: string;
};

export function CookiePreferencesForm({ onSaved, className = "" }: Props) {
  const { prefs, savePrefs, ready } = useCookieConsent();
  const [draft, setDraft] = useState<CookieConsentPrefs>(prefs);

  useEffect(() => {
    if (ready) setDraft(prefs);
  }, [ready, prefs]);

  const setField = (key: keyof CookieConsentPrefs, v: boolean) => {
    setDraft((d) => ({ ...d, [key]: v }));
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <ToggleRow
        id="cookie-essential"
        label="Strictly necessary"
        description="Required for sign-in, security, and core marketplace features. Always on."
        checked
        disabled
        onChange={() => {}}
      />
      <ToggleRow
        id="cookie-functional"
        label="Functional"
        description="Remember choices such as language or UI preferences."
        checked={draft.functional}
        onChange={(v) => setField("functional", v)}
      />
      <ToggleRow
        id="cookie-analytics"
        label="Analytics"
        description="Help us understand how the site is used so we can improve it."
        checked={draft.analytics}
        onChange={(v) => setField("analytics", v)}
      />
      <ToggleRow
        id="cookie-marketing"
        label="Marketing"
        description="Measure campaigns and personalise offers where permitted."
        checked={draft.marketing}
        onChange={(v) => setField("marketing", v)}
      />
      <button
        type="button"
        disabled={!ready}
        onClick={() => {
          savePrefs(draft);
          onSaved?.();
        }}
        className="mt-2 w-full rounded-full bg-[var(--prel-primary)] py-3 text-[14px] font-bold text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
      >
        Save preferences
      </button>
    </div>
  );
}
