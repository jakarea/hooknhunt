# 🚀 Sustainable Permission System - Documentation

## Overview

This is a **centralized, maintainable permission system** for the entire application. All permission configurations are in one place, making it easy to manage and scale.

**✨ SPECIAL FEATURE: Self-Profile Access**
Users can always view and edit their own profile without needing any special permissions!

---

## 📁 File Structure

```
src/
├── config/
│   └── permissions.ts              # ⭐ Central permission configuration
├── hooks/
│   └── usePermissions.ts           # Hook with auto-refresh + self-profile
├── components/
│   ├── permission-guard.tsx        # Declarative permission wrapper + SelfProfileGuard
│   ├── protected-button.tsx        # Pre-built protected button
│   └── app-sidebar-mantine.tsx     # Sidebar using the system
└── stores/
    └── authStore.ts                # Auth state management
```

---

## 🎯 How to Add New Routes (3 Steps)

### Step 1: Add Permission to Config
**File:** `src/config/permissions.ts`

```typescript
export const PERMISSION_CONFIG = {
  // Add your module here
  myNewModule: {
    index: 'myModule.index',
    create: 'myModule.create',
    edit: 'myModule.edit',
    delete: 'myModule.delete',
  },
}
```

### Step 2: Add Route Mapping
**File:** `src/config/permissions.ts`

```typescript
export const ROUTE_PERMISSIONS: Record<string, string> = {
  // Add your routes here
  '/admin/my-new-module': PERMISSION_CONFIG.myNewModule.index,
  '/admin/my-new-module/create': PERMISSION_CONFIG.myNewModule.create,
}
```

### Step 3: Done! ✅
The sidebar will automatically show/hide based on permissions. No need to modify sidebar or individual components.

---

## 💡 Usage Examples

### 1. Using `usePermissions` Hook

```typescript
import { usePermissions } from '@/hooks/usePermissions'

function MyComponent() {
  const { hasPermission, canAccessRoute, refreshPermissions } = usePermissions()

  // Check single permission
  if (hasPermission('employee.create')) {
    return <Button>Create Employee</Button>
  }

  // Check multiple permissions (needs any)
  if (hasPermission(['employee.edit', 'employee.delete'])) {
    return <ActionButtons />
  }

  // Check if user can access a route
  if (canAccessRoute('/admin/hrm/payroll')) {
    return <Link to="/admin/hrm/payroll">Payroll</Link>
  }

  // Refresh permissions from API (no logout needed!)
  const handleRefresh = () => {
    refreshPermissions()
  }

  return null
}
```

### 2. Using `PermissionGuard` Component

```typescript
import { PermissionGuard } from '@/components/permission-guard'

// Single permission
<PermissionGuard permission="employee.create">
  <Button onClick={handleCreate}>Create Employee</Button>
</PermissionGuard>

// Multiple permissions (user needs any)
<PermissionGuard
  permissions={['employee.edit', 'employee.delete']}
  fallback={<Text>Access Denied</Text>}
>
  <Group>
    <Button>Edit</Button>
    <Button color="red">Delete</Button>
  </Group>
</PermissionGuard>

// Multiple permissions (user needs ALL)
<PermissionGuard
  permissions={['payroll.edit', 'payroll.approve']}
  requireAll={true}
>
  <Button>Process Payroll</Button>
</PermissionGuard>
```

### 3. Using Pre-built Helper Components

```typescript
import {
  CanCreateEmployee,
  CanEditEmployee,
  CanDeleteEmployee,
} from '@/components/permission-guard'

// Clean, readable code
<CanCreateEmployee>
  <Button>Create Employee</Button>
</CanCreateEmployee>

<CanEditEmployee>
  <Button>Edit</Button>
</CanEditEmployee>

<CanDeleteEmployee fallback={null}>
  <Button color="red">Delete</Button>
</CanDeleteEmployee>
```

### 4. Using `ProtectedButton`

```typescript
import { ProtectedButton } from '@/components/protected-button'

<ProtectedButton
  permission="employee.create"
  onClick={handleCreate}
>
  Create Employee
</ProtectedButton>

<ProtectedButton
  permissions={['employee.edit', 'hrm.manage']}
  color="red"
  onClick={handleDelete}
>
  Delete Employee
</ProtectedButton>
```

---

## 🔄 Auto-Refresh Permissions (No Logout!)

### Option 1: Manual Refresh

