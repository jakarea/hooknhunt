# ✅ Deployment Checklist - Hook & Hunt

**Date**: January 4, 2026
**Issue**: Assets missing from server causing MIME type errors
**Location**: `/Applications/MAMP/htdocs/hooknhunt/mantine/dist/`

---

## Step 1: Prepare Files ☐

- [ ] Run build: `cd mantine && npm run build`
- [ ] Verify files exist in `dist/` folder
- [ ] Check `.htaccess` is present (may be hidden)

## Step 2: Upload Files ☐

**Using cPanel File Manager:**

- [ ] Login to cPanel at your hosting provider
- [ ] Go to **File Manager**
- [ ] Navigate to `public_html/` (or your web root)
- [ ] **IMPORTANT**: Backup existing files first!
- [ ] Upload ALL files from local `dist/` folder:
  - [ ] `.htaccess` (enable "Show Hidden Files")
  - [ ] `index.html`
  - [ ] `hook-and-hunt-logo.svg`
  - [ ] `vite.svg`
  - [ ] `pwa-192x192.png`
  - [ ] `pwa-512x512.png`
  - [ ] **CRITICAL**: `assets/` folder with both files:
    - [ ] `assets/index-BopuL_0p.css` (212 KB)
    - [ ] `assets/index-G982CtGF.js` (928 KB)

**Using FTP (FileZilla/Cyberduck):**

- [ ] Connect to server with FTP/SFTP
- [ ] Navigate to web root folder
- [ ] Select ALL files in local `dist/` folder
- [ ] Upload to server
- [ ] Verify `assets/` subfolder uploaded

**Using SCP/SSH:**

```bash
cd /Applications/MAMP/htdocs/hooknhunt/mantine
scp -r dist/* user@probesh.hooknhunt.com:/path/to/web/root/
```

- [ ] Command executed successfully
- [ ] Verified files on server

## Step 3: Verify Upload ☐

SSH into server or use cPanel File Manager:

- [ ] `.htaccess` exists in web root
- [ ] `index.html` exists
- [ ] `assets/` folder exists
- [ ] `assets/index-BopuL_0p.css` exists (check size: ~212 KB)
- [ ] `assets/index-G982CtGF.js` exists (check size: ~928 KB)

## Step 4: Test Server Response ☐

Run these commands locally:

```bash
# Test JS file
curl -I https://probesh.hooknhunt.com/assets/index-G982CtGF.js
# Should show: content-type: application/javascript
# Should show: content-length: 947556

# Test CSS file
curl -I https://probesh.hooknhunt.com/assets/index-BopuL_0p.css
# Should show: content-type: text/css
# Should show: content-length: 216769
```

- [ ] JS file returns correct MIME type
- [ ] CSS file returns correct MIME type
- [ ] File sizes are correct (not 463 bytes!)

## Step 5: Clear Browser Cache ☐

- [ ] Open browser DevTools (F12)
- [ ] Right-click refresh button → "Empty Cache and Hard Reload"
- [ ] Or press: `Ctrl+Shift+Delete` → Clear cached images and files
- [ ] Close all browser tabs
- [ ] Reopen: `https://probesh.hooknhunt.com`

## Step 6: Verify Application ☐

- [ ] Page loads without white screen
- [ ] Browser DevTools Console shows NO errors
- [ ] Application is interactive
- [ ] Login page works
- [ ] All assets loaded (check Network tab)

---

## 🚨 Troubleshooting

### If MIME types are still wrong:

1. **Check .htaccess is uploaded**
   ```bash
   # On server, run:
   ls -la .htaccess
   ```

2. **Verify LiteSpeed is reading .htaccess**
   - Contact hosting: "Is AllowOverride enabled?"
   - Or use cPanel → MIME Types to add:
     - Extension: `js` → `application/javascript`
     - Extension: `css` → `text/css`

3. **Check file permissions**
   ```bash
   chmod 644 .htaccess
   chmod 644 assets/*
   chmod 755 assets
   ```

### If assets still return HTML:

- [ ] Files not actually uploaded - verify with `ls -la assets/`
- [ ] Uploaded to wrong location - check web root path
- [ ] Server caching - clear LiteSpeed cache

---

## Contact Hosting Provider Template

If everything fails, send this to your host:

---

**Subject**: MIME Type Configuration Issue - Static Assets

Hello,

I have uploaded a static website to `probesh.hooknhunt.com` with the following structure:
- `index.html` (works fine)
- `assets/` folder with `.js` and `.css` files
- `.htaccess` file with MIME type definitions

However, the `.js` and `.css` files are being served with `Content-Type: text/html` instead of their correct MIME types.

Can you please:
1. Verify `.htaccess` overrides are enabled (`AllowOverride All`)
2. Check if LiteSpeed needs special configuration for MIME types
3. Verify the files in `/assets/` are being served correctly

The `.htaccess` file includes:
```apache
AddType application/javascript js
AddType text/css css
```

Thank you!

---

## Expected Final State

✅ All files uploaded (total ~1.2 MB)
✅ Correct MIME types served
✅ Browser console shows zero errors
✅ Application loads and functions correctly

---

**Build Version**: January 4, 2026 15:10
**Total Size**: ~1.2 MB
**Status**: Ready for deployment
