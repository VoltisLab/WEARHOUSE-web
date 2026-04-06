import Link from "next/link";
import { BRAND_NAME } from "@/lib/branding";

export default function MarketplaceSavedPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-10 md:pb-12">
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-ios ring-1 ring-prel-glass-border md:p-8">
        <h1 className="text-[22px] font-bold text-prel-label">Saved</h1>
        <p className="text-[15px] leading-relaxed text-prel-secondary-label">
          Likes and saved searches are tied to your {BRAND_NAME} account in the
          app. As a guest on the web, you can browse listings but nothing is
          stored here.
        </p>
        <Link
          href="/login"
          className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-6 text-[15px] font-semibold text-white shadow-ios"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
