# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. This is a **hybrid monorepo** containing:

1. **Laravel API Backend** (`hooknhunt-api/`) - REST API with enterprise modular architecture (V2)
2. **React Admin Panel** (`hooknhunt-api/resources/js/`) - Mantine UI SPA built with React + Vite
3. **Next.js Storefront** (`storefront/`) - Customer-facing e-commerce frontend

**Tech Stack**:
- Backend: PHP 8.2+, Laravel 12, Laravel Sanctum (auth), Pest (testing)
- Admin Panel: React 18, TypeScript, Vite, Mantine UI, Zustand, React Router v7, Tailwind CSS 4
- Storefront: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand
- Mobile: Capacitor 8 (for Android/iOS apps from the admin panel)

## Common Development Commands

### Laravel API Backend
```bash
cd hooknhunt-api

# Setup (first time) - installs deps, creates .env, generates key, runs migrations, builds frontend
composer run setup

# Development (runs Laravel server, queue, logs, and Vite concurrently)
composer run dev

# Testing (uses Pest)
composer run test
# Or run specific test file
./vendor/bin/pest tests/Feature/ExampleTest.php

# Database operations
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed

# Generate new code
php artisan make:migration create_example_table
php artisan make:controller Api/V2/ExampleController
php artisan make:model Example -m
php artisan make:request StoreExampleRequest
php artisan make:factory ExampleFactory

# Cache management
php artisan optimize:clear
php artisan config:clear
php artisan route:clear

# Queue operations
php artisan queue:work
php artisan queue:failed-table

# Tinker for quick testing
php artisan tinker
```

### React Admin Panel
```bash
cd hooknhunt-api/resources/js
npm run dev          # Start Vite dev server (hot reload)
npm run build        # Production build
npm run lint         # ESLint
```

### Next.js Storefront
```bash
cd storefront
npm run dev          # Start Next.js dev server with turbopack (http://localhost:3000)
npm run build        # Production build with turbopack
npm run start        # Start production server
npm run lint         # ESLint
```

**Note**: The storefront uses API rewrites to proxy `/api/v1/*` requests to the Laravel backend (configured in `next.config.ts`). Update the `destination` URL if your backend runs on a different host/port.

## Architecture Overview

### API Route Structure (V2 - Enterprise Modular)

All V2 API routes are in `routes/api.php` under the `/api/v2` prefix:

- **`/api/v2/auth/*`**: Authentication (login, register, OTP) - Public
- **`/api/v2/system/*`**: Settings, units - Protected
- **`/api/v2/user-management/*`**: Users, roles, permissions, suppliers - Protected
- **`/api/v2/media/*`**: Media library - Protected
- **`/api/v2/catalog/*`**: Products, categories, brands, pricing, discounts - Protected
- **`/api/v2/inventory/*`**: Warehouses, stock, adjustments, sorting - Protected
- **`/api/v2/sales/*`**: Customers, POS, orders, returns - Protected
- **`/api/v2/logistics/*`**: Shipments, couriers - Protected
- **`/api/v2/hrm/*`**: Staff, departments, attendance, payroll, roles, permissions - Protected
- **`/api/v2/crm/*`**: Leads, customers, activities, campaigns - Protected
- **`/api/v2/wallet/*`**: Wallet management - Protected
- **`/api/v2/finance/*`**: Accounts, banks, expenses, reports - Protected
- **`/api/v2/cms/*`**: Tickets, landing pages, menus, banners, payments - Protected
- **`/api/v2/admin/*`**: Audit logs - Admin only
- **`/api/v2/public/*`**: Public products/categories, lead capture - Public

**Middleware**: All protected routes use `auth` middleware (Laravel Sanctum). Role-based access control is handled via permission checks.

**Response Format**: The `CamelCaseResponse` middleware automatically converts all JSON response keys from snake_case (Laravel default) to camelCase (JavaScript convention). Frontend code should expect camelCase properties.

### Legacy V1 Routes

- **`routes/website.php`**: Storefront routes (`/api/v1/store/*`)
- **`routes/admin.php`**: Admin panel routes (`/api/v1/admin/*`)
- **`routes/web.php`**: Web routes

These are being migrated to V2 modular structure.

