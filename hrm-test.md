# HRM Module - Manual Testing Guide

**For:** Beginner, Non-Technical Testers
**Purpose:** Step-by-step guide to test Human Resource Management (HRM) module
**System:** Hook & Hunt ERP Admin Panel

---

## How to Use This Guide

1. **Read Before Doing:** Read each step completely before clicking anything
2. **Take Your Time:** There is no rush. Go at your own pace
3. **Check Results:** After each action, verify what you see
4. **Fill Test Report:** Use the test report table at the end to record your results
5. **Test Different Roles:** Test with different user roles as instructed

---

## Testing Accounts Needed

Before starting, you need access to these test accounts:

| Role | Username | Password | For Testing |
|------|-----------|-----------|-------------|
| Super Admin | | | All features, everything should work |
| Admin | | | Most features, can manage departments and staff |
| Staff/Employee | | | Can view own profile, attendance, apply for leave |

*Ask your developer to provide these test accounts if not available.*

---

## Module 1: HRM Dashboard

**Path:** After login, click "HRM" in the left sidebar

**Goal:** Verify the main HRM overview displays correctly with all statistics, charts, and quick navigation buttons work.

### What to Check on Dashboard

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Look at top section | Should see 4 stat cards | |
| 2 | Check "Total Staff" card | Shows total number of staff | |
| 3 | Check "Today's Attendance" card | Shows count and percentage | |
| 4 | Check "On Leave" card | Shows number of staff on leave | |
| 5 | Check "Departments" card | Shows total department count | |
| 6 | Look at "Staff by Department" | Shows bar chart of staff per department | |
| 7 | Look at "Leave Summary" | Shows pending, approved, rejected counts | |
| 8 | Look at "Attendance Details" | Shows present, absent, late counts | |
| 9 | Look at "Recent Hires" | Shows newly added staff | |
| 10 | Look at "Upcoming Leaves" | Shows approved leaves coming up | |
| 11 | Look at "Payroll Overview" | Shows this month payroll and total paid | |
| 12 | Check "Quick Actions" buttons | 6 buttons to main HRM sections | |

**Notes:**
- All cards should show numbers, not zeros or dashes
- Bar charts should be visible
- Buttons should be clickable

---

## Module 2: Departments Management

**Path:** HRM → Departments

**Goal:** Test creating, viewing, editing, and deleting company departments. Verify that permissions work correctly - only admins should manage departments.

### Test 2.1: View Department List

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click "Departments" in sidebar | Department page opens | ✓ | ✓ | ✓ |
| 2 | Look at stats cards (top) | 3 cards: Total, Active, Employees | ✓ | ✓ | ✓ |
| 3 | Look at table (desktop) | Columns: Name, Employees, Status, Created, Actions | ✓ | ✓ | ✓ |
| 4 | Look at card view (mobile) | Department info in cards | ✓ | ✓ | ✓ |
| 5 | Check search box | Search input visible | ✓ | ✓ | ✓ |

**Status Check:** Can you see departments page?

### Test 2.2: Create New Department

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click "Add Department" button | Modal window opens | ✓ | ✓ | ✗ |
| 2 | Enter name (e.g., "Test Dept") | Name appears in input | ✓ | ✓ | ✗ |
| 3 | Check "Active" toggle | Should be ON by default | ✓ | ✓ | - |
| 4 | Click "Create Department" | Success message, modal closes | ✓ | ✓ | - |
| 5 | Verify in list | New department appears | ✓ | ✓ | - |

**Permission Check:** Staff should NOT see "Add Department" button

### Test 2.3: Edit Department

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click pencil icon on department | Modal opens with details | ✓ | ✓ | ✗ |
| 2 | Change the name | New name appears | ✓ | ✓ | - |
| 3 | Toggle Active status | Status changes | ✓ | ✓ | - |
| 4 | Click "Update Department" | Saves and closes modal | ✓ | ✓ | - |
| 5 | Verify change in list | Updated info shows | ✓ | ✓ | - |

### Test 2.4: Delete Department

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click trash on department (0 employees) | Confirm modal opens | ✓ | ✓ | ✗ |
| 2 | Confirm deletion | Department removed from list | ✓ | ✓ | - |
| 3 | Try deleting department WITH employees | Button disabled or warning shows | ✓ | ✓ | - |

