# Product Field Mapping Report
## Frontend Form Fields → Database Tables Mapping

Generated: 2026-03-07

---

## 📋 PRODUCTS TABLE (`products`)

### ✅ MATCHED FIELDS

| Frontend Field | Database Column | Type | Status |
|---------------|-----------------|------|--------|
| `productName` | `name` | string | ✅ Matched |
| `category` | `category_id` | foreignId | ✅ Matched |
| `brand` | `brand_id` | foreignId | ✅ Matched |
| `status` | `status` | enum ('draft', 'published', 'archived') | ✅ Matched |
| `videoUrl` | `video_url` | string | ✅ Matched |
| `description` | `description` | text | ✅ Matched |
| `seoTitle` | `seo_title` | string | ✅ Matched |
| `seoDescription` | `seo_description` | text | ✅ Matched |
| `seoTags` | `seo_tags` | json | ✅ Matched |
| `featuredImage` | `thumbnail_id` | foreignId (media_files) | ✅ Matched |
| `galleryImages` | `gallery_images` | json (array of IDs) | ✅ Matched |

### ⚠️ MISSING FIELDS - Need Migration

| Frontend Field | Current DB Column | Required Action |
|---------------|-------------------|-----------------|
| `retailName` | ❌ NOT EXISTS | Need to add `retail_name` column |
| `wholesaleName` | ❌ NOT EXISTS | Need to add `wholesale_name` column |
| `enableWarranty` | ❌ NOT EXISTS | Need to add `warranty_enabled` boolean |
| `warrantyDetails` | ❌ NOT EXISTS | Need to add `warranty_details` text |
| `enablePreorder` | ❌ NOT EXISTS (in variants) | Move to products table or keep in variants |
| `highlightsList` | ❌ NOT EXISTS | Need to add `highlights` json/text column |
| `includesInTheBox` | ❌ NOT EXISTS | Need to add `includes_in_box` json/text column |
| `slug` | `slug` | ✅ EXISTS but not in form | Auto-generate from name |

### 📌 AVAILABLE DATABASE FIELDS NOT IN FORM

| Database Column | Type | Notes |
|----------------|------|-------|
| `slug` | string (unique) | Auto-generate from name |
| `short_description` | text | Not used in current form |
| `is_active` | boolean | Not used (using status enum instead) |
| `deleted_at` | timestamp | Soft deletes |

---

## 📦 PRODUCT_VARIANTS TABLE (`product_variants`)

### ✅ MATCHED FIELDS

| Frontend Field | Database Column | Type | Status |
|---------------|-----------------|------|--------|
| `name` (variant) | `variant_name` | string | ✅ Matched |
| `sellerSku` | `custom_sku` | string | ✅ Matched |
| `purchaseCost` | `purchase_cost` | decimal(15,2) | ✅ Matched |
| `weight` | `weight` | string | ✅ Matched (but type mismatch) |
| `wholesaleMoq` | `moq` | integer | ✅ Matched |
| `specialPrice` | `offer_price` | decimal(15,2) | ✅ Matched (retail offer) |
| `enablePreorder` | `allow_preorder` | integer (boolean) | ✅ Matched |
| `expectedDeliveryDate` | `expected_delivery` | date | ✅ Matched |

### ⚠️ TYPE MISMATCHES

| Frontend Field | Frontend Type | DB Type | Issue |
|---------------|---------------|---------|-------|
| `weight` | number (grams) | string | **CRITICAL**: DB is string, should be decimal/integer |
| `stock` | number (integer) | ❌ NOT IN TABLE | Stock is in `inventory_batches` table |

### ⚠️ MISSING FIELDS - Need Migration or Channel Settings

| Frontend Field | Current DB Column | Required Action |
|---------------|-------------------|-----------------|
| `price` (retail) | ❌ NOT EXISTS | Use `product_channel_settings` table |
| `wholesalePrice` | ❌ NOT EXISTS | Use `product_channel_settings` table |
| `wholesaleOfferPrice` | ❌ NOT EXISTS | Use `product_channel_settings` table |
| `stock` | ❌ NOT EXISTS | Manage via `inventory_batches` table |
| `sku` (unique) | `sku` | ✅ EXISTS but not in form | Auto-generate or add input |

### 📌 AVAILABLE DATABASE FIELDS NOT IN FORM

| Database Column | Type | Notes |
|----------------|------|-------|
| `variant_slug` | string | Auto-generate from variant_name |
| `channel` | enum | Not used - using separate channel_settings table |
| `custom_name` | string | Additional custom name option |
| `sku` | string (unique) | Should be in form |
| `size` | string | Attribute field |
| `color` | string | Attribute field |
| `material` | string | Attribute field |
| `pattern` | string | Attribute field |
| `unit_id` | foreignId | Unit measurement |
| `unit_value` | decimal(8,2) | Quantity per unit |
| `offer_starts` | date | Not in form (removed earlier) |
| `offer_ends` | date | Not in form (removed earlier) |
| `stock_alert_level` | integer | Default: 5 |
| `is_active` | boolean | Variant active status |

---

## 🔄 PRODUCT_CHANNEL_SETTINGS TABLE

