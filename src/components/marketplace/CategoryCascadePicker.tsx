"use client";

import { useQuery } from "@apollo/client";
import { ChevronRight, FolderOpen, Search, Check } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MARKETPLACE_CATEGORIES } from "@/graphql/queries/marketplace";
import { computeSizeApiPath } from "@/lib/sell-size-path";

export type CategoryRow = {
  id: number;
  name: string;
  hasChildren: boolean;
  fullPath?: string | null;
};

type Props = {
  categoryId: string;
  onCategoryIdChange: (id: string) => void;
  /** When a leaf category is selected, the path passed to GraphQL `sizes(path)` (Swift `sizeApiPath`). */
  onSizeApiPathChange?: (path: string | null) => void;
};

function needsDeeperLevel(row: CategoryRow): boolean {
  return row.hasChildren === true;
}

/**
 * API exposes `CategoryTypes.id` as GraphQL `ID` (JSON string). `categories(parentId)`
 * expects `Int` - passing a string makes the server return HTTP 400 (variable coercion).
 */
function normalizeCategoryId(raw: unknown): number {
  if (typeof raw === "number" && Number.isFinite(raw)) return Math.trunc(raw);
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : NaN;
  }
  return NaN;
}

function normalizeCategoryRows(raw: unknown[]): CategoryRow[] {
  const out: CategoryRow[] = [];
  for (const c of raw) {
    if (!c || typeof c !== "object") continue;
    const o = c as Record<string, unknown>;
    const id = normalizeCategoryId(o.id);
    if (!Number.isFinite(id)) continue;
    const name = o.name != null ? String(o.name) : "";
    out.push({
      id,
      name,
      hasChildren: o.hasChildren === true,
      fullPath:
        o.fullPath == null || o.fullPath === ""
          ? null
          : String(o.fullPath),
    });
  }
  return out;
}

/**
 * Drill-down category browser (no &lt;select&gt;): breadcrumbs + scrollable row list.
 * Loads one level at a time via `categories(parentId)` so arbitrarily deep trees work.
 */
