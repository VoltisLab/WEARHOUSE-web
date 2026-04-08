export function formatMoney(value: number | string | null | undefined): string {
  if (value == null || value === "") return "-";
  const n = typeof value === "string" ? parseFloat(value) : value;
  if (Number.isNaN(n)) return "-";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(n);
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export function formatRelativeShort(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return formatDateTime(iso);
  const sec = (Date.now() - d.getTime()) / 1000;
  if (sec < 60) return "Just now";
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (sec < 3600) return rtf.format(-Math.floor(sec / 60), "minute");
  if (sec < 86400) return rtf.format(-Math.floor(sec / 3600), "hour");
  if (sec < 604800) return rtf.format(-Math.floor(sec / 86400), "day");
  return formatDateTime(iso);
}
