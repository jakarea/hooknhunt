# Environment Configuration Guide

## 📍 Overview

This project has two environments:
- **Local Development** - Your computer (localhost)
- **Production** - Live servers (https://probesh.hooknhunt.com & https://api.hooknhunt.com)

---

## 💻 Local Development Configuration

### Frontend (Mantine/React)
**File**: `/mantine/.env`

```bash
# Local Development
VITE_API_BASE_URL=http://localhost:8000/api/v2
```

**To run locally:**
```bash
cd mantine
npm install
npm run dev
```

Frontend will be available at: **http://localhost:5173**

---

### Backend (Laravel API)
**File**: `/hooknhunt-api/.env`

```bash
# Local Development
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**To run locally:**
```bash
cd hooknhunt-api
php artisan serve
```

Backend API will be available at: **http://localhost:8000**

---

## 🌐 Production Configuration

### Frontend (Mantine/React)
**File**: `/mantine/.env` (update before deploying)

```bash
# Production
VITE_API_BASE_URL=https://api.hooknhunt.com/api/v2
```

**To build for production:**
```bash
cd mantine
npm run build
```

Upload the `dist/` folder to: **https://probesh.hooknhunt.com**

---

### Backend (Laravel API)
**File**: `/hooknhunt-api/.env` (update before deploying)

```bash
# Production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.hooknhunt.com

# Sanctum Configuration
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:8000,::1,probesh.hooknhunt.com,https://probesh.hooknhunt.com

# Frontend URL
FRONTEND_URL=https://probesh.hooknhunt.com
```

**After updating .env on production:**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## 🔄 Switching Between Environments

### From Local to Production (Deploying)

**Frontend:**
1. Edit `/mantine/.env`
2. Change `VITE_API_BASE_URL` to `https://api.hooknhunt.com/api/v2`
3. Run `npm run build`
4. Upload `dist/` folder to production server

**Backend:**
1. Edit `/hooknhunt-api/.env`
2. Change `APP_ENV` to `production`
3. Change `APP_DEBUG` to `false`
4. Change `APP_URL` to `https://api.hooknhunt.com`
5. Add production domain to `SANCTUM_STATEFUL_DOMAINS`
6. Change `FRONTEND_URL` to `https://probesh.hooknhunt.com`
7. Run `php artisan config:cache`

### From Production to Local (Working Locally)

**Frontend:**
1. Edit `/mantine/.env`
2. Change `VITE_API_BASE_URL` to `http://localhost:8000/api/v2`
3. Run `npm run dev`

**Backend:**
1. Edit `/hooknhunt-api/.env`
2. Change `APP_ENV` to `local`
3. Change `APP_DEBUG` to `true`
4. Change `APP_URL` to `http://localhost:8000`
5. Remove production domains from `SANCTUM_STATEFUL_DOMAINS`
6. Change `FRONTEND_URL` to `http://localhost:5173`
7. Run `php artisan config:clear`

---

## 📝 Quick Reference

| Setting | Local Development | Production |
|---------|------------------|------------|
| **Frontend URL** | http://localhost:5173 | https://probesh.hooknhunt.com |
| **Backend API URL** | http://localhost:8000/api/v2 | https://api.hooknhunt.com/api/v2 |
| **APP_ENV** | local | production |
| **APP_DEBUG** | true | false |
| **APP_URL** | http://localhost:8000 | https://api.hooknhunt.com |

---

## ⚠️ Important Notes

1. **Never commit production .env files to git** - They contain sensitive credentials
2. **Always clear config cache** after changing .env: `php artisan config:clear` (local) or `php artisan config:cache` (production)
3. **Restart Vite dev server** after changing frontend .env
4. **Test locally first** before deploying to production
5. **Keep .env.example updated** with template configuration

---

## 🚀 Current Status

✅ **Local Development** - Configured and ready!
- Frontend: http://localhost:5173
- Backend: http://localhost:8000/api/v2

✅ **Production** - Configuration documented
- Frontend: https://probesh.hooknhunt.com
- Backend: https://api.hooknhunt.com
- See `PRODUCTION_CONFIG.md` for deployment guide

---

## 🔧 Troubleshooting

### Frontend can't connect to API
1. Check `/mantine/.env` - ensure `VITE_API_BASE_URL` is correct
2. Restart Vite dev server
3. Check if backend is running: `php artisan serve`
4. Verify CORS settings in backend

### Authentication fails in production
1. Ensure `SANCTUM_STATEFUL_DOMAINS` includes your production domain
2. Clear config cache: `php artisan config:cache`
3. Check HTTPS is properly configured
4. Verify SSL certificate is valid

### Mixed content errors
1. Ensure all URLs use HTTPS in production
2. Check `VITE_API_BASE_URL` uses `https://` in production
3. Verify SSL certificates are properly installed
