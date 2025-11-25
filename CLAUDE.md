# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. The system is built as a monorepo with three main components:
- **Laravel API** (`hooknhunt-api`): Backend API with authentication, inventory, and multi-channel product management
- **React Admin Panel** (`hooknhunt-ui`): Admin interface for staff operations
- **Next.js Website** (`hooknhunt`): Public-facing e-commerce site (to be implemented)

## Current Implementation Status (November 2025)

### ✅ COMPLETED COMPONENTS
- **Laravel API**: 85% complete with authentication, RBAC, basic CRUD
- **React Admin UI**: 75% complete with dashboard, user management, basic product management
- **Database Schema**: 22 migrations implemented for all required tables

### ❌ NOT YET IMPLEMENTED
- **Next.js Website**: 0% complete (project not created)
- **Product Variants**: Schema exists, no controller/model implementation
- **Purchase Orders**: Schema exists, no API implementation
- **Inventory Management**: Schema exists, no API implementation
- **Sales Orders**: Schema exists, no API implementation

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

### Frontend (React Admin UI - `hooknhunt-ui/`)

```bash
cd hooknhunt-ui
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build

# Package management
npm install          # Install dependencies
npm update           # Update dependencies
npm install package-name  # Add new package

# TypeScript
npx tsc --noEmit     # Type checking without compilation
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
STOREFRONT_URL=https://your-domain.vercel.app

# File uploads
FILESYSTEM_DISK=public
```

**Frontend (.env file):**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Architecture Overview

### Multi-Channel Product System

The core of this ERP is a "flat variant" product architecture where:

1. **Products** (`products` table) are parent containers storing:
   - Basic info (base_name, slug, status)
   - Marketing data (meta_title, meta_description, gallery_images)
   - Status workflow: `draft` → `published`

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
| `super_admin` | Full system access, financial reports | None |
| `admin` | All operational modules, user management | Cannot see final P&L, cannot manage super_admins |
| `seller` | POS, sales orders, customer info | Cannot see landed costs or access purchase orders |
| `store_keeper` | Purchase orders, inventory management | Cannot see any selling prices |
| `marketer` | Product marketing fields | Cannot change prices or landed costs |
| `retail_customer` | Website access only | No admin panel access |
| `wholesale_customer` | Website with wholesale pricing | No admin panel access |

Role middleware is applied via `role:role1,role2` middleware in routes.

### Product Workflow

1. **Admin/Store Keeper** creates a product with variants, sets landed cost and prices → Status: `draft`
2. **Marketer** receives notification, adds marketing content (meta_title, gallery) → Status: `published`
3. Product becomes visible on website

### Inventory & Purchase Orders

- Stock tracked at `product_variant` level via `inventory` table
- `landed_cost` calculated from purchase order costs:
  - Formula includes: china_price + shipping_cost + extra_cost - lost_value
  - Updated when PO status reaches `received_hub` or `completed`
- PO statuses: `draft` → `payment_confirmed` → `supplier_dispatched` → `shipped_bd` → `arrived_bd` → `in_transit_bogura` → `received_hub` → `completed` (or `lost`)

### API Structure

All APIs are versioned under `/api/v1/`:

**Storefront** (`/api/v1/store`):
- Public: `/auth/register`, `/auth/login`, `/auth/send-otp`, `/auth/verify-otp`
- Protected: `/account/me`, `/account/profile`, `/account/addresses`

**Admin** (`/api/v1/admin`):
- Public: `/auth/login`
- Protected: `/me`, `/users`, `/categories`, `/suppliers`, `/attributes`, `/attribute-options`
- All admin routes require `auth:sanctum` middleware
- Resource routes further restricted by role middleware

### Frontend Architecture (React Admin UI)

**Stack:**
- React 19 + TypeScript
- Vite (using rolldown-vite)
- Shadcn UI components
- TailwindCSS v4 for styling
- Zustand for state management
- React Router for routing

**Directory Structure:**
- `src/components/ui/`: Shadcn UI components
- `src/pages/`: Page components (Dashboard, Login, Categories)
- `src/stores/`: Zustand state management
- `src/lib/`: Utility functions

**Current Implementation:**
- ✅ Basic UI components (Shadcn) are implemented
- ✅ Authentication and routing are working
- ❌ Light/Dark mode not yet implemented
- ❌ i18n support not yet implemented
- ❌ Skeleton loaders not yet consistently implemented
- ✅ Role-based UI rendering is partially implemented

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