```typescript
const { refreshPermissions } = usePermissions()

// Call this anywhere - e.g., after role change
await refreshPermissions()
```

### Option 2: Auto-Refresh Hook

```typescript
import { useAutoRefreshPermissions } from '@/hooks/usePermissions'

function App() {
  // Auto-refresh every 5 minutes
  useAutoRefreshPermissions(5 * 60 * 1000)

  return <YourApp />
}
```

### Option 3: Refresh on Focus

```typescript
import { useEffect } from 'react'
import { usePermissions } from '@/hooks/usePermissions'

function Layout() {
  const { refreshPermissions } = usePermissions()

  useEffect(() => {
    // Refresh when user returns to the tab
    const handleFocus = () => refreshPermissions()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [refreshPermissions])

  return <YourLayout />
}
```

---

## 🐛 Debugging

### Check User's Current Permissions

```typescript
const { permissions } = usePermissions()

console.log('User permissions:', permissions)
// Output: ['employee.index', 'employee.create', ...]
```

### Check Specific Permission

```typescript
const { hasPermission } = usePermissions()

if (hasPermission('employee.create')) {
  console.log('✅ Can create employee')
} else {
  console.log('❌ Cannot create employee')
}
```

### Check Route Access

```typescript
const { canAccessRoute } = usePermissions()

console.log(canAccessRoute('/admin/hrm/staff'))
// Output: true or false
```

### Debug PermissionGuard

```typescript
<PermissionGuard
  permission="employee.create"
  debug={true}  // ← Enable debug logs
>
  <Button>Create</Button>
</PermissionGuard>
```

Console output:
```
PermissionGuard check: {
  permission: 'employee.create',
  hasAccess: true,
  checking: 'employee.create'
}
```

---

## 📝 Best Practices

### ✅ DO:

1. **Use the config file** - Add all permissions to `src/config/permissions.ts`
2. **Use components** - Use `PermissionGuard`, `ProtectedButton` for common cases
3. **Auto-refresh** - Call `refreshPermissions()` after role changes
4. **Be specific** - Use specific permissions like `employee.create` not broad ones
5. **Backend validation** - Always validate permissions on backend too

### ❌ DON'T:

1. **Don't hardcode** - Don't check permissions directly in multiple places
2. **Don't duplicate** - Don't create permission strings in components
3. **Don't forget refresh** - Don't require logout to update permissions
4. **Don't skip backend** - Frontend checks are UI only, backend must validate

---

## 🎨 Common Patterns

### Pattern 1: Permission-Based Navigation

```typescript
const navItems = [
  {
    label: 'HRM',
    items: [
      { title: 'Employees', url: '/admin/hrm/staff' },
      { title: 'Payroll', url: '/admin/hrm/payroll' },
    ]
  }
]

// Sidebar automatically filters based on permissions
// No manual checking needed!
```

### Pattern 2: Action Buttons

```typescript
<ProtectedButton permission="employee.create" onClick={create}>
  Create
</ProtectedButton>

<ProtectedButton permission="employee.edit" onClick={edit}>
  Edit
</ProtectedButton>

<ProtectedButton permission="employee.delete" color="red" onClick={delete}>
  Delete
</ProtectedButton>
```

### Pattern 3: Conditional Sections

```typescript
<PermissionGuard permission="payroll.manage">
  <Section>
    <PayrollDashboard />
    <PayrollReports />
  </Section>
</PermissionGuard>
```

---

## 🔧 Troubleshooting

### Problem: User can see menu but can't access page

**Solution:** Add route protection in your route component:

```typescript
function PayrollPage() {
  const { hasPermission } = usePermissions()

  if (!hasPermission('payroll.index')) {
    return <Navigate to="/admin/dashboard" />
  }

  return <PayrollContent />
}
```

### Problem: Permissions not updating after role change

**Solution:** Call `refreshPermissions()` after changing role:

```typescript
const handleRoleChange = async (newRoleId) => {
  await api.put(`/user-management/users/${userId}`, {
    role_id: newRoleId
  })

  // Refresh permissions immediately
  await refreshPermissions()

  notifications.show({
    title: 'Success',
    message: 'Role updated! Refreshing permissions...'
  })
}
```

### Problem: Sidebar shows wrong items

**Solution:** Check the route mapping in `src/config/permissions.ts`:

```typescript
// Make sure your route is mapped
export const ROUTE_PERMISSIONS: Record<string, string> = {
  '/admin/my-page': 'myModule.index',  // ← Check this
}
```

