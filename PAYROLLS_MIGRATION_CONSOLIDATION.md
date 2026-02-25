# Payrolls Table Migration Consolidation

**Date**: 2026-02-24
**Status**: ✅ COMPLETE

---

## Summary

Consolidated 2 modification migration files into the original migration for the `payrolls` table.

---

## Files Deleted (2 migrations)

### Payrolls Table Modifications (2 files):
1. ❌ `2026_02_09_065003_add_salary_components_to_payrolls_table.php`
2. ❌ `2026_02_09_095934_add_status_processing_to_payrolls.php`

---

## File Updated

### ✅ `0001_01_01_000230_create_payrolls_table.php`

This migration now contains the complete definition of the `payrolls` table including the salary component fields and updated status enum that were previously added separately.

---

## Final Schema Structure

### `payrolls` table:
```php
- id
- user_id (foreign key → users)
- month_year (string) - Format: "January 2026"
- basic_salary (decimal 12,2)
- house_rent (decimal 10,2) default(0)           // Added 2026-02-09
- medical_allowance (decimal 10,2) default(0)     // Added 2026-02-09
- conveyance_allowance (decimal 10,2) default(0)  // Added 2026-02-09
- overtime_hourly_rate (decimal 10,2) default(0)  // Added 2026-02-09
- total_overtime_hours (decimal 8,2) default(0)   // Added 2026-02-09
- overtime_amount (decimal 10,2) default(0)       // Added 2026-02-09
- bonus (decimal 10,2) default(0)
- deductions (decimal 10,2) default(0)
- net_payable (decimal 12,2)
- status (ENUM: generated, processing, paid)      // Modified 2026-02-09
- payment_date (date)
- timestamps
```

---

## Key Changes Made

### Payrolls Table:

#### 1. Salary Components (added 2026-02-09):
- ✅ `house_rent` - House rent allowance
- ✅ `medical_allowance` - Medical/health allowance
- ✅ `conveyance_allowance` - Transport/conveyance allowance
- ✅ `overtime_hourly_rate` - Hourly rate for overtime calculation
- ✅ `total_overtime_hours` - Total overtime hours worked
- ✅ `overtime_amount` - Total overtime pay (hours × rate)

#### 2. Status Enum Update (added 2026-02-09):
- ✅ Added `'processing'` status to the enum
- ✅ Original: `['generated', 'paid']`
- ✅ Updated: `['generated', 'processing', 'paid']`

---

## Benefits

1. **Single Source of Truth**: Complete table definition in one file
2. **Cleaner Migration History**: From 3 files down to 1 file
3. **Easier Maintenance**: No need to check multiple files
4. **Better Database Management**: Fresh installs get the complete schema immediately
5. **Complete Salary System**: All salary components included from the start

---

## Migration Structure (Before vs After)

### Before (3 files):
```
0001_01_01_000230_create_payrolls_table.php (original)
├── 2026_02_09_065003_add_salary_components_to_payrolls_table.php ❌
└── 2026_02_09_095934_add_status_processing_to_payrolls.php ❌
```

### After (1 file):
```
0001_01_01_000230_create_payrolls_table.php ✅ CONSOLIDATED
```

---

## Salary Calculation System

The consolidated migration now includes a complete salary breakdown:

### Earnings:
1. **basic_salary** - Base monthly salary
2. **house_rent** - House rent allowance
3. **medical_allowance** - Medical/health allowance
4. **conveyance_allowance** - Transport allowance
5. **overtime_amount** - Overtime pay (hours × hourly_rate)
6. **bonus** - Performance bonus or festival bonus

### Deductions:
- **deductions** - Total deductions (tax, provident fund, etc.)

### Net Payable:
```
net_payable = (basic_salary + house_rent + medical_allowance +
               conveyance_allowance + overtime_amount + bonus) -
               deductions
```

---

## Status Workflow

The payroll status now includes three states:

1. **generated** - Payroll slip generated but not yet processed
2. **processing** - Payroll being processed for payment
3. **paid** - Payment completed and recorded

This allows better tracking of payroll processing stages.

---

## Important Notes

### For Fresh Installations:
- Run `php artisan migrate` to create the payrolls table with all fields including detailed salary components

### For Existing Databases:
- The database schema remains unchanged (no data loss)
- All existing data continues to work as before
- The consolidation only affects migration files, not the actual database structure

### For Development:
- Any new fields needed should be added directly to this consolidated migration file
- No more separate modification migrations for this table

---

## Overtime Calculation

The overtime system works as follows:
```
overtime_amount = total_overtime_hours × overtime_hourly_rate
```

For example:
- If an employee worked 10 hours of overtime
- And their overtime hourly rate is ৳150
- Then: `overtime_amount = 10 × 150 = ৳1,500`

---

**Consolidation completed successfully! 🎉**
