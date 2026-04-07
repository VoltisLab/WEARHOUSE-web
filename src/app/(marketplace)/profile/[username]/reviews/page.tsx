"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { USER_REVIEWS } from "@/graphql/queries/social";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDateTime } from "@/lib/format";
import { useClientMounted } from "@/lib/use-client-mounted";

const PAGE = 30;

export default function ProfileReviewsPage() {
  const mounted = useClientMounted();
  const params = useParams();
  const rawUsername = decodeURIComponent(String(params.username ?? ""));

  const { data, loading } = useQuery(USER_REVIEWS, {
    variables: { username: rawUsername, pageCount: PAGE, pageNumber: 1 },
    skip: !mounted || !rawUsername,
  });

  if (!mounted) {
    return <p className="text-[14px] text-prel-secondary-label">Loading…</p>;
  }

  type RevRow = {
    id?: string | number | null;
    rating?: number | null;
    comment?: string | null;
    isAutoReview?: boolean | null;
    dateCreated?: string | null;
    reviewer?: {
      username?: string | null;
      displayName?: string | null;
      thumbnailUrl?: string | null;
      profilePictureUrl?: string | null;
    } | null;
  };
  const reviews = (data?.userReviews ?? []) as RevRow[];

  return (
    <div className="mx-auto max-w-lg space-y-4 pb-28 md:max-w-xl md:pb-12">
      <Link
        href={`/profile/${encodeURIComponent(rawUsername)}`}
        className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[var(--prel-primary)]"
      >
        ← @{rawUsername}
      </Link>
      <h1 className="text-[22px] font-bold text-prel-label">Reviews</h1>
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-ios" />
          ))}
        </div>
      ) : null}
      <ul className="space-y-3">
        {reviews.map((r) => {
          const rev = r?.reviewer;
          const un = rev?.username ?? "";
          const thumb =
            rev?.profilePictureUrl?.trim() || rev?.thumbnailUrl?.trim() || "";
          return (
            <li
              key={String(r?.id)}
              className="rounded-2xl bg-white p-4 shadow-ios ring-1 ring-prel-glass-border"
            >
              <div className="flex gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-prel-bg-grouped">
                  <SafeImage src={thumb} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    {un ? (
                      <Link
                        href={`/profile/${encodeURIComponent(un)}`}
                        className="text-[15px] font-semibold text-prel-label"
                      >
                        {rev?.displayName?.trim() || `@${un}`}
                      </Link>
                    ) : (
                      <span className="text-[15px] font-semibold text-prel-label">Member</span>
                    )}
                    <span className="text-[14px] text-amber-600">
                      {"★".repeat(Math.min(5, Math.max(0, r?.rating ?? 0)))}
                      <span className="text-prel-tertiary-label">
                        {" "}
                        ({r?.rating ?? 0}/5)
                      </span>
                    </span>
                  </div>
                  {r?.dateCreated ? (
                    <p className="text-[12px] text-prel-tertiary-label">
                      {formatDateTime(r.dateCreated)}
                      {r?.isAutoReview ? " · Auto" : ""}
                    </p>
                  ) : null}
                  <p className="mt-2 whitespace-pre-wrap text-[14px] leading-relaxed text-prel-label">
                    {r?.comment}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {!loading && reviews.length === 0 ? (
        <p className="text-[14px] text-prel-secondary-label">No reviews yet.</p>
      ) : null}
    </div>
  );
}