### Key Data Model Pattern: JSON Fields Stored as Strings

**CRITICAL**: The `category_ids` field in the `products` table is stored as a JSON **string** in MySQL (e.g., `"[1,2,3]"`), not as a native JSON array. This is due to how the data was migrated and stored.

When querying this field, you must use LIKE pattern matching:

```php
// ❌ WRONG - This won't work
Product::whereJsonContains('category_ids', $categoryId)->get();

// ✅ CORRECT - Use LIKE pattern matching
$categoryId = 1;
$patterns = [
    '[' . $categoryId . ',',   // At start: [1,
    ',' . $categoryId . ',',   // In middle: ,1,
    ',' . $categoryId . ']',   // At end: ,1]
    '[' . $categoryId . ']'    // Only one: [1]
];
$query->where(function ($q) use ($patterns) {
    foreach ($patterns as $pattern) {
        $q->orWhere('category_ids', 'LIKE', '%' . $pattern . '%');
    }
});
```

**Note**: The Product model has a `category_ids` cast to `'array'`, but this cast may not work reliably because the database stores the value as a string. Always check if the value is a string and decode it when accessing:

```php
// In Product model accessor or controller
$categoryIds = $product->category_ids;
if (is_string($categoryIds)) {
    $categoryIds = json_decode($categoryIds, true) ?? [];
}
```

### Multi-Channel Product System

**Products** (`products` table) are parent containers:
- Basic info: `base_name`, `slug`, `status` (draft/published)
- Marketing: `meta_title`, `meta_description`, `gallery_images`, `canonical_url`
- Multiple categories via `category_ids` JSON field
- Relations: `variants()`, `brand()`, `suppliers()` (belongsToMany)

**Product Variants** (`product_variants` table) are the sellable SKUs:
- Channel-specific pricing/names: `retail_price/name`, `wholesale_price/name`, `daraz_price/name`
- Landed cost (updated from PO receiving)
- Offer discounts per channel: `{channel}_offer_discount_type/value/start_date/end_date`
- Relations: `product()`, `inventory()` (hasMany), `attributeOptions()` (belongsToMany)

**No `status` column exists on `product_variants`**. Any code filtering by `variant.status` will fail.

### Authentication & Authorization

**Laravel Sanctum** handles API authentication:
- **Storefront API**: Customer authentication with OTP verification
- **Admin Panel**: Staff authentication with role-based access control (RBAC)
- **Permission-based access**: Uses Spatie-like permission system

**Admin Panel (React SPA)**:
- Uses Zustand store (`resources/js/stores/authStore.ts`) for auth state
- Token stored in localStorage as `token`
- Permissions loaded as array of slugs and full objects with group_name
- Super admin role bypasses all permission checks
- `usePermissions` hook provides convenient permission checking methods

**Permission Checking (Frontend)**:
The `usePermissions` hook (`resources/js/hooks/usePermissions.ts`) provides:
- `hasPermission(slug)` - Check single permission or array (any match)
- `hasAnyPermission(slugs[])` - Check if user has any of the permissions
- `hasAllPermissions(slugs[])` - Check if user has all permissions
- `canAccessRoute(route)` - Derive permission from route name (e.g., `/finance/banks` → `finance.banks.view`)
- `canEditProfile(userId)` / `canViewProfile(userId)` - Profile access checks
- `isSuperAdmin()` - Check if user is super admin
- `hasRole(role)` - Check if user has specific role
- `hasAccessToGroup(groupName)` - Check access to permission group
- `refreshPermissions()` - Manually refresh permissions from API

**Storefront (Next.js)**:
- Uses React Context (`storefront/src/context/AuthContext.tsx`)
- Token stored in localStorage as `auth_token`
- Caches user data as `cached_user` for offline scenarios
- Includes OTP-based registration and password reset

**Roles**: `super_admin`, `admin`, `seller`, `store_keeper`, `marketer`, `supervisor`

### Inventory System

- Stock tracked at `product_variant` level via `inventory` table
- The `inventory()` relationship on ProductVariant is `hasMany`, not `hasOne`
- A variant can have multiple inventory records (different locations/warehouses)
- To get current inventory: `$variant->inventory()->first()`

