# 🏛️ Hook & Hunt ERP  
## Final UI & API Mapping – Master Document

**Base API URL:** `http://localhost:8000/api/v2`

---

## 🟢 1. Authentication & Security (Public Layout)

| Page Title | Frontend Route | Description | API Endpoint |
|----------|---------------|-------------|--------------|
| Login | `/login` | Admin & Staff Login | `POST /auth/login` |
| Register | `/register` | New Staff Registration | `POST /auth/register` |
| Forgot Password | `/password/forgot` | Email/SMS Reset Request | 🔴 Missing (`ForgotPasswordController`) |
| Reset Password | `/password/reset` | Set New Password | 🔴 Missing (`ResetPasswordController`) |
| Verify OTP | `/auth/verify-otp` | 2FA / Security Check | `POST /auth/verify-otp` |
| Lock Screen | `/auth/lock` | Session Timeout | Frontend Logic (LocalStorage) |

---

## 🔵 2. Dashboard & Core

| Page Title | Frontend Route | Description | API Endpoint |
|----------|---------------|-------------|--------------|
| Main Dashboard | `/admin/dashboard` | Sales & Stock Widgets | `GET /finance/reports/daily-sales`<br>`GET /inventory/low-stock` |
| Real-time Analytics | `/admin/dashboard/analytics` | Live Charts | 🔴 Missing (`DashboardController@analytics`) |
| My Profile | `/admin/profile` | Personal Info | `GET /auth/me`<br>`PUT /auth/profile` |
| Notifications | `/admin/notifications` | Alerts | `GET /notifications`<br>`POST /notifications/read` |

---

## 📦 3. Product Catalog (PIM)

| Page Title | Route | Description | API |
|-----------|------|-------------|-----|
| All Products | `/admin/catalog/products` | List View | `GET /catalog/products` |
| Add Product | `/admin/catalog/products/create` | Create Product | `POST /catalog/products` |
| Edit Product | `/admin/catalog/products/edit/:id` | Update Product | `PUT /catalog/products/{id}` |
| Variants Manager | `/admin/catalog/variants` | Stock & Price | `POST /catalog/products/{id}/variants` |
| Categories | `/admin/catalog/categories` | Tree View | `GET /catalog/categories` |
| Brands | `/admin/catalog/brands` | Manufacturers | `GET /catalog/brands` |
| Attributes | `/admin/catalog/attributes` | Size / Color | 🔴 Missing (`AttributeController`) |
| Units | `/admin/catalog/units` | Kg / Pcs | `GET /system/units` |
| Print Labels | `/admin/catalog/print-labels` | Barcode | `POST /catalog/products/print-labels` |

---

## 🚚 4. Procurement (Purchase & Suppliers)

| Page | Route | Description | API |
|----|------|-------------|----|
| Purchase Orders | `/admin/procurement/orders` | PO List | 🔴 Missing |
| Create PO | `/admin/procurement/create` | Vendor Order | 🔴 Missing |
| Suppliers | `/admin/procurement/suppliers` | Vendor DB | `GET /user-management/suppliers` |
| Supplier Ledger | `/admin/procurement/suppliers/:id` | Payment History | `GET /user-management/suppliers/{id}/ledger` |
| Purchase Returns | `/admin/procurement/returns` | Vendor Returns | 🔴 Missing |

---

## 🚢 5. Import Shipment (China → BD)

| Page | Route | Description | API |
|----|------|-------------|----|
| Shipments | `/admin/shipments` | Container List | `GET /logistics/shipments` |
| Create Shipment | `/admin/shipments/create` | Import Lot | `POST /logistics/shipments` |
| Workflow View | `/admin/shipments/view/:id` | Status Timeline | `GET /logistics/workflow/{id}/history` |
| Costing Sheet | `/admin/shipments/costing/:id` | Shipping Cost | `POST /logistics/shipments/{id}/costs` |
| Receive Stock | `/admin/shipments/receive/:id` | Final Receive | `POST /logistics/workflow/{id}/receive` |

---

## 🏭 6. Inventory Management (WMS)

| Page | Route | Description | API |
|----|------|-------------|----|
| Current Stock | `/admin/inventory/stock` | Available Stock | `GET /inventory/current-stock` |
| Unsorted Stock | `/admin/inventory/sorting` | Sort Items | `GET /inventory/unsorted`<br>`POST /inventory/sort` |
| Stock History | `/admin/inventory/history` | Movement Log | `GET /inventory/batches/{variantId}` |
| Warehouses | `/admin/inventory/warehouses` | Locations | `GET /inventory/warehouses` |
| Transfers | `/admin/inventory/transfers` | WH Transfer | 🔴 Missing |
| Adjustments | `/admin/inventory/adjustments` | Loss/Damage | `POST /inventory/adjustments` |
| Stock Take | `/admin/inventory/stock-take` | Audit | 🔴 Missing |

---

## 🛍️ 7. Sales Order Management

| Page | Route | Description | API |
|----|------|-------------|----|
| Orders | `/admin/sales/orders` | List | `GET /sales/orders` |
| Order Details | `/admin/sales/orders/view/:id` | Invoice | `GET /sales/orders/{id}` |
| Create Order | `/admin/sales/create` | Manual | `POST /sales/orders/create` |
| Returns | `/admin/sales/returns` | RMA | `POST /sales/returns` |
| Quotations | `/admin/sales/quotations` | Pre-Sales | 🔴 Missing |

