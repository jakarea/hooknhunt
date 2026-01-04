# Deployment Guide - Hook & Hunt ERP

## ✅ What Was Fixed

### 1. **TypeScript Build Errors** (213 → 0)
- Fixed all unused imports
- Fixed type mismatches
- Fixed component props
- Fixed API and form types

### 2. **Production API Configuration**
- **Before:** `http://localhost:8000/api/v2`
- **After:** `https://probesh.hooknhunt.com/api/v2`

### 3. **Quote Loading System**
- Added proper content-type checking
- Fallback quotes when JSON fails to load
- Better error handling

### 4. **Apache Configuration**
- Created `.htaccess` for proper MIME types
- SPA routing configured
- Caching headers set
- Compression enabled
- JSON file serving fixed

### 5. **File Permissions**
- All files set to 644 (readable by web server)
- Directories set to 755

## 📦 Files to Upload

Upload **ALL** files from the `dist/` folder to your server:

```
dist/
├── .htaccess              ← CRITICAL! Must be uploaded
├── index.html
├── manifest.webmanifest
├── registerSW.js
├── sw.js
├── workbox-*.js
├── quotes.json            ← Fixed permissions
├── pwa-192x192.png
├── pwa-512x512.png
├── vite.svg
└── assets/
    ├── index-*.js
    └── index-*.css
```

## 🚀 Quick Deploy Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload the entire `dist` folder** to `https://probesh.hooknhunt.com/`

3. **Verify deployment:**
   - Clear browser cache
   - Hard refresh (Ctrl+Shift+R)
   - Check console for errors

## 📝 Important Notes

### Automatic `.htaccess` Restoration
The build command now automatically restores `.htaccess`:
```bash
npm run build  # .htaccess is automatically copied
```

### What `.htaccess` Does:
- ✅ Serves `quotes.json` with correct `application/json` MIME type
- ✅ Routes all non-file requests to `index.html` (SPA routing)
- ✅ Enables gzip compression
- ✅ Sets proper caching headers
- ✅ Handles Service Worker properly

### Quote Loading Logic:
- **Dashboard:** Shows quote based on day of month (1-31)
- **Login:** Shows random quote from array
- **Fallback:** Shows default quote if JSON fails to load

## 🔧 Troubleshooting

### Quotes still showing HTML error?
1. Check `.htaccess` is uploaded (not .htaccess.dist)
2. Verify permissions: `chmod 644 dist/.htaccess`
3. Clear browser cache completely
4. Check Apache error logs

### API calls to localhost?
1. Check `.env` has: `VITE_API_BASE_URL=https://probesh.hooknhunt.com/api/v2`
2. Rebuild: `npm run build`
3. Upload new dist folder

### Routes returning 404?
1. Verify `.htaccess` is in the root
2. Check Apache mod_rewrite is enabled
3. Check Apache allows `.htaccess` overrides

## 📊 Build Output Size
- CSS: 217 KB (33 KB gzipped)
- JS: 939 KB (260 KB gzipped)
- Total: ~300 KB gzipped

## 🎯 Production URL
https://probesh.hooknhunt.com

---

**Last Updated:** January 3, 2026
**Build Status:** ✅ Passing (0 errors)
