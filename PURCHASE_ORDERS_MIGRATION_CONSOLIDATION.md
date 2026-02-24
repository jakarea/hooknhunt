# Purchase Orders Migration Consolidation

**Date**: 2026-02-24
**Status**: ✅ COMPLETE

---

## Summary

Consolidated 10 scattered migration files into a single comprehensive migration for the `purchase_orders` and `purchase_order_items` tables.

---

## Files Deleted (10 migrations)

### Purchase Orders Table Modifications (5 files):
1. ❌ `2026_02_18_172641_add_tracking_fields_to_purchase_orders_table.php` (REDUNDANT)
2. ❌ `2026_02_19_153133_add_refund_fields_to_purchase_orders_table.php`
3. ❌ `2026_02_21_155910_add_partially_completed_status_to_purchase_orders.php`
4. ❌ `2026_02_21_160556_add_total_shipping_cost_to_purchase_orders.php`
5. ❌ `2026_02_22_095047_add_payment_fields_to_purchase_orders_table.php`

### Purchase Order Items Table Modifications (5 files):
1. ❌ `2026_02_18_172710_add_cost_weight_fields_to_purchase_order_items_table.php` (PARTIALLY REDUNDANT)
2. ❌ `2026_02_24_113230_add_shipping_cost_per_kg_to_purchase_order_items_table.php`
3. ❌ `2026_02_24_113913_fix_purchase_order_items_field_precisions.php`
4. ❌ `2026_02_24_114403_rename_unit_price_to_bd_price_in_purchase_order_items.php`
5. ❌ `2026_02_24_183848_add_default_values_to_purchase_order_items_fields.php`

---

## File Updated

### ✅ `2026_02_18_124043_create_purchase_orders_and_items_table.php`

This migration now contains the complete definition of both tables including all modifications that were previously scattered across 10 separate files.

---

## Final Schema Structure

### `purchase_orders` table:
```php
- id
- po_number (unique)
- supplier_id (foreign key → suppliers)
- exchange_rate (decimal 10,2)
- order_date
- expected_date
- total_amount (decimal 15,2)
- refund_amount (decimal 10,2)
- credit_note_number
- refund_auto_credited (boolean)
- refunded_at (timestamp)
- receiving_notes (text)
- status (ENUM with partially_completed)
- payment_account_id (foreign key → banks)
- payment_amount (decimal 10,2)
- supplier_credit_used (decimal 10,2)
- bank_payment_amount (decimal 10,2)
- journal_entry_id (foreign key → journal_entries)
- courier_name
- tracking_number
- lot_number
- shipping_method
- total_shipping_cost (decimal 10,2)
- shipping_cost (decimal 15,2) - Legacy
- total_weight (decimal 10,2)
- extra_cost_global (decimal 15,2)
- bd_courier_tracking
- created_by (foreign key → users)
- timestamps
- softDeletes
```

### `purchase_order_items` table:
```php
- id
- po_number (foreign key → purchase_orders.po_number)
- product_id (foreign key → products)
- product_variant_id (foreign key → product_variants)
- inventory_batch_id (foreign key → inventory_batches)
- china_price (decimal 10,2)
- quantity (integer)
- bd_price (decimal 10,2) - Renamed from unit_price
- total_price (decimal 10,2) - Precision changed from 15,2
- unit_weight (decimal 10,2)
- extra_weight (decimal 10,2) default(0)
- received_quantity (integer) default(0)
- stocked_quantity (integer) default(0)
- lost_quantity (integer) default(0)
- lost_item_price (decimal 10,2) default(0) - Precision changed from 15,2
- shipping_cost (decimal 10,2) default(0) - Precision changed from 15,2
- shipping_cost_per_kg (decimal 10,2)
- final_unit_cost (decimal 10,2)
- timestamps
```

---

## Key Changes Made

### 1. Purchase Orders Table:
- ✅ Added refund tracking fields (5 fields)
- ✅ Added 'partially_completed' to status enum
- ✅ added total_shipping_cost field
- ✅ Added payment tracking fields (5 fields with foreign keys)

### 2. Purchase Order Items Table:
- ✅ Renamed `unit_price` → `bd_price`
- ✅ Added `shipping_cost`, `lost_quantity`, `lost_item_price`, `shipping_cost_per_kg`
- ✅ Fixed decimal precisions (changed from 15,2 to 10,2 where appropriate)
- ✅ Added default values to multiple fields

### 3. Redundant Fields Removed:
- ⚠️ The first modification migration (`2026_02_18_172641`) was completely redundant as all tracking fields already existed in the original migration
- ⚠️ The items modification (`2026_02_18_172710`) was partially redundant (some fields already existed)

---

## Benefits

1. **Single Source of Truth**: One file contains the complete table definition
2. **Easier Maintenance**: No need to check 10 different files to understand the schema
3. **Cleaner Migration History**: From 11 files down to 2 files
4. **Better Database Management**: Fresh installs get the complete schema immediately
5. **No Schema Drift**: All modifications are now in the base migration

---

## Remaining Migrations

Only 2 migrations remain for the procurement module:

1. ✅ `2026_02_18_124043_create_purchase_orders_and_items_table.php` - **CONSOLIDATED** (this file)
2. ✅ `2026_02_18_173028_create_purchase_order_status_history_table.php` - Status history audit trail

---

## Important Notes

### For Fresh Installations:
- Run `php artisan migrate` to create both tables with all fields in one go

### For Existing Databases:
- The database schema remains unchanged (no data loss)
- All existing data continues to work as before
- The consolidation only affects migration files, not the actual database structure

### For Development:
- Any new fields needed should be added directly to this consolidated migration file
- No more separate modification migrations for these tables

---

## Next Steps

If you need to add new fields to these tables in the future:
1. Add them directly to `2026_02_18_124043_create_purchase_orders_and_items_table.php`
2. Create a new migration ONLY if you need to modify an existing database (not for new installations)

---

**Consolidation completed successfully! 🎉**