**Permission Check:** Staff should NOT see delete buttons

### Test 2.5: Search Departments

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Type in search box | List filters as you type | |
| 2 | Type existing name | Department appears | |
| 3 | Type non-existing name | "No departments found" message | |

---

## Module 3: Staff Management

**Path:** HRM → Staff

**Goal:** Test managing employee records - creating new staff, viewing profiles, editing information, and deleting staff. Verify that regular staff can only edit their own profile.

### Test 3.1: View Staff List

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click "Staff" in sidebar | Staff page opens | ✓ | ✓ | ✓ |
| 2 | Look at stats cards | 4 cards: Total, Active, On Leave, Departments | ✓ | ✓ | ✓ |
| 3 | Look at table | Shows staff with info | ✓ | ✓ | ✓ |
| 4 | Check status badges | Active = green, Inactive = gray | ✓ | ✓ | ✓ |
| 5 | Check search box | Search input visible | ✓ | ✓ | ✓ |
| 6 | Check pagination (if many staff) | Page numbers at bottom | ✓ | ✓ | ✓ |

### Test 3.2: Search Staff

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Type staff name in search | List filters by name | |
| 2 | Type email/phone | List filters by typed text | |
| 3 | Clear search | All staff reappears | |

### Test 3.3: Create New Staff

| # | Step | Section | Field Name | What to Enter | Required? | Status |
|---|------|---------|-----------|--------------|----------|--------|
| 1 | Account Information | Full Name | "Test Staff" | Yes | |
| 2 | Account Information | Phone Number | "01712345678" | Yes | |
| 3 | Account Information | Personal Email | "test@example.com" | No | |
| 4 | Account Information | Role | Select from dropdown | Yes | |
| 5 | Personal Details | Gender | Select Male/Female/Other | No | |
| 6 | Personal Details | Date of Birth | Select date | No | |
| 7 | Personal Details | WhatsApp Number | "01712345678" | No | |
| 8 | Address Information | Address | "Test Address" | No | |
| 9 | Address Information | Division | Select from dropdown | No | |
| 10 | Address Information | District | Select from dropdown (enabled after division) | No | |
| 11 | Address Information | Thana | Select from dropdown (enabled after district) | No | |
| 12 | Official Information | Office Email | "test@company.com" | No | |
| 13 | Official Information | Office Email Password | "password123" | No | |
| 14 | Bank Account Info | Account Holder Name | "Test Staff" | No | |
| 15 | Bank Account Info | Bank Account Number | "1234567890" | No | |
| 16 | Bank Account Info | Bank Name | "Dutch-Bangla Bank" | No | |
| 17 | Bank Account Info | Branch Name | "Gulshan Branch" | No | |
| 18 | Professional Info | Department | Select from dropdown | Yes | |
| 19 | Professional Info | Designation | "Software Engineer" | Yes | |
| 20 | Professional Info | Joining Date | Select date | Yes | |
| 21 | Salary Information | Base Salary | "15000" | Yes | |
| 22 | Salary Information | House Rent | "5000" | No | |
| 23 | Salary Information | Medical Allowance | "2000" | No | |
| 24 | Salary Information | Conveyance Allowance | "2000" | No | |
| 25 | Salary Information | Overtime Hourly Rate | "200" | No | |
| 26 | Submit | Click "Create Staff" button | Success message, redirects to list | |

**Permission Check:** Only users with `hrm.staff.create` permission can see this page

### Test 3.4: View Staff Details

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click eye icon on any staff | Staff detail page opens | |
| 2 | Check personal info section | Shows name, phone, email, etc. | |
| 3 | Check professional info | Shows department, designation, joining date | |
| 4 | Check salary info | Shows base salary and allowances | |
| 5 | Check bank info | Shows bank account details | |

### Test 3.5: Edit Staff

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click pencil icon | Edit form opens | ✓ | ✓ | ✗ |
| 2 | Change any field | Field value updates | ✓ | ✓ | - |
| 3 | Click "Update Staff" | Changes save, form closes | ✓ | ✓ | - |
| 4 | Verify change in list | Updated info shows | ✓ | ✓ | - |

**Permission Check:** Staff can only edit their own profile

