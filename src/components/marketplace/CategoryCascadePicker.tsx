"use client";

import { useQuery } from "@apollo/client";
import { useCallback, useMemo, useState } from "react";
import { MARKETPLACE_CATEGORIES } from "@/graphql/queries/marketplace";

export type CategoryRow = {
  id: number;
  name: string;
  hasChildren: boolean;
  fullPath?: string | null;
};

type Props = {
  categoryId: string;
  onCategoryIdChange: (id: string) => void;
};

function needsDeeperLevel(row: CategoryRow): boolean {
  return row.hasChildren === true;
}

/**
 * One dropdown at a time: roots first, then children of the last pick.
 * Single GraphQL query (no parallel `useQuery` clashes). Breadcrumb + Back.
 */
export function CategoryCascadePicker({
  categoryId,
  onCategoryIdChange,
}: Props) {
  const [path, setPath] = useState<CategoryRow[]>([]);

  const leafChosen =
    path.length > 0 && !needsDeeperLevel(path[path.length - 1]);

  const variables = useMemo(() => {
    if (path.length === 0) return {} as Record<string, never>;
    return { parentId: path[path.length - 1].id };
  }, [path]);

  const { data, loading, error } = useQuery(MARKETPLACE_CATEGORIES, {
    variables,
    skip: leafChosen,
    fetchPolicy: "cache-and-network",
  });

  const opts = (data?.categories ?? []) as CategoryRow[];

  const selectKey = useMemo(
    () => path.map((p) => p.id).join("-") || "root",
    [path],
  );

  const onPickNext = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const raw = e.target.value;
      if (!raw) return;
      const id = parseInt(raw, 10);
      if (Number.isNaN(id)) return;
      const row = opts.find((c) => c.id === id);
      if (!row) return;

      setPath((prev) => [...prev, row]);
      if (needsDeeperLevel(row)) {
        onCategoryIdChange("");
      } else {
        onCategoryIdChange(String(row.id));
      }
    },
    [opts, onCategoryIdChange],
  );

  const onBack = useCallback(() => {
    setPath((prev) => prev.slice(0, -1));
    onCategoryIdChange("");
  }, [onCategoryIdChange]);

  const tail = path[path.length - 1];
  const leafSummary =
    tail && !needsDeeperLevel(tail) ? tail : null;

  const stepLabel =
    path.length === 0
      ? "Department"
      : needsDeeperLevel(path[path.length - 1])
        ? "Next subcategory"
        : "Category";

  return (
    <div className="space-y-3">
      {path.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-prel-bg-grouped px-3 py-2 ring-1 ring-prel-glass-border">
          <p className="min-w-0 flex-1 text-[13px] text-prel-secondary-label">
            <span className="font-semibold text-prel-label">Path: </span>
            {path.map((p) => p.name).join(" › ")}
          </p>
          <button
            type="button"
            onClick={onBack}
            className="shrink-0 rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-prel-label shadow-sm ring-1 ring-prel-separator transition hover:bg-prel-bg-grouped"
          >
            Back
          </button>
        </div>
      ) : null}

      {!leafChosen ? (
        <div>
          <label
            htmlFor="sell-category-step"
            className="mb-1 block text-[13px] font-medium text-prel-secondary-label"
          >
            {stepLabel}
          </label>
          <select
            id="sell-category-step"
            key={selectKey}
            defaultValue=""
            disabled={loading && opts.length === 0}
            onChange={onPickNext}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px] disabled:opacity-60"
          >
            <option value="">
              {loading && opts.length === 0 ? "Loading…" : "— Choose —"}
            </option>
            {opts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
                {needsDeeperLevel(c) ? " ›" : ""}
              </option>
            ))}
          </select>
          {error ? (
            <p className="mt-1 text-[12px] text-prel-error">{error.message}</p>
          ) : null}
        </div>
      ) : null}

      {leafSummary ? (
        <p className="rounded-lg bg-prel-bg-grouped px-3 py-2 text-[13px] text-prel-secondary-label ring-1 ring-prel-glass-border">
          <span className="font-semibold text-prel-label">Selected: </span>
          {leafSummary.fullPath?.trim() || leafSummary.name} (id{" "}
          {leafSummary.id})
        </p>
      ) : !leafChosen ? (
        <p className="text-[12px] text-prel-tertiary-label">
          Pick a category. If it shows ›, choose again until you reach a leaf.
        </p>
      ) : null}

      <div>
        <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
          Category id (optional override)
        </label>
        <input
          value={categoryId}
          onChange={(e) => onCategoryIdChange(e.target.value)}
          inputMode="numeric"
          placeholder="Or type a leaf category id"
          className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
        />
      </div>
    </div>
  );
}
