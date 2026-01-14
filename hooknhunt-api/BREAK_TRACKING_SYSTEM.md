# Break Tracking System Documentation

## Overview
This system tracks employee attendance with break tracking. Break times are stored as JSON arrays in the database, allowing multiple breaks per day.

## Database Schema
```sql
ALTER TABLE attendances ADD COLUMN break_in TEXT NULL DEFAULT NULL AFTER clock_in;
ALTER TABLE attendances ADD COLUMN break_out TEXT NULL DEFAULT NULL AFTER break_in;
```

## Data Structure

### break_in & break_out Fields
- Stored as JSON arrays in database
- Each break_in must have a corresponding break_out (pairs)
- Example:
  ```json
  {
    "break_in": ["10:30:00", "14:20:00"],
    "break_out": ["10:45:00", "14:35:00"]
  }
  ```
  This represents 2 breaks:
  - Break 1: 10:30:00 to 10:45:00 (15 minutes)
  - Break 2: 14:20:00 to 14:35:00 (15 minutes)

## Attendance Flow & Sequence Rules

### Valid Sequence:
```
clock_in → break_in → break_out → [break_in → break_out] → clock_out
```

### Rules:
1. **Clock In** - Must be first action of the day
2. **Break In** - Must be clocked in, NOT on break, NOT clocked out
3. **Break Out** - Must be currently on break
4. **Clock Out** - Must be clocked in, NOT on break
5. **Multiple Breaks** - Can repeat break_in/break_out sequence multiple times

### Validation Examples:

#### ✅ Valid Scenarios:
- Clock in → Break in → Break out → Clock out
- Clock in → Break in → Break out → Break in → Break out → Clock out
- Clock in → Clock out (no breaks)

#### ❌ Invalid Scenarios:
- Break in without Clock in
- Break out without Break in
- Clock out while on break
- Break in while already on break
- Clock in twice on same day
- Break out twice without break in between

## API Endpoints

### 1. Clock In
```http
POST /api/v2/hrm/clock-in
Authorization: Bearer {token}
```

**Features:**
- Creates new attendance record for today
- Initializes empty break arrays
- Auto-fixes incomplete attendance from previous day
- Calculates late status (after 10:15 AM)

**Response:**
```json
{
  "status": true,
  "message": "Clock In Successful (present/late)",
  "data": {
    "clockIn": "09:30:00",
    "breakIn": [],
    "breakOut": [],
    "clockOut": null
  }
}
```

### 2. Clock Out
```http
POST /api/v2/hrm/clock-out
Authorization: Bearer {token}
```

**Validations:**
- Must have clocked in
- Cannot be on break (must end break first)
- Cannot clock out twice

**Response:**
```json
{
  "status": true,
  "message": "Clock Out Successful",
  "data": {
    "clockIn": "09:30:00",
    "clockOut": "18:00:00"
  }
}
```

### 3. Break In
```http
POST /api/v2/hrm/break-in
Authorization: Bearer {token}
```

**Validations:**
- Must have clocked in
- Cannot be already on break
- Cannot have clocked out
- Adds time to break_in array

**Response:**
```json
{
  "status": true,
  "message": "Break started successfully",
  "data": {
    "breakIn": ["10:30:00"],
    "breakOut": []
  }
}
```

### 4. Break Out
```http
POST /api/v2/hrm/break-out
Authorization: Bearer {token}
```

**Validations:**
- Must be currently on break
- Cannot have clocked out
- Adds time to break_out array

**Response:**
```json
{
  "status": true,
  "message": "Break ended successfully",
  "data": {
    "breakIn": ["10:30:00"],
    "breakOut": ["10:45:00"]
  }
}
```

## Auto-Completion of Incomplete Attendance

### When It Runs:
Automatically runs when user clocks in for a **new day**

### What It Checks:
1. Previous day's most recent attendance record
2. Checks for incomplete states:
   - `clocked_in_without_out` - Clocked in but no clock out
   - `on_break_without_out` - Started break but didn't end it

