"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Headphones } from "lucide-react";
import { CONVERSATION_BY_ID } from "@/graphql/queries/chat";
import { CONVERSATION_MESSAGES, VIEW_ME } from "@/graphql/queries/admin";
import { SEND_MESSAGE } from "@/graphql/mutations/chat";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChatMessageBlock } from "@/components/chat/ChatMessageBlock";
import { formatMoney } from "@/lib/format";
import { firstProductImageUrl } from "@/lib/product-images";
import { useAuth } from "@/contexts/AuthContext";
import {
  useChatRoomSocket,
  type ChatWsInbound,
} from "@/hooks/useChatRoomSocket";
import { isSupportSystemUsername } from "@/lib/chat-message-parse";
import {
  chatMessageSenderKey,
  normalizeChatMessageFromWs,
} from "@/lib/chat-ws-message";

function peerInitials(conv: {
  recipient?: {
    displayName?: string | null;
    username?: string | null;
  } | null;
} | null): string {
  const dn = conv?.recipient?.displayName?.trim();
  if (dn) {
    const parts = dn.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      const a = parts[0][0];
      const b = parts[1][0];
      if (a && b) return (a + b).toUpperCase();
    }
    return dn.slice(0, 2).toUpperCase();
  }
  const u = conv?.recipient?.username?.trim().replace(/^@/, "");
  if (u) return u.slice(0, 2).toUpperCase();
  return "?";
}

