import { getGraphqlHttpUrl } from "@/lib/graphql-http-url";

type UploadRow = { url: string; thumbnail: string };

const UPLOAD_MUTATION = `
  mutation UploadProductImages($filetype: FileTypeEnum!, $files: [Upload]!) {
    upload(filetype: $filetype, files: $files) {
      success
      baseUrl
      data
    }
  }
`;

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.replace(/^\/+/, "");
  return `${b}/${p}`;
}

function parseDataRow(raw: unknown): { image?: string; thumbnail?: string } {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as { image?: string; thumbnail?: string };
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") {
    return raw as { image?: string; thumbnail?: string };
  }
  return {};
}

/**
 * Multipart GraphQL upload (`upload` mutation) - same auth as Apollo.
 * Returns `{ url, thumbnail }` pairs for `createProduct.imagesUrl`.
 */
export async function uploadProductImages(
  files: File[],
  bearerToken: string | null,
): Promise<UploadRow[]> {
  if (files.length === 0) return [];
  const uri = getGraphqlHttpUrl();
  if (!uri) throw new Error("Cannot resolve GraphQL URL");

  const form = new FormData();
  const variables: {
    filetype: string;
    files: (null | undefined)[];
  } = {
    filetype: "PRODUCT",
    files: files.map(() => null),
  };

  const map: Record<string, string[]> = {};
  files.forEach((file, i) => {
    const k = `${i}`;
    map[k] = [`variables.files.${i}`];
    form.append(k, file, file.name);
  });

  form.append(
    "operations",
    JSON.stringify({
      query: UPLOAD_MUTATION,
      variables,
    }),
  );
  form.append("map", JSON.stringify(map));

  const headers: HeadersInit = {
    "apollo-require-preflight": "true",
  };
  if (bearerToken) {
    (headers as Record<string, string>).Authorization = `Bearer ${bearerToken}`;
  }

  const res = await fetch(uri, { method: "POST", body: form, headers });
  const json = (await res.json()) as {
    errors?: { message: string }[];
    data?: {
      upload?: {
        success?: boolean;
        baseUrl?: string | null;
        data?: unknown[] | null;
      };
    };
  };

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(" · "));
  }

  const up = json.data?.upload;
  if (!up?.success || !up.baseUrl || !Array.isArray(up.data)) {
    throw new Error("Upload failed - check file type and size.");
  }

  const out: UploadRow[] = [];
  for (const row of up.data) {
    const o = parseDataRow(row);
    if (!o.image) continue;
    const url = joinUrl(up.baseUrl, o.image);
    const thumb = o.thumbnail
      ? joinUrl(up.baseUrl, o.thumbnail)
      : url;
    out.push({ url, thumbnail: thumb });
  }

  if (out.length === 0) {
    throw new Error("No image URLs returned from server.");
  }

  return out;
}
