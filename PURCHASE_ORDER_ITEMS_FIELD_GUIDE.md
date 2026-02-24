# Purchase Order Items Table - Field Structure Guide

## Overview

The `purchase_order_items` table stores line-item details for each purchase order. Each row represents one product in an order with its quantities, weights, shipping costs, and final landed cost calculations.

---

## Complete Field Breakdown

### 🔵 Identification Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | BIGINT | Primary key | `1` |
| `po_number` | VARCHAR | Foreign key to `purchase_orders.po_number` | `"PO-202602-12"` |
| `product_id` | BIGINT | Foreign key to `products.id` | `123` |
| `product_variant_id` | BIGINT | Foreign key to `product_variants.id` (nullable) | `456` |
| `inventory_batch_id` | BIGINT | Foreign key to `inventory_batches.id` (nullable) | `789` |

---

### 💰 Pricing Fields (Multi-Currency)

| Field | Type | Currency | Description | Formula | Example |
|-------|------|----------|-------------|---------|---------|
| `china_price` | DECIMAL(10,2) | **RMB (¥)** | Purchase price per unit from China | - | `¥150.00` |
| `unit_price` | DECIMAL(10,2) | **RMB (¥)** | Usually same as `china_price` | - | `¥150.00` |
| `total_price` | DECIMAL(10,2) | **RMB (¥)** | Total price in RMB | `china_price × quantity` | `¥15,000.00` |
| `final_unit_cost` | DECIMAL(10,2) | **BDT (৳)** | **Landed cost per unit** | `(china_price × exchange_rate) + (shipping_cost / received_quantity)` | `৳3,462.50` |

---

### ⚖️ Weight Fields (in GRAMS)

| Field | Type | Unit | Description | Example |
|-------|------|------|-------------|---------|
| `unit_weight` | DECIMAL(10,2) | **grams** | Weight of **one unit** (product only) | `500.00` g |
| `extra_weight` | DECIMAL(10,2) | **grams** | Extra packaging weight **per unit** | `50.00` g |
| **Total per unit** | - | **grams** | `unit_weight + extra_weight` | `550.00` g |
| **Total line weight** | - | **kg** | `(unit_weight + extra_weight) × quantity / 1000` | `55.00` kg |

**Example Calculation**:
```
Order: 100 units of Product X
- unit_weight: 500g per unit
- extra_weight: 50g per unit (packaging)
- Total per unit: 550g
- Total line weight: 550g × 100 = 55,000g = 55kg
```

---

### 🚢 Shipping Cost Fields

| Field | Type | Currency | Description | Formula | Example |
|-------|------|----------|-------------|---------|---------|
| `shipping_cost_per_kg` | DECIMAL(10,2) | **BDT (৳)** | Shipping **rate** per kg | From user input | `৳25.00` |
| `shipping_cost` | DECIMAL(10,2) | **BDT (৳)** | **Total shipping cost** for this line | `total_weight_kg × shipping_cost_per_kg` | `৳1,375.00` |

**Example Calculation**:
```
Item weight: 55kg (from above)
Shipping rate: ৳25 per kg
Total shipping cost: 55kg × ৳25/kg = ৳1,375.00
```

---

### 📦 Quantity Fields

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `quantity` | INT | **Ordered quantity** (from PO) | `100` |
| `received_quantity` | INT | **Actually received** (warehouse receiving) | `95` |
| `stocked_quantity` | INT | **Added to inventory** (after QC) | `95` |
| `lost_quantity` | INT | **Lost/damaged items** | `5` |

**Relationship**:
```
lost_quantity = quantity - received_quantity
5 = 100 - 95 ✓
```

---

### 💸 Lost Item Cost Field

| Field | Type | Currency | Description | Formula | Example |
|-------|------|----------|-------------|---------|---------|
| `lost_item_price` | DECIMAL(10,2) | **BDT (৳)** | Cost of lost items | `lost_quantity × china_price × exchange_rate` | `৳17,250.00` |

**Example Calculation**:
```
Lost: 5 units
China price: ¥150 per unit
Exchange rate: ৳23 per ¥
Lost cost: 5 × 150 × 23 = ৳17,250.00
```

---

## 🎯 Key Calculations

### 1. Total Landed Cost per Unit

```
final_unit_cost = (china_price × exchange_rate) + (shipping_cost / received_quantity)

Example:
  china_price: ¥150
  exchange_rate: ৳23
  shipping_cost: ৳1,375
  received_quantity: 95 units

  Base cost: ¥150 × ৳23 = ৳3,450
  Shipping per unit: ৳1,375 ÷ 95 = ৳14.47
  Final unit cost: ৳3,450 + ৳14.47 = ৳3,464.47
```

