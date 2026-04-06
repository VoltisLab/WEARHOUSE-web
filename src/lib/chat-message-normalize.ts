/**
 * Align WebSocket `MessageSerializer` payloads with GraphQL message rows
 * expected by `ChatMessageBlock`.
 */
export function normalizeChatMessageRow(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const senderName =
    (typeof raw.senderName === "string" && raw.senderName) ||
    (raw.sender as { username?: string } | null | undefined)?.username ||
    null;

  const createdAt = raw.createdAt ?? raw.created_at ?? "";

  const imageUrls = raw.imageUrls ?? raw.image_urls ?? [];

  const attachment = raw.attachment ?? null;
  const text = raw.text ?? "";
  const id = raw.id ?? raw.pk;
  const isItem = raw.isItem ?? raw.is_item ?? false;
  const itemId = raw.itemId ?? raw.item_id;
  const itemType = raw.itemType ?? raw.item_type;

  return {
    ...raw,
    id,
    text,
    createdAt,
    imageUrls,
    attachment,
    isItem,
    itemId,
    itemType,
    sender: senderName ? { username: senderName } : raw.sender,
  };
}
