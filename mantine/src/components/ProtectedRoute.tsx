import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader, Center, Text, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import api from '@/lib/api'

interface ProtectedRouteProps {
  permissions?: string[] // Required permissions (user must have at least one)
  requireAll?: boolean // If true, user must have ALL permissions
  role?: string // Required role
}

interface Attendance {
  id: number
  user_id: number
  date: string
  clock_in: string
  clock_out?: string | null
  break_in?: string[]
  break_out?: string[]
  status: string
  note?: string | null
}

const ProtectedRoute = ({
  permissions,
  requireAll = false,
  role,
}: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token)
  const user = useAuthStore((state) => state.user)
  const hydrated = useAuthStore((state) => state.hydrated)
  const hasAnyPermission = useAuthStore((state) => state.hasAnyPermission)
  const hasAllPermissions = useAuthStore((state) => state.hasAllPermissions)
  const hasRole = useAuthStore((state) => state.hasRole)
  const location = useLocation()
  const [attendance, setAttendance] = useState<Attendance | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch today's attendance to check break status
  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.id || !token) {
        setLoading(false)
        return
      }

      try {
        const today = new Date().toISOString().split('T')[0]
        const response = await api.get(`/hrm/attendance?start_date=${today}&end_date=${today}`)

        let attendanceData = []
        if (response.data?.data?.data) {
          attendanceData = response.data.data.data
        } else if (response.data?.data) {
          attendanceData = Array.isArray(response.data.data) ? response.data.data : []
        }

        // Find my attendance
        const myRecord = attendanceData.find((a: any) => a.userId === user.id || a.user_id === user.id)

        if (myRecord) {
          setAttendance({
            id: myRecord.id,
            user_id: myRecord.userId || myRecord.user_id,
            date: myRecord.date,
            clock_in: myRecord.clockIn || myRecord.clock_in,
            clock_out: myRecord.clockOut || myRecord.clock_out,
            break_in: myRecord.breakIn || myRecord.break_in,
            break_out: myRecord.breakOut || myRecord.break_out,
            status: myRecord.status,
            note: myRecord.note,
          })
        }
      } catch (error) {
        console.log('Error fetching attendance for break check:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [user?.id, token])

  // Debug logging
  console.log('[ProtectedRoute] Hydrated:', hydrated)
  console.log('[ProtectedRoute] Token from store:', token ? 'Exists' : 'NULL')
  console.log('[ProtectedRoute] Token from localStorage:', localStorage.getItem('token'))

  // Wait for hydration and attendance check
  if (!hydrated || loading) {
    console.log('[ProtectedRoute] Waiting for hydration...')
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

  console.log('[ProtectedRoute] isAuthenticated:', isAuthenticated)

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  // Check if user is on break and redirect to dashboard
  const breakIns = Array.isArray(attendance?.break_in) ? attendance.break_in : []
  const breakOuts = Array.isArray(attendance?.break_out) ? attendance.break_out : []
  const isOnBreak = attendance?.clock_in && !attendance?.clock_out && breakIns.length > breakOuts.length

  if (isOnBreak && location.pathname !== '/dashboard') {
    console.log('[ProtectedRoute] User is on break, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
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
