# Microservices Modular Architecture Plan
## Hook & Hunt ERP - Refactoring Blueprint

**Status**: DRAFT - Awaiting User Approval
**Created**: 2026-02-28
**Target**: Transform monolithic Laravel app into independent microservices

---

## Architecture Decisions (Based on Your Selections)

✅ **Pattern**: Microservices (Separate API Services)
✅ **Database**: Single Shared Database (easiest for cross-module queries)
✅ **Dependencies**: No explicit dependencies (all modules independent)
✅ **Communication**: Event/Listener System (async, fire-and-forget)

---

## Module Breakdown

### Common/Shared Services (Required by all modules)
These are foundation services that other modules depend on:

| Service | Purpose | API Prefix | Key Features |
|---------|---------|------------|--------------|
| **auth-service** | Authentication & Authorization | `/api/auth` | Login, Register, OTP, Token validation, Sanctum |
| **user-service** | User & Role Management | `/api/users` | Users, Roles, Permissions, Profiles |
| **settings-service** | Global Settings & Config | `/api/settings` | System settings, Units, Preferences |
| **media-service** | File Storage & Management | `/api/media` | Upload, folders, CDN, image optimization |
| **event-bus-service** | Inter-Module Communication | `/api/events` | Event dispatcher, Webhooks, Event logs |
| **audit-service** | Audit Trail & Logging | `/api/audit` | Activity logs, Document tracking |

### Business Domain Services (Independent)

| Service | Purpose | API Prefix | Key Features |
|---------|---------|------------|--------------|
| **catalog-service** | Product Catalog | `/api/catalog` | Products, Categories, Brands, Attributes, Discounts |
| **inventory-service** | Stock Management | `/api/inventory` | Warehouses, Stock, Adjustments, Batches, Sorting |
| **procurement-service** | Purchase Management | `/api/procurement` | Purchase Orders, Supplier Products, PO Approvals |
| **sales-service** | Sales & POS | `/api/sales` | Customers, POS, Orders, Returns, Quotes |
| **logistics-service** | Shipping & Delivery | `/api/logistics` | Shipments, Couriers, Tracking, Workflow |
| **finance-service** | Accounting & Finance | `/api/finance` | Chart of Accounts, Journals, Expenses, Reports, Banks |
| **hrm-service** | HR & Payroll | `/api/hrm` | Staff, Departments, Attendance, Leaves, Payroll |
| **crm-service** | Customer Relations | `/api/crm` | Leads, Activities, Campaigns, Segments |
| **wallet-service** | Wallet Management | `/api/wallet` | Wallets, Transactions, Balance, Freeze |
| **cms-service** | Content Management | `/api/cms` | Landing pages, Menus, Banners, Support tickets |
| **public-service** | Public/Guest API | `/api/public` | Public products, Categories, Lead capture |

---

## Directory Structure

```
hooknhunt/
├── services/                           # All microservices
│   ├── auth-service/                   # Authentication microservice
│   │   ├── app/
│   │   ├── routes/
│   │   ├── config/
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   └── README.md
│   ├── user-service/                   # User management
│   ├── settings-service/               # System settings
│   ├── media-service/                  # File storage
│   ├── event-bus-service/              # Event communication
│   ├── audit-service/                  # Audit logs
│   ├── catalog-service/                # Product catalog
│   ├── inventory-service/              # Stock management
│   ├── procurement-service/            # Purchase orders
│   ├── sales-service/                  # Sales & POS
│   ├── logistics-service/              # Shipping
│   ├── finance-service/                # Accounting
│   ├── hrm-service/                    # HR & payroll
│   ├── crm-service/                    # CRM
│   ├── wallet-service/                 # Wallets
│   ├── cms-service/                    # CMS
│   └── public-service/                 # Public API
│
├── shared/                             # Shared code between services
│   ├── dto/                            # Data Transfer Objects
│   ├── events/                         # Event definitions
│   ├── middleware/                     # Shared middleware
│   └── utils/                          # Shared utilities
│
├── gateway/                            # API Gateway (Optional)
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── README.md
│
├── frontend/                           # Frontend applications
│   ├── admin-panel/                    # React Admin Panel (existing)
│   └── storefront/                     # Next.js Storefront (existing)
│
├── docker-compose.yml                  # Orchestrate all services
├── .env.example                        # Environment variables
└── README.md                           # Project documentation
```

---

## Database Structure

**Single Shared Database**: `hooknhunt_db`

**Table Naming Convention**: `{service}_{table_name}`

```
hooknhunt_db/
├── auth_users                          # auth-service
├── auth_otps                           # auth-service
├── user_users                          # user-service
├── user_roles                          # user-service
├── user_permissions                    # user-service
├── user_user_permissions               # user-service
├── settings_settings                   # settings-service
├── settings_units                      # settings-service
├── media_folders                       # media-service
├── media_files                         # media-service
├── catalog_products                    # catalog-service
├── catalog_categories                  # catalog-service
├── catalog_brands                      # catalog-service
├── inventory_stock                     # inventory-service
├── inventory_warehouses                # inventory-service
├── procurement_purchase_orders         # procurement-service
├── sales_orders                        # sales-service
├── finance_accounts                    # finance-service
├── finance_journal_entries             # finance-service
└── ... (all other tables)
```

---

## Event-Driven Communication

### Event Flow

```
[Service A] ──dispatch──> [Event Bus Service] ──broadcast──> [Service B]
                                              └─persist──> [Audit Log]
```

### Example Events

