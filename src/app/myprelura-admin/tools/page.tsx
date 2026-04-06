import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { staffPath } from "@/lib/staff-nav";

const ops = [
  { href: staffPath("/console"), label: "Console", desc: "API & web probes" },
  { href: staffPath("/analytics"), label: "Analytics", desc: "Full metrics grid" },
  { href: staffPath("/orders"), label: "Orders", desc: "Transactions" },
  { href: staffPath("/banners"), label: "Home banners", desc: "In-app promos" },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-3">
      <p className="text-[14px] text-prel-secondary-label">
        Same layout as the consumer &quot;Tools&quot; sheet — operations that share the
        staff GraphQL token.
      </p>
      {ops.map((o) => (
        <Link key={o.href} href={o.href}>
          <GlassCard className="block hover:opacity-95">
            <p className="text-[17px] font-semibold text-prel-label">{o.label}</p>
            <p className="text-[13px] text-prel-secondary-label">{o.desc}</p>
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}
