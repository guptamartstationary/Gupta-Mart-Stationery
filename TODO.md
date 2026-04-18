# TODO.md - BLACKBOXAI Fix Plan for Auth/Profile Issues

## Steps:

- [ ] Step 1: Edit src/lib/shopApi.js - Add import { hasSupabaseConfig } from './supabaseClient.js'; and const useSupabase = hasSupabaseConfig; after imports
- [x] Step 1: Edit src/lib/shopApi.js - Add import { hasSupabaseConfig } from './supabaseClient.js'; and const useSupabase = hasSupabaseConfig; after imports
- [x] Step 2: Edit src/pages/Account.jsx - Load form from useCurrentUser() hook data (user/profile), save to both Supabase profiles table and localStorage
- [ ] Step 3: Add RLS policies to profiles table in Supabase dashboard (SQL provided)
- [ ] Step 4: Test - cd aman-store && npm run dev, login, go to /account, save profile, check no 406 errors

**Progress: Completed Step 1 (shopApi.js). Step 2 Account.jsx partially edited (hook destructure, useEffect, handleSave). Finalizing loading + Supabase upsert. Then Step 3.**
