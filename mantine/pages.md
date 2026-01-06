# 🧭 Hook & Hunt ERP – Navigation & API Map
Base API URL: http://localhost:8000/api/v2

---

## 🟦 MANAGEMENT

---

### 📊 Dashboard

#### • Dashboard
- Page Title: Main Dashboard
- Frontend URL: `/admin/dashboard`
- API:
  - GET `/finance/reports/daily-sales`
  - GET `/inventory/low-stock`

#### • Analytics
- Page Title: Real-time Analytics
- Frontend URL: `/admin/dashboard/analytics`
- API: 🔴 Missing (`DashboardController@analytics`)

#### • Notifications
- Page Title: Notifications
- Frontend URL: `/admin/notifications`
- API:
  - GET `/notifications`
  - POST `/notifications/read`

---

### 📦 Products

#### • Product List
- Page Title: Products
- Frontend URL: `/admin/products`
- API: GET `/catalog/products`

#### • Create Product
- Page Title: Create Product
- Frontend URL: `/admin/products/create`
- API: POST `/catalog/products`

#### • Product Details
- Page Title: Product Details
- Frontend URL: `/admin/products/{productId}`
- API: GET `/catalog/products/{id}`

#### • Edit Product
- Page Title: Edit Product
- Frontend URL: `/admin/products/{productId}/edit`
- API: PUT `/catalog/products/{id}`

#### • Variants
- Page Title: Product Variants
- Frontend URL: `/admin/products/{productId}/variants`
- API: POST `/catalog/products/{id}/variants`

#### • Categories
- Page Title: Categories
- Frontend URL: `/admin/products/categories`
- API: GET `/catalog/categories`

#### • Brands
- Page Title: Brands
- Frontend URL: `/admin/products/brands`
- API: GET `/catalog/brands`

#### • Attributes
- Page Title: Attributes
- Frontend URL: `/admin/products/attributes`
- API: 🔴 Missing (`AttributeController`)

#### • Units
- Page Title: Units
- Frontend URL: `/admin/products/units`
- API: GET `/system/units`

#### • Print Labels
- Page Title: Barcode Printing
- Frontend URL: `/admin/products/print-labels`
- API: POST `/catalog/products/print-labels`

---

### 🏭 Inventory

#### • Stock Overview
- Page Title: Current Stock
- Frontend URL: `/admin/inventory/stock`
- API: GET `/inventory/current-stock`

#### • Stock History
- Page Title: Stock Movement
- Frontend URL: `/admin/inventory/history`
- API: GET `/inventory/batches/{variantId}`

#### • Stock Adjustments
- Page Title: Adjustments
- Frontend URL: `/admin/inventory/adjustments`
- API: POST `/inventory/adjustments`

#### • Stock Take
- Page Title: Stock Audit
- Frontend URL: `/admin/inventory/stock-take`
- API: 🔴 Missing

#### • Warehouses
- Page Title: Warehouses
- Frontend URL: `/admin/inventory/warehouses`
- API: GET `/inventory/warehouses`

#### • Transfers
- Page Title: Warehouse Transfers
- Frontend URL: `/admin/inventory/transfers`
- API: 🔴 Missing

---

### 🚚 Procurement

#### • Suppliers
- Page Title: Suppliers
- Frontend URL: `/admin/procurement/suppliers`
- API: GET `/user-management/suppliers`

#### • Supplier Ledger
- Page Title: Supplier Ledger
- Frontend URL: `/admin/procurement/suppliers/{supplierId}`
- API: GET `/user-management/suppliers/{id}/ledger`

#### • Purchase Orders
- Page Title: Purchase Orders
- Frontend URL: `/admin/procurement/purchase-orders`
- API: 🔴 Missing

#### • Create Purchase Order
- Page Title: Create Purchase Order
- Frontend URL: `/admin/procurement/purchase-orders/create`
- API: 🔴 Missing

#### • Purchase Returns
- Page Title: Purchase Returns
- Frontend URL: `/admin/procurement/purchase-returns`
- API: 🔴 Missing

---

### 🚢 Import & Shipments

#### • Shipments
- Page Title: Import Shipments
- Frontend URL: `/admin/import/shipments`
- API: GET `/logistics/shipments`

#### • Create Shipment
- Page Title: Create Shipment
- Frontend URL: `/admin/import/shipments/create`
- API: POST `/logistics/shipments`

#### • Shipment Details
- Page Title: Shipment Workflow
- Frontend URL: `/admin/import/shipments/{shipmentId}`
- API: GET `/logistics/workflow/{id}/history`

