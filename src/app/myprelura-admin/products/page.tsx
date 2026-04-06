"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ALL_PRODUCTS, USER_SHOP_PRODUCTS } from "@/graphql/queries/admin";
import { IOSCard } from "@/components/ui/IOSCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatMoney } from "@/lib/format";
import { firstProductImageUrl } from "@/lib/product-images";
import { staffPath } from "@/lib/staff-nav";

function ProductsListPage() {
  const searchParams = useSearchParams();
  const userFilter = searchParams.get("user")?.trim() ?? "";

  const [status, setStatus] = useState<"ACTIVE" | "SOLD" | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data: allData, loading: allLoad } = useQuery(ALL_PRODUCTS, {
    variables: {
      pageCount: pageSize,
      pageNumber: page,
      filters: status === "SOLD" ? { status: "SOLD" } : null,
    },
    skip: !!userFilter,
  });

  const { data: userData, loading: userLoad } = useQuery(USER_SHOP_PRODUCTS, {
    variables: {
      username: userFilter,
      pageCount: pageSize,
      pageNumber: page,
    },
    skip: !userFilter,
  });

  const rows = userFilter
    ? (userData?.userProducts ?? [])
    : (allData?.allProducts ?? []);
  const loading = userFilter ? userLoad : allLoad;

  const hasMore = rows.length >= pageSize;

  const title = userFilter ? `@${userFilter} listings` : "Marketplace listings";

  return (
    <div className="space-y-4">
      <p className="text-[13px] text-prel-secondary-label">{title}</p>

      {!userFilter && (
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: null, label: "Active (default)" },
              { id: "SOLD" as const, label: "Sold" },
            ] as { id: "SOLD" | null; label: string }[]
          ).map((c) => (
            <button
              key={String(c.id)}
              type="button"
              onClick={() => {
                setStatus(c.id);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ring-1 transition-colors ${
                status === c.id
                  ? "prel-chip-active text-prel-label"
                  : "bg-prel-glass text-prel-label ring-prel-glass-border"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {loading && <p className="text-prel-secondary-label">Loading…</p>}

      <IOSCard className="divide-y divide-prel-separator">
        {(rows as Record<string, unknown>[]).map((p) => {
          const id = p.id as number;
          const urls = p.imagesUrl;
          return (
            <Link
              key={id}
              href={staffPath(`/products/${id}`)}
              className="flex gap-3 px-4 py-3 transition-colors hover:bg-prel-glass/40"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-prel-glass-border">
                <SafeImage
                  src={firstProductImageUrl(urls)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-prel-label">
                  {String(p.name ?? `Product ${id}`)}
                </p>
                <p className="text-[13px] text-prel-secondary-label">
                  @{(p.seller as { username?: string } | null)?.username ?? "—"}{" "}
                  · {String(p.status ?? "")} · {formatMoney(p.price as number)}
                </p>
              </div>
            </Link>
          );
        })}
      </IOSCard>

      {!userFilter && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg bg-prel-glass px-4 py-2 text-[14px] font-semibold ring-1 ring-prel-glass-border disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg bg-prel-glass px-4 py-2 text-[14px] font-semibold ring-1 ring-prel-glass-border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={<p className="text-prel-secondary-label">Loading…</p>}
    >
      <ProductsListPage />
    </Suspense>
  );
}
