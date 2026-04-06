"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
};

/** Remote CDN URLs — use native img (no Next image domain allowlist maintenance). */
export function SafeImage({ src, alt, className = "", sizes: _s }: Props) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div
        className={`flex items-center justify-center bg-prel-glass text-prel-tertiary-label ${className}`}
        aria-hidden
      >
        <span className="text-[10px] font-medium">No image</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setErr(true)}
    />
  );
}
