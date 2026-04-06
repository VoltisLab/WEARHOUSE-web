/**
 * Product.images_url is ArrayField(JSONField): entries may be URL strings or objects
 * with url / image_url / src (mirrors backend / mobile expectations).
 */
export function normalizeProductImageUrls(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const entry of raw) {
    const s = extractImageUrl(entry);
    if (s) out.push(s);
  }
  return out;
}

function extractImageUrl(entry: unknown): string | null {
  if (typeof entry === "string") {
    const t = entry.trim();
    if (!t) return null;
    // ArrayField(JSONField) sometimes stringifies each cell as JSON.
    if (t.startsWith("{") || t.startsWith("[")) {
      try {
        const parsed: unknown = JSON.parse(t);
        if (typeof parsed === "string") {
          const s = parsed.trim();
          return s.length > 0 ? s : null;
        }
        const nested = extractImageUrl(parsed);
        if (nested) return nested;
      } catch {
        /* not JSON */
      }
    }
    return t;
  }
  if (entry && typeof entry === "object" && !Array.isArray(entry)) {
    const o = entry as Record<string, unknown>;
    for (const key of [
      "url",
      "image_url",
      "imageUrl",
      "src",
      "thumbnail",
      "thumbnailUrl",
      "image",
      "photo",
      "href",
    ]) {
      const v = o[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    for (const v of Object.values(o)) {
      if (typeof v === "string" && v.startsWith("http")) return v.trim();
    }
  }
  return null;
}

export function firstProductImageUrl(raw: unknown): string | undefined {
  const urls = normalizeProductImageUrls(raw);
  return urls[0];
}
