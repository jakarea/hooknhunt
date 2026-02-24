# cPanel Deployment & Performance Guide

**For:** Hook & Hunt ERP on shared cPanel hosting
**Problem:** Site loading slow (4-5 seconds per page)

---

## Quick Wins (Do These First)

### 1. Enable Production Mode

Edit `.env` on your server:

```env
# CHANGE THIS
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# These reduce overhead
LOG_LEVEL=error
LOG_STACK=single
```

**Impact:** 20-30% faster by disabling debug overhead

### 2. Enable Laravel Caching

SSH into your server and run:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

**Impact:** 30-40% faster by eliminating config parsing on every request

### 3. Optimize Composer

```bash
composer install --optimize-autoloader --no-dev
```

**Impact:** 10-15% faster autoloading

### 4. Clear Application Cache

```bash
php artisan cache:clear
php artisan view:clear
php artisan config:clear
```

Then re-cache:
```bash
php artisan optimize
```

---

## .env Configuration for cPanel

### Current (Local) → Production Changes

| Setting | Local (Current) | Production (cPanel) |
|---------|-------------------|---------------------|
| APP_ENV | local | **production** |
| APP_DEBUG | true | **false** |
| CACHE_DRIVER | file | **file** (cPanel limit) |
| SESSION_DRIVER | database | **file** (faster) |
| QUEUE_CONNECTION | database | **database** (cPanel limit) |
| LOG_LEVEL | warning | **error** (less I/O) |

### Recommended .env for cPanel

```env
APP_NAME="Hook & Hunt ERP"
APP_ENV=production
APP_KEY=base64:YOUR_KEY_HERE
APP_DEBUG=false                    # CRITICAL: Must be false
APP_URL=https://your-domain.com

APP_TIMEZONE=Asia/Dhaka
APP_LOCALE=en

# Database
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_secure_password

# Cache & Session (cPanel optimized)
CACHE_DRIVER=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync                 # Use sync on shared hosting

# Filesystem
FILESYSTEM_DISK=public

# Logging (reduce I/O)
LOG_CHANNEL=stack
LOG_LEVEL=error                     # Only log errors, not warnings
LOG_STACK=single

# Bcrypt
BCRYPT_ROUNDS=12

# Optional: If cPanel supports Redis
# CACHE_DRIVER=redis
# SESSION_DRIVER=redis
# REDIS_HOST=127.0.0.1
# REDIS_PASSWORD=null
# REDIS_PORT=6379
```

---

## Frontend Optimization

### Current Bundle Size Issues

Your main bundle is **1.9 MB** - this is too large for slow connections.

### Solution 1: Code Splitting (Already in Vite config)

Your `vite.config.js` already has good settings. The issue is likely:

1. **Not using production build** on server
2. **No gzip/brotli compression** enabled
3. **No HTTP/2** on cPanel

### Solution 2: Verify Production Build

```bash
# In resources/js/
npm run build
```

Then ensure your public HTML points to built files:
```html
<!-- Should be -->
<script src="/build/assets/main-D9JMrHJo.js"></script>

<!-- NOT -->
<script src="/resources/js/app/admin/dashboard/page.tsx"></script>
```

### Solution 3: Enable Compression in .htaccess

Add to your `public/.htaccess`:

```apache
<IfModule mod_deflate.c>
    # Compress HTML, CSS, JavaScript, Text, XML and fonts
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/vnd.ms-fontobject
    AddOutputFilterByType DEFLATE application/x-font
    AddOutputFilterByType DEFLATE application/x-font-opentype
    AddOutputFilterByType DEFLATE application/x-font-otf
    AddOutputFilterByType DEFLATE application/x-font-ttf
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/x-shockwave-flash
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xml+rss
    AddOutputFilterByType DEFLATE font/truetype
    AddOutputFilterByType DEFLATE font/opentype
    AddOutputFilterByType DEFLATE image/svg+xml

    # Remove browser bugs
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch ^Mozilla/4\.0[678] no-gzip
    BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
</IfModule>

<IfModule mod_headers.c>
    # Cache static assets for 1 year
    <FilesMatch "\.(css|js|jpg|jpeg|png|gif|svg|ico|woff|woff2)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # Cache API responses for 5 minutes
    <FilesMatch "api/v2">
        Header set Cache-Control "public, max-age=300"
    </FilesMatch>
</IfModule>

# Enable PHP OPcache if available
<IfModule mod_php7.c>
    php_value opcache.enable 1
    php_value opcache.enable_cli 1
    php_value opcache.memory_consumption 256
    php_value opcache.interned_strings_buffer 16
    php_value opcache.max_accelerated_files 10000
    php_value opcache.revalidate_freq 2
    php_value opcache.fast_shutdown 1
</IfModule>
```

---

## Database Optimization

### Check Slow Queries

Enable query logging temporarily:

```env
# In .env (only for debugging!)
DB_LOG_QUERIES=true
```

Then check `storage/logs/laravel.log` for slow queries.

### Add Common Indexes

Run these migrations or add manually:

