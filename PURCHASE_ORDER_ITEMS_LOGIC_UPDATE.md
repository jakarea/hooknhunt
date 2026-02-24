# Purchase Order Items - Field Names & Logic Updates

## Summary of Changes

**Date**: 2026-02-24
**Migration**: `2026_02_24_114403_rename_unit_price_to_bd_price_in_purchase_order_items`

### Field Renames

| Old Field | New Field | Reason |
|-----------|-----------|--------|
| `unit_price` | `bd_price` | Clearer - purchase price in BDT |
| - | No change to `total_price` | BDT total = bd_price × quantity |
| - | No change to `final_unit_cost` | NOW: total_price + shipping_cost |

---

## Complete Field Definitions

### 💰 Pricing Fields

| Field | Type | Currency | Description | Formula | Example |
|-------|------|----------|-------------|---------|---------|
| `china_price` | DECIMAL(10,2) | **RMB (¥)** | Purchase price per unit from China | User input | `¥150.00` |
| `bd_price` | DECIMAL(10,2) | **BDT (৳)** | Purchase price per unit in BDT | `china_price × exchange_rate` | `৳3,450.00` |
| `total_price` | DECIMAL(10,2) | **BDT (৳)** | Total price for this line | `bd_price × quantity` | `৳345,000.00` |
| `final_unit_cost` | DECIMAL(10,2) | **BDT (৳)** | Landed cost for this line | `total_price + shipping_cost` | `৳346,375.00` |

### 🚢 Shipping Fields

| Field | Type | Currency | Description | Formula | Example |
|-------|------|----------|-------------|---------|---------|
| `shipping_cost_per_kg` | DECIMAL(10,2) | **BDT (৳)** | Shipping rate per kg | User input | `৳25.00` |
| `shipping_cost` | DECIMAL(10,2) | **BDT (৳)** | Total shipping cost for this line | `weight_kg × shipping_cost_per_kg` | `৳1,375.00` |

---

## Complete Calculation Examples

### Example 1: Creating a Draft Order

**Input**:
```json
{
  "exchange_rate": 23,
  "items": [
    {
      "product_id": 123,
      "china_price": 150,
      "quantity": 100
    }
  ]
}
```

**Backend Processing**:
```php
foreach ($items as $item) {
    // Calculate BDT price
    $bdPrice = $item['china_price'] * $request->exchange_rate;
    // 150 × 23 = 3450

    $totalPrice = $bdPrice * $item['quantity'];
    // 3450 × 100 = 345,000

    PurchaseOrderItem::create([
        'china_price' => 150.00,      // ¥150 per unit
        'bd_price' => 3450.00,        // ৳3,450 per unit
        'total_price' => 345000.00,   // ৳345,000 total
        'quantity' => 100,
    ]);
}
```

**Database Record**:
```
china_price:    150.00  (¥)
bd_price:       3450.00 (৳)
quantity:       100
total_price:    345000.00 (৳) = 3450 × 100
```

---

### Example 2: Shipped BD → Arrived BD (Adding Shipping)

**Input**:
```json
{
  "transport_type": "air",
  "total_weight": 55,
  "shipping_cost_per_kg": 25
}
```

**Item Data**:
```
- unit_weight: 500g per unit
- extra_weight: 50g per unit
- quantity: 100 units
```

**Backend Processing**:
```php
foreach ($po->items as $item) {
    // Save shipping rate
    $item->shipping_cost_per_kg = 25.00;

    // Calculate item weight in kg
    $itemWeightKg = (500 + 50) × 100 / 1000 = 55kg

    // Calculate shipping cost
    $item->shipping_cost = 55 × 25 = ৳1,375

    // Calculate final_unit_cost
    $item->final_unit_cost = $item->total_price + $item->shipping_cost
                            = 345000 + 1375
                            = ৳346,375

    $item->save();
}
```

**Database Record (Updated)**:
```
bd_price:           3450.00
total_price:        345000.00
shipping_cost_per_kg: 25.00
shipping_cost:      1375.00
final_unit_cost:    346375.00  ← total_price + shipping_cost
```

---

### Example 3: Receive Goods (In Transit → Received Hub)

**Input**:
```json
{
  "items": [
    {
      "id": 1,
      "received_quantity": 95,
      "unit_weight": 500,
      "extra_weight": 50,
      "shipping_cost_per_kg": 25
    }
  ]
}
```

**Backend Processing**:
```php
$item->unit_weight = 500;
$item->extra_weight = 50;
$item->received_quantity = 95;

// Calculate shipping cost for received quantity
$shippingCostPerKg = 25.00;
$itemWeightKg = (500 + 50) × 95 / 1000 = 52.25kg
$itemShippingCost = 52.25 × 25 = ৳1,306.25

$item->shipping_cost = 1306.25;
$item->shipping_cost_per_kg = 25.00;

// Calculate final_unit_cost = total_price + shipping_cost
// Note: total_price is for ORDERED quantity (100), not received (95)
$item->final_unit_cost = 345000 + 1306.25 = ৳346,306.25

$item->save();

// Calculate lost quantity and refund
$lostQty = 100 - 95 = 5 units
$lostPercentage = (5 / 100) × 100 = 5%

// Since lost % < 10%, NO refund
// Price already adjusted via lower received_quantity in shipping cost
```

