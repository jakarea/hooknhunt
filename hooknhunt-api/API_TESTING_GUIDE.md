# Hook & Hunt API - Testing & Developer Guide

This document provides a comprehensive guide for testing the Hook & Hunt API (v2). It maps out the user journeys, endpoint specifications, demo inputs, and expected results.

**Base URL:** `http://localhost:8000/api/v2`  
**Authentication:** `Bearer <token>` (except Public/Auth routes)

---

## 1. Journey: Visitor & Authentication (Public)
*Entry point for all users (Customers & Staff).*

### 1.1 Register (Customer)
**Endpoint:** `POST /auth/customer/register`

**Input:**
```json
{
  "name": "John Doe",
  "phone": "01700000000",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Expected Result (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify OTP.",
  "data": {
    "user_id": 1,
    "phone": "01700000000"
  }
}
```

### 1.2 Login (General)
**Endpoint:** `POST /auth/login`

**Input:**
```json
{
  "phone": "01700000000",
  "password": "password123"
}
```

**Expected Result (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "1|laravel_sanctum_token...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

### 1.3 View Products (Public)
**Endpoint:** `GET /public/products`

**Query Params:** `?page=1&limit=15&category_slug=summer`

**Expected Result (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Summer T-Shirt",
      "slug": "summer-t-shirt",
      "thumbnail_url": "http://...",
      "price": 1200
    }
  ],
  "meta": {
    "total": 50
  }
}
```

---

## 2. Journey: System Setup (Super Admin)
*Initial configuration of the ERP system.*

### 2.1 Manage Roles
**Endpoint:** `POST /system/roles`  
**Middleware:** `permission:system.manage`

**Input:**
```json
{
  "name": "store_manager",
  "display_name": "Store Manager"
}
```

### 2.2 Manage Permissions
**Endpoint:** `GET /system/permissions`
**Expected Result:** List of all system capabilities (e.g., `product.create`, `order.view`).

### 2.3 Assign Permissions to Role
**Endpoint:** `POST /system/roles/{id}/sync-permissions`

**Input:**
```json
{
  "permissions": ["product.manage", "inventory.manage", "sales.manage"]
}
```

### 2.4 Units (e.g., Kg, Pcs)
**Endpoint:** `POST /system/units`

**Input:**
```json
{
  "name": "Kilogram",
  "short_name": "kg",
  "allow_decimal": true
}
```

---

## 3. Journey: User Management (HR / Admin)
*Managing staff and system users.*

### 3.1 Create Staff User
**Endpoint:** `POST /user-management/users`  
**Middleware:** `permission:user.create`

**Input:**
```json
{
  "name": "Staff User",
  "phone": "01800000000",
  "email": "staff@hooknhunt.com",
  "password": "password123",
  "role_id": 2 // e.g., Admin or Manager ID
}
```

### 3.2 Ban User
**Endpoint:** `POST /user-management/users/{id}/ban`  
**Middleware:** `permission:user.ban`

**Input:**
```json
{
  "reason": "Violation of policy"
}
```

---

## 4. Journey: Catalog Management (Product Manager)
*Creating the sellable items.*

### 4.1 Create Category
**Endpoint:** `POST /catalog/categories`

**Input:**
```json
{
  "name": "Men's Fashion",
  "parent_id": null,
  "is_featured": true
}
```

### 4.2 Create Brand
**Endpoint:** `POST /catalog/brands`

**Input:**
```json
{
  "name": "Nike",
  "slug": "nike"
}
```

### 4.3 Create Product (Parent)
**Endpoint:** `POST /catalog/products`

**Input:**
```json
{
  "name": "Air Jordan High",
  "category_id": 1,
  "brand_id": 1,
  "description": "Premium sneakers.",
  "status": "published",
  "gallery_images": [1, 2] // Media IDs
}
```

### 4.4 Create Variant (SKU)
**Endpoint:** `POST /catalog/products/{id}/variants`

**Input:**
```json
{
  "sku": "NIKE-AIR-RED-42",
  "variant_name": "Red / Size 42",
  "size": "42",
  "color": "Red",
  "default_retail_price": 15000,
  "default_purchase_cost": 12000,
  "stock_alert_level": 5,
  "is_active": true
}
```

### 4.5 Set Channel Pricing (Optional)
**Endpoint:** `POST /catalog/variants/{id}/channel-prices`

**Input:**
```json
{
  "channel": "daraz",
  "price": 16500 // Higher price for marketplace
}
```

---

## 5. Journey: Inventory Management (Store Keeper)
*Managing stock levels.*

### 5.1 Create Warehouse
**Endpoint:** `POST /inventory/warehouses`

**Input:**
```json
{
  "name": "Dhaka Central",
  "address": "Tejgaon, Dhaka",
  "phone": "017..."
}
```

### 5.2 Stock Sorting (Initial Stock / Unsorted)
**Endpoint:** `GET /inventory/unsorted`
**Result:** List of pending batches from Shipments/Production.

### 5.3 Sort/Add Stock
**Endpoint:** `POST /inventory/sort`

**Input:**
```json
{
  "product_variant_id": 1,
  "warehouse_id": 1,
  "quantity": 100,
  "batch_no": "LOT-2025-01",
  "cost_price": 12000, // Landed cost
  "expiry_date": "2026-12-31"
}
```

### 5.4 Stock Adjustment (Loss/Damage)
**Endpoint:** `POST /inventory/adjustments`

**Input:**
```json
{
  "warehouse_id": 1,
  "reason": "Water Damage",
  "items": [
    {
      "inventory_batch_id": 1,
      "qty": -2, // Negative to reduce
      "type": "damage"
    }
  ]
}
```

### 5.5 Current Stock Report
**Endpoint:** `GET /inventory/current-stock`  
**Expected Result:** List of variants with `total_qty` per warehouse.

---

## 6. Journey: Sales & POS (Salesman/Customer)
*Selling products.*

### 6.1 Create Order (Storefront/Admin)
**Endpoint:** `POST /sales/orders/create`

**Input:**
```json
{
  "customer_id": 1,
  "channel": "retail_web",
  "items": [
    {
      "product_variant_id": 1,
      "quantity": 2
    }
  ],
  "shipping_address": "House 10, Road 5...",
  "payment_method": "cod"
}
```

### 6.2 POS: Scan Product
**Endpoint:** `POST /sales/pos/scan`

**Input:**
```json
{
  "barcode": "NIKE-AIR-RED-42"
}
```
**Result:** Returns product details and current stock availability.

### 6.3 POS: Checkout
**Endpoint:** `POST /sales/pos/checkout`

**Input:**
```json
{
  "items": [...],
  "customer_phone": "017...", // Lookup or create guest
  "paid_amount": 30000,
  "discount": 500
}
```

---

## 7. Journey: Logistics (Shipping Manager)
*Fulfilling orders.*

### 7.1 Create Shipment Draft
**Endpoint:** `POST /logistics/workflow/draft`

**Input:**
```json
{
  "order_ids": [101, 102]
}
```

### 7.2 Update Workflow Step
**Endpoint:** `POST /logistics/workflow/{id}/update-step`

**Input:**
```json
{
  "step": "packed", // draft -> packed -> shipped -> delivered
  "courier_id": 1,
  "tracking_number": "PATHAO-123"
}
```

---

## 8. Journey: HRM (HR Manager)
*Employee management.*

### 8.1 Create Employee
**Endpoint:** `POST /hrm/employees`

**Input:**
```json
{
  "user_id": 5, // Link to existing user login
  "department_id": 1,
  "designation": "Sales Executive",
  "joining_date": "2024-01-01",
  "salary": 25000
}
```

### 8.2 Clock In
**Endpoint:** `POST /hrm/clock-in`  
**Input:** `(No body required, uses auth token user)`

### 8.3 Generate Payroll
**Endpoint:** `POST /hrm/payrolls/generate`

**Input:**
```json
{
  "month": "2025-01"
}
```

---

## 9. Journey: CRM (Marketing Manager)
*Managing leads and campaigns.*

### 9.1 Create Lead
**Endpoint:** `POST /crm/leads`

**Input:**
```json
{
  "name": "Interested Buyer",
  "phone": "019...",
  "source": "facebook",
  "status": "new"
}
```

### 9.2 Log Activity
**Endpoint:** `POST /crm/activities`

**Input:**
```json
{
  "lead_id": 1,
  "type": "call",
  "note": "Customer wants to buy next week."
}
```

---

## 10. Journey: Finance (Accountant)
*Tracking money.*

### 10.1 Create Expense
**Endpoint:** `POST /finance/expenses`

**Input:**
```json
{
  "amount": 500,
  "category": "Office Supplies",
  "note": "Bought paper and pens",
  "date": "2025-01-01"
}
```

### 10.2 Profit/Loss Report
**Endpoint:** `GET /finance/reports/profit-loss`
**Params:** `?start_date=2025-01-01&end_date=2025-01-31`

---

## 11. Journey: CMS (Content Manager)
*Website content.*

### 11.1 Create Banner
**Endpoint:** `POST /cms/banners`

**Input:**
```json
{
  "title": "Eid Sale",
  "image_id": 10,
  "link_url": "/category/eid-collection",
  "position": "home_main"
}
```

### 11.2 Manage Support Ticket
**Endpoint:** `POST /cms/support-tickets` (Customer side)
**Input:**
```json
{
  "subject": "Wrong item received",
  "message": "I ordered Red but got Blue.",
  "order_id": 101
}
```

---

## API Testing Tips

1.  **Status Codes:**
    - `200`: Success
    - `201`: Created (for POST)
    - `401`: Unauthenticated (Token missing/invalid)
    - `403`: Unauthorized (Permission denied)
    - `422`: Validation Error (Check `errors` object in response)

2.  **Date Format:** All dates should be `YYYY-MM-DD`.

3.  **Permissions:** If you receive a 403, ensure the Role assigned to your User has the specific permission listed in the middleware (e.g., `permission:product.manage`).
