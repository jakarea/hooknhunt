# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hook & Hunt is a headless e-commerce ERP system for a multi-channel sales operation. This is the **Laravel API backend** component. For the full monorepo context, see `/Applications/MAMP/htdocs/hooknhunt/CLAUDE.md`.

## Common Development Commands

```bash
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
php artisan make:controller Api/V1/Admin/ExampleController
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

## Architecture Overview

### Route Structure

All routes are versioned under `/api/v1/`:

- **`routes/api.php`**: Base API routes (currently empty, reserved for future use)
- **`routes/website.php`**: Storefront/next.js website routes (`/api/v1/store/*`)
- **`routes/admin.php`**: Admin panel routes (`/api/v1/admin/*`)
- **`routes/web.php`**: Web routes (if needed)
- **`routes/documentation.php`**: API documentation routes

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
- **Storefront API** (`/api/v1/store`): Customer authentication with OTP verification
- **Admin API** (`/api/v1/admin`): Staff authentication with role-based access control

**Role-based middleware** (`app/Http/Middleware/CheckRoleMiddleware.php`):
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:super_admin,admin')->group(function () {
        // Only super_admin and admin can access
    });
});
```

**Roles**: `super_admin`, `admin`, `seller`, `store_keeper`, `marketer`, `supervisor`

### Inventory System

- Stock tracked at `product_variant` level via `inventory` table
- The `inventory()` relationship on ProductVariant is `hasMany`, not `hasOne`
- A variant can have multiple inventory records (different locations/warehouses)
- To get current inventory: `$variant->inventory()->first()`

**Note**: The storefront ProductController filters by inventory in some methods (`featured`, `byCategory`), but most products don't have inventory records yet. When implementing features, consider whether inventory filtering is appropriate.

### Storefront API Controllers

Located in `app/Http/Controllers/Api/V1/Storefront/`:

- **ProductController**: Public product listing, filtering, search, related products
  - `index()`: List all published products with optional filters (category, search, price range, sort)
  - `show($slug)`: Get single product with full details
  - `featured()`: Get featured products (ordered by created_at desc)
  - `related($slug)`: Get related products from same categories
  - `byCategory($categorySlug)`: Get products in a category (includes child categories)

- **CategoryController**: Public category listings with product counts
  - `index()`: Hierarchical category tree with product counts
  - `featured()`: Top-level categories only
  - `show($slug)`: Single category with children
  - Uses LIKE pattern matching for counting products by category (see above)

- **AuthController**: Customer authentication
  - `register()`: Register new customer
  - `login()`: Login with phone/email
  - `sendOtp()`: Send OTP for verification
  - `verifyOtp()`: Verify OTP code

- **AccountController**: Authenticated customer account management
  - `me()`: Get current customer
  - `updateProfile()`: Update customer profile
  - `getAddresses()`, `addAddress()`, `updateAddress()`, `deleteAddress()`: Address management

- **OrderController**: Order placement and verification
  - `placeOrder()`: Place order (guest or authenticated)
  - `verifyOrder()`: Verify order via OTP

### Admin API Controllers

Located in `app/Http/Controllers/Api/V1/Admin/`:

All admin routes require `auth:sanctum` middleware. Most routes also require role middleware.

Key controllers:
- **AuthController**: Admin login
- **UserController**: User/Staff management
- **CategoryController**: Category CRUD
- **ProductController**: Product and variant management
- **PurchaseOrderController**: PO lifecycle management
- **InventoryController**: Stock management
- **SupplierController**: Supplier management
- **AttributeController**: Product attributes (for variants)
- **SmsController**: SMS sending and balance checking
- **MediaController**: Media library management
- **SettingController**: Global settings (exchange rates, etc.)

## Development Patterns

### Controller Structure

```php
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
        ]);

        $item = Example::create($validated);
        return response()->json($item, 201);
    }
}
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

```bash
# Run all tests
composer run test

# Run specific test file
./vendor/bin/pest tests/Feature/ProductTest.php

# Run with coverage
composer run test -- --coverage
```

Test framework: **Pest PHP**
- Location: `tests/Unit/` and `tests/Feature/`
- Use `pest()` for test cases (not `it()` or `test()`)

## Environment Variables

Key `.env` settings:
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

## Common Issues & Solutions

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
- `users` - Customers and staff
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

For full schema details, see `/Applications/MAMP/htdocs/hooknhunt/AI_Context.md`.
