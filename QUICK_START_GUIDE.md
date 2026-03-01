# Quick Start Guide - Microservices Architecture

**What I've Built For You:**

✅ **Shared Events Package** - Event definitions for service communication
✅ **Auth Service** - First microservice (authentication, registration, OTP)
✅ **API Gateway** - Single entry point for all frontend requests
✅ **Directory Structure** - Ready for 18 microservices

---

## Project Structure Overview

```
hooknhunt/
├── services/
│   ├── gateway/                 # API Gateway (Port 8000) ✅
│   ├── auth-service/            # Auth Service (Port 8001) ✅
│   ├── catalog-service/         # TODO: Extract from monolith
│   ├── inventory-service/       # TODO: Extract from monolith
│   ├── sales-service/           # TODO: Extract from monolith
│   └── ... (15 more services)
│
├── shared/                       # Shared code between services ✅
│   ├── events/                  # Event definitions
│   ├── dto/                     # Data Transfer Objects
│   ├── middleware/              # Shared middleware
│   └── utils/                   # Shared utilities
│
├── hooknhunt-api/               # Legacy monolith (keep for reference)
├── storefront/                  # Next.js storefront (unchanged)
└── frontend/                    # React admin panel (unchanged)
```

---

## What's Ready to Use Right Now?

### 1. Shared Events Package (`shared/`)

**Purpose**: Define events that services dispatch and listen to.

**Events Created**:
- `OrderCreated` - Sales → Inventory, Logistics, Finance
- `PurchaseOrderReceived` - Procurement → Inventory, Finance
- `PaymentReceived` - Finance → Sales, Wallet
- `ProductCreated` - Catalog → Procurement, Sales
- `ShipmentDelivered` - Logistics → Sales, CRM
- `StockLowAlert` - Inventory → Procurement, Sales
- `UserRegistered` - Auth → CRM, Sales
- `ExpenseApproved` - Finance → Audit

**Location**: [shared/events/](/Applications/MAMP/htdocs/hooknhunt/shared/events/)

### 2. Auth Service (`services/auth-service/`)

**Purpose**: Handle user authentication, registration, OTP verification.

**Features**:
- ✅ User registration with phone/email
- ✅ OTP-based phone verification
- ✅ Login with phone/email + password
- ✅ Token management (Laravel Sanctum)
- ✅ Profile management
- ✅ Password change
- ✅ Logout
- ✅ Events dispatching (UserRegistered)

**API Endpoints**:
```
POST /api/auth/register          # Register new user
POST /api/auth/verify-otp        # Verify phone with OTP
POST /api/auth/resend-otp        # Resend OTP
POST /api/auth/login             # Login user
GET  /api/auth/me                # Get current user (protected)
PUT  /api/auth/profile           # Update profile (protected)
PUT  /api/auth/change-password   # Change password (protected)
POST /api/auth/logout            # Logout (protected)
GET  /api/auth/health            # Health check
```

**Database Tables**:
- `users` - User credentials and profiles
- `otps` - OTP verification codes

**Location**: [services/auth-service/](/Applications/MAMP/htdocs/hooknhunt/services/auth-service/)

### 3. API Gateway (`services/gateway/`)

**Purpose**: Single entry point for all frontend requests. Routes to appropriate microservice.

**Features**:
- ✅ Request routing to microservices
- ✅ Forward authentication headers
- ✅ Health monitoring
- ✅ Error handling
- ✅ Request logging

**Service Routing**:
```
/api/auth/*         → auth-service (8001)
/api/catalog/*      → catalog-service (8003)
/api/inventory/*    → inventory-service (8004)
/api/sales/*        → sales-service (8006)
/api/finance/*      → finance-service (8008)
... and more
```

**Location**: [services/gateway/](/Applications/MAMP/htdocs/hooknhunt/services/gateway/)

---

## How to Use (Step-by-Step)

### Step 1: Install Laravel Core Files

**Note**: The services need Laravel's core files (bootstrap, public, etc.). Copy from existing monolith:

```bash
# Copy Laravel core files to auth-service
cp -r hooknhunt-api/bootstrap services/auth-service/
cp -r hooknhunt-api/public services/auth-service/
cp -r hooknhunt-api/config services/auth-service/
cp hooknhunt-api/.gitignore services/auth-service/
cp hooknhunt-api/artisan services/auth-service/

# Copy Laravel core files to gateway
cp -r hooknhunt-api/bootstrap services/gateway/
cp -r hooknhunt-api/public services/gateway/
cp -r hooknhunt-api/config services/gateway/
cp hooknhunt-api/.gitignore services/gateway/
cp hooknhunt-api/artisan services/gateway/
```

### Step 2: Install Dependencies

```bash
# Install shared package (events)
cd shared
composer install
cd ..

# Install auth-service
cd services/auth-service
composer install
cd ../..

# Install gateway
cd services/gateway
composer install
cd ../..
```

### Step 3: Configure Environment

```bash
# Configure auth-service
cd services/auth-service
cp .env.example .env
php artisan key:generate

# Edit .env with your database credentials
nano .env
# Set: DB_DATABASE=hooknhunt, DB_USERNAME=root, DB_PASSWORD=root

cd ../..

# Configure gateway
cd services/gateway
cp .env.example .env
php artisan key:generate
cd ../..
```

### Step 4: Run Migrations

```bash
cd services/auth-service
php artisan migrate
cd ../..
```

### Step 5: Start Services

```bash
# Terminal 1: Start Auth Service (Port 8001)
cd services/auth-service
php artisan serve --port=8001

# Terminal 2: Start API Gateway (Port 8000)
cd services/gateway
php artisan serve --port=8000
```