| Event | Source | Consumer(s) | Purpose |
|-------|--------|-------------|---------|
| `OrderCreated` | sales-service | inventory, logistics, finance | Reserve stock, create shipment, record revenue |
| `PurchaseOrderReceived` | procurement-service | inventory, finance | Add stock, record expense |
| `PaymentReceived` | finance-service | sales, wallet | Update order status, add wallet balance |
| `ShipmentDelivered` | logistics-service | sales, crm | Mark order complete, trigger follow-up |
| `ProductCreated` | catalog-service | procurement, sales | Notify procurement for sourcing, sales for pricing |

### Event Payload Structure

```php
// Shared/Events/OrderCreated.php
class OrderCreated implements ShouldBroadcast
{
    public array $data = [
        'event_id' => 'uuid-v4',
        'event_type' => 'OrderCreated',
        'timestamp' => '2026-02-28T10:30:00Z',
        'source_service' => 'sales-service',
        'data' => [
            'order_id' => 12345,
            'customer_id' => 999,
            'items' => [...],
            'total' => 1500.00
        ]
    ];
}
```

---

## API Gateway (Optional but Recommended)

**Purpose**: Single entry point for all frontend requests

**Benefits**:
- Unified authentication (auth-service validates, gateway forwards)
- Rate limiting per service
- Load balancing
- Request routing based on path

**Example Routing**:
```
/api/auth/*         → auth-service:8001
/api/users/*        → user-service:8002
/api/catalog/*      → catalog-service:8003
/api/finance/*      → finance-service:8004
...
```

---

## Service Template (Every Service Follows This)

```
service-name/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/                      # Business logic
│   ├── Events/                        # Events this service dispatches
│   ├── Listeners/                     # Events this service listens to
│   └── Providers/
│       ├── EventServiceProvider.php
│       └── AuthServiceProvider.php
├── routes/
│   └── api.php                        # Service routes
├── config/
│   ├── service.php                    # Service-specific config
│   └── database.php
├── database/
│   ├── migrations/
│   └── seeders/
├── tests/
│   ├── Feature/
│   └── Unit/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── composer.json
└── README.md
```

---

## Migration Strategy

### Phase 1: Setup Foundation (Week 1-2)
1. Create `services/` directory structure
2. Set up shared code repository (`shared/`)
3. Create service template (scaffold)
4. Extract auth-service (most critical, others depend on it)
5. Extract user-service
6. Extract settings-service

### Phase 2: Extract Core Services (Week 3-4)
7. Extract catalog-service (products, categories, brands)
8. Extract inventory-service (warehouses, stock)
9. Extract media-service (files, folders)
10. Set up event-bus-service
11. Set up audit-service

### Phase 3: Extract Business Services (Week 5-6)
12. Extract procurement-service
13. Extract sales-service
14. Extract logistics-service
15. Extract finance-service

### Phase 4: Extract Support Services (Week 7-8)
16. Extract hrm-service
17. Extract crm-service
18. Extract wallet-service
19. Extract cms-service
20. Extract public-service

### Phase 5: Testing & Optimization (Week 9-10)
21. Set up API Gateway
22. Docker orchestration
23. Load testing
24. Documentation
25. Deployment strategy

---

## Key Implementation Notes

### 1. Service Independence
- Each service MUST have its own `.env` file
- Each service MUST have its own `docker-compose.yml`
- Each service MUST be runnable independently
- No direct database access to other service's tables

### 2. Authentication Flow
```
Frontend → Gateway → auth-service (validate token)
                      ↓
                Gateway adds X-User-Id header
                      ↓
                Target service (trusts header)
```

### 3. Database Access
- All services connect to same database
- Use table prefixes to avoid conflicts
- Services ONLY access their own tables
- Cross-service data via events, NOT direct queries

### 4. Communication Rules
- ✅ Service A dispatches event → Service B listens and acts
- ✅ Service A calls Service B's public API (when needed)
- ❌ Service A directly queries Service B's database tables
- ❌ Service A includes Service B's models/controllers

### 5. Frontend Integration
```
Admin Panel (React) → API Gateway → Routes to microservices
Storefront (Next.js) → API Gateway → Routes to microservices
```

---

## Benefits of This Architecture

✅ **Independent Deployment**: Deploy catalog-service without touching finance
✅ **Technology Flexibility**: Use Laravel for some, Lumen for others
✅ **Scalability**: Scale high-traffic services independently (sales, public)
✅ **Team Autonomy**: Different teams can own different services
✅ **Failure Isolation**: One service down doesn't crash everything
✅ **Copy-Paste Ready**: Any service can be copied to another project

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Network latency | Slower inter-service calls | Use events (async), cache responses |
| Distributed transactions | Data consistency | Event sourcing, eventual consistency |
| Service discovery | How to find services | Use API Gateway or Consul |
| Debugging complexity | Harder to trace errors | Centralized logging (audit-service) |
| Deployment overhead | More things to deploy | Docker Compose orchestration |

---

## Next Steps

1. **User Approval**: Confirm this architecture plan
2. **Environment Setup**: Create services directory structure
3. **Service Template**: Build reusable service scaffold
4. **Extract First Service**: auth-service (highest priority)
5. **Test**: Verify auth-service works independently
6. **Document**: Update plan with learnings
7. **Repeat**: Extract remaining services one by one

---

## Questions for User

1. Do you want an API Gateway, or should frontend call services directly?
2. Should we use Laravel Sanctum for all services, or JWT for service-to-service?
3. Do you want Docker for local development, or keep using MAMP?
4. Should each service have its own Git repository, or monorepo?
5. Priority order: Which services are most critical for your business?
