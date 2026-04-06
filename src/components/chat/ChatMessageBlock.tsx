"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BadgeCheck,
  Gavel,
  Package,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney, formatDateTime } from "@/lib/format";
import { normalizeProductImageUrls } from "@/lib/product-images";
import {
  parseChatMessageText,
  isSupportSystemUsername,
  type ParsedChatMessage,
} from "@/lib/chat-message-parse";
import { staffPath } from "@/lib/staff-nav";

export type ChatMessageVariant = "staff" | "marketplace";

function formatIssueType(t: string | null | undefined) {
  if (!t) return "Order issue";
  return t
    .split(/_/g)
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

function CardShell({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "sale" | "system" | "danger";
}) {
  const ring =
    variant === "sale"
      ? "ring-[var(--prel-primary)]/30"
      : variant === "system"
        ? "ring-prel-metric-users/35"
        : variant === "danger"
          ? "ring-red-500/35"
          : "ring-prel-glass-border";
  const bg =
    variant === "system"
      ? "bg-prel-metric-users/10"
      : variant === "sale"
        ? "bg-prel-primary/8"
        : variant === "danger"
          ? "bg-red-500/10"
          : "bg-prel-card";
  return (
    <div
      className={`rounded-[12px] p-3 ring-1 ${ring} ${bg} shadow-ios dark:shadow-none`}
    >
      {children}
    </div>
  );
}

function StructuredBody({
  parsed,
  variant,
}: {
  parsed: ParsedChatMessage;
  variant: ChatMessageVariant;
}) {
  const isStaff = variant === "staff";

  switch (parsed.kind) {
    case "order_issue":
      return (
        <CardShell variant="danger">
          <div className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wide text-red-600 dark:text-red-400">
                Order issue · {formatIssueType(parsed.data.issueType)}
              </p>
              {parsed.data.publicId && (
                <p className="mt-1 text-[12px] text-prel-secondary-label">
                  Ref {parsed.data.publicId}
                </p>
              )}
              {parsed.data.description && (
                <p className="mt-2 whitespace-pre-wrap text-[14px] leading-snug text-prel-label">
                  {parsed.data.description}
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {parsed.data.orderId &&
                  (isStaff ? (
                    <Link
                      href={staffPath(`/orders/${parsed.data.orderId}`)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--prel-primary)] px-3 py-1.5 text-[13px] font-semibold text-white"
                    >
                      Open order #{parsed.data.orderId}
                    </Link>
                  ) : (
                    <span className="text-[13px] font-medium text-prel-secondary-label">
                      Order #{parsed.data.orderId}
                    </span>
                  ))}
                {isStaff && parsed.data.issueId != null && (
                  <Link
                    href={staffPath("/issues")}
                    className="inline-flex items-center gap-1 rounded-lg bg-prel-glass px-3 py-1.5 text-[13px] font-semibold text-prel-label ring-1 ring-prel-glass-border"
                  >
                    View in issues queue
                  </Link>
                )}
              </div>
              {parsed.data.imageUrls.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {parsed.data.imageUrls.map((url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square overflow-hidden rounded-lg ring-1 ring-prel-separator"
                    >
                      <SafeImage
                        src={url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardShell>
      );
    case "sold_confirmation":
      return (
        <CardShell variant="sale">
          <div className="flex items-start gap-2">
            <BadgeCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--prel-primary)]"
              aria-hidden
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--prel-primary)]">
                Sale confirmed
              </p>
              <p className="mt-1 text-[15px] font-semibold text-prel-label">
                Order #{parsed.data.orderId}
                {parsed.data.price > 0 && (
                  <span className="ml-2 text-prel-secondary-label">
                    · {formatMoney(parsed.data.price)}
                  </span>
                )}
              </p>
              {isStaff ? (
                <Link
                  href={staffPath(`/orders/${parsed.data.orderId}`)}
                  className="mt-2 inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
                >
                  Order details →
                </Link>
              ) : (
                <p className="mt-2 text-[13px] text-prel-secondary-label">
                  Check your orders in the app for full details.
                </p>
              )}
            </div>
          </div>
        </CardShell>
      );
    case "offer":
      return (
        <CardShell>
          <div className="flex items-start gap-2">
            <Gavel
              className="mt-0.5 h-5 w-5 shrink-0 text-[var(--prel-primary)]"
              aria-hidden
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-prel-secondary-label">
                Offer
              </p>
              <p className="mt-1 text-[16px] font-bold text-prel-label">
                {formatMoney(parsed.data.offerPrice)}
              </p>
              {parsed.data.offerId && (
                <p className="mt-1 text-[12px] text-prel-tertiary-label">
                  Offer id {parsed.data.offerId}
                </p>
              )}
            </div>
          </div>
        </CardShell>
      );
    case "order":
      return (
        <CardShell>
          <div className="flex items-start gap-2">
            <ShoppingBag
              className="mt-0.5 h-5 w-5 shrink-0 text-prel-metric-views"
              aria-hidden
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-prel-secondary-label">
                Order update
              </p>
              {parsed.data.orderId &&
                (isStaff ? (
                  <Link
                    href={staffPath(`/orders/${parsed.data.orderId}`)}
                    className="mt-1 inline-block text-[15px] font-semibold text-[var(--prel-primary)]"
                  >
                    Order #{parsed.data.orderId}
                  </Link>
                ) : (
                  <p className="mt-1 text-[15px] font-semibold text-prel-label">
                    Order #{parsed.data.orderId}
                  </p>
                ))}
            </div>
          </div>
        </CardShell>
      );
    case "account_report":
    case "product_report":
      return (
        <CardShell variant="danger">
          <div className="flex items-start gap-2">
            <Shield className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-red-600">
                {parsed.data.reportType === "account_report"
                  ? "Account report"
                  : "Product report"}
              </p>
              {parsed.data.reason && (
                <p className="mt-1 text-[14px] font-medium text-prel-label">
                  {parsed.data.reason}
                </p>
              )}
              {parsed.data.description && (
                <p className="mt-1 whitespace-pre-wrap text-[13px] text-prel-secondary-label">
                  {parsed.data.description}
                </p>
              )}
            </div>
          </div>
        </CardShell>
      );
    case "order_cancellation_request":
      return (
        <CardShell>
          <p className="text-[13px] font-semibold text-prel-label">
            Cancellation requested
          </p>
          <p className="mt-1 text-[12px] text-prel-secondary-label">
            Order #{parsed.data.orderId} ·{" "}
            {parsed.data.requestedBySeller ? "Seller" : "Buyer"} ·{" "}
            {parsed.data.status}
          </p>
          {isStaff ? (
            <Link
              href={staffPath(`/orders/${parsed.data.orderId}`)}
              className="mt-2 inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
            >
              Open order
            </Link>
          ) : null}
        </CardShell>
      );
    case "order_cancellation_outcome":
      return (
        <CardShell>
          <p className="text-[13px] font-semibold text-prel-label">
            {parsed.data.approved
              ? "Cancellation approved"
              : "Cancellation declined"}
          </p>
          {isStaff ? (
            <Link
              href={staffPath(`/orders/${parsed.data.orderId}`)}
              className="mt-2 inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
            >
              Order #{parsed.data.orderId}
            </Link>
          ) : (
            <p className="mt-2 text-[13px] text-prel-secondary-label">
              Order #{parsed.data.orderId}
            </p>
          )}
        </CardShell>
      );
    case "unknown_json": {
      const t =
        typeof parsed.obj.type === "string" ? parsed.obj.type : null;
      if (t === "POST" || parsed.obj.message_type === "POST") {
        return (
          <CardShell variant="system">
            <p className="text-[11px] font-bold uppercase tracking-wide text-prel-metric-users">
              Shared post
            </p>
            <pre className="mt-2 max-h-32 overflow-auto text-[12px] text-prel-label">
              {JSON.stringify(parsed.obj, null, 2)}
            </pre>
          </CardShell>
        );
      }
      return (
        <CardShell variant="danger">
          <p className="text-[12px] text-prel-secondary-label">
            Structured message
            {t ? ` · ${t}` : ""}
          </p>
          <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-prel-grouped p-2 text-[11px] text-prel-label">
            {JSON.stringify(parsed.obj, null, 2)}
          </pre>
        </CardShell>
      );
    }
    default:
      return (
        <p className="whitespace-pre-wrap text-[15px] text-prel-label">
          {parsed.text}
        </p>
      );
  }
}

export function ChatMessageBlock({
  message,
  variant = "staff",
  threadAvatars = false,
}: {
  message: Record<string, unknown>;
  variant?: ChatMessageVariant;
  /** When true (marketplace thread with avatars outside), hide @username row. */
  threadAvatars?: boolean;
}) {
  const sender =
    (message.sender as { username?: string } | null)?.username ??
    (typeof message.senderName === "string" ? message.senderName : undefined);
  const createdAt = String(message.createdAt ?? "");
  const text = String(message.text ?? "");
  const parsed = parseChatMessageText(text);
  const isSystem = isSupportSystemUsername(sender);
  const attachment = message.attachment as string | null | undefined;
  const imgRaw = message.imageUrls;
  const extraImages = normalizeProductImageUrls(
    Array.isArray(imgRaw) ? imgRaw : [],
  );
  const isItem = message.isItem === true;
  const itemId = message.itemId as number | null | undefined;
  const itemType = message.itemType as string | null | undefined;

  const productHref =
    variant === "marketplace" && itemId != null
      ? `/product/${itemId}`
      : staffPath(`/products/${itemId ?? 0}`);

  if (isSystem) {
    return (
      <div className="flex flex-col items-center py-2">
        <div className="max-w-[95%] rounded-[14px] bg-prel-metric-users/12 px-4 py-3 text-center ring-1 ring-prel-metric-users/25">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-prel-metric-users">
            Support / system
          </p>
          <p className="mt-1 text-[13px] text-prel-tertiary-label">
            @{sender} · {formatDateTime(createdAt)}
          </p>
          <div className="mt-2 text-left text-[15px] leading-relaxed text-prel-label">
            {parsed.kind === "plain" ? (
              <p className="whitespace-pre-wrap text-center">{parsed.text}</p>
            ) : (
              <StructuredBody parsed={parsed} variant={variant} />
            )}
          </div>
        </div>
      </div>
    );
  }

  const showInlineSender =
    !threadAvatars || variant !== "marketplace";

  return (
    <div
      className={`rounded-[12px] p-3 ring-1 ring-prel-glass-border ${
        isItem ? "bg-prel-primary/6" : "bg-prel-card"
      }`}
    >
      {showInlineSender ? (
        <div className="flex justify-between gap-2 text-[12px] text-prel-tertiary-label">
          <span className="font-semibold text-[var(--prel-primary)]">
            @{sender ?? "—"}
          </span>
          <span>{formatDateTime(createdAt)}</span>
        </div>
      ) : (
        <div className="flex justify-end text-[11px] text-prel-tertiary-label">
          <span>{formatDateTime(createdAt)}</span>
        </div>
      )}

      {isItem && itemId != null && (
        <div className="mt-2 flex items-center gap-2 rounded-lg bg-prel-glass/80 px-2 py-1.5 text-[13px]">
          <Package className="h-4 w-4 text-[var(--prel-primary)]" aria-hidden />
          <span className="text-prel-secondary-label">
            {itemType === "sold_confirmation" ? "Order item" : "Listing"}{" "}
          </span>
          <Link
            href={productHref}
            className="font-semibold text-[var(--prel-primary)]"
          >
            {variant === "marketplace" ? "View listing" : `Product #${itemId}`}
          </Link>
        </div>
      )}

      <div className="mt-2">
        {parsed.kind === "plain" ? (
          <p className="whitespace-pre-wrap text-[15px] text-prel-label">
            {parsed.text}
          </p>
        ) : (
          <StructuredBody parsed={parsed} variant={variant} />
        )}
      </div>

      {attachment && (
        <a
          href={attachment}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-[14px] font-semibold text-[var(--prel-primary)]"
        >
          Attachment
        </a>
      )}
      {extraImages.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {extraImages.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="h-20 w-20 overflow-hidden rounded-lg ring-1 ring-prel-separator"
            >
              <SafeImage src={url} alt="" className="h-full w-full object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
