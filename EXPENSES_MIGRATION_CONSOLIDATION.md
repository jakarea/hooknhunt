# Expenses Table Migration Consolidation

**Date**: 2026-02-24
**Status**: ✅ COMPLETE

---

## Summary

Consolidated 1 modification migration file into the original migration for the `expenses` table.

---

## Files Deleted (1 migration)

### Expenses Table Modification (1 file):
1. ❌ `2026_02_09_074719_add_source_fields_to_expenses_table.php`

---

## File Updated

### ✅ `0001_01_01_000333_create_expenses_table.php`

This migration now contains the complete definition of the `expenses` table including the source tracking fields that were previously added separately.

---

## Final Schema Structure

### `expenses` table:
```php
- id
- currency_id (foreign key → currencies)
- source_type (string) nullable                        // Added 2026-02-09
- source_id (unsignedBigInteger) nullable              // Added 2026-02-09
- title (string)
- amount (decimal 12,2)
- vat_percentage (decimal 5,2) nullable
- vat_amount (decimal 15,2) nullable
- vat_challan_no (string) nullable
- tax_percentage (decimal 5,2) nullable
- tax_amount (decimal 15,2) nullable
- tax_challan_no (string) nullable
- expense_date (date)
- reference_number (string) nullable
- account_id (foreign key → chart_of_accounts)
- payment_account_id (foreign key → chart_of_accounts) nullable
- project_id (foreign key → projects) nullable
- cost_center_id (foreign key → cost_centers) nullable
- expense_department_id (foreign key → departments) nullable
- paid_by (foreign key → users)
- attachment (string) nullable
- notes (text) nullable
- is_approved (boolean) default(false)
- timestamps
```

### Indexes:
```php
- project_id
- cost_center_id
- expense_department_id
- [source_type, source_id]  // Composite index added 2026-02-09
```

---

## Key Changes Made

### Expenses Table:
- ✅ Added `source_type` field for polymorphic relation (e.g., 'App\Models\Payroll')
- ✅ Added `source_id` field for polymorphic relation (ID of the source record)
- ✅ Added composite index on `[source_type, source_id]` for faster queries

---

## Benefits

1. **Single Source of Truth**: Complete table definition in one file
2. **Cleaner Migration History**: From 2 files down to 1 file
3. **Easier Maintenance**: No need to check multiple files
4. **Better Database Management**: Fresh installs get the complete schema immediately
5. **Source Tracking**: Expenses can be linked to their source (e.g., payroll, procurement)

---

## Migration Structure (Before vs After)

### Before (2 files):
```
0001_01_01_000333_create_expenses_table.php (original)
└── 2026_02_09_074719_add_source_fields_to_expenses_table.php ❌
```

### After (1 file):
```
0001_01_01_000333_create_expenses_table.php ✅ CONSOLIDATED
```

---

## Polymorphic Source Tracking

The consolidated migration now includes polymorphic relations to track expense sources:

### How It Works:
```php
// Example 1: Salary expense from payroll
source_type: 'App\Models\Payroll'
source_id: 123

// Example 2: Office supplies expense (manual entry)
source_type: null
source_id: null

// Example 3: Procurement expense
source_type: 'App\Models\PurchaseOrder'
source_id: 456
```

### Use Cases:
1. **Payroll Expenses**: Automatically created when payroll is approved
2. **Procurement Expenses**: Automatically created when purchase order is paid
3. **Manual Expenses**: Created by users for miscellaneous expenses

### Query Example:
```php
// Get all expenses from payroll
$payrollExpenses = Expense::where('source_type', 'App\Models\Payroll')
    ->where('source_id', $payrollId)
    ->get();

// Get the source model
$expense->source; // Returns the related Payroll/PurchaseOrder model
```

---

## Tax and VAT System

The expenses table includes comprehensive tax tracking:

### VAT (Value Added Tax):
- `vat_percentage` - VAT rate (e.g., 15.00 for 15%)
- `vat_amount` - Calculated VAT amount
- `vat_challan_no` - VAT challan number for tax authority

### Tax (AIT - Advance Income Tax):
- `tax_percentage` - Tax rate (e.g., 3.00 for 3%)
- `tax_amount` - Calculated tax amount
- `tax_challan_no` - Tax challan number for tax authority

---

## Important Notes

### For Fresh Installations:
- Run `php artisan migrate` to create the expenses table with all fields including source tracking

### For Existing Databases:
- The database schema remains unchanged (no data loss)
- All existing data continues to work as before
- The consolidation only affects migration files, not the actual database structure

### For Development:
- Any new fields needed should be added directly to this consolidated migration file
- No more separate modification migrations for this table

---

## Model Usage Example

```php
// In Expense model
public function source()
{
    return $this->morphTo();
}

// Usage
$expense = Expense::find(1);
if ($expense->source_type === 'App\Models\Payroll') {
    $payroll = $expense->source; // Returns the Payroll model
    // Access payroll details
}
```

---

**Consolidation completed successfully! 🎉**
