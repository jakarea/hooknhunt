# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. The system is built as a monorepo with three main components:
- **Laravel API** (`hooknhunt-api`): Backend API with authentication, inventory, and multi-channel product management
- **React Admin Panel** (`hooknhunt-ui`): Admin interface for staff operations
- **Next.js Website** (`storefront`): Public-facing e-commerce site

## Current Implementation Status (December 2025)

### ✅ COMPLETED COMPONENTS
- **Laravel API**: 90% complete with authentication, RBAC, full CRUD, purchase orders, inventory, SMS, media management
- **React Admin UI**: 80% complete with dashboard, user management, product management, purchase orders, inventory
- **Next.js Storefront**: Partially implemented (project structure exists, authentication routes in API)
- **Database Schema**: 24+ migrations implemented

### 🔨 IN PROGRESS
- Product Variants (schema exists, partial controller implementation)
- Purchase Orders (backend mostly complete, frontend in progress)
- Inventory Management (backend complete, frontend partially complete)

### ❌ NOT YET IMPLEMENTED
- **Sales Orders**: Schema exists, minimal API implementation
- **Next.js Website Frontend**: Basic structure exists, most pages not built

**See `ai-todo-list.md` for detailed remaining tasks and priorities.**

## Common Development Commands

### Backend (Laravel API - `hooknhunt-api/`)

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
php artisan migrate:fresh --seed  # Fresh start with seeders
php artisan db:seed             # Run seeders only

# Generate new code
php artisan make:migration create_example_table
php artisan make:controller Api/V1/Admin/ExampleController
php artisan make:model Example -m  # with migration
php artisan make:request StoreExampleRequest  # Form request validation
php artisan make:factory ExampleFactory  # For testing

# Cache management
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Queue operations
php artisan queue:work
php artisan queue:failed-table  # Create failed jobs table
```

### Admin UI (React - `hooknhunt-ui/`)

```bash
cd hooknhunt-ui
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production (includes type checking)
npm run build-no-check  # Build without type checking (use when types are blocking)
npm run lint     # Run ESLint
npm run preview  # Preview production build

# Package management
npm install          # Install dependencies
npm install package-name  # Add new package
```

### Storefront (Next.js - `storefront/`)

```bash
cd storefront
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Environment Setup

**Backend (.env file):**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hooknhunt
DB_USERNAME=root
DB_PASSWORD=

# API URLs (for CORS)
FRONTEND_URL=http://localhost:5173
STOREFRONT_URL=http://localhost:3000

# File uploads
FILESYSTEM_DISK=public

