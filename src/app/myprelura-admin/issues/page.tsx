"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MessageCircle, ChevronDown, ChevronRight } from "lucide-react";
import { ALL_ORDER_ISSUES } from "@/graphql/queries/admin";
import { ADMIN_RESOLVE_ORDER_ISSUE } from "@/graphql/mutations/admin";
import { IOSCard } from "@/components/ui/IOSCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDateTime, formatMoney } from "@/lib/format";
import {
  firstProductImageUrl,
  normalizeProductImageUrls,
} from "@/lib/product-images";
import { staffPath } from "@/lib/staff-nav";

type OrderSub = {
  id?: string | number;
  publicId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  priceTotal?: number;
  discountPrice?: number;
  buyerProtectionFee?: number;
  shippingFee?: number;
  itemsSubtotal?: number;
  shippingAddressJson?: string;
  orderConversationId?: number;
  trackingNumber?: string;
  trackingUrl?: string;
  carrierName?: string;
  shippingLabelUrl?: string;
  user?: { username?: string };
  seller?: { username?: string };
  offer?: { id?: string; status?: string };
  lineItems?: Array<{
    id?: number;
    productId?: number;
    productName?: string;
    priceAtPurchase?: number;
    productImagesUrl?: unknown;
  }>;
  payments?: Array<{
    id?: number;
    paymentRef?: string;
    paymentStatus?: string;
    paymentAmount?: number;
  }>;
  refunds?: Array<{
    id?: number;
    refundAmount?: number;
    status?: string;
  }>;
  statusTimeline?: Array<{ id?: number; status?: string; createdAt?: string }>;
  cancelledOrder?: {
    buyerCancellationReason?: string;
    sellerResponse?: string;
    status?: string;
    notes?: string;
  };
};

type IssueRow = {
  id: number;
  publicId?: string;
  issueType?: string;
  description?: string;
  otherIssueDescription?: string;
  imagesUrl?: string[];
  status?: string;
  resolution?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  supportConversationId?: number;
  sellerSupportConversationId?: number;
  raisedBy?: { username?: string };
  resolvedBy?: { username?: string };
  order?: OrderSub | null;
};

function Labeled({
  k,
  v,
}: {
  k: string;
  v: string;
}) {
  return (
    <div className="flex gap-2 text-[14px]">
      <span className="w-[128px] shrink-0 text-prel-secondary-label">{k}</span>
      <span className="min-w-0 break-words text-prel-label">{v}</span>
    </div>
  );
}

