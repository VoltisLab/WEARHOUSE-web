"use client";

import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { MARKETPLACE_SIZES } from "@/graphql/queries/marketplace";
import {
  type SellSizeOption,
  sortSizesForDisplay,
} from "@/lib/sell-size-path";

function normalizeSizeRows(raw: unknown[]): SellSizeOption[] {
  const out: SellSizeOption[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const o = row as Record<string, unknown>;
    const name = o.name != null ? String(o.name) : "";
    if (!name) continue;
    let id: number = NaN;
    if (typeof o.id === "number" && Number.isFinite(o.id)) {
      id = Math.trunc(o.id);
    } else if (typeof o.id === "string" && o.id.trim() !== "") {
      id = parseInt(o.id, 10);
    }
    if (!Number.isFinite(id)) continue;
    out.push({ id, name });
  }
  return out;
}

type Props = {
  /** From `computeSizeApiPath` when a leaf category is selected; null otherwise. */
  sizeApiPath: string | null;
  sizeId: string;
  onSizeIdChange: (id: string) => void;
};

export function SellSizePicker({
  sizeApiPath,
  sizeId,
  onSizeIdChange,
}: Props) {
  const path = (sizeApiPath ?? "").trim();
  const skip = path.length === 0;

  const { data, loading, error, refetch } = useQuery(MARKETPLACE_SIZES, {
    variables: { path },
    skip,
    fetchPolicy: "network-only",
  });

  const options = useMemo(() => {
    const rows = normalizeSizeRows((data?.sizes ?? []) as unknown[]);
    return sortSizesForDisplay(rows);
  }, [data?.sizes]);

  const displayName = (name: string) => name.replace(/_/g, " ");

  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
        Size
      </label>
      {skip ? (
        <p className="rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[14px] text-prel-secondary-label">
          Select a category first to see sizes.
        </p>
      ) : loading && options.length === 0 ? (
        <div className="space-y-2 rounded-xl border border-prel-separator bg-prel-bg-grouped p-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 animate-pulse rounded-lg bg-white/80"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-prel-separator bg-prel-error/10 px-3 py-2.5">
          <p className="text-[13px] text-prel-error">{error.message}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 text-[13px] font-semibold text-[var(--prel-primary)]"
          >
            Retry
          </button>
        </div>
      ) : (
        <select
          value={sizeId}
          onChange={(e) => onSizeIdChange(e.target.value)}
          className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          aria-label="Item size"
        >
          <option value="">Optional - choose a size</option>
          {options.map((s) => (
            <option key={s.id} value={String(s.id)}>
              {displayName(s.name)}
            </option>
          ))}
        </select>
      )}
      {!skip && !loading && !error && options.length === 0 ? (
        <p className="mt-1.5 text-[12px] text-prel-tertiary-label">
          No sizes returned for this category path. You can leave size blank.
        </p>
      ) : null}
    </div>
  );
}
