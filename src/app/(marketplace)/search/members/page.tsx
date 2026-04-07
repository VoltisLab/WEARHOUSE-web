"use client";

import { useLazyQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SEARCH_USERS } from "@/graphql/queries/marketplace";
import { SafeImage } from "@/components/ui/SafeImage";
import { useAuth } from "@/contexts/AuthContext";

export default function SearchMembersPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const [q, setQ] = useState("");
  const [searchUsers, { data, loading, error }] = useLazyQuery(SEARCH_USERS);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login?next=/search/members");
  }, [ready, userToken, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const s = q.trim();
    if (s.length < 2 || !userToken) return;
    searchUsers({ variables: { search: s } });
  }

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  type URow = {
    username?: string | null;
    displayName?: string | null;
    thumbnailUrl?: string | null;
    profilePictureUrl?: string | null;
    isVerified?: boolean | null;
  };
  const users = (data?.searchUsers ?? []) as URow[];

  return (
    <div className="mx-auto max-w-lg space-y-5 pb-28 md:max-w-xl md:pb-12">
      <Link
        href="/search"
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← Discover
      </Link>
      <div>
        <h1 className="text-[24px] font-bold text-prel-label">Search members</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Find people by username (signed-in only).
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Username…"
          className="min-h-[48px] w-full rounded-[1.25rem] border border-prel-separator bg-prel-bg-grouped px-4 text-[16px] text-prel-label shadow-ios outline-none placeholder:text-prel-tertiary-label focus:border-[var(--prel-primary)]"
          autoCapitalize="none"
          autoCorrect="off"
        />
        <button
          type="submit"
          disabled={loading || q.trim().length < 2}
          className="min-h-[48px] w-full rounded-full bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios disabled:opacity-50"
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>
      {error ? (
        <p className="text-[14px] text-prel-error">{error.message}</p>
      ) : null}
      <ul className="space-y-2">
        {users.map((u) => {
          const un = u?.username;
          if (!un) return null;
          const thumb =
            u?.profilePictureUrl?.trim() || u?.thumbnailUrl?.trim() || "";
          return (
            <li key={un}>
              <Link
                href={`/profile/${encodeURIComponent(un)}`}
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border transition hover:ring-[var(--prel-primary)]/35"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-prel-bg-grouped ring-1 ring-prel-separator">
                  <SafeImage src={thumb} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-[16px] font-semibold text-prel-label">
                    {u?.displayName?.trim() || `@${un}`}
                  </p>
                  <p className="text-[14px] text-[var(--prel-primary)]">@{un}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {data && users.length === 0 && !loading ? (
        <p className="text-[14px] text-prel-secondary-label">No members match that search.</p>
      ) : null}
    </div>
  );
}
