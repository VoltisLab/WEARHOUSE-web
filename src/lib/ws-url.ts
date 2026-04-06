import { CHAT_WS_ORIGIN_HINT, GRAPHQL_URI } from "@/lib/constants";

/**
 * WebSocket origin for Django Channels (`ws/chat/<id>/`, `ws/conversations/`).
 * Set `NEXT_PUBLIC_CHAT_WS_ORIGIN` if it differs from the GraphQL host.
 */
export function chatWebSocketOrigin(): string {
  const explicit = CHAT_WS_ORIGIN_HINT;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  try {
    const u = new URL(GRAPHQL_URI);
    const proto = u.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${u.host}`;
  } catch {
    return "";
  }
}

export function chatRoomWebSocketUrl(
  conversationId: string | number,
  accessToken: string
): string {
  const origin = chatWebSocketOrigin();
  if (!origin || !accessToken) return "";
  const id = String(conversationId).replace(/\D/g, "") || String(conversationId);
  const token = encodeURIComponent(accessToken);
  return `${origin}/ws/chat/${id}/?token=${token}`;
}

export function conversationsWebSocketUrl(accessToken: string): string {
  const origin = chatWebSocketOrigin();
  if (!origin || !accessToken) return "";
  const token = encodeURIComponent(accessToken);
  return `${origin}/ws/conversations/?token=${token}`;
}
