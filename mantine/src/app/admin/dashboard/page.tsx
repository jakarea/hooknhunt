import { useState, useEffect } from 'react'
import { SimpleGrid, Paper, Text, Title, Box, Stack, Group, Button, Alert } from '@mantine/core'
import { QUOTES } from '@/config/quotes'
import { notifications } from '@mantine/notifications'
import { IconClock, IconClockCheck, IconLogout } from '@tabler/icons-react'
import api from '@/lib/api'

interface TodayAttendance {
  id: number
  user_id: number
  date: string
  clock_in: string
  clock_out?: string
  status: string
  note?: string
}

export default function AdminDashboardPage() {
  const [quote, setQuote] = useState('')
  const [loading, setLoading] = useState(false)
  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance | null>(null)

  useEffect(() => {
    // Get a quote based on the day of the month (1-31)
    const quotes = QUOTES.DASHBOARD_QUOTES
    const dayOfMonth = new Date().getDate()

    // Use day of month as index (subtract 1 for 0-based array)
    const quoteIndex = Math.min(dayOfMonth - 1, quotes.length - 1)
    setQuote(quotes[quoteIndex])

    // Fetch today's attendance
    fetchTodayAttendance()
  }, [])

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await api.get(`/hrm/attendance?date=${today}`)
      if (response.data?.data?.data && response.data.data.data.length > 0) {
        setTodayAttendance(response.data.data.data[0])
      }
    } catch {
      // Attendance record might not exist, that's ok
      console.log('No attendance record found for today')
    }
  }

  const handleClockIn = async () => {
    try {
      setLoading(true)
      await api.post('/hrm/clock-in')

      notifications.show({
        title: 'Success',
        message: 'Clocked in successfully at ' + new Date().toLocaleTimeString(),
        color: 'green',
      })

      // Refresh attendance
      fetchTodayAttendance()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to clock in'

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    try {
      setLoading(true)
      await api.post('/hrm/clock-out')

      notifications.show({
        title: 'Success',
        message: 'Clocked out successfully at ' + new Date().toLocaleTimeString(),
        color: 'green',
      })

      // Refresh attendance
      fetchTodayAttendance()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to clock out'

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to format time safely (Bangladesh time, 12-hour format)
  function formatTime(dateString: string | null): string {
    if (!dateString) return 'N/A'

    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString // Return original string if parsing fails
      }

      // Convert to 12-hour format manually
      let hours = date.getHours()
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // Convert 0 to 12

      return `${hours}:${minutes} ${ampm}`
    } catch {
      return dateString // Return original string on error
    }
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        <Box>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Title order={1}>Main Dashboard</Title>
              <Text c="dimmed">Sales & Stock Widgets</Text>
            </Box>
            {quote && (
              <Text
                size="lg"
                c="red"
                fw={500}
                style={{
                  lineHeight: 1.6,
                  fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
                  maxWidth: '500px',
                  textAlign: 'right',
                }}
              >
                {quote}
              </Text>
            )}
          </Group>
        </Box>

        {/* Attendance Section - Clock In/Out */}
        <Alert variant="light" color="blue" radius="lg" p="md">
          <Group justify="space-between" align="center">
            <Stack gap={0}>
              <Text fw={600} size="lg">Attendance</Text>
              {todayAttendance ? (
                <Text size="sm" c="dimmed">
                  {todayAttendance.clock_in && (
                    <>Clocked in at: {formatTime(todayAttendance.clock_in)}</>
                  )}
                  {todayAttendance.clock_out && (
                    <> • Clocked out at: {formatTime(todayAttendance.clock_out)}</>
                  )}
                  {!todayAttendance.clock_in && !todayAttendance.clock_out && 'No attendance recorded'}
                </Text>
              ) : (
                <Text size="sm" c="dimmed">No attendance recorded for today</Text>
              )}
            </Stack>
            <Group>
              {!todayAttendance?.clock_in ? (
                <Button
                  leftSection={<IconClock size={16} />}
                  onClick={handleClockIn}
                  loading={loading}
                  color="green"
                  size="lg"
                >
                  Clock In
                </Button>
              ) : !todayAttendance?.clock_out ? (
                <Button
                  leftSection={<IconClockCheck size={16} />}
                  onClick={handleClockOut}
                  loading={loading}
                  color="orange"
                  size="lg"
                >
                  Clock Out
                </Button>
              ) : (
                <Button
                  leftSection={<IconLogout size={16} />}
                  disabled
                  size="lg"
                  variant="light"
                >
                  Completed for Today
                </Button>
              )}
            </Group>
          </Group>
        </Alert>

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Total Sales</Text>
            <Text size="xl" fw="bold">$12,345</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Low Stock Items</Text>
            <Text size="xl" fw="bold">23</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Orders Today</Text>
            <Text size="xl" fw="bold">156</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Revenue</Text>
            <Text size="xl" fw="bold">$8,901</Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Box>
  )
}
