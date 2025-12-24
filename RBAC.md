# 🛡️ Role-Based Access Control (RBAC) Master Specification
**Project:** HooknHunt ERP
**Version:** 1.3 (Final Complete)
**Last Updated:** December 2025

This document serves as the **single source of truth** for all user permissions, access levels, and security logic within the HooknHunt administration panel.

---

## 1. 👥 Role Hierarchy & Definitions

The system operates on a hierarchical model.

| Role Slug | Display Name | Core Responsibility | Access Level |
| :--- | :--- | :--- | :--- |
| **`super_admin`** | **Super Admin** | Business Owner / CTO | **God Mode.** Unrestricted access to financial configs, payment gateways, and profit data. |
| **`admin`** | **Administrator** | General Manager | **Operational Head.** Manages day-to-day Sales, Sourcing, and HR. Restricted from global financial settings. |
| **`manager`** | **Manager** | Branch/Operations Manager | **Mid-Level Management.** Oversees daily operations, can manage staff within branch, but cannot access global financial settings or delete core data. |
| **`supervisor`** | **Supervisor** | Team Lead / Auditor | **Oversight.** Monitors performance and audits stock/sales. Mostly **Read-Only** access. |
| **`store_keeper`** | **Store Keeper** | Warehouse Manager | **Inventory Focus.** Receives stock, manages dispatch, prints labels. No access to financials or user management. |
| **`marketer`** | **Marketer** | Marketing Specialist | **Growth Focus.** Manages content, SEO, and campaigns. Restricted from viewing cost prices and supplier data. |
| **`seller`** | **Sales Man** | Showroom/Sales Rep | **POS Focus.** Manages direct sales and customers. Limited view of backend sourcing. |

---

## 2. ✅ Active Module Access Matrix

These modules are currently live in the system menu.

### 📊 Core & Dashboard
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `marketer` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard (Overview)** | ✅ Full | ✅ Full | ✅ Branch | ⚠️ Team Only | ⚠️ Stock Widgets | ⚠️ Analytics | ⚠️ Sales Widgets |

### 📦 Inventory & Products
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `marketer` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **All Products List** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ Read Only |
| **Create/Edit Product** | ✅ | ✅ | ✅ | ⚠️ Edit Only | ⚠️ Stock Only | ⚠️ Content Only | ❌ |
| **Categories/Attributes** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ Read Only |
| **Brands** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ Read Only |
| **Media Library** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

### 🚚 Sourcing & Purchase (China to BD)
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `marketer` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Create PO** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Purchase History** | ✅ | ✅ | ✅ | 👁️ View | 👁️ View | ❌ | ❌ |
| **Receive Stock** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Supplier List** | ✅ | ✅ | ✅ | 👁️ Read Only | 👁️ Read Only | ❌ | ❌ |
| **Create Supplier** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### ⚙️ Settings & Configuration (Strictly Guarded)
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `marketer` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Global Config** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Pricing Rules** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Payment Settings** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **User Management** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **SMS Settings** | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Tracking/Pixels** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |

---

## 3. 🔮 Future Module Access Matrix

These modules are currently disabled (commented out). When activated, these rules apply.

### 🏭 Stock Operations
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Manual Stock Entry** | ✅ | ✅ | ✅ | ⚠️ Approve | ✅ | ❌ |
| **Stock Adjustment** | ✅ | ✅ | ✅ | ⚠️ Approve | ✅ | ❌ |
| **Stock Transfer** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Print Labels** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Stock Audit** | ✅ | ✅ | ✅ | ✅ | 👁️ View | ❌ |

### 🛍️ Sales Management
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `seller` | `store_keeper` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Orders List** | ✅ | ✅ | ✅ | ✅ | ✅ (Own Only) | 👁️ Packaging View |
| **Create Order (POS)** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Returns (RMA)** | ✅ | ✅ | ✅ | ✅ | ⚠️ Request | ✅ (Receive) |
| **Process Refunds** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Invoices** | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ Print Only |

