"use client";

import { useMutation } from "@apollo/client";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LIKE_PRODUCT } from "@/graphql/mutations/marketplace";
import { safeReturnPath } from "@/lib/safe-return-path";

type Props = {
  productId: number;
  likes: number;
  userLiked: boolean;
};

export function ProductLikeButton({ productId, likes, userLiked }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { userToken, ready } = useAuth();
  const [liked, setLiked] = useState(userLiked);
  const [count, setCount] = useState(Math.max(0, Math.floor(likes)));
  const [likeMutation, { loading }] = useMutation(LIKE_PRODUCT);

  useEffect(() => {
    setLiked(userLiked);
    setCount(Math.max(0, Math.floor(likes)));
  }, [productId, userLiked, likes]);

  const goLogin = useCallback(() => {
    const full =
      typeof window !== "undefined"
        ? `${window.location.pathname}${window.location.search}`
        : pathname;
    const next = safeReturnPath(full) ?? pathname;
    router.push(`/login?next=${encodeURIComponent(next)}`);
  }, [pathname, router]);

  const onClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!ready) return;
      if (!userToken) {
        goLogin();
        return;
      }
      const prevLiked = liked;
      const prevCount = count;
      setLiked(!prevLiked);
      setCount((c) => Math.max(0, c + (prevLiked ? -1 : 1)));
      try {
        const { data } = await likeMutation({
          variables: { productId },
        });
        const ok = data?.likeProduct?.success === true;
        if (!ok) {
          setLiked(prevLiked);
          setCount(prevCount);
        }
      } catch {
        setLiked(prevLiked);
        setCount(prevCount);
      }
    },
    [ready, userToken, liked, count, goLogin, likeMutation, productId],
  );

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-white shadow-md backdrop-blur-[6px] transition hover:bg-black/60 disabled:opacity-70"
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <Heart
        className={`h-3.5 w-3.5 shrink-0 ${
          liked ? "fill-white text-white" : "fill-none text-white"
        }`}
        strokeWidth={2}
      />
      <span className="text-[11px] font-bold tabular-nums leading-none">{count}</span>
    </button>
  );
}