### Step 6: Test Auth Service Directly

```bash
# Test health check
curl http://localhost:8001/api/health

# Test registration
curl -X POST http://localhost:8001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "01712345678",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

# Check OTP in logs
tail -f services/auth-service/storage/logs/laravel.log

# Test OTP verification (use OTP from logs)
curl -X POST http://localhost:8001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "01712345678",
    "otp": "1234"
  }'
```

### Step 7: Test Gateway Routing

```bash
# Test gateway health check
curl http://localhost:8000/api/health

# Test routing to auth-service
curl http://localhost:8000/api/auth/health

# Test registration through gateway
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Gateway User",
    "phone": "01712345679",
    "email": "gateway@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

---

## Frontend Integration

### Update Admin Panel API URL

**File**: [hooknhunt-api/resources/js/lib/api.ts](/Applications/MAMP/htdocs/hooknhunt/hooknhunt-api/resources/js/lib/api.ts)

```typescript
// Change from:
const API_BASE_URL = 'http://localhost:8000/api/v2'

// To:
const API_BASE_URL = 'http://localhost:8000/api'
```

### Update Storefront API URL

**File**: [storefront/.env.local](/Applications/MAMP/htdocs/hooknhunt/storefront/.env.local)

```bash
# Change from:
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# To:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Next Steps (Your Choice)

### Option A: Continue Extracting Services

I can extract the remaining services from the monolith one by one:

1. **catalog-service** (Products, Categories, Brands)
2. **inventory-service** (Warehouses, Stock)
3. **sales-service** (Orders, POS, Customers)
4. **finance-service** (Accounts, Journals, Reports)
5. And 11 more...

**Each service extraction will:**
- Copy relevant code from monolith
- Create database migrations with table prefixes
- Set up event listeners
- Make service independently runnable
- Test service works via gateway

### Option B: Setup Production Infrastructure

Set up Docker Compose for easy orchestration:

```yaml
# docker-compose.yml
services:
  gateway:
    build: ./services/gateway
    ports: ["8000:8000"]

  auth-service:
    build: ./services/auth-service
    ports: ["8001:8001"]

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: hooknhunt
```

### Option C: Build Event System

Set up the event bus service for inter-service communication:

1. Create `event-bus-service`
2. Set up Redis for pub/sub
3. Create event listeners in each service
4. Test event flow: Sales creates order → Inventory reserves stock

---

## Common Questions

### Q: Do I need to delete the monolith?

**A**: No! Keep `hooknhunt-api/` as reference. Extract services gradually, test them, then migrate frontend.

### Q: Can I copy auth-service to another project?

**A**: Yes! Just copy:
- `services/auth-service/` folder
- Database tables: `users`, `otps`
- Update `.env` for new project's database

### Q: How do services communicate?

**A**: Via events (async) or HTTP (sync):
- **Async**: `event(new OrderCreated($order))` → Other services listen
- **Sync**: `Http::get('http://catalog:8003/api/products')`

### Q: What about foreign keys between services?

**A**: Services don't have foreign keys to other services' tables. They reference by ID only:
- `orders` table has `customer_id` (no foreign key constraint)
- Event-based updates keep data in sync

---

## File Summary

### Created Files (Summary)

| File | Purpose | Status |
|------|---------|--------|
| `shared/events/Event.php` | Base event class | ✅ Complete |
| `shared/events/OrderCreated.php` | Event definitions | ✅ Complete |
| `shared/composer.json` | Shared package config | ✅ Complete |
| `services/auth-service/composer.json` | Auth service config | ✅ Complete |
| `services/auth-service/.env.example` | Environment template | ✅ Complete |
| `services/auth-service/README.md` | Auth service docs | ✅ Complete |
| `services/auth-service/app/Models/User.php` | User model | ✅ Complete |
| `services/auth-service/app/Models/Otp.php` | OTP model | ✅ Complete |
| `services/auth-service/app/Http/Controllers/AuthController.php` | Auth controller | ✅ Complete |
| `services/auth-service/routes/api.php` | Auth routes | ✅ Complete |
| `services/auth-service/database/migrations/*` | DB migrations | ✅ Complete |
| `services/auth-service/config/service.php` | Service config | ✅ Complete |
| `services/gateway/composer.json` | Gateway config | ✅ Complete |
| `services/gateway/.env.example` | Environment template | ✅ Complete |
| `services/gateway/README.md` | Gateway docs | ✅ Complete |
| `services/gateway/app/Services/ProxyService.php` | Proxy logic | ✅ Complete |
| `services/gateway/app/Http/Controllers/GatewayController.php` | Gateway controller | ✅ Complete |
| `services/gateway/routes/api.php` | Gateway routes | ✅ Complete |
| `services/gateway/config/services.php` | Service URLs | ✅ Complete |
| `MODULAR_ARCHITECTURE_PLAN.md` | Full architecture plan | ✅ Complete |
| `IMPLEMENTATION_ROADMAP.md` | Implementation roadmap | ✅ Complete |

---

## What Should I Do Next?

I'm ready to help you with:

1. **Set up Laravel core files** - Copy bootstrap/, public/, etc. to services
2. **Test auth-service** - Run migrations, test registration/login
3. **Extract next service** - Catalog, Inventory, Sales, or Finance
4. **Set up Docker Compose** - Orchestrate all services
5. **Build event system** - Create event-bus-service
6. **Update frontend** - Connect admin panel and storefront to gateway

**What would you like to do?**
