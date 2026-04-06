"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { CONVERSATIONS_INBOX } from "@/graphql/queries/chat";
import { GlassCard } from "@/components/ui/GlassCard";
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

  const rows = (data?.conversations ?? []) as ConvRow[];

  if (!ready) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  if (!userToken) {
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-24">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] text-prel-secondary-label">
          Live inbox updates over WebSocket. Open a thread to chat in real time.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="text-[14px] font-semibold text-[var(--prel-primary)]"
        >
          Refresh
        </button>
      </div>

      {loading && !data && (
        <p className="text-[14px] text-prel-secondary-label">Loading…</p>
      )}
      {error && (
        <p className="text-[14px] text-prel-error">{error.message}</p>
      )}

      {!loading && rows.length === 0 && !error && (
        <GlassCard>
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <MessageCircle
              className="h-12 w-12 text-prel-tertiary-label"
              strokeWidth={1.5}
            />
            <p className="text-[16px] font-semibold text-prel-label">
              No conversations yet
            </p>
            <p className="max-w-sm text-[14px] text-prel-secondary-label">
              Start a chat from a seller&apos;s profile, or open threads from
              the app.
            </p>
          </div>
        </GlassCard>
      )}

      <ul className="flex flex-col gap-3">
        {rows.map((c) => {
          const id = String(c.id);
          const name =
            c.recipient?.displayName?.trim() ||
            (c.recipient?.username ? `@${c.recipient.username}` : "Thread");
          const preview = c.lastMessage?.text?.trim() || "No preview";
          const when = c.lastMessage?.createdAt || c.lastModified;
          const unread = (c.unreadMessagesCount ?? 0) > 0;

          return (
            <li key={id}>
              <Link href={`/messages/${id}`}>
                <GlassCard className="block transition-opacity hover:opacity-95">
                  <div className="flex gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-prel-glass ring-1 ring-prel-glass-border">
                      <SafeImage
                        src={c.recipient?.thumbnailUrl ?? ""}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`truncate text-[16px] font-semibold text-prel-label ${unread ? "" : "font-medium"}`}
                        >
                          {name}
                        </p>
                        {when ? (
                          <span className="shrink-0 text-[12px] text-prel-tertiary-label">
                            {formatRelativeShort(when)}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--prel-primary)]/15 px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--prel-primary)]">
                          {threadBadge(c)}
                        </span>
                        {unread ? (
                          <span className="text-[11px] font-semibold text-[var(--prel-primary)]">
                            {c.unreadMessagesCount} new
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[14px] text-prel-secondary-label">
                        {preview}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
