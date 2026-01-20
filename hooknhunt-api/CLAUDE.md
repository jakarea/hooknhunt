# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. This is a **hybrid monorepo** containing:

1. **Laravel API Backend** (`hooknhunt-api/`) - REST API with enterprise modular architecture (V2)
2. **React Admin Panel** (`hooknhunt-api/resources/js/`) - Mantine UI SPA built with React + Vite
3. **Next.js Storefront** (`storefront/`) - Customer-facing e-commerce frontend

The project uses a modular architecture with the following main modules:
- **Catalog**: Products, categories, brands, attributes
- **Inventory**: Warehouses, stock tracking, adjustments
- **Sales**: Orders, POS, customers, returns
- **Procurement**: Purchase orders, suppliers
- **Logistics**: Shipments, couriers, tracking
- **Finance**: Chart of accounts, banks, expenses, reports
- **HRM**: Staff, departments, attendance, payroll
- **CRM**: Leads, customers, campaigns, wallet
- **CMS**: Banners, menus, pages, media

## Common Development Commands

### Laravel API Backend
```bash
# Setup (first time)
cd hooknhunt-api
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
php artisan view:clear

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

**Note**: The storefront ProductController filters by inventory in some methods (`featured`, `byCategory`), but most products don't have inventory records yet. When implementing features, consider whether inventory filtering is appropriate.

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
        // Return paginated or filtered results
        $items = Example::latest()->paginate(15);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        // Validate using form requests
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
// resources/js/app/admin/module/page.tsx
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
// stores/moduleStore.ts
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

### Model Relationships

```php
// HasMany
public function variants(): HasMany
{
    return $this->hasMany(ProductVariant::class);
}

// BelongsTo
public function brand(): BelongsTo
{
    return $this->belongsTo(Brand::class);
}

// BelongsToMany with pivot data
public function suppliers(): BelongsToMany
{
    return $this->belongsToMany(Supplier::class, 'product_supplier')
        ->withPivot('supplier_product_urls')
        ->withTimestamps();
}
```

### File Upload Patterns

```php
// In controller
$validated = $request->validate([
    'thumbnail' => 'nullable|file|image|max:300', // 300KB max
    'gallery' => 'nullable|array|max:5',
    'gallery.*' => 'file|image|max:500', // 500KB each
]);

if ($request->hasFile('thumbnail')) {
    $path = $request->file('thumbnail')->store('thumbnails', 'public');
    $url = Storage::url($path);
}
```

## Important Implementation Notes

### Product-Category Filtering

Always use LIKE pattern matching for `category_ids` field (see "Key Data Model Pattern" above).

### Variant Status Filtering

The `product_variants` table does NOT have a `status` column. Any code like:
```php
$q->where('status', 'active')
```
will fail with "Column not found" error.

### Inventory Filtering

Many storefront endpoints filter by inventory (`quantity - reserved_quantity > 0`), but most products don't have inventory records. Consider:
- Is inventory filtering appropriate for the feature?
- Should you show products even if they have no inventory?
- The `index()` method doesn't filter by inventory, but `featured()` and `byCategory()` do

### Transform Methods

Storefront controllers use private `transformProduct()` methods to format data for the API response. These methods:
- Filter out products with no variants
- Format price ranges
- Check for active offers
- Transform variant data for public consumption

Always use these transform methods rather than returning raw model data.

## Testing

### Backend (PHP)

```bash
# Run all tests
cd hooknhunt-api
composer run test

# Run specific test file
./vendor/bin/pest tests/Feature/ExampleTest.php