export default function IssuesPage() {
  const { data, loading, error, refetch } = useQuery(ALL_ORDER_ISSUES);
  const [resolveIssue] = useMutation(ADMIN_RESOLVE_ORDER_ISSUE);
  const rows: IssueRow[] = useMemo(
    () => (data?.allOrderIssues ?? []) as IssueRow[],
    [data]
  );

  const [open, setOpen] = useState<number | null>(null);
  const [chatIssue, setChatIssue] = useState<IssueRow | null>(null);
  const [actIssue, setActIssue] = useState<IssueRow | null>(null);
  const [actStatus, setActStatus] = useState("RESOLVED");
  const [actResolution, setActResolution] = useState("REFUND_WITHOUT_RETURN");
  const [actMsg, setActMsg] = useState<string | null>(null);
  const [actBusy, setActBusy] = useState(false);

  async function submitAction() {
    if (!actIssue) return;
    setActBusy(true);
    setActMsg(null);
    try {
      const resolution =
        actStatus === "RESOLVED" && actResolution
          ? actResolution
          : null;
      const { data: d } = await resolveIssue({
        variables: {
          issueId: actIssue.id,
          status: actStatus,
          resolution,
        },
      });
      const ok = d?.adminResolveOrderIssue?.success;
      setActMsg(
        d?.adminResolveOrderIssue?.message ??
          (ok ? "Saved." : "Update failed.")
      );
      if (ok) await refetch();
    } catch (e) {
      setActMsg(e instanceof Error ? e.message : "Request failed");
    } finally {
      setActBusy(false);
    }
  }

  function orderBlock(o: OrderSub | null | undefined) {
    if (!o) {
      return (
        <p className="text-[13px] text-prel-secondary-label">No order payload</p>
      );
    }
    return (
      <div className="mt-3 space-y-1 border-t border-prel-separator pt-3">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-prel-secondary-label">
          Order
        </p>
        {o.status != null && <Labeled k="Status" v={String(o.status)} />}
        {o.createdAt && <Labeled k="Placed" v={formatDateTime(o.createdAt)} />}
        {o.updatedAt && <Labeled k="Updated" v={formatDateTime(o.updatedAt)} />}
        <Labeled k="Buyer" v={o.user?.username ?? "-"} />
        <Labeled k="Seller" v={o.seller?.username ?? "-"} />
        {o.itemsSubtotal != null && (
          <Labeled k="Items subtotal" v={formatMoney(o.itemsSubtotal)} />
        )}
        {o.buyerProtectionFee != null && (
          <Labeled k="Protection fee" v={formatMoney(o.buyerProtectionFee)} />
        )}
        {o.shippingFee != null && (
          <Labeled k="Shipping" v={formatMoney(o.shippingFee)} />
        )}
        {o.priceTotal != null && (
          <Labeled k="Total" v={formatMoney(o.priceTotal)} />
        )}
        {o.orderConversationId != null && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Labeled k="Order chat id" v={String(o.orderConversationId)} />
            <Link
              href={staffPath(`/chat/${o.orderConversationId}`)}
              className="inline-flex items-center gap-1 rounded-lg bg-prel-primary/15 px-3 py-1.5 text-[13px] font-semibold text-prel-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Open buyer ↔ seller
            </Link>
          </div>
        )}
        {o.lineItems && o.lineItems.length > 0 && (
          <div className="pt-2">
            <p className="text-[12px] text-prel-secondary-label">Line items</p>
            {o.lineItems.map((li) => {
              const thumb = firstProductImageUrl(
                (li as { productImagesUrl?: unknown }).productImagesUrl,
              );
              return (
                <div
                  key={li.id}
                  className="mt-2 flex items-center gap-2 border-t border-prel-separator pt-2 first:mt-0 first:border-0 first:pt-0"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md ring-1 ring-prel-glass-border">
                    <SafeImage
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Labeled
                      k={li.productName ?? `#${li.productId ?? "?"}`}
                      v={formatMoney(li.priceAtPurchase ?? null)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {o.payments && o.payments.length > 0 && (
          <div className="pt-2">
            <p className="text-[12px] text-prel-secondary-label">Payments</p>
            {o.payments.map((p) => (
              <Labeled
                key={p.id}
                k={p.paymentRef ?? "-"}
                v={`${p.paymentStatus ?? ""} · ${formatMoney(p.paymentAmount ?? null)}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (loading && !data) {
    return <p className="text-prel-secondary-label">Loading issues…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-prel-secondary-label">
        Expand a row for evidence, order economics, and links to help threads and
        buyer–seller chat. Actions update case status via{" "}
        <code className="text-prel-primary">adminResolveOrderIssue</code>.
      </p>

      {rows.map((issue) => {
        const exp = open === issue.id;
        const imgs = normalizeProductImageUrls(issue.imagesUrl);
        return (
          <div key={issue.id} id={`issue-${issue.id}`}>
            <IOSCard>
            <button
              type="button"
              onClick={() => setOpen(exp ? null : issue.id)}
              className="flex w-full items-start gap-2 px-4 py-3 text-left"
            >
              {exp ? (
                <ChevronDown className="mt-0.5 h-5 w-5 text-prel-secondary-label" />
              ) : (
                <ChevronRight className="mt-0.5 h-5 w-5 text-prel-secondary-label" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-prel-label">
                  {issue.publicId ?? `Issue #${issue.id}`}
                </p>
                <p className="text-[13px] text-prel-secondary-label">
                  {issue.issueType ?? "-"} · Raised by{" "}
                  {issue.raisedBy?.username ?? "-"}
                </p>
              </div>
              {issue.order?.orderConversationId != null && (
                <Link
                  href={staffPath(`/chat/${issue.order.orderConversationId}`)}
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 rounded-lg p-2 text-prel-primary hover:bg-prel-primary/10"
                  aria-label="Order chat"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>
              )}
            </button>
            {exp && (
              <div className="space-y-3 border-t border-prel-separator px-4 py-4">
                <Labeled k="Status" v={issue.status ?? "-"} />
                {issue.resolution && (
                  <Labeled k="Resolution" v={issue.resolution} />
                )}
                {issue.resolvedBy?.username && (
                  <Labeled k="Resolved by" v={issue.resolvedBy.username} />
                )}
                {issue.resolvedAt && (
                  <Labeled k="Resolved at" v={formatDateTime(issue.resolvedAt)} />
                )}
                {issue.createdAt && (
                  <Labeled k="Created" v={formatDateTime(issue.createdAt)} />
                )}
                {orderBlock(issue.order ?? null)}
                <div>
                  <p className="text-[12px] text-prel-secondary-label">
                    Description
                  </p>
                  <p className="text-[15px] text-prel-label">
                    {issue.description ?? "-"}
                  </p>
                  {issue.otherIssueDescription ? (
                    <p className="mt-2 text-[14px] text-prel-secondary-label">
                      {issue.otherIssueDescription}
                    </p>
                  ) : null}
                </div>
                {imgs.length > 0 && (
                  <div>
                    <p className="mb-2 text-[12px] text-prel-secondary-label">
                      Images
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {imgs.map((url) => (
                        <a
                          key={url}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block h-20 w-20 overflow-hidden rounded-lg ring-1 ring-prel-glass-border"
                        >
                          <SafeImage
                            src={url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setChatIssue(issue)}
                    className="rounded-[10px] bg-prel-primary/15 px-4 py-2.5 text-[15px] font-semibold text-prel-primary"
                  >
                    Reply via chat
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActIssue(issue);
                      setActMsg(null);
                      setActStatus("RESOLVED");
                      setActResolution("REFUND_WITHOUT_RETURN");
                    }}
                    className="rounded-[10px] bg-prel-glass px-4 py-2.5 text-[15px] font-semibold text-prel-label ring-1 ring-prel-glass-border"
                  >
                    Take action
                  </button>
                </div>
              </div>
            )}
            </IOSCard>
          </div>
        );
      })}

      {chatIssue && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <GlassCard className="max-h-[85vh] w-full max-w-md overflow-y-auto shadow-xl">
            <p className="mb-3 text-[13px] text-prel-secondary-label">
              Help chat threads are WEARHOUSE support. Order chat is buyer ↔
              seller.
            </p>
            <div className="space-y-2">
              {chatIssue.supportConversationId != null &&
                chatIssue.order?.user?.username && (
                  <Link
                    href={staffPath(`/chat/${chatIssue.supportConversationId}`)}
                    className="block rounded-ios-lg bg-prel-card px-4 py-3 ring-1 ring-prel-separator"
                  >
                    <p className="font-semibold text-prel-label">
                      Help chat ({chatIssue.order.user.username})
                    </p>
                    <p className="text-[12px] text-prel-secondary-label">
                      #{chatIssue.supportConversationId}
                    </p>
                  </Link>
                )}
              {chatIssue.sellerSupportConversationId != null &&
                chatIssue.order?.seller?.username && (
                  <Link
                    href={staffPath(`/chat/${chatIssue.sellerSupportConversationId}`)}
                    className="block rounded-ios-lg bg-prel-card px-4 py-3 ring-1 ring-prel-separator"
                  >
                    <p className="font-semibold text-prel-label">
                      Help chat (seller {chatIssue.order.seller.username})
                    </p>
                    <p className="text-[12px] text-prel-secondary-label">
                      #{chatIssue.sellerSupportConversationId}
                    </p>
                  </Link>
                )}
              {chatIssue.order?.orderConversationId != null && (
                <Link
                  href={staffPath(`/chat/${chatIssue.order.orderConversationId}`)}
                  className="block rounded-ios-lg bg-prel-card px-4 py-3 ring-1 ring-prel-separator"
                >
                  <p className="font-semibold text-prel-label">
                    Order chat (buyer & seller)
                  </p>
                  <p className="text-[12px] text-prel-secondary-label">
                    #{chatIssue.order.orderConversationId}
                  </p>
                </Link>
              )}
            </div>
            <button
              type="button"
              className="mt-4 w-full rounded-[10px] bg-prel-glass py-2.5 text-[15px] font-semibold text-prel-label ring-1 ring-prel-glass-border"
              onClick={() => setChatIssue(null)}
            >
              Done
            </button>
          </GlassCard>
        </div>
      )}

      {actIssue && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <GlassCard className="w-full max-w-md shadow-xl">
            <p className="mb-3 text-[15px] font-semibold text-prel-label">
              Case #{actIssue.id}
            </p>
            <label className="mb-2 block text-[13px] text-prel-secondary-label">
              Status
            </label>
            <select
              className="mb-3 w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-2 text-prel-label"
              value={actStatus}
              onChange={(e) => setActStatus(e.target.value)}
            >
              <option value="RESOLVED">Resolved</option>
              <option value="DECLINED">Declined</option>
              <option value="PENDING">Reopen (pending)</option>
            </select>
            {actStatus === "RESOLVED" && (
              <>
                <label className="mb-2 block text-[13px] text-prel-secondary-label">
                  Resolution
                </label>
                <select
                  className="mb-3 w-full rounded-[10px] border border-prel-separator bg-prel-card px-3 py-2 text-prel-label"
                  value={actResolution}
                  onChange={(e) => setActResolution(e.target.value)}
                >
                  <option value="">None / note only</option>
                  <option value="REFUND_WITHOUT_RETURN">
                    Refund without return
                  </option>
                  <option value="REFUND_WITH_RETURN">Refund with return</option>
                </select>
              </>
            )}
            {actMsg && (
              <p className="mb-2 text-[13px] text-prel-secondary-label">
                {actMsg}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={actBusy}
                onClick={submitAction}
                className="prel-btn-primary flex-1 rounded-[10px] py-2.5 text-[15px] font-semibold disabled:opacity-40"
              >
                {actBusy ? "…" : "Apply"}
              </button>
              <button
                type="button"
                onClick={() => setActIssue(null)}
                className="rounded-[10px] bg-prel-glass px-4 py-2.5 text-[15px] font-semibold text-prel-label ring-1 ring-prel-glass-border"
              >
                Close
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
