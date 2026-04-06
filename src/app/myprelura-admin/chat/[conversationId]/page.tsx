"use client";

import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { CONVERSATION_BY_ID } from "@/graphql/queries/chat";
import { CONVERSATION_MESSAGES } from "@/graphql/queries/admin";
import { SEND_MESSAGE } from "@/graphql/mutations/chat";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { ChatMessageBlock } from "@/components/chat/ChatMessageBlock";
import { formatMoney } from "@/lib/format";
import { staffPath } from "@/lib/staff-nav";
import { firstProductImageUrl } from "@/lib/product-images";

export default function StaffChatPage() {
  const params = useParams();
  const raw = params.conversationId as string;
  const conversationId = raw;

  const { data: meta, loading: metaLoad } = useQuery(CONVERSATION_BY_ID, {
    variables: { id: conversationId },
    skip: !conversationId,
  });
  const {
    data: msgsData,
    loading: msgLoad,
    refetch,
  } = useQuery(CONVERSATION_MESSAGES, {
    variables: { id: conversationId, pageCount: 200, pageNumber: 1 },
    skip: !conversationId,
  });
  const [sendMessage, { loading: sendLoad }] = useMutation(SEND_MESSAGE);
  const [text, setText] = useState("");

  const conv = meta?.conversationById;
  const messages = useMemo(() => {
    const list = msgsData?.conversation ?? [];
    return [...list].sort(
      (a: { id?: number }, b: { id?: number }) => (a.id ?? 0) - (b.id ?? 0)
    );
  }, [msgsData]);

  useEffect(() => {
    const t = setInterval(() => {
      refetch();
    }, 12000);
    return () => clearInterval(t);
  }, [refetch]);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const cid = parseInt(conversationId, 10);
    if (Number.isNaN(cid)) return;
    await sendMessage({
      variables: { conversationId: cid, message: t },
    });
    setText("");
    await refetch();
  }

  const sub =
    conv?.order?.user?.username && conv?.order?.seller?.username
      ? `@${conv.order.user.username} ↔ @${conv.order.seller.username}`
      : conv?.recipient?.username
        ? `Thread · @${conv.recipient.username}`
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

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 pb-28">
      {/* Top bar — sticky, Swift-style context */}
      <div className="sticky top-0 z-20 -mx-1 border-b border-prel-separator bg-prel-nav/95 px-3 py-3 backdrop-blur-md">
        <div className="flex items-start gap-2">
          <MessageSquare
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--prel-primary)]"
            aria-hidden
          />
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
            </div>
            {conv?.order?.id != null && (
              <Link
                href={staffPath(`/orders/${conv.order.id}`)}
                className="mt-2 inline-flex text-[14px] font-semibold text-[var(--prel-primary)]"
              >
                Open order #{conv.order.id}
                {conv.order.publicId
                  ? ` · ${conv.order.publicId}`
                  : ""}
              </Link>
            )}
          </div>
        </div>
      </div>

      {offerHistory.length > 0 && (
        <GlassCard paddingClass="p-3">
          <p className="text-[12px] font-bold uppercase tracking-wide text-prel-secondary-label">
            Offer chain (live data)
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
                          href={staffPath(`/products/${prod.id}`)}
                          className="font-medium text-[var(--prel-primary)]"
                        >
                          · #{prod.id}
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

      {(metaLoad || msgLoad) && !msgsData && (
        <p className="text-prel-secondary-label">Loading messages…</p>
      )}

      <div className="space-y-3">
        {messages.map((m: Record<string, unknown>) => (
          <ChatMessageBlock key={String(m.id)} message={m} />
        ))}
      </div>

      <form
        onSubmit={onSend}
        className="fixed bottom-20 left-0 right-0 z-30 mx-auto flex max-w-2xl gap-2 border-t border-prel-separator bg-prel-nav/95 px-3 py-2 backdrop-blur-md md:bottom-4 md:rounded-ios-lg md:border md:shadow-ios"
      >
        <input
          className="min-w-0 flex-1 rounded-[10px] border border-prel-separator bg-prel-grouped px-3 py-2 text-[15px] text-prel-label outline-none focus:ring-2 focus:ring-prel-primary/30"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Staff reply…"
        />
        <button
          type="submit"
          disabled={sendLoad || !text.trim()}
          className="prel-btn-primary shrink-0 rounded-[10px] px-4 py-2 text-[15px] font-semibold disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