---

## 🖥️ 8. POS (Point of Sale)

| Page | Route | Description | API |
|----|------|-------------|----|
| POS Terminal | `/admin/pos` | Checkout | `GET /sales/pos/products`<br>`POST /sales/pos/checkout` |
| Sales History | `/admin/pos/history` | POS Sales | `GET /sales/orders?channel=pos` |
| Register Report | `/admin/pos/register` | Day Close | 🔴 Missing |
| Held Orders | `/admin/pos/held` | Draft Carts | 🔴 Missing |

---

## 🛵 9. Logistics & Delivery

| Page | Route | Description | API |
|----|------|-------------|----|
| Courier Booking | `/admin/logistics/booking` | Pathao | `POST /logistics/courier/book/{order_id}` |
| Tracking Hub | `/admin/logistics/tracking` | Live Status | `GET /sales/orders/{id}/tracking` |
| Couriers | `/admin/logistics/couriers` | Config | `GET /logistics/couriers` |
| Zones | `/admin/logistics/zones` | Rates | `GET /logistics/couriers/{id}/zone-rates` |

---

## 🤝 10. CRM & Marketing

| Page | Route | Description | API |
|----|------|-------------|----|
| Customers | `/admin/crm/customers` | Database | `GET /sales/customers` |
| Leads | `/admin/crm/leads` | Pipeline | `GET /crm/leads` |
| Wallet | `/admin/crm/wallet` | Balance | 🔴 Missing |
| Campaigns | `/admin/marketing/campaigns` | SMS/Email | `POST /crm/campaigns` |
| Affiliates | `/admin/marketing/affiliates` | Partners | `GET /affiliates` |
| Loyalty Rules | `/admin/crm/loyalty` | Points | `GET /loyalty-rules` |

---

## 👥 11. HRM

| Page | Route | Description | API |
|----|------|-------------|----|
| Employees | `/admin/hrm/staff` | Profiles | `GET /hrm/staff` |
| Departments | `/admin/hrm/departments` | Org | `GET /hrm/departments` |
| Attendance | `/admin/hrm/attendance` | Clock In | `POST /hrm/clock-in` |
| Payroll | `/admin/hrm/payroll` | Salary | `POST /hrm/payrolls/generate`<br>`GET /hrm/payrolls` |

---

## 💰 12. Finance & Accounting

| Page | Route | Description | API |
|----|------|-------------|----|
| Transactions | `/admin/finance/transactions` | Journals | `GET /finance/journals` |
| Expenses | `/admin/finance/expenses` | Costs | `POST /finance/expenses` |
| Accounts | `/admin/finance/accounts` | Cash/Bank | `GET /finance/accounts` |
| Profit & Loss | `/admin/finance/reports/pl` | Report | `GET /finance/reports/profit-loss` |

---

## 🎧 13. Support & Ticketing

| Page | Route | Description | API |
|----|------|-------------|----|
| Tickets | `/admin/support/tickets` | Complaints | `GET /cms/support-tickets` |
| Ticket Reply | `/admin/support/tickets/:id` | Chat | `POST /cms/support-tickets/{id}/reply` |
| Categories | `/admin/support/categories` | Types | 🔴 Missing |

---

## 🌐 14. Website CMS

| Page | Route | Description | API |
|----|------|-------------|----|
| Banners | `/admin/cms/banners` | Sliders | `GET /cms/banners` |
| Menus | `/admin/cms/menus` | Header/Footer | `GET /cms/menus` |
| Pages | `/admin/cms/pages` | Static | `GET /cms/landing-pages` |
| Blog | `/admin/cms/blog` | Articles | 🔴 Missing |
| Media | `/admin/cms/media` | Files | `GET /media/files` |

---

## 📊 15. Reports

| Page | Route | Description | API |
|----|------|-------------|----|
| Sales Report | `/admin/reports/sales` | Analytics | `GET /finance/reports/daily-sales` |
| Stock Report | `/admin/reports/stock` | Valuation | 🔴 Missing |
| Product Report | `/admin/reports/products` | Best Sellers | 🔴 Missing |
| Customer Report | `/admin/reports/customers` | Top Buyers | 🔴 Missing |
| Tax Report | `/admin/reports/tax` | VAT | 🔴 Missing |

---

## 🛡️ 16. User & Role Management

| Page | Route | Description | API |
|----|------|-------------|----|
| Users | `/admin/users` | List | `GET /user-management/users` |
| Roles | `/admin/users/roles` | Access | `GET /system/roles` |
| Permissions | `/admin/users/permissions` | ACL | `GET /system/permissions` |
| Audit Logs | `/admin/users/audit-logs` | Security | `GET /admin/audit-logs` |

---

## ⚙️ 17. System Settings

| Page | Route | Description | API |
|----|------|-------------|----|
| General | `/admin/settings/general` | Site Config | `GET /system/settings` |
| Payments | `/admin/settings/payments` | Gateways | `GET /system/settings?group=payment` |
| API Keys | `/admin/settings/api` | SMS/Courier | `GET /system/settings?group=api` |
| Backup | `/admin/settings/backup` | DB Backup | 🔴 Missing |
| Taxes | `/admin/settings/taxes` | VAT | `GET /system/settings?group=tax` |

---

## ✅ Status Legend
- 🟢 Implemented  
- 🔴 Missing API / Controller Required  

---

**© Hook & Hunt ERP – System Architecture Blueprint**
