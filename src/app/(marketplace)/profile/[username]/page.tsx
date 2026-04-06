"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Bookmark,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Pencil,
  Star,
} from "lucide-react";
import { GET_USER, USER_SHOP_PRODUCTS, VIEW_ME } from "@/graphql/queries/admin";
import { CREATE_CHAT } from "@/graphql/mutations/marketplace";
import { SafeImage } from "@/components/ui/SafeImage";
import {
  MarketplaceProductCard,
  type MarketplaceProductRow,
} from "@/components/marketplace/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { useClientMounted } from "@/lib/use-client-mounted";
import { publicProfileUrl } from "@/lib/constants";
import { staffPath } from "@/lib/staff-nav";

const DEPT_CHIPS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "Women", value: "WOMEN" },
  { label: "Men", value: "MEN" },
  { label: "Girls", value: "GIRLS" },
  { label: "Boys", value: "BOYS" },
  { label: "Toddlers", value: "TODDLERS" },
];

export default function MarketplacePublicProfilePage() {
  const mounted = useClientMounted();
  const params = useParams();
  const router = useRouter();
  const rawUsername = decodeURIComponent(String(params.username ?? ""));
  const { userToken, logoutUser } = useAuth();

  const { data: meData } = useQuery(VIEW_ME, {
    skip: !mounted || !userToken,
  });
  const meUsername = meData?.viewMe?.username ?? "";
  const isOwnProfile =
    !!userToken && !!meUsername && meUsername === rawUsername;
  const isStaff = !!meData?.viewMe?.isStaff;
  const [shopQ, setShopQ] = useState("");
  const [dept, setDept] = useState<string | null>(null);
  const pageSize = 80;
  const [createChat, { loading: chatLoading }] = useMutation(CREATE_CHAT);

  const { data: userData, loading: userLoad } = useQuery(GET_USER, {
    variables: { username: rawUsername },
    skip: !mounted || !rawUsername,
  });

  const filters = useMemo(() => {
    const f: { status: string; parentCategory?: string } = {
      status: "ACTIVE",
    };
    if (dept) f.parentCategory = dept;
    return f;
  }, [dept]);

  const searchArg = shopQ.trim() || null;

  const { data: shopData, loading: shopLoad } = useQuery(USER_SHOP_PRODUCTS, {
    variables: {
      username: rawUsername,
      pageCount: pageSize,
      pageNumber: 1,
      filters,
      search: searchArg,
    },
    skip: !mounted || !rawUsername,
  });

  const u = userData?.getUser;
  const rows = (shopData?.userProducts ?? []) as MarketplaceProductRow[];

  const thumb =
    u?.profilePictureUrl?.trim() || u?.thumbnailUrl?.trim() || "";

  async function onMessageSeller() {
    if (!userToken || !rawUsername) {
      router.push("/login");
      return;
    }
    try {
      const { data: d } = await createChat({
        variables: { recipient: rawUsername },
      });
      const id = d?.createChat?.chat?.id;
      if (id != null) router.push(`/messages/${id}`);
    } catch {
      /* optional toast */
    }
  }

  if (!mounted || (userLoad && !u)) {
    return (
      <div className="space-y-4 pb-10">
        <div className="h-40 animate-pulse rounded-2xl bg-white shadow-ios" />
      </div>
    );
  }

  if (!u) {
    return (
      <p className="text-[15px] text-prel-secondary-label">Profile not found.</p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-24">
      <div className="overflow-hidden rounded-2xl bg-white shadow-ios ring-1 ring-prel-glass-border">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-start">
          <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--prel-primary)]/25 md:mx-0">
            <SafeImage
              src={thumb}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            <h1 className="text-[22px] font-bold text-prel-label">
              {u?.displayName?.trim() || `@${rawUsername}`}
            </h1>
            <p className="text-[15px] text-prel-secondary-label">
              @{rawUsername}
              {u?.isVerified ? (
                <span className="ml-2 inline-flex items-center gap-0.5 text-[var(--prel-primary)]">
                  <Star className="h-4 w-4 fill-current" aria-hidden />
                  Verified
                </span>
              ) : null}
            </p>
            {u?.bio ? (
              <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-prel-label">
                {u.bio}
              </p>
            ) : null}
            {isOwnProfile && u?.listing != null ? (
              <p className="mt-3 text-[14px] font-medium text-prel-secondary-label">
                <span className="font-bold text-prel-label">{u.listing}</span>{" "}
                active listing{u.listing === 1 ? "" : "s"}
              </p>
            ) : null}
            {isOwnProfile ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <Link
                  href="/saved"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-prel-separator bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios"
                >
                  <Bookmark className="h-4 w-4 text-[var(--prel-primary)]" />
                  Saved
                </Link>
                <Link
                  href="/messages"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-prel-separator bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios"
                >
                  <MessageCircle className="h-4 w-4 text-[var(--prel-primary)]" />
                  Messages
                </Link>
                <Link
                  href="/account/orders"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-prel-separator bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios"
                >
                  <Package className="h-4 w-4 text-[var(--prel-primary)]" />
                  Orders
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--prel-primary)] px-4 py-2 text-[14px] font-semibold text-white shadow-ios"
                >
                  <Pencil className="h-4 w-4" />
                  Sell
                </Link>
                {isStaff ? (
                  <Link
                    href={staffPath("/dashboard")}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-prel-separator bg-white px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[var(--prel-primary)]" />
                    Staff
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    logoutUser();
                    router.replace("/");
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-prel-separator bg-white px-4 py-2 text-[14px] font-semibold text-prel-error shadow-ios"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <a
                  href={publicProfileUrl(rawUsername)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[14px] font-semibold text-[var(--prel-primary)] underline-offset-2 hover:underline"
                >
                  Public profile link
                </a>
                <button
                  type="button"
                  onClick={onMessageSeller}
                  disabled={chatLoading}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--prel-primary)] px-5 py-2.5 text-[14px] font-semibold text-white shadow-ios disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  Message
                </button>
              </div>
            )}
            {u?.reviewStats && (u.reviewStats.noOfReviews ?? 0) > 0 ? (
              <p className="mt-3 text-[14px] text-prel-secondary-label">
                {(u.reviewStats.rating ?? 0).toFixed(1)} ★ ·{" "}
                {u.reviewStats.noOfReviews} reviews
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[18px] font-bold text-prel-label">Shop</h2>
        <input
          value={shopQ}
          onChange={(e) => setShopQ(e.target.value)}
          placeholder="Search this shop…"
          className="min-h-[44px] w-full rounded-xl border border-prel-separator bg-white px-4 text-[15px] text-prel-label shadow-ios outline-none focus:border-[var(--prel-primary)] sm:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {DEPT_CHIPS.map(({ label, value }) => {
            const on = value == null ? dept == null : dept === value;
            return (
              <button
                key={label}
                type="button"
                onClick={() => setDept(value)}
                className={`rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-ios ring-1 transition ${
                  on
                    ? "bg-[var(--prel-primary)] text-white ring-[var(--prel-primary)]"
                    : "bg-white text-prel-label ring-prel-glass-border hover:bg-prel-bg-grouped"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <p className="text-[13px] text-prel-secondary-label">
          Filters apply server-side (department + search). Open any card for the
          full listing preview.
        </p>
      </div>

      {shopLoad && !shopData ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] animate-pulse rounded-2xl bg-white shadow-ios"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {rows.map((p) => (
            <MarketplaceProductCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {!shopLoad && rows.length === 0 && (
        <p className="text-[15px] text-prel-secondary-label">
          No listings match these filters.
        </p>
      )}

      <p className="text-[13px] text-prel-secondary-label">
        Looking for someone else?{" "}
        <Link href="/search" className="font-semibold text-[var(--prel-primary)]">
          Browse discover
        </Link>
      </p>
    </div>
  );
}