# SMS API (if using SMS features)
SMS_API_KEY=your_api_key
SMS_API_URL=https://sms.api_endpoint
```

**Admin UI (.env file):**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

**Storefront (.env.local file):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

## Architecture Overview

### Multi-Channel Product System

The core of this ERP is a "flat variant" product architecture where:

1. **Products** (`products` table) are parent containers storing:
   - Basic info (base_name, slug, status)
   - Marketing data (meta_title, meta_description, gallery_images, canonical_url)
   - Status workflow: `draft` → `published`
   - Category and brand relationships

2. **Product Variants** (`product_variants` table) are the sellable SKUs containing:
   - Channel-specific pricing and names (retail, wholesale, Daraz)
   - Landed cost (updated when purchase orders are received)
   - Channel-specific offer configurations
   - Each variant represents a unique combination of attributes (e.g., "Red T-Shirt, Size L")

3. **Attributes** (`attributes` + `attribute_options` tables):
   - Define product variations (Color, Size, etc.)
   - Linked to variants via `variant_attribute_options` pivot table

### Sales Channels

The system supports three sales channels, each with independent pricing:

1. **Retail**: Standard e-commerce customers via Next.js website
2. **Wholesale**: Authenticated wholesale customers with MOQ requirements
3. **Daraz**: Marketplace integration (data stored for future API integration)

Each channel has dedicated fields in `product_variants`:
- `{channel}_name`: Display name
- `{channel}_price`: Base price
- `{channel}_offer_discount_type/value`: Discount configuration
- `{channel}_offer_start_date/end_date`: Promotional periods

### Authentication & Authorization

**Laravel Sanctum** is used for API authentication:

- **Storefront API** (`/api/v1/store`): Customer authentication with OTP verification
- **Admin API** (`/api/v1/admin`): Staff authentication with role-based access control

**Role-Based Access Control (RBAC):**

| Role | Key Permissions | Restrictions |
|------|----------------|--------------|
| `super_admin` | Full system access, financial reports, settings | None |
| `admin` | All operational modules, user management | Cannot see final P&L, cannot manage super_admins |
| `seller` | POS, sales orders, customer info | Cannot see landed costs or access purchase orders |
| `store_keeper` | Purchase orders, inventory management, suppliers | Cannot see any selling prices |
| `marketer` | Product marketing fields, categories, brands | Cannot change prices or landed costs |
| `supervisor` | Limited access, specific operations as defined | Cannot access sensitive financial data |

Role middleware is applied via `role:role1,role2` middleware in routes. See `hooknhunt-api/app/Http/Middleware/CheckRoleMiddleware.php`.

### Product Workflow

1. **Admin/Store Keeper** creates a product with variants, sets landed cost and prices → Status: `draft`
2. **Marketer** receives notification, adds marketing content (meta_title, gallery, canonical_url) → Status: `published`
3. Product becomes visible on website

### Inventory & Purchase Orders

- Stock tracked at `product_variant` level via `inventory` table
- `landed_cost` calculated from purchase order costs:
  - Formula: `china_price + shipping_cost + extra_cost - lost_value` / quantity
  - Updated when PO status reaches `received_hub` or `completed`
- PO statuses: `draft` → `payment_confirmed` → `supplier_dispatched` → `shipped_bd` → `arrived_bd` → `in_transit_bogura` → `received_hub` → `completed` (or `lost`)

**See `RECEIVE_STOCK_IMPROVEMENTS.md` for detailed receive stock workflow.**

### API Structure

All APIs are versioned under `/api/v1/`:

**Storefront** (`/api/v1/store` - see `routes/website.php`):
- Public: `/auth/register`, `/auth/login`, `/auth/send-otp`, `/auth/verify-otp`
- Protected: `/account/me`, `/account/profile`, `/account/addresses`

**Admin** (`/api/v1/admin` - see `routes/admin.php`):
- Public: `/auth/login`
- Protected: `/me`, `/users`, `/categories`, `/suppliers`, `/attributes`, `/attribute-options`, `/products`, `/purchase-orders`, `/inventory`, `/sms`, `/media`, `/settings`
- All admin routes require `auth:sanctum` middleware
- Resource routes further restricted by role middleware

### Frontend Architecture (React Admin UI)

**Stack:**
- React 19 + TypeScript
- Vite (using rolldown-vite for faster builds)
- Shadcn UI components (Radix UI primitives)
- TailwindCSS v4 for styling
- Zustand for state management
- React Router v7 for routing
- React Hook Form + Zod for forms
- Axios for API calls

**Directory Structure:**
- `src/components/ui/`: Shadcn UI components
- `src/components/forms/`: Form components (ProductForm, UserForm, etc.)
- `src/components/guards/`: Route guards (RoleGuard, AuthGuard)
- `src/pages/`: Page components (Dashboard, Login, Categories, Products, etc.)
- `src/stores/`: Zustand state management stores
- `src/lib/`: Utility functions, API client
- `src/config/`: Configuration files (menuConfig, etc.)

**Current Implementation:**
- ✅ Basic UI components (Shadcn) are implemented
- ✅ Authentication and routing are working
- ✅ Role-based UI rendering via RoleGuard component
- ❌ Light/Dark mode not yet implemented
- ❌ i18n support structure exists (i18next installed) but not fully configured
- ❌ Skeleton loaders not yet consistently implemented

## Development Patterns & Guidelines

### Backend Development Patterns

#### 1. Controller Structure
```php
// File: app/Http/Controllers/Api/V1/Admin/ExampleController.php
class ExampleController extends Controller
{
    public function index()
    {
        // Return paginated results
        $items = Example::latest()->paginate(15);
        return response()->json($items);
    }

