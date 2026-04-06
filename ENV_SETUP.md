# Environment (Prelura Admin Web)

## Default (no `.env` needed)

The app uses **`/api/graphql`** on the same host as the site. Next.js **rewrites** that path to the real API (default **`https://prelura.voltislabs.uk/graphql`**). The browser only talks to your domain, so you avoid **CORS** errors like `Failed to fetch` on new storefronts (e.g. [mywearhouse.co.uk](https://mywearhouse.co.uk/)).

To point the proxy at another backend:

```bash
# Server / build env (not exposed to the browser)
GRAPHQL_PROXY_TARGET=https://your-api.example.com/graphql
```

## Override: call the API directly from the browser

Only if the API sends `Access-Control-Allow-Origin` for your exact origin:

```bash
NEXT_PUBLIC_GRAPHQL_URI=https://prelura.voltislabs.uk/graphql/
```

(When this is set, `/api/graphql` is not used for HTTP.)

## CORS (if you use `NEXT_PUBLIC_GRAPHQL_URI` to an external URL)

Configure the GraphQL server to allow your origins (e.g. `https://mywearhouse.co.uk`, `http://localhost:3000`).