**Database Record (Final)**:
```
bd_price:           3450.00
total_price:        345000.00  (for 100 ordered units)
shipping_cost_per_kg: 25.00
shipping_cost:      1306.25   (for 95 received units)
received_quantity:  95
lost_quantity:      5
final_unit_cost:    346306.25 (total_price + shipping_cost)
```

---

## Key Formulas Summary

### 1. bd_price (BDT per unit)
```php
$bd_price = $china_price × $exchange_rate
```

### 2. total_price (BDT total for line)
```php
$total_price = $bd_price × $ordered_quantity
```

### 3. shipping_cost (BDT shipping for line)
```php
$weight_kg = (unit_weight + extra_weight) × quantity / 1000
$shipping_cost = $weight_kg × $shipping_cost_per_kg
```

### 4. final_unit_cost (BDT landed cost for line)
```php
$final_unit_cost = $total_price + $shipping_cost
```

---

## Backend Code Updates

### 1. PurchaseOrderController.php - Creating PO Items

**Before**:
```php
PurchaseOrderItem::create([
    'unit_price' => $item['china_price'], // Same as china_price
    'total_price' => $item['china_price'] * $item['quantity'], // In RMB!
]);
```

**After**:
```php
$bdPrice = $item['china_price'] * $request->exchange_rate;
$totalPrice = $bdPrice * $item['quantity'];

PurchaseOrderItem::create([
    'bd_price' => $bdPrice,                // Converted to BDT
    'total_price' => $totalPrice,          // BDT total
]);
```

### 2. PurchaseOrderController.php - Arrived BD Status

**Added**:
```php
// Calculate final_unit_cost = total_price + shipping_cost
$item->final_unit_cost = $item->total_price + $item->shipping_cost;
$item->save();
```

### 3. PurchaseOrderController.php - Receive Goods

**Before**:
```php
if (isset($itemData['final_unit_cost'])) {
    $item->final_unit_cost = $itemData['final_unit_cost'];
} else {
    $item->final_unit_cost = $item->china_price * $po->exchange_rate;
}
```

**After**:
```php
// Calculate shipping cost
$itemWeightKg = ($unitWeight + $extraWeight) * $receivedQty / 1000;
$itemShippingCost = $itemWeightKg * $shippingCostPerKg;
$item->shipping_cost = $itemShippingCost;

// Calculate final_unit_cost = total_price + shipping_cost
$item->final_unit_cost = $item->total_price + $item->shipping_cost;
```

### 4. PurchaseOrderItem.php - Model

**Before**:
```php
protected $fillable = [
    'unit_price',
    ...
];
```

**After**:
```php
protected $fillable = [
    'bd_price',  // Renamed from unit_price
    ...
];
```

---

## Database Migration

### Migration File
`database/migrations/2026_02_24_114403_rename_unit_price_to_bd_price_in_purchase_order_items.php`

```php
Schema::table('purchase_order_items', function (Blueprint $table) {
    $table->renameColumn('unit_price', 'bd_price');
});
```

---

## Frontend Updates Required

### 1. API Response Handling
**Before**:
```typescript
item.unitPrice
```

**After**:
```typescript
item.bdPrice  // Renamed field
```

### 2. Display Labels
**Before**:
```
Unit Price: ¥150
Total Price: ¥15,000
```

**After**:
```
BD Price: ৳3,450
Total Price: ৳345,000
Final Cost: ৳346,375 (includes shipping)
```

### 3. Form Calculations
Update receiving modal to display correct calculations:
- Show `bd_price` as base cost
- Show `total_price` as `bd_price × ordered_quantity`
- Show `final_unit_cost` as `total_price + shipping_cost`

---

## Validation

All fields are properly validated:

```php
$request->validate([
    'items.*.china_price' => 'required|numeric|min:0',
    'items.*.bd_price' => 'nullable|numeric|min:0',
    'items.*.shipping_cost' => 'nullable|numeric|min:0',
    'items.*.final_unit_cost' => 'nullable|numeric|min:0',
]);
```

---

## Important Notes

1. **`total_price` is for ORDERED quantity**, not received quantity
   - If 100 ordered, 95 received → `total_price` still based on 100
   - Shipping cost is based on RECEIVED quantity (95)
   - This accurately reflects the cost of the goods received

2. **`final_unit_cost` is LINE total**, not per-unit
   - Despite the name "final_unit_cost", it's actually the total landed cost for the line
   - Formula: `total_price + shipping_cost`
   - To get per-unit landed cost: `final_unit_cost / received_quantity`

3. **All calculations in BDT** after exchange rate conversion
   - `china_price` is the only RMB field
   - `bd_price`, `total_price`, `shipping_cost`, `final_unit_cost` are all BDT

---

**Document Version**: 1.0
**Last Updated**: 2026-02-24
**Author**: Claude Code (Sonnet 4.6)
