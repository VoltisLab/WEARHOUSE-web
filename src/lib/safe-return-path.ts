/**
 * Open redirect guard: only allow same-origin relative paths.
 */
export function safeReturnPath(raw: string | null | undefined): string | null {
  if (raw == null || raw === "") return null;
  const s = raw.trim();
  if (!s.startsWith("/") || s.startsWith("//")) return null;
  if (s.includes("://")) return null;
  return s;
}