    public function store(Request $request)
    {
        // Validate using form requests
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            // ... other validation rules
        ]);

        // Create with proper relationships
        $item = Example::create($validated);

        return response()->json($item, 201);
    }
}
```

#### 2. Model Relationships
```php
// Use proper relationship definitions
public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}

public function variants(): HasMany
{
    return $this->hasMany(ProductVariant::class);
}

// Pivot relationships
public function suppliers(): BelongsToMany
{
    return $this->belongsToMany(Supplier::class)
        ->withPivot('supplier_product_url')
        ->withTimestamps();
}
```

#### 3. Form Request Validation
```bash
php artisan make:request StoreProductRequest
```

```php
// app/Http/Requests/StoreProductRequest.php
class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or check user permissions
    }

    public function rules(): array
    {
        return [
            'base_name' => 'required|string|max:255',
            'status' => 'required|in:draft,published',
            'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        ];
    }
}
```

### Frontend Development Patterns

#### 1. Zustand Store Pattern
```typescript
// src/stores/exampleStore.ts
interface ExampleState {
  items: Example[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchItems: () => Promise<void>;
  createItem: (data: CreateExampleData) => Promise<void>;
  updateItem: (id: number, data: UpdateExampleData) => Promise<void>;
  deleteItem: (id: number) => Promise<void>;
}

export const useExampleStore = create<ExampleState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/examples');
      set({ items: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch items', loading: false });
    }
  },
  // ... other actions
}));
```

#### 2. Form Handling with React Hook Form
```typescript
// src/components/forms/ExampleForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const exampleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
});

type ExampleFormData = z.infer<typeof exampleSchema>;

interface ExampleFormProps {
  initialData?: ExampleFormData;
  onSubmit: (data: ExampleFormData) => Promise<void>;
}

