"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { IOSStaffShell } from "@/components/layout/IOSStaffShell";
import { STAFF_BASE, staffPath } from "@/lib/staff-nav";

function StaffLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { staffToken, ready } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const pathNorm = (pathname.replace(/\/$/, "") || "/") as string;
  const isLoginRoute =
    pathNorm === staffPath("/login") || pathNorm === `${STAFF_BASE}/login`;

  useEffect(() => {
    if (!ready || isLoginRoute) return;
    if (!staffToken) router.replace(staffPath("/login"));
  }, [ready, staffToken, router, isLoginRoute]);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ios-grouped text-ios-secondary-label">
        Loading…
      </div>
    );
  }

  if (isLoginRoute && !staffToken) {
    return <>{children}</>;
  }

  if (!staffToken) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-ios-grouped text-ios-secondary-label">
        Loading…
      </div>
    );
  }

  return <IOSStaffShell>{children}</IOSStaffShell>;
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-ios-grouped text-ios-secondary-label">
          Loading…
        </div>
      }
    >
      <StaffLayoutInner>{children}</StaffLayoutInner>
    </Suspense>
  );
}
