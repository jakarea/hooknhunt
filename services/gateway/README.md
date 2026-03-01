# API Gateway

Single entry point for all frontend requests to Hook & Hunt microservices.

## Overview

- **Purpose**: Route requests to appropriate microservice, handle authentication
- **Port**: 8000
- **Architecture**: Lightweight Laravel application

## Features

- ✅ Route requests to microservices
- ✅ Centralized authentication (via auth-service)
- ✅ CORS handling
- ✅ Rate limiting
- ✅ Request logging
- ✅ Health monitoring

## Service Routing

All requests follow this pattern:

```
Frontend → Gateway → Validates Token → Routes to Service → Response → Frontend
```

### Route Prefix Mapping

| Route Prefix | Service | Port |
|--------------|---------|------|
| `/api/auth/*` | auth-service | 8001 |
| `/api/users/*` | user-service | 8013 |
| `/api/settings/*` | settings-service | 8014 |
| `/api/media/*` | media-service | 8015 |
| `/api/catalog/*` | catalog-service | 8003 |
| `/api/inventory/*` | inventory-service | 8004 |
| `/api/procurement/*` | procurement-service | 8005 |
| `/api/sales/*` | sales-service | 8006 |
| `/api/logistics/*` | logistics-service | 8007 |
| `/api/finance/*` | finance-service | 8008 |
| `/api/hrm/*` | hrm-service | 8009 |
| `/api/crm/*` | crm-service | 8010 |
| `/api/wallet/*` | wallet-service | 8011 |
| `/api/cms/*` | cms-service | 8012 |
| `/api/public/*` | public-service | 8018 |

## Setup Instructions

### 1. Install Dependencies

```bash
cd services/gateway
composer install
```

### 2. Configure Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 3. Start Gateway

```bash
php artisan serve --port=8000
```

Gateway will be available at: http://localhost:8000

## Request Flow

### Authenticated Request

```
1. Frontend sends request with token:
   GET /api/users
   Headers: Authorization: Bearer TOKEN

2. Gateway validates token with auth-service:
   GET http://localhost:8001/api/auth/me
   Headers: Authorization: Bearer TOKEN

3. If valid, Gateway forwards to user-service:
   GET http://localhost:8013/api/users
   Headers: X-User-Id: 123, X-User-Type: admin

4. User-service responds, Gateway returns to frontend
```

### Public Request

```
1. Frontend sends request (no token):
   POST /api/auth/login
   Body: {login_id, password}

2. Gateway forwards directly to auth-service:
   POST http://localhost:8001/api/auth/login
   Body: {login_id, password}

3. Auth-service responds, Gateway returns to frontend
```

## Testing

### Health Check

```bash
curl http://localhost:8000/api/health
```

### Proxy Test

```bash
# Test routing to auth-service
curl http://localhost:8000/api/auth/health

# Test routing to catalog-service
curl http://localhost:8000/api/catalog/health
```

## Configuration

### Service URLs

Edit `config/services.php`:

```php
return [
    'auth' => env('SERVICE_AUTH_URL', 'http://localhost:8001'),
    'catalog' => env('SERVICE_CATALOG_URL', 'http://localhost:8003'),
    // ... other services
];
```

### Route Exclusions

Some routes bypass authentication:

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    // Public routes (no auth)
    Route::post('/login', 'GatewayController@forward');
    Route::post('/register', 'GatewayController@forward');

    // Protected routes (auth required)
    Route::middleware('auth.gateway')->group(function () {
        Route::get('/me', 'GatewayController@forward');
        Route::post('/logout', 'GatewayController@forward');
    });
});
```

## Error Handling

Gateway standardizes error responses:

```json
{
  "status": false,
  "message": "Service unavailable",
  "errors": {
    "service": "auth-service",
    "reason": "Connection refused"
  }
}
```

## Logging

All requests are logged:

```bash
tail -f storage/logs/gateway.log
```

Log format:
```
[2024-01-01 10:00:00] GET /api/users → user-service → 200 OK
```

## Performance

- Gateway adds ~10-20ms latency per request
- HTTP/2 recommended for production
- Enable Redis for caching responses

## Deployment

### Production Checklist

- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure HTTPS
- [ ] Set up load balancer (nginx/AWS ELB)
- [ ] Enable Redis for caching
- [ ] Configure rate limiting
- [ ] Set up monitoring (Sentry/New Relic)
- [ ] Configure service health checks

## Support

For issues or questions, contact the development team.
