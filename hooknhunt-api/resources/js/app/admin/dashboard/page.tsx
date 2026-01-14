import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Paper,
  Text,
  Title,
  Box,
  Stack,
  Group,
  Alert,
  Table,
  Badge,
  Card,
  SimpleGrid,
  ThemeIcon,
  Loader,
  Center,
} from '@mantine/core'
import {
  IconUsers,
  IconBuilding,
  IconCalendarClock,
  IconCoffee,
  IconAlertCircle,
  IconCheck,
} from '@tabler/icons-react'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { QUOTES } from '@/config/quotes'
import AttendanceActions from '@/components/attendance-actions'

interface DashboardStats {
  total_staff: number
  total_departments: number
  today_attendance: number
  on_break: number
  pending_payroll: number
}

interface RecentActivity {
  id: number
  user_name: string
  action: string
  timestamp: string
}

interface MyAttendance {
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

export default function AdminDashboardPage() {
  const { user, hasRole } = useAuthStore()
  const { t } = useTranslation()
  const isAdmin = user?.role?.slug === 'super_admin' || user?.role?.slug === 'admin' || hasRole('admin') || hasRole('super_admin')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [myAttendance, setMyAttendance] = useState<MyAttendance | null>(null)
  const [attendanceHistory, setAttendanceHistory] = useState<MyAttendance[]>([])
  const [dailyQuote, setDailyQuote] = useState('')

  useEffect(() => {
    fetchDashboardData()
    // Set daily quote based on day of year
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24)
    const quotes = QUOTES.DASHBOARD_QUOTES
    setDailyQuote(quotes[dayOfYear % quotes.length])
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const today = new Date().toISOString().split('T')[0]

      // Fetch today's attendance
      const attendanceResponse = await api.get(`/hrm/attendance?start_date=${today}&end_date=${today}`)

      const attendanceData = attendanceResponse.data?.data?.data || []
      const presentCount = attendanceData.filter((a: any) => a.clock_in).length
      const onBreakCount = attendanceData.filter((a: any) => {
        const breakInCount = Array.isArray(a.break_in) ? a.break_in.length : 0
        const breakOutCount = Array.isArray(a.break_out) ? a.break_out.length : 0
        return breakInCount > breakOutCount
      }).length

      // Fetch staff count (optional - only for admins)
      let totalStaff = 0
      try {
        const staffResponse = await api.get('/hrm/staff')
        const staffData = staffResponse.data?.data?.data || []
        totalStaff = Array.isArray(staffData) ? staffData.length : (staffData.data?.length || 0)
      } catch (error) {
        console.log('Staff count not available (requires admin permission)')
      }

      // Fetch departments count (optional - only for admins)
      let totalDepts = 0
      try {
        const deptResponse = await api.get('/hrm/departments')
        const deptData = deptResponse.data?.data || []
        totalDepts = Array.isArray(deptData) ? deptData.length : (deptData.data?.length || 0)
      } catch (error) {
        console.log('Department count not available (requires admin permission)')
      }

      // Build stats object
      const statsData: DashboardStats = {
        total_staff: totalStaff,
        total_departments: totalDepts,
        today_attendance: presentCount,
        on_break: onBreakCount,
        pending_payroll: 0,
      }
      setStats(statsData)

      // Build recent activity from attendance data
      const activityData: RecentActivity[] = attendanceData.slice(0, 5).map((a: any) => ({
        id: a.id,
        user_name: a.user?.name || 'Unknown',
        action: a.clock_out ? 'Clocked out' : a.clock_in ? 'Clocked in' : 'No activity',
        timestamp: a.clock_in || a.date,
      }))
      setRecentActivity(activityData)

      // Fetch my attendance for today
      if (user?.id) {
        try {
          // Fetch all attendance for today (without user filter to avoid permission issues)
          const myAttendanceResponse = await api.get(`/hrm/attendance?start_date=${today}&end_date=${today}`)
          console.log('=== ATTENDANCE API RESPONSE ===')
          console.log('Full response:', JSON.stringify(myAttendanceResponse.data, null, 2))

          // Extract data array - handle different response structures
          let myAttendanceData: any[] = []

          // Structure 1: { data: { data: { data: [...] } } }
          if (myAttendanceResponse.data?.data?.data?.data) {
            myAttendanceData = myAttendanceResponse.data.data.data.data
          }
          // Structure 2: { data: { data: [...] } }
          else if (Array.isArray(myAttendanceResponse.data?.data?.data)) {
            myAttendanceData = myAttendanceResponse.data.data.data
          }
          // Structure 3: { data: [...] }
          else if (Array.isArray(myAttendanceResponse.data?.data)) {
            myAttendanceData = myAttendanceResponse.data.data
          }

          console.log('Extracted attendance data:', myAttendanceData)
          console.log('Current user ID:', user.id, typeof user.id)
          console.log('Available records:', myAttendanceData.map((a: any) => ({
            id: a.id,
            userId: a.userId,
            user_id: a.user_id,
          })))

          // Find my attendance - handle both camelCase/snake_case and string/number
          const myRecord = myAttendanceData.find((a: any) => {
            const recordUserId = a.userId || a.user_id
            return String(recordUserId) === String(user.id)
          })

          console.log('Found my attendance record:', myRecord)

          if (myRecord) {
            // Normalize to snake_case format
            const normalizedRecord: MyAttendance = {
              id: myRecord.id,
              user_id: myRecord.userId || myRecord.user_id,
              date: myRecord.date,
              clock_in: myRecord.clockIn || myRecord.clock_in,
              clock_out: myRecord.clockOut || myRecord.clock_out,
              break_in: myRecord.breakIn || myRecord.break_in,
              break_out: myRecord.breakOut || myRecord.break_out,
              status: myRecord.status,
              note: myRecord.note,
            }
            console.log('Normalized attendance:', normalizedRecord)
            setMyAttendance(normalizedRecord)
          } else {
            console.log('No attendance found - setting to null')
            setMyAttendance(null)
          }
        } catch (error) {
          console.error('Error fetching my attendance:', error)
          setMyAttendance(null)
        }

        // Fetch attendance history for current user (last 30 days)
        try {
          const endDate = new Date().toISOString().split('T')[0]
          const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          const historyResponse = await api.get(`/hrm/attendance?start_date=${startDate}&end_date=${endDate}`)
          console.log('Attendance history response:', historyResponse)

          let historyData = []
          if (historyResponse.data?.data?.data) {
            historyData = historyResponse.data.data.data
          } else if (historyResponse.data?.data) {
            historyData = Array.isArray(historyResponse.data.data) ? historyResponse.data.data : []
          }

          console.log('Raw history data:', historyData)

          // Filter to current user's records and normalize
          const userHistory = historyData
            .filter((a: any) => a.userId === user.id || a.user_id === user.id)
            .map((record: any) => ({
              id: record.id,
              user_id: record.userId || record.user_id,
              date: record.date,
              clock_in: record.clockIn || record.clock_in,
              clock_out: record.clockOut || record.clock_out,
              break_in: record.breakIn || record.break_in,
              break_out: record.breakOut || record.break_out,
              status: record.status,
              note: record.note,
            }))
            .sort((a: MyAttendance, b: MyAttendance) => new Date(b.date).getTime() - new Date(a.date).getTime())

          console.log('User attendance history:', userHistory)
          setAttendanceHistory(userHistory)
        } catch (error) {
          console.error('Error fetching attendance history:', error)
          setAttendanceHistory([])
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function formatTime(timeString: string): string {
    if (!timeString) return '--:--'

    if (/^\d{2}:\d{2}:\d{2}$/.test(timeString)) {
      const [hours, minutes] = timeString.split(':')
      const hour = parseInt(hours, 10)
      const ampm = hour >= 12 ? 'PM' : 'AM'
      const hour12 = hour % 12 || 12
      return `${hour12}:${minutes} ${ampm}`
    }

    try {
      const date = new Date(timeString)
      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      return `${hours}:${minutes} ${ampm}`
    } catch {
      return timeString
    }
  }

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" />
      </Center>
    )
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={1}>{t('dashboard.adminTitle')}</Title>
            <Text c="dimmed">{t('dashboard.adminSubtitle')}</Text>
          </Box>
          {dailyQuote && (
            <Paper
              withBorder
              p="md"
              radius="lg"
              maw={450}
              bg="var(--mantine-color-blue-light)"
            >
              <Text size="md" fw={600} lh={1.4} c="var(--mantine-color-blue-filled)">
                "{dailyQuote}"
              </Text>
            </Paper>
          )}
        </Group>

        {/* Stats Cards */}
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
          <Card padding="lg" radius="md" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {t('dashboard.totalStaff')}
                </Text>
                <Text size="xl" fw={500}>
                  {stats?.total_staff || 0}
                </Text>
              </Stack>
              <ThemeIcon color="blue" size={40} radius="md">
                <IconUsers size={24} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card padding="lg" radius="md" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {t('dashboard.departments')}
                </Text>
                <Text size="xl" fw={500}>
                  {stats?.total_departments || 0}
                </Text>
              </Stack>
              <ThemeIcon color="cyan" size={40} radius="md">
                <IconBuilding size={24} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card padding="lg" radius="md" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {t('dashboard.todayPresent')}
                </Text>
                <Text size="xl" fw={500}>
                  {stats?.today_attendance || 0}
                </Text>
              </Stack>
              <ThemeIcon color="green" size={40} radius="md">
                <IconCalendarClock size={24} />
              </ThemeIcon>
            </Group>
          </Card>

          <Card padding="lg" radius="md" withBorder shadow="sm">
            <Group justify="space-between" align="flex-start">
              <Stack gap={0}>
                <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                  {t('dashboard.onBreak')}
                </Text>
                <Text size="xl" fw={500}>
                  {stats?.on_break || 0}
                </Text>
              </Stack>
              <ThemeIcon color="yellow" size={40} radius="md">
                <IconCoffee size={24} />
              </ThemeIcon>
            </Group>
          </Card>
        </SimpleGrid>

        {/* My Attendance Actions */}
        <AttendanceActions myAttendance={myAttendance} onRefresh={fetchDashboardData} />

        {/* Recent Activity Table - Only for admins */}
        {isAdmin && (
        <Paper withBorder p="md" radius="lg">
          <Title order={3} mb="md">{t('dashboard.todaysAttendanceActivity')}</Title>

          {recentActivity.length > 0 ? (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('dashboard.staffName')}</Table.Th>
                  <Table.Th>{t('dashboard.action')}</Table.Th>
                  <Table.Th>{t('dashboard.time')}</Table.Th>
                  <Table.Th>{t('dashboard.status')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {recentActivity.map((activity) => (
                  <Table.Tr key={activity.id}>
                    <Table.Td fw={500}>{activity.user_name}</Table.Td>
                    <Table.Td>{activity.action}</Table.Td>
                    <Table.Td>{formatTime(activity.timestamp)}</Table.Td>
                    <Table.Td>
                      <Badge
                        leftSection={<IconCheck size={10} />}
                        color="green"
                        variant="light"
                      >
                        {t('dashboard.present')}
                      </Badge>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          ) : (
            <Alert variant="light" color="blue" radius="md" icon={<IconAlertCircle size={16} />}>
              {t('dashboard.noAttendanceActivityToday')}
            </Alert>
          )}
        </Paper>
        )}

        {/* Attendance History */}
        <Paper withBorder p="md" radius="lg">
          <Title order={3} mb="md">{t('dashboard.myAttendanceHistory')}</Title>

          {attendanceHistory.length > 0 ? (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('dashboard.date')}</Table.Th>
                  <Table.Th>{t('dashboard.clockIn')}</Table.Th>
                  <Table.Th>{t('dashboard.clockOut')}</Table.Th>
                  <Table.Th>{t('dashboard.breaks')}</Table.Th>
                  <Table.Th>{t('dashboard.totalHours')}</Table.Th>
                  <Table.Th>{t('dashboard.status')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {attendanceHistory.map((record) => {
                  // Calculate total hours
                  let totalHours = '--'
                  if (record.clock_in && record.clock_out) {
                    try {
                      // Extract just the date part (YYYY-MM-DD) from the ISO string
                      const dateOnly = record.date.split('T')[0]
                      const clockIn = new Date(`${dateOnly}T${record.clock_in}`)
                      const clockOut = new Date(`${dateOnly}T${record.clock_out}`)

                      if (!isNaN(clockIn.getTime()) && !isNaN(clockOut.getTime())) {
                        const diffMs = clockOut.getTime() - clockIn.getTime()
                        const hours = Math.floor(diffMs / (1000 * 60 * 60))
                        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                        totalHours = `${hours}h ${minutes}m`
                      }
                    } catch (error) {
                      console.log('Error calculating hours:', error)
                      totalHours = '--'
                    }
                  }

                  // Format break times
                  const breakTimes = []
                  const breakIns = Array.isArray(record.break_in) ? record.break_in : []
                  const breakOuts = Array.isArray(record.break_out) ? record.break_out : []

                  for (let i = 0; i < breakIns.length; i++) {
                    const breakInTime = formatTime(breakIns[i])
                    const breakOutTime = i < breakOuts.length ? formatTime(breakOuts[i]) : t('dashboard.active')
                    breakTimes.push(`${breakInTime} - ${breakOutTime}`)
                  }

                  return (
                    <Table.Tr key={record.id}>
                      <Table.Td fw={500}>{formatDate(record.date)}</Table.Td>
                      <Table.Td>{record.clock_in ? formatTime(record.clock_in) : '--'}</Table.Td>
                      <Table.Td>{record.clock_out ? formatTime(record.clock_out) : '--'}</Table.Td>
                      <Table.Td>
                        {breakTimes.length > 0 ? (
                          <Stack gap={2}>
                            {breakTimes.map((time, idx) => (
                              <Text key={idx} size="sm" c="dimmed">
                                ☕ {time}
                              </Text>
                            ))}
                          </Stack>
                        ) : (
                          <Text c="dimmed">--</Text>
                        )}
                      </Table.Td>
                      <Table.Td>{totalHours}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={record.clock_out ? 'green' : record.clock_in ? 'blue' : 'gray'}
                          variant="light"
                        >
                          {record.clock_out ? t('dashboard.completed') : record.clock_in ? t('dashboard.inProgress') : t('dashboard.noRecord')}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          ) : (
            <Alert variant="light" color="blue" radius="md" icon={<IconAlertCircle size={16} />}>
              {t('dashboard.noAttendanceHistoryLast30Days')}
            </Alert>
          )}
        </Paper>
      </Stack>
    </Box>
  )
}
