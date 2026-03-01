# Implementation Roadmap
## Microservices Migration - Hook & Hunt ERP

**Architecture Decisions Confirmed:**
- ✅ API Gateway: YES (Single entry point)
- ✅ Environment: MAMP + Artisan Serve (multiple ports)
- ✅ Git: Monorepo (all services in one repo)
- ✅ First Priority: Auth Service (foundation for everything else)

---

## Project Structure (After Migration)

```
hooknhunt/
├── services/                          # All microservices
│   ├── gateway/                       # API Gateway (Port 8000)
│   │   ├── app/                       # Laravel/Lumen gateway
│   │   ├── routes/api.php             # Route all /api/* requests
│   │   └── config/services.php        # Service registry
│   │
│   ├── auth-service/                  # Authentication (Port 8001)
│   │   ├── app/
│   │   │   ├── Http/Controllers/      # AuthController
│   │   │   ├── Models/                # User, Otp
│   │   │   └── Services/              # AuthService
│   │   ├── routes/api.php             # /api/auth/* routes
│   │   ├── database/migrations/       # auth_users, auth_otps
│   │   ├── .env                       # DB connection, port 8001
│   │   └── README.md
│   │
│   ├── catalog-service/               # Product Catalog (Port 8003)
│   ├── inventory-service/             # Stock Management (Port 8004)
│   ├── procurement-service/           # Purchase Orders (Port 8005)
│   ├── sales-service/                 # Sales & POS (Port 8006)
│   ├── logistics-service/             # Shipping (Port 8007)
│   ├── finance-service/               # Accounting (Port 8008)
│   ├── hrm-service/                   # HR & Payroll (Port 8009)
│   ├── crm-service/                   # CRM (Port 8010)
│   ├── wallet-service/                # Wallets (Port 8011)
│   ├── cms-service/                   # CMS (Port 8012)
│   ├── user-service/                  # Users/Roles (Port 8013)
│   ├── settings-service/              # Settings (Port 8014)
│   ├── media-service/                 # Files (Port 8015)
│   ├── event-bus-service/             # Events (Port 8016)
│   ├── audit-service/                 # Audit logs (Port 8017)
│   └── public-service/                # Public API (Port 8018)
│
├── shared/                            # Shared code between services
│   ├── dto/                           # Data Transfer Objects
│   ├── events/                        # Event definitions
│   ├── middleware/                    # Shared middleware
│   └── utils/                         # Helpers
│
├── hooknhunt-api/                     # Legacy monolith (backup)
├── storefront/                        # Next.js storefront (unchanged)
└── docker-compose.yml                 # Docker orchestration (optional)
```

---

## Port Allocation

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| **Gateway** | 8000 | http://localhost:8000 | Single entry point |
| **Auth** | 8001 | http://localhost:8001 | Authentication |
| **User** | 8013 | http://localhost:8013 | User/Roles/Permissions |
| **Settings** | 8014 | http://localhost:8014 | System settings |
| **Media** | 8015 | http://localhost:8015 | File storage |
| **Catalog** | 8003 | http://localhost:8003 | Products/Categories |
| **Inventory** | 8004 | http://localhost:8004 | Stock/Warehouses |
| **Procurement** | 8005 | http://localhost:8005 | Purchase orders |
| **Sales** | 8006 | http://localhost:8006 | Orders/POS |
| **Logistics** | 8007 | http://localhost:8007 | Shipping |
| **Finance** | 8008 | http://localhost:8008 | Accounting |
| **HRM** | 8009 | http://localhost:8009 | HR/Payroll |
| **CRM** | 8010 | http://localhost:8010 | Leads/Customers |
| **Wallet** | 8011 | http://localhost:8011 | Wallets |
| **CMS** | 8012 | http://localhost:8012 | Content/Tickets |
| **Event Bus** | 8016 | http://localhost:8016 | Events |
| **Audit** | 8017 | http://localhost:8017 | Logs |
| **Public** | 8018 | http://localhost:8018 | Guest API |

---

## Step 1: Setup Foundation (Today)

1. **Create directory structure**
   ```bash
   mkdir -p services
   mkdir -p shared/{dto,events,middleware,utils}
   ```

2. **Create service template**
   - Standard Laravel project structure
   - Service-specific .env file
   - README with setup instructions
   - API routes with prefix

3. **Extract auth-service**
   - Move auth-related code from monolith
   - Create database migrations with `auth_` prefix
   - Set up Sanctum for authentication
   - Test independently

