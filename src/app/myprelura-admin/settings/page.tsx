"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { GRAPHQL_URI, PUBLIC_WEB_BASE } from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";
import type { AppearanceMode } from "@/contexts/ThemeContext";

export default function SettingsPage() {
  const { mode, setMode, resolved } = useTheme();
  const { logoutStaff } = useAuth();
  const router = useRouter();

  const options: { id: AppearanceMode; title: string }[] = [
    { id: "system", title: "Use system" },
    { id: "light", title: "Light" },
    { id: "dark", title: "Dark" },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <GlassCard>
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          Theme
        </p>
        <p className="mb-3 text-[12px] text-prel-tertiary-label">
          Matches the consumer app appearance. Resolved:{" "}
          <span className="text-prel-primary">{resolved}</span>
        </p>
        <div className="flex flex-col gap-1">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setMode(o.id)}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-[15px] text-prel-label hover:bg-prel-glass"
            >
              {o.title}
              {mode === o.id && (
                <span className="text-prel-primary" aria-hidden>
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          Network
        </p>
        <div className="space-y-2 text-[14px]">
          <div>
            <p className="text-prel-secondary-label">GraphQL</p>
            <p className="break-all font-mono text-[12px] text-prel-label">
              {GRAPHQL_URI}
            </p>
          </div>
          <div>
            <p className="text-prel-secondary-label">Public web</p>
            <p className="break-all font-mono text-[12px] text-prel-label">
              {PUBLIC_WEB_BASE}
            </p>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-prel-tertiary-label">
          Endpoint changes require redeploy / env update — not edited from here.
        </p>
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-[13px] font-semibold text-prel-secondary-label">
          About
        </p>
        <p className="text-[14px] text-prel-label">WEARHOUSE Staff Admin (web)</p>
        <p className="text-[12px] text-prel-tertiary-label">
          Same GraphQL contract as the WEARHOUSE consumer apps.
        </p>
      </GlassCard>

      <GlassCard>
        <p className="mb-2 text-[13px] text-prel-secondary-label">
          Notifications, haptics, and privacy tooling mirror the iOS placeholders until
          staff-specific APIs exist.
        </p>
      </GlassCard>

      <button
        type="button"
        onClick={() => {
          logoutStaff();
          router.replace(staffPath("/login"));
        }}
        className="w-full rounded-[10px] bg-prel-error/15 py-3 text-[16px] font-semibold text-prel-error"
      >
        Logout
      </button>

      <Link
        href={staffPath("/dashboard")}
        className="block text-center text-prel-primary"
      >
        ← Home
      </Link>
    </div>
  );
}
