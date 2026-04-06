import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "prelura.voltislabs.uk" },
      { protocol: "https", hostname: "*.voltislabs.uk" },
    ],
  },
};

export default nextConfig;
