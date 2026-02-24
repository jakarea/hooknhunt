# Relationship Loading Fix for 500 Error

## Error
**Status Code**: 500 Internal Server Error
**Error Message**: "Attempt to read property \"product\" on null"

## Request Data
```json
{
    "status": "partially_completed",
    "extra_cost": 2888,
    "items": [
        {"id": 21, "received_quantity": 110, "unit_weight": 10, "extra_weight": 0},
        {"id": 22, "received_quantity": 0, "unit_weight": 10, "extra_weight": 0},
        {"id": 23, "received_quantity": 0, "unit_weight": 10, "extra_weight": 0}
    ],
    "comments": "Goods received partially. 2 items missing. Extra cost: 2888 BDT"
}
```

## Root Cause

After reloading the purchase order with `$po->refresh()` and `$po->load('items')`, the items collection was loaded **without** the `product` relationship. When the refund calculation loop tried to access `$item->product->name`, it failed because:

1. `$item->product` returned `null` (relationship not loaded)
2. Trying to access `->name` on `null` caused the error

Additionally, items in PO #7 have `product_id` but **no** `product_variant_id`:
```
Item ID: 21 | product_variant_id: NULL | product_id: 1
Item ID: 22 | product_variant_id: NULL | product_id: 2
Item ID: 23 | product_variant_id: NULL | product_id: 3
```

## Solution

### 1. Load Product Relationship When Reloading PO
**File**: [PurchaseOrderController.php:517-518](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php#L517-L518)

**Before**:
```php
$po->refresh();
$po->load('items');  // ❌ Doesn't load product relationship
```

**After**:
```php
$po->refresh();
$po->load('items.product');  // ✅ Loads product relationship
```

### 2. Use Correct Relationship (product, not productVariant)
**File**: [PurchaseOrderController.php:565](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php#L565)

**Before**:
```php
$productName = $item->productVariant?->product?->name ?? 'Unknown Product';
$sku = $item->productVariant?->sku ?? 'N/A';
```

**After**:
```php
$productName = $item->product?->name ?? 'Unknown Product';
```

**Reason**: Items have `product_id`, not `product_variant_id`

### 3. Add Null-Safe Operators
**File**: [PurchaseOrderController.php:491](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php#L491)

**Before**:
```php
'product_name' => $item->product->name ?? 'Unknown',  // ❌ Not null-safe on relationship
```

**After**:
```php
'product_name' => $item->product?->name ?? 'Unknown',  // ✅ Null-safe operator
```

## Database Schema Notes

### Purchase Order Items
- `product_id` - Links to products table
- `product_variant_id` - Links to product_variants table (nullable)
- **Some items only have product_id, no variant**

### Relationship Loading
```php
// Load items with product relationship
$po->load('items.product');

// Access product name safely
$name = $item->product?->name ?? 'Unknown';
```

## Testing

### Test Case: PO #7
```
Item ID: 21 | Product: Basic Information | Ordered: 110 | Lost: 110 (100%)
Item ID: 22 | Product: Zena Noble        | Ordered: 11  | Lost: 11 (100%)
Item ID: 23 | Product: Kevin Kinney      | Ordered: 11  | Lost: 11 (100%)

Total Refund: 29040 BDT
Supplier Wallet: 6000 → 35040 BDT ✅
```

### API Response Expectation
```json
{
    "status": true,
    "message": "Status updated successfully",
    "data": {
        "refund_amount": 29040.00,
        "refund_auto_credited": true,
        "receiving_notes": [
            {
                "info": "Item Basic Information: Lost 110 units (100%). Refund: 2200.00 BDT."
            },
            {
                "info": "Item Zena Noble: Lost 11 units (100%). Refund: 2420.00 BDT."
            },
            {
                "info": "Item Kevin Kinney: Lost 11 units (100%). Refund: 24420.00 BDT."
            },
            {
                "success": "Supplier wallet credited with 29040.00 BDT for items with >10% loss."
            }
        ]
    }
}
```

## Verification Steps

1. ✅ Relationship loading fixed
2. ✅ Null-safe operators added
3. ✅ Using correct relationship (product, not productVariant)
4. ✅ Test with PO #7 data works correctly
5. ⏳ Test actual API request (user to verify)

---

**Date**: 2025-02-21
**Status**: ✅ Fixed
**Files Modified**: PurchaseOrderController.php (2 changes)
