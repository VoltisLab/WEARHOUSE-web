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

const MAX_LEVELS = 10;

function queriesNeeded(path: CategoryRow[]): number {
  if (path.length === 0) return 1;
  const tail = path[path.length - 1];
  const n = path.length + (tail?.hasChildren ? 1 : 0);
  return Math.min(MAX_LEVELS, n);
}

function levelVariables(
  path: CategoryRow[],
  levelIndex: number,
): Record<string, never> | { parentId: number } {
  if (levelIndex === 0) return {};
  const parent = path[levelIndex - 1];
  // Apollo still evaluates `variables` when `skip: true` — avoid reading parent.id
  // when this level is inactive (e.g. empty path on first paint).
  if (!parent) return {};
  return { parentId: parent.id };
}

function levelSkip(path: CategoryRow[], levelIndex: number): boolean {
  return levelIndex >= queriesNeeded(path);
}

/**
 * Multi-level category picker: each row loads `categories(parentId: …)` so deep
 * trees match the native app.
 */
export function CategoryCascadePicker({
  categoryId,
  onCategoryIdChange,
}: Props) {
  const [path, setPath] = useState<CategoryRow[]>([]);

  const q0 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 0),
    skip: levelSkip(path, 0),
  });
  const q1 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 1),
    skip: levelSkip(path, 1),
  });
  const q2 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 2),
    skip: levelSkip(path, 2),
  });
  const q3 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 3),
    skip: levelSkip(path, 3),
  });
  const q4 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 4),
    skip: levelSkip(path, 4),
  });
  const q5 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 5),
    skip: levelSkip(path, 5),
  });
  const q6 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 6),
    skip: levelSkip(path, 6),
  });
  const q7 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 7),
    skip: levelSkip(path, 7),
  });
  const q8 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 8),
    skip: levelSkip(path, 8),
  });
  const q9 = useQuery(MARKETPLACE_CATEGORIES, {
    variables: levelVariables(path, 9),
    skip: levelSkip(path, 9),
  });

  const results = useMemo(
    () => [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9],
    [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9],
  );

  const qc = queriesNeeded(path);

  const onSelectLevel = useCallback(
    (level: number, raw: string) => {
      const id = parseInt(raw, 10);
      if (Number.isNaN(id)) {
        setPath((prev) => prev.slice(0, level));
        onCategoryIdChange("");
        return;
      }
      const res = results[level];
      const opts = (res?.data?.categories ?? []) as CategoryRow[];
      const row = opts.find((c) => c.id === id);
      if (!row) return;
      setPath((prev) => prev.slice(0, level).concat([row]));
      if (!row.hasChildren) onCategoryIdChange(String(row.id));
      else onCategoryIdChange("");
    },
    [results, onCategoryIdChange],
  );

  const tail = path[path.length - 1];
  const leafSummary = tail && !tail.hasChildren ? tail : null;

  return (
    <div className="space-y-3">
      {Array.from({ length: qc }, (_, level) => {
        const res = results[level];
        const loading = res?.loading;
        const opts = (res?.data?.categories ?? []) as CategoryRow[];
        const selectedId = path[level]?.id;

        return (
          <div key={level}>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              {level === 0 ? "Department" : `Subcategory ${level}`}
            </label>
            <select
              value={selectedId ?? ""}
              onChange={(e) => onSelectLevel(level, e.target.value)}
              className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
            >
              <option value="">
                {loading ? "Loading…" : "— Choose —"}
              </option>
              {opts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                  {c.hasChildren ? " ›" : ""}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      {path.length >= MAX_LEVELS ? (
        <p className="text-[12px] text-prel-error">
          Maximum {MAX_LEVELS} levels in this form — use the numeric id override
          if your category is deeper.
        </p>
      ) : null}

      {leafSummary ? (
        <p className="rounded-lg bg-prel-bg-grouped px-3 py-2 text-[13px] text-prel-secondary-label ring-1 ring-prel-glass-border">
          <span className="font-semibold text-prel-label">Selected: </span>
          {leafSummary.fullPath?.trim() || leafSummary.name} (id{" "}
          {leafSummary.id})
        </p>
      ) : (
        <p className="text-[12px] text-prel-tertiary-label">
          Choose subcategories until you reach a leaf (no ›). You can also
          enter a known leaf id below.
        </p>
      )}

      <div>
        <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
          Category id (optional override)
        </label>
        <input
          value={categoryId}
          onChange={(e) => onCategoryIdChange(e.target.value)}
          inputMode="numeric"
          placeholder="Leaf category id"
          className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
        />
      </div>
    </div>
  );
}