### 2. Total Weight per Line

```
total_weight_kg = (unit_weight + extra_weight) × quantity / 1000

Example:
  unit_weight: 500g
  extra_weight: 50g
  quantity: 100 units

  total_weight_kg = (500 + 50) × 100 / 1000
                 = 55,000g / 1000
                 = 55kg
```

### 3. Shipping Cost per Line

```
shipping_cost = total_weight_kg × shipping_cost_per_kg

Example:
  total_weight_kg: 55kg
  shipping_cost_per_kg: ৳25

  shipping_cost = 55 × 25 = ৳1,375.00
```

---

## 📊 Complete Example

### Scenario:
Order 100 units of Product X from China:
- China price: ¥150 per unit
- Exchange rate: ৳23 per ¥
- Unit weight: 500g
- Extra weight (packaging): 50g per unit
- Shipping cost: ৳25 per kg
- Received: 95 units (5 lost in transit)

### Database Record:

```php
[
    'id' => 1,
    'po_number' => 'PO-202602-12',
    'product_id' => 123,

    // Pricing
    'china_price' => 150.00,          // ¥150 per unit
    'unit_price' => 150.00,           // Same (redundant)
    'total_price' => 15000.00,        // ¥150 × 100 = ¥15,000
    'final_unit_cost' => 3464.47,     // ৳3,464.47 (calculated)

    // Weight
    'unit_weight' => 500.00,          // 500g per unit
    'extra_weight' => 50.00,          // 50g packaging per unit

    // Shipping
    'shipping_cost_per_kg' => 25.00,  // ৳25 per kg
    'shipping_cost' => 1375.00,       // 55kg × ৳25 = ৳1,375

    // Quantities
    'quantity' => 100,                // Ordered
    'received_quantity' => 95,        // Received
    'stocked_quantity' => 95,         // Stocked
    'lost_quantity' => 5,             // Lost

    // Lost cost
    'lost_item_price' => 17250.00,    // 5 × ¥150 × ৳23 = ৳17,250
]
```

---

## 🔧 Backend Processing Flow

### When transitioning from "Shipped BD" → "Arrived BD":

```php
foreach ($order->items as $item) {
    // 1. Save shipping cost per kg to item
    $item->shipping_cost_per_kg = $request->shipping_cost_per_kg; // ৳25

    // 2. Calculate item's total weight in kg
    $itemWeightKg = (
        ($item->unit_weight ?? 0) +    // 500g
        ($item->extra_weight ?? 0)      // 50g
    ) * $item->quantity / 1000;         // × 100 / 1000 = 55kg

    // 3. Calculate and save shipping cost for this item
    $item->shipping_cost = $itemWeightKg * $item->shipping_cost_per_kg;
    // 55kg × ৳25 = ৳1,375

    $item->save();
}
```

### When receiving goods ("In Transit" → "Received Hub"):

User can override `shipping_cost_per_kg` per item, and system recalculates:

```php
// User inputs different shipping cost per item
$item->shipping_cost_per_kg = $newRate; // e.g., ৳30 (fragile item)
$itemWeightKg = calculateWeight($item);
$item->shipping_cost = $itemWeightKg * $newRate;
$item->final_unit_cost = calculateFinalUnitCost($item);
```

---

## ✅ Precision Fixes Applied

**Migration**: `2026_02_24_113913_fix_purchase_order_items_field_precisions.php`

| Field | Before | After | Reason |
|-------|--------|-------|--------|
| `shipping_cost` | DECIMAL(15,2) | DECIMAL(10,2) | Max ৳99,999,999.99 is more than enough |
| `total_price` | DECIMAL(15,2) | DECIMAL(10,2) | Max ¥99,999,999.99 is sufficient |
| `lost_item_price` | DECIMAL(15,2) | DECIMAL(10,2) | Max ৳99,999,999.99 is sufficient |

---

## 📝 Notes

1. **All weights are in GRAMS** - Must divide by 1000 for kg calculations
2. **All costs are stored in 2 decimal places** - Standard currency format
3. **`shipping_cost_per_kg` is stored per item** - Allows different rates per item
4. **`final_unit_cost` is the most important field** - Used for inventory valuation
5. **Exchange rate is stored at order level** - All items use same rate from parent order

---

**Document Version**: 1.0
**Last Updated**: 2026-02-24
**Author**: Claude Code (Sonnet 4.6)
