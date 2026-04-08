"use client";

import { useLazyQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import { useState } from "react";
import { USER_ADMIN_STATS } from "@/graphql/queries/admin";
import { FLAG_USER } from "@/graphql/mutations/admin";
import { IOSCard } from "@/components/ui/IOSCard";
import { IOSButton } from "@/components/ui/IOSButton";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import { staffPath } from "@/lib/staff-nav";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [runSearch, { data, loading, error }] = useLazyQuery(USER_ADMIN_STATS);
  const [flagUser] = useMutation(FLAG_USER);

  const rows = data?.userAdminStats ?? [];

  async function searchUsers() {
    await runSearch({
      variables: {
        search: search.trim() || null,
        pageCount: 30,
        pageNumber: 1,
      },
    });
  }

  async function onFlag(u: { id: unknown; username?: string | null }) {
    const id = u.id == null ? "" : String(u.id);
    const name = u.username ?? "";
    const reason = window.prompt(
      `Flag user ${name}?\nEnter reason code (e.g. OTHER, SPAM_ACTIVITY):`,
      "OTHER"
    );
    if (!reason) return;
    const notes = window.prompt("Optional notes:", "") ?? "";
    const { data: d } = await flagUser({
      variables: { id, reason, notes: notes || null },
    });
    const ok = d?.flagUser?.success;
    alert(d?.flagUser?.message ?? (ok ? "OK" : "Failed"));
    await searchUsers();
  }

  return (
    <div className="space-y-4">
      <IOSCard className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1 block text-[13px] text-prel-secondary-label">
              Username search
            </label>
            <input
              className="box-border w-full rounded-[10px] border border-prel-separator bg-prel-grouped px-3 py-3 text-[17px] text-prel-label"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            />
          </div>
          <IOSButton
            onClick={() => searchUsers()}
            disabled={loading}
            className="sm:w-40"
          >
            {loading ? "…" : "Search"}
          </IOSButton>
        </div>
        {error && <p className="mt-2 text-prel-error">{error.message}</p>}
      </IOSCard>

      <IOSCard className="divide-y divide-prel-separator">
        {rows.length === 0 && !loading && (
          <p className="p-6 text-center text-prel-secondary-label">
            No results. Run a search.
          </p>
        )}
        {rows.map(
          (u: {
            id: unknown;
            username?: string | null;
            displayName?: string | null;
            profilePictureUrl?: string | null;
            thumbnailUrl?: string | null;
            email?: string | null;
            isStaff?: boolean;
            isSuperuser?: boolean;
            activeListings?: number | null;
            totalSales?: number | string | null;
          }) => {
            const pic = u.profilePictureUrl ?? u.thumbnailUrl;
            const un = u.username ?? "";
            return (
              <div
                key={String(u.id)}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-prel-glass-border">
                    <SafeImage
                      src={pic}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <Link
                      href={staffPath(`/users/${encodeURIComponent(un)}`)}
                      className="text-[17px] font-semibold text-prel-primary hover:underline"
                    >
                      {u.displayName ?? un}
                    </Link>
                    <p className="text-[14px] text-prel-secondary-label">
                      @{un} · {u.email ?? "-"}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2 text-[11px] font-semibold">
                      {u.isSuperuser && (
                        <span className="rounded bg-orange-500/25 px-1.5 py-0.5 text-orange-600 dark:text-orange-300">
                          SUPER
                        </span>
                      )}
                      {u.isStaff && !u.isSuperuser && (
                        <span className="rounded bg-prel-primary/25 px-1.5 py-0.5 text-prel-primary">
                          STAFF
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[12px] text-prel-tertiary-label">
                      {u.activeListings ?? 0} active · sales{" "}
                      {formatMoney(u.totalSales as number | string | null)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2 sm:flex-col">
                  <Link
                    href={staffPath(`/users/${encodeURIComponent(un)}`)}
                    className="rounded-[10px] bg-prel-primary/15 px-4 py-2 text-center text-[14px] font-semibold text-prel-primary"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="rounded-[10px] bg-prel-error/15 px-4 py-2 text-[14px] font-semibold text-prel-error"
                    onClick={() => onFlag(u)}
                  >
                    Flag
                  </button>
                </div>
              </div>
            );
          }
        )}
      </IOSCard>
    </div>
  );
}