# Run with coverage
composer run test -- --coverage
```

**Test Framework**: Pest PHP
- Location: `tests/Unit/` and `tests/Feature/`
- Use `test()` or `it()` for test cases
- Uses SQLite in-memory database for testing

### Frontend

No formal test setup currently configured for React or Next.js frontends.

## Environment Variables

### Backend (.env)
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hooknhunt
DB_USERNAME=root
DB_PASSWORD=

# Frontend URLs
FRONTEND_URL=http://localhost:5173  # React admin panel
STOREFRONT_URL=http://localhost:3000  # Next.js storefront

# File Storage
FILESYSTEM_DISK=public

# SMS
SMS_API_KEY=your_api_key
SMS_API_URL=https://sms.api_endpoint
```

### Storefront (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Admin Panel (Vite)
API base URL configured in `resources/js/utils/api.ts`.

## Common Issues & Solutions

### Issue: Authentication not persisting across page refreshes (Admin Panel)

**Cause**: Zustand store not hydrated from localStorage on app initialization.

**Solution**: The authStore automatically calls `loadUserFromStorage()` when created. Ensure localStorage contains `token`, `user`, `permissions`, and `permissionObjects`.

### Issue: API calls failing with 401 (Admin Panel)

**Cause**: Token not being sent with API requests.

**Solution**: Ensure the API client in `resources/js/utils/api.ts` includes the Authorization header from `useAuthStore().token`.

### Issue: Authentication state not updating after login (Storefront)

**Cause**: Next.js SSR vs client-side state mismatch.

**Solution**: The AuthContext uses cached user data (`cached_user` in localStorage) to provide instant UI feedback while validating the token with the API.

### Issue: "Column not found" error on product_variants.status

**Cause**: The `product_variants` table doesn't have a `status` column.

**Solution**: Remove any queries filtering by `status` on variants.

### Issue: Products not showing in category listings

**Cause**: Using `whereJsonContains()` on `category_ids` field which is stored as a string.

**Solution**: Use LIKE pattern matching (see "Key Data Model Pattern" above).

### Issue: Product count showing 0 for categories

**Cause**: The `category_ids` field is stored as `[1]` but query is looking for `"1"` (with quotes).

**Solution**: Use LIKE patterns that match the actual format: `[%1,]` or `[,1]` or `[%1]` or `[1]`.

### Issue: Category relationship returns empty

**Cause**: The `category_ids` cast in Product model may not work because the database value is a string.

**Solution**: In the `getCategoriesAttribute()` accessor, check if it's a string and decode it:
```php
$categoryIds = $this->category_ids;
if (is_string($categoryIds)) {
    $categoryIds = json_decode($categoryIds, true) ?? [];
}
```

## Database Schema Reference

Key tables:
- `users` - Customers and staff (with roles and permissions)
- `products` - Product parent records
- `product_variants` - Sellable SKU variants
- `categories` - Product categories (hierarchical)
- `attributes` - Product variant attributes (Color, Size, etc.)
- `attribute_options` - Attribute values (Red, Blue, Small, Large, etc.)
- `variant_attribute_options` - Pivot table linking variants to attribute options
- `inventory` - Stock levels per variant
- `purchase_orders` - Purchase order management
- `purchase_order_items` - Line items for POs
- `suppliers` - Supplier information
- `product_supplier` - Pivot linking products to suppliers
- `media_files` - Media library
- `media_folders` - Media folder organization
- `sms_logs` - SMS sending history
- `settings` - Global application settings
- `orders` - Customer orders (storefront)
- `order_items` - Order line items
- `chart_of_accounts` - Finance module accounts
- `banks` - Bank accounts
- `bank_transactions` - Bank transaction history
- `expenses` - Expense tracking
- `warehouses` - Inventory warehouses
- `roles` - User roles
- `permissions` - Granular permissions

For full schema details, check migration files in `database/migrations/`.

## File Organization

