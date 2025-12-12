# Variable Product Step 2 Pricing Implementation

## Summary

Updated the **Receive Stock** flow (`ReceiveStockNew.tsx`) to handle platform pricing differently for variable products versus simple products in Step 2.

---

## Problem

Previously, Step 2 (Platform Configuration) only supported simple products where there's a single price per platform at the product level. For variable products, this didn't work because:

- Each variant has its own landed cost
- Each variant should have its own pricing per platform (Retail, Wholesale, Daraz)
- Each variant can have different discount configurations

---

## Solution

Implemented **conditional rendering** in Step 2:

### For Simple Products (Original Behavior)
- Shows platform pricing fields at the product level
- Single price, discount, and configuration per platform
- Uses `platforms` state object

### For Variable Products (New Implementation)
- Shows variant-level platform pricing
- Each variant card displays:
  - Variant identification (attributes, SKU, landed cost)
  - Platform pricing fields for each variant
  - Individual profit margin calculations per variant per platform
  - Platform-specific discount configurations per variant

---

## Implementation Details

### 1. Step 2 UI Changes

**File**: `hooknhunt-ui/src/pages/inventory/ReceiveStockNew.tsx` (lines 1241-1843)

#### Conditional Description
```typescript
<CardDescription>
  {productType === 'simple'
    ? t('receiveStock.step2.description')
    : 'Configure platform-specific pricing for each variant'}
</CardDescription>
```

#### Simple Product Section (lines 1254-1527)
- Wrapped original platform pricing UI in `{productType === 'simple' && (...)}`
- No changes to existing simple product logic
- Uses `platforms` state and `updatePlatformField` function

#### Variable Product Section (lines 1529-1840)
```typescript
{productType === 'variable' && (
  <div className="space-y-6">
    {variantRows.map((variant, variantIndex) => (
      // Variant card with platform pricing...
    ))}
  </div>
)}
```

**For each variant, displays:**

1. **Variant Header**:
   - Variant number and attribute values (e.g., "Variant 1 (Red / Small)")
   - SKU and landed cost display

2. **Platform Pricing** (for each platform: wholesale, retail, daraz):
   - Platform toggle (enable/disable)
   - Display name input
   - Price input with profit margin indicator
   - Offer configuration (type, value, start/end dates)
   - Profit margin display (regular and discounted)
   - Platform thumbnail upload

