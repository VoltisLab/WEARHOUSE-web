"use client";

import { useMutation } from "@apollo/client";
import { Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { LIKE_PRODUCT } from "@/graphql/mutations/marketplace";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  productId: number;
  initialLiked: boolean;
  initialLikes: number;
  className?: string;
  compact?: boolean;
};

export function ProductLikeButton({
  productId,
  initialLiked,
  initialLikes,
  className = "",
  compact,
}: Props) {
  const { userToken } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikes);
  const [likeProduct, { loading }] = useMutation(LIKE_PRODUCT);

  const toggle = useCallback(async () => {
    if (!userToken) return;
    const prevLiked = liked;
    const prevCount = count;
    setLiked(!prevLiked);
    setCount((c) => Math.max(0, c + (prevLiked ? -1 : 1)));
    try {
      const { data, errors } = await likeProduct({
        variables: { productId },
        errorPolicy: "all",
      });
      if (errors?.length || data?.likeProduct?.success === false) {
        setLiked(prevLiked);
        setCount(prevCount);
      }
    } catch {
      setLiked(prevLiked);
      setCount(prevCount);
    }
  }, [userToken, liked, count, likeProduct, productId]);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={!userToken || loading}
      className={`inline-flex items-center gap-2 rounded-full border border-prel-separator bg-white/95 px-4 py-2 text-[14px] font-semibold text-prel-label shadow-ios backdrop-blur-sm transition hover:bg-prel-bg-grouped disabled:opacity-50 ${className}`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={`${compact ? "h-4 w-4" : "h-5 w-5"} shrink-0 ${
          liked ? "fill-[var(--prel-primary)] text-[var(--prel-primary)]" : ""
        }`}
        strokeWidth={liked ? 0 : 2}
      />
      <span className={compact ? "text-[12px]" : ""}>{count}</span>
      {!userToken && !compact ? (
        <span className="text-[12px] font-normal text-prel-secondary-label">
          · Sign in to like
        </span>
      ) : null}
    </button>
  );
}
