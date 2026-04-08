"use client";

import { useQuery, useMutation } from "@apollo/client";
import Link from "next/link";
import { ADMIN_ALL_ORDERS } from "@/graphql/queries/admin";
import { ADMIN_MARK_ORDER_DELIVERED } from "@/graphql/mutations/admin";
import { IOSCard } from "@/components/ui/IOSCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import { firstProductImageUrl } from "@/lib/product-images";
import { staffPath } from "@/lib/staff-nav";

export default function OrdersPage() {
  const { data, loading, error, refetch } = useQuery(ADMIN_ALL_ORDERS, {
    variables: { pageCount: 50, pageNumber: 1 },
  });
  const [markDelivered] = useMutation(ADMIN_MARK_ORDER_DELIVERED);

  const rows = data?.adminAllOrders ?? [];
  const total = data?.adminAllOrdersTotalNumber;

  async function onMarkDelivered(orderId: number) {
    if (!confirm(`Mark order ${orderId} delivered?`)) return;
    await markDelivered({ variables: { orderId } });
    await refetch();
  }

  if (loading) {
    return <p className="text-prel-secondary-label">Loading orders…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }

  return (
    <div className="space-y-3">
      {total != null && (
        <p className="text-[13px] text-prel-secondary-label">
          Total orders (site):{" "}
          <span className="font-semibold text-prel-label">{total}</span>
        </p>
      )}
      <IOSCard className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-[15px]">
          <thead className="border-b border-prel-separator bg-prel-glass/50 text-[13px] font-semibold uppercase tracking-wide text-prel-secondary-label">
            <tr>
              <th className="px-4 py-3"> </th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Buyer</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3"> </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o: Record<string, unknown>) => {
              const lineItems = (o.lineItems ?? []) as Array<{
                productImagesUrl?: unknown;
                productId?: number;
              }>;
              const firstLi = lineItems[0];
              const thumb = firstProductImageUrl(firstLi?.productImagesUrl);
              return (
              <tr
                key={String(o.id)}
                className="border-b border-prel-separator last:border-0"
              >
                <td className="px-4 py-2">
                  <div className="h-11 w-11 overflow-hidden rounded-lg ring-1 ring-prel-glass-border">
                    <SafeImage
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-[13px]">
                  <Link
                    href={staffPath(`/orders/${String(o.id)}`)}
                    className="font-semibold text-prel-primary underline-offset-2 hover:underline"
                  >
                    {String(o.id)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {(o.user as { username?: string } | null)?.username ?? "-"}
                </td>
                <td className="px-4 py-3">
                  {(o.seller as { username?: string } | null)?.username ?? "-"}
                </td>
                <td className="px-4 py-3">{String(o.status ?? "-")}</td>
                <td className="px-4 py-3">
                  {formatMoney(o.priceTotal as number | string | null)}
                </td>
                <td className="px-4 py-3 text-[13px] text-prel-secondary-label">
                  {String(o.createdAt ?? "-")}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="prel-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-semibold"
                    onClick={() => onMarkDelivered(Number(o.id))}
                  >
                    Delivered
                  </button>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </IOSCard>
    </div>
  );
}
