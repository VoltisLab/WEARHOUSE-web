"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { READ_NOTIFICATIONS } from "@/graphql/mutations/account";
import { NOTIFICATIONS_LIST } from "@/graphql/queries/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { formatDateTime } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";

const PAGE = 30;

export default function NotificationsFeedPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, refetch, loading } = useQuery(NOTIFICATIONS_LIST, {
    variables: { pageCount: PAGE, pageNumber: 1 },
    skip: !ready || !userToken,
  });
  const [markRead, { loading: readLoad }] = useMutation(READ_NOTIFICATIONS);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/notifications");
  }, [ready, userToken, router]);

  type NotifRow = {
    id?: string | number | null;
    isRead?: boolean | null;
    message?: string | null;
    createdAt?: string | null;
    model?: string | null;
    sender?: {
      profilePictureUrl?: string | null;
      thumbnailUrl?: string | null;
    } | null;
  };

  const items = (data?.notifications ?? []) as NotifRow[];
  const unreadIds = useMemo(() => {
    return items
      .filter((n) => !!n && !n.isRead && n.id != null)
      .map((n) => parseInt(String(n.id), 10))
      .filter((id) => !Number.isNaN(id));
  }, [items]);

  async function markAllRead() {
    if (unreadIds.length === 0) return;
    try {
      await markRead({ variables: { notificationIds: unreadIds } });
      await refetch();
    } catch {
      /* noop */
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[24px] font-bold text-prel-label">Notifications</h1>
          <p className="mt-1 text-[14px] text-prel-secondary-label">
            Recent activity on your account.
          </p>
        </div>
        {unreadIds.length > 0 ? (
          <button
            type="button"
            disabled={readLoad}
            onClick={() => markAllRead()}
            className="rounded-full border border-prel-separator px-4 py-2 text-[13px] font-semibold text-prel-label disabled:opacity-50"
          >
            Mark all read
          </button>
        ) : null}
      </div>
      {loading && !items.length ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white shadow-ios" />
          ))}
        </div>
      ) : null}
      <ul className="space-y-2">
        {items.map((n) => {
          const thumb =
            n.sender?.profilePictureUrl?.trim() || n.sender?.thumbnailUrl?.trim() || "";
          return (
            <li
              key={String(n.id)}
              className={`rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border ${
                !n.isRead ? "ring-[var(--prel-primary)]/25" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-prel-bg-grouped">
                  <SafeImage src={thumb} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-snug text-prel-label">{n.message ?? ""}</p>
                  <p className="mt-1 text-[12px] text-prel-tertiary-label">
                    {n.createdAt ? formatDateTime(n.createdAt) : ""}
                    {n.model ? ` · ${n.model}` : ""}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {!loading && items.length === 0 ? (
        <p className="text-[14px] text-prel-secondary-label">No notifications yet.</p>
      ) : null}
    </div>
  );
}
