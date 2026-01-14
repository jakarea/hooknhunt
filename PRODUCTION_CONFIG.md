# Production Environment Configuration

## Live Environments

- **Frontend URL**: https://probesh.hooknhunt.com
- **Backend API URL**: https://api.hooknhunt.com

---

## Frontend Configuration (.env)

**Location**: `/mantine/.env`

```bash
VITE_API_BASE_URL=https://api.hooknhunt.com/api/v2
```

---

## Backend Configuration (.env)

**Location**: `/hooknhunt-api/.env`

### Key Production Settings:

```bash
# Application
APP_NAME=Laravel
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.hooknhunt.com
APP_TIMEZONE=Asia/Dhaka

# Database (Update with production credentials)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hooknhunt_production
DB_USERNAME=production_user
DB_PASSWORD=secure_password_here

# Sanctum Authentication
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1,probesh.hooknhunt.com,https://probesh.hooknhunt.com

# Frontend URL (for CORS and references)
FRONTEND_URL=https://probesh.hooknhunt.com
```

---

## Pre-Deployment Checklist

### Backend (API Server)

- [ ] Update database credentials in `.env`
- [ ] Run `php artisan config:cache` to cache configuration
- [ ] Run `php artisan route:cache` to cache routes
- [ ] Run `php artisan view:cache` to cache views
- [ ] Run `php artisan migrate --force` to run database migrations
- [ ] Run `php artisan db:seed --force` to seed initial data (if needed)
- [ ] Set storage permissions: `chmod -R 775 storage bootstrap/cache`
- [ ] Ensure `storage` directory is writable
- [ ] Configure SSL certificate for HTTPS
- [ ] Set up cron jobs for scheduled tasks:
  ```bash
  * * * * * cd /path-to-api && php artisan schedule:run >> /dev/null 2>&1
  ```

### Frontend (Mantine/React)

- [ ] Build production bundle: `npm run build`
- [ ] Upload `dist/` folder to production server
- [ ] Configure web server (Nginx/Apache) to serve static files
- [ ] Set up proper routing for React Router (SPA)
- [ ] Configure SSL certificate for HTTPS

---

## CORS Configuration

**Current Setting**: Allows all origins (`'allowed_origins' => ['*']`)

**Location**: `/hooknhunt-api/config/cors.php`

**For Production** (Optional - More Secure):
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
'allowed_origins' => ['https://probesh.hooknhunt.com'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

---

## Nginx Configuration Example

### Frontend (https://probesh.hooknhunt.com)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name probesh.hooknhunt.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name probesh.hooknhunt.com;
    root /var/www/probesh.hooknhunt.com/dist;
    index index.html;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # React Router SPA support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Backend API (https://api.hooknhunt.com)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.hooknhunt.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.hooknhunt.com;
    root /var/www/api.hooknhunt.com/public;
    index index.php;

    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;

    # Laravel
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

---

## Important Notes

### Security

1. **APP_DEBUG**: Set to `false` in production
2. **APP_KEY**: Ensure this is set to a strong 32-character key
3. **Database**: Use strong passwords and limit database user permissions
4. **SSL/TLS**: Always use HTTPS in production
5. **Firewall**: Configure firewall to only allow necessary ports (80, 443, 22 for SSH)

### Performance

1. **OPcache**: Enable PHP OPcache for better performance
2. **Redis**: Use Redis for caching and queues in production
3. **CDN**: Consider using a CDN for static assets (images, CSS, JS)
4. **Database**: Optimize database queries and add indexes as needed
5. **Queue**: Use Laravel queues for background jobs (emails, SMS, etc.)

### Monitoring

1. **Logs**: Monitor `storage/logs/laravel.log` for errors
2. **Queue Workers**: Ensure queue workers are running: `php artisan queue:work`
3. **Storage**: Monitor disk space, especially for logs and uploaded files
4. **Backups**: Set up automated database backups

---

## Testing Production Deployments

### 1. Test API Health
```bash
curl https://api.hooknhunt.com/api/v2/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"login_id":"test_phone","password":"test_password"}'
```

### 2. Test Frontend
- Visit: https://probesh.hooknhunt.com
- Check browser console for errors
- Test login functionality
- Test API calls in Network tab

### 3. Test CORS
```bash
curl https://api.hooknhunt.com/api/v2/hrm/permissions/grouped \
  -H "Origin: https://probesh.hooknhunt.com" \
  -H "Access-Control-Request-Method: GET" \
  -X OPTIONS
```

---

## Rollback Plan

If something goes wrong:

1. **Backend**: Revert to previous `.env` and run `php artisan config:clear`
2. **Frontend**: Keep previous build backup and restore if needed
3. **Database**: Run `php artisan migrate:rollback` if migration fails

---

## Support

For issues or questions:
- Check Laravel logs: `storage/logs/laravel.log`
- Check web server logs: `/var/log/nginx/error.log`
- Check PHP logs: `/var/log/php8.4-fpm.log`
