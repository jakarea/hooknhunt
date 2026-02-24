# Payment Account Missing from Payload - FIX ✅

## Issue Summary

When confirming a procurement order (Draft → Payment Confirmed), the API request payload was missing the `payment_account_id` field, causing validation errors on the backend.

**User Report**: Payload only contained `{status: "payment_confirmed", exchange_rate: 19}` - missing `paymentAccountId`

## Root Cause Analysis

The `buildStatusUpdatePayload()` function in `procurement-status.ts` was only including the `exchange_rate` field for the draft → payment_confirmed transition, but **NOT including the `payment_account_id` field** that was being passed to it.

**Before** (line 98-100):
```typescript
if (currentStatus === 'draft' && nextStatus === 'payment_confirmed') {
  payload.exchange_rate = formData.exchange_rate
  // ❌ Missing: payload.payment_account_id
}
```

## Solution Implemented

### 1. Updated `buildStatusUpdatePayload()` Function
**File**: [procurement-status.ts:105-109](hooknhunt-api/resources/js/utils/procurement-status.ts#L105-L109)

```typescript
// Add exchange rate and payment account for payment confirmation
if (currentStatus === 'draft' && nextStatus === 'payment_confirmed') {
  payload.exchange_rate = formData.exchange_rate
  payload.payment_account_id = formData.payment_account_id  // ✅ ADDED
}
```

### 2. Added Client-Side Validation
**File**: [procurement-status.ts:36-43](hooknhunt-api/resources/js/utils/procurement-status.ts#L36-L43)

```typescript
if (!payload.payment_account_id) {
  notifications.show({
    title: t('common.error'),
    message: 'Please select a payment account',
    color: 'red',
  })
  return false
}
```

This ensures the user cannot submit the form without selecting a payment account.

## How It Works Now

1. **User clicks "Confirm Order"** button
2. **Modal opens** with exchange rate input
3. **User enters exchange rate** (e.g., 19)
4. **Payment Summary appears** showing:
   - Order Value (RMB and BDT)
   - Supplier Credit Balance
   - Payment Breakdown (how much from supplier credit vs bank)
5. **User selects payment account** from dropdown (required)
6. **User clicks confirm** → Validation runs:
   - ✅ Exchange rate must be > 0
   - ✅ Payment account must be selected
7. **API request sent** with complete payload:
   ```json
   {
     "status": "payment_confirmed",
     "exchange_rate": 19,
     "payment_account_id": 3,
     "comments": "Order confirmed"
   }
   ```
8. **Backend processes payment**:
   - Calculates breakdown (supplier credit vs bank)
   - Deducts supplier credit first
   - Deducts remaining from bank account
   - Creates journal entry (double-entry)
   - Records supplier ledger entry

## Files Modified

1. ✅ [procurement-status.ts](hooknhunt-api/resources/js/utils/procurement-status.ts)
   - Added `payment_account_id` to payload builder
   - Added validation for payment account selection

## Testing Checklist

- [x] Build successful (no errors)
- [ ] Test with supplier credit balance
- [ ] Test without supplier credit
- [ ] Test with bank overdraft (negative balance allowed)
- [ ] Verify payment account selection is required
- [ ] Verify validation error shows when no account selected
- [ ] Verify backend processes payment correctly
- [ ] Verify supplier wallet is debited
- [ ] Verify bank account balance is updated
- [ ] Verify journal entry is created
- [ ] Verify supplier ledger entry is created

## Translation Keys Needed

Add to `locales/en.json` for i18n support:
```json
{
  "procurement": {
    "ordersPage": {
      "details": {
        "statusUpdate": {
          "draft": {
            "paymentAccountRequired": "Please select a payment account"
          }
        }
      }
    }
  }
}
```

## Backend Implementation (Already Complete)

The backend payment processing was already fully implemented:
- ✅ Migration: `add_payment_fields_to_purchase_orders_table.php`
- ✅ Service: `PurchaseOrderPaymentService.php` (pure functions)
- ✅ Controller: `PurchaseOrderController.php` (lines 295-445)
- ✅ Model: `PurchaseOrder.php` (fillable, casts, relationships)

## Next Steps for User

1. **Test the payment flow**:
   - Create a draft order
   - Click "Confirm Order"
   - Enter exchange rate
   - **Select payment account** (this is now required)
   - See payment breakdown
   - Submit and verify

2. **Verify backend processing**:
   - Check supplier wallet balance updated
   - Check bank account balance updated
   - Check journal entries table
   - Check supplier ledger table

3. **Optional**: Add translation keys for multilingual support

---

**Status**: ✅ FIX COMPLETE
**Build**: ✅ Successful
**Ready for**: User testing
