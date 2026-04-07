"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { USER_FOLLOWERS } from "@/graphql/queries/social";
import { SafeImage } from "@/components/ui/SafeImage";
import { useAuth } from "@/contexts/AuthContext";

const PAGE = 40;

export default function ProfileFollowersPage() {
  const params = useParams();
  const router = useRouter();
  const rawUsername = decodeURIComponent(String(params.username ?? ""));
  const { userToken, ready } = useAuth();

  const { data, loading } = useQuery(USER_FOLLOWERS, {
    variables: { username: rawUsername, pageCount: PAGE, pageNumber: 1 },
    skip: !ready || !userToken || !rawUsername,
  });

  useEffect(() => {
    if (ready && !userToken) {
      router.replace(`/login?next=/profile/${encodeURIComponent(rawUsername)}/followers`);
    }
  }, [ready, userToken, router, rawUsername]);

  if (!ready || !userToken) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  type URow = {
    username?: string | null;
    displayName?: string | null;
    thumbnailUrl?: string | null;
    profilePictureUrl?: string | null;
  };
  const users = (data?.followers ?? []) as URow[];

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-28 md:max-w-xl md:pb-12">
      <Link
        href={`/profile/${encodeURIComponent(rawUsername)}`}
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← @{rawUsername}
      </Link>
      <h1 className="text-[22px] font-bold text-prel-label">Followers</h1>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-2xl bg-white shadow-ios" />
          ))}
        </div>
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
                className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border"
              >
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-prel-bg-grouped">
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
      {!loading && users.length === 0 ? (
        <p className="text-[14px] text-prel-secondary-label">No followers yet.</p>
      ) : null}
    </div>
  );
}
