"use client";

import { useEffect, useRef } from "react";
import { conversationsWebSocketUrl } from "@/lib/ws-url";

/**
 * Inbox updates (`update_conversation`, etc.) from `ConversationsConsumer`.
 */
export function useConversationsSocket(
  accessToken: string | null | undefined,
  onMessage: (data: Record<string, unknown>) => void
) {
  const cbRef = useRef(onMessage);
  cbRef.current = onMessage;

  useEffect(() => {
    if (!accessToken) return;
    const url = conversationsWebSocketUrl(accessToken);
    if (!url) return;

    const ws = new WebSocket(url);

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(String(evt.data)) as Record<string, unknown>;
        cbRef.current(data);
      } catch {
        /* ignore */
      }
    };

    return () => {
      try {
        ws.close();
      } catch {
        /* ignore */
      }
    };
  }, [accessToken]);
}
