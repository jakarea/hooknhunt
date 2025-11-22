You are an expert software developer. You must follow all rules defined in this document. This is the central memory and single source of truth for the 'hooknhunt' project.

### 1. Project Overview
A 'headless' e-commerce ERP system.

### 2. Folder Structure (Monorepo)
- `/hooknhunt-api` (Backend: Laravel)
- `/hooknhunt-ui` (Admin Panel: React.js)
- `/hooknhunt` (Website: Next.js)

### 3. Technology Stack
- **Backend API:** Laravel (Hosted on cPanel/VPS)
- **Admin Panel UI:** React.js (Hosted on cPanel as static files)
- **Website UI:** Next.js (Hosted on Vercel)

### 4. Core Business Logic & Features
- **Product Architecture:** Must support **Product Variations** using a **"Flat Variant" (Option 1)** model.
    - `products` (Parent: Name, Description, SEO).
    - `product_variants` (Child/SKU: Stores Landed Cost AND all channel-specific data like `retail_name`, `retail_price`, `wholesale_name`, `wholesale_price`, `daraz_name`, `daraz_price`, etc.).
- **Sales Channels:**
    1.  **Retail (Website):** Next.js site shows `retail_price`.
    2.  **Wholesale (Website):** Users with `role=wholesale_customer` log in to the *same* Next.js site but see `wholesale_price` and must respect `moq_wholesale`.
    3.  **Daraz:** Data will be stored for future API integration.
    4.  **POS (Admin Panel):** A React.js interface for `seller` role to create orders.
- **Supplier Logic:**
    - Suppliers store `shop_name`, `shop_url`, `email`, `wechat_id`, `alipay_id`, etc.
    - A single `product` (Parent) can be linked to multiple suppliers.
- **Inventory Logic:**
    - Stock is tracked at the `product_variant` level (SKU).
    - `landed_cost` is calculated and updated when a Purchase Order is received.
- **Loyalty System:**
    - Customers earn points based on their `role` (Retail vs. Wholesale).
- **Workflow (Product Entry):**
    1.  **Admin/StoreKeeper:** Creates a `product` (parent) and `product_variants` with basic info (SKU, Landed Cost, Prices). Status is `draft`.
    2.  **Marketer:** Receives a notification, finds the `draft` product, adds marketing info (`meta_title`, `gallery`), and changes status to `published`.
- **Security:**
    - API is secured by Laravel Sanctum.
    - Website orders (Cash on Delivery) must be verified via SMS (OTP).
    - API must use CORS to allow requests *only* from Vercel (`hooknhunt`) and cPanel (`hooknhunt-ui`) domains.

### 5. Branding (Initial)
- **Logo:** `./hook-and-hunt-logo.svg`
- **Primary Color:** Red (related to logo)
- **Reference Website:** `https://naviforce.com.bd/`
- **BG Color:** `very light bg: #fcf8f6` (suggestion, not bound)

