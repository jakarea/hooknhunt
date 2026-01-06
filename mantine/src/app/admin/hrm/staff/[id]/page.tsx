import { useMemo, useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Paper,
  Avatar,
  SimpleGrid,
  Anchor,
  Table,
  ActionIcon,
  UnstyledButton,
  LoadingOverlay,
  Modal,
  Alert,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import {
  IconChevronRight,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconId,
  IconBuilding,
  IconCoin,
  IconShield,
  IconClock,
  IconUser,
  IconBan,
  IconCheck,
  IconX,
  IconHistory,
} from '@tabler/icons-react'
import api from '@/lib/api'
// import { usePermissions } from '@/hooks/usePermissions'

interface User {
  id: number
  name: string
  phone: string
  email?: string
  role_id: number
  is_active: boolean
  phone_verified_at?: string
  last_login_at?: string
  created_at: string
  updated_at: string
  role?: {
    id: number
    name: string
    slug: string
  }
  profile?: {
    department_id?: number
    designation?: string
    joining_date?: string
    base_salary?: number
    address?: string
    city?: string
    dob?: string
    gender?: string
    department_name?: string
  }
}

interface Permission {
  id: number
  name: string
  slug: string
  group_name: string
}

interface Leave {
  id: number
  user_id: number
  type: string
  start_date: string
  end_date: string
  days_count: number
  reason?: string
  status: 'pending' | 'approved' | 'rejected'
  approved_by?: number
  created_at: string
  user?: {
    id: number
    name: string
  }
  approver?: {
    id: number
    name: string
  }
}

interface Attendance {
  id: number
  user_id: number
  date: string
  clock_in: string
  clock_out?: string
  status: 'present' | 'late' | 'absent' | 'leave' | 'holiday'
  note?: string
  created_at: string
  updated_at: string
  user?: {
    id: number
    name: string
  }
  updater?: {
    id: number
    name: string
  }
}

interface Payroll {
  id: number
  user_id: number
  month_year: string
  basic_salary: string
  bonus: string
  deductions: string
  net_payable: string
  status: 'generated' | 'paid'
  payment_date?: string
  created_at: string
  user?: {
    id: number
    name: string
  }
}

// Mock login history
const mockLoginHistory = [
  {
    id: 1,
    login_at: '2025-12-30 08:30:00',
    logout_at: '2025-12-30 17:45:00',
    ip_address: '192.168.1.100',
    user_agent: 'Chrome on Windows',
  },
]


export default function EmployeeProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  // const { canViewProfile } = usePermissions()

  // ALL hooks must be declared before any conditional logic or early returns
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [payroll, setPayroll] = useState<Payroll[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllPermissions, setShowAllPermissions] = useState(false)
  const [blockConfirmOpened, setBlockConfirmOpened] = useState(false)
  const [verifyConfirmOpened, setVerifyConfirmOpened] = useState(false)
  const MAX_VISIBLE_PERMISSIONS = 6

  // Fetch user data
  useEffect(() => {
    if (!id) return

    const fetchUserData = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/user-management/users/${id}`)

        const userData = response.data.data.user
        const rolePerms = response.data.data.role_permissions || []
        const granted = response.data.data.granted_permissions || []
        const blocked = response.data.data.blocked_permissions || []

        setUser(userData)

        // Combine role permissions with granted permissions, exclude blocked
        const allPermissions = [...rolePerms, ...granted]
        const blockedIds = blocked.map((p: Permission) => p.id)
        const finalPermissions = allPermissions.filter((p: Permission) => !blockedIds.includes(p.id))

        setPermissions(finalPermissions)
      } catch (error: unknown) {
        console.error('Failed to fetch user:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load employee data. Please try again.',
          color: 'red',
        })
        navigate('/hrm/staff')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [id, navigate])

  // Fetch leaves data
  useEffect(() => {
    if (!id) return

    const fetchLeaves = async () => {
      try {
        const response = await api.get(`/hrm/leaves`, {
          params: { user_id: id }
        })
        // Handle paginated response: response.data.data.data contains the leaves array
        const leavesData = response.data.data?.data || response.data.data || []
        setLeaves(Array.isArray(leavesData) ? leavesData : [])
      } catch (error: unknown) {
        console.error('Failed to fetch leaves:', error)
        setLeaves([]) // Set empty array on error
      }
    }

    fetchLeaves()
  }, [id])

  // Fetch attendance data
  useEffect(() => {
    if (!id) return

    const fetchAttendance = async () => {
      try {
        const response = await api.get(`/hrm/attendance`, {
          params: { user_id: id }
        })
        // Handle paginated response: response.data.data.data contains the attendance array
        const attendanceData = response.data.data?.data || response.data.data || []
        setAttendance(Array.isArray(attendanceData) ? attendanceData : [])
      } catch (error: unknown) {
        console.error('Failed to fetch attendance:', error)
        setAttendance([]) // Set empty array on error
      }
    }

    fetchAttendance()
  }, [id])

  // Fetch payroll data
  useEffect(() => {
    if (!id) return

    const fetchPayroll = async () => {
      try {
        const response = await api.get(`/hrm/payrolls`, {
          params: { user_id: id }
        })
        // Handle paginated response: response.data.data.data contains the payroll array
        const payrollData = response.data.data?.data || response.data.data || []
        setPayroll(Array.isArray(payrollData) ? payrollData : [])
      } catch (error: unknown) {
        console.error('Failed to fetch payroll:', error)
        setPayroll([]) // Set empty array on error
      }
    }

    fetchPayroll()
  }, [id])

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Profile header content
  const profileHeader = useMemo(() => {
    if (!user) return null

    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" align="flex-start">
          <Group >
            <Avatar
              src={null}
              alt={user.name}
              radius="xl"
              size="xl"
              color="red"
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Group  mb="xs">
                <Title order={2}>{user.name}</Title>
                <Badge
                  color={user.is_active ? 'green' : 'gray'}
                  variant="light"
                  size="lg"
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Group>
              <Text size="lg" c="dimmed" mb="xs">{user.profile?.designation || 'N/A'}</Text>
              <Group >
                {user.email && (
                  <Group >
                    <IconMail size={16} />
                    <Text size="sm">{user.email}</Text>
                  </Group>
                )}
                <Group >
                  <IconPhone size={16} />
                  <Text size="sm">{user.phone}</Text>
                </Group>
              </Group>
            </Box>
          </Group>
          <Button
            component={Link}
            to={`/hrm/staff/${user.id}/edit`}
            leftSection={<IconEdit size={16} />}
            variant="light"
          >
            Edit Profile
          </Button>
        </Group>
      </Paper>
    )
  }, [user])

  // Personal Information Section
  const personalInfo = useMemo(() => {
    if (!user) return null

    return (
      <UnstyledButton
        component={Link}
        to={`/hrm/staff/${user.id}/edit`}
        style={{ width: '100%', display: 'block' }}
      >
        <Paper
          withBorder
          p={{ base: 'md', md: 'xl' }}
          radius="lg"
          className="transition-all duration-200 cursor-pointer hover:border-red-9"
        >
          <Group justify="space-between" mb="md">
            <Title order={4} className="text-base md:text-lg lg:text-xl">Personal Information</Title>
            <ActionIcon variant="subtle" color="blue" size="sm">
              <IconEdit size={16} />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Group >
              <IconUser size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Full Name</Text>
                <Text fw={500}>{user.name}</Text>
              </Box>
            </Group>
            <Group >
              <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Employee ID</Text>
                <Text fw={500}>#{user.id}</Text>
              </Box>
            </Group>
            <Group >
              <IconPhone size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Phone</Text>
                <Text fw={500}>{user.phone}</Text>
              </Box>
            </Group>
            <Group >
              <IconMail size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Email</Text>
                <Text fw={500}>{user.email || 'N/A'}</Text>
              </Box>
            </Group>
            <Group >
              <IconCalendar size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Date of Birth</Text>
                <Text fw={500}>{formatDate(user.profile?.dob || null)}</Text>
              </Box>
            </Group>
            <Group >
              <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Gender</Text>
                <Text fw={500}>{user.profile?.gender ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1) : 'N/A'}</Text>
              </Box>
            </Group>
            <Group  style={{ gridColumn: '1 / -1' }}>
              <IconMapPin size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Address</Text>
                <Text fw={500}>
                  {user.profile?.address ? `${user.profile.address}, ${user.profile.city || ''}`.trim() : 'N/A'}
                </Text>
              </Box>
            </Group>
          </SimpleGrid>
        </Paper>
      </UnstyledButton>
    )
  }, [user])

  // Professional Information Section
  const professionalInfo = useMemo(() => {
    if (!user) return null

    return (
      <UnstyledButton
        component={Link}
        to={`/hrm/staff/${user.id}/edit`}
        style={{ width: '100%', display: 'block' }}
      >
        <Paper
          withBorder
          p={{ base: 'md', md: 'xl' }}
          radius="lg"
          className="transition-all duration-200 cursor-pointer hover:border-red-9"
        >
          <Group justify="space-between" mb="md">
            <Title order={4} className="text-base md:text-lg lg:text-xl">Professional Information</Title>
            <ActionIcon variant="subtle" color="blue" size="sm">
              <IconEdit size={16} />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <Group >
              <IconShield size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Role</Text>
                <Badge variant="light" color="red">{user.role?.name || 'N/A'}</Badge>
              </Box>
            </Group>
            <Group >
              <IconBuilding size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Department</Text>
                <Text fw={500}>{user.profile?.department_name || 'N/A'}</Text>
              </Box>
            </Group>
            <Group >
              <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Designation</Text>
                <Text fw={500}>{user.profile?.designation || 'N/A'}</Text>
              </Box>
            </Group>
            <Group >
              <IconCalendar size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Joining Date</Text>
                <Text fw={500}>{formatDate(user.profile?.joining_date || null)}</Text>
              </Box>
            </Group>
            <Group >
              <IconCoin size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Base Salary</Text>
                <Text fw={500}>
                  {user.profile?.base_salary ? `${parseFloat(user.profile.base_salary.toString()).toLocaleString()} BDT` : 'N/A'}
                </Text>
              </Box>
            </Group>
            <Group >
              <IconClock size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
              <Box>
                <Text size="xs" c="dimmed">Account Created</Text>
                <Text fw={500}>{formatDate(user.created_at)}</Text>
              </Box>
            </Group>
          </SimpleGrid>
        </Paper>
      </UnstyledButton>
    )
  }, [user])

  // Account Security Section
  const accountSecurity = useMemo(() => {
    if (!user) return null

    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Title order={4} mb="md">Account Security</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          <Group >
            <IconShield size={18} style={{ color: user.is_active ? 'green' : 'gray' }} />
            <Box style={{ flex: 1 }}>
              <Text size="xs" c="dimmed">Account Status</Text>
              <Group >
                <Badge color={user.is_active ? 'green' : 'gray'} variant="light">
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
                <ActionIcon
                  variant="subtle"
                  color={user.is_active ? 'red' : 'green'}
                  size="sm"
                  onClick={() => setBlockConfirmOpened(true)}
                >
                  {user.is_active ? <IconBan size={14} /> : <IconCheck size={14} />}
                </ActionIcon>
              </Group>
            </Box>
          </Group>
          <Group >
            <IconPhone size={18} style={{ color: user.phone_verified_at ? 'green' : 'orange' }} />
            <Box style={{ flex: 1 }}>
              <Text size="xs" c="dimmed">Phone Verification</Text>
              <Group >
                <Badge color={user.phone_verified_at ? 'green' : 'orange'} variant="light">
                  {user.phone_verified_at ? 'Verified' : 'Not Verified'}
                </Badge>
                <ActionIcon
                  variant="subtle"
                  color={user.phone_verified_at ? 'orange' : 'green'}
                  size="sm"
                  onClick={() => setVerifyConfirmOpened(true)}
                >
                  {user.phone_verified_at ? <IconX size={14} /> : <IconCheck size={14} />}
                </ActionIcon>
              </Group>
            </Box>
          </Group>
          <Group >
            <IconClock size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
            <Box>
              <Text size="xs" c="dimmed">Last Login</Text>
              <Text fw={500} size="sm">{formatDateTime(user.last_login_at || null)}</Text>
            </Box>
          </Group>
          <Group >
            <IconCalendar size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
            <Box>
              <Text size="xs" c="dimmed">Last Updated</Text>
              <Text fw={500} size="sm">{formatDateTime(user.updated_at)}</Text>
            </Box>
          </Group>
        </SimpleGrid>
      </Paper>
    )
  }, [user])

  // Permissions Section
  const permissionsSection = useMemo(() => {
    const displayedPermissions = showAllPermissions
      ? permissions
      : permissions.slice(0, MAX_VISIBLE_PERMISSIONS)
    const remainingCount = permissions.length - MAX_VISIBLE_PERMISSIONS

    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} className="text-base md:text-lg lg:text-xl">Permissions & Access</Title>
          <Badge size="lg">{permissions.length} permissions</Badge>
        </Group>

        {permissions.length > 0 ? (
          <>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {displayedPermissions.map((permission) => (
                <Paper key={permission.id} withBorder p="sm" radius="md">
                  <Group >
                    <IconShield size={16} style={{ color: 'var(--mantine-color-red-filled)' }} />
                    <Box>
                      <Text fw={500} size="sm">{permission.name}</Text>
                      <Text size="xs" c="dimmed">{permission.group_name}</Text>
                    </Box>
                  </Group>
                </Paper>
              ))}
            </SimpleGrid>

            {permissions.length > MAX_VISIBLE_PERMISSIONS && (
              <Button
                variant="light"
                size="sm"
                mt="md"
                onClick={() => setShowAllPermissions(!showAllPermissions)}
              >
                {showAllPermissions ? 'Show Less' : `View More (${remainingCount})`}
              </Button>
            )}
          </>
        ) : (
          <Text c="dimmed">No permissions assigned</Text>
        )}
      </Paper>
    )
  }, [permissions, showAllPermissions])

  // Leave History Section
  const leaveHistorySection = useMemo(() => {
    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} className="text-base md:text-lg lg:text-xl">Leave History</Title>
          <Badge size="lg">{leaves.length} records</Badge>
        </Group>

        {leaves.length === 0 ? (
          <Text c="dimmed">No leave records found</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Dates</Table.Th>
                <Table.Th>Days</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Approved By</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaves.map((leave) => (
                <Table.Tr key={leave.id}>
                  <Table.Td>
                    <Badge
                      color={
                        leave.type === 'sick' ? 'red' :
                        leave.type === 'casual' ? 'blue' :
                        'gray'
                      }
                      variant="light"
                    >
                      {leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(leave.start_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                      {leave.start_date !== leave.end_date && ` - ${new Date(leave.end_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}`}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>{leave.days_count}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{leave.reason || 'N/A'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        leave.status === 'approved' ? 'green' :
                        leave.status === 'rejected' ? 'red' :
                        'yellow'
                      }
                      variant="light"
                      size="sm"
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {leave.approver?.name || 'N/A'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    )
  }, [leaves])

  // Attendance History Section
  const attendanceHistorySection = useMemo(() => {
    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} className="text-base md:text-lg lg:text-xl">Attendance History</Title>
          <Badge size="lg">{attendance.length} records</Badge>
        </Group>

        {attendance.length === 0 ? (
          <Text c="dimmed">No attendance records found</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Clock In</Table.Th>
                <Table.Th>Clock Out</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Note</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {attendance.map((att) => (
                <Table.Tr key={att.id}>
                  <Table.Td>
                    <Text size="sm">
                      {new Date(att.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {att.clock_in ? new Date(`2000-01-01 ${att.clock_in}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {att.clock_out ? new Date(`2000-01-01 ${att.clock_out}`).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        att.status === 'present' ? 'green' :
                        att.status === 'late' ? 'yellow' :
                        att.status === 'absent' ? 'red' :
                        att.status === 'leave' ? 'blue' :
                        'gray'
                      }
                      variant="light"
                      size="sm"
                    >
                      {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">{att.note || '-'}</Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    )
  }, [attendance])

  // Payroll History Section
  const payrollHistorySection = useMemo(() => {
    return (
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} className="text-base md:text-lg lg:text-xl">Payroll History</Title>
          <Badge size="lg">{payroll.length} records</Badge>
        </Group>

        {payroll.length === 0 ? (
          <Text c="dimmed">No payroll records found</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Month</Table.Th>
                <Table.Th>Basic Salary</Table.Th>
                <Table.Th>Bonus</Table.Th>
                <Table.Th>Deductions</Table.Th>
                <Table.Th>Net Payable</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Payment Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {payroll.map((pay) => (
                <Table.Tr key={pay.id}>
                  <Table.Td>
                    <Text size="sm" fw={500}>
                      {new Date(pay.month_year + '-01').toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      ৳{parseFloat(pay.basic_salary).toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="green">
                      ৳{parseFloat(pay.bonus).toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="red">
                      ৳{parseFloat(pay.deductions).toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={500}>
                      ৳{parseFloat(pay.net_payable).toLocaleString('en-BD', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={pay.status === 'paid' ? 'green' : 'orange'}
                      variant="light"
                      size="sm"
                    >
                      {pay.status.charAt(0).toUpperCase() + pay.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">
                      {pay.payment_date
                        ? new Date(pay.payment_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : '-'}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    )
  }, [payroll])

  // Other history sections (simplified)
  const historySections = useMemo(() => (
    <Stack >
      {leaveHistorySection}
      {attendanceHistorySection}
      {payrollHistorySection}
      <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
        <Group justify="space-between" mb="md">
          <Title order={4} className="text-base md:text-lg lg:text-xl">Login History</Title>
          <Badge size="lg">{mockLoginHistory.length} records</Badge>
        </Group>
        <Text c="dimmed">Mock data - API integration pending</Text>
      </Paper>
    </Stack>
  ), [user, leaveHistorySection, attendanceHistorySection, payrollHistorySection])

  return (
    <Box p={{ base: 'md', md: 'xl' }} pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      {!loading && user && (
        <Stack >
          {/* Breadcrumbs */}
          <Group >
            <Anchor component={Link} to="/dashboard" c="dimmed">Dashboard</Anchor>
            <IconChevronRight size={14} />
            <Anchor component={Link} to="/hrm/staff" c="dimmed">HRM</Anchor>
            <IconChevronRight size={14} />
            <Anchor component={Link} to="/hrm/staff" c="dimmed">Employees</Anchor>
            <IconChevronRight size={14} />
            <Text c="red">Profile: {user.name}</Text>
          </Group>

          {/* Header */}
          <Box>
            <Title order={1} className="text-lg md:text-xl lg:text-2xl">Employee Profile</Title>
            <Text c="dimmed">View and manage employee information</Text>
          </Box>

          {/* Profile Header */}
          {profileHeader}

          {/* All Information Sections */}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {personalInfo}
            {professionalInfo}
          </SimpleGrid>

          {/* Account Security & Permissions */}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {accountSecurity}
            {permissionsSection}
          </SimpleGrid>

          {/* Activity & History Section */}
          <Box>
            <Title order={2} className="text-base md:text-lg lg:text-xl" mb="md">
              <Group >
                <IconHistory size={24} />
                Activity & History
              </Group>
            </Title>
            {historySections}
          </Box>
        </Stack>
      )}

      {/* Confirmation Modals */}
      <Modal
        opened={blockConfirmOpened}
        onClose={() => setBlockConfirmOpened(false)}
        title={<Text className="text-base md:text-lg font-semibold">Confirm Status Change</Text>}
        centered
      >
        <Stack >
          <Text className="text-sm md:text-base">
            Are you sure you want to {user?.is_active ? 'block' : 'unblock'} this user?
          </Text>
          {user?.is_active && (
            <Alert variant="light" color="yellow" title="Warning">
              <Text className="text-xs md:text-sm">
                Blocking this user will prevent them from accessing the system.
              </Text>
            </Alert>
          )}
          <Group justify="flex-end" >
            <Button
              variant="default"
              onClick={() => setBlockConfirmOpened(false)}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              color={user?.is_active ? 'red' : 'green'}
              onClick={() => {
                if (user) {
                  notifications.show({
                    title: user.is_active ? 'User Blocked' : 'User Unblocked',
                    message: `${user.name} has been ${user.is_active ? 'blocked' : 'unblocked'} successfully`,
                    color: user.is_active ? 'red' : 'green',
                  })
                  setBlockConfirmOpened(false)
                }
              }}
              className="text-sm md:text-base"
            >
              {user?.is_active ? 'Block User' : 'Unblock User'}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Modal
        opened={verifyConfirmOpened}
        onClose={() => setVerifyConfirmOpened(false)}
        title={<Text className="text-base md:text-lg font-semibold">Confirm Verification Change</Text>}
        centered
      >
        <Stack >
          <Text className="text-sm md:text-base">
            Are you sure you want to {user?.phone_verified_at ? 'remove verification for' : 'verify'} this user's phone number?
          </Text>
          <Group justify="flex-end" >
            <Button
              variant="default"
              onClick={() => setVerifyConfirmOpened(false)}
              className="text-sm md:text-base"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (user) {
                  notifications.show({
                    title: user.phone_verified_at ? 'Verification Removed' : 'Phone Verified',
                    message: `${user.name}'s phone has been ${user.phone_verified_at ? 'unverified' : 'verified'}`,
                    color: user.phone_verified_at ? 'orange' : 'green',
                  })
                  setVerifyConfirmOpened(false)
                }
              }}
              className="text-sm md:text-base"
            >
              {user?.phone_verified_at ? 'Remove Verification' : 'Verify Phone'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
