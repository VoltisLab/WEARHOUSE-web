# Environment (Prelura Admin Web)

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_GRAPHQL_URI=https://prelura.voltislabs.uk/graphql/
```

For a local backend, point to your instance (same pattern as [cleaning ENV_SETUP](https://github.com/VoltisLab/cleaning/blob/main/ENV_SETUP.md)).

## CORS

If the browser blocks requests to the API, configure the backend to allow your dev origin (e.g. `http://localhost:3000`) or use a Next.js rewrite proxy in `next.config.ts`.
