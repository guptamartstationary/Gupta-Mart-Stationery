# Manifest Syntax Error Fix - Progress Tracker

**Status:** In Progress

## Steps:
- [ ] 1. Fix vite.config.js syntax (remove invalid chars)
- [ ] 2. Update package.json vite-plugin-pwa to compatible version (^0.22.0-next)
- [ ] 3. Add <link rel="manifest" href="/manifest.webmanifest"> to index.html
- [ ] 4. Clean install: cd aman-store && rmdir /s node_modules && del package-lock.json && npm i
- [ ] 5. Build: npm run build (expect success, dist/manifest.webmanifest generated)
- [ ] 6. Preview: npm run preview
- [ ] 7. Test in Chrome: DevTools > Application > Manifest (no syntax error, installable)
- [ ] 8. Update this TODO mark complete

**Notes:** Addresses Vite8 + PWA plugin incompatibility and missing link tag. Browser errors from malformed/ missing manifest.
