"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArrowLeft, Package } from "lucide-react";
import { USER_ORDERS } from "@/graphql/queries/marketplace";
import { VIEW_ME } from "@/graphql/queries/admin";
import { useAuth } from "@/contexts/AuthContext";
import { formatMoney, formatDateTime } from "@/lib/format";
import { SafeImage } from "@/components/ui/SafeImage";
import { firstProductImageUrl } from "@/lib/product-images";

const PAGE_SIZE = 20;

type UserOrderListItem = {
  id: number;
  publicId?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  priceTotal?: number | null;
  user?: { username?: string | null } | null;
  seller?: { username?: string | null; displayName?: string | null } | null;
  lineItems?: {
    productName?: string | null;
    productImagesUrl?: unknown;
  }[];
};

type OrderRowVM = {
  o: UserOrderListItem;
  isBuyer: boolean;
  label: string;
  otherName: string;
  thumb: string | undefined;
};

export default function AccountOrdersPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();

  const { data: meData } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
  });
  const username = meData?.viewMe?.username ?? "";

  const { data, loading, error } = useQuery(USER_ORDERS, {
    skip: !ready || !userToken,
    variables: { pageCount: PAGE_SIZE, pageNumber: 1 },
  });

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/account/orders");
  }, [ready, userToken, router]);

  const orders = (data?.userOrders ?? []) as UserOrderListItem[];
  const total = data?.userOrdersTotalNumber ?? orders.length;

  const rows: OrderRowVM[] = useMemo(() => {
    return orders.map((o) => {
      const isBuyer = o.user?.username === username;
      const label = isBuyer ? "Bought from" : "Sold to";
      const otherName = isBuyer
        ? o.seller?.displayName?.trim() ||
          (o.seller?.username ? `@${o.seller.username}` : "-")
        : o.user?.username
          ? `@${o.user.username}`
          : "-";
      const thumb = firstProductImageUrl(
        o.lineItems?.[0]?.productImagesUrl ?? null,
      );
      return { o, isBuyer, label, otherName, thumb };
    });
  }, [orders, username]);

  if (!ready || !userToken) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/profile"
        className="inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-[var(--prel-primary)] [-webkit-tap-highlight-color:transparent]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Profile
      </Link>

      <div>
        <h1 className="text-[26px] font-bold text-prel-label">Orders</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          {total > 0
            ? `${total} order${total === 1 ? "" : "s"}`
            : "Your purchases and sales"}
        </p>
      </div>

      {error ? (
        <p className="rounded-xl bg-prel-error/10 p-4 text-[14px] text-prel-error">
          {error.message}
        </p>
      ) : null}

      {loading && !orders.length ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border"
            />
          ))}
        </div>
      ) : null}

      {!loading && !orders.length ? (
        <div className="rounded-2xl bg-white p-8 text-center shadow-ios ring-1 ring-prel-glass-border">
          <Package
            className="mx-auto h-12 w-12 text-prel-tertiary-label"
            strokeWidth={1.25}
          />
          <p className="mt-3 text-[16px] font-semibold text-prel-label">
            No orders yet
          </p>
          <p className="mt-1 text-[14px] text-prel-secondary-label">
            When you buy or sell, your orders show up here.
          </p>
          <Link
            href="/search"
            className="mt-5 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
          >
            Browse listings
          </Link>
        </div>
      ) : null}

      <ul className="space-y-3">
        {rows.map(({ o, label, otherName, thumb }) => (
          <li key={o.id}>
            <Link
              href={`/account/orders/${o.id}`}
              className="block overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border transition hover:ring-[var(--prel-primary)]/35"
            >
              <div className="flex gap-3 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-prel-bg-grouped">
                  <SafeImage
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold uppercase tracking-wide text-prel-secondary-label">
                    {o.publicId || `Order #${o.id}`}
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold text-prel-label">
                    {formatMoney(o.priceTotal)}
                  </p>
                  <p className="mt-1 text-[13px] text-prel-secondary-label">
                    {label} {otherName}
                  </p>
                  <p className="mt-1 text-[12px] text-prel-tertiary-label">
                    {o.createdAt ? formatDateTime(o.createdAt) : ""} ·{" "}
                    <span className="font-medium text-prel-secondary-label">
                      {String(o.status ?? "").replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