4. **Create API Gateway**
   - Simple Laravel/Lumen app
   - Route all requests to appropriate service
   - Add authentication middleware
   - Test routing

---

## Step 2: Extract Core Services (Next Week)

5. Extract user-service (Users, Roles, Permissions)
6. Extract settings-service (Settings, Units)
7. Extract media-service (Files, Folders)
8. Set up event-bus-service (Event dispatcher)

---

## Step 3: Extract Business Services (Following Weeks)

9. Extract catalog-service
10. Extract inventory-service
11. Extract procurement-service
12. Extract sales-service
13. Extract logistics-service
14. Extract finance-service
15. Extract remaining services

---

## Development Workflow

### Starting All Services

```bash
# Start Gateway (Terminal 1)
cd services/gateway
php artisan serve --port=8000

# Start Auth Service (Terminal 2)
cd services/auth-service
php artisan serve --port=8001

# Start Catalog Service (Terminal 3)
cd services/catalog-service
php artisan serve --port=8003

# ... repeat for all services
```

### Frontend Configuration

```javascript
// Admin Panel (resources/js/lib/api.ts)
const API_BASE_URL = 'http://localhost:8000/api'

// Storefront (.env.local)
NEXT_PUBLIC_API_URL = 'http://localhost:8000/api/v1'
```

### API Gateway Routing

```php
// services/gateway/routes/api.php
Route::prefix('auth')->group(function () {
    Route::any('{any}', function ($any) {
        return ProxyService::forwardTo('auth-service', $any);
    })->where('any', '.*');
});

Route::prefix('catalog')->group(function () {
    Route::any('{any}', function ($any) {
        return ProxyService::forwardTo('catalog-service', $any);
    })->where('any', '.*');
});

// ... repeat for all services
```

---

## Authentication Flow

```
┌─────────┐      ┌─────────┐      ┌──────────────┐      ┌────────────┐
│ Frontend│ ───> │ Gateway │ ───> │ Auth Service │ ───> │  Database  │
└─────────┘      └─────────┘      └──────────────┘      └────────────┘
                      │
                      │ Token valid?
                      ↓
              ┌──────────────┐
              │ Set X-User-Id │
              │ header        │
              └──────────────┘
                      │
                      ↓
              ┌──────────────┐
              │ Route to     │
              │ target svc   │
              └──────────────┘
```

---

## Database Migration Strategy

### Current Tables → New Tables

| Current Table | New Table | Service |
|---------------|-----------|---------|
| `users` | `auth_users` | auth-service |
| `otps` | `auth_otps` | auth-service |
| `products` | `catalog_products` | catalog-service |
| `categories` | `catalog_categories` | catalog-service |
| `chart_of_accounts` | `finance_accounts` | finance-service |
| `journal_entries` | `finance_journal_entries` | finance-service |
| ... | ... | ... |

### Migration Script

```php
// artisan migrate:to-microservice

// 1. Rename tables
DB::statement('RENAME TABLE users TO auth_users');
DB::statement('RENAME TABLE products TO catalog_products');

// 2. Update foreign keys
// 3. Update model $table properties
// 4. Update API responses
```

---

## Testing Strategy

### Service Independence Test

```bash
# Test auth-service independently
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login_id":"01712345678","password":"password"}'

# Test via gateway
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"login_id":"01712345678","password":"password"}'
```

### Event Communication Test

```php
// Dispatch event in sales-service
event(new \Shared\Events\OrderCreated($order));

// Listen in inventory-service
class ReserveStock implements ShouldQueue
{
    public function handle(OrderCreated $event)
    {
        // Reserve stock for order
    }
}
```

---

## Rollback Plan

If anything goes wrong:

1. Keep `hooknhunt-api/` monolith intact (backup)
2. Git branches for each service extraction
3. Can revert by switching branches
4. Frontend can point to monolith API during transition

---

## Success Criteria

✅ Auth service runs independently on port 8001
✅ Gateway routes requests correctly to auth service
✅ Frontend can authenticate via gateway
✅ Removing catalog-service doesn't crash auth service
✅ Copying auth-service to another project works (with DB tables)
✅ Events are dispatched and received between services

---

## Ready to Start?

I can now help you with:

1. **Create directory structure** - Set up services/ and shared/ folders
2. **Create service template** - Reusable Laravel service scaffold
3. **Extract auth-service** - First microservice
4. **Create API Gateway** - Single entry point
5. **Test integration** - Verify everything works

Which would you like to start with?
