export type NavItem = { href: string; label: string };

/** Staff app base path (was root `/`; marketplace now owns `/`). */
export const STAFF_BASE = "/myprelura-admin";

export function staffPath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${STAFF_BASE}${p}`;
}

export const LIVE_OPS: NavItem[] = [
  { href: staffPath("/dashboard"), label: "Home" },
  { href: staffPath("/chat"), label: "Messages" },
  { href: staffPath("/products"), label: "Listings" },
  { href: staffPath("/orders"), label: "Orders" },
  { href: staffPath("/issues"), label: "Order issues" },
  { href: staffPath("/reports"), label: "Reports" },
  { href: staffPath("/users"), label: "Users" },
];

export const TOOLS_OPS: NavItem[] = [
  { href: staffPath("/analytics"), label: "Analytics" },
  { href: staffPath("/console"), label: "Console" },
  { href: staffPath("/banners"), label: "Home banners" },
];

export const ROADMAP_OPS: NavItem[] = [
  { href: staffPath("/roadmap/messaging"), label: "Messaging & offers" },
  { href: staffPath("/roadmap/payments"), label: "Payments & disputes" },
  { href: staffPath("/roadmap/growth"), label: "Growth" },
  { href: staffPath("/roadmap/notifications"), label: "Notifications" },
  { href: staffPath("/roadmap/ai"), label: "AI control" },
  { href: staffPath("/roadmap/internal"), label: "Internal tools" },
  { href: staffPath("/roadmap/shadow"), label: "Shadow marketplace" },
];

/** Single flat list for desktop sidebar (every destination visible, no section headers). */
export const DESKTOP_SIDEBAR_FLAT: NavItem[] = [
  ...LIVE_OPS,
  ...TOOLS_OPS,
  { href: staffPath("/tools"), label: "All tools" },
  ...ROADMAP_OPS,
];

export const MOBILE_TABS: NavItem[] = [
  { href: staffPath("/dashboard"), label: "Home" },
  { href: staffPath("/chat"), label: "Messages" },
  { href: staffPath("/orders"), label: "Orders" },
  { href: staffPath("/issues"), label: "Issues" },
  { href: staffPath("/more"), label: "More" },
];

const TITLE_ORDER: NavItem[] = [
  ...LIVE_OPS,
  ...TOOLS_OPS,
  { href: staffPath("/settings"), label: "Settings" },
  { href: staffPath("/tools"), label: "Tools" },
  { href: staffPath("/more"), label: "More" },
  { href: staffPath("/users"), label: "Profile" },
  { href: staffPath("/orders"), label: "Order" },
  { href: staffPath("/reports"), label: "Report" },
  { href: staffPath("/roadmap"), label: "Roadmap" },
];

function stripStaffBase(pathname: string): string {
  if (pathname === STAFF_BASE || pathname === `${STAFF_BASE}/`) {
    return "/";
  }
  if (pathname.startsWith(`${STAFF_BASE}/`)) {
    return pathname.slice(STAFF_BASE.length) || "/";
  }
  return pathname;
}

export function titleForPath(pathname: string): string {
  const path = stripStaffBase(pathname);
  if (path === "/chat") return "Messages";
  if (path.startsWith("/chat/")) return "Conversation";
  if (path.startsWith("/users/") && path !== "/users") return "Profile";
  if (
    path.startsWith("/products/") &&
    path !== "/products" &&
    !path.endsWith("/products")
  )
    return "Listing";
  if (path.startsWith("/orders/") && path !== "/orders") return "Order";
  if (path.startsWith("/reports/") && path !== "/reports") return "Report";
  for (const { href, label } of TITLE_ORDER) {
    const h = stripStaffBase(href);
    if (path === h) return label;
    if (h !== "/chat" && path.startsWith(h + "/")) return label;
  }
  return "WEARHOUSE Staff";
}