```
hooknhunt/
├── hooknhunt-api/              # Laravel backend + React admin
│   ├── app/                    # Laravel application code
│   │   ├── Http/Controllers/Api/V2/  # API controllers
│   │   ├── Models/             # Eloquent models
│   │   └── Http/Middleware/    # Custom middleware
│   ├── database/
│   │   └── migrations/         # Database migrations
│   ├── resources/js/           # React admin panel
│   │   ├── app/admin/          # Page components
│   │   ├── components/         # Reusable components
│   │   ├── stores/             # Zustand stores
│   │   ├── hooks/              # Custom hooks
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

## Development Workflow

### Adding a New Feature

1. **Backend (API)**:
   ```bash
   cd hooknhunt-api
   php artisan make:model Example -m
   php artisan make:controller Api/V2/ExampleController
   # Add routes to routes/api.php
   # Implement controller methods
   php artisan migrate
   ```

2. **Admin Panel (React)**:
   ```bash
   cd resources/js
   # Create page component in app/admin/module/page.tsx
   # Add route to App.tsx
   # Update navigation in app-sidebar-mantine.tsx
   npm run dev
   ```

3. **Storefront (Next.js)**:
   ```bash
   cd storefront
   # Create page in src/app/module/page.tsx
   # Add API client methods to src/lib/api.ts
   npm run dev
   ```

### Working with Permissions

**Admin Panel**: Use the `usePermissions` hook for permission-based UI:

```tsx
import { usePermissions } from '@/hooks/usePermissions'

function MyComponent() {
  const { hasPermission, hasAnyPermission, isSuperAdmin } = usePermissions()

  if (!hasPermission('finance.expenses.view')) {
    return <AccessDenied />
  }

  // Component content
}
```

**Backend**: Check permissions in controllers:

```php
public function store(Request $request)
{
    $this->authorize('create', Expense::class);
    // Controller logic
}
```

### API Integration Pattern

**Admin Panel**:
- API utilities in `resources/js/utils/api.ts` (base client)
- Module-specific API clients in `resources/js/utils/` (e.g., `finance.ts`)
- Use TanStack Query for data fetching and caching

**Storefront**:
- Single API client in `src/lib/api.ts`
- Fetch-based wrapper with automatic token handling
- Error handling with status codes

## Important Notes

### V2 vs V1 API Routes

The project is transitioning from V1 to V2 API structure:
- **V1**: `routes/admin.php`, `routes/website.php` (legacy)
- **V2**: `routes/api.php` with modular structure (current/active)

When adding new features, use V2 structure in `routes/api.php`.

### Permission Groups

Permissions are organized by module/group:
- Dashboard
- HRM
- Operations
- Finance
- Settings

Use `getPermissionGroups()` in authStore to get user's accessible groups.

### State Management Strategy

- **Admin Panel**: Zustand stores for module-specific state
- **Storefront**: React Context for global state (Auth, Cart)
- Both use localStorage for persistence

---

# 🎨 Frontend Development Guidelines (Mobile-First PWA)

## Overview

This project is built as a **Mobile-First Progressive Web App (PWA)** that will be converted to **Android & iOS apps using Capacitor**. All frontend development MUST follow these guidelines.

---

## 1️⃣ UI & Design System (STRICT)

### Mandatory Rules:
- ✅ **Always use native Mantine UI components** - Do NOT build custom UI if Mantine has it
- ✅ **Styling with Tailwind CSS ONLY** - No inline styles, no custom CSS files
- ✅ **Icons from Tabler icons ONLY** - Free, comprehensive icon set
- ✅ **UI must feel**: Calm, Clean, Non-aggressive, Mentally relaxing for long ERP usage

### Design Principles:
- **Mobile-first** approach - Design for mobile, enhance for desktop
- **No hover interactions** - Use tap/click/press only
- **Touch targets must be finger-friendly** - Minimum 44x44px
- **Smooth transitions** - No sudden UI jumps

---

## 2️⃣ Responsive Data Rendering (ERP-Safe)

For large datasets, use conditional rendering based on screen size:

```
Desktop (md+) → Table view
Mobile (< md) → Card view
```

**Tailwind Classes:**
```tsx
// Desktop table, mobile card
<table className="hidden md:block">...</table>
<div className="block md:hidden">...</div>
```

---

## 3️⃣ State Management (Centralized)

- **Use Zustand for ALL shared/global state**
- **Avoid prop drilling** - Use Zustand stores instead
- **Keep stores**: Small, Modular, Predictable
- **Side effects isolated from UI rendering logic**

### Store Pattern:
```tsx
// stores/exampleStore.ts
import { create } from 'zustand'

