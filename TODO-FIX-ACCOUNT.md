# Account Option Fix - Progress Tracker

## Approved Plan Steps:

### 1. Create TODO-FIX-ACCOUNT.md [✅ COMPLETE]

### 2. Update src/components/Navbar/Navbar.jsx
- Change Account link from conditional `/orders` to fixed `/account`

### 3. Update src/App.jsx [✅]
- Add new route `/account` → ProtectedRoute wrapping Orders

### 4. Update src/pages/Login.jsx [✅]
- Remove password form, toggle, fields
- Keep only Google button + Admin link
- Ensure auto-redirect if already logged in

### 5. Update src/lib/auth.js [✅]
- Add `export` to `getProfile`
- After successful Google auth, call `usersApi.upsert` with `googleId`


### 6. Test Flow
```
npm run dev
1. Click Navbar → Account → Should redirect to /login if not auth'd
2. Login → Google OAuth → Complete flow → Back to app
3. Click Account → Should show /account (Orders page)
4. Verify console: No auth errors, session persists
```

### 7. Supabase Manual Steps (User Required)
```
1. Dashboard → Auth → Providers → Enable Google (add client ID/secret)
2. SQL Editor → ALTER TABLE users ADD COLUMN googleId text;
3. Run supabase-schema.sql for profiles table + RLS
4. Verify .env: VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY correct
```

**Status**: 5/7 complete

**Next**: 
6. Test locally: cd aman-store && npm run dev
7. Complete Supabase setup