---

## 🚀 Quick Start Checklist

- [ ] Add permissions to `src/config/permissions.ts`
- [ ] Add route mappings to `ROUTE_PERMISSIONS`
- [ ] Use `PermissionGuard` or `ProtectedButton` in components
- [ ] Use `usePermissions` hook in pages
- [ ] Test with different roles
- [ ] Verify backend validation exists

---

## 📚 Additional Resources

- Permission Config: `src/config/permissions.ts`
- Hook: `src/hooks/usePermissions.ts`
- Components: `src/components/permission-guard.tsx`
- Example: Check `app-sidebar-mantine.tsx` for implementation

---

## 🎉 Summary

**Before:**
- ❌ Permission checks scattered everywhere
- ❌ Need logout to refresh
- ❌ Hardcoded strings in components
- ❌ Difficult to maintain

**After:**
- ✅ One config file for all permissions
- ✅ Auto-refresh without logout
- ✅ Reusable components
- ✅ Easy to scale and maintain

**Total time to add new route:** ~2 minutes ⚡

---

## ✨ Self-Profile Access Feature

**Rule:** Users can always view and edit their own profile, regardless of their permissions!

This means:
- ✅ Any employee can visit `/admin/profile` to see their own profile
- ✅ Any employee can edit their own profile at `/admin/hrm/staff/{their_id}/edit`
- ❌ Employees still need `employee.view` permission to see OTHER employees' profiles
- ❌ Employees still need `employee.edit` permission to edit OTHER employees' profiles

### Usage Examples

#### 1. Using the Hook

```typescript
import { usePermissions } from '@/hooks/usePermissions'

function EmployeeList() {
  const { canEditProfile, canViewProfile, isOwnProfile } = usePermissions()
  const currentUser = useAuthStore(state => state.user)

  return (
    <Table>
      {employees.map(employee => (
        <Table.Tr key={employee.id}>
          <Table.Td>{employee.name}</Table.Td>
          <Table.Td>
            <Group>
              {/* Always allow viewing own profile */}
              <Link to={`/admin/hrm/staff/${employee.id}`}>
                View
              </Link>

              {/* Allow edit if own profile OR has permission */}
              {canEditProfile(employee.id) && (
                <Link to={`/admin/hrm/staff/${employee.id}/edit`}>
                  Edit
                </Link>
              )}
            </Group>
          </Table.Td>
        </Table.Tr>
      ))}
    </Table>
  )
}
```

#### 2. Using SelfProfileGuard Component

```typescript
import { SelfProfileGuard } from '@/components/permission-guard'

function EmployeeEditPage({ userId }) {
  return (
    <SelfProfileGuard userId={userId} mode="edit">
      <EditEmployeeForm userId={userId} />
    </SelfProfileGuard>
  )
}
```

#### 3. Showing Different UI for Own Profile

```typescript
function EmployeeActions({ employee }) {
  const { isOwnProfile } = usePermissions()
  const isOwn = isOwnProfile(employee.id)

  return (
    <Group>
      <Button variant="light">View</Button>
      
      {isOwn ? (
        <Button>Edit My Profile</Button>
      ) : (
        <PermissionGuard permission="employee.edit">
          <Button>Edit Employee</Button>
        </PermissionGuard>
      )}
    </Group>
  )
}
```

### Available Functions

```typescript
const {
  canEditProfile,    // (userId) => boolean - Can edit this user's profile?
  canViewProfile,    // (userId) => boolean - Can view this user's profile?
  isOwnProfile,      // (userId) => boolean - Is this my profile?
} = usePermissions()
```

### How It Works

```typescript
// In usePermissions hook:
canEditProfile(targetUserId) {
  const currentUserId = user?.id
  
  // ✅ Always allow editing own profile
  if (currentUserId === targetUserId) {
    return true
  }
  
  // ❌ Otherwise, check permission
  return hasPermission('employee.edit')
}
```

---

## 🔄 IMPORTANT: Self-Profile vs Other Profiles

| Scenario | Permission Required | Notes |
|----------|-------------------|-------|
| View own profile | **None** | Always allowed |
| Edit own profile | **None** | Always allowed |
| View other's profile | `employee.view` or `employee.index` | Need permission |
| Edit other's profile | `employee.edit` | Need permission |
| Delete own profile | `employee.delete` | Not recommended! |
| Delete other's profile | `employee.delete` | Need permission |

