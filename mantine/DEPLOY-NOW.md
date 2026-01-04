# 🚨 CRITICAL: Assets Missing from Server

## Problem

Your server at `https://probesh.hooknhunt.com` is missing the `assets/` folder. When browsers try to load:
- `/assets/index-G982CtGF.js` (928 KB)
- `/assets/index-BopuL_0p.css` (212 KB)

They receive `index.html` (4 KB) instead, causing MIME type errors.

## ✅ Solution: Upload All Files

### Files to Upload (Total: ~1.2 MB)

```
dist/
├── .htaccess                    (3 KB) ← CRITICAL for LiteSpeed
├── index.html                   (4 KB)
├── hook-and-hunt-logo.svg      (48 KB)
├── vite.svg                    (4 KB)
├── pwa-192x192.png             (12 KB)
├── pwa-512x512.png             (36 KB)
└── assets/
    ├── index-BopuL_0p.css     (212 KB) ← MISSING!
    └── index-G982CtGF.js      (928 KB) ← MISSING!
```

## 📤 Deployment Methods

### Option 1: FTP/SFTP Client (FileZilla, Cyberduck, etc.)

1. Connect to your server
2. Navigate to the web root (likely `/public_html` or `/var/www/html`)
3. Upload **ALL** files from the `dist/` folder
4. Verify `.htaccess` is uploaded (may be hidden - enable "Show hidden files")

### Option 2: SSH + SCP

```bash
# From your local machine
cd /Applications/MAMP/htdocs/hooknhunt/mantine

# Upload to server (replace with your server details)
scp -r dist/* user@probesh.hooknhunt.com:/path/to/web/root/

# Example for cPanel hosting:
scp -r dist/* user@probesh.hooknhunt.com:/home/username/public_html/
```

### Option 3: cPanel File Manager

1. Login to cPanel
2. Go to **File Manager** → **public_html**
3. Delete all existing files (backup first!)
4. Click **Upload**
5. Upload ALL files from `dist/` folder:
   - Select all files in `dist/`
   - Don't forget the `assets/` subfolder!
6. Check "Show Hidden Files" to verify `.htaccess` uploaded

### Option 4: Git Deployment (if using Git)

```bash
# On the server
cd /path/to/web/root
git pull origin main
# Or re-clone if needed
```

## ✅ Verification Steps

After uploading, verify each file:

```bash
# Test JS file
curl -I https://probesh.hooknhunt.com/assets/index-G982CtGF.js

# Should return:
# HTTP/2 200
# content-type: application/javascript
# content-length: 947556

# Test CSS file
curl -I https://probesh.hooknhunt.com/assets/index-BopuL_0p.css

# Should return:
# HTTP/2 200
# content-type: text/css
# content-length: 216769
```

## 🔧 LiteSpeed-Specific Configuration

LiteSpeed mostly supports Apache `.htaccess`, but you may need to adjust:

### If .htaccess isn't working:

Add this to **`web.conf`** (LiteSpeed's native config) or contact your host:

```apache
context / {
  location                  /
  allowBrowse              1
  rewrite  {
    Enable                 1
    AutoLoadHtaccess       1
  }
}

context exp:.*\.js$ {
  addMime_type application/javascript
}

context exp:.*\.css$ {
  addMime_type text/css
}
```

### Or add MIME types via cPanel:

1. Login to cPanel
2. **MIME Types** (under Advanced)
3. Add:
   - Extension: `js` → MIME Type: `application/javascript`
   - Extension: `css` → MIME Type: `text/css`

## 🎯 Quick Test

After uploading, open browser DevTools and check:

1. **Console tab**: No MIME type errors
2. **Network tab**:
   - `index-G982CtGF.js`: Status 200, Type: `javascript`
   - `index-BopuL_0p.css`: Status 200, Type: `stylesheet`
3. **Application loads** without console errors

## 🚨 Still Not Working?

### Check 1: File Permissions

SSH into server and run:

```bash
# Check files exist
ls -la /path/to/web/root/assets/

# Should show:
# index-BopuL_0p.css
# index-G982CtGF.js

# Fix permissions if needed
chmod 644 /path/to/web/root/assets/*
chmod 644 /path/to/web/root/.htaccess
chmod 755 /path/to/web/root/assets
```

### Check 2: .htaccess Enabled

```bash
# Check if AllowOverride is set
# (Look for your site's config in /etc/apache2/sites-available/ or /etc/httpd/conf.d/)
# Or ask your hosting provider: "Is AllowOverride All enabled for .htaccess?"
```

### Check 3: Server Logs

Check LiteSpeed/Apache error logs:
```bash
tail -f /usr/local/lsws/logs/error.log
# Or cPanel → Metrics → Errors
```

## 📞 Contact Your Hosting Provider

If everything is uploaded and still not working, send them this message:

---

**Subject**: MIME type issue with static assets on LiteSpeed server

**Message**:
Hi, I've uploaded a static website to my server at `probesh.hooknhunt.com`. The `.htaccess` file includes MIME type definitions for `.js` and `.css` files, but they're still being served as `text/html`.

Can you please verify:
1. Is `.htaccess` allowed to override MIME types? (AllowOverride All)
2. Are the files in `/assets/` being served correctly?
3. Do I need to add MIME types to the main server configuration instead?

I need:
- `.js` files → `application/javascript`
- `.css` files → `text/css`

---

## 📦 Ready-to-Deploy Package

Your current build is ready in:
```
/Applications/MAMP/htdocs/hooknhunt/mantine/dist/
```

**Total size**: ~1.2 MB (easy upload!)

---

**Last Updated**: January 4, 2026
**Status**: ❌ CRITICAL - Assets missing from server
**Next Step**: Upload dist/ folder to server immediately
