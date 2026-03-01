# Auth Service

Authentication & Authorization microservice for Hook & Hunt ERP.

## Overview

- **Purpose**: Handle user authentication, registration, OTP verification
- **Port**: 8001
- **API Prefix**: `/api/auth`
- **Dependencies**: None (foundation service)

## Features

- ✅ User registration (email/phone)
- ✅ User login (phone/email + password)
- ✅ OTP-based verification
- ✅ Password reset
- ✅ Token management (Laravel Sanctum)
- ✅ Super admin registration
- ✅ Customer registration/login

## Database Tables

| Table | Purpose |
|-------|---------|
| `auth_users` | User credentials and profiles |
| `auth_otps` | OTP verification codes |
| `auth_password_reset_tokens` | Password reset tokens |

## API Endpoints

### Public Endpoints

```
POST /api/auth/register
POST /api/auth/register-super-admin
POST /api/auth/verify-otp
POST /api/auth/resend-otp
POST /api/auth/login
POST /api/auth/customer/login
POST /api/auth/customer/register
```

### Protected Endpoints (Require Auth)

```
POST /api/auth/logout
GET  /api/auth/me
PUT  /api/auth/profile
PUT  /api/auth/change-password
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd services/auth-service
composer install
```

### 2. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

Update `.env`:
```
DB_DATABASE=hooknhunt
DB_USERNAME=root
DB_PASSWORD=root
SERVICE_NAME=auth-service
SERVICE_PORT=8001
```

### 3. Run Migrations

```bash
php artisan migrate
```

### 4. Start Service

```bash
php artisan serve --port=8001
```

Service will be available at: http://localhost:8001

## Testing

### Register Super Admin

```bash
curl -X POST http://localhost:8001/api/auth/register-super-admin \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "admin@hooknhunt.com",
    "phone": "01712345678",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login_id": "01712345678",
    "password": "password123"
  }'
```

### Get Profile (Protected)

```bash
curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Event Dispatching

This service dispatches the following events:

- `UserRegistered` - When new user registers
  - Consumers: crm-service, sales-service

## Dependencies

- **Laravel Framework**: ^11.0
- **Laravel Sanctum**: ^4.0
- **hooknhunt/shared**: Local shared package

## Port Conflicts

If port 8001 is in use, change in `.env`:
```
SERVICE_PORT=8001
```

Then start with:
```bash
php artisan serve --port=$SERVICE_PORT
```

## Health Check

```bash
curl http://localhost:8001/api/health
```

Response:
```json
{
  "status": "ok",
  "service": "auth-service",
  "version": "1.0.0"
}
```

## Logs

Logs are stored in `storage/logs/laravel.log`

```bash
tail -f storage/logs/laravel.log
```

## Error Handling

All errors return consistent JSON format:

```json
{
  "status": false,
  "message": "Error description",
  "errors": {
    "field": ["Validation error"]
  }
}
```

## Security

- ✅ Rate limiting on login (5 requests per minute)
- ✅ Rate limiting on OTP (5 requests per minute)
- ✅ Password hashing (bcrypt)
- ✅ Token expiration (configurable)
- ✅ HTTPS recommended for production

## Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate secure `APP_KEY`
- [ ] Configure production database
- [ ] Set `SANCTUM_STATEFUL_DOMAINS`
- [ ] Configure HTTPS
- [ ] Set up log rotation
- [ ] Configure SMS gateway for OTP
- [ ] Set up queue worker (if using Redis/Beanstalkd)

## Support

For issues or questions, contact the development team.
