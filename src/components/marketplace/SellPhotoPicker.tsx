"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
};

function pickImages(list: FileList | File[] | null): File[] {
  if (!list?.length) return [];
  const out: File[] = [];
  for (let i = 0; i < list.length; i++) {
    const f = list[i];
    if (f && f.type.startsWith("image/")) out.push(f);
  }
  return out;
}

/**
 * Primary listing photos: tap / drag images. Same backend path as the app
 * (`upload` mutation → S3) when the parent publishes.
 */
export function SellPhotoPicker({
  files,
  onChange,
  maxFiles = 12,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [dragOver, setDragOver] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  useLayoutEffect(() => {
    const next = files.map((f) => URL.createObjectURL(f));
    setUrls(next);
    return () => {
      for (const u of next) URL.revokeObjectURL(u);
    };
  }, [files]);

  const append = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;
      onChange([...files, ...incoming].slice(0, maxFiles));
    },
    [files, onChange, maxFiles],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    append(pickImages(e.target.files));
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragOver(false);
    append(pickImages(e.dataTransfer.files));
  };

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragOver(false);
  };

  const removeAt = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={onInputChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "copy";
        }}
        onDrop={onDrop}
        className={`flex min-h-[168px] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-8 transition [-webkit-tap-highlight-color:transparent] ${
          dragOver
            ? "border-[var(--prel-primary)] bg-[var(--prel-primary)]/10"
            : "border-prel-separator bg-prel-bg-grouped/80 hover:border-[var(--prel-primary)]/50 hover:bg-prel-bg-grouped"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--prel-primary)]/15 text-[var(--prel-primary)]">
          <ImagePlus className="h-7 w-7" strokeWidth={1.75} aria-hidden />
        </div>
        <div className="text-center">
          <p className="text-[16px] font-semibold text-prel-label">
            Add photos
          </p>
          <p className="mt-1 text-[13px] text-prel-secondary-label">
            Tap to choose or drag images here - up to {maxFiles} photos
          </p>
          <p className="mt-2 text-[12px] text-prel-tertiary-label">
            Uploaded to our servers (same as the iOS app) when you publish.
          </p>
        </div>
      </button>

      {files.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}-${f.lastModified}`}
              className="relative aspect-square overflow-hidden rounded-xl bg-prel-bg-grouped ring-1 ring-prel-separator"
            >
              <SafeImage
                src={urls[i] ?? ""}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
