import type { Config } from "tailwindcss";

/** Aligned with [VoltisLab/cleaning](https://github.com/VoltisLab/cleaning) layout paths. */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ios: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          '"Segoe UI"',
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        ios: {
          blue: "#007AFF",
          grouped: "#F2F2F7",
          secondary: "#FFFFFF",
          separator: "rgba(60, 60, 67, 0.29)",
          label: "#000000",
          "secondary-label": "rgba(60, 60, 67, 0.6)",
          tertiary: "rgba(60, 60, 67, 0.3)",
        },
      },
      borderRadius: {
        ios: "12px",
        "ios-lg": "16px",
      },
      boxShadow: {
        ios: "0 1px 3px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
