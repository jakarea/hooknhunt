import { useState, useEffect } from 'react'
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Overlay,
  Container,
  ThemeIcon,
  Alert,
} from '@mantine/core'
import {
  IconClock,
  IconClockCheck,
  IconCoffee,
  IconCoffeeOff,
  IconLock,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

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

interface AttendanceActionsProps {
  myAttendance: MyAttendance | null
  onRefresh: () => void
}

export default function AttendanceActions({ myAttendance, onRefresh }: AttendanceActionsProps) {
  const [actionLoading, setActionLoading] = useState(false)
  const [breakDuration, setBreakDuration] = useState(0)

  // Update break duration every second when on break
  useEffect(() => {
    const breakIns = Array.isArray(myAttendance?.break_in) ? myAttendance.break_in : []
    const breakOuts = Array.isArray(myAttendance?.break_out) ? myAttendance.break_out : []
    const isOnBreak = myAttendance?.clock_in && !myAttendance?.clock_out && breakIns.length > breakOuts.length

    if (!isOnBreak || breakIns.length === 0) {
      setBreakDuration(0)
      return
    }

    // Get the most recent break_in time
    const lastBreakIn = breakIns[breakIns.length - 1]

    if (!lastBreakIn) {
      setBreakDuration(0)
      return
    }

    // Parse the break_in time - could be full ISO or just HH:MM:SS
    let breakInTime: Date
    if (lastBreakIn.includes('T') || lastBreakIn.includes('-')) {
      // Full datetime string - use as-is
      breakInTime = new Date(lastBreakIn)
    } else {
      // Time only (HH:MM:SS) - create local date to avoid timezone issues
      const [hours, minutes, seconds] = lastBreakIn.split(':').map(Number)
      breakInTime = new Date()
      breakInTime.setHours(hours, minutes, seconds || 0, 0)
    }

    // Validate the date
    if (isNaN(breakInTime.getTime())) {
      setBreakDuration(0)
      return
    }

    // Calculate initial duration
    const updateDuration = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - breakInTime.getTime()) / 1000)
      setBreakDuration(diff > 0 ? diff : 0)
    }

    // Update immediately and then every second
    updateDuration()
    const interval = setInterval(updateDuration, 1000)

    return () => clearInterval(interval)
  }, [myAttendance])

  const handleClockIn = async () => {
    try {
      setActionLoading(true)
      await api.post('/hrm/clock-in')
      notifications.show({
        title: 'Success',
        message: `Clocked in successfully at ${new Date().toLocaleTimeString()}`,
        color: 'green',
      })
    } catch (error: unknown) {
      let errorMessage = 'Failed to clock in'
      if (error && typeof error === 'object' && 'response' in error) {
        errorMessage = (error as any).response?.data?.message || errorMessage
      }
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      // Always refresh attendance data, even if there was an error
      // (User might already be clocked in from a previous action)
      await onRefresh()
    }
  }

  const handleBreakIn = async () => {
    try {
      setActionLoading(true)
      await api.post('/hrm/break-in')
      notifications.show({
        title: 'Success',
        message: `Break started at ${new Date().toLocaleTimeString()}`,
        color: 'green',
      })
    } catch (error: unknown) {
      let errorMessage = 'Failed to start break'
      if (error && typeof error === 'object' && 'response' in error) {
        errorMessage = (error as any).response?.data?.message || errorMessage
      }
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      // Always refresh attendance data
      await onRefresh()
    }
  }

  const handleBreakOut = async () => {
    try {
      setActionLoading(true)
      await api.post('/hrm/break-out')
      notifications.show({
        title: 'Success',
        message: `Break ended at ${new Date().toLocaleTimeString()}`,
        color: 'green',
      })
    } catch (error: unknown) {
      let errorMessage = 'Failed to end break'
      if (error && typeof error === 'object' && 'response' in error) {
        errorMessage = (error as any).response?.data?.message || errorMessage
      }
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      // Always refresh attendance data
      await onRefresh()
    }
  }

  const handleClockOut = async () => {
    try {
      setActionLoading(true)
      await api.post('/hrm/clock-out')
      notifications.show({
        title: 'Success',
        message: `Clocked out at ${new Date().toLocaleTimeString()}`,
        color: 'green',
      })
    } catch (error: unknown) {
      let errorMessage = 'Failed to clock out'
      if (error && typeof error === 'object' && 'response' in error) {
        errorMessage = (error as any).response?.data?.message || errorMessage
      }
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setActionLoading(false)
      // Always refresh attendance data
      await onRefresh()
    }
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

  function formatBreakDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const formatNum = (num: number) => num.toString().padStart(2, '0')

    if (hours > 0) {
      return `${formatNum(hours)}:${formatNum(minutes)}:${formatNum(secs)}`
    }
    return `${formatNum(minutes)}:${formatNum(secs)}`
  }

  return (
    <>
      <Paper withBorder p="md" radius="lg">
        <Group justify="space-between" align="center">
          <Group gap={0}>
            <Stack gap={0}>
              <Title order={3} mb={0}>My Attendance Actions 222</Title>
              <Text size="sm" c="dimmed">
                {myAttendance ? (
                  <>
                    {myAttendance.clock_in && <>Clocked in at {formatTime(myAttendance.clock_in)}</>}
                    {myAttendance.clock_out && <> • Clocked out at {formatTime(myAttendance.clock_out)}</>}
                  </>
                ) : (
                  <>No attendance recorded today</>
                )}
              </Text>
            </Stack>
          </Group>
          <Group>
            {!myAttendance?.clock_in ? (
              // Not clocked in yet - show Clock In button
              <Button
                leftSection={<IconClock size={16} />}
                onClick={handleClockIn}
                loading={actionLoading}
                color="green"
                size="lg"
              >
                Clock In
              </Button>
            ) : myAttendance?.clock_out ? (
              // Clocked out - show completed button
              <Button
                leftSection={<IconClockCheck size={16} />}
                disabled
                size="lg"
                variant="light"
              >
                Completed for Today
              </Button>
            ) : (
              // Clocked in but not clocked out - check if on break
              (() => {
                const breakInCount = Array.isArray(myAttendance?.break_in) ? myAttendance.break_in.length : 0
                const breakOutCount = Array.isArray(myAttendance?.break_out) ? myAttendance.break_out.length : 0
                const isOnBreak = breakInCount > breakOutCount

                if (isOnBreak) {
                  // Currently on break - show Break Out button
                  return (
                    <Button
                      leftSection={<IconCoffeeOff size={16} />}
                      onClick={handleBreakOut}
                      loading={actionLoading}
                      color="orange"
                      size="lg"
                    >
                      End Break
                    </Button>
                  )
                } else {
                  // Not on break - show both Take Break AND Clock Out buttons
                  return (
                    <>
                      <Button
                        leftSection={<IconCoffee size={16} />}
                        onClick={handleBreakIn}
                        loading={actionLoading}
                        color="yellow"
                        size="lg"
                        variant="light"
                      >
                        Take Break
                      </Button>
                      <Button
                        leftSection={<IconClockCheck size={16} />}
                        onClick={handleClockOut}
                        loading={actionLoading}
                        color="red"
                        size="lg"
                      >
                        Clock Out
                      </Button>
                    </>
                  )
                }
              })()
            )}
          </Group>
        </Group>
      </Paper>

      {/* Break Overlay - Shows when user is on break */}
      {(() => {
        const breakInCount = Array.isArray(myAttendance?.break_in) ? myAttendance.break_in.length : 0
        const breakOutCount = Array.isArray(myAttendance?.break_out) ? myAttendance.break_out.length : 0
        const isOnBreak = myAttendance?.clock_in && !myAttendance?.clock_out && breakInCount > breakOutCount

        if (!isOnBreak) return null

        return (
          <Overlay
            color="#000"
            backgroundOpacity={0.85}
            zIndex={1000}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Container size="sm" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stack align="center" gap="xl" maw={600}>
                <ThemeIcon color="yellow" size={80} radius="50%">
                  <IconCoffee size={40} />
                </ThemeIcon>

                <Stack align="center" gap={0}>
                  <Title order={1} c="white">You're on Break</Title>
                  <Text c="dimmed" size="lg" ta="center">
                    Relax and recharge! Take your time.
                  </Text>
                  {myAttendance?.clock_in && (
                    <Text c="yellow" size="sm" mt="md">
                      Clocked in at {formatTime(myAttendance.clock_in)}
                    </Text>
                  )}
                </Stack>

                <Button
                  leftSection={<IconCoffeeOff size={20} />}
                  onClick={handleBreakOut}
                  loading={actionLoading}
                  color="orange"
                  size="xl"
                  radius="xl"
                >
                  End Break
                </Button>

                {/* Break Timer */}
                <Paper
                  p="lg"
                  radius="xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.15) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 0 30px rgba(249, 115, 22, 0.2)',
                  }}
                >
                  <Stack align="center" gap="xs">
                    <Text size="sm" c="orange" fw={600} tt="uppercase">
                      ⏱️ Break Duration
                    </Text>
                    <Text
                      size="48px"
                      fw={900}
                      style={{
                        fontFamily: 'monospace',
                        color: '#ffffff',
                        textShadow: '0 0 20px rgba(249, 115, 22, 0.8), 0 0 40px rgba(249, 115, 22, 0.4)',
                        letterSpacing: '4px',
                        lineHeight: 1,
                      }}
                    >
                      {formatBreakDuration(breakDuration)}
                    </Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      Hours : Minutes : Seconds
                    </Text>
                  </Stack>
                </Paper>

                <Alert variant="light" color="yellow" radius="md" w="100%">
                  <Group gap="xs">
                    <IconLock size={16} />
                    <Text size="sm">
                      System is temporarily locked during break time
                    </Text>
                  </Group>
                </Alert>
              </Stack>
            </Container>
          </Overlay>
        )
      })()}
    </>
  )
}
