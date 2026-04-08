"use client";

type Mode = "buy" | "sell";

type Variant = "light" | "dark" | "panel";

/**
 * Depop-style Buy / Sell segmented control.
 * `dark` = white active segment on dark frosted track (legacy full-bleed hero).
 * `panel` = light hero (active = blue-grey pill, inactive = white) like depop.com/gb.
 */
export function HomeBuySellSwitch({
  mode,
  onModeChange,
  variant = "light",
  align = "center",
}: {
  mode: Mode;
  onModeChange: (m: Mode) => void;
  variant?: Variant;
  align?: "center" | "start";
}) {
  const isDark = variant === "dark";
  const isPanel = variant === "panel";

  return (
    <div
      className={`w-full max-w-[300px] sm:max-w-[360px] ${align === "start" ? "" : "mx-auto"}`}
      role="tablist"
      aria-label="Buying or selling"
    >
      <div
        className={
          isPanel
            ? "flex gap-1.5 rounded-full bg-[#e8eaef] p-1.5 ring-1 ring-black/[0.06]"
            : isDark
              ? "flex gap-1.5 rounded-full bg-black/35 p-1.5 ring-1 ring-white/20 backdrop-blur-md"
              : "flex gap-1.5 rounded-full bg-neutral-200/95 p-1.5 shadow-inner ring-1 ring-black/[0.06] dark:bg-neutral-800/90"
        }
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "buy"}
          onClick={() => onModeChange("buy")}
          className={`relative min-w-0 flex-1 rounded-full py-2.5 text-[15px] font-medium transition [-webkit-tap-highlight-color:transparent] sm:py-3 ${
            mode === "buy"
              ? isDark
                ? "bg-white text-black shadow-lg"
                : isPanel
                  ? "bg-[#cfd8e6] text-neutral-900 shadow-sm"
                  : "bg-white text-neutral-900 shadow-md ring-1 ring-black/[0.08]"
              : isDark
                ? "text-white/75 hover:text-white"
                : isPanel
                  ? "bg-white text-neutral-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          Buying
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "sell"}
          onClick={() => onModeChange("sell")}
          className={`relative min-w-0 flex-1 rounded-full py-2.5 text-[15px] font-medium transition [-webkit-tap-highlight-color:transparent] sm:py-3 ${
            mode === "sell"
              ? isDark
                ? "bg-white text-black shadow-lg"
                : isPanel
                  ? "bg-[#cfd8e6] text-neutral-900 shadow-sm"
                  : "bg-white text-neutral-900 shadow-md ring-1 ring-black/[0.08]"
              : isDark
                ? "text-white/75 hover:text-white"
                : isPanel
                  ? "bg-white text-neutral-600 shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
          }`}
        >
          Selling
        </button>
      </div>
    </div>
  );
}
