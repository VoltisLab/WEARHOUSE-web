import type { ReactNode } from "react";

/** Glass surface + corner radius (10.8px), aligned with consumer app. */
export function GlassCard({
  children,
  className = "",
  paddingClass = "p-4",
}: {
  children: ReactNode;
  className?: string;
  paddingClass?: string;
}) {
  return (
    <div className={`glass-card rounded-ios-glass ${paddingClass} ${className}`}>
      {children}
    </div>
  );
}
