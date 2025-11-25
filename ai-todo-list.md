# Hook & Hunt - Development Roadmap

## 🔴 CURRENT SPRINT: Operations & Logistics

### 1. Global Settings (Prerequisite for PO)
- [ ] **Backend:** Create `Settings` table, Seeder (Exchange Rate), and Controller.
- [ ] **Frontend:** Create `GlobalSettings.tsx` page to update Exchange Rate.

### 2. Product Variants (Prerequisite for PO)
- [ ] **Backend:** Implement `ProductVariantController` (CRUD).
- [ ] **Frontend:** Create `ProductVariantsTab.tsx` in Product Edit page.
    - [ ] Add Variant (SKU, Landed Cost).
    - [ ] Manage Channel Pricing (Retail/Wholesale/Daraz).

### 3. Purchase Orders (The Big Module)
- [ ] **Backend (DB):** Update migration for PO workflow fields (lot_no, tracking, etc.).
- [ ] **Backend (Logic):** Implement `PurchaseOrderController` with status transition logic.
- [ ] **Backend (Calc):** Implement Landed Cost Calculation logic (RMB + Shipping + Extra / Qty).
- [ ] **Frontend (Create):** `CreatePurchaseOrder.tsx` (Supplier Select -> Load Products -> Input RMB).
- [ ] **Frontend (Manage):** `PurchaseOrderDetails.tsx` (Timeline, Status Popups, Cost Inputs).

### 4. Inventory Management
- [ ] **Backend:** `InventoryController` (Stock adjustments).
- [ ] **Frontend:** Inventory Dashboard (View Stock Levels).

---

## 🟡 NEXT SPRINT: Sales & Storefront

### 5. Storefront API (Public)
- [ ] `GET /products` (List with filters).
- [ ] `GET /products/{slug}` (Detail).

### 6. Next.js Website (The Shop)
- [ ] Setup Next.js project.
- [ ] Homepage & Product Listing.
- [ ] Product Detail & Cart.
- [ ] Checkout & OTP Verification.

---

## ✅ COMPLETED TASKS
- [x] **Architecture:** Monorepo Setup (Laravel API + React UI).
- [x] **Database:** Full Schema Design (v1.3).
- [x] **Auth:** Sanctum (Admin & Storefront), OTP Logic.
- [x] **RBAC:** Role Middleware, User Management CRUD.
- [x] **Catalog:** Categories, Attributes, Attribute Options CRUD.
- [x] **Suppliers:** CRUD, QR Code Upload (Multipart).
- [x] **Products:** Basic CRUD, Image Upload.
- [x] **Linking:** Product <-> Supplier (Many-to-Many with JSON URLs).