### Test 3.6: Delete Staff

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click trash icon (not yourself) | Confirm modal opens | ✓ | ✓ | ✗ |
| 2 | Confirm deletion | Staff removed from list | ✓ | ✓ | - |
| 3 | Try deleting yourself | Error "Cannot delete your own account" | ✓ | ✓ | ✓ |

---

## Module 4: Attendance Management

**Path:** HRM → Attendance

**Goal:** Test daily attendance tracking - clock in/out, taking breaks, viewing history. Verify that employees can only manage their own attendance while admins can manage everyone's.

### Test 4.1: Clock In (Start Work Day)

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Go to Attendance page | Page loads with today's attendance | |
| 2 | Look for "Clock In" button | Green button with clock icon | |
| 3 | Click "Clock In" button | Success message, button changes | |
| 4 | Check your status | Shows "PRESENT" with clock-in time | |
| 5 | Check today's card | Shows clock-in time, working hours | |

### Test 4.2: Take Break

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | After clock-in, click "Take Break" | Break note modal opens | |
| 2 | Enter break reason | Type in text area | |
| 3 | Click "Confirm" button | Screen dims with "You're on break" overlay | |
| 4 | Check break timer | Timer counts up continuously | |
| 5 | Click "End Break" button | Overlay disappears, break recorded | |

### Test 4.3: Clock Out (End Work Day)

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click "Clock Out" button | Records clock-out time | |
| 2 | Check status | Shows "COMPLETED" for today | |
| 3 | Check working hours | Should calculate total hours worked | |
| 4 | Check buttons | All buttons disabled for today | |

### Test 4.4: View Attendance History

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Look at date range selector | Shows Today, This Week, This Month, Custom | |
| 2 | Change to "This Week" | Table updates with week's data | |
| 3 | Look at table columns | Date, Clock In, Clock Out, Breaks, Working Hours, Status | |
| 4 | Check status colors | Present=green, Late=yellow, Absent=red, Leave=blue | |
| 5 | Check late indicator | If late, shows "Xm late" text | |

### Test 4.5: Filter Attendance (Admin Only)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Use status filter dropdown | Shows All, Present, Late, Absent, Leave, Holiday | ✓ | ✓ | Self only |
| 2 | Use employee filter | Can select any employee | ✓ | ✓ | Self only |
| 3 | Change date range | Table updates | ✓ | ✓ | ✓ |
| 4 | Click CSV button | Downloads CSV report | ✓ | ✓ | ✓ |
| 5 | Click PDF button | Opens print dialog | ✓ | ✓ | ✓ |

### Test 4.6: Edit Attendance (Admin Only)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click pencil icon on record | Edit modal opens | ✓ | ✓ | ✗ |
| 2 | Change clock in/out time | Values update | ✓ | ✓ | - |
| 3 | Change status | Can set to Present, Late, Absent, Leave, Holiday | ✓ | ✓ | - |
| 4 | Add note | Saves with record | ✓ | ✓ | - |
| 5 | Click "Update Attendance" | Changes save | ✓ | ✓ | - |

---

## Module 5: Leave Management

**Path:** HRM → Leaves

**Goal:** Test leave request workflow - employees apply for leave, admins approve/reject. Verify that staff can only apply for their own leave and cannot approve others' requests.

### Test 5.1: View Leave Requests

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click "Leaves" in sidebar | Leave list page opens | |
| 2 | Look at stats cards | Total, Pending, Approved, Rejected | |
| 3 | Look at table | Shows leave requests | |
| 4 | Check status badges | Pending=yellow, Approved=green, Rejected=red | |
| 5 | Check filters | Can filter by status | |

### Test 5.2: Apply for Leave (Staff)

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click "Apply for Leave" button | Leave form modal opens | |
| 2 | Select leave type | Choose from dropdown | |
| 3 | Select start and end date | Dates populate | |
| 4 | Check total days | Auto-calculates | |
| 5 | Enter reason | Type why you need leave | |
| 6 | Click "Create Leave Request" | Success message, request in list | |

### Test 5.3: Create Leave for Employee (Admin)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click "Add Leave" button | Modal opens | ✓ | ✓ | As self |
| 2 | Select employee dropdown | Shows all staff | ✓ | ✓ | Self only |
| 3 | Fill leave details | Same as Test 5.2 | ✓ | ✓ | - |
| 4 | Click "Create Leave Request" | Leave created for selected employee | ✓ | ✓ | - |