**Note**: The storefront ProductController filters by inventory in some methods (`featured`, `byCategory`), but most products don't have inventory records yet.

### Admin Panel Frontend (React SPA)

**Tech Stack**: React 18 + TypeScript + Vite + Mantine UI + Zustand + React Router v7

**Structure**:
- `resources/js/App.tsx`: Main app with all routes defined inline (file-based routing is NOT used)
- `resources/js/main.tsx`: Entry point
- `resources/js/components/`: Reusable components (sidebar, layout, etc.)
- `resources/js/app/admin/*/page.tsx`: Page components organized by module
- `resources/js/stores/`: Zustand state stores (auth, finance, ui, roles)
- `resources/js/hooks/`: Custom React hooks (usePermissions, useApi, useMobile)
- `resources/js/utils/`: Utility functions (API clients, formatters)
- `resources/js/lib/mantine-theme.ts`: Mantine theme configuration

**Key Stores**:
- `authStore.ts`: Authentication, permissions, user data
- `financeStore.ts`: Finance module state (recent items, filters)
- `uiStore.ts`: UI state (sidebar, modals, etc.)
- `rolesStore.ts`: Role management state

**Routing**: All routes are defined in `App.tsx` using React Router v7. All admin routes are under `/admin/*` and wrapped in `AdminLayout`. Path aliases are configured (`@` maps to `resources/js`).

**Navigation**: `app-sidebar-mantine.tsx` dynamically renders navigation based on user permissions using `usePermissions` hook.

**Vite Config**: The dev server runs on `localhost:5173` with HMR enabled. The `@` alias points to `resources/js`.

### Storefront Frontend (Next.js)

**Tech Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + Zustand

**Structure**:
- `src/app/`: Next.js app directory with file-based routing
- `src/components/`: React components (layout, product cards, etc.)
- `src/context/`: React Context providers (Auth, Cart)
- `src/lib/`: Utilities (API client, i18n config)

**API Client**: Custom fetch wrapper in `src/lib/api.ts` with automatic token handling.

**Authentication**: AuthContext provider wraps the app, handles token validation, and provides cached user data for better UX.

**Configuration**: `next.config.ts` includes:
- Image optimization disabled (`unoptimized: true`) for local development
- API rewrites proxy `/api/v1/*` to Laravel backend at `http://192.168.0.166:8000` (update for your environment)

## Development Patterns

### API Controller Pattern (V2)

V2 controllers follow a modular structure by business domain:

```php
namespace App\Http\Controllers\Api\V2;

class ExampleController extends Controller
{
    public function index()
    {
        $items = Example::latest()->paginate(15);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $item = Example::create($validated);
        return response()->json($item, 201);
    }
}
```

**Permission Middleware**: Routes can be protected with `CheckPermission` middleware:
```php
Route::get('items', 'ExampleController@index')->middleware('permission:items.view');
```

The middleware checks:
1. User is authenticated
2. User is super_admin (auto-passes)
3. User has the required permission (via role or direct permission)

### Frontend Page Component Pattern

Admin pages follow a consistent structure:

```tsx
import { usePermissions } from '@/hooks/usePermissions'

export default function ModulePage() {
  const { hasPermission } = usePermissions()

  if (!hasPermission('module.view')) {
    return <AccessDenied />
  }

  return (
    <AdminLayout>
      <ModuleContent />
    </AdminLayout>
  )
}
```

### State Management Pattern

Use Zustand stores for module-specific state:

```tsx
import { create } from 'zustand'

interface ModuleState {
  items: Item[]
  addItem: (item: Item) => void
}

export const useModuleStore = create<ModuleState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}))
```

### API Client Pattern

**Admin Panel**: The `api` client (`resources/js/lib/api.ts`) is configured with:
- Base URL from `VITE_API_BASE_URL` env var (defaults to `http://localhost:8000/api/v2`)
- 30-second timeout (for mobile networks)
- Auto-injects Bearer token from authStore
- Global error handling via interceptors:
  - 401 → Clears auth, redirects to login
  - 403 → Access denied toast
  - 422/400 → Returns error for component-level handling
  - 500/503 → Server error toast
- Type-safe methods via `apiMethods` (get, post, put, patch, delete)

## Frontend Development Guidelines (Mobile-First PWA)

