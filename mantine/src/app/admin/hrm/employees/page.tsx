import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Card,
  TextInput,
  ActionIcon,
  SimpleGrid,
  Table,
  Avatar,
  LoadingOverlay,
  Pagination,
  Tooltip,
} from '@mantine/core'
import {
  IconPlus,
  IconSearch,
  IconMail,
  IconBuilding,
  IconRefresh,
  IconEye,
  IconPencil,
  IconTrash,
  IconUsers,
  IconBriefcase,
  IconClock,
  IconBan,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { usePermissions } from '@/hooks/usePermissions'

interface Employee {
  id: number
  name: string
  phone: string
  email?: string
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
    department?: {
      id: number
      name: string
    }
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

interface PaginatedResponse {
  data: Employee[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function EmployeesPage() {
  const { user: currentUser } = useAuthStore()
  const { hasPermission } = usePermissions()
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [employeesData, setEmployeesData] = useState<PaginatedResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [deletingEmployeeId, setDeletingEmployeeId] = useState<number | null>(null)

  // Fetch employees from API
  const fetchEmployees = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true)
      const params: Record<string, string | number> = {
        page,
      }
      if (search) params.search = search

      const response = await api.get('/hrm/employees', { params })

      const paginatedData = response.data.data
      setEmployeesData({
        data: paginatedData.data || [],
        current_page: paginatedData.current_page || 1,
        last_page: paginatedData.last_page || 1,
        per_page: paginatedData.per_page || 20,
        total: paginatedData.total || 0
      })
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to load employees. Please try again.',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchEmployees(1, '')
  }, [])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1)
      fetchEmployees(1, searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchEmployees(page, searchQuery)
  }

  // Handle refresh
  const handleRefresh = () => {
    fetchEmployees(currentPage, searchQuery)
  }

  // Handle delete
  const openDeleteModal = (id: number, name: string) => {
    // Prevent users from deleting themselves
    if (id === currentUser?.id) {
      notifications.show({
        title: 'Action Not Allowed',
        message: 'You cannot delete your own account.',
        color: 'red',
      })
      return
    }

    modals.openConfirmModal({
      title: 'Delete Employee',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          setDeletingEmployeeId(id)
          await api.delete(`/hrm/employees/${id}`)
          notifications.show({
            title: 'Employee Deleted',
            message: `${name} has been deleted successfully`,
            color: 'green',
          })
          fetchEmployees(currentPage, searchQuery)
        } catch {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete employee. Please try again.',
            color: 'red',
          })
        } finally {
          setDeletingEmployeeId(null)
        }
      },
    })
  }

  const employees = useMemo(() => employeesData?.data || [], [employeesData])
  const totalPages = employeesData?.last_page || 1

  // Calculate stats from real data
  const totalEmployees = employeesData?.total || 0
  const activeEmployees = useMemo(() => employees.filter(e => e.is_active).length, [employees])
  const onLeaveEmployees = 0 // No leave status in current data structure
  const departmentsCount = useMemo(
    () => new Set(employees.map(e => e.profile?.department_id)).size,
    [employees]
  )

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name[0].toUpperCase()
  }

  // Format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A'
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">Employees</Title>
              <Text c="dimmed" className="text-sm md:text-base">Manage your team members</Text>
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
              {hasPermission('employee.create') && (
                <Button
                  component={Link}
                  to="/hrm/employees/create"
                  leftSection={<IconPlus size={16} />}
                >
                  Add Employee
                </Button>
              )}
            </Group>
          </Group>
        </Box>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconUsers size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
              <Text size="xs" c="dimmed">Total Employees</Text>
            </Group>
            <Text size="xl" fw={700}>{totalEmployees}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconBriefcase size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
              <Text size="xs" c="dimmed">Active</Text>
            </Group>
            <Text size="xl" fw={700}>{activeEmployees}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconClock size={20} style={{ color: 'var(--mantine-color-orange-filled)' }} />
              <Text size="xs" c="dimmed">On Leave</Text>
            </Group>
            <Text size="xl" fw={700}>{onLeaveEmployees}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconBuilding size={20} style={{ color: 'var(--mantine-color-purple-filled)' }} />
              <Text size="xs" c="dimmed">Departments</Text>
            </Group>
            <Text size="xl" fw={700}>{departmentsCount}</Text>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Group justify="space-between">
          <Group  style={{ flex: 1, maxWidth: '100%' }}>
            <TextInput
              placeholder="Search employees..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: '400px' }}
              size="md"
            />
          </Group>
        </Group>

        {/* Desktop Table */}
        <Card withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }} shadow="sm" pos="relative">
          <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
          <Table.ScrollContainer minWidth={1200}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Employee</Table.Th>
                  <Table.Th>Department</Table.Th>
                  <Table.Th>Position</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Joined</Table.Th>
                  <Table.Th>Salary</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {employees.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Box py="xl" ta="center">
                        <Text c="dimmed">No employees found</Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  employees.map((employee) => (
                    <Table.Tr key={employee.id}>
                      <Table.Td>
                        <Group >
                          <Avatar
                            alt={employee.name}
                            radius="xl"
                            size="sm"
                            color="red"
                          >
                            {getInitials(employee.name)}
                          </Avatar>
                          <Box>
                            <Text fw={600} size="sm">{employee.name}</Text>
                            {employee.email && <Text size="xs" c="dimmed">{employee.email}</Text>}
                            <Text size="xs" c="dimmed">{employee.phone}</Text>
                          </Box>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        {employee.profile?.department ? (
                          <Badge size="sm" variant="light">{employee.profile.department.name}</Badge>
                        ) : (
                          <Text size="sm" c="dimmed">N/A</Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{employee.profile?.designation || 'N/A'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          color={employee.is_active ? 'green' : 'gray'}
                          variant="light"
                          size="sm"
                        >
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{formatDate(employee.profile?.joining_date)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text fw={600} size="sm">{formatCurrency(employee.profile?.base_salary)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group >
                          <ActionIcon
                            variant="subtle"
                            color="blue"
                            component={Link}
                            to={`/hrm/employees/${employee.id}`}
                            size="sm"
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            component={Link}
                            to={`/hrm/employees/${employee.id}/edit`}
                            size="sm"
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                          <Tooltip
                            label={employee.id === currentUser?.id ? "You cannot delete your own account" : "Delete employee"}
                          >
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="sm"
                              loading={deletingEmployeeId === employee.id}
                              disabled={employee.id === currentUser?.id}
                              onClick={() => openDeleteModal(employee.id, employee.name)}
                            >
                              {employee.id === currentUser?.id ? <IconBan size={16} /> : <IconTrash size={16} />}
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>

        {/* Mobile Card View */}
        <Stack  display={{ base: 'block', md: 'none' }}>
          {employees.length === 0 ? (
            <Card withBorder p="xl" ta="center" shadow="sm">
              <Text c="dimmed">No employees found</Text>
            </Card>
          ) : (
            employees.map((employee) => (
              <Card key={employee.id} shadow="sm" p="sm" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Group >
                    <Avatar
                      alt={employee.name}
                      radius="xl"
                      size="md"
                      color="red"
                    >
                      {getInitials(employee.name)}
                    </Avatar>
                    <Box>
                      <Text fw={600} size="sm">{employee.name}</Text>
                      <Text size="xs" c="dimmed">{employee.phone}</Text>
                    </Box>
                  </Group>
                  <Badge
                    color={employee.is_active ? 'green' : 'gray'}
                    variant="light"
                    size="sm"
                  >
                    {employee.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>

                {employee.email && (
                  <Group gap={6} mb="xs">
                    <IconMail size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
                    <Text size="xs">{employee.email}</Text>
                  </Group>
                )}

                <SimpleGrid cols={2}  mb="xs">
                  <Box>
                    <Text size="xs" c="dimmed">Department</Text>
                    {employee.profile?.department ? (
                      <Badge size="xs" variant="light">{employee.profile.department.name}</Badge>
                    ) : (
                      <Text size="xs">N/A</Text>
                    )}
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Position</Text>
                    <Text size="xs">{employee.profile?.designation || 'N/A'}</Text>
                  </Box>
                </SimpleGrid>

                <SimpleGrid cols={2} >
                  <Box>
                    <Text size="xs" c="dimmed">Joined</Text>
                    <Text size="xs">{formatDate(employee.profile?.joining_date)}</Text>
                  </Box>
                  <Box>
                    <Text size="xs" c="dimmed">Salary</Text>
                    <Text fw={600} size="xs">{formatCurrency(employee.profile?.base_salary)}</Text>
                  </Box>
                </SimpleGrid>

                <Group  mt="xs">
                  <Button
                    variant="light"
                    size="xs"
                    component={Link}
                    to={`/hrm/employees/${employee.id}`}
                    leftSection={<IconEye size={14} />}
                    style={{ flex: 1 }}
                  >
                    View
                  </Button>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    component={Link}
                    to={`/hrm/employees/${employee.id}/edit`}
                    size="sm"
                  >
                    <IconPencil size={16} />
                  </ActionIcon>
                  <Tooltip
                    label={employee.id === currentUser?.id ? "You cannot delete your own account" : "Delete employee"}
                  >
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      size="sm"
                      loading={deletingEmployeeId === employee.id}
                      disabled={employee.id === currentUser?.id}
                      onClick={() => openDeleteModal(employee.id, employee.name)}
                    >
                      {employee.id === currentUser?.id ? <IconBan size={16} /> : <IconTrash size={16} />}
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Card>
            ))
          )}
        </Stack>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="flex-end">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={handlePageChange}
              size="sm"
            />
          </Group>
        )}
      </Stack>
    </Box>
  )
}
