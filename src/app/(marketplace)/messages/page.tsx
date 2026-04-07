"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { Headphones, MessageCircle, RefreshCw } from "lucide-react";
import { CONVERSATIONS_INBOX } from "@/graphql/queries/chat";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatRelativeShort } from "@/lib/format";
import { useAuth } from "@/contexts/AuthContext";
import { useConversationsSocket } from "@/hooks/useConversationsSocket";

type ConvRow = {
  id: string | number;
  lastModified?: string | null;
  isOrder?: boolean | null;
  isOffer?: boolean | null;
  isSystemConversation?: boolean | null;
  unreadMessagesCount?: number | null;
  recipient?: {
    username?: string | null;
    displayName?: string | null;
    thumbnailUrl?: string | null;
  } | null;
  lastMessage?: {
    id?: string | number | null;
    text?: string | null;
    createdAt?: string | null;
    sender?: { username?: string | null } | null;
  } | null;
};

function threadBadge(c: ConvRow) {
  if (c.isSystemConversation) return "Support";
  if (c.isOrder) return "Order";
  if (c.isOffer) return "Offer";
  return "Chat";
}

function initialsForThread(c: ConvRow): string {
  const dn = c.recipient?.displayName?.trim();
  if (dn) {
    const parts = dn.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0][0];
      const b = parts[1][0];
      if (a && b) return (a + b).toUpperCase();
    }
    return dn.slice(0, 2).toUpperCase();
  }
  const u = c.recipient?.username?.trim().replace(/^@/, "");
  if (u) return u.slice(0, 2).toUpperCase();
  return "?";
}

function ThreadAvatar({ c }: { c: ConvRow }) {
  const thumb = c.recipient?.thumbnailUrl?.trim();

  if (c.isSystemConversation) {
    return (
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--prel-primary)] to-violet-600 text-white shadow-ios ring-1 ring-black/5"
        aria-hidden
      >
        <Headphones className="h-7 w-7" strokeWidth={1.65} />
      </div>
    );
  }

  if (thumb) {
    return (
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-1 ring-black/8">
        <SafeImage
          src={thumb}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const initials = initialsForThread(c);
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 text-[15px] font-bold tracking-tight text-zinc-600 ring-1 ring-black/6"
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function MarketplaceMessagesInboxPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, loading, error, refetch } = useQuery(CONVERSATIONS_INBOX, {
    skip: !ready || !userToken,
    fetchPolicy: "network-only",
  });

  useConversationsSocket(userToken, () => {
    refetch();
  });

  useEffect(() => {
    if (ready && !userToken) router.replace("/login");
  }, [ready, userToken, router]);

  const rows = useMemo(() => {
    const list = (data?.conversations ?? []) as ConvRow[];
    return [...list].sort((a, b) => {
      const ta = new Date(
        String(a.lastMessage?.createdAt || a.lastModified || 0),
      ).getTime();
      const tb = new Date(
        String(b.lastMessage?.createdAt || b.lastModified || 0),
      ).getTime();
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) {
        return tb - ta;
      }
      return String(b.id).localeCompare(String(a.id));
    });
  }, [data?.conversations]);

  if (!ready) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  if (!userToken) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-24">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-[22px] font-bold tracking-tight text-prel-label">
          Messages
        </h1>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-prel-secondary-label transition-colors hover:bg-black/5 hover:text-prel-label disabled:opacity-40 [-webkit-tap-highlight-color:transparent]"
          aria-label="Refresh conversations"
        >
          <RefreshCw
            className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
            strokeWidth={2}
          />
        </button>
      </div>

      {loading && !data && (
        <p className="text-[14px] text-prel-secondary-label">Loading…</p>
      )}
      {error && (
        <p className="text-[14px] text-prel-error">{error.message}</p>
      )}

      {!loading && rows.length === 0 && !error && (
        <div className="overflow-hidden rounded-2xl bg-white py-10 text-center shadow-ios ring-1 ring-black/[0.06]">
          <div className="mx-auto flex max-w-sm flex-col items-center gap-3 px-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--prel-primary)]/10 text-[var(--prel-primary)]">
              <MessageCircle className="h-8 w-8" strokeWidth={1.5} />
            </div>
            <p className="text-[17px] font-semibold text-prel-label">
              No conversations yet
            </p>
            <p className="text-[14px] leading-relaxed text-prel-secondary-label">
              Start a chat from a seller&apos;s profile, or open threads from
              the app.
            </p>
          </div>
        </div>
      )}

      {rows.length > 0 ? (
        <ul className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-black/[0.06]">
          {rows.map((c, i) => {
            const id = String(c.id);
            const name =
              c.recipient?.displayName?.trim() ||
              (c.recipient?.username ? `@${c.recipient.username}` : "Thread");
            const preview = c.lastMessage?.text?.trim() || "No preview";
            const when = c.lastMessage?.createdAt || c.lastModified;
            const unread = (c.unreadMessagesCount ?? 0) > 0;
            const isLast = i === rows.length - 1;

            return (
              <li key={id} className={isLast ? "" : "border-b border-black/[0.06]"}>
                <Link
                  href={`/messages/${id}`}
                  className="flex gap-3.5 px-4 py-3.5 transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-zinc-50/90 active:bg-zinc-100/80"
                >
                  <ThreadAvatar c={c} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p
                        className={`min-w-0 truncate text-[16px] leading-tight text-prel-label ${unread ? "font-semibold" : "font-medium"}`}
                      >
                        {name}
                      </p>
                      {when ? (
                        <span className="shrink-0 text-[12px] tabular-nums text-prel-tertiary-label">
                          {formatRelativeShort(when)}
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`inline-flex rounded-md px-1.5 py-px text-[10px] font-bold uppercase tracking-wide ${
                          c.isSystemConversation
                            ? "bg-violet-500/12 text-violet-700"
                            : "bg-zinc-500/10 text-zinc-600"
                        }`}
                      >
                        {threadBadge(c)}
                      </span>
                      {unread ? (
                        <span className="text-[11px] font-semibold text-[var(--prel-primary)]">
                          {c.unreadMessagesCount} new
                        </span>
                      ) : null}
                    </div>
                    <p
                      className={`mt-1 line-clamp-2 text-[14px] leading-snug ${unread ? "text-prel-label/85" : "text-prel-secondary-label"}`}
                    >
                      {preview}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