#### • Costing
- Page Title: Shipment Costing
- Frontend URL: `/admin/import/shipments/{shipmentId}/costing`
- API: POST `/logistics/shipments/{id}/costs`

#### • Receive Stock
- Page Title: Receive Stock
- Frontend URL: `/admin/import/shipments/{shipmentId}/receive`
- API: POST `/logistics/workflow/{id}/receive`

---

### 🛍️ Sales

#### • Orders
- Page Title: Sales Orders
- Frontend URL: `/admin/sales/orders`
- API: GET `/sales/orders`

#### • Order Details
- Page Title: Order Details
- Frontend URL: `/admin/sales/orders/{orderId}`
- API: GET `/sales/orders/{id}`

#### • Create Order
- Page Title: Create Order
- Frontend URL: `/admin/sales/orders/create`
- API: POST `/sales/orders/create`

#### • Returns
- Page Title: Sales Returns
- Frontend URL: `/admin/sales/returns`
- API: POST `/sales/returns`

#### • Quotations
- Page Title: Quotations
- Frontend URL: `/admin/sales/quotations`
- API: 🔴 Missing

---

### 🖥️ POS

#### • POS Terminal
- Page Title: Point of Sale
- Frontend URL: `/admin/pos`
- API:
  - GET `/sales/pos/products`
  - POST `/sales/pos/checkout`

#### • POS History
- Page Title: POS Sales History
- Frontend URL: `/admin/pos/history`
- API: GET `/sales/orders?channel=pos`

#### • Register Report
- Page Title: Register Close
- Frontend URL: `/admin/pos/register`
- API: 🔴 Missing

#### • Held Orders
- Page Title: Held Orders
- Frontend URL: `/admin/pos/held`
- API: 🔴 Missing

---

### 🤝 CRM

#### • Customers
- Page Title: Customers
- Frontend URL: `/admin/crm/customers`
- API: GET `/sales/customers`

#### • Customer Details
- Page Title: Customer Profile
- Frontend URL: `/admin/crm/customers/{customerId}`
- API: GET `/sales/customers/{id}`

#### • Leads
- Page Title: Leads
- Frontend URL: `/admin/crm/leads`
- API: GET `/crm/leads`

#### • Wallet
- Page Title: Customer Wallet
- Frontend URL: `/admin/crm/wallet`
- API: 🔴 Missing

---

### 👥 HRM

#### • Employees
- Page Title: Employees
- Frontend URL: `/admin/hrm/staff`
- API: GET `/hrm/staff`

#### • Employee Profile
- Page Title: Employee Profile
- Frontend URL: `/admin/hrm/staff/{employeeId}`
- API: GET `/hrm/staff/{id}`

---

## 🟨 DOCUMENTS

---

### 💰 Finance

#### • Journals
- Page Title: Transactions
- Frontend URL: `/admin/finance/journals`
- API: GET `/finance/journals`

#### • Expenses
- Page Title: Expenses
- Frontend URL: `/admin/finance/expenses`
- API: POST `/finance/expenses`

#### • Profit & Loss
- Page Title: Profit & Loss
- Frontend URL: `/admin/finance/reports/profit-loss`
- API: GET `/finance/reports/profit-loss`

---

### 📊 Reports

#### • Sales Report
- Page Title: Sales Report
- Frontend URL: `/admin/reports/sales`
- API: GET `/finance/reports/daily-sales`

#### • Stock Report
- Page Title: Stock Valuation
- Frontend URL: `/admin/reports/stock`
- API: 🔴 Missing

---

## 🟩 SETTINGS

---

### 👤 User & Access

#### • Users
- Page Title: Users
- Frontend URL: `/admin/settings/users`
- API: GET `/user-management/users`

#### • Roles
- Page Title: Roles
- Frontend URL: `/admin/settings/roles`
- API: GET `/system/roles`

#### • Permissions
- Page Title: Permissions
- Frontend URL: `/admin/settings/permissions`
- API: GET `/system/permissions`

---

### ⚙️ System Settings

#### • General
- Page Title: General Settings
- Frontend URL: `/admin/settings/general`
- API: GET `/system/settings`

#### • Payments
- Page Title: Payment Settings
- Frontend URL: `/admin/settings/payments`
- API: GET `/system/settings?group=payment`

#### • Taxes
- Page Title: Tax Settings
- Frontend URL: `/admin/settings/taxes`
- API: GET `/system/settings?group=tax`

#### • API Keys
- Page Title: API Keys
- Frontend URL: `/admin/settings/api`
- API: GET `/system/settings?group=api`

#### • Backup
- Page Title: Backup & Restore
- Frontend URL: `/admin/settings/backup`
- API: 🔴 Missing

---