### Standard Times Used:
```php
const STANDARD_CLOCK_OUT = '18:00:00';  // 6:00 PM
const STANDARD_BREAK_OUT = '18:00:00';  // 6:00 PM
```

### Auto-Fix Scenarios:

#### Scenario 1: Clocked in without clock out
**Before:**
```json
{
  "clockIn": "09:00:00",
  "clockOut": null
}
```
**After auto-fix:**
```json
{
  "clockIn": "09:00:00",
  "clockOut": "18:00:00",
  "note": "... [Auto-completed with standard time]"
}
```

#### Scenario 2: On break without break out
**Before:**
```json
{
  "clockIn": "09:00:00",
  "breakIn": ["14:00:00"],
  "breakOut": [],
  "clockOut": null
}
```
**After auto-fix:**
```json
{
  "clockIn": "09:00:00",
  "breakIn": ["14:00:00"],
  "breakOut": ["18:00:00"],
  "clockOut": "18:00:00",
  "note": "... [Auto-completed with standard time]"
}
```

## Model Helper Methods

### Attendance Model:

```php
// Check if user is currently on break
$attendance->isOnBreak(): bool

// Get current status: 'not_started', 'clocked_in', 'on_break', 'clocked_out'
$attendance->getCurrentStatus(): string

// Get incomplete state issues
$attendance->getIncompleteState(): array
// Returns: ['clocked_in_without_out', 'on_break_without_out']
```

## Testing Example

```bash
# 1. Clock in
curl -X POST http://localhost:8000/api/v2/hrm/clock-in \
  -H "Authorization: Bearer YOUR_TOKEN"

# 2. Take first break
curl -X POST http://localhost:8000/api/v2/hrm/break-in \
  -H "Authorization: Bearer YOUR_TOKEN"

# 3. End first break
curl -X POST http://localhost:8000/api/v2/hrm/break-out \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Take second break
curl -X POST http://localhost:8000/api/v2/hrm/break-in \
  -H "Authorization: Bearer YOUR_TOKEN"

# 5. End second break
curl -X POST http://localhost:8000/api/v2/hrm/break-out \
  -H "Authorization: Bearer YOUR_TOKEN"

# 6. Clock out
curl -X POST http://localhost:8000/api/v2/hrm/clock-out \
  -H "Authorization: Bearer YOUR_TOKEN"

# 7. Check attendance
curl -X GET "http://localhost:8000/api/v2/hrm/attendance?start_date=2026-01-10&end_date=2026-01-10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Frontend Integration

### Dashboard Button Logic:
```typescript
const status = attendance?.getCurrentStatus()

switch(status) {
  case 'not_started':
    return <ClockInButton />
  case 'clocked_in':
    return <BreakInButton />
  case 'on_break':
    return <BreakOutButton />
  case 'clocked_out':
    return <CompletedButton />
}
```

### Display Break Times:
```typescript
attendance.breakIn.map((breakIn, index) => ({
  breakIn,
  breakOut: attendance.breakOut[index] || 'On break'
}))
```

## Error Messages

| Scenario | Error Message |
|----------|---------------|
| Already clocked in | "Already clocked in for today." |
| Not clocked in | "You have not clocked in yet." |
| Already clocked out | "Already clocked out for today." |
| Currently on break | "You are currently on break. Please end your break first." |
| Not on break | "You are not currently on break." |
| Break without clock in | "You must clock in before taking a break." |
| Break after clock out | "Cannot take break after clocking out." |
| Already on break | "You are already on break." |

## Configuration

To change standard times, edit in `AttendanceController.php`:
```php
const STANDARD_CLOCK_OUT = '18:00:00';  // Change default clock out time
const STANDARD_BREAK_OUT = '18:00:00';  // Change default break out time
```

## Summary

✅ Tracks multiple breaks per day in JSON arrays
✅ Enforces strict sequence: clock_in → break_in → break_out → clock_out
✅ Validates all actions prevent invalid states
✅ Auto-completes incomplete attendance from previous day
✅ Provides clear error messages for all scenarios
✅ Model helper methods for easy status checking
