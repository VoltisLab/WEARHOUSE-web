"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { USER_ORDER } from "@/graphql/queries/marketplace";
import { CREATE_CHAT } from "@/graphql/mutations/marketplace";
import { VIEW_ME } from "@/graphql/queries/admin";
import { useAuth } from "@/contexts/AuthContext";
import { formatMoney, formatDateTime } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";
import { firstProductImageUrl } from "@/lib/product-images";

function parseAddressJson(raw: string | null | undefined): Record<string, unknown> | null {
  if (raw == null || String(raw).trim() === "") return null;
  try {
    const v = JSON.parse(String(raw));
    return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export default function AccountOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(String(params.orderId ?? ""), 10);
  const { userToken, ready } = useAuth();

  const { data: meData } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
  });
  const meUsername = meData?.viewMe?.username ?? "";

  const { data, loading, error } = useQuery(USER_ORDER, {
    variables: { orderId },
    skip: !ready || !userToken || Number.isNaN(orderId),
  });

  const [createChat, { loading: chatLoading }] = useMutation(CREATE_CHAT);

  useEffect(() => {
    if (ready && !userToken) router.replace(`/login?next=/account/orders/${orderId}`);
  }, [ready, userToken, router, orderId]);

  const o = data?.userOrder;
  const addr = useMemo(() => parseAddressJson(o?.shippingAddressJson), [o?.shippingAddressJson]);

  async function messageOtherParty(username: string | undefined) {
    const u = username?.trim();
    if (!u) return;
    try {
      const { data: d } = await createChat({ variables: { recipient: u } });
      const id = d?.createChat?.chat?.id;
      if (id != null) router.push(`/messages/${id}`);
    } catch {
      /* noop */
    }
  }

  if (Number.isNaN(orderId)) {
    return (
      <p className="text-[15px] text-prel-error">Invalid order.</p>
    );
  }

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  if (error) {
    return (
      <p className="rounded-xl bg-prel-error/10 p-4 text-[14px] text-prel-error">
        {error.message}
      </p>
    );
  }

  if (loading && !o) {
    return (
      <div className="mx-auto max-w-lg space-y-4 pb-28 md:max-w-xl">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-white" />
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-ios" />
      </div>
    );
  }

  if (!o) {
    return (
      <div className="mx-auto max-w-lg space-y-4 pb-28 md:max-w-xl">
        <Link
          href="/account/orders"
          className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--prel-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Orders
        </Link>
        <p className="text-[15px] text-prel-secondary-label">
          This order was not found or you do not have access.
        </p>
      </div>
    );
  }

  const buyerU = o.user?.username;
  const sellerU = o.seller?.username;
  const counterparty =
    meUsername && buyerU === meUsername
      ? sellerU
      : meUsername && sellerU === meUsername
        ? buyerU
        : sellerU || buyerU;

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/account/orders"
        className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--prel-primary)] [-webkit-tap-highlight-color:transparent]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Orders
      </Link>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          {o.publicId || `Order #${o.id}`}
        </p>
        <h1 className="mt-1 text-[24px] font-bold text-prel-label">
          {formatMoney(o.priceTotal)}
        </h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          {o.createdAt ? formatDateTime(o.createdAt) : ""} ·{" "}
          <span className="font-medium text-prel-label">
            {String(o.status ?? "").replace(/_/g, " ")}
          </span>
        </p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          People
        </p>
        <p className="mt-2 text-[15px] text-prel-label">
          Buyer:{" "}
          {buyerU ? (
            <Link
              href={`/profile/${encodeURIComponent(buyerU)}`}
              className="font-semibold text-[var(--prel-primary)]"
            >
              @{buyerU}
            </Link>
          ) : (
            "—"
          )}
        </p>
        <p className="mt-1 text-[15px] text-prel-label">
          Seller:{" "}
          {sellerU ? (
            <Link
              href={`/profile/${encodeURIComponent(sellerU)}`}
              className="font-semibold text-[var(--prel-primary)]"
            >
              @{sellerU}
            </Link>
          ) : (
            "—"
          )}
        </p>
        {counterparty && counterparty !== meUsername ? (
          <div className="mt-4">
            <button
              type="button"
              disabled={chatLoading}
              onClick={() => messageOtherParty(counterparty)}
              className="rounded-full border border-prel-separator px-4 py-2 text-[13px] font-semibold text-prel-label disabled:opacity-50"
            >
              Message @{counterparty}
            </button>
          </div>
        ) : null}
      </div>

      {addr && Object.keys(addr).length > 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            Delivery address
          </p>
          <dl className="mt-2 space-y-1 text-[14px] text-prel-label">
            {Object.entries(addr).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <dt className="shrink-0 font-medium text-prel-secondary-label">{k}</dt>
                <dd className="min-w-0 break-words">{String(v)}</dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}

      {o.trackingNumber || o.carrierName || o.trackingUrl ? (
        <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            Shipping
          </p>
          {o.carrierName ? (
            <p className="mt-2 text-[15px] text-prel-label">Carrier: {o.carrierName}</p>
          ) : null}
          {o.trackingNumber ? (
            <p className="mt-1 text-[15px] text-prel-label">Tracking: {o.trackingNumber}</p>
          ) : null}
          {o.trackingUrl ? (
            <a
              href={o.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[14px] font-semibold text-[var(--prel-primary)] underline"
            >
              Track shipment
            </a>
          ) : null}
        </div>
      ) : null}

      {o.lineItems && o.lineItems.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            Items
          </p>
          <ul className="space-y-2">
            {(o.lineItems as Array<{
              id?: number | null;
              productId?: number | null;
              productName?: string | null;
              priceAtPurchase?: number | null;
              productImagesUrl?: unknown;
            }>).map((li) => {
              const thumb = firstProductImageUrl(li?.productImagesUrl ?? null);
              return (
                <li
                  key={li?.id ?? li?.productName}
                  className="flex gap-3 rounded-xl bg-white p-3 shadow-ios ring-1 ring-prel-glass-border"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-prel-bg-grouped">
                    <SafeImage src={thumb} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-semibold text-prel-label">{li?.productName}</p>
                    {li?.productId != null ? (
                      <Link
                        href={`/product/${li.productId}`}
                        className="text-[13px] font-semibold text-[var(--prel-primary)]"
                      >
                        View listing
                      </Link>
                    ) : null}
                    <p className="text-[13px] text-prel-secondary-label">
                      {formatMoney(li?.priceAtPurchase ?? 0)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
          <Package className="h-8 w-8 text-prel-tertiary-label" strokeWidth={1.25} />
          <p className="text-[14px] text-prel-secondary-label">No line items returned.</p>
        </div>
      )}

      {o.statusTimeline && o.statusTimeline.length > 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            Status history
          </p>
          <ol className="mt-3 space-y-2">
            {(o.statusTimeline as Array<{
              id?: number | null;
              status?: string | null;
              createdAt?: string | null;
            }>).map((t) => (
              <li key={t?.id ?? `${t?.status}-${t?.createdAt}`} className="text-[14px] text-prel-label">
                <span className="font-medium">
                  {String(t?.status ?? "").replace(/_/g, " ")}
                </span>
                {t?.createdAt ? (
                  <span className="ml-2 text-prel-secondary-label">
                    {formatDateTime(t.createdAt)}
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {o.payments && o.payments.length > 0 ? (
        <div className="rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            Payments
          </p>
          <ul className="mt-2 space-y-2 text-[14px]">
            {(o.payments as Array<{
              id?: number | null;
              paymentStatus?: string | null;
              paymentAmount?: number | null;
              paymentRef?: string | null;
            }>).map((p) => (
              <li key={p?.id}>
                {p?.paymentStatus} · {formatMoney(p?.paymentAmount ?? 0)}
                {p?.paymentRef ? (
                  <span className="ml-2 text-prel-tertiary-label">{p.paymentRef}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {o.orderConversationId != null ? (
        <Link
          href={`/messages/${o.orderConversationId}`}
          className="inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
        >
          Open order chat
        </Link>
      ) : null}
    </div>
  );
}
