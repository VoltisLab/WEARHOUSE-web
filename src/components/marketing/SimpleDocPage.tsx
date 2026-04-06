import type { ReactNode } from "react";

export function SimpleDocPage({
  title,
  updated,
  lead,
  children,
}: {
  title: string;
  updated?: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl pb-24 pt-2 md:pb-28">
      <h1 className="text-[26px] font-bold leading-tight tracking-tight text-prel-label md:text-[30px]">
        {title}
      </h1>
      {updated ? (
        <p className="mt-2 text-[13px] text-prel-secondary-label">
          Last updated {updated}
        </p>
      ) : null}
      {lead ? (
        <p className="mt-5 text-[16px] leading-relaxed text-prel-secondary-label">
          {lead}
        </p>
      ) : null}
      <div className="mt-8 space-y-5 text-[15px] leading-relaxed text-prel-label [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-[17px] [&_h2]:font-bold [&_h2]:text-prel-label [&_h3]:mt-6 [&_h3]:text-[15px] [&_h3]:font-bold [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1.5 [&_a]:font-semibold [&_a]:text-[var(--prel-primary)]">
        {children}
      </div>
    </article>
  );
}
