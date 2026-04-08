"use client";

import { useEffect, useState } from "react";

/** True only after mount - avoids SSR/client Apollo + hydration mismatches. */
export function useClientMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