**Example Structure:**
```
┌─────────────────────────────────────────┐
│ Variant 1 (Red / Small)                 │
│ SKU: RS-001 | Landed Cost: 500 BDT     │
├─────────────────────────────────────────┤
│ ┌─ Wholesale ───────────────────────┐   │
│ │ Display Name: [input]             │   │
│ │ Price: [input] (30% margin)       │   │
│ │ Offer: [type] [value] [dates]     │   │
│ │ Profit Margin: 30% (150 BDT)      │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌─ Retail ──────────────────────────┐   │
│ │ ...                               │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌─ Daraz ───────────────────────────┐   │
│ │ ...                               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

### 2. Validation Updates

**File**: `hooknhunt-ui/src/pages/inventory/ReceiveStockNew.tsx` (lines 472-553)

Updated `validateStep2()` function to handle both product types:

#### Simple Product Validation
- Validates `platforms` state object
- Same logic as before

#### Variable Product Validation (New)
```typescript
else if (productType === 'variable') {
  for (let i = 0; i < variantRows.length; i++) {
    const variant = variantRows[i];
    const enabledPlatforms = Object.entries(variant.platforms).filter(([_, data]) => data.enabled);

    for (const [platform, data] of enabledPlatforms) {
      // Validate display name
      // Validate price (must be > 0 and > landed cost)
      // Validate offer fields if configured
    }
  }
}
```

**Error Message Format:**
- `variant_0_wholesale_name`: "Variant 1: Display name is required for wholesale"
- `variant_1_retail_price`: "Variant 2: retail price (৳450) must be greater than landed cost (৳500). You'll lose ৳50 per unit!"

---

### 3. Auto-Price Calculation

**File**: `hooknhunt-ui/src/pages/inventory/ReceiveStockNew.tsx` (lines 183-244)

Split the auto-calculation logic into two separate useEffect hooks:

#### Simple Product Auto-Calculation (lines 183-205)
```typescript
useEffect(() => {
  if (productType !== 'simple') return;

  const landedCost = parseFloat(simpleLandedCost);
  if (landedCost > 0) {
    // Calculate prices for platforms based on global margin settings
    // Updates platforms state
  }
}, [simpleLandedCost, settings, productType]);
```

#### Variable Product Auto-Calculation (lines 207-244)
```typescript
useEffect(() => {
  if (productType !== 'variable' || variantRows.length === 0) return;

  const newRows = variantRows.map((variant) => {
    const landedCost = parseFloat(variant.landed_cost);
    if (landedCost <= 0) return variant;

    const newPlatforms = { ...variant.platforms };

    // Calculate prices for each platform based on variant's landed cost
    if (!newPlatforms.wholesale.price && settings.default_margin_wholesale) {
      newPlatforms.wholesale.price = calculatePrice(landedCost, parseFloat(settings.default_margin_wholesale));
    }
    // ... same for retail and daraz

    return { ...variant, platforms: newPlatforms };
  });

  // Only update if there were changes
  if (hasChanges) {
    setVariantRows(newRows);
  }
}, [variantRows, settings, productType]);
```

**Key Features:**
- Automatically calculates platform prices based on each variant's landed cost
- Uses global margin settings from Settings module
- Only updates if prices haven't been manually set
- Prevents infinite loops by checking for actual changes

---

## User Experience

### Simple Product Flow (Unchanged)
1. Step 1: Enter SKU, quantity, landed cost
2. Step 2: Configure pricing for wholesale, retail, daraz at product level
3. Step 3: Upload images
4. Step 4: Review and submit

### Variable Product Flow (New)
1. Step 1:
   - Select attribute types (Color, Size, etc.)
   - Add variants with combinations
   - Enter SKU, quantity, landed cost **per variant**
   - Upload variant thumbnails (optional)

2. **Step 2 (New Variant-Level Pricing):**
   - See all variants listed
   - For each variant:
     - Enable/disable platforms
     - Set display names per platform
     - Set prices (auto-calculated from landed cost + margin)
     - Configure offers (discounts, dates)
     - See profit margins (regular and discounted)
     - Upload platform-specific thumbnails

3. Step 3: Upload product images
4. Step 4: Review and submit

---

## Visual Design

### Variant Cards in Step 2
- **Border**: 2px solid gray with rounded corners
- **Background**: Gradient from white to light gray
- **Header**: Bold title with variant info and gray separator line
- **Platform Sections**: White cards with rounded borders inside variant card
- **Profit Indicators**: Green (profit) or red (loss) color coding

### Example Screenshot Description
```
┌────────────────────────────────────────────┐
│ Configure Platform Pricing for Variants    │
├────────────────────────────────────────────┤
│                                            │
│ ╔════════════════════════════════════════╗ │
│ ║ Variant 1 (Red / Small)                ║ │
│ ║ SKU: RS-001 | Landed Cost: 500 BDT    ║ │
│ ╠════════════════════════════════════════╣ │
│ ║ 📦 Wholesale                   [✓ ON]  ║ │
│ ║ Name: [Red Small - Wholesale]          ║ │
│ ║ Price: [650] (30% ↗)                   ║ │
│ ║ Offer: [Flat ▼] [50] [2025-01-01]     ║ │
│ ║ ┌────────────────────────────────────┐ ║ │
│ ║ │ Regular: 30% (150 BDT) ✓          │ ║ │
│ ║ │ Discount: 600 BDT                  │ ║ │
│ ║ │ After: 20% (100 BDT) ✓            │ ║ │
│ ║ └────────────────────────────────────┘ ║ │
│ ╚════════════════════════════════════════╝ │
│                                            │
│ ╔════════════════════════════════════════╗ │
│ ║ Variant 2 (Blue / Large)               ║ │
│ ║ ...                                    ║ │
│ ╚════════════════════════════════════════╝ │
└────────────────────────────────────────────┘
```

---

## Data Structure

### VariantRow Interface (Updated)
```typescript
interface VariantRow {
  sku: string;
  qty: string;
  landed_cost: string;
  attributes: Record<number, number>; // attrId -> optionId
  platforms: Record<Platform, PlatformData>; // Each variant has full platform data
  thumbnail?: File | null;
  thumbnailPreview?: string | null;
}
```

### PlatformData Structure
```typescript
interface PlatformData {
  enabled: boolean;
  name: string;
  price: string;
  offerDiscountType: 'flat' | 'percentage' | null;
  offerDiscountValue: string;
  offerStartDate: string;
  offerEndDate: string;
  thumbnail: File | null;
  thumbnailPreview: string | null;
}
```

---

## State Updates

**When user modifies variant platform data:**
```typescript
// Example: Updating wholesale price for variant 1
const newRows = [...variantRows];
newRows[0].platforms.wholesale.price = '650';
setVariantRows(newRows);
```

**When variant is added:**
```typescript
// New variant inherits platform structure from main platforms state
const newPlatforms: Record<Platform, PlatformData> = {
  wholesale: { ...platforms.wholesale, thumbnail: null, thumbnailPreview: null },
  retail: { ...platforms.retail, thumbnail: null, thumbnailPreview: null },
  daraz: { ...platforms.daraz, thumbnail: null, thumbnailPreview: null },
};
```

---

## Backend Integration Notes

When implementing the backend API, the payload structure for variable products will be:

```json
{
  "po_item_id": 39,
  "product_id": 123,
  "product_type": "variable",
  "internal_name": "Premium T-Shirt",
  "variants": [
    {
      "sku": "TS-RED-S",
      "qty": 50,
      "landed_cost": 500,
      "attributes": {
        "1": 5,  // Color attribute: Red
        "2": 8   // Size attribute: Small
      },
      "platforms": {
        "wholesale": {
          "enabled": true,
          "name": "Premium T-Shirt - Red / Small (Wholesale)",
          "price": "650",
          "offerDiscountType": "flat",
          "offerDiscountValue": "50",
          "offerStartDate": "2025-01-01",
          "offerEndDate": "2025-01-31"
        },
        "retail": { /* ... */ },
        "daraz": { /* ... */ }
      }
    },
    // ... more variants
  ]
}
```

**Expected Backend Response:**
- Create/update product variants
- Create/update platform pricing for each variant
- Create/update offer configurations
- Store variant thumbnails
- Return created variant IDs

---

## Testing Checklist

### Simple Products (Regression Testing)
- [ ] Step 2 still shows product-level platform pricing
- [ ] Price auto-calculation works
- [ ] Profit margins display correctly
- [ ] Validation works (name, price, offers)
- [ ] Draft save includes platform data
- [ ] Can submit successfully

### Variable Products (New Feature)
- [ ] Step 2 shows variant-level platform pricing
- [ ] All variants are listed with correct attribute values
- [ ] Can enable/disable platforms per variant
- [ ] Display names are editable
- [ ] Prices auto-calculate based on variant landed cost
- [ ] Profit margins show for each variant/platform
- [ ] Can configure different offers per variant/platform
- [ ] Validation catches missing/invalid data
- [ ] Error messages show correct variant number
- [ ] Draft save includes all variant platform data
- [ ] Can upload platform thumbnails per variant
- [ ] Can navigate back to Step 1 and see changes reflected

### Edge Cases
- [ ] Variant with 0 or negative landed cost doesn't crash
- [ ] Disabling a platform clears its data
- [ ] Adding a new variant in Step 1 shows correct pricing in Step 2
- [ ] Removing a variant in Step 1 updates Step 2
- [ ] Changing variant landed cost in Step 1 recalculates Step 2 prices

---

## Browser Console Testing

To test variant platform data in console:

```javascript
// Get variant rows from component state
variantRows

