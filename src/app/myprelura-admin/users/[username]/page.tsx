"use client";

import { useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { GET_USER } from "@/graphql/queries/admin";
import { GlassCard } from "@/components/ui/GlassCard";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatDateTime } from "@/lib/format";
import { publicProfileUrl, publicWebHostname } from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";

function StatColumn({
  value,
  label,
  href,
}: {
  value: string;
  label: string;
  href?: string;
}) {
  const inner = (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <span className="text-[16px] font-bold leading-tight text-prel-label">
        {value}
      </span>
      <span className="text-[11px] font-medium text-prel-secondary-label">
        {label}
      </span>
    </div>
  );
  if (href) {
    return (
      <Link href={href} className="min-w-[56px] rounded-lg py-1 active:opacity-80">
        {inner}
      </Link>
    );
  }
  return <div className="min-w-[56px]">{inner}</div>;
}

export default function StaffUserProfilePage() {
  const params = useParams();
  const username = decodeURIComponent((params.username as string) || "");
  const [bioOpen, setBioOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { username },
    skip: !username,
  });
  const u = data?.getUser;

  if (loading) {
    return <p className="text-prel-secondary-label">Loading profile…</p>;
  }
  if (error) {
    return <p className="text-prel-error">{error.message}</p>;
  }
  if (!u) {
    return <p className="text-prel-secondary-label">User not found.</p>;
  }

  const pic = u.profilePictureUrl ?? u.thumbnailUrl;
  const reviewStats = u.reviewStats as
    | { noOfReviews?: number; rating?: number }
    | null
    | undefined;
  const reviewCount = reviewStats?.noOfReviews ?? 0;
  const rating = reviewStats?.rating;
  const location = u.location as
    | { locationName?: string | null }
    | null
    | undefined;
  const locationLine = location?.locationName?.trim();

  const bio = (u.bio ?? "").trim();
  const bioLimit = 100;
  const bioTruncated = bio.length > bioLimit;

  return (
    <div className="mx-auto max-w-lg space-y-0 pb-8">
      <div className="bg-prel-bg px-4 pb-2 pt-4">
        <div className="flex items-center gap-0">
          <div className="relative shrink-0">
            <div className="h-[88px] w-[88px] overflow-hidden rounded-full ring-[2.5px] ring-[#ab28b2]/45">
              {pic ? (
                <SafeImage
                  src={pic}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--prel-primary)] text-[28px] font-semibold text-white">
                  {u.username.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-1 justify-end gap-4 pr-1">
            <StatColumn
              value={String(u.listing ?? 0)}
              label={u.listing === 1 ? "Listing" : "Listings"}
            />
            <StatColumn
              value={String(u.noOfFollowing ?? 0)}
              label="Following"
            />
            <StatColumn
              value={String(u.noOfFollowers ?? 0)}
              label={u.noOfFollowers === 1 ? "Follower" : "Followers"}
            />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-1">
          <span className="text-[13px] text-yellow-500" aria-hidden>
            ★★★★★
          </span>
          <span className="text-[14px] text-prel-secondary-label">
            ({reviewCount}
            {rating != null && Number(rating) > 0
              ? ` · ${Number(rating).toFixed(1)} avg`
              : ""}
            )
          </span>
        </div>

        <div className="mt-3">
          <p className="text-[20px] font-bold leading-tight text-prel-label">
            {u.displayName ?? u.username}
          </p>
          <p className="prel-text-accent mt-0.5 text-[15px] font-medium">
            @{u.username}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {u.isVerified && (
              <span className="rounded-full bg-prel-metric-new/20 px-2 py-0.5 text-[11px] font-semibold text-prel-metric-new">
                Verified
              </span>
            )}
            {u.isStaff && (
              <span className="rounded-full bg-prel-primary/20 px-2 py-0.5 text-[11px] font-semibold text-[var(--prel-primary)]">
                Staff
              </span>
            )}
            {u.isSuperuser && (
              <span className="rounded-full bg-prel-metric-views/20 px-2 py-0.5 text-[11px] font-semibold text-prel-metric-views">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {bio && (
        <div className="bg-prel-bg px-4 py-2">
          {bioTruncated && !bioOpen ? (
            <>
              <p className="text-[14px] leading-relaxed text-prel-label">
                {bio.slice(0, bioLimit)}…
              </p>
              <button
                type="button"
                onClick={() => setBioOpen(true)}
                className="prel-text-accent mt-1 text-[14px] font-semibold"
              >
                Read more
              </button>
            </>
          ) : (
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-prel-label">
              {bio}
            </p>
          )}
        </div>
      )}

      {locationLine && (
        <div className="flex items-center gap-1.5 bg-prel-bg px-4 pb-2">
          <span className="text-[12px] text-prel-secondary-label" aria-hidden>
            📍
          </span>
          <span className="text-[14px] text-prel-secondary-label">
            {locationLine}
          </span>
        </div>
      )}

      {u.isVerified && (
        <div className="flex items-center gap-1.5 bg-prel-bg px-4 pb-2">
          <span className="text-[12px] text-green-500" aria-hidden>
            ✓
          </span>
          <span className="text-[14px] text-prel-secondary-label">
            Email verified
          </span>
        </div>
      )}

      {u.isVacationMode && (
        <div className="mx-4 my-3 rounded-ios-lg bg-prel-glass px-4 py-6 text-center ring-1 ring-prel-glass-border">
          <p className="text-[40px]" aria-hidden>
            ☂️
          </p>
          <p className="mt-2 text-[15px] font-semibold text-prel-label">
            This member is on vacation
          </p>
          <p className="mt-1 text-[13px] text-prel-secondary-label">
            Listings may be paused.
          </p>
        </div>
      )}

      <GlassCard className="mx-1 mt-3 space-y-3 text-[14px]">
        <div className="flex justify-between gap-2">
          <span className="text-prel-secondary-label">Email</span>
          <span className="max-w-[60%] truncate text-right text-prel-label">
            {u.email ?? "—"}
          </span>
        </div>
        <div className="h-px bg-prel-separator" />
        <div className="flex justify-between gap-2">
          <span className="text-prel-secondary-label">Joined</span>
          <span className="text-prel-label">
            {formatDateTime(String(u.dateJoined ?? ""))}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-prel-secondary-label">Last seen</span>
          <span className="text-prel-label">
            {formatDateTime(String(u.lastSeen ?? ""))}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-prel-secondary-label">Last login</span>
          <span className="text-prel-label">
            {formatDateTime(String(u.lastLogin ?? ""))}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-prel-secondary-label">Credit</span>
          <span className="text-prel-label">{u.credit ?? 0}</span>
        </div>
      </GlassCard>

      <div className="mt-4 flex flex-wrap gap-2 px-1">
        <a
          href={publicProfileUrl(String(u.username))}
          target="_blank"
          rel="noreferrer"
          className="prel-btn-primary inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold"
        >
          View on {publicWebHostname()}
        </a>
        <Link
          href={`${staffPath("/products")}?user=${encodeURIComponent(String(u.username))}`}
          className="prel-btn-secondary inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold"
        >
          Listings
        </Link>
        <Link
          href={staffPath("/users")}
          className="prel-btn-ghost inline-flex min-h-[44px] items-center justify-center rounded-[10px] px-4 text-[15px] font-semibold"
        >
          ← Users
        </Link>
      </div>
    </div>
  );
}
