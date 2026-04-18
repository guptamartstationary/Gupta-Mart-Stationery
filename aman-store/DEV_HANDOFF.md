# Developer handoff (Gupta Mart — `aman-store`)

## Cloudflare Pages

- **Root directory:** `aman-store` (repo root is `Gupta-Mart-Stationery`; the Vite app lives in this folder).
- **Build command:** `npm run build`
- **Output:** `dist`
- Set **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`**. Optional: **`VITE_SUPABASE_TIMEOUT_MS`**, **`VITE_DELIVERY_FEE`**.
- After infra or caching issues: **Clear build cache** then redeploy.
- Static SPA: `public/_redirects` and `public/_headers` apply on Pages.

## Auth / navbar

- OAuth returns hash tokens; app strips hash after session restore (`useCurrentUser`).
- `getProfile` uses `safeSupabase` (timeout). Navbar does not block the whole bar on auth loading.

## Data layer

- `shopApi`: deduped in-flight reads + **60s in-memory TTL** for products/categories/banners lists; mutations invalidate product/category/banner caches.
- Home data: `useProducts` / `useCategories` also use **sessionStorage** cache for fast reload.

## Cart

- Zustand `persist` + versioned migration (`cartStore.js`). Badge shows **sum of line quantities** (Navbar + BottomNav).

## Delivery profile (Account / checkout)

- `localStorage` key `userProfile` + Supabase `profiles` row (`userProfileStorage.js`, `Account.jsx`).
- After save, app dispatches `userprofile:updated` so **Cart** picks up merged delivery details without reload.
- `useCurrentUser` exposes **`refreshProfile()`** after server upsert.

## PWA

- `vite-plugin-pwa` generates `sw.js`. If users see stale assets after deploy, purge CDN / clear site data once.