interface ExampleState {
  items: Item[]
  addItem: (item: Item) => void
}

export const useExampleStore = create<ExampleState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
}))
```

---

## 4️⃣ Performance & Rendering Rules

### Critical Rules:
- ❌ **NEVER re-render full pages** on data change
- ✅ **Always use**: `useMemo`, `useCallback`, Selective Zustand selectors
- ✅ **Component-level rendering isolation**
- ✅ **Assume low-end Android devices**

### Example:
```tsx
// ❌ BAD - Re-renders on every state change
const data = useStore()

// ✅ GOOD - Only re-renders when items change
const items = useStore((state) => state.items)
```

---

## 5️⃣ Error Handling (CRITICAL)

### Server Safety Rules:
- ✅ **The server must NEVER crash due to client behavior**
- ✅ **Always implement**: API error handling, try/catch in async logic, Fallback UI states
- ✅ **Errors must be**: Gracefully handled, Human-readable, Non-technical for users
- ✅ **Safe logging** - No console spam in production

### Error Handling Pattern:
```tsx
const handleAction = async () => {
  try {
    await apiCall()
    notifications.show({
      title: 'Success',
      message: 'Operation completed successfully',
      color: 'green'
    })
  } catch (error) {
    notifications.show({
      title: 'Error',
      message: error.response?.data?.message || 'Something went wrong',
      color: 'red'
    })
  }
}
```

---

## 6️⃣ Form & Validation Rules

### Mandatory Requirements:
- ✅ **Every input must have proper validation**
- ✅ **Show validation messages directly under the field**
- ❌ **Never use browser alerts for validation**
- ✅ **Forms must be scrollable when mobile keyboard opens**
- ✅ **Prefer Mantine Drawer, Sheet, or Modal for forms**
- ✅ **Disable submit buttons during async actions**

### Form Pattern:
```tsx
const [submitting, setSubmitting] = useState(false)

const handleSubmit = async () => {
  if (!validate()) return

  setSubmitting(true)
  try {
    await submitForm()
  } finally {
    setSubmitting(false)
  }
}

<Button onClick={handleSubmit} loading={submitting} disabled={submitting}>
  Submit
</Button>
```

---

## 7️⃣ User Feedback & Mental Peace UX (NON-NEGOTIABLE)

### 🔴 Destructive Actions (Delete/Remove):
```tsx
// Always show confirmation before destructive actions
modals.openConfirmModal({
  title: 'Delete item?',
  children: <Text>Are you sure you want to delete this item?</Text>,
  labels: { confirm: 'Delete', cancel: 'Cancel' },
  confirmProps: { color: 'red' },
  onConfirm: async () => {
    await deleteItem()
    notifications.show({
      title: 'Deleted',
      message: 'Item deleted successfully',
      color: 'green'
    })
  }
})
```

### 🟢 Success Feedback (Create/Update/Delete):
```tsx
// After every successful action
notifications.show({
  title: 'Success',
  message: 'Saved successfully',
  color: 'green'
})
```

### 🔴 Error Feedback:
```tsx
// On failure - Show friendly messages
notifications.show({
  title: 'Something went wrong',
  message: 'Please check your connection and try again',
  color: 'red'
})
```

### 🧘 Mental Peace UX Rules:
- No sudden UI jumps
- No aggressive colors for errors
- Smooth transitions only
- Loading states: Visible, Calm, Never blink/flash
- User should ALWAYS feel in control

---

## 8️⃣ Typography & Adaptive Font Scaling (MANDATORY)

### Core Rules:
- Font sizes **MUST vary by device breakpoint**
- Mobile is the **baseline**
- Desktop scales up
- **NEVER use single fixed font size** across all devices

### Tailwind-Only Font Scaling:
```tsx
// ✅ CORRECT
<Text className="text-sm md:text-base lg:text-lg">
  Body text
