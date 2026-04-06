"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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

export default function MarketplaceChatThreadPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = String(params.conversationId ?? "");
  const { userToken, ready } = useAuth();
  const [text, setText] = useState("");
  const [typingRemote, setTypingRemote] = useState(false);

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
  });
  const [sendMessage, { loading: sendLoad }] = useMutation(SEND_MESSAGE);

  const onWs = useCallback(
    (ev: ChatWsInbound) => {
      if (ev.type === "chat_message") {
        refetch();
      }
      if (ev.type === "typing_status") {
        const p =
          ev.payload && typeof ev.payload === "object"
            ? (ev.payload as Record<string, unknown>)
            : {};
        const flag = p.is_typing ?? p.isTyping;
        setTypingRemote(flag === true || flag === "true" || flag === 1);
        if (flag) {
          window.setTimeout(() => setTypingRemote(false), 4000);
        }
      }
    },
    [refetch]
  );

  const { connected, sendChatMessage } = useChatRoomSocket(
    userToken ? conversationId : null,
    userToken,
    onWs
  );

  const messages = useMemo(() => {
    const list = (msgsData?.conversation ?? []) as Record<string, unknown>[];
    return [...list].sort(
      (a, b) => (Number(a.id) || 0) - (Number(b.id) || 0)
    );
  }, [msgsData]);

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

    if (connected) {
      sendChatMessage(t, uuid);
      setText("");
      window.setTimeout(() => refetch(), 400);
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
    <div className="mx-auto flex max-w-2xl flex-col gap-3 pb-32">
      <div className="sticky top-0 z-20 -mx-1 border-b border-prel-separator bg-prel-nav/95 px-3 py-3 backdrop-blur-md">
        <div className="flex items-start gap-2">
          <Link
            href="/messages"
            className="mt-0.5 shrink-0 text-[14px] font-semibold text-[var(--prel-primary)]"
          >
            ← Inbox
          </Link>
          <div className="relative mt-0.5 h-11 w-11 shrink-0 overflow-hidden rounded-full bg-prel-glass ring-1 ring-prel-glass-border">
            <SafeImage
              src={peerThumb}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
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
                        · {o.status ?? "—"}
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
          const senderUn = senderObj?.username?.trim().toLowerCase() ?? "";
          const sys = isSupportSystemUsername(senderObj?.username ?? null);
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
          return (
            <div
              key={String(m.id)}
              className={`flex gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            >
              {!isOwn ? (
                <div className="mt-0.5 h-9 w-9 shrink-0 self-end overflow-hidden rounded-full bg-prel-glass ring-1 ring-prel-glass-border">
                  <SafeImage
                    src={avatarSrc}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
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

      <form
        onSubmit={onSend}
        className="fixed bottom-20 left-0 right-0 z-30 mx-auto flex max-w-2xl gap-2 border-t border-prel-separator bg-prel-nav/95 px-3 py-2 backdrop-blur-md md:bottom-4 md:rounded-2xl md:border md:shadow-ios"
      >
        <input
          className="min-w-0 flex-1 rounded-[10px] border border-prel-separator bg-prel-bg-grouped px-3 py-2 text-[15px] text-prel-label outline-none focus:ring-2 focus:ring-[var(--prel-primary)]/30"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Message…"
        />
        <button
          type="submit"
          disabled={sendLoad || !text.trim()}
          className="shrink-0 rounded-[10px] bg-[var(--prel-primary)] px-4 py-2 text-[15px] font-semibold text-white disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