The project is built as a **Mobile-First Progressive Web App (PWA)** that will be converted to **Android & iOS apps using Capacitor**.

### UI & Design System (STRICT)

- ✅ **Always use native Mantine UI components** - Do NOT build custom UI if Mantine has it
- ✅ **Styling with Tailwind CSS ONLY** - No inline styles, no custom CSS files
- ✅ **Icons from Tabler icons ONLY**
- ✅ **UI must feel**: Calm, Clean, Non-aggressive, Mentally relaxing for long ERP usage

### Responsive Data Rendering (ERP-Safe)

For large datasets, use conditional rendering:

```
Desktop (md+) → Table view
Mobile (< md) → Card view
```

```tsx
<table className="hidden md:block">...</table>
<div className="block md:hidden">...</div>
```

### Performance & Rendering Rules

- ❌ **NEVER re-render full pages** on data change
- ✅ **Always use**: `useMemo`, `useCallback`, Selective Zustand selectors
- ✅ **Component-level rendering isolation**
- ✅ **Assume low-end Android devices**

### Error Handling (CRITICAL)

- ✅ **The server must NEVER crash due to client behavior**
- ✅ **Always implement**: API error handling, try/catch in async logic, Fallback UI states
- ✅ **Errors must be**: Gracefully handled, Human-readable, Non-technical

### Form & Validation Rules

- ✅ **Every input must have proper validation**
- ✅ **Show validation messages directly under the field**
- ❌ **Never use browser alerts for validation**
- ✅ **Prefer Mantine Drawer, Sheet, or Modal for forms**
- ✅ **Disable submit buttons during async actions**

### User Feedback & Mental Peace UX

**Destructive Actions (Delete/Remove)**: Always show confirmation dialog
```tsx
modals.openConfirmModal({
  title: 'Delete item?',
  children: <Text>Are you sure you want to delete this item?</Text>,
  labels: { confirm: 'Delete', cancel: 'Cancel' },
  confirmProps: { color: 'red' },
  onConfirm: async () => {
    await deleteItem()
    notifications.show({ title: 'Deleted', message: 'Item deleted successfully', color: 'green' })
  }
})
```

**Success Feedback**: Show success toast after every successful action
**Error Feedback**: Show friendly error messages, never expose raw backend errors

### Typography & Adaptive Font Scaling (MANDATORY)

Font sizes **MUST vary by device breakpoint**:

```tsx
// ✅ CORRECT
<Text className="text-sm md:text-base lg:text-lg">Body text</Text>

// ❌ WRONG
<Text style={{ fontSize: '16px' }}>Fixed size</Text>
```

**Standards**:
- Body text → `text-sm md:text-base`
- Section titles → `text-base md:text-lg lg:text-xl`
- Page titles → `text-lg md:text-xl lg:text-2xl`

### Internationalization (MANDATORY)

All user-facing text must be translatable using `t()`:

```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()
  return <Button>{t('common.save')}</Button>
}
```

**Source of truth**: `resources/js/locales/en.json`

## Important Implementation Notes

### Product-Category Filtering

Always use LIKE pattern matching for `category_ids` field (see "Key Data Model Pattern" above).

### Variant Status Filtering

The `product_variants` table does NOT have a `status` column. Any code like:
```php
$q->where('status', 'active')
```
will fail with "Column not found" error.

### Transform Methods

Storefront controllers use private `transformProduct()` methods to format data for the API response. Always use these transform methods rather than returning raw model data.

## Environment Variables

### Backend (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hooknhunt
DB_USERNAME=root
DB_PASSWORD=

FRONTEND_URL=http://localhost:5173
STOREFRONT_URL=http://localhost:3000

FILESYSTEM_DISK=public
SMS_API_KEY=your_api_key
SMS_API_URL=https://sms.api_endpoint
```

### Admin Panel (resources/js/.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v2
```

### Storefront (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## Common Issues & Solutions

### Issue: Authentication not persisting across page refreshes (Admin Panel)

**Solution**: The authStore automatically calls `loadUserFromStorage()` when created. Ensure localStorage contains `token`, `user`, `permissions`, and `permissionObjects`.

### Issue: "Column not found" error on product_variants.status