</Text>

<Title className="text-lg md:text-xl lg:text-2xl">
  Page title
</Title>

// ❌ WRONG
<Text style={{ fontSize: '16px' }}>
  Fixed size
</Text>
```

### Standards:
- **Body text** → `text-sm md:text-base`
- **Section titles** → `text-base md:text-lg lg:text-xl`
- **Page titles** → `text-lg md:text-xl lg:text-2xl`

### Line Height & Readability:
- Always pair with: `leading-normal` or `leading-relaxed`
- Never use tight line height for paragraphs

### Mantine Typography:
- Use Mantine size props (`sm`, `md`, `lg`) where available
- Don't override Mantine typography randomly

### Accessibility:
- Minimum readable size on mobile: **14px equivalent**
- Proper contrast is mandatory
- Never rely on color alone to convey meaning

---

## 9️⃣ PWA & Offline-First Architecture

### Principles:
- The app is a **Progressive Web App**
- Design with: Offline support, Graceful network failure handling, Cached & retryable actions
- **Always assume unstable internet**

### Offline Pattern:
```tsx
const [isOnline, setIsOnline] = useState(navigator.onLine)

useEffect(() => {
  const handleOnline = () => setIsOnline(true)
  const handleOffline = () => setIsOnline(false)

  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  return () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }
}, [])

if (!isOnline) {
  return <Alert color="orange">You're offline. Some features may not work.</Alert>
}
```

---

## 🔟 Capacitor & Native Compatibility

### Rules:
- App **will be converted to Android & iOS using Capacitor**
- Keep UI and logic **native-friendly**
- Use JS abstractions for device APIs
- **Avoid browser-only APIs** that break on mobile

---

## 1️⃣1️⃣ Internationalization (MANDATORY)

### All User-Facing Text Must Be Translatable:
- Labels, Buttons, Toasts, Errors, Confirmation messages
- **NEVER hardcode text**

### Usage:
```tsx
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t } = useTranslation()

  return (
    <Button>{t('common.save')}</Button>
  )
}
```

### Translation File:
- **Source of truth**: `resources/js/locales/en.json`
- Use `t('key.path')` everywhere
- Keys must be logical and consistent

---

## 1️⃣2️⃣ Code Quality & Safety Gates

### Requirements:
- ✅ Code must pass ESLint
- ✅ Fully TypeScript-safe
- ✅ Avoid `any` type
- ✅ Follow clean, scalable patterns
- ✅ UI logic must be deterministic and predictable

---

## ✅ Default Engineering Assumption

> **If a feature does not feel calm, readable, and safe on mobile, it must be redesigned — not ignored.**
>
> **Mobile UX is the baseline. Mental peace is a feature. Desktop is an enhancement.**

---

## 📦 Quick Reference: Mobile-First Checklist

### Before Writing Code:
- [ ] Am I using Mantine components? (No custom UI)
- [ ] Am I using Tailwind for styling? (No inline styles)
- [ ] Are my icons from Tabler?
- [ ] Is this mobile-first design?
- [ ] Are touch targets finger-friendly?

### While Writing Code:
- [ ] Am I using Zustand for state?
- [ ] Am I using useMemo/useCallback for performance?
- [ ] Do I have proper error handling?
- [ ] Are my fonts responsive (text-sm md:text-base)?
- [ ] Is all text using t() for translations?

### Before Committing:
- [ ] Do I have success notifications?
- [ ] Do I have confirmation dialogs for destructive actions?
- [ ] Are error messages user-friendly?
- [ ] Does it pass ESLint?
- [ ] Is it TypeScript-safe?

---

