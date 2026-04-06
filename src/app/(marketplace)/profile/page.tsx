"use client";

import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { VIEW_ME } from "@/graphql/queries/admin";
import { useAuth } from "@/contexts/AuthContext";

export default function MarketplaceProfileMePage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const { data, loading } = useQuery(VIEW_ME, {
    skip: !ready || !userToken,
  });

  useEffect(() => {
    if (ready && !userToken) router.replace("/login");
  }, [ready, userToken, router]);

  useEffect(() => {
    const u = data?.viewMe?.username;
    if (u) router.replace(`/profile/${encodeURIComponent(u)}`);
  }, [data, router]);

  if (!ready || !userToken) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  if (loading || !data?.viewMe?.username) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Opening profile…</p>
    );
  }

  return null;
}