// Check first variant's wholesale pricing
variantRows[0].platforms.wholesale

// Verify all variants have platform data
variantRows.every(v => v.platforms.wholesale && v.platforms.retail && v.platforms.daraz)

// Check for profit margins
variantRows.map(v => ({
  sku: v.sku,
  cost: v.landed_cost,
  wholesalePrice: v.platforms.wholesale.price,
  margin: ((parseFloat(v.platforms.wholesale.price) - parseFloat(v.landed_cost)) / parseFloat(v.landed_cost) * 100).toFixed(1) + '%'
}))
```

---

## Future Enhancements

1. **Bulk Pricing**: Add "Apply to All Variants" button to set same price for all variants
2. **Price Templates**: Save pricing configurations as templates for quick application
3. **Price Comparison**: Show side-by-side comparison of all variant prices
4. **Export/Import**: Export variant pricing to CSV and import back
5. **Price History**: Track price changes for each variant over time
6. **Copy Variant**: Duplicate variant with all platform pricing
7. **Visual Thumbnails**: Show variant and platform thumbnails in a gallery view

---

## Performance Considerations

- **Auto-calculation**: Only runs when landed cost or settings change
- **Change detection**: Checks for actual changes before updating state
- **Conditional rendering**: Only renders variant section when productType is 'variable'
- **Validation**: Runs only on "Next" button click, not on every input change

---

## Files Modified

1. **hooknhunt-ui/src/pages/inventory/ReceiveStockNew.tsx**
   - Lines 183-244: Auto-calculation logic (split for simple vs variable)
   - Lines 472-553: Validation logic (split for simple vs variable)
   - Lines 1241-1843: Step 2 UI (conditional rendering)

---

## Commit Message Suggestion

```
feat: Add variant-level platform pricing in Step 2 for variable products

- Split Step 2 UI to handle simple vs variable products differently
- Variable products now show platform pricing per variant instead of product-level
- Each variant has independent pricing, discounts, and offers per platform
- Auto-calculate variant platform prices based on individual landed costs
- Updated validation to handle variant-level platform data
- Added profit margin indicators for each variant/platform combination
- Maintained backward compatibility with simple product flow

Closes #XX (replace with issue number)
```

---

## Related Documentation

- `/Applications/MAMP/htdocs/hooknhunt/RECEIVE_STOCK_IMPROVEMENTS.md` - Original Step 2 simple product implementation
- `/Applications/MAMP/htdocs/hooknhunt/VARIANT_MANAGEMENT_GUIDE.md` - Variant creation in product management
- `/Applications/MAMP/htdocs/hooknhunt/AI_Context.md` - Overall system architecture

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify `productType` state is correctly set
3. Ensure `variantRows` array has platform data initialized
4. Check that global settings have margin percentages configured
