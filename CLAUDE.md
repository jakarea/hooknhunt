# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. This is a **hybrid monorepo** containing:

1. **Laravel API Backend** (`hooknhunt-api/`) - REST API with enterprise modular architecture (V2)
2. **React Admin Panel** (`hooknhunt-api/resources/js/`) - Mantine UI SPA built with React + Vite
3. **Next.js Storefront** (`storefront/`) - Customer-facing e-commerce frontend

## Common Development Commands

### Laravel API Backend
```bash
cd hooknhunt-api

# Setup (first time)
composer run setup

# Development (runs Laravel server, queue, logs, and Vite concurrently)
composer run dev

# Testing
composer run test

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
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint
```

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

**Tech Stack**: React 18 + TypeScript + Vite + Mantine UI + Zustand + React Router

**Structure**:
- `resources/js/App.tsx`: Main app with routes
- `resources/js/components/`: Reusable components (sidebar, layout, etc.)
- `resources/js/app/admin/*/page.tsx`: Page components organized by module
- `resources/js/stores/`: Zustand state stores (auth, finance, ui, roles)
- `resources/js/hooks/`: Custom React hooks (usePermissions, useApi, useMobile)
- `resources/js/utils/`: Utility functions (API clients, formatters)

**Key Stores**:
- `authStore.ts`: Authentication, permissions, user data
- `financeStore.ts`: Finance module state (recent items, filters)
- `uiStore.ts`: UI state (sidebar, modals, etc.)
- `rolesStore.ts`: Role management state

**Routing**: File-based routing in `App.tsx` with React Router v7. All admin routes are under `/admin/*`.

**Navigation**: `app-sidebar-mantine.tsx` dynamically renders navigation based on user permissions using `usePermissions` hook.

### Storefront Frontend (Next.js)

**Tech Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS + Zustand

**Structure**:
- `src/app/`: Next.js app directory with file-based routing
- `src/components/`: React components (layout, product cards, etc.)
- `src/context/`: React Context providers (Auth, Cart)
- `src/lib/`: Utilities (API client, i18n config)

**API Client**: Custom fetch wrapper in `src/lib/api.ts` with automatic token handling.

**Authentication**: AuthContext provider wraps the app, handles token validation, and provides cached user data for better UX.

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

## Key Database Tables

- `users` - Customers and staff (with roles and permissions)
- `products` - Product parent records
- `product_variants` - Sellable SKU variants
- `categories` - Product categories (hierarchical)
- `attributes` - Product variant attributes
- `inventory` - Stock levels per variant
- `purchase_orders` - Purchase order management
- `suppliers` - Supplier information
- `media_files` - Media library
- `chart_of_accounts` - Finance module accounts
- `banks` - Bank accounts
- `expenses` - Expense tracking
- `warehouses` - Inventory warehouses
- `roles` - User roles
- `permissions` - Granular permissions

For full schema details, check migration files in `hooknhunt-api/database/migrations/`.
