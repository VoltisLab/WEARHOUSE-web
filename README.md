# Prelura Admin Web

Next.js staff admin aligned with **[VoltisLab/cleaning](https://github.com/VoltisLab/cleaning)** layout (`src/app`, `src/components`, `src/graphql`, `src/lib`, `src/contexts`, Tailwind v4, Turbopack dev).

Replaces the Flutter **Windows .exe** approach: same GraphQL staff operations as [MyPrelura](https://github.com/shinorspellz/MyPrelura) / `AdminService.swift`, with an **iOS-like** UI (grouped background, large titles, 44px targets, system font stack, bottom tab bar on mobile, side rail on desktop).

## Setup

```bash
cd prelura-admin-web
npm install
# Optional: copy env - see ENV_SETUP.md
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with a **staff** account.

## Build

```bash
npm run build
npm start
```

## Structure (matches cleaning)

- `src/app/` - routes (`login`, `(staff)/dashboard`, `orders`, `issues`, `reports`, `users`)
- `src/components/layout`, `src/components/ui`
- `src/graphql/queries`, `src/graphql/mutations`
- `src/lib/apollo-client.ts`, `ApolloProviderWrapper.tsx`
- `src/contexts/AuthContext.tsx`

Auth header: `Bearer <token>` (same as Prelura Flutter), stored in `localStorage` as `preluraStaffToken`.
