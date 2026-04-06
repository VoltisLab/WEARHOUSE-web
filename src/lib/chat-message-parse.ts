/**
 * Parses `Message.text` JSON payloads (same types as iOS `Message.swift` / Django chat).
 */

export type OrderIssueParsed = {
  orderId: string | null;
  issueId: number | null;
  publicId: string | null;
  issueType: string | null;
  description: string | null;
  imageUrls: string[];
};

export type SoldConfirmationParsed = {
  orderId: string;
  price: number;
};

export type OfferParsed = {
  offerId: string | null;
  offerPrice: number;
};

export type OrderUpdateParsed = {
  orderId: string | null;
  raw: Record<string, unknown>;
};

export type ReportParsed = {
  reportType: string;
  reason: string | null;
  description: string | null;
};

export type CancellationRequestParsed = {
  orderId: number;
  requestedBySeller: boolean;
  status: string;
};

export type CancellationOutcomeParsed = {
  orderId: number;
  approved: boolean;
};

export type ParsedChatMessage =
  | { kind: "plain"; text: string }
  | { kind: "order_issue"; data: OrderIssueParsed }
  | { kind: "sold_confirmation"; data: SoldConfirmationParsed }
  | { kind: "offer"; data: OfferParsed }
  | { kind: "order"; data: OrderUpdateParsed }
  | { kind: "account_report"; data: ReportParsed }
  | { kind: "product_report"; data: ReportParsed }
  | { kind: "order_cancellation_request"; data: CancellationRequestParsed }
  | { kind: "order_cancellation_outcome"; data: CancellationOutcomeParsed }
  | { kind: "unknown_json"; obj: Record<string, unknown> };

function numToStr(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === "number" && !Number.isNaN(v)) return String(v);
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

function parseImageUrlList(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const value of raw) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("{")) {
      try {
        const obj = JSON.parse(trimmed) as Record<string, unknown>;
        const url = obj.url ?? obj.image_url ?? obj.imageUrl;
        if (typeof url === "string" && url.trim()) {
          out.push(url.trim());
          continue;
        }
      } catch {
        /* fall through */
      }
    }
    out.push(trimmed);
  }
  return out;
}

export function parseChatMessageText(text: string): ParsedChatMessage {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) {
    return { kind: "plain", text: trimmed };
  }
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(trimmed) as Record<string, unknown>;
  } catch {
    return { kind: "plain", text: trimmed };
  }
  if (!obj || typeof obj !== "object") {
    return { kind: "plain", text: trimmed };
  }

  const type = obj.type as string | undefined;
  if (!type || typeof type !== "string") {
    if (obj.offer_id != null || obj.offerId != null) {
      const offerId =
        numToStr(obj.offer_id) ?? numToStr(obj.offerId) ?? null;
      let offerPrice = 0;
      const p =
        obj.offerPrice ?? obj.offer_price ?? obj.price ?? obj.amount;
      if (typeof p === "number") offerPrice = p;
      else if (typeof p === "string") offerPrice = parseFloat(p) || 0;
      return { kind: "offer", data: { offerId, offerPrice } };
    }
    return { kind: "unknown_json", obj };
  }

  switch (type) {
    case "order_issue": {
      const orderId =
        numToStr(obj.order_id) ??
        numToStr(obj.orderId) ??
        null;
      let issueId: number | null = null;
      if (typeof obj.issue_id === "number") issueId = obj.issue_id;
      else if (typeof obj.issueId === "number") issueId = obj.issueId;
      else if (typeof obj.issue_id === "string")
        issueId = parseInt(obj.issue_id, 10) || null;
      const publicId =
        typeof obj.public_id === "string"
          ? obj.public_id
          : typeof obj.publicId === "string"
            ? obj.publicId
            : null;
      const issueType =
        typeof obj.issue_type === "string"
          ? obj.issue_type
          : typeof obj.issueType === "string"
            ? obj.issueType
            : null;
      const description =
        typeof obj.description === "string"
          ? obj.description
          : typeof obj.details === "string"
            ? obj.details
            : typeof obj.message === "string"
              ? obj.message
              : null;
      const imageUrls = parseImageUrlList(
        obj.images_url ?? obj.imagesUrl ?? obj.images,
      );
      return {
        kind: "order_issue",
        data: {
          orderId,
          issueId,
          publicId,
          issueType,
          description,
          imageUrls,
        },
      };
    }
    case "sold_confirmation": {
      const oid = numToStr(obj.order_id) ?? numToStr(obj.orderId);
      if (!oid) return { kind: "unknown_json", obj };
      let price = 0;
      const bs = obj.buyer_subtotal ?? obj.product_price;
      if (typeof bs === "number") price = bs;
      else if (typeof bs === "string") price = parseFloat(bs) || 0;
      return { kind: "sold_confirmation", data: { orderId: oid, price } };
    }
    case "offer": {
      const offerId =
        numToStr(obj.offer_id) ?? numToStr(obj.offerId) ?? null;
      let offerPrice = 0;
      const p = obj.offerPrice ?? obj.offer_price;
      if (typeof p === "number") offerPrice = p;
      else if (typeof p === "string") offerPrice = parseFloat(p) || 0;
      return { kind: "offer", data: { offerId, offerPrice } };
    }
    case "order":
      return {
        kind: "order",
        data: {
          orderId: numToStr(obj.order_id) ?? numToStr(obj.orderId),
          raw: obj,
        },
      };
    case "account_report":
    case "product_report":
      return {
        kind: type,
        data: {
          reportType: type,
          reason: typeof obj.reason === "string" ? obj.reason : null,
          description:
            typeof obj.description === "string" ? obj.description : null,
        },
      };
    case "order_cancellation_request": {
      const oid =
        typeof obj.order_id === "number"
          ? obj.order_id
          : typeof obj.orderId === "number"
            ? obj.orderId
            : parseInt(String(obj.order_id ?? obj.orderId ?? ""), 10);
      if (Number.isNaN(oid))
        return { kind: "unknown_json", obj };
      const requestedBySeller =
        (obj.requested_by_seller as boolean | undefined) ??
        (obj.requestedBySeller as boolean | undefined) ??
        false;
      const status =
        typeof obj.status === "string" ? obj.status : "PENDING";
      return {
        kind: "order_cancellation_request",
        data: { orderId: oid, requestedBySeller, status },
      };
    }
    case "order_cancellation_outcome": {
      const oid =
        typeof obj.order_id === "number"
          ? obj.order_id
          : typeof obj.orderId === "number"
            ? obj.orderId
            : parseInt(String(obj.order_id ?? obj.orderId ?? ""), 10);
      if (Number.isNaN(oid))
        return { kind: "unknown_json", obj };
      const approved = (obj.approved as boolean | undefined) ?? false;
      return {
        kind: "order_cancellation_outcome",
        data: { orderId: oid, approved },
      };
    }
    default:
      return { kind: "unknown_json", obj };
  }
}

export function isSupportSystemUsername(username: string | null | undefined) {
  if (!username) return false;
  const u = username.trim().toLowerCase().replace(/\s+/g, "_");
  return u === "prelura_support" || u.includes("prelura_support") || u === "support";
}
