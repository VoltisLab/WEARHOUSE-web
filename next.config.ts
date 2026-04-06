import type { NextConfig } from "next";

/**
 * Server-side proxy target for `/api/graphql` (avoids browser CORS when the
 * storefront origin is not listed on the API, e.g. https://mywearhouse.co.uk).
 */
const graphqlProxyTarget =
  process.env.GRAPHQL_PROXY_TARGET?.replace(/\/?$/, "") ||
  "https://prelura.voltislabs.uk/graphql";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "prelura.voltislabs.uk" },
      { protocol: "https", hostname: "*.voltislabs.uk" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination: `${graphqlProxyTarget}/`,
      },
    ];
  },
};

export default nextConfig;
