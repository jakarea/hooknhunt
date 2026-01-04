/**
 * EXAMPLE: How to use the Sustainable Permission System
 *
 * This file demonstrates all the ways to use the permission system
 * Copy patterns from here to your components
 */

import { Button, Group, Stack, Paper, Text, Title } from '@mantine/core'
import { usePermissions } from '@/hooks/usePermissions'
import { PermissionGuard, CanCreateEmployee, CanEditEmployee } from '@/components/permission-guard'
import { ProtectedButton } from '@/components/protected-button'

export default function PermissionExamples() {
  const {
    hasPermission,
    canAccessRoute,
    refreshPermissions,
    permissions
  } = usePermissions()

  return (
    <Stack p="xl">
      <Title order={1}>Permission System Examples</Title>

      {/* Example 1: Basic Permission Check */}
      <Paper p="md" withBorder>
        <Title order={3}>1. Basic Permission Check</Title>
        {hasPermission('employee.create') ? (
          <Button onClick={() => alert('Creating employee!')}>
            Create Employee
          </Button>
        ) : (
          <Text c="red">You don't have permission to create employees</Text>
        )}
      </Paper>

      {/* Example 2: Multiple Permissions (any) */}
      <Paper p="md" withBorder>
        <Title order={3}>2. Multiple Permissions (Any)</Title>
        {hasPermission(['employee.edit', 'employee.delete']) ? (
          <Group>
            <Button>Edit Employee</Button>
            <Button color="red">Delete Employee</Button>
          </Group>
        ) : (
          <Text c="red">You need edit or delete permission</Text>
        )}
      </Paper>

      {/* Example 3: Route Access Check */}
      <Paper p="md" withBorder>
        <Title order={3}>3. Route Access Check</Title>
        {canAccessRoute('/hrm/payroll') ? (
          <Text c="green">✅ You can access Payroll</Text>
        ) : (
          <Text c="red">❌ You cannot access Payroll</Text>
        )}
      </Paper>

      {/* Example 4: PermissionGuard Component */}
      <Paper p="md" withBorder>
        <Title order={3}>4. PermissionGuard Component</Title>
        <PermissionGuard permission="employee.create">
          <Button>Create Employee</Button>
        </PermissionGuard>

        <PermissionGuard
          permissions={['employee.edit', 'employee.delete']}
          fallback={<Text c="red">No edit/delete access</Text>}
        >
          <Group>
            <Button>Edit</Button>
            <Button color="red">Delete</Button>
          </Group>
        </PermissionGuard>
      </Paper>

      {/* Example 5: Pre-built Helpers */}
      <Paper p="md" withBorder>
        <Title order={3}>5. Pre-built Helper Components</Title>
        <CanCreateEmployee>
          <Button>Create Employee</Button>
        </CanCreateEmployee>

        <CanEditEmployee>
          <Button>Edit Employee</Button>
        </CanEditEmployee>
      </Paper>

      {/* Example 6: ProtectedButton */}
      <Paper p="md" withBorder>
        <Title order={3}>6. ProtectedButton Component</Title>
        <Group>
          <ProtectedButton {...({} as any)}
            permission="employee.create"
            onClick={() => alert('Create')}
            {...({} as any)}
          >
            Create
          </ProtectedButton>

          <ProtectedButton {...({} as any)}
            permissions={['employee.edit', 'hrm.manage']}
            onClick={() => alert('Edit')}
          >
            Edit
          </ProtectedButton>

          <ProtectedButton {...({} as any)}
            permission="employee.delete"
            color="red"
            onClick={() => alert('Delete')}
          >
            Delete
          </ProtectedButton>
        </Group>
      </Paper>

      {/* Example 7: Refresh Permissions */}
      <Paper p="md" withBorder>
        <Title order={3}>7. Refresh Permissions (No Logout!)</Title>
        <Text size="sm" mb="md">
          Total permissions: {permissions.length}
        </Text>
        <Button onClick={() => refreshPermissions()}>
          Refresh Permissions from API
        </Button>
      </Paper>

      {/* Example 8: Debug Mode */}
      <Paper p="md" withBorder>
        <Title order={3}>8. Debug Mode</Title>
        <PermissionGuard
          permission="employee.create"
          debug={true}
        >
          <Button>Check Console for Debug Info</Button>
        </PermissionGuard>
      </Paper>
    </Stack>
  )
}