### 👥 Customer Management
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `seller` | `marketer` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Customers List** | ✅ | ✅ | ✅ | ✅ | ✅ | 👁️ Read Only |
| **Reviews** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ (Reply) |
| **Wishlist Analysis** | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

### 📊 Reports & Analytics (High Sensitivity)
| Route / Feature | `super_admin` | `admin` | `manager` | `supervisor` | `store_keeper` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sales Report** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Inventory Report** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Profit & Loss** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Analytics** | ✅ | ✅ | ✅ | 👁️ View | ❌ | ❌ |

### 🎨 Content Management
| Route / Feature | `super_admin` | `admin` | `manager` | `marketer` | `store_keeper` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Pages & Blogs** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Banners** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Testimonials** | ✅ | ✅ | ✅ | ✅ | ❌ |

### 🚚 Shipping & Logistics
| Route / Feature | `super_admin` | `admin` | `manager` | `store_keeper` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Shipments** | ✅ | ✅ | ✅ | ✅ | 👁️ Track |
| **Tracking** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Zones/Methods** | ✅ | ✅ | ✅ | ❌ | ❌ |

### 🎁 Loyalty & Rewards
| Route / Feature | `super_admin` | `admin` | `manager` | `marketer` | `seller` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Points History** | ✅ | ✅ | ✅ | ✅ | 👁️ Read |
| **Rules/Config** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Coupons/Vouchers** | ✅ | ✅ | ✅ | ✅ | ❌ |

---

## 4. 🔒 Data Visibility (Field Level Security)

Even if a role can access a page, specific data fields may be hidden.

1.  **Landed Cost / China Price:**
    * **Hidden from:** `store_keeper`, `marketer`, `seller`, `supervisor`.
    * **Reason:** Protects exact profit margin confidentiality.
2.  **Customer Contact Info:**
    * **Hidden from:** `store_keeper`, `marketer`.
    * **Reason:** Prevents data harvesting/theft.
3.  **Supplier Details:**
    * **Hidden from:** `marketer`, `seller`, `supervisor`.
    * **Reason:** Protects sourcing channels.

---

## 5. ⚡ Operational Workflows

### Purchase Workflow
* **Payment Confirmation:** Only `super_admin`, `admin`, or `manager` can confirm a Draft PO (requires bank access).
* **Warehouse Receive:** `store_keeper` or `supervisor` can execute "Receive Stock" to update physical counts.
* **Cost Finalization:** Only `super_admin` or `admin` can enter final shipping costs (Arrived in BD) to calculate landed cost.

### POS Workflow
* **Discount Limits:** `seller` is capped at 5% discount. Higher discounts require `supervisor` or `manager` approval code.
* **Refunds:** `seller` cannot execute refunds. They can only mark an order as "Return Requested". `manager` or above can process refunds.

---

## 6. 📝 Strategic Security Rules

1.  **Profit & Loss Protection:** The `/reports/profit-loss` route is strictly restricted to `super_admin`.
2.  **Refund Separation:** Separation of duties is enforced. The person selling (Seller) cannot be the person refunding (Manager/Admin).
3.  **Stock Audits:** If a `store_keeper` removes stock via "Adjustment" (e.g., Damaged), an alert is sent to `supervisor` or `manager` for review.
4.  **Data Export:** `marketer` roles can view trends but cannot export raw customer CSVs.

---

## 7. 💻 Technical Implementation Guide

### Frontend (React/Shadcn)
* **Menu Config:** Add a `roles: []` array to each item in `menuConfig.ts`.
* **Route Wrapper:** Use `<ProtectedRoute allowedRoles={['...']} />`.
* **Conditional Rendering:**
    ```tsx
    {user.role === 'super_admin' && <Button>Delete Product</Button>}
    ```

### Backend (Laravel API)
* **Middleware:** Apply `role:super_admin` middleware to sensitive routes (e.g., `/settings/*`).
* **API Resources:** Strip sensitive fields like `landed_cost` from JSON responses for non-admin/manager roles.