### Test 5.4: Approve Leave Request (Admin)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click green checkmark on pending leave | Approval modal opens | ✓ | ✓ | ✗ |
| 2 | Enter approval note | Required field | ✓ | ✓ | - |
| 3 | Click "Approve Leave" | Status changes to Approved | ✓ | ✓ | - |
| 4 | Check approved by column | Shows admin name | ✓ | ✓ | - |

### Test 5.5: Reject Leave Request (Admin)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click red X on pending leave | Rejection modal opens | ✓ | ✓ | ✗ |
| 2 | Enter rejection reason | Required field | ✓ | ✓ | - |
| 3 | Click "Reject Leave" | Status changes to Rejected | ✓ | ✓ | - |
| 4 | Check admin note | Shows rejection reason | ✓ | ✓ | - |

### Test 5.6: Filter Leaves

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Use status filter | Can filter by All, Pending, Approved, Rejected | |
| 2 | Use employee filter (admin) | Can filter by specific employee | |

---

## Module 6: Payroll Management

**Path:** HRM → Payroll

**Goal:** Test salary payment workflow - generating monthly payroll, editing amounts, processing payments, and viewing salary slips. Verify that only admins can generate and process payroll.

### Test 6.1: View Payroll List

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click "Payroll" in sidebar | Payroll page opens | |
| 2 | Look at stats cards | Total Records, Total Net Payable, Paid, Pending, Processing | |
| 3 | Look at month selector | Shows current month (YYYY-MM) | |
| 4 | Look at table | Employee, salary components, net payable, status | |
| 5 | Check status colors | Generated=orange, Processing=yellow, Paid=green | |

### Test 6.2: Generate Payroll (Admin)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Select month | Month dropdown shows selection | ✓ | ✓ | - |
| 2 | Click "Generate" button | Confirmation modal opens | ✓ | ✓ | ✗ |
| 3 | Click "Generate" in modal | Records created for all active staff | ✓ | ✓ | - |
| 4 | Check new records | Status shows "Generated" | ✓ | ✓ | - |
| 5 | Check calculation | Net = Basic + House Rent + Medical + Conveyance + Overtime + Bonus | ✓ | ✓ | - |

### Test 6.3: Edit Payroll (Before Payment)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click pencil icon on "Generated" payroll | Edit modal opens | ✓ | ✓ | ✗ |
| 2 | Check read-only fields | Name, Basic Salary, Overtime Rate are read-only | ✓ | ✓ | - |
| 3 | Change House Rent amount | Input accepts new value | ✓ | ✓ | - |
| 4 | Change Medical Allowance | Input accepts new value | ✓ | ✓ | - |
| 5 | Change Conveyance Allowance | Input accepts new value | ✓ | ✓ | - |
| 6 | Change Overtime Hours | Input accepts new value | ✓ | ✓ | - |
| 7 | Change Bonus | Input accepts new value | ✓ | ✓ | - |
| 8 | Change Deductions | Input accepts new value | ✓ | ✓ | - |
| 9 | Check Net Payable | Updates in real-time | ✓ | ✓ | - |
| 10 | Click "Save Changes" | Changes save, modal closes | ✓ | ✓ | - |

### Test 6.4: Process Single Payment

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click green checkmark on payroll | Payment modal opens | ✓ | ✓ | ✗ |
| 2 | Check employee details | Name, amount, month shown correctly | ✓ | ✓ | - |
| 3 | Select bank account | Choose bank to pay from | ✓ | ✓ | - |
| 4 | Click "Confirm Payment" | Success message, status becomes "Paid" | ✓ | ✓ | - |
| 5 | Check payment date | Today's date appears | ✓ | ✓ | - |

### Test 6.5: Generate Salary Sheet (Bulk Payment)

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click "Salary Sheet (X)" button | Salary sheet modal opens | ✓ | ✓ | ✗ |
| 2 | Check summary | Employee count and total amount shown | ✓ | ✓ | - |
| 3 | Select bank account | Choose bank to transfer from | ✓ | ✓ | - |
| 4 | Enter company name | Required field | ✓ | ✓ | - |
| 5 | Enter proprietor name | Required field | ✓ | ✓ | - |
| 6 | Click "Generate Salary Sheet" | Bank letter preview opens | ✓ | ✓ | - |
| 7 | Check bank letter | Employee table with accounts and amounts | ✓ | ✓ | - |
| 8 | Click "Confirm Payment" | All payrolls status become "Paid" | ✓ | ✓ | - |
| 9 | Check bank balance | Should decrease by total amount | ✓ | ✓ | - |