**Solution**: Remove any queries filtering by `status` on variants.

### Issue: Products not showing in category listings

**Solution**: Use LIKE pattern matching for `category_ids` field.

## File Organization

```
hooknhunt/
├── hooknhunt-api/              # Laravel backend + React admin
│   ├── app/
│   │   ├── Http/Controllers/Api/V2/  # API controllers
│   │   ├── Models/             # Eloquent models
│   │   └── Http/Middleware/    # Custom middleware
│   ├── database/migrations/    # Database migrations
│   ├── resources/js/           # React admin panel
│   │   ├── app/admin/          # Page components
│   │   ├── components/         # Reusable components
│   │   ├── stores/             # Zustand stores
│   │   ├── hooks/              # Custom hooks
│   │   ├── locales/            # i18n translations
│   │   └── utils/              # Utility functions
│   ├── routes/                 # API route definitions
│   └── tests/                  # Pest tests
└── storefront/                 # Next.js storefront
    └── src/
        ├── app/                # Next.js app directory
        ├── components/         # React components
        ├── context/            # React contexts
        └── lib/                # Utilities (API client)
```

## Finance Module (Complete ERP System)

The Finance module is a full-featured double-entry accounting system following industry-standard practices. It manages chart of accounts, journal entries, expenses, banks, financial reports, and more.

### Architecture Overview

**Double-Entry Accounting**: Every transaction must balance (debits = credits). The system enforces this rule at the journal entry level.

**Account Types** (5 types in Chart of Accounts):
- `asset` - Assets (debit balance increases)
- `liability` - Liabilities (credit balance increases)
- `equity` - Owner's equity (credit balance increases)
- `income` - Revenue/Income (credit balance increases)
- `expense` - Expenses (debit balance increases)

### API Routes Structure

All finance routes are under `/api/v2/finance/` prefix:

**Core Accounting**:
- `GET /finance/accounts` - List chart of accounts
- `GET /finance/accounts/summary` - Balance summary by type
- `GET /finance/accounts/trial-balance` - Trial balance report
- `GET /finance/accounts/statistics` - Account statistics
- `POST /finance/accounts` - Create new account
- `PUT /finance/accounts/{id}` - Update account (only if no transactions)
- `DELETE /finance/accounts/{id}` - Delete account (only if no transactions)

**Journal Entries**:
- `GET /finance/journal-entries` - List all journal entries
- `GET /finance/journal-entries/next-number` - Get next entry number
- `GET /finance/journal-entries/statistics` - Journal statistics
- `GET /finance/journal-entries/by-account` - Entries by account
- `POST /finance/journal-entries` - Create journal entry
- `POST /finance/journal-entries/{id}/reverse` - Reverse/cancel an entry

**Expenses**:
- `GET /finance/expenses` - List expenses
- `POST /finance/expenses` - Create expense
- `PUT /finance/expenses/{id}` - Update expense (only if not approved)
- `DELETE /finance/expenses/{id}` - Delete expense (only if not approved)
- `POST /finance/expenses/{id}/approve` - Approve and post to ledger

**Bank Accounts**:
- `GET /finance/banks` - List bank accounts
- `GET /finance/banks/summary` - Bank balance summary
- `GET /finance/banks/{id}/transactions` - Bank transactions
- `POST /finance/banks/{id}/deposit` - Deposit to account
- `POST /finance/banks/{id}/withdraw` - Withdraw from account
- `POST /finance/banks/transfer` - Transfer between accounts

**Financial Reports**:
- `GET /finance/reports/trial-balance` - Trial balance
- `GET /finance/reports/profit-loss` - Income statement
- `GET /finance/reports/balance-sheet` - Balance sheet
- `GET /finance/reports/cash-flow` - Cash flow statement
- `GET /finance/reports/general-ledger` - General ledger

