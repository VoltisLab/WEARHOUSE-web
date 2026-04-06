"use client";

import { useMutation, useQuery } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CREATE_PRODUCT } from "@/graphql/mutations/marketplace";
import { MARKETPLACE_CATEGORIES } from "@/graphql/queries/marketplace";
import { useAuth } from "@/contexts/AuthContext";
import { BRAND_NAME } from "@/lib/branding";

const CONDITIONS = [
  "BRAND_NEW_WITH_TAGS",
  "BRAND_NEW_WITHOUT_TAGS",
  "EXCELLENT_CONDITION",
  "GOOD_CONDITION",
  "HEAVILY_USED",
] as const;

const STYLES_SAMPLE = [
  "CASUAL",
  "VINTAGE",
  "STREETWEAR",
  "FORMAL_WEAR",
  "WORKWEAR",
  "PARTY_DRESS",
  "ACTIVEWEAR",
  "MINIMALIST",
] as const;

export default function MarketplaceSellPage() {
  const router = useRouter();
  const { userToken, ready } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sizeId, setSizeId] = useState("");
  const [imageLines, setImageLines] = useState("");
  const [condition, setCondition] = useState<string>(CONDITIONS[2]);
  const [style, setStyle] = useState<string>(STYLES_SAMPLE[0]);
  const [err, setErr] = useState<string | null>(null);
  const [parentCat, setParentCat] = useState<number | null>(null);

  const { data: roots } = useQuery(MARKETPLACE_CATEGORIES, {
    variables: {},
  });
  const { data: children } = useQuery(MARKETPLACE_CATEGORIES, {
    variables: { parentId: parentCat as number },
    skip: parentCat == null,
  });

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT);

  useEffect(() => {
    if (ready && !userToken) router.replace("/login");
  }, [ready, userToken, router]);

  const imagesUrl = useMemo(() => {
    const lines = imageLines
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return lines.map((url) => ({ url, thumbnail: url }));
  }, [imageLines]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!userToken) return;
    const p = parseFloat(price);
    const cat = parseInt(categoryId, 10);
    if (!name.trim() || !description.trim() || Number.isNaN(p) || Number.isNaN(cat)) {
      setErr("Name, description, valid price, and category are required.");
      return;
    }
    if (imagesUrl.length === 0) {
      setErr("Add at least one image URL (one per line). Same URL is used for full image and thumbnail.");
      return;
    }
    const size =
      sizeId.trim() === "" ? null : parseInt(sizeId, 10);
    if (sizeId.trim() !== "" && Number.isNaN(size)) {
      setErr("Size must be a number or empty.");
      return;
    }
    try {
      const { data, errors } = await createProduct({
        variables: {
          name: name.trim(),
          description: description.trim(),
          price: p,
          category: cat,
          size,
          imagesUrl,
          condition,
          style,
          status: "ACTIVE",
        },
        errorPolicy: "all",
      });
      if (errors?.length) {
        setErr(errors.map((x) => x.message).join(" · "));
        return;
      }
      const id = data?.createProduct?.product?.id;
      if (id) {
        router.push(`/product/${id}`);
        return;
      }
      setErr(data?.createProduct?.message || "Could not create listing.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Create failed.");
    }
  }

  if (!ready || !userToken) {
    return (
      <p className="text-[14px] text-prel-secondary-label">Loading…</p>
    );
  }

  const rootCats = (roots?.categories ?? []) as {
    id: number;
    name: string;
  }[];
  const childCats = (children?.categories ?? []) as {
    id: number;
    name: string;
  }[];

  return (
    <div className="mx-auto max-w-lg space-y-6 pb-24">
      <div>
        <h1 className="text-[22px] font-bold text-prel-label">Sell</h1>
        <p className="mt-1 text-[14px] text-prel-secondary-label">
          Create a live listing on {BRAND_NAME} (same API as the app). You need
          hosted image URLs (HTTPS). Pick a leaf category id for your item.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl bg-white p-5 shadow-ios ring-1 ring-prel-glass-border"
      >
        {err && (
          <p className="rounded-lg bg-prel-error/10 px-3 py-2 text-[13px] text-prel-error">
            {err}
          </p>
        )}

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Department (pick then choose subcategory id below)
          </label>
          <select
            value={parentCat ?? ""}
            onChange={(e) =>
              setParentCat(e.target.value ? parseInt(e.target.value, 10) : null)
            }
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          >
            <option value="">— Select —</option>
            {rootCats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {parentCat != null && childCats.length > 0 ? (
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Category id (leaf)
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
            >
              <option value="">— Choose category —</option>
              {childCats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (id {c.id})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
              Category id (numeric)
            </label>
            <input
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 42"
              className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Title
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Price (GBP)
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputMode="decimal"
            placeholder="29.99"
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Size id (optional — from app size tables)
          </label>
          <input
            value={sizeId}
            onChange={(e) => setSizeId(e.target.value)}
            inputMode="numeric"
            placeholder="Leave blank if unknown"
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Condition
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Style (sample set)
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 text-[15px]"
          >
            {STYLES_SAMPLE.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-[13px] font-medium text-prel-secondary-label">
            Image URLs (one per line)
          </label>
          <textarea
            value={imageLines}
            onChange={(e) => setImageLines(e.target.value)}
            rows={4}
            placeholder={"https://cdn.example.com/photo1.jpg\nhttps://..."}
            className="w-full rounded-xl border border-prel-separator bg-prel-bg-grouped px-3 py-2.5 font-mono text-[13px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-full bg-[var(--prel-primary)] text-[15px] font-semibold text-white shadow-ios disabled:opacity-50"
        >
          {loading ? "Publishing…" : "Publish listing"}
        </button>
      </form>

      <p className="text-[13px] text-prel-secondary-label">
        After publishing you can open your{" "}
        <Link href="/profile" className="font-semibold text-[var(--prel-primary)]">
          profile
        </Link>{" "}
        to see it in your shop.
      </p>
    </div>
  );
}
