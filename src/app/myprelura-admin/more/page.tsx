import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { staffPath } from "@/lib/staff-nav";

const links = [
  { href: staffPath("/chat"), label: "Messages" },
  { href: staffPath("/reports"), label: "Reports" },
  { href: staffPath("/users"), label: "Users" },
  { href: staffPath("/products"), label: "Listings" },
  { href: staffPath("/analytics"), label: "Analytics" },
  { href: staffPath("/console"), label: "Console" },
  { href: staffPath("/banners"), label: "Banners" },
  { href: staffPath("/tools"), label: "Tools hub" },
  { href: staffPath("/settings"), label: "Settings" },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-md space-y-3">
      <p className="text-[13px] text-prel-secondary-label">
        Secondary destinations (also in the desktop sidebar).
      </p>
      {links.map(({ href, label }) => (
        <Link key={href} href={href}>
          <GlassCard className="block py-3 text-[17px] font-semibold text-prel-primary transition-opacity hover:opacity-90">
            {label}
          </GlassCard>
        </Link>
      ))}
    </div>
  );
}
