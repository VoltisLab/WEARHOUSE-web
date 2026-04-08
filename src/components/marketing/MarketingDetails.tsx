import type { ReactNode } from "react";

/** Native disclosure - animated chevron via CSS on `details[open]`. */
export function MarketingDetails({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <details className="marketing-details group my-4 overflow-hidden rounded-2xl border border-prel-separator bg-prel-bg-grouped/50 shadow-sm open:bg-white open:shadow-ios">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[15px] font-semibold text-prel-label transition hover:bg-white/60">
        <span>{title}</span>
        <span
          className="marketing-details-chevron text-prel-tertiary-label transition-transform duration-300 ease-out"
          aria-hidden
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="border-t border-prel-separator px-4 py-4 text-[14px] leading-relaxed text-prel-secondary-label">
        {children}
      </div>
    </details>
  );
}
