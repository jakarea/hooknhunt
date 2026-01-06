import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Table,
  Badge,
  ActionIcon,
  Paper,
  Card,
  Grid,
  TextInput,
  Select,
} from '@mantine/core'
import { IconPlus, IconPencil, IconTrash, IconSearch, IconEye, IconWallet, IconShoppingBag } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

// Mock data - using directly until API is ready
const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+880 1712-345678',
    type: 'retail',
    wallet_balance: 1500.00,
    total_orders: 15,
    total_spent: 45000.00,
    loyalty_points: 450,
    status: 'active',
    created_at: '2024-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+880 1812-345678',
    type: 'wholesale',
    wallet_balance: 5000.00,
    total_orders: 42,
    total_spent: 285000.00,
    loyalty_points: 2850,
    status: 'active',
    created_at: '2024-02-20',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '+880 1912-345678',
    type: 'retail',
    wallet_balance: 0.00,
    total_orders: 3,
    total_spent: 4500.00,
    loyalty_points: 45,
    status: 'active',
    created_at: '2024-03-10',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    phone: '+880 1612-345678',
    type: 'retail',
    wallet_balance: -500.00,
    total_orders: 8,
    total_spent: 12000.00,
    loyalty_points: 120,
    status: 'inactive',
    created_at: '2024-04-05',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    phone: '+880 1312-345678',
    type: 'wholesale',
    wallet_balance: 12000.00,
    total_orders: 67,
    total_spent: 520000.00,
    loyalty_points: 5200,
    status: 'active',
    created_at: '2024-05-12',
  },
]

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string | null>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter customers based on search and type
  const filteredCustomers = useMemo(() => {
    let result = mockCustomers

    // Type filter
    if (typeFilter && typeFilter !== 'all') {
      result = result.filter((customer) => customer.type === typeFilter)
    }

    // Search filter
    if (!searchQuery.trim()) {
      return result
    }

    const query = searchQuery.toLowerCase()
    return result.filter((customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    )
  }, [searchQuery, typeFilter])

  // Pagination - reset to page 1 when filters change by using currentPage as derived state
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage

  // Pagination
  const paginatedCustomers = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredCustomers.slice(startIndex, endIndex)
  }, [filteredCustomers, safeCurrentPage, itemsPerPage])

  const customers = paginatedCustomers

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Memoized desktop table rows
  const desktopRows = useMemo(() => {
    return customers.map((customer) => {
      const formattedDate = new Date(customer.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      return (
        <Table.Tr key={customer.id}>
          <Table.Td>
            <Text fw={600} size="sm">{customer.name}</Text>
            <Text size="xs" c="dimmed">{customer.email}</Text>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{customer.phone}</Text>
          </Table.Td>
          <Table.Td>
            <Badge
              color={customer.type === 'wholesale' ? 'blue' : 'gray'}
              variant="light"
            >
              {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Group >
              <Text size="sm" fw={500}>{formatCurrency(customer.wallet_balance)}</Text>
              {customer.wallet_balance < 0 && (
                <Badge size="xs" color="red" variant="light">Due</Badge>
              )}
            </Group>
          </Table.Td>
          <Table.Td>
            <Group >
              <Text size="sm">{customer.total_orders}</Text>
              <Text size="xs" c="dimmed">orders</Text>
            </Group>
          </Table.Td>
          <Table.Td>
            <Text size="sm" fw={500}>{formatCurrency(customer.total_spent)}</Text>
          </Table.Td>
          <Table.Td>
            <Badge
              color={customer.status === 'active' ? 'green' : 'gray'}
              variant="light"
            >
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </Badge>
          </Table.Td>
          <Table.Td>
            <Text size="sm">{formattedDate}</Text>
          </Table.Td>
          <Table.Td>
            <Group >
              <ActionIcon
                variant="subtle"
                color="gray"
                component={Link}
                to={`/crm/customers/${customer.id}`}
                aria-label="View Profile"
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="blue"
                component={Link}
                to={`/crm/customers/${customer.id}/edit`}
                aria-label="Edit Customer"
              >
                <IconPencil size={16} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() => openDeleteModal(customer.id, customer.name)}
                aria-label="Delete Customer"
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          </Table.Td>
        </Table.Tr>
      )
    })
  }, [customers])

  // Memoized mobile cards
  const mobileCards = useMemo(() => {
    return customers.map((customer) => {
      const formattedDate = new Date(customer.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })

      return (
        <Card key={customer.id} shadow="sm" p={{ base: 'lg', md: 'md' }} radius="md" withBorder mb="md">
          <Stack >
            {/* Header with name and actions */}
            <Group justify="space-between">
              <Box style={{ flex: 1 }}>
                <Text fw={700} size="lg">{customer.name}</Text>
                <Text size="sm" c="dimmed">{customer.email}</Text>
                <Text size="xs" c="dimmed" mt={2}>{customer.phone}</Text>
              </Box>
              <Group >
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  component={Link}
                  to={`/crm/customers/${customer.id}`}
                  aria-label="View Profile"
                >
                  <IconEye size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  component={Link}
                  to={`/crm/customers/${customer.id}/edit`}
                  aria-label="Edit Customer"
                >
                  <IconPencil size={16} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => openDeleteModal(customer.id, customer.name)}
                  aria-label="Delete Customer"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>

            {/* Customer Type & Status */}
            <Group >
              <Badge
                color={customer.type === 'wholesale' ? 'blue' : 'gray'}
                variant="light"
              >
                {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
              </Badge>
              <Badge
                color={customer.status === 'active' ? 'green' : 'gray'}
                variant="light"
              >
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </Group>

            {/* Details */}
            <Grid>
              <Grid.Col span={6}>
                <Group >
                  <IconWallet size={16} />
                  <Box>
                    <Text size="xs" c="dimmed">Wallet</Text>
                    <Text size="sm" fw={500}>{formatCurrency(customer.wallet_balance)}</Text>
                  </Box>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group >
                  <IconShoppingBag size={16} />
                  <Box>
                    <Text size="xs" c="dimmed">Orders</Text>
                    <Text size="sm" fw={500}>{customer.total_orders}</Text>
                  </Box>
                </Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Total Spent</Text>
                <Text size="sm" fw={500}>{formatCurrency(customer.total_spent)}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Joined</Text>
                <Text size="sm" fw={500}>{formattedDate}</Text>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>
      )
    })
  }, [customers])

  const openDeleteModal = (_id: number, name: string) => {
    modals.openConfirmModal({
      title: 'Delete Customer',
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
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))
          notifications.show({
            title: 'Customer Deleted',
            message: `${name} has been deleted successfully`,
            color: 'green',
          })
        } catch {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete customer. Please try again.',
            color: 'red',
          })
        }
      },
    })
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Title order={1} className="text-lg md:text-xl lg:text-2xl">Customers</Title>
          <Text c="dimmed" className="text-sm md:text-base">Manage your customer database and track orders</Text>
        </Box>

        {/* Search and Filters */}
        <Group justify="space-between">
          <Group  style={{ flex: 1, maxWidth: '100%' }}>
            <TextInput
              placeholder="Search by name, email, or phone..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: '400px' }}
              size="md"
            />
            <Select
              placeholder="Filter by type"
              value={typeFilter}
              onChange={setTypeFilter}
              data={[
                { value: 'all', label: 'All Types' },
                { value: 'retail', label: 'Retail' },
                { value: 'wholesale', label: 'Wholesale' },
              ]}
              size="md"
              style={{ minWidth: '150px' }}
              clearable
            />
          </Group>
          <Button
            component={Link}
            to="/crm/customers/create"
            leftSection={<IconPlus size={16} />}
          >
            Add Customer
          </Button>
        </Group>

        {/* Mobile: Card View */}
        <Stack  display={{ base: 'block', md: 'none' }}>
          {customers.length === 0 ? (
            <Paper withBorder p="xl" ta="center">
              <Text c="dimmed">No customers found</Text>
            </Paper>
          ) : (
            mobileCards
          )}
        </Stack>

        {/* Desktop: Table View */}
        <Paper withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }}>
          <Table.ScrollContainer minWidth={1200}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Customer</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Wallet</Table.Th>
                  <Table.Th>Orders</Table.Th>
                  <Table.Th>Total Spent</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Joined</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {customers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={9}>
                      <Box py="xl" ta="center">
                        <Text c="dimmed">No customers found</Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  desktopRows
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="flex-end" >
            <Button
              variant="light"
              size="sm"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Text size="sm" c="dimmed">
              Page {safeCurrentPage} of {totalPages}
            </Text>
            <Button
              variant="light"
              size="sm"
              disabled={safeCurrentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </Group>
        )}
      </Stack>
    </Box>
  )
}