**Additional Modules**:
- **Budgets**: `GET /finance/budgets`, `GET /finance/budgets/variance-report`
- **Fixed Assets**: `GET /finance/fixed-assets`, `GET /finance/fixed-assets/summary`
- **Cheques/PDC**: `GET /finance/cheques`, `GET /finance/cheques/alerts`
- **VAT/Tax**: `GET /finance/vat-tax-ledgers`, `GET /finance/vat-tax-ledgers/net-calculation`
- **Currencies**: `GET /finance/currencies`, `POST /finance/currencies/convert`
- **Accounts Payable**: `GET /finance/accounts-payable`, `GET /finance/accounts-payable/aging-report`
- **Accounts Receivable**: `GET /finance/accounts-receivable`, `GET /finance/accounts-receivable/aging-report`
- **Cost Centers**: `GET /finance/cost-centers`
- **Projects**: `GET /finance/projects`
- **Fiscal Years**: `GET /finance/fiscal-years`, `POST /finance/fiscal-years/{id}/close`

### Backend Models & Relationships

**ChartOfAccount** Model:
```php
// App/Models/ChartOfAccount.php

protected $fillable = ['name', 'code', 'type', 'is_active', 'description'];

// Accessors appended to JSON
protected $appends = ['balance', 'debit_total', 'credit_total', 'type_label'];

// Relationships
public function journalItems() { hasMany(JournalItem::class) }
public function expenses() { hasMany(Expense::class) }

// Scopes
scopeActive($query) // Only active accounts
scopeOfType($query, $type) // Filter by type

// Balance calculation logic:
// - asset & expense: balance = debit - credit
// - liability, equity, income: balance = credit - debit
```

**JournalEntry** Model:
```php
// App/Models/JournalEntry.php

protected $fillable = ['entry_number', 'date', 'description', 'is_reversed'];

// Calculated accessors
protected $appends = ['total_debit', 'total_credit'];

// Relationships
public function items() { hasMany(JournalItem::class) }
public function creator() { belongsTo(User::class) }
```

**JournalItem** Model:
```php
// App/Models/JournalItem.php

protected $fillable = ['account_id', 'journal_entry_id', 'debit', 'credit'];

// Relationships (CRITICAL - both must exist)
public function account() { belongsTo(ChartOfAccount::class) }
public function journalEntry() { belongsTo(JournalEntry::class) }
```

**Expense** Model:
```php
// App/Models/Expense.php

protected $fillable = [
    'title', 'amount', 'account_id', 'expense_date',
    'reference_number', 'notes', 'attachment',
    'vat_percentage', 'vat_amount', 'vat_challan_no',
    'tax_percentage', 'tax_amount', 'tax_challan_no',
    'is_approved', 'approved_by', 'approved_at', 'journal_entry_id'
];

// Custom accessor for paid by user
protected $appends = ['paid_by_user'];

public function getPaidByUserAttribute() {
    // Returns the user who paid (uses user() relationship)
}

public function account() { belongsTo(ChartOfAccount::class) }
public function journalEntry() { belongsTo(JournalEntry::class) }
```

### Frontend Pages Structure

**Main Pages** (`resources/js/app/admin/finance/`):
- `/finance` - Dashboard overview
- `/finance/accounts` - Chart of Accounts management
- `/finance/journal-entries` - Journal entries list and management
- `/finance/expenses` - Expense management with create/edit
- `/finance/expenses/[id]/edit` - Edit expense (if not approved)
- `/finance/banks` - Bank accounts management
- `/finance/transactions` - Bank transactions
- `/finance/reports` - Reports hub
- `/finance/reports/trial-balance` - Trial balance report
- `/finance/budgets` - Budget management
- `/finance/vat-tax` - VAT/Tax ledger
- `/finance/fixed-assets` - Fixed asset register
- `/finance/cheques` - Cheque/PDC management
- `/finance/currencies` - Multi-currency management
- `/finance/accounts-payable` - Vendor bills
- `/finance/accounts-receivable` - Customer invoices
- `/finance/reconciliations` - Bank reconciliation
- `/finance/audit` - Audit trail

### Critical Implementation Patterns

**1. Page Layout Consistency**:
All finance pages MUST use the same layout structure:
```tsx
// ✅ CORRECT - Consistent padding
<Box p={{ base: 'md', md: 'xl' }}>
  <Stack gap="md">
    {/* Content */}
  </Stack>
</Box>

// ❌ WRONG - Too much padding
<Container size="xl">
  <Stack gap="md">
    {/* Content */}
  </Stack>
</Container>
```