```sql
-- Users table
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD INDEX idx_phone (phone);
ALTER TABLE users ADD INDEX idx_role (role_id);
ALTER TABLE users ADD INDEX idx_status (is_active);

-- Staff profiles
ALTER TABLE staff_profiles ADD INDEX idx_department (department_id);
ALTER TABLE staff_profiles ADD INDEX idx_joining (joining_date);
ALTER TABLE staff_profiles ADD INDEX idx_status (deleted_at);

-- Attendance
ALTER TABLE attendances ADD INDEX idx_user_date (user_id, date);
ALTER TABLE attendances ADD INDEX idx_date (date);

-- Orders (if sales module used)
ALTER TABLE orders ADD INDEX idx_customer (customer_id);
ALTER TABLE orders ADD INDEX idx_status (status);
ALTER TABLE orders ADD INDEX idx_date (created_at);
```

---

## cPanel Specific Optimizations

### 1. Use cPanel PHP Selector

Go to: **cPanel → Software → Select PHP Version**

- **PHP Version:** 8.2 or 8.3 (you have 8.4 which is good)
- **PHP Options:** Enable OPcache
- **Memory Limit:** 256M or 512M
- **Max Execution Time:** 300
- **Max Input Time:** 300

### 2. Enable CloudFlare (Free CDN)

1. Sign up at cloudflare.com (free tier)
2. Add your domain
3. Update nameservers to CloudFlare
4. Enable:
   - **Auto Minify** (CSS/JS)
   - **Brotli** compression
   - **HTTP/2** (with SSL)
   - **Rocket Loader** (JavaScript optimization)

**Impact:** 40-60% faster globally

### 3. Use cPanel Object Cache

If available in cPanel:

**cPanel → Object Cache → Enable**

Then update `.env`:
```env
CACHE_DRIVER=memcached
MEMCACHED_HOST=127.0.0.1
```

---

## What to Check on Your Server

Run this diagnostic script:

```bash
#!/bin/bash
echo "=== Hook & Hunt ERP Performance Check ==="
echo ""

echo "PHP Version:"
php -v | head -1
echo ""

echo "PHP OPcache:"
php -m | grep opcache || echo "OPcache not enabled"
echo ""

echo "MySQL Version:"
mysql --version
echo ""

echo "Disk Space:"
df -h | head -2
echo ""

echo "Memory Limit:"
php -i | grep memory_limit
echo ""

echo "Max Execution Time:"
php -i | grep max_execution_time
echo ""

echo "Laravel Optimized:"
if [ -f bootstrap/cache/config.php ]; then
    echo "✓ Config cached"
else
    echo "✗ Config NOT cached"
fi

if [ -f bootstrap/cache/routes-v7.php ]; then
    echo "✓ Routes cached"
else
    echo "✗ Routes NOT cached"
fi

if [ -f bootstrap/cache/packages.php ]; then
    echo "✓ Packages cached"
else
    echo "✗ Packages NOT cached"
fi
```

---

## Expected Performance After Changes

| Optimization | Expected Improvement |
|--------------|---------------------|
| APP_DEBUG=false | 20-30% faster |
| Config/Route/View cache | 30-40% faster |
| OPcache enabled | 40-50% faster PHP |
| Gzip compression | 60-70% smaller transfers |
| CloudFlare CDN | 40-60% faster globally |
| Database indexes | 20-40% faster queries |

**Target:** Pages should load in **1-2 seconds** instead of 4-5 seconds.

---

## Monthly Maintenance

Run these commands monthly:

```bash
# Clear and rebuild cache
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Clear logs (keep last 7 days)
find storage/logs -name "*.log" -mtime +7 -delete

# Clear sessions
php artisan session:flush
```

---

## Fast Optimization: API Endpoint

**Endpoint:** `GET /api/v2/system/optimize`

**Quick Usage:**
```bash
curl -X GET "https://your-domain.com/api/v2/system/optimize" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Or access via browser:**
```
https://your-domain.com/api/v2/system/optimize?token=YOUR_ADMIN_TOKEN
```

**What it does:**
- Clears all caches (config, routes, views, events)
- Rebuilds optimizations
- Returns detailed status report

---

## Monitoring

1. **Laravel Telescope** (development only)
   ```bash
   composer require laravel/telescope --dev
   php artisan telescope:install
   ```

2. **Debugbar** (development only)
   ```bash
   composer require barryvdh/laravel-debugbar --dev
   ```

3. **Production monitoring** (consider):
   - Sentry (error tracking)
   - New Relic (APM)
   - Blackfire (performance profiling)

---

## Still Slow? Check These

1. **Too many database queries per page**
   - Enable query log: `DB_LOG_QUERIES=true`
   - Use eager loading: `User::with('role')->get()`

2. **Large images**
   - Compress images: `tinypng.com`, `squoosh.app`
   - Use WebP format

3. **External API calls**
   - Check if any APIs are slow (SMS, payment gateways)

4. **Host throttling**
   - Check cPanel resource usage
   - Consider VPS if constantly hitting limits

---

**Need help?** Share your server's PHP info and specific slow page for more targeted advice.
