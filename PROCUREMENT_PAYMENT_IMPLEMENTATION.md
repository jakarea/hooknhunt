# Procurement Order Payment Flow - Implementation Plan

## Business Requirements

### Flow: Draft → Payment Confirmed

**User Inputs:**
1. Exchange rate (RMB → BDT) - Already exists
2. Payment account selection - **NEW**

**System Logic:**
1. Calculate order total in BDT
2. Check supplier credit balance
3. **First**: Deduct from supplier credit (if any)
4. **Then**: Deduct remaining from selected payment account
5. Create double-entry financial transaction
6. Record supplier credit usage

## Implementation Plan

### Phase 1: Backend API Changes

#### 1.1 Add Payment Fields to Validation
**File**: `PurchaseOrderController.php` (line 269-273)

```php
$request->validate([
    'status' => 'required|in:draft,payment_confirmed,...',
    'exchange_rate' => 'nullable|numeric|min:0',
    'payment_account_id' => 'required_if:status,payment_confirmed|exists:banks,id', // NEW
    'use_supplier_credit' => 'nullable|boolean', // NEW
    // ... other fields
]);
```

#### 1.2 Create Pure Payment Calculation Functions
**File**: `app/Services/PurchaseOrderPaymentService.php` (NEW)

```php
<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\Supplier;
use App\Models\Bank;
use App\Models\JournalEntry;
use App\Models\JournalItem;

/**
 * Pure functions for purchase order payment calculations
 * Each function has single responsibility and no side effects
 */

class PurchaseOrderPaymentService
{
    /**
     * Calculate payment breakdown from supplier credit and bank
     *
     * @param float $orderTotalBDT - Total order amount in BDT
     * @param float $supplierCreditBalance - Supplier's credit balance
     * @return array{from_supplier_credit: float, from_bank: float, total: float}
     */
    public static function calculatePaymentBreakdown(
        float $orderTotalBDT,
        float $supplierCreditBalance
    ): array {
        $fromSupplierCredit = min($orderTotalBDT, $supplierCreditBalance);
        $fromBank = max(0, $orderTotalBDT - $fromSupplierCredit);

        return [
            'from_supplier_credit' => round($fromSupplierCredit, 2),
            'from_bank' => round($fromBank, 2),
            'total' => round($orderTotalBDT, 2),
        ];
    }

    /**
     * Calculate final bank balance after payment
     *
     * @param float $currentBalance - Current bank balance
     * @param float $paymentAmount - Amount to deduct
     * @return array{final_balance: float, is_negative: bool, difference: float}
     */
    public static function calculateFinalBankBalance(
        float $currentBalance,
        float $paymentAmount
    ): array {
        $finalBalance = $currentBalance - $paymentAmount;

        return [
            'final_balance' => round($finalBalance, 2),
            'is_negative' => $finalBalance < 0,
            'difference' => round($paymentAmount, 2),
        ];
    }

    /**
     * Validate if payment can be processed
     * (Allow negative balances - overdraft permitted)
     *
     * @param float $bankBalance
     * @param float $paymentAmount
     * @return array{can_proceed: bool, reason?: string}
     */
    public static function validatePayment(
        float $bankBalance,
        float $paymentAmount
    ): array {
        // Allow negative balances (overdraft)
        return [
            'can_proceed' => true,
        ];
    }

    /**
     * Generate payment description for journal entry
     *
     * @param string $poNumber
     * @param array $breakdown
     * @return string
     */
    public static function generatePaymentDescription(
        string $poNumber,
        array $breakdown
    ): string {
        $parts = ["Payment for {$poNumber}"];

        if ($breakdown['from_supplier_credit'] > 0) {
            $parts[] = "- Used supplier credit: ৳" . number_format($breakdown['from_supplier_credit'], 2);
        }

        if ($breakdown['from_bank'] > 0) {
            $parts[] = "- Paid from bank: ৳" . number_format($breakdown['from_bank'], 2);
        }

        return implode(' ', $parts);
    }

    /**
     * Process payment transaction with double-entry accounting
     *
     * @param PurchaseOrder $po
     * @param Bank $bank
     * @param array $breakdown
     * @param int $userId
     * @return JournalEntry
     */
    public static function createPaymentJournalEntry(
        PurchaseOrder $po,
        Bank $bank,
        array $breakdown,
        int $userId
    ): JournalEntry {
        return \DB::transaction(function () use ($po, $bank, $breakdown, $userId) {
            // Get chart of accounts
            $accountsPayableAccount = \App\Models\ChartOfAccount::where('code', '2001')->first(); // Liabilities
            $bankAccount = $bank->chartOfAccount;

            if (!$accountsPayableAccount || !$bankAccount) {
                throw new \Exception('Required chart of accounts not found');
            }

            // Create journal entry
            $entry = JournalEntry::create([
                'entry_number' => JournalEntry::getNextEntryNumber(),
                'date' => now(),
                'description' => self::generatePaymentDescription($po->po_number, $breakdown),
                'created_by' => $userId,
            ]);

            // Debit: Accounts Payable (we owe less to supplier)
            JournalItem::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $accountsPayableAccount->id,
                'debit' => $breakdown['total'],
                'credit' => 0,
            ]);

            // Credit: Bank Account (money goes out)
            JournalItem::create([
                'journal_entry_id' => $entry->id,
                'account_id' => $bankAccount->id,
                'debit' => 0,
                'credit' => $breakdown['from_bank'],
            ]);

            // Credit: Supplier Credit (if used)
            if ($breakdown['from_supplier_credit'] > 0) {
                // This reduces supplier credit (asset for us)
                JournalItem::create([
                    'journal_entry_id' => $entry->id,
                    'account_id' => $accountsPayableAccount->id, // Or create supplier credit account
                    'debit' => 0,
                    'credit' => $breakdown['from_supplier_credit'],
                ]);
            }

            return $entry;
        });
    }

    /**
     * Deduct from supplier wallet
     *
     * @param Supplier $supplier
     * @param float $amount
     * @param string $note
     * @return bool
     */
    public static function deductSupplierCredit(
        Supplier $supplier,
        float $amount,
        string $note
    ): bool {
        if ($amount <= 0) {
            return true; // Nothing to deduct
        }

        return $supplier->debitWallet($amount, $note);
    }

    /**
     * Deduct from bank account
     *
     * @param Bank $bank
     * @param float $amount
     * @return bool
     */
    public static function deductFromBank(
        Bank $bank,
        float $amount
    ): bool {
        $bank->current_balance -= $amount;
        return $bank->save();
    }
}
```