### Test 6.6: View Salary Slip

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click eye icon on any payroll | Salary slip modal opens | |
| 2 | Check employee info | Name, designation, department, period | |
| 3 | Check earnings section | Lists all salary components | |
| 4 | Check deductions section | Shows deductions if any | |
| 5 | Check net payable | Large, prominent amount | |
| 6 | Click "Print" button | Print dialog opens | |

---

## Module 7: Roles & Permissions

**Path:** HRM → Roles

**Goal:** Test role management - viewing, archiving, restoring, and deleting user roles. Verify that protected system roles cannot be deleted and only super admins can manage roles.

### Test 7.1: View Roles List

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Click "Roles" in sidebar | Roles page opens | |
| 2 | Check tabs | "Active Roles" and "Archived" tabs | |
| 3 | Look at table | Position, Role, Slug, Users, Actions | |
| 4 | Check protected roles | Super Admin, Supplier, Customer marked "PROTECTED" | |

### Test 7.2: Search Roles

| # | Step | Action | Expected Result | Status |
|---|------|--------|----------------|--------|
| 1 | Type in search box | List filters as you type | |
| 2 | Clear search | All roles reappear | |

### Test 7.3: Archive Role

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Click menu on non-protected role | Dropdown opens | ✓ | ✓ | ✗ |
| 2 | Click "Archive Role" | Confirmation modal opens | ✓ | ✓ | - |
| 3 | Check warning if role has users | Warns about user count | ✓ | ✓ | - |
| 4 | Confirm archive | Role moves to "Archived" tab | ✓ | ✓ | - |

### Test 7.4: Restore Role

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | Switch to "Archived" tab | Shows archived roles | ✓ | ✓ | ✗ |
| 2 | Click menu on role | Dropdown opens | ✓ | ✓ | - |
| 3 | Click "Restore Role" | Confirmation modal opens | ✓ | ✓ | - |
| 4 | Confirm restore | Role moves back to "Active" tab | ✓ | ✓ | - |

### Test 7.5: Delete Role Permanently

| # | Step | Action | Expected Result | Super Admin | Admin | Staff |
|---|------|--------|----------------|------------|-------|-------|
| 1 | On archived role, open menu | Dropdown shows delete option | ✓ | ✓ | ✗ |
| 2 | Click "Delete Permanently" | Confirmation modal opens | ✓ | ✓ | - |
| 3 | Confirm delete | Role permanently removed | ✓ | ✓ | - |

---

## Module 8: Cross-Module Features

**Goal:** Test features that work across multiple modules - navigation between pages, permission controls, and responsive design on different screen sizes.

### Test 8.1: Navigation

| # | From | To | Action | Expected Result | Status |
|---|------|-------|--------|----------------|--------|
| 1 | Dashboard | HRM Dashboard | Click HRM in sidebar | HRM dashboard opens | |
| 2 | HRM Dashboard | Staff | Click "Staff" quick action | Staff list opens | |
| 3 | Staff | Create Staff | Click "Add Staff" button | Create form opens | |
| 4 | Staff | Departments | Use breadcrumb or sidebar | Departments page opens | |

### Test 8.2: Permissions Testing

**Test each feature with different roles:**

| Feature | Super Admin | Admin | Staff | Notes |
|---------|-------------|-------|-------|-------|
| View HRM Dashboard | ✓ Should work | ✓ Should work | ✓ Should work |
| View Departments | ✓ Should work | ✓ Should work | ✓ Should work |
| Create Department | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Edit Department | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Delete Department | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| View All Staff | ✓ Should work | ✓ Should work | ✗ Sees ALL |
| Create Staff | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Edit Any Staff | ✓ Should work | ✓ Should work | ✗ Only self |
| Delete Staff | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| View All Attendance | ✓ Should work | ✓ Should work | ✗ Only self |
| Edit Attendance | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Create Leave for Others | ✓ Should work | ✓ Should work | ✗ Only self |
| Approve/Reject Leave | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Generate Payroll | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Process Payment | ✓ Should work | ✓ Should work | ✗ Should NOT work |
| Manage Roles | ✓ Should work | ✗ Should NOT work | ✗ Should NOT work |

