import Link from "next/link";
import { Camera, MessageCircle, Package, Truck, Wallet } from "lucide-react";
import { BRAND_NAME } from "@/lib/branding";

const STEPS = [
  {
    icon: Camera,
    title: "Snap & list",
    body: "Upload photos, add a title and description, pick a category and price.",
  },
  {
    icon: MessageCircle,
    title: "Chat with buyers",
    body: "Answer questions and agree on details — all in one thread.",
  },
  {
    icon: Package,
    title: "Pack it up",
    body: "When it sells, ship with your usual carrier and add tracking.",
  },
  {
    icon: Truck,
    title: "Post it out",
    body: `Buyers cover postage on ${BRAND_NAME} — follow the prompts at checkout.`,
  },
  {
    icon: Wallet,
    title: "Get paid",
    body: "Complete the sale and receive your payout according to your settings.",
  },
] as const;

/**
 * Sell tab: distinct from the buy feed — Depop-like “start selling” journey.
 */
export function HomeSellExperience() {
  return (
    <div className="space-y-10 pb-8">
      <section className="overflow-hidden rounded-3xl bg-white px-5 py-8 shadow-ios ring-1 ring-black/[0.06] sm:px-8 sm:py-10">
        <h2 className="text-[22px] font-black tracking-tight text-neutral-900 sm:text-2xl">
          Why sell on {BRAND_NAME}?
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-600">
          Your closet is someone else&apos;s treasure. Join a community built
          around circular fashion — list in minutes and reach buyers who actually
          want what you&apos;re clearing out.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/sell"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[16px] font-bold text-white shadow-lg shadow-[var(--prel-primary)]/25 transition hover:brightness-110"
          >
            Create a listing
          </Link>
          <Link
            href="/help/selling"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-neutral-200 bg-neutral-50 px-7 text-[15px] font-bold text-neutral-800 transition hover:bg-neutral-100"
          >
            Selling help
          </Link>
        </div>
      </section>

      <section>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.14em] text-neutral-500">
          How it works
        </h3>
        <ul className="mt-4 space-y-3">
          {STEPS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-ios ring-1 ring-black/[0.05] sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--prel-primary)]/12 text-[var(--prel-primary)]">
                <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-[16px] font-bold text-neutral-900">{title}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-neutral-600">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-sell-cta-panel rounded-3xl px-5 py-8 shadow-ios ring-1 ring-black/[0.06] sm:px-8">
        <h3 className="text-[18px] font-black text-neutral-900">
          Ready when you are
        </h3>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-neutral-600">
          Open the sell flow to add photos and publish — you can save a draft
          and come back anytime.
        </p>
        <Link
          href="/sell"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-[var(--prel-primary)] px-8 text-[15px] font-bold text-white shadow-md transition hover:brightness-110"
        >
          Go to Sell
        </Link>
      </section>
    </div>
  );
}