#### 1.3 Update PurchaseOrderController
**File**: `PurchaseOrderController.php` (line 293-344)

```php
// If confirming order (draft → payment_confirmed)
if ($oldStatus === 'draft' && $newStatus === 'payment_confirmed') {
    // ... existing PO number generation ...

    // NEW: Process payment
    $paymentAccountId = $request->input('payment_account_id');
    $bank = Bank::find($paymentAccountId);

    if (!$bank) {
        return $this->sendError('Payment account not found', [], 404);
    }

    // Calculate order total in BDT
    $orderTotalBDT = $po->total_amount * $po->exchange_rate;

    // Get supplier credit balance
    $supplierCreditBalance = $po->supplier->wallet_balance ?? 0;

    // Calculate payment breakdown
    $breakdown = \App\Services\PurchaseOrderPaymentService::calculatePaymentBreakdown(
        $orderTotalBDT,
        $supplierCreditBalance
    );

    // Validate payment
    $validation = \App\Services\PurchaseOrderPaymentService::validatePayment(
        $bank->current_balance,
        $breakdown['from_bank']
    );

    if (!$validation['can_proceed']) {
        return $this->sendError($validation['reason'] ?? 'Payment validation failed');
    }

    // Process in transaction
    \DB::transaction(function () use ($po, $bank, $breakdown, $orderTotalBDT) {
        // 1. Deduct from supplier credit first
        if ($breakdown['from_supplier_credit'] > 0) {
            $note = "Payment for PO {$po->po_number} - Used supplier credit first";
            \App\Services\PurchaseOrderPaymentService::deductSupplierCredit(
                $po->supplier,
                $breakdown['from_supplier_credit'],
                $note
            );
        }

        // 2. Deduct from bank account
        if ($breakdown['from_bank'] > 0) {
            \App\Services\PurchaseOrderPaymentService::deductFromBank(
                $bank,
                $breakdown['from_bank']
            );
        }

        // 3. Create journal entry (double-entry)
        $journalEntry = \App\Services\PurchaseOrderPaymentService::createPaymentJournalEntry(
            $po,
            $bank,
            $breakdown,
            auth()->id()
        );

        // 4. Save payment info to PO
        $po->payment_account_id = $bank->id;
        $po->payment_amount = $orderTotalBDT;
        $po->supplier_credit_used = $breakdown['from_supplier_credit'];
        $po->bank_payment_amount = $breakdown['from_bank'];
        $po->journal_entry_id = $journalEntry->id;
        $po->save();
    });

    // ... rest of existing code ...
}
```

#### 1.4 Add Migration for Payment Fields
**File**: `database/migrations/2026_02_22_XXXXXX_add_payment_fields_to_purchase_orders.php`

