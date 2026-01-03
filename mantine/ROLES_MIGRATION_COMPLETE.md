# Roles & Permissions API Migration - Complete ✅

## Summary

**All role and permission management endpoints have been migrated from `/system/*` to `/hrm/*`**

---

## Backend Routes (api.php)

**All routes under:** `/api/v2/hrm/`

### Roles
```
GET    /api/v2/hrm/roles                      → List all roles
POST   /api/v2/hrm/roles                      → Create role
GET    /api/v2/hrm/roles/{id}                 → Get role details
PUT    /api/v2/hrm/roles/{id}                 → Update role
DELETE /api/v2/hrm/roles/{id}                 → Delete role
GET    /api/v2/hrm/roles/{id}/permissions     → Get role permissions
POST   /api/v2/hrm/roles/{id}/sync-permissions → Sync role permissions
```

### Permissions
```
GET    /api/v2/hrm/permissions                → List all permissions
POST   /api/v2/hrm/permissions                → Create permission
```

**Permission Required:** `hrm.manage`

---

## Frontend Files Updated

### ✅ Settings Module

| File | Changes |
|------|---------|
| `/admin/settings/roles/page.tsx` | `GET /system/roles` → `GET /hrm/roles`<br>`DELETE /system/roles/{id}` → `DELETE /hrm/roles/{id}` |
| `/admin/settings/permissions/page.tsx` | `GET /system/permissions` → `GET /hrm/permissions` |

### ✅ Roles Management Module

| File | Changes |
|------|---------|
| `/admin/roles/create/page.tsx` | `GET /system/permissions` → `GET /hrm/permissions`<br>`POST /system/roles` → `POST /hrm/roles` |
| `/admin/roles/edit/[id]/page.tsx` | `GET /system/roles/{id}` → `GET /hrm/roles/{id}`<br>`GET /system/permissions` → `GET /hrm/permissions`<br>`PUT /system/roles/{id}` → `PUT /hrm/roles/{id}`<br>`POST /system/roles/{id}/sync-permissions` → `POST /hrm/roles/{id}/sync-permissions` |

### ✅ HRM Module

| File | Changes |
|------|---------|
| `/admin/hrm/employees/create/page.tsx` | `GET /user-management/roles` → `GET /hrm/roles` |
| `/admin/hrm/employees/[id]/edit/page.tsx` | `GET /user-management/roles` → `GET /hrm/roles`<br>`GET /user-management/permissions` → `GET /hrm/permissions` |

---

## Verification Results

### Before Migration
```bash
❌ /system/roles
❌ /system/permissions
❌ /user-management/roles (in HRM context)
❌ /user-management/permissions (in HRM context)
```

### After Migration
```bash
✅ /hrm/roles
✅ /hrm/permissions
✅ No more /system/roles or /system/permissions calls
✅ HRM-specific pages now use /hrm/ endpoints
```

---

## API Endpoint Mapping

| Old Endpoint | New Endpoint | Status |
|--------------|--------------|--------|
| `GET /api/v2/system/roles` | `GET /api/v2/hrm/roles` | ✅ Migrated |
| `POST /api/v2/system/roles` | `POST /api/v2/hrm/roles` | ✅ Migrated |
| `GET /api/v2/system/roles/{id}` | `GET /api/v2/hrm/roles/{id}` | ✅ Migrated |
| `PUT /api/v2/system/roles/{id}` | `PUT /api/v2/hrm/roles/{id}` | ✅ Migrated |
| `DELETE /api/v2/system/roles/{id}` | `DELETE /api/v2/hrm/roles/{id}` | ✅ Migrated |
| `GET /api/v2/system/permissions` | `GET /api/v2/hrm/permissions` | ✅ Migrated |
| `POST /api/v2/system/permissions` | `POST /api/v2/hrm/permissions` | ✅ Migrated |
| `POST /api/v2/system/roles/{id}/sync-permissions` | `POST /api/v2/hrm/roles/{id}/sync-permissions` | ✅ Migrated |
| `GET /api/v2/system/roles/{id}/permissions` | `GET /api/v2/hrm/roles/{id}/permissions` | ✅ Migrated |

---

## Permission Requirements

### Access Control
- **Required Permission:** `hrm.manage`
- **Role 7 (Admin):** ✅ Has permission
- **Role 1 (Super Admin):** ✅ Has all permissions (God Mode)

### User Action Required
⚠️ **Important:** Users must **log out and log back in** to get fresh authentication tokens with updated permissions!

---

## Files Modified Summary

**Total Files Updated:** 7

1. `/admin/settings/roles/page.tsx` - 2 changes
2. `/admin/settings/permissions/page.tsx` - 1 change
3. `/admin/roles/create/page.tsx` - 2 changes
4. `/admin/roles/edit/[id]/page.tsx` - 4 changes
5. `/admin/hrm/employees/create/page.tsx` - 1 change
6. `/admin/hrm/employees/[id]/edit/page.tsx` - 2 changes
7. `HRM_API_ENDPOINTS.md` - Updated documentation

**Total API Call Updates:** 12 endpoints across 7 files

---

## Testing Checklist

### Frontend Pages
- [ ] `/admin/settings/roles` - View roles list
- [ ] `/admin/settings/permissions` - View permissions list
- [ ] `/admin/roles/create` - Create new role
- [ ] `/admin/roles/edit/{id}` - Edit existing role
- [ ] `/admin/hrm/employees/create` - Create employee (dropdown should load roles)
- [ ] `/admin/hrm/employees/{id}/edit` - Edit employee (dropdowns should load roles/permissions)

### API Endpoints to Test
- [ ] `GET /api/v2/hrm/roles`
- [ ] `POST /api/v2/hrm/roles`
- [ ] `GET /api/v2/hrm/roles/{id}`
- [ ] `PUT /api/v2/hrm/roles/{id}`
- [ ] `DELETE /api/v2/hrm/roles/{id}`
- [ ] `GET /api/v2/hrm/permissions`
- [ ] `POST /api/v2/hrm/roles/{id}/sync-permissions`

### Authentication
- [ ] Log out and log back in with a user that has `hrm.manage` permission
- [ ] Verify token includes updated permissions

---

## Migration Complete ✅

All role and permission management endpoints now correctly point to `/api/v2/hrm/*` instead of `/api/v2/system/*`.

**The frontend is now fully aligned with the updated backend route structure!**
