"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { searchHelpCentre } from "@/lib/help-centre-search";

export function HelpCentreSearch() {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const trimmed = query.trim();
  const results = useMemo(
    () => searchHelpCentre(trimmed, 12),
    [trimmed],
  );

  const active = trimmed.length >= 2;
  const showHits = active && results.length > 0;
  const showMiss = active && results.length === 0;

  return (
    <div className="mb-5">
      <label htmlFor={inputId} className="sr-only">
        Search Help Centre
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-prel-tertiary-label"
          strokeWidth={2}
          aria-hidden
        />
        <input
          id={inputId}
          type="search"
          name="help-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search help…"
          autoComplete="off"
          spellCheck={false}
          className="min-h-[44px] w-full rounded-xl bg-prel-bg-grouped py-2.5 pr-3 pl-10 text-[15px] text-prel-label outline-none ring-0 placeholder:text-prel-tertiary-label focus:bg-white"
        />
      </div>

      {showHits ? (
        <ul
          className="mt-2 max-h-[min(22rem,50vh)] space-y-0.5 overflow-y-auto rounded-xl bg-white py-1"
          role="listbox"
          aria-label="Search results"
        >
          {results.map((r) => (
            <li key={r.href} role="option">
              <Link
                href={r.href}
                onClick={() => setQuery("")}
                className="block px-3 py-2.5 transition hover:bg-prel-bg-grouped"
              >
                <span className="block text-[14px] font-semibold text-prel-label">
                  {r.title}
                </span>
                <span className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-prel-secondary-label">
                  {r.snippet}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {showMiss ? (
        <p className="mt-2 px-1 text-[13px] text-prel-secondary-label">
          No results for &quot;{trimmed}&quot;. Try different words or browse
          topics below.
        </p>
      ) : null}
    </div>
  );
}
