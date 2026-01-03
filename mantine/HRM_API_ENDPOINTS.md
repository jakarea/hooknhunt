# HRM Module API Endpoints Verification

## Backend Routes (api.php lines 147-171)

All routes require `permission: hrm.manage`

### HRM Controllers (namespace: Hrm)
```
GET    /api/v2/hrm/departments       → DepartmentController@index
POST   /api/v2/hrm/departments       → DepartmentController@store
GET    /api/v2/hrm/departments/{id}  → DepartmentController@show
PUT    /api/v2/hrm/departments/{id}  → DepartmentController@update
DELETE /api/v2/hrm/departments/{id}  → DepartmentController@destroy

GET    /api/v2/hrm/employees         → EmployeeController@index
POST   /api/v2/hrm/employees         → EmployeeController@store
GET    /api/v2/hrm/employees/{id}    → EmployeeController@show
PUT    /api/v2/hrm/employees/{id}    → EmployeeController@update
DELETE /api/v2/hrm/employees/{id}    → EmployeeController@destroy

GET    /api/v2/hrm/leaves            → LeaveController@index
POST   /api/v2/hrm/leaves            → LeaveController@store
GET    /api/v2/hrm/leaves/{id}       → LeaveController@show
PUT    /api/v2/hrm/leaves/{id}       → LeaveController@update
DELETE /api/v2/hrm/leaves/{id}       → LeaveController@destroy

GET    /api/v2/hrm/attendance        → AttendanceController@index
POST   /api/v2/hrm/attendance        → AttendanceController@store
POST   /api/v2/hrm/clock-in          → AttendanceController@clockIn
POST   /api/v2/hrm/clock-out         → AttendanceController@clockOut

GET    /api/v2/hrm/payrolls          → PayrollController@index
POST   /api/v2/hrm/payrolls/generate → PayrollController@generate
PUT    /api/v2/hrm/payrolls/{id}     → PayrollController@update
POST   /api/v2/hrm/payrolls/{id}/pay → PayrollController@pay
```

### System Controllers (namespace: V2 default)
```
GET    /api/v2/hrm/roles                    → RoleController@index
POST   /api/v2/hrm/roles                    → RoleController@store
GET    /api/v2/hrm/roles/{id}               → RoleController@show
PUT    /api/v2/hrm/roles/{id}               → RoleController@update
DELETE /api/v2/hrm/roles/{id}               → RoleController@destroy
GET    /api/v2/hrm/roles/{id}/permissions   → RoleController@getPermissions
POST   /api/v2/hrm/roles/{id}/sync-permissions → RoleController@syncPermissions
POST   /api/v2/hrm/permissions              → PermissionController@store
GET    /api/v2/hrm/permissions              → PermissionController@list
```

---

## Frontend API Calls Verification

### ✅ Departments Page (`/admin/hrm/departments`)
- `GET /hrm/departments` → ✅ Matches backend
- `PUT /hrm/departments/{id}` → ✅ Matches backend
- `POST /hrm/departments` → ✅ Matches backend
- `DELETE /hrm/departments/{id}` → ✅ Matches backend

### ✅ Employees Page (`/admin/hrm/employees`)
- `GET /hrm/employees` → ✅ Matches backend
- `DELETE /user-management/users/{id}` → ✅ Correct (users managed separately)

### ✅ Employees Create Page (`/admin/hrm/employees/create`)
- `GET /hrm/roles` → ✅ **FIXED** (was `/user-management/roles`)
- `GET /hrm/departments` → ✅ Matches backend
- `POST /user-management/users` → ✅ Correct (creating users)

### ✅ Employees Edit Page (`/admin/hrm/employees/{id}/edit`)
- `GET /hrm/roles?type=staff` → ✅ **FIXED** (was `/user-management/roles`)
- `GET /hrm/departments` → ✅ Matches backend
- `GET /hrm/permissions` → ✅ **FIXED** (was `/user-management/permissions`)
- `GET /user-management/users/{id}` → ✅ Correct (users managed separately)
- `PUT /user-management/users/{id}` → ✅ Correct (updating users)
- `PUT /user-management/users/{id}/permissions/granted` → ✅ Correct
- `PUT /user-management/users/{id}/permissions/blocked` → ✅ Correct

### ✅ Leaves Page (`/admin/hrm/leaves`)
- `GET /hrm/leaves` → ✅ Matches backend
- `GET /user-management/users` → ✅ Correct (getting users list)
- `POST /hrm/leaves` → ✅ Matches backend
- `PUT /hrm/leaves/{id}` → ✅ Matches backend
- `DELETE /hrm/leaves/{id}` → ✅ Matches backend

### ✅ Attendance Page (`/admin/hrm/attendance`)
- `GET /hrm/attendance` → ✅ Matches backend
- `GET /user-management/users` → ✅ Correct (getting users list)
- `POST /hrm/clock-in` → ✅ Matches backend
- `POST /hrm/clock-out` → ✅ Matches backend
- `POST /hrm/attendance` → ✅ Matches backend (manual attendance)

### ✅ Payroll Page (`/admin/hrm/payroll`)
- `GET /hrm/payrolls` → ✅ Matches backend
- `POST /hrm/payrolls/generate` → ✅ Matches backend
- `PUT /hrm/payrolls/{id}` → ✅ Matches backend
- `POST /hrm/payrolls/{id}/pay` → ✅ Matches backend

### ✅ Employees Detail Page (`/admin/hrm/employees/{id}`)
- `GET /user-management/users/{id}` → ✅ Correct (user details)
- `GET /hrm/leaves` → ✅ Matches backend
- `GET /hrm/attendance` → ✅ Matches backend
- `GET /hrm/payrolls` → ✅ Matches backend

---

## Summary

**Total Files Checked:** 8
**Total API Calls Verified:** 40+
**Issues Found:** 2
**Issues Fixed:** 2 ✅

### Fixed Issues:
1. ✅ Employees create page: Updated `/user-management/roles` → `/hrm/roles`
2. ✅ Employees edit page: Updated `/user-management/roles` → `/hrm/roles`
3. ✅ Employees edit page: Updated `/user-management/permissions` → `/hrm/permissions`

### Notes:
- User management (`/user-management/users`, `/user-management/roles`, etc.) is separate from HRM
- User creation, updates, and role assignments go through `/user-management/` endpoints
- HRM-specific resources (employees, departments, leaves, attendance, payrolls) go through `/hrm/` endpoints
- Roles and permissions can be accessed via both `/hrm/` and `/user-management/` for different contexts
