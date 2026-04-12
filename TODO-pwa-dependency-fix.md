# PWA Dependency Conflict Fix Progress

**Status:** In Progress by BLACKBOXAI

## Steps:
- [x] 1. Create this TODO file
- [x] 2. Edit aman-store/package.json: Add \"vite-plugin-pwa\": \"^1.2.0\" to devDependencies
- [ ] 3. User runs: `cd aman-store && del /s /q node_modules && del package-lock.json && npm install`
- [ ] 4. User runs: `npm run build` (verify no ERESOLVE, build succeeds)
- [ ] 5. Test PWA install prompt in Chrome dev tools

**Notes:**
- Keeps vite ^8.0.1 unchanged
- No source code/Vite config changes
- Explicit dep prevents auto-resolution conflict