### Current Structure:
- `id` - primary key
- `product_variant_id` - foreign key to product_variants
- `channel` - enum ('retail_web', 'wholesale_web', 'daraz', 'pos')
- `custom_name` - custom name for channel
- `channel_slug` - string (nullable)
- `price` - decimal(10,2) - **Price for this channel**
- `is_active` - boolean
- `unique(product_variant_id, channel)`

### Frontend → Channel Mapping:

| Frontend Field | Channel | Column in Channel Settings |
|---------------|---------|----------------------------|
| `price` | retail_web | price (in product_channel_settings) |
| `wholesalePrice` | wholesale_web | price (in product_channel_settings) |
| `specialPrice` | retail_web | offer_price (in product_variants) OR separate channel offer |
| `wholesaleOfferPrice` | wholesale_web | price (in product_channel_settings) as offer |

---

## 📊 INVENTORY_BATCHES TABLE (Stock Management)

Stock is NOT stored in `product_variants` table. It's managed via `inventory_batches` table:
- `remaining_qty` - Current stock quantity
- Relationship: `product_variant_id` → `product_variants.id`
- Current stock is calculated: `SUM(remaining_qty)` from all batches

---

## 🚨 CRITICAL ISSUES REQUIRING ATTENTION

### 1. Retail & Wholesale Price Storage Problem
**Issue:** The form has `price` and `wholesalePrice` fields, but these don't exist in `product_variants` table.

**Current Database Design:**
- Prices are stored in `product_channel_settings` table (multi-channel architecture)
- Each variant can have different prices per channel

**Frontend Form Fields:**
- `price` (retail)
- `wholesalePrice`
- `specialPrice` (retail offer)
- `wholesaleOfferPrice`

**Recommended Solution:**
Either:
A) Add columns to `product_variants` table:
   - `retail_price` decimal(15,2)
   - `wholesale_price` decimal(15,2)
   - `retail_offer_price` decimal(15,2)
   - `wholesale_offer_price` decimal(15,2)

B) OR use the existing `product_channel_settings` table properly (more complex but more flexible)

### 2. Weight Type Mismatch
**Issue:** Frontend sends `number` (grams), DB stores `string`

**Fix:** Run migration to change `weight` from string to decimal(10,2) or integer

### 3. Stock Management
**Issue:** Form has `stock` field but it's not in `product_variants` table

**Current:** Stock is in `inventory_batches` table with batch tracking

**Options:**
A) Add `stock` column to `product_variants` for simple inventory
B) Keep using `inventory_batches` (more complex, batch tracking)
C) Both: `stock` cache + `inventory_batches` details

### 4. Missing Product-Level Fields
Need migration to add to `products` table:
- `retail_name` varchar(255)
- `wholesale_name` varchar(255)
- `warranty_enabled` boolean
- `warranty_details` text
- `highlights` json or text
- `includes_in_box` json or text

---

## ✅ RECOMMENDED MIGRATION PLAN

### Step 1: Add Missing Columns to `products` Table
```sql
ALTER TABLE products
ADD COLUMN retail_name VARCHAR(255) NULL AFTER name,
ADD COLUMN wholesale_name VARCHAR(255) NULL AFTER retail_name,
ADD COLUMN warranty_enabled BOOLEAN DEFAULT FALSE AFTER includes_in_box,
ADD COLUMN warranty_details TEXT NULL AFTER warranty_enabled,
ADD COLUMN highlights JSON NULL AFTER warranty_details,
ADD COLUMN includes_in_box JSON NULL AFTER highlights;
```

### Step 2: Add Price Columns to `product_variants` Table
```sql
ALTER TABLE product_variants
ADD COLUMN retail_price DECIMAL(15,2) DEFAULT 0 AFTER purchase_cost,
ADD COLUMN wholesale_price DECIMAL(15,2) DEFAULT 0 AFTER retail_price,
ADD COLUMN retail_offer_price DECIMAL(15,2) DEFAULT 0 AFTER wholesale_price,
ADD COLUMN wholesale_offer_price DECIMAL(15,2) DEFAULT 0 AFTER retail_offer_price,
ADD COLUMN stock INTEGER DEFAULT 0 AFTER wholesale_offer_price,
MODIFY COLUMN weight DECIMAL(10,2) NULL;
```

### Step 3: Update Form Controller
Ensure the create/update controller uses these new column names when saving.

---

## 📝 FIELD MAPPING SUMMARY

### Products Table - Ready to Save:
✅ name, category_id, brand_id, status, video_url, description, seo_title, seo_description, seo_tags, thumbnail_id, gallery_images

### Products Table - Need Migration:
⚠️ retail_name, wholesale_name, warranty_enabled, warranty_details, highlights, includes_in_box, slug (auto-generate)

### Product_Variants Table - Ready to Save:
✅ variant_name, custom_sku, purchase_cost, weight (type fix needed), moq, offer_price, allow_preorder, expected_delivery

### Product_Variants Table - Need Migration:
⚠️ retail_price, wholesale_price, retail_offer_price, wholesale_offer_price, stock, sku (auto-generate)

### Separate Tables:
🔄 stock → inventory_batches table (or add column to variants)
🔄 channel-specific prices → product_channel_settings table

---

## 🎯 NEXT ACTIONS

1. **Run migration** to add missing columns to both tables
2. **Update ProductController** to handle new fields
3. **Update frontend API calls** to send correct field names
4. **Test product creation** with all fields
5. **Update ProductVariant model** to include new fields in fillable array
