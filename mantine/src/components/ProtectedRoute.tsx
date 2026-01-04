import { useAuthStore } from '@/stores/authStore'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader, Center, Text, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface ProtectedRouteProps {
  permissions?: string[] // Required permissions (user must have at least one)
  requireAll?: boolean // If true, user must have ALL permissions
  role?: string // Required role
}

const ProtectedRoute = ({
  permissions,
  requireAll = false,
  role,
}: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token)
  const hydrated = useAuthStore((state) => state.hydrated)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions)
  const hasRole = useAuthStore((state) => state.hasRole)

  // Wait for hydration before making auth decision
  if (!hydrated) {
    return (
      <Center mih="100vh">
        <Stack align="center" gap="md">
          <Loader size="lg" color="red" />
          <Text size="sm" c="dimmed">Loading...</Text>
        </Stack>
      </Center>
    )
  }

  const isAuthenticated = !!token

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Check role if specified
  if (role && !hasRole(role)) {
    return (
      <Center mih="100vh">
        <Stack align="center" gap="md" maw={500}>
          <Alert variant="light" color="red" title="Access Denied" icon={<IconAlertCircle />}>
            <Text size="sm">
              You don't have permission to access this page. Required role: {role}
            </Text>
          </Alert>
        </Stack>
      </Center>
    )
  }

  // Check permissions if specified
  if (permissions && permissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions)

    if (!hasAccess) {
      return (
        <Center mih="100vh">
          <Stack align="center" gap="md" maw={500}>
            <Alert variant="light" color="red" title="Access Denied" icon={<IconAlertCircle />}>
              <Text size="sm">
                You don't have permission to access this page. Required permissions:{' '}
                {requireAll ? 'All of ' : 'Any of '}
                {permissions.join(', ')}
              </Text>
            </Alert>
          </Stack>
        </Center>
      )
    }
  }

  return <Outlet />
}

export default ProtectedRoute
