"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ADMIN_ORDER_DETAIL } from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDateTime, formatMoney } from "@/lib/format";
import { firstProductImageUrl } from "@/lib/product-images";
import { staffPath } from "@/lib/staff-nav";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = parseInt(String(params.orderId), 10);

  const { data, loading, error } = useQuery(ADMIN_ORDER_DETAIL, {
    variables: { orderId },
    skip: Number.isNaN(orderId),
  });
  const o = data?.adminOrder;

  if (Number.isNaN(orderId)) {
    return <p className="text-prel-error">Invalid order</p>;
  }
  if (loading) {
    return <p className="text-prel-secondary-label">Loading…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }
  if (!o) {
    return <p className="text-prel-secondary-label">Order not found.</p>;
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <GlassCard className="space-y-2 text-[14px]">
        <p className="text-[20px] font-bold text-prel-label">
          Order #{o.id}{" "}
          <span className="text-[14px] font-normal text-prel-secondary-label">
            {o.publicId ? `· ${o.publicId}` : ""}
          </span>
        </p>
        <Row k="Status" v={String(o.status ?? "—")} />
        <Row k="Placed" v={formatDateTime(String(o.createdAt ?? ""))} />
        <Row k="Buyer" v={o.user?.username ?? "—"} />
        <Row k="Seller" v={o.seller?.username ?? "—"} />
        <Row k="Items subtotal" v={formatMoney(o.itemsSubtotal)} />
        <Row k="Protection fee" v={formatMoney(o.buyerProtectionFee)} />
        <Row k="Shipping" v={formatMoney(o.shippingFee)} />
        <Row k="Total" v={formatMoney(o.priceTotal)} />
        {o.orderConversationId != null && (
          <Link
            href={staffPath(`/chat/${o.orderConversationId}`)}
            className="mt-2 inline-block text-[15px] font-semibold text-prel-primary"
          >
            Open buyer ↔ seller chat (#{o.orderConversationId})
          </Link>
        )}
      </GlassCard>

      {o.lineItems && o.lineItems.length > 0 && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">
            Line items
          </p>
          <ul className="space-y-3 text-[14px]">
            {o.lineItems.map(
              (li: {
                id?: number;
                productId?: number;
                productName?: string;
                priceAtPurchase?: number;
                productImagesUrl?: unknown;
              }) => {
                const thumb = firstProductImageUrl(li.productImagesUrl);
                return (
                  <li
                    key={li.id}
                    className="flex items-center justify-between gap-3 border-b border-prel-separator pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Link
                        href={staffPath(`/products/${li.productId ?? 0}`)}
                        className="h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-prel-glass-border"
                      >
                        <SafeImage
                          src={thumb}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <Link
                          href={staffPath(`/products/${li.productId ?? 0}`)}
                          className="font-semibold text-prel-label hover:text-[var(--prel-primary)]"
                        >
                          {li.productName ?? `Product #${li.productId ?? "?"}`}
                        </Link>
                        <p className="text-[12px] text-prel-tertiary-label">
                          ID {li.productId ?? "—"}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 font-medium text-prel-label">
                      {formatMoney(li.priceAtPurchase)}
                    </span>
                  </li>
                );
              }
            )}
          </ul>
        </GlassCard>
      )}

      {o.payments && o.payments.length > 0 && (
        <GlassCard>
          <p className="mb-2 text-[13px] font-semibold text-prel-label">
            Payments
          </p>
          {o.payments.map(
            (p: {
              id?: number;
              paymentRef?: string;
              paymentStatus?: string;
              paymentAmount?: number;
            }) => (
              <div key={p.id} className="text-[13px] text-prel-secondary-label">
                {p.paymentRef} · {p.paymentStatus} ·{" "}
                {formatMoney(p.paymentAmount)}
              </div>
            )
          )}
        </GlassCard>
      )}

      <Link
        href={staffPath("/orders")}
        className="text-[15px] font-semibold text-prel-primary"
      >
        ← Orders
      </Link>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-prel-secondary-label">{k}</span>
      <span className="text-right text-prel-label">{v}</span>
    </div>
  );
}