export function CategoryCascadePicker({
  categoryId,
  onCategoryIdChange,
  onSizeApiPathChange,
}: Props) {
  const [path, setPath] = useState<CategoryRow[]>([]);
  const [filter, setFilter] = useState("");

  const tail = path.length > 0 ? path[path.length - 1] : null;
  /** Path ends on a selectable leaf - stop fetching and show summary instead of the list. */
  const pathEndsOnLeaf =
    tail != null && !needsDeeperLevel(tail);

  const parentIdForQuery = useMemo((): number | null => {
    if (path.length === 0) return null;
    const last = path[path.length - 1];
    if (!needsDeeperLevel(last)) return null;
    const id = normalizeCategoryId(last.id);
    return Number.isFinite(id) ? id : null;
  }, [path]);

  const shouldSkipQuery = pathEndsOnLeaf;
  const invalidParentId =
    path.length > 0 &&
    needsDeeperLevel(path[path.length - 1]!) &&
    parentIdForQuery === null;

  const { data, loading, error, refetch } = useQuery(MARKETPLACE_CATEGORIES, {
    variables: { parentId: parentIdForQuery },
    skip: shouldSkipQuery || invalidParentId,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const rawOpts = useMemo(
    () => normalizeCategoryRows((data?.categories ?? []) as unknown[]),
    [data?.categories],
  );

  const filterQ = filter.trim().toLowerCase();
  const opts = useMemo(() => {
    if (!filterQ) return rawOpts;
    return rawOpts.filter((c) => c.name.toLowerCase().includes(filterQ));
  }, [rawOpts, filterQ]);

  useEffect(() => {
    setFilter("");
  }, [parentIdForQuery]);

  const goToCrumb = useCallback(
    (index: number | null) => {
      if (index === null) {
        setPath([]);
        onCategoryIdChange("");
        return;
      }
      const next = path.slice(0, index + 1);
      setPath(next);
      const t = next[next.length - 1];
      if (t && !needsDeeperLevel(t)) {
        onCategoryIdChange(String(t.id));
      } else {
        onCategoryIdChange("");
      }
    },
    [path, onCategoryIdChange],
  );

  const onPickRow = useCallback(
    (row: CategoryRow) => {
      if (needsDeeperLevel(row)) {
        setPath((prev) => [...prev, row]);
        onCategoryIdChange("");
        return;
      }
      setPath((prev) => [...prev, row]);
      onCategoryIdChange(String(row.id));
    },
    [onCategoryIdChange],
  );

  const displayLeaf = pathEndsOnLeaf ? tail : null;

  useEffect(() => {
    if (!onSizeApiPathChange) return;
    const last = path.length > 0 ? path[path.length - 1] : null;
    const isLeaf = last != null && !needsDeeperLevel(last);
    if (!isLeaf || !last) {
      onSizeApiPathChange(null);
      return;
    }
    onSizeApiPathChange(
      computeSizeApiPath(last.fullPath, path.map((p) => p.name)),
    );
  }, [path, onSizeApiPathChange]);

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-[13px] font-semibold text-prel-label">
          Category
        </p>
        <p className="mb-3 text-[12px] leading-relaxed text-prel-secondary-label">
          Tap a folder to open subcategories. When you reach the final type, tap
          it once to select - your path stays visible above the list.
        </p>
      </div>

      {/* Breadcrumb strip */}
      <nav
        className="flex flex-wrap items-center gap-1 rounded-xl bg-prel-bg-grouped px-2 py-2 ring-1 ring-prel-glass-border"
        aria-label="Category path"
      >
        <button
          type="button"
          onClick={() => goToCrumb(null)}
          className={`rounded-lg px-2.5 py-1 text-[12px] font-semibold transition ${
            path.length === 0
              ? "bg-[var(--prel-primary)]/15 text-[var(--prel-primary)]"
              : "text-prel-secondary-label hover:bg-white/80"
          }`}
        >
          All categories
        </button>
        {path.map((p, i) => (
          <span key={`${p.id}-${i}`} className="flex items-center gap-1">
            <ChevronRight
              className="h-3.5 w-3.5 shrink-0 text-prel-tertiary-label"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => goToCrumb(i)}
              className={`max-w-[140px] truncate rounded-lg px-2.5 py-1 text-left text-[12px] font-semibold transition sm:max-w-[200px] ${
                i === path.length - 1
                  ? "bg-[var(--prel-primary)]/15 text-[var(--prel-primary)]"
                  : "text-prel-label hover:bg-white/80"
              }`}
            >
              {p.name}
            </button>
          </span>
        ))}
      </nav>

      {/* Level panel */}
      {!shouldSkipQuery ? (
        <div className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border">
          {invalidParentId ? (
            <div className="p-4">
              <p className="text-[13px] text-prel-error">
                Could not read this category&apos;s id from the server. Go back and try
                again.
              </p>
              <button
                type="button"
                onClick={() => goToCrumb(null)}
                className="mt-2 text-[13px] font-semibold text-[var(--prel-primary)]"
              >
                Start over
              </button>
            </div>
          ) : (
            <>
          <div className="border-b border-prel-separator bg-prel-bg-grouped/60 px-3 py-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-prel-tertiary-label"
                aria-hidden
              />
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter this level…"
                className="w-full rounded-xl border border-prel-separator bg-white py-2.5 pl-9 pr-3 text-[14px] text-prel-label outline-none focus:border-[var(--prel-primary)]/40 focus:ring-2 focus:ring-[var(--prel-primary)]/20"
                aria-label="Filter categories at this level"
              />
            </div>
          </div>

          <div className="max-h-[min(320px,50vh)] overflow-y-auto overscroll-contain">
            {loading && rawOpts.length === 0 ? (
              <div className="space-y-2 p-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded-xl bg-prel-bg-grouped"
                  />
                ))}
              </div>
            ) : null}

            {error ? (
              <div className="p-4">
                <p className="text-[13px] text-prel-error">{error.message}</p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="mt-2 text-[13px] font-semibold text-[var(--prel-primary)]"
                >
                  Retry
                </button>
              </div>
            ) : null}

            {!loading && !error && opts.length === 0 ? (
              <p className="p-4 text-[14px] text-prel-secondary-label">
                {filterQ
                  ? "No names match your filter."
                  : "No categories at this level."}
              </p>
            ) : null}

            <ul className="divide-y divide-prel-separator p-1">
              {opts.map((c) => {
                const deeper = needsDeeperLevel(c);
                const isSelectedLeaf =
                  !deeper && categoryId === String(c.id);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onPickRow(c)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition [-webkit-tap-highlight-color:transparent] ${
                        isSelectedLeaf
                          ? "bg-[var(--prel-primary)]/12 ring-1 ring-[var(--prel-primary)]/25"
                          : "hover:bg-prel-bg-grouped active:bg-prel-bg-grouped"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          deeper
                            ? "bg-[var(--prel-primary)]/10 text-[var(--prel-primary)]"
                            : "bg-prel-bg-grouped text-prel-secondary-label"
                        }`}
                        aria-hidden
                      >
                        {deeper ? (
                          <FolderOpen className="h-5 w-5" strokeWidth={2} />
                        ) : isSelectedLeaf ? (
                          <Check className="h-5 w-5 text-[var(--prel-primary)]" strokeWidth={2.5} />
                        ) : (
                          <span className="text-[11px] font-bold">#</span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-semibold text-prel-label">
                          {c.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-prel-tertiary-label">
                          {deeper
                            ? "Open subcategories"
                            : "Final category - tap to select"}
                        </span>
                      </span>
                      {deeper ? (
                        <ChevronRight
                          className="h-5 w-5 shrink-0 text-prel-tertiary-label"
                          aria-hidden
                        />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
            </>
          )}
        </div>
      ) : displayLeaf ? (
        <div className="rounded-xl bg-prel-bg-grouped px-3 py-3 ring-1 ring-prel-glass-border">
          <p className="text-[13px] text-prel-secondary-label">
            <span className="font-semibold text-prel-label">Selected: </span>
            {displayLeaf.fullPath?.trim() ||
              path.map((p) => p.name).join(" › ")}
          </p>
          <button
            type="button"
            onClick={() => {
              setPath([]);
              onCategoryIdChange("");
            }}
            className="mt-2 text-[13px] font-semibold text-[var(--prel-primary)]"
          >
            Choose a different category
          </button>
        </div>
      ) : null}
    </div>
  );
}
