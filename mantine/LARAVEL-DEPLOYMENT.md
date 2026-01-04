# 🚀 Deployment Guide - Laravel + React (cPanel)

## Architecture

```
probesh.hooknhunt.com/
├── Laravel API (Backend)
│   ├── app/
│   ├── routes/
│   │   ├── api.php          → /api/v2/* endpoints
│   │   └── web.php          → Serves React app + static files
│   └── public/              ← Document Root
│       ├── index.php        ← Laravel entry point
│       └── build/           ← React build files
│           ├── index.html
│           ├── quotes.json  ← Served by Laravel route
│           ├── assets/
│           └── ...
```

## ✅ What Was Fixed

### 1. **Laravel Route** (`routes/web.php`)
Added a route to serve React static files with correct MIME types:
- `/quotes.json` → `public/build/quotes.json` (application/json)
- `/manifest.webmanifest` → `public/build/manifest.webmanifest`
- `/registerSW.js` → `public/build/registerSW.js`
- Other assets (PNG, SVG, etc.)

**This fixes the HTML-instead-of-JSON error!** 🎯

### 2. **React API Configuration**
Changed API URL from absolute to relative:
- **Before:** `https://probesh.hooknhunt.com/api/v2`
- **After:** `/api/v2` (works on localhost AND production!)

### 3. **Quote Loading Error Handling**
Added content-type checking to gracefully handle errors

## 📦 Deployment Steps

### Step 1: Upload Laravel Route Changes

1. Open **File Manager** in cPanel
2. Go to `routes/web.php`
3. Add the new route (already done in your local file)
4. Save the file

### Step 2: Upload React Build Files

Upload **ALL** files from `mantine/dist/` to:
```
public_html/build/
```

**CRITICAL:** Make sure these files are uploaded:
- ✅ `index.html`
- ✅ `quotes.json` ← This is the one giving errors!
- ✅ `assets/index-*.js`
- ✅ `assets/index-*.css`
- ✅ `manifest.webmanifest`
- ✅ `registerSW.js`
- ✅ `pwa-192x192.png`
- ✅ `pwa-512x512.png`
- ✅ `workbox-*.js`

### Step 3: Clear Laravel Cache

Run these commands in **cPanel Terminal** or SSH:
```bash
cd public_html
php artisan route:clear
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

Or visit: `https://probesh.hooknhunt.com/system/refresh`

### Step 4: Verify Deployment

1. **Open browser**
2. **Clear cache** (Ctrl+Shift+Delete)
3. **Hard refresh** (Ctrl+Shift+R)
4. **Check console** - errors should be gone!

## 🔍 How It Works Now

### Before (Broken):
```
Browser: GET /quotes.json
Laravel: → Catch-all route → Returns build/index.html (HTML!)
React: Expects JSON but gets HTML → ERROR! ❌
```

### After (Fixed):
```
Browser: GET /quotes.json
Laravel: → Specific quotes.json route → Returns build/quotes.json (JSON!)
React: Gets JSON → SUCCESS! ✅
```

## 📝 File Permissions

Make sure uploaded files have correct permissions:
```bash
# In cPanel Terminal or SSH
cd public_html/build
chmod 644 *.json *.html *.js *.png
chmod 755 assets
```

## 🎯 Testing Checklist

- [ ] Quotes load on login page (random quote)
- [ ] Quote loads on dashboard (based on day of month)
- [ ] No "Unexpected token '<'" errors in console
- [ ] API calls work (`/api/v2/...`)
- [ ] Navigation works (React Router)

## 🐛 Troubleshooting

### Quotes still returning HTML?
1. Check `routes/web.php` has the new route (BEFORE catch-all)
2. Clear Laravel routes: `php artisan route:clear`
3. Verify `quotes.json` exists in `public/build/`
4. Hard refresh browser (Ctrl+Shift+R)

### API calls not working?
1. Check `.env` has: `VITE_API_BASE_URL=/api/v2`
2. Rebuild: `npm run build`
3. Upload new build
4. Clear browser cache

### Routes not working?
1. Check web.php route order (quotes route must be BEFORE catch-all)
2. Clear Laravel cache
3. Check file permissions

## 📊 Build Summary

- **Total Size:** ~300 KB (gzipped)
- **CSS:** 217 KB (33 KB gzipped)
- **JS:** 939 KB (260 KB gzipped)
- **PWA:** Enabled ✅

## 🎉 Success Indicators

When everything works:
- ✅ Console shows no errors
- ✅ Quotes load with Bengali text
- ✅ Login page shows different quote each time
- ✅ Dashboard shows quote based on day of month
- ✅ API calls to `/api/v2/*` work correctly

---

**Need Help?** Check browser console for errors and Laravel logs at `storage/logs/laravel.log`