### Test 8.3: Responsive Design

| Screen Size | Check | Expected Result | Status |
|------------|-------|----------------|--------|
| Desktop (>768px) | Table view | Table shows all columns | |
| Tablet (768px) | Table view | Table visible, may scroll | |
| Mobile (<768px) | Card view | Cards replace table | |
| Small mobile | Navigation | Sidebar hamburger menu | |

---

## Final Test Report

After completing all tests, fill out this report:

### Tester Information

| Field | Value |
|-------|-------|
| Tester Name | |
| Testing Date | |
| Browser Used | |
| Device Used | |
| Overall Rating | ⭐⭐⭐⭐⭐ (1-5 stars) |

### Module Results

| Module | Total Tests | Passed | Failed | Issues |
|--------|-------------|--------|--------|--------|
| HRM Dashboard | 12 | | | |
| Departments | 15 | | | |
| Staff | 26 | | | |
| Attendance | 23 | | | |
| Leaves | 18 | | | |
| Payroll | 27 | | | |
| Roles | 10 | | |
| Cross-Module | 17 | | |
| **TOTAL** | **148** | | | |

### Issues Found

| # | Module | Test Case | Description | Severity | Status |
|---|--------|-----------|-------------|----------|--------|
| 1 | | | | Low/Med/High | Open/Fixed |
| 2 | | | | Low/Med/High | Open/Fixed |
| 3 | | | | Low/Med/High | Open/Fixed |
| 4 | | | | Low/Med/High | Open/Fixed |
| 5 | | | | Low/Med/High | Open/Fixed |

**Severity Guide:**
- **Low:** Visual issue, spelling mistake, doesn't affect function
- **Medium:** Feature works but has bugs, workaround exists
- **High:** Feature completely broken, no workaround possible

### Permissions Issues

| # | Role | Feature | Expected | Actual | Status |
|---|-------|---------|----------|--------|--------|
| 1 | Staff | Create Department | Should NOT see button | | |
| 2 | Staff | Delete Staff | Should NOT see button | | |
| 3 | Admin | Manage Roles | Should NOT see Roles menu | | |

### General Feedback

**What worked well:**
-

**What needs improvement:**
-

**Other comments or suggestions:**
-

---

## Quick Reference: Permission Checklist

Use this to verify permissions are working correctly:

| Permission | Where to Test | How to Verify |
|------------|--------------|---------------|
| `hrm.department.view` | Departments page | Page loads |
| `hrm.department.create` | Departments | "Add Department" button visible |
| `hrm.department.edit` | Departments | Pencil icon works |
| `hrm.department.delete` | Departments | Trash icon works |
| `hrm.staff.view` | Staff page | Page loads |
| `hrm.staff.create` | Staff | "Add Staff" button visible |
| `hrm.staff.edit` | Staff | Pencil icon works |
| `hrm.staff.delete` | Staff | Trash icon works |
| `hrm.attendance.view` | Attendance | Page loads |
| `hrm.attendance.edit` | Attendance | Pencil icon visible (admin) |
| `hrm.leave.create` | Leaves | "Apply for Leave" button works |
| `hrm.leave.approve` | Leaves | Approve/Reject buttons visible |
| `hrm.payroll.view` | Payroll | Page loads |
| `hrm.payroll.process` | Payroll | Generate button works |
| `hrm.payroll.edit` | Payroll | Edit button works on Generated |
| `hrm.payroll.pay` | Payroll | Pay button works |
| `hrm.roles.view` | Roles | Page loads |
| `hrm.roles.create` | Roles | Add/Edit works |

---

## Tips for Testers

1. **Take Screenshots:** When you find a bug, take a screenshot
2. **Write Notes:** If something seems confusing, write it down
3. **Don't Panic:** If something breaks, just document it
4. **Be Thorough:** Test each feature, don't skip steps
5. **Ask Questions:** If you're unsure about something, ask
6. **Trust Your Instincts:** If something seems wrong, it probably is

---

**Thank you for testing the HRM module!** Your feedback helps improve the system.
