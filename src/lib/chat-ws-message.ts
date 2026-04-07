/**
 * Django `ChatConsumer` sends `MessageSerializer` JSON (mixed snake_case model fields +
 * camelCase `senderName` / `createdAt`). GraphQL thread uses camelCase. Normalize for UI.
 */
export function normalizeChatMessageFromWs(
  raw: Record<string, unknown>,
): Record<string, unknown> {
  const senderName =
    typeof raw.senderName === "string"
      ? raw.senderName
      : typeof raw.sender_name === "string"
        ? raw.sender_name
        : "";

  const senderRaw = raw.sender;
  let sender: { username?: string; thumbnailUrl?: string | null } | null = null;
  if (
    senderRaw &&
    typeof senderRaw === "object" &&
    !Array.isArray(senderRaw) &&
    "username" in senderRaw
  ) {
    const u = (senderRaw as { username?: string; thumbnailUrl?: string | null })
      .username;
    sender = {
      username: u ?? senderName,
      thumbnailUrl:
        (senderRaw as { thumbnailUrl?: string | null }).thumbnailUrl ?? null,
    };
  } else if (senderName) {
    sender = { username: senderName.replace(/^@/, "") };
  }

  const imageUrls =
    raw.imageUrls ??
    raw.image_urls ??
    (Array.isArray(raw.image_urls) ? raw.image_urls : []);

  const createdAt = raw.createdAt ?? raw.created_at ?? "";

  return {
    ...raw,
    sender,
    senderName: senderName || sender?.username,
    createdAt: String(createdAt ?? ""),
    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    isItem: raw.isItem === true || raw.is_item === true,
    itemId: (raw.itemId ?? raw.item_id) as number | null | undefined,
    itemType: (raw.itemType ?? raw.item_type) as string | null | undefined,
    attachmentType: (raw.attachmentType ?? raw.attachment_type) as
      | string
      | null
      | undefined,
  };
}

/** Username for layout (own vs peer), lowercased without @. */
export function chatMessageSenderKey(m: Record<string, unknown>): string {
  const s = m.sender;
  if (s && typeof s === "object" && "username" in s) {
    return String((s as { username?: string }).username ?? "")
      .trim()
      .toLowerCase()
      .replace(/^@/, "");
  }
  return String(m.senderName ?? "")
    .trim()
    .toLowerCase()
    .replace(/^@/, "");
}