export function ExampleForm({ initialData, onSubmit }: ExampleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          {...register('name')}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

#### 3. Role-Based UI Rendering
```typescript
// Use the RoleGuard component to conditionally render based on user roles
import { RoleGuard } from '@/components/guards/RoleGuard';

<RoleGuard allowedRoles={['super_admin', 'admin']}>
  <Button>Delete User</Button>
</RoleGuard>

// Or use the useAuthStore hook
const { user } = useAuthStore();
if (user?.role === 'super_admin') {
  // Show admin-only content
}
```

### File Upload Patterns

#### Backend File Upload
```php
// In controller
public function store(Request $request)
{
    $validated = $request->validate([
        'thumbnail' => 'nullable|file|image|max:300', // 300KB max
        'gallery' => 'nullable|array|max:5',
        'gallery.*' => 'file|image|max:500', // 500KB each
    ]);

    // Single file upload
    if ($request->hasFile('thumbnail')) {
        $path = $request->file('thumbnail')->store('thumbnails', 'public');
        $url = Storage::url($path);
    }

    // Multiple file upload
    $galleryUrls = [];
    if ($request->hasFile('gallery')) {
        foreach ($request->file('gallery') as $file) {
            $path = $file->store('gallery', 'public');
            $galleryUrls[] = Storage::url($path);
        }
    }
}
```

### API Client Setup

```typescript
// src/lib/api.ts (in hooknhunt-ui)
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Additional Features

### SMS Management
- SMS API integration for OTP verification and notifications
- SMS balance checking and delivery reports
- See `SMS_FEATURE_README.md` for details

### Media Management
- Centralized media library for file management
- Folder organization for media files
- Reusable across products, categories, brands

### Global Settings
- Exchange rate management (used for purchase order calculations)
- System-wide configuration managed by super_admin

## Database Notes

- Full schema is documented in `AI_Context.md`
- 24+ migration files currently implemented
- **Currently Implemented Models**: User, Address, Category, Brand, Supplier, Attribute, AttributeOption, Product, ProductVariant (partial), PurchaseOrder (partial), Inventory, Media, Setting, SmsLog
- **Missing/Partial Implementation**: SalesOrder, Loyalty-related models

### Key Database Patterns
- **Soft Deletes**: Use `SoftDeletes` trait for major entities (User, Product, etc.)
- **UUID**: Consider UUID for public-facing identifiers
- **Indexes**: Add indexes for frequently queried columns
- **Foreign Keys**: Proper cascade/delete constraints

## Security Considerations

### Authentication & Authorization
- **Laravel Sanctum** for API authentication
- **Role-based middleware**: `role:super_admin,admin` in routes
- **OTP verification** required for customer registration
- **Password hashing** using Laravel's built-in methods

### Data Security
- **CORS** must restrict API access to:
  - Admin UI domain (http://localhost:5173 for development)
  - Storefront domain (http://localhost:3000 for development)
- **Field-level security**: Hide sensitive fields based on user role:
  - `landed_cost`: Only super_admin, admin, store_keeper
  - `wholesale_price`: Only super_admin, admin, seller, wholesale_customer
- **Input validation**: Use Form Request classes
- **SQL injection protection**: Laravel's Eloquent ORM handles this
- **XSS protection**: Laravel's CSRF protection and input escaping

### File Upload Security
- **File type validation**: Only allowed file types (image/*)
- **File size limits**: 300KB for thumbnails, 500KB for gallery images
- **Storage**: Use `storage/app/public` directory, symlinked via `php artisan storage:link`
- **File names**: Generate unique names via Storage::store()

## Testing Strategy

### Backend Testing (Pest PHP)
```bash
# Run all tests
composer run test

# Run specific test file
./vendor/bin/pest tests/Feature/ProductTest.php

# Run with coverage
composer run test -- --coverage
```

**Test Categories:**
- **Unit Tests**: Model relationships, business logic
- **Feature Tests**: API endpoints, authentication, authorization
- **Integration Tests**: Complex workflows

### Frontend Testing
```bash
# Install testing dependencies (not yet implemented)
npm install -D @testing-library/react @testing-library/jest-dom

# Run tests (not yet configured)
npm test
```

## Deployment Guidelines

### Backend Deployment
1. **Environment variables**: Set up production `.env`
2. **Database**: Run migrations: `php artisan migrate --force`
3. **File permissions**: `storage` and `bootstrap/cache`
4. **Storage link**: `php artisan storage:link` (for file uploads)
5. **Caching**: `php artisan config:cache`, `php artisan route:cache`
6. **Queue**: Set up queue worker: `php artisan queue:work --daemon`

### Frontend Deployment
1. **Build**: `npm run build` (Admin UI) or `npm run build` (Storefront)
2. **Environment**: Set production API URL
3. **Static files**: Deploy `dist/` directory (Admin UI) or `.next/` (Storefront)
4. **Caching**: Configure browser caching for static assets

## Performance Considerations

### Backend Optimization
- **Database indexing**: Add indexes for frequently queried columns
- **Eager loading**: Use `with()` to prevent N+1 queries
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Always paginate large result sets (default 15 per page)
- **Query optimization**: Use Laravel DebugBar for query analysis

### Frontend Optimization
- **Code splitting**: Lazy load components and pages
- **Image optimization**: Compress and serve appropriate sizes
- **Bundle analysis**: Use `npm run build` to analyze bundle size
- **Caching**: Implement proper HTTP caching headers

## Important Documentation Files

- `ai-todo-list.md`: Current sprint priorities and remaining tasks
- `AI_Context.md`: Full database schema reference
- `VARIANT_MANAGEMENT_GUIDE.md`: Product variants implementation guide
- `VARIABLE_PRODUCT_STEP2_PRICING.md`: Multi-channel pricing details
- `RECEIVE_STOCK_IMPROVEMENTS.md`: Stock receiving workflow
- `SMS_FEATURE_README.md`: SMS integration details
- `STOREFRONT_API_DOCUMENTATION.md`: Public API endpoints
- `WEBSITE_AUTH_README.md`: Customer authentication flow

## Branding Guidelines

- **Logo**: `./hook-and-hunt-logo.svg`
- **Primary Color**: Red (matches logo)
- **Background Color**: `#fcf8f6` (very light)
- **Typography**: Clean, professional fonts
- **Reference Design**: https://naviforce.com.bd/
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
