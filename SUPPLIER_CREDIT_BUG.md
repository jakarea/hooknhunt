# Supplier Credit Bug - Backend Logic Mismatch

## Problem Statement
**User Question**: "product purchase perfect, but what is happening for supplier credite for lot items more than 10%?"

## Current State (PO #6 Example)
```
Supplier: 1 Macey Maynard (ID: 3)
Wallet Balance: 0.00 BDT ❌ (should be 6000 BDT)
Refund Amount: 6000.00 BDT ✅ (calculated correctly)
Refund Auto-Credited: No ❌ (should be Yes)
Refunded At: (empty) ❌ (should have timestamp)
```

## Root Cause

**Backend Logic Mismatch**: The backend uses **TOTAL order percentage** to decide whether to auto-credit, while the frontend uses **PER-ITEM percentage**.

### Current Backend Logic (BUGGY)
**File**: [PurchaseOrderController.php:551-564](hooknhunt-api/app/Http/Controllers/Api/V2/PurchaseOrderController.php#L551-L564)

```php
// Step 4: Handle refund/wallet credit (10% threshold)
$shouldAutoCredit = $totalLostPercentage <= 10;  // ❌ Checks TOTAL order percentage
$refundAmount = 0;

if ($totalLostPercentage > 0) {
    // Calculate refund amount for items lost > 10%
    foreach ($po->items as $item) {
        $lostQty = $item->quantity - $item->received_quantity;
        $lostPercentage = $item->quantity > 0 ? ($lostQty / $item->quantity) * 100 : 0;

        // Only credit if this specific item lost > 10%  ✅ CORRECT
        if ($lostQty > 0 && $lostPercentage > 10) {
            $refundAmount += $lostQty * $item->china_price * $po->exchange_rate;
        }
    }

    // Auto-credit supplier wallet if within 10% threshold
    if ($refundAmount > 0 && $shouldAutoCredit) {  // ❌ WRONG: Uses TOTAL percentage
        $po->supplier->addCredit(
            $refundAmount,
            "Auto-credit for PO {$po->po_number} - Lost items ({$totalLostPercentage}% lost, within 10% threshold)"
        );
        $po->refund_auto_credited = true;
        $po->refunded_at = now();
    } elseif ($refundAmount > 0 && !$shouldAutoCredit) {
        // Lost > 10% - mark for manual review
        $po->refund_auto_credited = false;
        $receivingNotes[] = [
            'warning' => "Lost percentage ({$totalLostPercentage}%) exceeds 10% threshold. Manual review required for refund of {$refundAmount} BDT."
        ];
    }
}
```

### The Conflict

| Scenario | Current Backend Behavior | Expected Behavior (PER-ITEM) |
|----------|-------------------------|------------------------------|
| **Item A**: 5% loss (≤ 10%) | No refund (price adjusted) | No refund (price adjusted) ✅ |
| **Item B**: 50% loss (> 10%) | Refund calculated BUT **NOT credited** if TOTAL > 10% | **Auto-credited** to wallet ✅ |
| **TOTAL order**: 27% loss | Blocks ALL refunds (manual review) | **Each item independent** ✅ |

**Result**: Supplier doesn't get credited even though individual items have > 10% loss!

## Supplier Wallet System

### Database Schema
**Table**: `suppliers`
- `wallet_balance` (decimal, 10, 2) - Current balance in BDT
- `credit_limit` (decimal, 10, 2) - Maximum negative balance allowed
- `wallet_notes` (text, JSON) - Transaction history

**Migration**: [2026_02_19_153054_add_wallet_balance_to_suppliers_table.php](hooknhunt-api/database/migrations/2026_02_19_153054_add_wallet_balance_to_suppliers_table.php)

### Supplier Model Methods
**File**: [Supplier.php:25-35](hooknhunt-api/app/Models/Supplier.php#L25-L35)

```php
public function addCredit(float $amount, string $note = null): bool
{
    $this->wallet_balance += $amount;  // Add to wallet
    $saved = $this->save();

    if ($saved && $note) {
        $this->addWalletNote($note, $amount, 'credit');
    }

    return $saved;
}

protected function addWalletNote(string $note, float $amount, string $type): void
{
    $notes = $this->wallet_notes ? json_decode($this->wallet_notes, true) : [];
    $notes[] = [
        'date' => now()->toDateTimeString(),
        'type' => $type, // 'credit' or 'debit'
        'amount' => $amount,
        'balance_after' => $this->wallet_balance,
        'note' => $note,
    ];
    $this->wallet_notes = json_encode($notes);
    $this->saveQuietly();
}
```

## Correct Backend Logic (PER-ITEM)

The backend should match the frontend logic:

```php
// Step 4: Handle refund/wallet credit (PER-ITEM percentage check)
$refundAmount = 0;
$hasAnyHighLossItems = false;

// Calculate refund amount for items lost > 10%
foreach ($po->items as $item) {
    $lostQty = $item->quantity - $item->received_quantity;
    $lostPercentage = $item->quantity > 0 ? ($lostQty / $item->quantity) * 100 : 0;

    if ($lostQty > 0) {
        if ($lostPercentage > 10) {
            // This item lost > 10% - add to refund
            $refundAmount += $lostQty * $item->china_price * $po->exchange_rate;
            $hasAnyHighLossItems = true;
        }
        // If lost % <= 10%, NO refund (price adjustment handled in Step 3)
    }
}

// Auto-credit supplier wallet if there are refunds (no threshold check needed)
if ($refundAmount > 0) {
    $po->supplier->addCredit(
        $refundAmount,
        "Auto-credit for PO {$po->po_number} - Refund for items with >10% loss"
    );
    $po->refund_auto_credited = true;
    $po->refunded_at = now();
}
```

## Key Changes Needed

1. **Remove `$shouldAutoCredit` variable** - No longer needed
2. **Always auto-credit if `$refundAmount > 0`** - Each item checked independently
3. **Remove manual review logic** - No longer based on total percentage
4. **Update credit note message** - Reflect per-item logic

## Frontend Alignment

The frontend was already updated in [PER_ITEM_PERCENTAGE_IMPLEMENTATION.md](hooknhunt-api/resources/js/components/PER_ITEM_PERCENTAGE_IMPLEMENTATION.md):

**File**: [receiving-modal.tsx:157-224](hooknhunt-api/resources/js/components/receiving-modal.tsx#L157-L224)

```typescript
// PER-ITEM CHECK: Only distribute lost cost if THIS item's loss ≤ 10%
if (calc.lostQty > 0 && calc.lostPercentage <= 10) {
    const lostValueForThisItem = calc.lostValueBdt
    const lostAdjustmentPerUnit = lostValueForThisItem / calc.receivedQty
    adjustmentPerUnit += lostAdjustmentPerUnit
}
// If lost > 10%, NO lost adjustment (goes to refund)
```

## Impact

**Before Fix**:
- Supplier wallet NOT credited for items with > 10% loss
- Manual review flagged incorrectly
- Supplier loses money they should receive

**After Fix**:
- Each item with > 10% loss = auto-refund to supplier wallet ✅
- Each item with ≤ 10% loss = price adjustment (no refund) ✅
- No manual review needed for normal losses ✅
- Supplier wallet updated automatically ✅

## Test Cases

### Case 1: Mixed Losses (Current Scenario)
- **Item A**: Ordered 100, Received 95 (5% loss) → Price adjustment
- **Item B**: Ordered 100, Received 50 (50% loss) → Refund 50 × unit_cost
- **Expected**: Supplier wallet credited with Item B's refund

### Case 2: All Items Within Threshold
- **All items**: Loss ≤ 10% → All price adjustments
- **Expected**: No refund, wallet unchanged

### Case 3: No Losses
- **All items**: Received = Ordered
- **Expected**: No refund, wallet unchanged

## Migration Status
✅ Wallet columns exist in suppliers table
✅ Supplier model has addCredit() method
❌ Backend logic needs update to match frontend

---

**Date**: 2025-02-21
**Status**: 🔴 CRITICAL BUG - Backend needs fix
**Priority**: HIGH - Supplier funds not being credited
