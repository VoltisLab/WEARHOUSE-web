import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { staffPath } from "@/lib/staff-nav";

const COPY: Record<string, { title: string; body: string }> = {
  messaging: {
    title: "Messaging & offer monitoring",
    body: "Read-only threads, offer debugger, and moderation alerts need dedicated GraphQL fields and staff policies. No backend changes from this web app.",
  },
  payments: {
    title: "Payments & disputes",
    body: "Refunds UI, dispute queues, and stuck-transaction detection can extend admin order / payments queries when exposed for staff.",
  },
  growth: {
    title: "Growth & monetisation",
    body: "Boosted listings, A/B pricing, and seller analytics require productised admin APIs.",
  },
  notifications: {
    title: "Notifications & announcements",
    body: "Segmented push and in-app campaigns are not exposed on GraphQL yet; banners are available under Tools today.",
  },
  ai: {
    title: "AI control panel",
    body: "Auto-moderation toggles and model suggestions need a backend surface before this tab can ship.",
  },
  internal: {
    title: "Internal tools",
    body: "Shift mode, audit logs, and workflow hooks are planned once APIs exist.",
  },
  shadow: {
    title: "Shadow marketplace view",
    body: "Impersonation / user simulation requires secure server-side support.",
  },
  messages: {
    title: "Messages",
    body: "Inbox-wide staff messaging will reuse consumer chat queries with expanded policies when available.",
  },
};

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const block = COPY[slug] ?? {
    title: "Roadmap",
    body: "This module is planned. Use Live operations for current GraphQL-backed tools.",
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <GlassCard>
        <h2 className="text-[20px] font-bold text-prel-label">{block.title}</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-prel-secondary-label">
          {block.body}
        </p>
      </GlassCard>
      <Link
        href={staffPath("/dashboard")}
        className="text-[15px] font-semibold text-prel-primary"
      >
        ← Home
      </Link>
    </div>
  );
}
