# Permission System - Quick Reference

## 🚀 Quick Setup for New Module

### 1. Add to `fr_permissions.ts`:
```typescript
{
  group: "Your Module Group",
  modules: [{
    name: "Your Module",
    permissions: [
      { label: "View [Module]", key: "module_view", slug: 'module.index' },
      { label: "Create [Module]", key: "module_create", slug: 'module.create' },
      { label: "Edit [Module]", key: "module_edit", slug: 'module.edit' },
      { label: "Delete [Module]", key: "module_delete", slug: 'module.delete' }
    ]
  }]
}
```

### 2. Seed to Database:
```bash
php artisan tinker --execute="
\$perm = App\Models\Permission::firstOrCreate(
    ['slug' => 'module.index'],
    [
        'name' => 'View Module',
        'key' => 'module_view',
        'group_name' => 'Module Group',
        'module_name' => 'Your Module'
    ]
);
// Repeat for create, edit, delete
"
```

### 3. Assign to Role:
```bash
# Via frontend: http://localhost:5173/roles/9/edit
# Check the permission boxes and save
```

### 4. Add Frontend Check:
```typescript
import { usePermissions } from '@/hooks/usePermissions'
const { hasPermission } = usePermissions()

// Page level
useEffect(() => {
  if (!hasPermission('module.index')) {
    notifications.show({ title: 'Access Denied', color: 'red' })
    return
  }
  fetchData()
}, [])

// Buttons
{hasPermission('module.create') && <Button>Create</Button>}
```

---

## ✅ Permission Checklist

- [ ] Added to `fr_permissions.ts`
- [ ] Seeded to database
- [ ] Assigned to role
- [ ] Frontend checks added
- [ ] Backend middleware added
- [ ] Tested with user
- [ ] Tested without permission

---

## 🎯 Standard CRUD Permissions

| Action | Slug | Key | Use Case |
|--------|------|-----|----------|
| View List | `module.index` | `module_view` | Show list page |
| Create | `module.create` | `module_create` | Add button |
| Edit | `module.edit` | `module_edit` | Edit button |
| Delete | `module.delete` | `module_delete` | Delete button |
| View Details | `module.view` | `module_view` | View single item |

---

## 🔧 Common Permission Patterns

### Pattern 1: Basic CRUD
```
module.index, module.create, module.edit, module.delete
```

### Pattern 2: With Approval
```
module.index, module.create, module.approve, module.reject, module.cancel
```

### Pattern 3: Data Import/Export
```
module.index, module.create, module.edit, module.delete,
module.export, module.import
```

### Pattern 4: Full Workflow
```
module.index, module.create, module.edit, module.delete,
module.approve, module.reject, module.process, module.export
```

---

## 💻 Frontend Templates

### Import Hook:
```typescript
import { usePermissions } from '@/hooks/usePermissions'
const { hasPermission } = usePermissions()
```

### Page Check:
```typescript
useEffect(() => {
  if (!hasPermission('module.index')) return
  fetchData()
}, [])
```

### Button Check:
```typescript
{hasPermission('module.create') && <Button>Create</Button>}
```

### Action Buttons:
```typescript
{(hasPermission('module.view') || hasPermission('module.index')) && <ViewIcon />}
{hasPermission('module.edit') && <EditIcon />}
{hasPermission('module.delete') && <DeleteIcon />}
```

### Own Profile Exception:
```typescript
{(hasPermission('module.edit') || item.id === currentUser?.id) && <EditIcon />}
```

---

## 🗄️ Database Commands

### Check User Permissions:
```bash
php artisan tinker --execute="
\$user = App\Models\User::find(USER_ID);
echo \$user->role->permissions->pluck('slug')->implode(', ');
"
```

### Add Permission to Role:
```bash
php artisan tinker --execute="
\$role = App\Models\Role::find(ROLE_ID);
\$perm = App\Models\Permission::where('slug', 'module.index')->first();
\$role->permissions()->attach(\$perm->id);
"
```

### Check Specific Permission:
```bash
php artisan tinker --execute="
\$user = App\Models\User::find(USER_ID);
\$has = \$user->role->permissions->contains('slug', 'module.index');
echo \$has ? 'Has permission' : 'No permission';
"
```

---

## 🌐 API Testing

### Test with Token:
```bash
curl -X GET "http://localhost:8000/api/v2/module" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Accept: application/json"
```

### Expected Response:
- **200 OK** - Has permission ✅
- **403 Forbidden** - No permission ❌

---

## 🐛 Troubleshooting

### Issue: "Permission Denied"
**Check:**
1. Permission exists in database?
2. Permission assigned to role?
3. Token valid?
4. Correct slug in check?

### Issue: Buttons Not Showing
**Check:**
1. `usePermissions` imported?
2. `hasPermission()` called correctly?
3. Permission slug matches exactly?
4. `/auth/me` returns permissions?

### Issue: All Users Can Access
**Check:**
1. Backend middleware applied?
2. Route protected?
3. Middleware name correct?

---

## 📋 Module-Level Permission

For high-level module access:

**Permission:** `module.manage` (e.g., `hrm.manage`)

**Usage:**
```php
// routes/api.php
Route::group(['middleware' => ['permission:hrm.manage']], function() {
  Route::apiResource('employees', 'EmployeeController');
  Route::apiResource('departments', 'DepartmentController');
});
```

This gives access to ALL HRM routes with one permission.

---

## 🎨 Naming Convention

**Slug Format:** `{resource}.{action}`
- `employee.index`
- `product.create`
- `order.delete`
- `leave.approve`

**Key Format:** `{resource}_{action}`
- `employee_index`
- `product_create`
- `order_delete`
- `leave_approve`

**Actions:** index, create, edit, delete, view, approve, reject, cancel, process, export, import, assign, ban

---

## ✨ Tips

1. **Start simple:** Add basic CRUD first, extend later
2. **Test often:** Check after each permission added
3. **Be consistent:** Follow naming convention
4. **Document:** Add comments for special logic
5. **Use roles:** Group permissions by role (Manager, Admin, etc.)
6. **Think UX:** What should this user see/do?
7. **Test both:** Test with permission AND without
8. **Check logs:** Browser console & network tab
9. **Refresh tokens:** After permission changes
10. **Backup first:** Before bulk permission changes

---

**Need Help?** See: `PERMISSION_SYSTEM_GUIDE.md`
