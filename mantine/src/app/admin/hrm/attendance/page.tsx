import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Card,
  Select,
  ActionIcon,
  Table,
  LoadingOverlay,
  Modal,
  TextInput,
  Textarea,
} from '@mantine/core'
import {
  IconClock,
  IconClockHour3,
  IconRefresh,
  IconCalendar,
  IconPencil,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

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

interface Employee {
  id: number
  name: string
}

interface FormData {
  user_id: string | null
  date: string | null
  clock_in: string | null
  clock_out: string | null
  status: string | null
  note: string
}

export default function AttendancePage() {
  const { t } = useTranslation()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('all')
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null)
  const [monthFilter, setMonthFilter] = useState<string | null>(new Date().toISOString().slice(0, 7))
  const [modalOpened, setModalOpened] = useState(false)
  const [saving, setSaving] = useState(false)
  const [clockingIn, setClockingIn] = useState(false)
  const [clockingOut, setClockingOut] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null)
  const [formData, setFormData] = useState<FormData>({
    user_id: null,
    date: null,
    clock_in: null,
    clock_out: null,
    status: null,
    note: '',
  })

  // Check if current user is admin (super_admin or admin)
  const isAdmin = useMemo(() => {
    return user?.role === 'super_admin' || user?.role === 'admin'
  }, [user])

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true)
      const params: any = {
        start_date: monthFilter ? `${monthFilter}-01` : new Date().toISOString().slice(0, 7) + '-01',
        end_date: monthFilter ? `${monthFilter}-31` : new Date().toISOString().slice(0, 7) + '-31',
      }

      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }

      if (employeeFilter) {
        params.user_id = employeeFilter
      }

      const response = await api.get('/hrm/attendance', { params })
      const attendanceData = response.data.data?.data || response.data.data || []
      setAttendance(Array.isArray(attendanceData) ? attendanceData : [])

      // Check today's attendance for current user
      // Get today's date in local timezone
      const now = new Date()
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

      const todayRecord = Array.isArray(attendanceData)
        ? attendanceData.find((a: Attendance) => {
          if (a.user_id !== user?.id) return false

          // Convert attendance date (which might be in UTC) to local date
          const attendanceDateObj = new Date(a.date)
          const attendanceDate = `${attendanceDateObj.getFullYear()}-${String(attendanceDateObj.getMonth() + 1).padStart(2, '0')}-${String(attendanceDateObj.getDate()).padStart(2, '0')}`

          console.log('Date comparison:', { attendanceDate, today, clock_in: a.clock_in })
          return attendanceDate === today
        })
        : null

      console.log('Final today record:', todayRecord)
      setTodayAttendance(todayRecord || null)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load attendance. Please try again.',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch employees for dropdown (only for admins)
  const fetchEmployees = async () => {
    if (!isAdmin) return

    try {
      const response = await api.get('/user-management/users')
      const employeesData = response.data.data || []
      setEmployees(employeesData)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }

  // Initial load
  useEffect(() => {
    fetchAttendance()
    fetchEmployees()
  }, [statusFilter, employeeFilter, monthFilter])

  // Handle refresh
  const handleRefresh = () => {
    fetchAttendance()
  }

  // Handle clock in
  const handleClockIn = async () => {
    try {
      setClockingIn(true)
      const response = await api.post('/hrm/clock-in', {
        note: 'Clocked in via system',
      })

      console.log('Clock In Response:', response.data)

      notifications.show({
        title: 'Success',
        message: 'Clocked in successfully!',
        color: 'green',
      })

      // Update today's attendance immediately from response
      // Handle different possible response structures
      const attendanceData = response.data?.data || response.data
      console.log('Attendance Data:', attendanceData)

      if (attendanceData) {
        setTodayAttendance(attendanceData)
        console.log('Updated todayAttendance:', attendanceData)
      }

      // Also refresh from server to be sure
      setTimeout(() => {
        fetchAttendance()
      }, 500)
    } catch (error: any) {
      console.error('Failed to clock in:', error)
      console.error('Error response:', error.response?.data)

      // If already clocked in, fetch the existing record
      if (error.response?.data?.message?.includes('Already clocked in')) {
        notifications.show({
          title: 'Already Clocked In',
          message: 'You have already clocked in today. Ready to clock out!',
          color: 'blue',
        })
        // Fetch the existing attendance record
        fetchAttendance()
        return
      }

      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || error.response?.data?.errors || 'Failed to clock in. Please try again.',
        color: 'red',
      })
    } finally {
      setClockingIn(false)
    }
  }

  // Handle clock out
  const handleClockOut = async () => {
    try {
      setClockingOut(true)
      const response = await api.post('/hrm/clock-out')

      console.log('Clock Out Response:', response.data)

      notifications.show({
        title: 'Success',
        message: 'Clocked out successfully!',
        color: 'green',
      })

      // Update today's attendance immediately from response
      const attendanceData = response.data?.data || response.data
      console.log('Attendance Data:', attendanceData)

      if (attendanceData) {
        setTodayAttendance(attendanceData)
        console.log('Updated todayAttendance:', attendanceData)
      }

      // Also refresh from server to be sure
      setTimeout(() => {
        fetchAttendance()
      }, 500)
    } catch (error: any) {
      console.error('Failed to clock out:', error)
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to clock out. Please try again.',
        color: 'red',
      })
    } finally {
      setClockingOut(false)
    }
  }

  // Open edit modal (admin only)
  const openEditModal = (record: Attendance) => {
    setFormData({
      user_id: String(record.user_id),
      date: record.date,
      clock_in: record.clock_in,
      clock_out: record.clock_out || null,
      status: record.status,
      note: record.note || '',
    })
    setModalOpened(true)
  }

  // Handle save (admin only - manual entry/update)
  const handleSave = async () => {
    if (isAdmin && !formData.user_id) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select an employee',
        color: 'red',
      })
      return
    }

    if (!formData.date) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select a date',
        color: 'red',
      })
      return
    }

    if (!formData.status) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select a status',
        color: 'red',
      })
      return
    }

    try {
      setSaving(true)

      await api.post('/hrm/attendance', {
        user_id: isAdmin ? formData.user_id : user?.id,
        date: formData.date,
        clock_in: formData.clock_in,
        clock_out: formData.clock_out,
        status: formData.status,
        note: formData.note || null,
      })

      notifications.show({
        title: 'Success',
        message: 'Attendance updated successfully',
        color: 'green',
      })

      setModalOpened(false)
      fetchAttendance()
    } catch (error: any) {
      console.error('Failed to save attendance:', error)
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save attendance. Please try again.',
        color: 'red',
      })
    } finally {
      setSaving(false)
    }
  }

  // Calculate working hours
  const calculateHours = (clockIn: string, clockOut?: string) => {
    if (!clockOut) return '-'

    const [inHours, inMinutes] = clockIn.split(':').map(Number)
    const [outHours, outMinutes] = clockOut.split(':').map(Number)

    const inDate = new Date(2000, 0, 1, inHours, inMinutes)
    const outDate = new Date(2000, 0, 1, outHours, outMinutes)

    const diff = outDate.getTime() - inDate.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m`
  }

  // Stats
  const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length
  const lateDays = attendance.filter(a => a.status === 'late').length
  const absentDays = attendance.filter(a => a.status === 'absent').length
  const leaveDays = attendance.filter(a => a.status === 'leave').length

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="lg">
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">
                {isAdmin ? 'Attendance Management' : 'My Attendance'}
              </Title>
              <Text c="dimmed" className="text-sm md:text-base">
                {isAdmin ? 'View and manage all employee attendance' : 'View your attendance records'}
              </Text>
            </Box>
            <Group gap="sm">
              <ActionIcon
                variant="light"
                size="lg"
                onClick={handleRefresh}
                loading={loading}
              >
                <IconRefresh size={18} />
              </ActionIcon>
              {!todayAttendance?.clock_in ? (
                <Button
                  onClick={handleClockIn}
                  loading={clockingIn}
                  leftSection={<IconClock size={16} />}
                  color="green"
                >
                  Clock In
                </Button>
              ) : todayAttendance?.clock_in && !todayAttendance?.clock_out ? (
                <Button
                  onClick={handleClockOut}
                  loading={clockingOut}
                  leftSection={<IconClockHour3 size={16} />}
                  color="red"
                >
                  Clock Out
                </Button>
              ) : (
                <Button disabled leftSection={<IconCheck size={16} />} color="gray">
                  Completed for Today
                </Button>
              )}
            </Group>
          </Group>
        </Box>

        {/* Today's Status Card */}
        {todayAttendance && (
          <Card withBorder p="md" radius="md" shadow="sm">
            <Group justify="space-between">
              <Box>
                <Text size="sm" c="dimmed">Today's Status</Text>
                <Group gap="xs" mt="xs">
                  <Badge
                    color={
                      todayAttendance.status === 'present' ? 'green' :
                      todayAttendance.status === 'late' ? 'yellow' :
                      todayAttendance.status === 'absent' ? 'red' :
                      'blue'
                    }
                    size="lg"
                  >
                    {todayAttendance.status.toUpperCase()}
                  </Badge>
                  <Text size="lg" fw={500}>
                    Clocked In: {todayAttendance.clock_in}
                  </Text>
                  {todayAttendance.clock_out && (
                    <Text size="lg" fw={500}>
                      Clocked Out: {todayAttendance.clock_out}
                    </Text>
                  )}
                </Group>
              </Box>
              {todayAttendance.clock_in && todayAttendance.clock_out && (
                <Box>
                  <Text size="sm" c="dimmed">Working Hours</Text>
                  <Text size="xl" fw={700}>
                    {calculateHours(todayAttendance.clock_in, todayAttendance.clock_out)}
                  </Text>
                </Box>
              )}
            </Group>
          </Card>
        )}

        {/* Stats */}
        <Stack gap="md" display={{ base: 'none', md: 'flex' }}>
          <Group gap="sm">
            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group gap="xs">
                <IconCheck size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
                <Text size="xs" c="dimmed">Present Days</Text>
              </Group>
              <Text size="xl" fw={700}>{presentDays}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group gap="xs">
                <IconClockHour3 size={20} style={{ color: 'var(--mantine-color-yellow-filled)' }} />
                <Text size="xs" c="dimmed">Late Days</Text>
              </Group>
              <Text size="xl" fw={700}>{lateDays}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group gap="xs">
                <IconX size={20} style={{ color: 'var(--mantine-color-red-filled)' }} />
                <Text size="xs" c="dimmed">Absent Days</Text>
              </Group>
              <Text size="xl" fw={700}>{absentDays}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group gap="xs">
                <IconCalendar size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                <Text size="xs" c="dimmed">Leave Days</Text>
              </Group>
              <Text size="xl" fw={700}>{leaveDays}</Text>
            </Card>
          </Group>
        </Stack>

        {/* Filters */}
        <Group justify="space-between">
          <Group gap="sm">
            <TextInput
              type="month"
              label="Select Month"
              value={monthFilter || ''}
              onChange={(e) => setMonthFilter(e.currentTarget.value)}
              style={{ width: '150px' }}
              size="md"
            />
            <Select
              placeholder="Filter by status"
              label="Status"
              data={[
                { value: 'all', label: 'All Status' },
                { value: 'present', label: 'Present' },
                { value: 'late', label: 'Late' },
                { value: 'absent', label: 'Absent' },
                { value: 'leave', label: 'Leave' },
                { value: 'holiday', label: 'Holiday' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '150px' }}
              size="md"
            />
            {isAdmin && (
              <Select
                placeholder="Filter by employee"
                label="Employee"
                clearable
                searchable
                data={employees.map(emp => ({ value: String(emp.id), label: emp.name }))}
                value={employeeFilter}
                onChange={(value) => setEmployeeFilter(value)}
                style={{ width: '200px' }}
                size="md"
              />
            )}
          </Group>
        </Group>

        {/* Table */}
        <Card withBorder p="0" radius="md" shadow="sm" pos="relative">
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                {isAdmin && <Table.Th>Employee</Table.Th>}
                <Table.Th>Date</Table.Th>
                <Table.Th>Clock In</Table.Th>
                <Table.Th>Clock Out</Table.Th>
                <Table.Th>Working Hours</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Note</Table.Th>
                {isAdmin && <Table.Th>Actions</Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {attendance.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={isAdmin ? 8 : 7}>
                    <Box py="xl" ta="center">
                      <Text c="dimmed">No attendance records found</Text>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ) : (
                attendance.map((record) => (
                  <Table.Tr key={record.id}>
                    {isAdmin && (
                      <Table.Td>
                        <Text fw={500} size="sm">{record.user?.name || 'N/A'}</Text>
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Text size="sm">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{record.clock_in}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>{record.clock_out || '-'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text fw={500}>
                        {record.clock_out ? calculateHours(record.clock_in, record.clock_out) : '-'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        color={
                          record.status === 'present' ? 'green' :
                          record.status === 'late' ? 'yellow' :
                          record.status === 'absent' ? 'red' :
                          record.status === 'leave' ? 'blue' :
                          'gray'
                        }
                        variant="light"
                        size="sm"
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">{record.note || '-'}</Text>
                    </Table.Td>
                    {isAdmin && (
                      <Table.Td>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          size="sm"
                          onClick={() => openEditModal(record)}
                        >
                          <IconPencil size={16} />
                        </ActionIcon>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>

      {/* Edit Modal (Admin Only) */}
      {isAdmin && (
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Edit Attendance"
          centered
        >
          <Stack gap="md">
            <Stack gap="xs">
              <Text size="sm" fw={500}>Employee *</Text>
              <Select
                placeholder="Select employee"
                data={employees.map(emp => ({ value: String(emp.id), label: emp.name }))}
                value={formData.user_id}
                onChange={(value) => setFormData({ ...formData, user_id: value })}
                searchable
                size="md"
                disabled
              />
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={500}>Date *</Text>
              <TextInput
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.currentTarget.value })}
                size="md"
              />
            </Stack>

            <Group gap="sm">
              <Stack gap="xs" style={{ flex: 1 }}>
                <Text size="sm" fw={500}>Clock In</Text>
                <TextInput
                  type="time"
                  value={formData.clock_in || ''}
                  onChange={(e) => setFormData({ ...formData, clock_in: e.currentTarget.value })}
                  size="md"
                />
              </Stack>

              <Stack gap="xs" style={{ flex: 1 }}>
                <Text size="sm" fw={500}>Clock Out</Text>
                <TextInput
                  type="time"
                  value={formData.clock_out || ''}
                  onChange={(e) => setFormData({ ...formData, clock_out: e.currentTarget.value })}
                  size="md"
                />
              </Stack>
            </Group>

            <Stack gap="xs">
              <Text size="sm" fw={500}>Status *</Text>
              <Select
                placeholder="Select status"
                data={[
                  { value: 'present', label: 'Present' },
                  { value: 'late', label: 'Late' },
                  { value: 'absent', label: 'Absent' },
                  { value: 'leave', label: 'Leave' },
                  { value: 'holiday', label: 'Holiday' },
                ]}
                value={formData.status}
                onChange={(value) => setFormData({ ...formData, status: value })}
                size="md"
              />
            </Stack>

            <Stack gap="xs">
              <Text size="sm" fw={500}>Note</Text>
              <Textarea
                placeholder="Enter note (optional)"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.currentTarget.value })}
                size="md"
                rows={3}
              />
            </Stack>

            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                onClick={() => setModalOpened(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={saving}
              >
                Update Attendance
              </Button>
            </Group>
          </Stack>
        </Modal>
      )}
    </Box>
  )
}
