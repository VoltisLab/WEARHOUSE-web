"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { chatRoomWebSocketUrl } from "@/lib/ws-url";

export type ChatWsInbound =
  | { type: "chat_message"; payload: Record<string, unknown> }
  | { type: "typing_status"; payload: Record<string, unknown> }
  | { type: "message_reaction"; payload: Record<string, unknown> }
  | { type: "raw"; payload: unknown };

function normalizeInbound(raw: Record<string, unknown>): ChatWsInbound {
  const t = raw.type;
  if (t === "chat_message") {
    return { type: "chat_message", payload: raw };
  }
  if (t === "typing_status") {
    return { type: "typing_status", payload: raw };
  }
  if (t === "message_reaction") {
    return { type: "message_reaction", payload: raw };
  }
  return { type: "raw", payload: raw };
}

/**
 * Django Channels `ChatConsumer` socket for one conversation.
 * Auth: `?token=` JWT (see `TokenAuthMiddleware` on the API).
 */
export function useChatRoomSocket(
  conversationId: string | null | undefined,
  accessToken: string | null | undefined,
  onEvent: (ev: ChatWsInbound) => void
) {
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const disconnect = useCallback(() => {
    const w = wsRef.current;
    if (w) {
      wsRef.current = null;
      try {
        w.close();
      } catch {
        /* ignore */
      }
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    if (!conversationId || !accessToken) {
      disconnect();
      return;
    }
    const url = chatRoomWebSocketUrl(conversationId, accessToken);
    if (!url) {
      disconnect();
      return;
    }

    disconnect();
    let alive = true;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      if (alive) setConnected(true);
    };
    ws.onclose = () => {
      if (alive) setConnected(false);
    };
    ws.onerror = () => {
      if (alive) setConnected(false);
    };
    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(String(evt.data)) as Record<string, unknown>;
        onEventRef.current(normalizeInbound(data));
      } catch {
        /* ignore non-JSON */
      }
    };

    return () => {
      alive = false;
      try {
        ws.close();
      } catch {
        /* ignore */
      }
      if (wsRef.current === ws) wsRef.current = null;
      setConnected(false);
    };
  }, [conversationId, accessToken, disconnect]);

  const sendJson = useCallback((obj: Record<string, unknown>) => {
    const w = wsRef.current;
    if (w && w.readyState === WebSocket.OPEN) {
      w.send(JSON.stringify(obj));
    }
  }, []);

  const sendChatMessage = useCallback(
    (text: string, messageUuid: string) => {
      sendJson({
        message: text,
        message_uuid: messageUuid,
        messageUuid,
      });
    },
    [sendJson]
  );

  const sendTyping = useCallback(
    (isTyping: boolean) => {
      sendJson({ is_typing: isTyping, isTyping });
    },
    [sendJson]
  );

  return { connected, sendChatMessage, sendTyping, disconnect };
}