### 6. Database Schema (YAML)
```yaml
Tables:
  - users:
      - id (PK)
      - name: string
      - email: string (unique)
      - password: string
      - role: enum('super_admin', 'admin', 'seller', 'store_keeper', 'marketer', 'retail_customer', 'wholesale_customer')
      - phone_number: string (unique)
      - whatsapp_number: string (nullable)
      - otp_code: string (nullable)
      - otp_expires_at: timestamp (nullable)
      - phone_verified_at: timestamp (nullable)
      - created_at, updated_at

  - addresses:
      - id (PK)
      - user_id: foreign (references 'users', onDelete 'cascade')
      - type: enum('shipping', 'billing') (default: 'shipping')
      - is_default: boolean (default: false)
      - full_name: string
      - address_line_1: string
      - address_line_2: string (nullable)
      - city: string
      - district: string
      - post_code: string (nullable)
      - phone_number: string (Address-specific phone)
      - created_at, updated_at

  - categories:
      - id (PK)
      - name: string
      - slug: string (unique)
      - parent_id: foreign (nullable, references 'id' on 'categories', onDelete 'set null')
      - created_at, updated_at

  - suppliers:
      - id (PK)
      - name: string (Contact person name)
      - shop_name: string (nullable)
      - email: string (nullable, unique)
      - shop_url: string (nullable)
      - wechat_id: string (nullable)
      - wechat_qr_url: string (nullable)
      - alipay_id: string (nullable)
      - alipay_qr_url: string (nullable)
      - contact_info: text (nullable)
      - created_at, updated_at

  - products: (The "Parent" Product)
      - id (PK)
      - base_name: string (e.g., "T-Shirt")
      - slug: string (unique)
      - status: enum('draft', 'published') (default: 'draft')
      - meta_title: string (nullable, Marketer entry)
      - meta_description: text (nullable)
      - base_thumbnail_url: string (nullable)
      - gallery_images: json (nullable)
      - created_at, updated_at

  - attributes: (e.g., "Color", "Size")
      - id (PK)
      - name: string (unique)

  - attribute_options: (e.g., "Red", "Blue", "M", "L")
      - id (PK)
      - attribute_id: foreign (references 'attributes', onDelete 'cascade')
      - value: string (e.g., "Red")

  - product_variants: (The "Sellable" SKU - Flat Model "Option 1")
      - id (PK)
      - product_id: foreign (references 'products', onDelete 'cascade')
      - sku: string (unique)
      - landed_cost: decimal(10, 2) (default: 0)
      
      # --- Retail Channel Fields ---
      - retail_name: string
      - retail_price: decimal(10, 2) (default: 0)
      - retail_offer_discount_type: enum('flat', 'percentage') (nullable)
      - retail_offer_discount_value: decimal(10, 2) (nullable)
      - retail_offer_start_date: timestamp (nullable)
      - retail_offer_end_date: timestamp (nullable)
      
      # --- Wholesale Channel Fields ---
      - wholesale_name: string
      - wholesale_price: decimal(10, 2) (default: 0)
      - moq_wholesale: integer (default: 10)
      - wholesale_offer_discount_type: enum('flat', 'percentage') (nullable)
      - wholesale_offer_discount_value: decimal(10, 2) (nullable)
      - wholesale_offer_start_date: timestamp (nullable)
      - wholesale_offer_end_date: timestamp (nullable)

      # --- Daraz Channel Fields (NEW) ---
      - daraz_name: string (nullable)
      - daraz_price: decimal(10, 2) (default: 0)
      - moq_daraz: integer (default: 1)
      - daraz_offer_discount_type: enum('flat', 'percentage') (nullable)
      - daraz_offer_discount_value: decimal(10, 2) (nullable)
      - daraz_offer_start_date: timestamp (nullable)
      - daraz_offer_end_date: timestamp (nullable)

      # --- Other Fields ---
      - variant_thumbnail_url: string (nullable)
      - created_at, updated_at

  - variant_attribute_options: (Pivot: Links a Variant to its options, e.g., Variant 1 -> Option 'L')
      - product_variant_id: foreign (references 'product_variants', onDelete 'cascade')
      - attribute_option_id: foreign (references 'attribute_options', onDelete 'cascade')
      - (Primary key: [product_variant_id, attribute_option_id])

  - product_category: (Pivot: Links Parent Product to Categories)
      - product_id: foreign (references 'products', onDelete 'cascade')
      - category_id: foreign (references 'categories', onDelete 'cascade')
      - (Primary key: [product_id, category_id])

  - product_supplier: (Pivot: Links Parent Product to Suppliers)
      - product_id: foreign (references 'products', onDelete 'cascade')
      - supplier_id: foreign (references 'suppliers', onDelete 'cascade')
      - supplier_product_url: string (nullable)
      - (Primary key: [product_id, supplier_id])

  - purchase_orders:
      - id (PK)
      - supplier_id: foreign (references 'suppliers', onDelete 'set null', nullable)
      - status: enum('draft', 'payment_confirmed', 'supplier_dispatched', 'shipped_bd', 'arrived_bd', 'in_transit_bogura', 'received_hub', 'completed', 'lost') (default: 'draft')
      - created_at, updated_at

  - purchase_order_items:
      - id (PK)
      - po_id: foreign (references 'purchase_orders', onDelete 'cascade')
      - product_variant_id: foreign (references 'product_variants', onDelete 'set null', nullable)
      - china_price: decimal(10, 2)
      - quantity: integer
      - shipping_cost: decimal(10, 2) (nullable)
      - extra_cost: decimal(10, 2) (nullable)
      - lost_value: decimal(10, 2) (nullable)

  - inventory:
      - id (PK)
      - product_variant_id: foreign (references 'product_variants', onDelete 'cascade', unique)
      - quantity: integer (default: 0)

  - sales_orders:
      - id (PK)
      - user_id: foreign (references 'users', onDelete 'set null', nullable)
      - status: enum('pending_verification', 'processing', 'completed', 'cancelled')
      - total_amount: decimal(10, 2)
      - discount_amount: decimal(10, 2) (default: 0)
      - delivery_charge: decimal(10, 2) (default: 0)
      - order_type: enum('pos', 'web')
      - order_channel: enum('retail', 'wholesale', 'daraz') (UPDATED)
      - otp_code: string (nullable)
      - shipping_address_snapshot: json (nullable)
      - billing_address_snapshot: json (nullable)
      - created_at, updated_at

  - sales_order_items:
      - id (PK)
      - order_id: foreign (references 'sales_orders', onDelete 'cascade')
      - product_variant_id: foreign (references 'product_variants', onDelete 'set null', nullable)
      - quantity: integer
      - unit_price: decimal(10, 2) (The price at the time of sale)
      - landed_cost_at_sale: decimal(10, 2)

  - loyalty_rules:
      - id (PK)
      - role_type: enum('retail_customer', 'wholesale_customer') (unique)
      - points_per_taka: decimal(8, 4) (e.g., 0.01)

  - loyalty_transactions:
      - id (PK)
      - user_id: foreign (references 'users', onDelete 'cascade')
      - order_id: foreign (references 'sales_orders', onDelete 'set null', nullable)
      - points_earned: decimal(10, 2)
      - description: string
      - created_at, updated_at
```

### 7.  Role Management & Permissions (NEW SECTION)

This section defines the Access Control (RBAC) for the entire system.

Super Admin (super_admin):

Access: Full system access. Unrestricted.

Abilities: Can see all financial reports. Can create, read, update, and delete all other users, including other super_admins. Can change system settings.

Admin (admin):

Access: Full access to all operational modules (Products, Purchase, Sales, Inventory, Marketing).

Abilities: Can create, read, update, and delete admin, seller, store_keeper, and marketer users.

Restrictions:

CANNOT see sensitive financial reports (e.g., Balance Sheet, final Profit/Loss).

CANNOT create or delete super_admin users.

Seller (seller):

Access: Limited to POS, Sales Orders, and Customer modules.

Abilities: Can create new sales orders (POS), see stock levels (inventory quantity), and view customer info.

Restrictions:

CANNOT see landed_cost or wholesale_price (unless specified).

CANNOT access Purchase Orders, Suppliers, or System Settings.

Store Keeper (store_keeper):

Access: Limited to Purchase Orders and Inventory modules.

Abilities: Can update PO status (e.g., 'Received at Hub'), input landed_cost upon receiving stock, and manage inventory counts. Can view Sales Orders to pack items.

Restrictions:

CANNOT see any selling prices (retail_price, wholesale_price, daraz_price).

CANNOT create sales orders or access customer financial data.

Marketer (marketer):

Access: Limited to Product module (marketing fields).

Abilities: Can update meta_title, meta_description, gallery_images, and change product status from 'draft' to 'published'.

Restrictions:

CANNOT change prices or landed_cost.

CANNOT access Sales, Purchase, or System Settings.

Retail Customer (retail_customer):

Access: Website (/hooknhunt) only.

Abilities: Sees retail_price. Earns retail loyalty points. Manages own profile and addresses.

Restrictions: NO access to Admin Panel (/hooknhunt-ui).

Wholesale Customer (wholesale_customer):

Access: Website (/hooknhunt) only.

Abilities: Sees wholesale_price. Must adhere to moq_wholesale. Earns wholesale loyalty points.

Restrictions: NO access to Admin Panel (/hooknhunt-ui).

### 8. Admin UI (hooknhunt-ui) Stack (NEW SECTION)
- **Framework:** React.js
- **Language:** TypeScript
- **UI:** Shadcn (Component Library)
- **Styling:** TailwindCSS
- **State Management:** Zustand (preferred) or Redux
- **Features:**
    - Light/Dark Mode
    - Translation (i18n) - English & Bangla
    - Skeleton Preloaders for all data-fetching pages.

### 9. API Contract (Endpoints)
This is the single source of truth for all API endpoints. The UI must be built against these contracts.

#### 9.1 Storefront API (`/api/v1/store`)
- **Auth (Public):**
    - `POST /auth/register` (Body: name, email, phone_number, password)
    - `POST /auth/login` (Body: phone_number, password) -> Returns Token
    - `POST /auth/send-otp` (Body: phone_number)
    - `POST /auth/verify-otp` (Body: phone_number, otp_code) -> Returns Token
- **Account (Protected: auth:sanctum):**
    - `GET /account/me` -> Returns User (with addresses)
    - `POST /account/logout`
    - `PUT /account/profile` (Body: name, whatsapp_number, email)
    - `GET /account/addresses`
    - `POST /account/addresses` (Body: type, is_default, full_name, address_line_1, etc.)
    - `DELETE /account/addresses/{address}`
- **Products (Public):**
    - (Future)
- **Orders (Protected):**
    - (Future)

#### 9.2 Admin API (`/api/v1/admin`)
- **Auth (Public):**
    - `POST /auth/login` (Body: phone_number, password) -> Returns Token
- **Auth (Protected: auth:sanctum):**
    - `POST /auth/logout`
    - `GET /me` -> Returns Staff User (with role)
- **User Management (Protected: role:super_admin,admin):**
    - `GET /users`
    - `POST /users` (Body: name, phone_number, password, role)
    - `GET /users/{user}`
    - `PUT /users/{user}` (Body: name, phone_number, role, password?)
    - `DELETE /users/{user}`
- **Categories (Protected: role:super_admin,admin,marketer):**
    - `GET /categories`
    - `POST /categories` (Body: name, slug, parent_id?)
    - `GET /categories/{category}`
    - `PUT /categories/{category}` (Body: name, slug, parent_id?)
    - `DELETE /categories/{category}`
- **Suppliers (Protected: role:super_admin,admin,store_keeper):**
    - `GET /suppliers`
    - `POST /suppliers` (Body: name, shop_name, email, etc.)
    - `GET /suppliers/{supplier}`
    - `PUT /suppliers/{supplier}` (Body: ...)
    - `DELETE /suppliers/{supplier}`
- **Attributes (Protected: role:super_admin,admin):**
    - `GET /attributes`
    - `POST /attributes` (Body: name)
    - `GET /attributes/{attribute}`
    - `PUT /attributes/{attribute}` (Body: name)
    - `DELETE /attributes/{attribute}`
- **Attribute Options (Protected: role:super_admin,admin):**
    - `GET /attribute-options` (Query Param: `attribute_id`)
    - `POST /attribute-options` (Body: attribute_id, value)
    - `GET /attribute-options/{attributeOption}`
    - `PUT /attribute-options/{attributeOption}` (Body: value)
    - `DELETE /attribute-options/{attributeOption}`