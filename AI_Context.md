You are an expert software developer. You must follow all rules defined in this document. This is the central memory and single source of truth for the 'hooknhunt' project.

### 1. Project Overview
A 'headless' e-commerce ERP system.

### 2. Folder Structure (Monorepo)
- `/hooknhunt-api` (Backend: Laravel) ✅ **IMPLEMENTED**
- `/hooknhunt-ui` (Admin Panel: React.js) ✅ **IMPLEMENTED**
- `/hooknhunt` (Website: Next.js) ❌ **NOT STARTED**

### 3. Technology Stack
- **Backend API:** Laravel (Hosted on cPanel/VPS)
- **Admin Panel UI:** React.js (Hosted on cPanel as static files)
- **Website UI:** Next.js (Hosted on Vercel)
- **Security:** Laravel Sanctum

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
    - A single `product` (Parent) can be linked to multiple suppliers via `product_supplier` pivot (stores JSON array of URLs).
- **Inventory Logic:**
    - Stock is tracked at the `product_variant` level (SKU).
    - `landed_cost` is calculated and updated when a Purchase Order is received.
- **Loyalty System:**
    - Customers earn points based on their `role` (Retail vs. Wholesale).
- **Workflow (Product Entry):**
    1.  **Admin/StoreKeeper:** Creates a `product` (parent) and `product_variants`. Status is `draft`.
    2.  **Marketer:** Adds marketing info (`meta_title`, `gallery`), and changes status to `published`.
- **Purchase Order Workflow:**
    1.  **Draft:** Select Supplier -> Load Products -> Input RMB/Qty -> Save.
    2.  **Payment Confirmed:** Input Exchange Rate -> Generate PO Number.
    3.  **Dispatched:** Input Intl Courier & Tracking.
    4.  **Shipped to BD:** Input Lot Number.
    5.  **Arrived in BD:** Enable Shipping Cost input (Air/Sea).
    6.  **Transit to Bogura:** Input BD Tracking.
    7.  **Received at Hub:** Input Weight & Extra Cost -> **System calculates Landed Cost & Updates Stock**.

### 5. Branding
- **Primary Color:** Red.
- **BG Color:** `#fcf8f6`.

### 6. Database Schema (YAML)
*(Refer to v1.3 Schema - Users, Addresses, Categories, Suppliers, Products, ProductVariants, PurchaseOrders, Inventory, SalesOrders, etc.)*

### 6.5. Implementation Status (AS OF NOV 2025)

#### 6.5.1. Laravel API Status ✅ **85% COMPLETE**
- **Auth/Users:** ✅ Full Login, Register, OTP, RBAC, User CRUD.
- **Catalog:** ✅ Categories, Attributes, Attribute Options.
- **Suppliers:** ✅ Full CRUD + File Upload (QR).
- **Products:** ✅ Basic CRUD (Parent) + Image Upload.
- **Product-Supplier:** ✅ Attach/Detach with Multiple Links (JSON).
- **Missing:** Product Variant Logic, Purchase Order Logic, Inventory Logic.

#### 6.5.2. React Admin UI Status ✅ **75% COMPLETE**
- **Core:** ✅ Layout, Auth (Zustand), Role Guard.
- **Pages:** ✅ Dashboard, Categories, Suppliers (Page + Form), Users, Products (Basic + Supplier Tab).
- **Missing:** Product Variant Tab, Purchase Order Pages, Inventory Pages.

### 7. Role Management & Permissions
*(Refer to previous context for detailed RBAC rules)*

### 8. Admin UI Stack
- React, TypeScript, Shadcn, TailwindCSS, Zustand.

### 9. API Contract (Endpoints)

#### 9.1 Storefront API (`/api/v1/store`)
- `POST /auth/register`, `/auth/login`, `/auth/send-otp`, `/auth/verify-otp` ✅
- `GET /account/me`, `/addresses` ✅

#### 9.2 Admin API (`/api/v1/admin`)
- **Auth:** `POST /auth/login`, `POST /auth/logout`, `GET /me` ✅
- **Users:** CRUD `/users` ✅
- **Categories:** CRUD `/categories` ✅
- **Suppliers:** CRUD `/suppliers` (+ File Upload) ✅
- **Attributes:** CRUD `/attributes`, `/attribute-options` ✅
- **Products:**
    - `GET /products`, `POST /products`, `GET /products/{id}`, `PUT /products/{id}` ✅
    - `POST /products/{id}/suppliers` (Attach) ✅
    - `DELETE /products/{id}/suppliers/{supplier}` (Detach) ✅
- **Purchase Orders:** (NEXT)
    - `GET /purchase-orders`
    - `POST /purchase-orders` (Draft)
    - `PUT /purchase-orders/{id}/status` (Workflow)
- **Settings:** (NEXT)
    - `GET /settings`, `PUT /settings` (Exchange Rate)