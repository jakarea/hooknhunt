# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. The system is built as a monorepo with three main components:
- **Laravel API** (`hooknhunt-api`): Backend API with authentication, inventory, and multi-channel product management
- **React Admin Panel** (`hooknhunt-ui`): Admin interface for staff operations
- **Next.js Website** (`hooknhunt`): Public-facing e-commerce site (to be implemented)

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

# Database migrations
php artisan migrate

# Create a new migration
php artisan make:migration create_example_table

# Create a controller
php artisan make:controller Api/V1/Admin/ExampleController

# Create a model with migration
php artisan make:model Example -m

# Clear caches
php artisan optimize:clear
```

### Frontend (React Admin UI - `hooknhunt-ui/`)

```bash
cd hooknhunt-ui
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
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

**Features Required:**
- Light/Dark mode toggle
- i18n support (English & Bangla)
- Skeleton loaders for all data-fetching pages
- Role-based UI rendering

## Database Notes

- Full schema is documented in AI_Context.md (lines 48-224)
- 22 migration files currently exist
- Primary models: User, Address, Category, Supplier, Attribute, AttributeOption, Product (to be implemented), ProductVariant (to be implemented)
- Uses standard Laravel conventions (timestamps, soft deletes where needed)

## Security Considerations

- OTP verification required for cash-on-delivery orders
- CORS must restrict API access to Vercel (Next.js) and cPanel (Admin UI) domains only
- Sensitive fields (landed_cost, wholesale_price) must be hidden based on user role
- Laravel Sanctum tokens for all authenticated API requests

## Branding

- Logo: `./hook-and-hunt-logo.svg`
- Primary color: Red
- Background color: `#fcf8f6` (very light)
- Reference website: https://naviforce.com.bd/

## Testing

- Uses Pest PHP for backend testing
- Run tests with: `composer run test` (from hooknhunt-api/)
- Tests should cover: authentication, authorization, product workflows, inventory calculations