#### 3. API Response Format
```php
// Success responses
return response()->json($data, 200);  // OK
return response()->json($data, 201);  // Created

// Error responses
return response()->json([
    'message' => 'Validation failed',
    'errors' => $validator->errors()
], 422);

return response()->json([
    'message' => 'Unauthorized'
], 401);
```

#### 4. Form Request Validation
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

#### 2. Component Pattern with Shadcn
```typescript
// src/pages/Examples.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExampleStore } from '@/stores/exampleStore';

export function Examples() {
  const { items, loading, fetchItems } = useExampleStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  if (loading) return <ExamplesSkeleton />;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Item content */}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton loader component
function ExamplesSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

#### 3. Form Handling with React Hook Form
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

#### Frontend File Upload
```typescript
// src/components/inputs/FileUpload.tsx
interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in KB
  className?: string;
}

export function FileUpload({
  value,
  onChange,
  accept = 'image/*',
  maxSize = 300,
  className
}: FileUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024) {
      setError(`File size must be less than ${maxSize}KB`);
      return;
    }

    setError(null);
    onChange(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={className}>
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="h-20 w-20 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
}
```

### Authentication Patterns

#### API Client Setup
```typescript
// src/lib/api.ts
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

## Database Notes

- Full schema is documented in AI_Context.md (lines 48-224)
- 22 migration files currently implemented
- **Currently Implemented Models**: User, Address, Category, Supplier, Attribute, AttributeOption, Product (basic)
- **Missing Model Implementation**: ProductVariant, PurchaseOrder, SalesOrder, Inventory, Loyalty-related models
- Uses standard Laravel conventions (timestamps, soft deletes where needed)

### Key Database Patterns
- **Soft Deletes**: Use `SoftDeletes` trait for major entities
- **UUID**: Consider UUID for public-facing identifiers
- **Indexes**: Add indexes for frequently queried columns
- **Foreign Keys**: Proper cascade/delete constraints

## Security Considerations

### Authentication & Authorization
- **Laravel Sanctum** for API authentication
- **Role-based middleware**: `role:super_admin,admin`
- **OTP verification** required for cash-on-delivery orders
- **Password hashing** using Laravel's built-in methods

### Data Security
- **CORS** must restrict API access to:
  - Vercel domain (Next.js website)
  - cPanel domain (Admin UI)
- **Field-level security**: Hide sensitive fields based on user role:
  - `landed_cost`: Only super_admin, admin, store_keeper
  - `wholesale_price`: Only super_admin, admin, seller, wholesale_customer
- **Input validation**: Use Form Request classes
- **SQL injection protection**: Laravel's Eloquent ORM handles this
- **XSS protection**: Laravel's CSRF protection and input escaping

### File Upload Security
- **File type validation**: Only allowed file types
- **File size limits**: 300KB for thumbnails, 500KB for gallery images
- **Storage**: Use `storage` directory, not public uploads
- **File names**: Generate unique names to prevent overwrites

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

**Critical Tests to Implement:**
- Authentication and authorization
- Role-based access control
- Product workflow (draft → published)
- Inventory calculations
- Purchase order status changes

### Frontend Testing
```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom

# Run tests
npm test
```

## Deployment Guidelines

### Backend Deployment
1. **Environment variables**: Set up production `.env`
2. **Database**: Run migrations: `php artisan migrate --force`
3. **File permissions**: `storage` and `bootstrap/cache`
4. **Caching**: `php artisan config:cache`, `php artisan route:cache`
5. **Queue**: Set up queue worker: `php artisan queue:work --daemon`

### Frontend Deployment
1. **Build**: `npm run build`
2. **Environment**: Set production API URL
3. **Static files**: Deploy `dist/` directory to web server
4. **Caching**: Configure browser caching for static assets

## Performance Considerations

### Backend Optimization
- **Database indexing**: Add indexes for frequently queried columns
- **Eager loading**: Use `with()` to prevent N+1 queries
- **Caching**: Implement Redis caching for frequently accessed data
- **Pagination**: Always paginate large result sets
- **Query optimization**: Use Laravel DebugBar for query analysis

### Frontend Optimization
- **Code splitting**: Lazy load components and pages
- **Image optimization**: Compress and serve appropriate sizes
- **Bundle analysis**: Use `npm run build --analyze`
- **Caching**: Implement proper HTTP caching headers

## Branding Guidelines

- **Logo**: `./hook-and-hunt-logo.svg`
- **Primary Color**: Red (matches logo)
- **Background Color**: `#fcf8f6` (very light)
- **Typography**: Clean, professional fonts
- **Reference Design**: https://naviforce.com.bd/
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance
