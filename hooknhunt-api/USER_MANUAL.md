# Hook & Hunt ERP - Comprehensive User Manual

**Version:** 2.0 (Detailed)  
**Last Updated:** December 30, 2025  
**Audience:** Admin, Managers, Operational Staff

---

## 1. Introduction & Access

### 1.1 Overview
Hook & Hunt ERP is a centralized command center for your e-commerce business. It unifies inventory, sales (POS & Online), CRM, HR, and Accounting into a single interface. The system ensures that if a product is sold in your physical store, the website stock updates instantly.

### 1.2 Logging In
*   **URL:** `https://admin.hooknhunt.com` (Example)
*   **Credentials:** Provided by your HR or System Administrator.
*   **Two-Factor Authentication (2FA):** If enabled, you will receive an OTP on your registered phone number.
*   **Forgot Password:** Click "Forgot Password" to receive a reset link via email/SMS.

### 1.3 The Dashboard
Upon login, you are greeted by the Dashboard.
*   **Top Bar:** Search, Notifications, Profile Settings.
*   **Sidebar:** Navigation menu (Catalog, Sales, Inventory, etc.).
*   **Widgets:** Real-time stats (Today's Sales, Low Stock Alerts, Pending Orders).

---

## 2. Catalog Module (Product Management)

This module is the database of everything you sell.

### 2.1 Concepts
*   **Product (Parent):** The generic item, e.g., "Nike Air Max". Holds the description, brand, and main images.
*   **Variant (SKU):** The specific sellable item, e.g., "Nike Air Max - Red - Size 42". Holds the price, stock, and barcode.
*   **Channel Pricing:** You can sell the same item for 1000 TK on your Website and 1200 TK on Daraz.

### 2.2 Step-by-Step: Creating a New Product
1.  **Navigate:** Go to `Catalog` > `Products` > `Add New`.
2.  **Basic Info:**
    *   **Name:** The main title (e.g., "Cotton Polo Shirt").
    *   **Slug:** Auto-generated from name (URL friendly). Edit if needed for SEO.
    *   **Category:** Select from the tree (e.g., Men > Clothing > T-Shirts).
    *   **Brand:** Select the manufacturer.
3.  **Media:**
    *   **Thumbnail:** The main image shown in listings.
    *   **Gallery:** Additional angles/shots. *Tip: Use square images (1080x1080) for best results.*
4.  **Description:**
    *   **Short Description:** Appears near the "Add to Cart" button.
    *   **Long Description:** Full details, material info, care instructions.
5.  **SEO (Search Engine Optimization):**
    *   **Meta Title:** The blue title seen in Google results.
    *   **Meta Description:** The short summary under the title in Google.
6.  **Action:** Click **"Save Draft"** or **"Save & Continue"**.

### 2.3 Step-by-Step: Adding Variants (SKUs)
Once the Product Parent is saved, you add Variants.
1.  Scroll to the **Variants** section.
2.  **Define Attributes:** Select "Size" (e.g., M, L, XL) and "Color" (e.g., Blue, Black).
3.  **Variant Details:**
    *   **SKU:** Stock Keeping Unit. *Must be unique*. (e.g., `POLO-BLU-M`).
    *   **Prices:**
        *   `Purchase Cost`: Cost to buy/make. **Crucial for profit calculation.**
        *   `Retail Price`: Selling price.
    *   **Stock Alert:** System warns you when stock drops below this number (Default: 5).
4.  **Status:** Toggle `Is Active` to Yes.
5.  **Action:** Click **"Save Variant"**. Repeat for all size/color combinations.

---

## 3. Inventory Module (Stock Control)

We use a **Batch-Based FIFO (First-In, First-Out)** system. This means we track exactly which shipment an item came from.

### 3.1 Understanding "Unsorted" Stock
When goods arrive from a supplier or factory, they are not immediately "Available for Sale". They enter the **Unsorted** bucket.
*   **Why?** To allow quality checking and labeling before putting them on shelves.

### 3.2 Workflow: Receiving Stock (The Sorting Process)
1.  **Navigate:** `Inventory` > `Unsorted Stock`.
2.  **Select Batch:** You will see batches created from Purchase Orders.
3.  **Action:** Click **"Sort / Put Away"**.
4.  **Input:**
    *   **Warehouse:** Where are you putting it? (e.g., "Store Room A").
    *   **Quantity:** How many passed QC? (e.g., Received 100, 2 rejected, enter 98).
    *   **Expiry Date:** (Optional) If perishable.
5.  **Result:** The 98 items are now **Live** and purchasable on the website/POS.

### 3.3 Adjusting Stock (Loss/Damage)
If you find a damaged item or a counting error.
1.  **Navigate:** `Inventory` > `Adjustments` > `New Adjustment`.
2.  **Warehouse:** Select the location.
3.  **Item:** Search for the Variant.
4.  **Type:**
    *   `Damage/Loss`: Reduces stock.
    *   `Found/Excess`: Increases stock.
5.  **Reason:** Mandatory field (e.g., "Rat damage", "Found under shelf").
6.  **Submit:** Stock updates immediately.

---

## 4. Sales Module (Order Processing)

### 4.1 Order Status Lifecycle
*   **Pending:** Order placed by customer. Payment not yet confirmed (for Pre-payment) or Order not verified.
*   **Processing:** Order verified. Items are **Reserved** from inventory (cannot be sold to others).
*   **Shipped:** Handed over to courier. Tracking ID attached.
*   **Delivered:** Customer received the package.
*   **Cancelled:** Stock is released back to inventory.
*   **Returned:** Customer sent item back.

### 4.2 Workflow: Processing a Web Order
1.  **Navigate:** `Sales` > `Orders`.
2.  **Filter:** Select `Status: Pending`.
3.  **Review:** Click the Order ID. Check customer notes and payment status.
4.  **Verification (Optional):** Call customer to confirm.
5.  **Action:** Change Status to **Processing**.
    *   *System Event:* Stock is deducted from the oldest available batch.
    *   *System Event:* Invoice is generated.
6.  **Print:** Click **"Print Invoice"** and **"Print Packing Slip"**.
7.  **Pack:** Send items to the packaging team.

---

## 5. POS Module (In-Store Sales)

Designed for speed and touchscreens.

### 5.1 The Interface
*   **Left Panel:** Product Grid (Images). Search bar.
*   **Right Panel:** The Cart. Customer selector. Payment summary.

### 5.2 Making a Sale
1.  **Add Items:** Scan barcode with scanner OR type product name in search.
2.  **Select Customer:**
    *   *Existing:* Type phone number. System loads their points/wallet.
    *   *New:* Click "+" to add name/phone.
    *   *Guest:* Skip customer selection (Walk-in).
3.  **Checkout:** Click **"Pay Now"**.
4.  **Payment:**
    *   Select Method: `Cash`, `Card`, `Bkash`, or `Split` (e.g., 500 Cash + 500 Card).
    *   Enter Amount Tendered (for Change calculation).
5.  **Finalize:** Click **"Complete Sale"**. Receipt prints automatically.

---

## 6. Logistics Module (Shipping)

### 6.1 Creating Shipments
1.  **Navigate:** `Logistics` > `Workflows` > `Ready to Ship`.
2.  **Select Orders:** Check the boxes for packed orders.
3.  **Assign Courier:** Select "Pathao", "Steadfast", or "RedX".
4.  **Action:** Click **"Book Courier"**.
    *   *System Event:* API call to Courier to get Tracking ID.
    *   *System Event:* Order status updates to `Shipped`.
    *   *System Event:* SMS sent to customer with Tracking Link.

---

## 7. CRM Module (Customer Relations)

### 7.1 Managing Leads
1.  **Sources:** Leads come automatically from "Contact Us" forms or can be added manually.
2.  **Stages:** `New` > `Contacted` > `Interested` > `Converted` (Won) or `Lost`.
3.  **Activity Log:** Always log your calls.
    *   Click Lead > **"Add Activity"**.
    *   Type: "Call", "Meeting", "Email".
    *   Note: "Customer wants a discount on bulk buy."

### 7.2 Running a Campaign
1.  **Navigate:** `CRM` > `Campaigns`.
2.  **Target:** Select Segment (e.g., "Bought in last 30 days").
3.  **Channel:** SMS or Email.
4.  **Message:** "Eid Sale! Flat 20% off. Use code EID20."
5.  **Send:** Schedule for later or Send Now.

---

## 8. HRM Module (Staff Management)

### 8.1 Onboarding an Employee
1.  **Create User:** First, create a User account in `System` > `Users`.
2.  **Create Employee Profile:** Go to `HRM` > `Employees` > `Add New`.
3.  **Link:** Select the User account you just created.
4.  **Details:** Enter Joining Date, Department, Designation, and **Basic Salary**.

### 8.2 Payroll Processing
*   **Cycle:** Usually run on the 1st of the month.
*   **Action:** Go to `HRM` > `Payroll` > **"Generate Payroll"**.
*   **Logic:**
    *   `Gross Pay` = `Basic` + `Allowances`.
    *   `Deductions` = `Tax` + `Unpaid Leave` (Calculated from Attendance).
    *   `Net Payable` = `Gross` - `Deductions`.
*   **Payment:** Click **"Pay"** to record the transaction in the Finance module.

---

## 9. Finance Module (Accounts)

### 9.1 Recording Expenses
Don't just take money from the till; record it!
1.  **Navigate:** `Finance` > `Expenses` > `New`.
2.  **Category:** "Rent", "Utility", "Entertaintment", "Logistics".
3.  **Amount:** Enter value.
4.  **Paid From:** Select Account (e.g., "Cash Drawer", "Bank Account").
5.  **Attach:** Upload photo of receipt/bill.

### 9.2 The Profit & Loss (P&L) Report
This is your business scorecard.
*   **Revenue:** Total Sales (minus returns).
*   **COGS (Cost of Goods Sold):** The original purchase cost of the specific items sold (calculated via FIFO).
*   **Gross Profit:** `Revenue` - `COGS`.
*   **Expenses:** Sum of all recorded expenses.
*   **Net Profit:** `Gross Profit` - `Expenses`.

---

## 10. System Settings (Admin Only)

### 10.1 Role-Based Access Control (RBAC)
Secure your data by limiting access.
1.  **Create Role:** e.g., "Intern".
2.  **Assign Permissions:** Check boxes like `order.view` but uncheck `order.delete`.
3.  **Assign User:** Give the "Intern" role to the new hire.

### 10.2 Media Manager
*   **Folders:** Organize images by Year/Month or Product Category.
*   **Optimization:** The system automatically compresses images. Do not upload files > 2MB.

---

## 11. Troubleshooting & FAQ

**Q: I can't see a product on the website.**
*   A: Check the Product Status. Is it `Published`? Also, check if it has `Active` variants with `Stock > 0`.

**Q: POS says "Insufficient Stock" but I see the item on the shelf.**
*   A: The physical item might be there, but was it entered into the system? Check `Inventory` > `Current Stock`. If missing, do an `Adjustment (Found)`.

**Q: Why can't I delete an Order?**
*   A: Completed orders cannot be deleted to preserve financial audit trails. You must `Cancel` them instead.

**Q: SMS is not sending.**
*   A: Check `Settings` > `SMS Configuration`. Ensure your API Balance is not zero.