import { useState, useEffect, useMemo } from 'react'
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
  IconPlus,
  IconCheck,
  IconX,
  IconTrash,
  IconRefresh,
  IconCalendar,
  IconFilter,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

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

interface Employee {
  id: number
  name: string
}

interface FormData {
  user_id: string | null
  type: string | null
  start_date: string | null
  end_date: string | null
  reason: string
}

export default function LeavesPage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [statusFilter, setStatusFilter] = useState<string | null>('all')
  const [employeeFilter, setEmployeeFilter] = useState<string | null>(null)
  const [modalOpened, setModalOpened] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    user_id: null,
    type: null,
    start_date: null,
    end_date: null,
    reason: '',
  })

  // Check if current user is admin (super_admin or admin)
  const isAdmin = useMemo(() => {
    return user?.role?.name === 'super_admin' || user?.role?.name === 'admin'
  }, [user])

  // Fetch leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (statusFilter && statusFilter !== 'all') {
        params.status = statusFilter
      }
      if (employeeFilter) {
        params.user_id = employeeFilter
      }

      const response = await api.get('/hrm/leaves', { params })
      const leavesData = response.data.data?.data || response.data.data || []
      setLeaves(Array.isArray(leavesData) ? leavesData : [])
    } catch (error) {
      console.error('Failed to fetch leaves:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load leaves. Please try again.',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch employees for dropdown (only for admins)
  const fetchEmployees = async () => {
    if (!isAdmin) return // Non-admins don't need employee list

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
    fetchLeaves()
    fetchEmployees()
  }, [statusFilter, employeeFilter])

  // Handle refresh
  const handleRefresh = () => {
    fetchLeaves()
  }

  // Open create modal
  const openCreateModal = () => {
    setFormData({
      user_id: isAdmin ? null : String(user?.id), // Auto-set for non-admins
      type: null,
      start_date: null,
      end_date: null,
      reason: '',
    })
    setModalOpened(true)
  }

  // Handle save
  const handleSave = async () => {
    // Validation
    if (isAdmin && !formData.user_id) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select an employee',
        color: 'red',
      })
      return
    }

    if (!formData.type) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select leave type',
        color: 'red',
      })
      return
    }

    if (!formData.start_date) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select start date',
        color: 'red',
      })
      return
    }

    if (!formData.end_date) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please select end date',
        color: 'red',
      })
      return
    }

    try {
      setSaving(true)

      await api.post('/hrm/leaves', {
        user_id: formData.user_id,
        type: formData.type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason || null,
      })

      notifications.show({
        title: 'Success',
        message: 'Leave request created successfully',
        color: 'green',
      })

      setModalOpened(false)
      fetchLeaves()
    } catch (error: any) {
      console.error('Failed to save leave:', error)
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save leave. Please try again.',
        color: 'red',
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle approve
  const handleApprove = (leave: Leave) => {
    modals.openConfirmModal({
      title: 'Approve Leave Request',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to approve <strong>{leave.user?.name}</strong>'s {leave.type} leave
          from {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}?
        </Text>
      ),
      labels: {
        confirm: 'Approve',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'green' },
      onConfirm: async () => {
        try {
          await api.put(`/hrm/leaves/${leave.id}`, {
            status: 'approved',
          })
          notifications.show({
            title: 'Success',
            message: 'Leave request approved successfully',
            color: 'green',
          })
          fetchLeaves()
        } catch (error: any) {
          console.error('Failed to approve leave:', error)
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to approve leave. Please try again.',
            color: 'red',
          })
        }
      },
    })
  }

  // Handle reject
  const handleReject = (leave: Leave) => {
    modals.openConfirmModal({
      title: 'Reject Leave Request',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to reject <strong>{leave.user?.name}</strong>'s {leave.type} leave
          from {new Date(leave.start_date).toLocaleDateString()} to {new Date(leave.end_date).toLocaleDateString()}?
        </Text>
      ),
      labels: {
        confirm: 'Reject',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await api.put(`/hrm/leaves/${leave.id}`, {
            status: 'rejected',
          })
          notifications.show({
            title: 'Success',
            message: 'Leave request rejected successfully',
            color: 'green',
          })
          fetchLeaves()
        } catch (error: any) {
          console.error('Failed to reject leave:', error)
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to reject leave. Please try again.',
            color: 'red',
          })
        }
      },
    })
  }

  // Handle delete
  const handleDelete = (leave: Leave) => {
    modals.openConfirmModal({
      title: 'Delete Leave Request',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this leave request for <strong>{leave.user?.name}</strong>?
        </Text>
      ),
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await api.delete(`/hrm/leaves/${leave.id}`)
          notifications.show({
            title: 'Success',
            message: 'Leave request deleted successfully',
            color: 'green',
          })
          fetchLeaves()
        } catch (error: any) {
          console.error('Failed to delete leave:', error)
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete leave. Please try again.',
            color: 'red',
          })
        }
      },
    })
  }

  // Stats
  const totalLeaves = leaves.length
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length
  const approvedLeaves = leaves.filter(l => l.status === 'approved').length
  const rejectedLeaves = leaves.filter(l => l.status === 'rejected').length

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">
                {isAdmin ? 'Leave Management' : 'My Leave Requests'}
              </Title>
              <Text c="dimmed" className="text-sm md:text-base">
                {isAdmin ? 'Manage employee leave requests' : 'View and manage your leave requests'}
              </Text>
            </Box>
            <Group >
              <ActionIcon
                variant="light"
                size="lg"
                onClick={handleRefresh}
                loading={loading}
              >
                <IconRefresh size={18} />
              </ActionIcon>
              <Button
                onClick={openCreateModal}
                leftSection={<IconPlus size={16} />}
              >
                {isAdmin ? 'Add Leave' : 'Apply for Leave'}
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Stats */}
        <Stack  display={{ base: 'none', md: 'flex' }}>
          <Group >
            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group >
                <IconCalendar size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                <Text size="xs" c="dimmed">Total Requests</Text>
              </Group>
              <Text size="xl" fw={700}>{totalLeaves}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group >
                <IconCalendar size={20} style={{ color: 'var(--mantine-color-yellow-filled)' }} />
                <Text size="xs" c="dimmed">Pending</Text>
              </Group>
              <Text size="xl" fw={700}>{pendingLeaves}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group >
                <IconCheck size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
                <Text size="xs" c="dimmed">Approved</Text>
              </Group>
              <Text size="xl" fw={700}>{approvedLeaves}</Text>
            </Card>

            <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
              <Group >
                <IconX size={20} style={{ color: 'var(--mantine-color-red-filled)' }} />
                <Text size="xs" c="dimmed">Rejected</Text>
              </Group>
              <Text size="xl" fw={700}>{rejectedLeaves}</Text>
            </Card>
          </Group>
        </Stack>

        {/* Filters */}
        <Group justify="space-between">
          <Group >
            <Select
              placeholder="Filter by status"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'all', label: 'All Status' },
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'rejected', label: 'Rejected' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '150px' }}
              size="md"
            />
            {isAdmin && (
              <Select
                placeholder="Filter by employee"
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
                <Table.Th>Type</Table.Th>
                <Table.Th>Dates</Table.Th>
                <Table.Th>Days</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Status</Table.Th>
                {isAdmin && <Table.Th>Approved By</Table.Th>}
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {leaves.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={isAdmin ? 8 : 6}>
                    <Box py="xl" ta="center">
                      <Text c="dimmed">No leave requests found</Text>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ) : (
                leaves.map((leave) => (
                  <Table.Tr key={leave.id}>
                    {isAdmin && (
                      <Table.Td>
                        <Text fw={500} size="sm">{leave.user?.name || 'N/A'}</Text>
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Badge
                        color={
                          leave.type === 'sick' ? 'red' :
                          leave.type === 'casual' ? 'blue' :
                          'gray'
                        }
                        variant="light"
                        size="sm"
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
                    {isAdmin && (
                      <Table.Td>
                        <Text size="sm">{leave.approver?.name || 'N/A'}</Text>
                      </Table.Td>
                    )}
                    <Table.Td>
                      <Group >
                        {isAdmin && leave.status === 'pending' && (
                          <>
                            <ActionIcon
                              variant="subtle"
                              color="green"
                              size="sm"
                              onClick={() => handleApprove(leave)}
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              onClick={() => handleReject(leave)}
                            >
                              <IconX size={16} />
                            </ActionIcon>
                          </>
                        )}
                        {(isAdmin || leave.status === 'pending') && (
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            size="sm"
                            onClick={() => handleDelete(leave)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))
              )}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>

      {/* Create Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={isAdmin ? "Create Leave Request" : "Apply for Leave"}
        centered
      >
        <Stack >
          {isAdmin ? (
            <Stack >
              <Text size="sm" fw={500}>Employee *</Text>
              <Select
                placeholder="Select employee"
                data={employees.map(emp => ({ value: String(emp.id), label: emp.name }))}
                value={formData.user_id}
                onChange={(value) => setFormData({ ...formData, user_id: value })}
                searchable
                size="md"
              />
            </Stack>
          ) : (
            <Stack >
              <Text size="sm" fw={500}>Employee</Text>
              <Text size="sm">{user?.name}</Text>
            </Stack>
          )}

          <Stack >
            <Text size="sm" fw={500}>Leave Type *</Text>
            <Select
              placeholder="Select leave type"
              data={[
                { value: 'sick', label: 'Sick Leave' },
                { value: 'casual', label: 'Casual Leave' },
                { value: 'unpaid', label: 'Unpaid Leave' },
              ]}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              size="md"
            />
          </Stack>

          <Group >
            <Stack  style={{ flex: 1 }}>
              <Text size="sm" fw={500}>Start Date *</Text>
              <TextInput
                type="date"
                placeholder="Pick start date"
                value={typeof formData.start_date === 'string' ? formData.start_date : ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.currentTarget.value })}
                size="md"
              />
            </Stack>

            <Stack  style={{ flex: 1 }}>
              <Text size="sm" fw={500}>End Date *</Text>
              <TextInput
                type="date"
                placeholder="Pick end date"
                value={typeof formData.end_date === 'string' ? formData.end_date : ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.currentTarget.value })}
                size="md"
                min={typeof formData.start_date === 'string' ? formData.start_date : undefined}
              />
            </Stack>
          </Group>

          <Stack >
            <Text size="sm" fw={500}>Reason</Text>
            <Textarea
              placeholder="Enter reason (optional)"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.currentTarget.value })}
              size="md"
              rows={3}
            />
          </Stack>

          <Group justify="flex-end" >
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
              Create Leave Request
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}