**2. API Response Handling**:
The `CamelCaseResponse` middleware converts all snake_case to camelCase. Always use camelCase in frontend:

```tsx
// ✅ CORRECT
<Text>{entry.entryNumber}</Text>
<Text>{entry.totalDebit}</Text>
<Text>{account.typeLabel}</Text>

// ❌ WRONG (won't work)
<Text>{entry.entry_number}</Text>
```

**3. Model Accessors with $appends**:
When models need calculated properties in API responses:
1. Create accessor method (e.g., `getTotalDebitAttribute()`)
2. Add property name to `$appends` array
3. Use camelCase on frontend (middleware handles conversion)

**4. Collection Filtering**:
When filtering Laravel Collections that will be JSON-encoded:
```php
// ✅ CORRECT - Reset keys to get proper array
$accounts = $accounts->filter(...)->values();

// ❌ WRONG - Results in object {0: {...}, 3: {...}}
$accounts = $accounts->filter(...);
```

**5. Trial Balance Date Filtering**:
```php
// Correct way to filter journal items by date
$debitTotal = JournalItem::where('account_id', $account->id)
    ->whereHas('journalEntry', function ($q) use ($asOfDate) {
        $q->where('date', '<=', $asOfDate);
    })
    ->sum('debit');
```

**6. Expense Approval Workflow**:
- Expenses can only be edited/deleted when `is_approved = false`
- Approval creates journal entry and posts to ledger
- After approval, expense is locked (audit trail)
- Bank account search includes: "Cash", "Bank", "bKash", and codes starting with "BANK"

### Common Issues & Solutions

**Issue**: Trial balance showing "accounts is not iterable"
- **Cause**: Collection has non-sequential keys after filtering
- **Solution**: Use `->values()` to reset keys before returning

**Issue**: Property undefined errors (e.g., `total_debit` undefined)
- **Cause**: Frontend using snake_case when API returns camelCase
- **Solution**: Always use camelCase on frontend (e.g., `totalDebit`)

**Issue**: Journal entry totals showing 0
- **Cause**: Missing calculated properties in `$appends` array
- **Solution**: Add properties like `total_debit`, `total_credit` to model's `$appends`

**Issue**: Paid By column showing empty on Expenses page
- **Cause**: Frontend expects `paidBy` but model has `user()` relationship
- **Solution**: Add `paidByUser` accessor to model with `$appends`

**Issue**: Cannot update/delete account or expense
- **Cause**: Item has existing transactions (journal entries or expenses)
- **Solution**: Create a new account instead; audit trail protection

**Issue**: Trial balance 422 validation error
- **Cause**: Duplicate keys in validation array or wrong parameter naming
- **Solution**: Use `$request->input('param_name')` with fallbacks for both snake_case and camelCase

**Issue**: "Payment account not configured" when approving expense
- **Cause**: System only looked for Cash accounts
- **Solution**: Bank search now includes Bank, bKash, and BANK* codes

### Key Database Tables (Finance)

- `chart_of_accounts` - Account codes and types
- `journal_entries` - Header for accounting transactions
- `journal_items` - Line items (debits/credits) for entries
- `expenses` - Expense requests with VAT/Tax
- `banks` - Bank account details
- `bank_transactions` - Transaction history
- `bank_reconciliations` - Reconciliation records
- `fixed_assets` - Asset register with depreciation
- `cheques` - Cheque/PDC management
- `vat_tax_ledgers` - VAT and tax tracking
- `currencies` - Multi-currency setup
- `budgets` - Budget planning
- `cost_centers` - Department/project tracking
- `projects` - Project accounting
- `fiscal_years` - Fiscal year management
- `accounts_payable` - Vendor bills
- `accounts_receivable` - Customer invoices

### Important: Account Number Generation

Chart of Accounts codes follow industry-standard patterns:
- `1xxx` - Assets
- `2xxx` - Liabilities
- `3xxx` - Equity
- `4xxx` - Income/Revenue
- `5xxx` - Expenses

When creating new accounts, auto-generate codes based on type:
```php
$lastAccount = ChartOfAccount::ofType($type)->orderBy('code', 'desc')->first();
$nextCode = $lastAccount ? intval($lastAccount->code) + 1 : $baseCode[$type];
```

## Key Database Tables
