# Shipping Cost Storage Fix

## Problem
User reported: "I see `purchase_orders`.`shipping_method` and `purchase_orders`.`shipping_cost` not stored into database"

When transitioning from `shipped_bd` to `arrived_bd` status, the shipping method and total shipping cost were not being saved to the `purchase_orders` table.

## Root Causes

### 1. Missing Database Column
The `purchase_orders` table did not have a `total_shipping_cost` column.

**Fix**: Created migration to add the column:
```php
$table->decimal('total_shipping_cost', 10, 2)->default(0)->after('shipping_method');
```

**Migration**: [2026_02_21_160556_add_total_shipping_cost_to_purchase_orders.php](hooknhunt-api/database/migrations/2026_02_21_160556_add_total_shipping_cost_to_purchase_orders.php)

### 2. Model Fillable & Casts Missing
The `PurchaseOrder` model didn't have `total_shipping_cost` in the `$fillable` array or `$casts` array.

**Fix**: Added to both arrays in [PurchaseOrder.php:28,44](hooknhunt-api/app/Models/PurchaseOrder.php#L28) :
```php
protected $fillable = [
    // ...
    'total_shipping_cost',
    // ...
];

protected $casts = [
    // ...
    'total_shipping_cost' => 'decimal:2',
    // ...
];
```

### 3. Conflicting Accessor (MAIN BUG)
The model had a `getTotalShippingCostAttribute()` accessor that was calculating the value from items instead of using the database column:

```php
// ❌ WRONG - This accessor overrode any value set to the column
public function getTotalShippingCostAttribute(): float
{
    return $this->items->sum('shipping_cost');
}
```

**Fix**: Removed this accessor from [PurchaseOrder.php:106-109](hooknhunt-api/app/Models/PurchaseOrder.php#L106-L109)

### 4. Backend Not Saving the Fields
The backend controller for `arrived_bd` status transition wasn't saving the `shipping_method` and `total_shipping_cost` fields.

**Fix**: Updated controller in [PurchaseOrderController.php:388-400](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php#L388-L400):

```php
// Arrived BD - add shipping costs
if ($oldStatus === 'shipped_bd' && $newStatus === 'arrived_bd') {
    // Save shipping method and total shipping cost to purchase order
    if ($request->has('transport_type')) {
        $po->shipping_method = $request->transport_type;
    }
    if ($request->has('total_shipping_cost')) {
        $po->total_shipping_cost = $request->total_shipping_cost;
    }

    // ... rest of the code
}
```

## Frontend Implementation (Already Working)
The frontend was already sending the correct data:

**page.tsx** (line 289):
```tsx
total_shipping_cost: statusFormData.totalShippingCost
```

**procurement-status.ts** (lines 130-131):
```typescript
if (currentStatus === 'shipped_bd' && nextStatus === 'arrived_bd') {
  payload.transport_type = formData.transport_type
  payload.total_shipping_cost = formData.total_shipping_cost
}
```

## Test Results

**Before Fix**:
```
After: shipping_method=air, total_shipping_cost=0  // ❌ Not saved
```

**After Fix**:
```
After: shipping_method=air, total_shipping_cost=5000.50  // ✅ Saved correctly!
```

## Summary

All shipping cost data is now properly stored:
- ✅ `shipping_method` → stored in `purchase_orders.shipping_method`
- ✅ `total_shipping_cost` → stored in `purchase_orders.total_shipping_cost`
- ✅ Item-level `shipping_cost` → still stored in `purchase_order_items.shipping_cost` (for per-item breakdown)

The receiving modal now correctly retrieves the total shipping cost using:
```tsx
shippingCost={Number(order?.totalShippingCost) || extractShippingCostFromHistory() || 0}
```

---

**Date**: 2025-02-21
**Files Modified**:
- [PurchaseOrder.php](hooknhunt-api/app/Models/PurchaseOrder.php)
- [PurchaseOrderController.php](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php)
- Migration: [2026_02_21_160556_add_total_shipping_cost_to_purchase_orders.php](hooknhunt-api/database/migrations/2026_02_21_160556_add_total_shipping_cost_to_purchase_orders.php)