```php
<?php

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->foreignId('payment_account_id')->nullable()->after('status')->constrained('banks');
            $table->decimal('payment_amount', 10, 2)->nullable()->after('payment_account_id');
            $table->decimal('supplier_credit_used', 10, 2)->default(0)->after('payment_amount');
            $table->decimal('bank_payment_amount', 10, 2)->nullable()->after('supplier_credit_used');
            $table->foreignId('journal_entry_id')->nullable()->after('bank_payment_amount')->constrained('journal_entries');
        });
    }

    public function down(): void
    {
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropForeign(['payment_account_id']);
            $table->dropForeign(['journal_entry_id']);
            $table->dropColumn([
                'payment_account_id',
                'payment_amount',
                'supplier_credit_used',
                'bank_payment_amount',
                'journal_entry_id'
            ]);
        });
    }
};
```

### Phase 2: Frontend Changes

#### 2.1 Add Payment Account Selection to Modal
**File**: `resources/js/app/admin/procurement/orders/[id]/page.tsx`

```tsx
// Add state
const [banks, setBanks] = useState<BankAccount[]>([])
const [selectedBankId, setSelectedBankId] = useState<number | null>(null)
const [paymentBreakdown, setPaymentBreakdown] = useState<{
  from_supplier_credit: number
  from_bank: number
  total: number
} | null>(null)

// Load banks on mount
useEffect(() => {
  loadBanks()
}, [])

const loadBanks = async () => {
  try {
    const response = await getBanks({ status: 'active' })
    const banksData = response?.data?.data || response?.data || []
    setBanks(Array.isArray(banksData) ? banksData : [])
  } catch (error) {
    console.error('Failed to load banks:', error)
  }
}

// Pure calculation function
const calculatePaymentBreakdown = (
  orderTotal: number,
  supplierCredit: number
): { from_supplier_credit: number; from_bank: number; total: number } => {
  const fromSupplierCredit = Math.min(orderTotal, supplierCredit)
  const fromBank = Math.max(0, orderTotal - fromSupplierCredit)
  return {
    from_supplier_credit: Math.round(fromSupplierCredit * 100) / 100,
    from_bank: Math.round(fromBank * 100) / 100,
    total: Math.round(orderTotal * 100) / 100,
  }
}

// Update calculation when exchange rate changes
useEffect(() => {
  if (order?.status === 'draft' && statusFormData.exchangeRate > 0) {
    const totalBdt = order.totalAmount * statusFormData.exchangeRate
    const supplierCredit = Number(order.supplier?.walletBalance) || 0
    setPaymentBreakdown(calculatePaymentBreakdown(totalBdt, supplierCredit))
  }
}, [statusFormData.exchangeRate, order])

// Add to modal (after exchange rate input)
{order.status === 'draft' && paymentBreakdown && (
  <>
    {/* Supplier Credit Alert */}
    {paymentBreakdown.from_supplier_credit > 0 && (
      <Alert color="green">
        <Stack gap="xs">
          <Text fw={500}>Supplier Credit Available</Text>
          <Text size="sm">
            Order Total: ৳{paymentBreakdown.total.toFixed(2)} BDT
            {' • '}
            Supplier Credit: ৳{paymentBreakdown.from_supplier_credit.toFixed(2)} BDT
            {' • '}
            Pay from Account: ৳{paymentBreakdown.from_bank.toFixed(2)} BDT
          </Text>
        </Stack>
      </Alert>
    )}

    {/* Payment Account Selection */}
    <Select
      label="Payment Account"
      placeholder="Select bank or mobile wallet"
      data={banks.map(bank => ({
        value: bank.id.toString(),
        label: `${bank.name} - ৳${bank.currentBalance.toFixed(2)} BDT`,
      }))}
      value={selectedBankId?.toString()}
      onChange={(value) => setSelectedBankId(value ? Number(value) : null)}
      required
    />

    {/* Final Balance Warning */}
    {selectedBankId && paymentBreakdown.from_bank > 0 && (() => {
      const bank = banks.find(b => b.id === selectedBankId)
      if (!bank) return null
      const finalBalance = bank.currentBalance - paymentBreakdown.from_bank
      const isNegative = finalBalance < 0

      return (
        <Alert color={isNegative ? 'red' : 'blue'} variant="light">
          <Text size="sm">
            Account balance will be:{' '}
            <Text fw={700} c={isNegative ? 'red' : 'blue'}>
              ৳{finalBalance.toFixed(2)} BDT
            </Text>
          </Text>
        </Alert>
      )
    })()}
  </>
)}
```

#### 2.2 Update Status Form Data
**File**: `page.tsx` (line 273-274)

```tsx
exchange_rate: statusFormData.exchangeRate,
payment_account_id: selectedBankId, // NEW
```

## Testing Checklist

- [ ] Supplier credit deducted first
- [ ] Bank balance updated correctly
- [ ] Journal entry created (double-entry)
- [ ] Negative balances allowed
- [ ] Payment breakdown shown in UI
- [ ] Final balance warning displayed
- [ ] All pure functions tested
- [ ] Transaction rollback on error

---

**Status**: Planning Complete
**Next Step**: User approval to proceed with implementation
