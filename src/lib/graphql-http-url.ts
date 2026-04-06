/** Browser GraphQL HTTP URL (matches Apollo `HttpLink` resolution). */
export function getGraphqlHttpUrl(): string {
  if (typeof window === "undefined") return "";
  const u = process.env.NEXT_PUBLIC_GRAPHQL_URI?.trim();
  if (u?.startsWith("http://") || u?.startsWith("https://")) return u;
  const path = u?.startsWith("/") ? u : "/api/graphql";
  return `${window.location.origin}${path}`;
}
