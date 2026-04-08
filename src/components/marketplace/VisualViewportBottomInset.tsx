"use client";

import { useEffect } from "react";

/**
 * Mobile Safari / Chrome: when browser chrome (especially the bottom bar) hides on
 * scroll, the *visual* viewport grows but `position: fixed; bottom: 0` is often
 * tied to the *layout* viewport, leaving a dead band under the tab bar.
 *
 * We mirror the gap as `--prel-vv-bottom-inset` so fixed footers sit flush with
 * the visible bottom. See: visualViewport API + “100vh” mobile issues.
 */
export const PREL_VV_BOTTOM_VAR = "--prel-vv-bottom-inset";

export function VisualViewportBottomInset() {
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return undefined;

    const sync = () => {
      const gap = window.innerHeight - vv.height - vv.offsetTop;
      const px = Number.isFinite(gap) ? Math.max(0, gap) : 0;
      document.documentElement.style.setProperty(PREL_VV_BOTTOM_VAR, `${px}px`);
    };

    sync();
    vv.addEventListener("resize", sync);
    vv.addEventListener("scroll", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      vv.removeEventListener("resize", sync);
      vv.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      document.documentElement.style.removeProperty(PREL_VV_BOTTOM_VAR);
    };
  }, []);

  return null;
}