export default function MarketplaceChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = String(params.conversationId ?? "");
  const { userToken, ready } = useAuth();
  const [text, setText] = useState("");
  const [typingRemote, setTypingRemote] = useState(false);
  const [realtimeExtra, setRealtimeExtra] = useState<Record<string, unknown>[]>(
    [],
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const meUsernameRef = useRef("");
  const typingHideTimerRef = useRef<number | null>(null);
  const typingIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wsActionsRef = useRef({
    connected: false,
    sendTyping: (_b: boolean) => {},
  });

  useEffect(() => {
    if (ready && !userToken) router.replace("/login");
  }, [ready, userToken, router]);

  const { data: meta, loading: metaLoad } = useQuery(CONVERSATION_BY_ID, {
    variables: { id: conversationId },
    skip: !userToken || !conversationId,
  });
  const { data: meData } = useQuery(VIEW_ME, {
    skip: !userToken,
  });
  const {
    data: msgsData,
    loading: msgLoad,
    refetch,
  } = useQuery(CONVERSATION_MESSAGES, {
    variables: { id: conversationId, pageCount: 200, pageNumber: 1 },
    skip: !userToken || !conversationId,
    fetchPolicy: "cache-and-network",
  });
  const [sendMessage, { loading: sendLoad }] = useMutation(SEND_MESSAGE);

  const onWs = useCallback(
    (ev: ChatWsInbound) => {
      if (ev.type === "chat_message") {
        const p = ev.payload as Record<string, unknown>;
        const normalized = normalizeChatMessageFromWs(p);
        const mid = Number(normalized.id);
        if (Number.isFinite(mid)) {
          setRealtimeExtra((prev) => {
            if (prev.some((x) => Number(x.id) === mid)) return prev;
            return [...prev, normalized];
          });
        }
        void refetch();
        window.setTimeout(() => void refetch(), 900);
        return;
      }
      if (ev.type === "typing_status") {
        const p =
          ev.payload && typeof ev.payload === "object"
            ? (ev.payload as Record<string, unknown>)
            : {};
        const senderRaw = String(p.sender ?? "")
          .trim()
          .toLowerCase()
          .replace(/^@/, "");
        const me = meUsernameRef.current;
        if (me && senderRaw && senderRaw === me) return;

        const rawFlag = p.is_typing ?? p.isTyping;
        if (
          rawFlag === false ||
          rawFlag === "false" ||
          rawFlag === 0 ||
          rawFlag === "0"
        ) {
          setTypingRemote(false);
          if (typingHideTimerRef.current != null) {
            window.clearTimeout(typingHideTimerRef.current);
            typingHideTimerRef.current = null;
          }
          return;
        }
        if (
          rawFlag === true ||
          rawFlag === "true" ||
          rawFlag === 1 ||
          rawFlag === "1"
        ) {
          setTypingRemote(true);
          if (typingHideTimerRef.current != null) {
            window.clearTimeout(typingHideTimerRef.current);
          }
          typingHideTimerRef.current = window.setTimeout(() => {
            setTypingRemote(false);
            typingHideTimerRef.current = null;
          }, 5000);
        }
      }
    },
    [refetch],
  );

  const { connected, sendChatMessage, sendTyping } = useChatRoomSocket(
    userToken ? conversationId : null,
    userToken,
    onWs
  );

  wsActionsRef.current = { connected, sendTyping };

  const scheduleTypingBurst = useCallback(() => {
    const { connected: live, sendTyping: st } = wsActionsRef.current;
    if (!live) return;
    st(true);
    if (typingIdleRef.current) clearTimeout(typingIdleRef.current);
    typingIdleRef.current = setTimeout(() => {
      wsActionsRef.current.sendTyping(false);
      typingIdleRef.current = null;
    }, 2000);
  }, []);

  const flushTypingStopped = useCallback(() => {
    if (typingIdleRef.current) {
      clearTimeout(typingIdleRef.current);
      typingIdleRef.current = null;
    }
    wsActionsRef.current.sendTyping(false);
  }, []);

  useEffect(() => {
    return () => {
      if (typingHideTimerRef.current != null) {
        window.clearTimeout(typingHideTimerRef.current);
      }
      if (typingIdleRef.current) {
        clearTimeout(typingIdleRef.current);
      }
      try {
        wsActionsRef.current.sendTyping(false);
      } catch {
        /* ignore */
      }
    };
  }, []);

  useEffect(() => {
    setRealtimeExtra([]);
  }, [conversationId]);

  useEffect(() => {
    if (!userToken || !conversationId || connected) return;
    const id = window.setInterval(() => {
      void refetch();
    }, 5000);
    return () => window.clearInterval(id);
  }, [userToken, conversationId, connected, refetch]);

  const queryMessages = useMemo(() => {
    const list = (msgsData?.conversation ?? []) as Record<string, unknown>[];
    return [...list].sort((a, b) => {
      const ta = new Date(String(a.createdAt ?? 0)).getTime();
      const tb = new Date(String(b.createdAt ?? 0)).getTime();
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) {
        return ta - tb;
      }
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  }, [msgsData]);

  const queryIds = useMemo(
    () =>
      new Set(
        queryMessages
          .map((m) => Number(m.id))
          .filter((n) => Number.isFinite(n)),
      ),
    [queryMessages],
  );

  useEffect(() => {
    setRealtimeExtra((prev) =>
      prev.filter((m) => !queryIds.has(Number(m.id))),
    );
  }, [queryIds]);

  const messages = useMemo(() => {
    const byId = new Map<number, Record<string, unknown>>();
    for (const m of queryMessages) {
      const id = Number(m.id);
      if (Number.isFinite(id)) byId.set(id, m);
    }
    for (const m of realtimeExtra) {
      const id = Number(m.id);
      if (Number.isFinite(id) && !byId.has(id)) {
        byId.set(id, m);
      }
    }
    return [...byId.values()].sort((a, b) => {
      const ta = new Date(String(a.createdAt ?? 0)).getTime();
      const tb = new Date(String(b.createdAt ?? 0)).getTime();
      if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) {
        return ta - tb;
      }
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    });
  }, [queryMessages, realtimeExtra]);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [conversationId, messages, msgLoad]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !userToken) return;
    const cid = parseInt(conversationId, 10);
    if (Number.isNaN(cid)) return;

    const uuid =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    flushTypingStopped();

    if (connected) {
      sendChatMessage(t, uuid);
      setText("");
      void refetch();
      window.setTimeout(() => void refetch(), 500);
      window.setTimeout(() => void refetch(), 1500);
      return;
    }

    await sendMessage({
      variables: { conversationId: cid, message: t, messageUuid: uuid },
    });
    setText("");
    await refetch();
  }

  const conv = meta?.conversationById;
  const meUsername =
    meData?.viewMe?.username?.trim().toLowerCase() ?? "";

  useEffect(() => {
    meUsernameRef.current = meUsername;
  }, [meUsername]);
  const peerThumb = conv?.recipient?.thumbnailUrl ?? "";
  const peerDisplay =
    conv?.recipient?.displayName?.trim() ||
    (conv?.recipient?.username
      ? `@${conv.recipient.username}`
      : null);
  const sub =
    conv?.order?.user?.username && conv?.order?.seller?.username
      ? `@${conv.order.user.username} ↔ @${conv.order.seller.username}`
      : peerDisplay
        ? `Thread · ${peerDisplay}`
        : `Conversation #${conversationId}`;

  const offerHistory = (conv?.offerHistory ?? []) as Array<{
    id?: number;
    offerPrice?: number;
    status?: string;
    message?: string | null;
    createdAt?: string;
    buyer?: { username?: string };
    products?: Array<{
      id?: number;
      name?: string;
      listingCode?: string;
      price?: number;
      imagesUrl?: unknown;
    }>;
  }>;

  if (!ready || !userToken) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-10.5rem)] max-w-2xl flex-col gap-0 sm:h-[calc(100dvh-9.75rem)] lg:h-[calc(100dvh-7.5rem)]">
      <div className="z-20 shrink-0 border-b border-prel-separator bg-[#fafafa] px-1 py-3 sm:px-0">
        <div className="flex items-start gap-2">
          <Link
            href="/messages"
            className="mt-0.5 shrink-0 text-[14px] font-semibold text-[var(--prel-primary)]"
          >
            ← Inbox
          </Link>
          {conv?.isSystemConversation ? (
            <div
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--prel-primary)] to-violet-600 text-white shadow-ios ring-1 ring-black/5"
              aria-hidden
            >
              <Headphones className="h-5 w-5" strokeWidth={1.65} />
            </div>
          ) : peerThumb.trim() ? (
            <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-black/8">
              <SafeImage
                src={peerThumb}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 text-[13px] font-bold tracking-tight text-zinc-600 ring-1 ring-black/6"
              aria-hidden
            >
              {peerInitials(conv ?? null)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-snug text-prel-label">
              {sub}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-prel-secondary-label">
              {conv?.isOrder && (
                <span className="font-medium text-[var(--prel-primary)]">
                  Order-linked
                </span>
              )}
              {conv?.isOffer && (
                <span className="font-medium text-prel-metric-views">
                  Offer thread
                </span>
              )}
              {conv?.isSystemConversation && (
                <span className="font-medium text-prel-metric-users">
                  Support / system
                </span>
              )}
              <span
                className={
                  connected
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-prel-tertiary-label"
                }
              >
                {connected ? "Live (WebSocket)" : "Polling / send only"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-0.5 pb-2 pt-2 sm:px-0"
      >
      {offerHistory.length > 0 && (
        <GlassCard paddingClass="p-3">
          <p className="text-[12px] font-bold uppercase tracking-wide text-prel-secondary-label">
            Offer chain
          </p>
          <ul className="mt-2 space-y-2">
            {offerHistory.map((o) => {
              const prod = o.products?.[0];
              const thumb = firstProductImageUrl(prod?.imagesUrl);
              return (
                <li
                  key={o.id}
                  className="flex gap-3 rounded-lg bg-prel-glass/60 p-2 ring-1 ring-prel-glass-border"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-prel-separator">
                    <SafeImage
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-[13px]">
                    <p className="font-semibold text-prel-label">
                      {formatMoney(o.offerPrice ?? 0)}{" "}
                      <span className="font-normal text-prel-secondary-label">
                        · {o.status ?? "-"}
                      </span>
                    </p>
                    <p className="truncate text-prel-secondary-label">
                      {prod?.name ?? "Product"}{" "}
                      {prod?.id != null && (
                        <Link
                          href={`/product/${prod.id}`}
                          className="font-medium text-[var(--prel-primary)]"
                        >
                          · view
                        </Link>
                      )}
                    </p>
                    {o.buyer?.username && (
                      <p className="text-[12px] text-prel-tertiary-label">
                        Buyer @{o.buyer.username}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      )}

      {typingRemote && (
        <p className="text-[12px] italic text-prel-secondary-label">
          Someone is typing…
        </p>
      )}

      {(metaLoad || msgLoad) && !msgsData && (
        <p className="text-prel-secondary-label">Loading messages…</p>
      )}

      <div className="space-y-3">
        {messages.map((m) => {
          const senderObj = m.sender as
            | { username?: string | null; thumbnailUrl?: string | null }
            | null
            | undefined;
          const senderUn = chatMessageSenderKey(m);
          const sys = isSupportSystemUsername(
            senderObj?.username ??
              (typeof m.senderName === "string" ? m.senderName : null),
          );
          if (sys) {
            return (
              <ChatMessageBlock
                key={String(m.id)}
                message={m}
                variant="marketplace"
              />
            );
          }
          if (!meUsername) {
            return (
              <ChatMessageBlock
                key={String(m.id)}
                message={m}
                variant="marketplace"
              />
            );
          }
          const isOwn =
            meUsername.length > 0 && senderUn === meUsername;
          const avatarSrc = !isOwn
            ? (senderObj?.thumbnailUrl || peerThumb || "")
            : "";
          const handleForInitials =
            senderUn ||
            senderObj?.username?.trim().replace(/^@/, "") ||
            "";
          const remoteInitials =
            handleForInitials.slice(0, 2).toUpperCase() ||
            peerInitials(conv ?? null);
          return (
            <div
              key={String(m.id)}
              className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isOwn ? (
                avatarSrc.trim() ? (
                  <div className="mt-0.5 h-9 w-9 shrink-0 self-end overflow-hidden rounded-full ring-1 ring-black/8">
                    <SafeImage
                      src={avatarSrc}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 text-[11px] font-bold text-zinc-600 ring-1 ring-black/6"
                    aria-hidden
                  >
                    {remoteInitials || "?"}
                  </div>
                )
              ) : (
                <div className="w-9 shrink-0 self-end" aria-hidden />
              )}
              <div
                className={`min-w-0 flex-1 ${isOwn ? "flex justify-end" : ""}`}
              >
                <div
                  className={`w-full max-w-[min(85%,520px)] ${isOwn ? "ml-auto" : ""}`}
                >
                  <ChatMessageBlock
                    message={m}
                    variant="marketplace"
                    threadAvatars
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <form
        onSubmit={onSend}
        className="flex shrink-0 gap-2 border-t border-neutral-200 bg-white px-0 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-0"
      >
        <input
          className="min-w-0 flex-1 rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/30"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            scheduleTypingBurst();
          }}
          onBlur={() => flushTypingStopped()}
          placeholder="Message…"
        />
        <button
          type="submit"
          disabled={sendLoad || !text.trim()}
          className="shrink-0 rounded-xl bg-[var(--prel-primary)] px-4 py-2.5 text-[15px] font-semibold text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
