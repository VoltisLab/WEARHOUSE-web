"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";
import { usePathname } from "next/navigation";
import { STAFF_BASE } from "@/lib/staff-nav";

const STORAGE_KEY = "wearhouseStaffAppearance";

export type AppearanceMode = "system" | "light" | "dark";

type ThemeContextValue = {
  mode: AppearanceMode;
  setMode: (m: AppearanceMode) => void;
  resolved: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveDark(mode: AppearanceMode): boolean {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Applies `dark` on <html> for staff routes only. Kept in a Suspense-isolated
 * child so `usePathname()` never blocks the rest of the app from rendering
 * (Next.js App Router can suspend the subtree that reads the path).
 */
function StaffRouteThemeClassSync({
  mode,
  onResolved,
}: {
  mode: AppearanceMode;
  onResolved: (r: "light" | "dark") => void;
}) {
  const pathname = usePathname();
  const staffChrome = pathname.startsWith(STAFF_BASE);

  useEffect(() => {
    if (!staffChrome) {
      document.documentElement.classList.remove("dark");
      onResolved("light");
      return;
    }
    const dark = resolveDark(mode);
    onResolved(dark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", dark);
  }, [mode, staffChrome, onResolved]);

  useEffect(() => {
    if (!staffChrome || mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const dark = mq.matches;
      onResolved(dark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", dark);
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode, staffChrome, onResolved]);

  return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppearanceMode>("system");
  const [hydrated, setHydrated] = useState(false);
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY) as AppearanceMode | null;
    if (s === "light" || s === "dark" || s === "system") setModeState(s);
    setHydrated(true);
  }, []);

  const setMode = useCallback((m: AppearanceMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  }, []);

  const onResolved = useCallback((r: "light" | "dark") => {
    setResolved(r);
  }, []);

  const value = useMemo(
    () => ({ mode: hydrated ? mode : "system", setMode, resolved }),
    [hydrated, mode, setMode, resolved]
  );

  return (
    <ThemeContext.Provider value={value}>
      <Suspense fallback={null}>
        <StaffRouteThemeClassSync mode={mode} onResolved={onResolved} />
      </Suspense>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme outside ThemeProvider");
  return ctx;
}
