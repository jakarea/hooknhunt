import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Paper,
  SimpleGrid,
  Card,
  Table,
  ActionIcon,
  Avatar,
  Anchor,
  Breadcrumbs,
  Tabs,
  Timeline,
} from '@mantine/core'
import {
  IconChevronRight,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconShoppingBag,
  IconWallet,
  IconCoin,
  IconArrowLeft,
  IconPackage,
  IconTruck,
  IconClock,
  IconCheck,
  IconEye,
  IconTrendingUp,
} from '@tabler/icons-react'

// Mock customer data
const mockCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+880 1712-345678',
  type: 'retail',
  status: 'active',
  wallet_balance: 1500.00,
  loyalty_points: 450,
  tier: 'silver',
  total_orders: 15,
  total_spent: 45000.00,
  avg_order_value: 3000.00,
  last_order_date: '2024-12-28',
  created_at: '2024-01-15',
  verified_at: '2024-01-16',
  addresses: [
    {
      id: 1,
      label: 'Home',
      full_name: 'John Doe',
      phone: '+880 1712-345678',
      address: 'House 12, Road 5',
      area: 'Dhanmondi',
      city: 'Dhaka',
      zip: '1209',
      is_default: true,
    },
    {
      id: 2,
      label: 'Office',
      full_name: 'John Doe',
      phone: '+880 1712-345678',
      address: 'Plot 45, Gulshan Avenue',
      area: 'Gulshan',
      city: 'Dhaka',
      zip: '1213',
      is_default: false,
    },
  ],
  recent_orders: [
    {
      id: 'INV-2024-1234',
      date: '2024-12-28',
      status: 'delivered',
      total: 4500.00,
      items: 3,
    },
    {
      id: 'INV-2024-1198',
      date: '2024-12-20',
      status: 'shipped',
      total: 3200.00,
      items: 2,
    },
    {
      id: 'INV-2024-1156',
      date: '2024-12-15',
      status: 'delivered',
      total: 5800.00,
      items: 4,
    },
  ],
  wallet_transactions: [
    {
      id: 1,
      type: 'credit',
      amount: 500.00,
      description: 'Order refund - INV-2024-1100',
      balance: 1500.00,
      date: '2024-12-25 14:30',
    },
    {
      id: 2,
      type: 'debit',
      amount: 800.00,
      description: 'Order payment - INV-2024-1234',
      balance: 1000.00,
      date: '2024-12-28 10:15',
    },
    {
      id: 3,
      type: 'credit',
      amount: 500.00,
      description: 'Loyalty points redemption',
      balance: 1500.00,
      date: '2024-12-29 16:45',
    },
  ],
  activity_log: [
    {
      id: 1,
      action: 'Order Placed',
      description: 'Placed order INV-2024-1234',
      date: '2024-12-28 10:15',
    },
    {
      id: 2,
      action: 'Profile Updated',
      description: 'Updated phone number',
      date: '2024-12-25 14:20',
    },
    {
      id: 3,
      action: 'Address Added',
      description: 'Added new office address',
      date: '2024-12-20 09:30',
    },
  ],
}

export default function CustomerDetailsPage() {
  const customer = mockCustomer

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wallet' | 'activity'>('overview')

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Profile header
  const profileHeader = useMemo(() => (
    <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group  wrap="wrap">
          <Avatar
            src={null}
            alt={customer.name}
            radius="xl"
            size="xl"
            color="red"
          >
            {customer.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Group  mb="xs">
              <Title order={2}>{customer.name}</Title>
              <Badge
                color={customer.status === 'active' ? 'green' : 'gray'}
                variant="light"
                size="lg"
              >
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
              <Badge
                color={customer.type === 'wholesale' ? 'blue' : 'gray'}
                variant="light"
              >
                {customer.type.charAt(0).toUpperCase() + customer.type.slice(1)}
              </Badge>
            </Group>
            <Group  mb="sm">
              {customer.email && (
                <Group >
                  <IconMail size={16} />
                  <Text size="sm">{customer.email}</Text>
                </Group>
              )}
              <Group >
                <IconPhone size={16} />
                <Text size="sm">{customer.phone}</Text>
              </Group>
            </Group>
            <Group >
              <Text size="sm" c="dimmed">Member since {formatDate(customer.created_at)}</Text>
            </Group>
          </Box>
        </Group>
        <Group >
          <Button
            variant="default"
            size="sm"
            component={Link}
            to="/crm/customers"
            leftSection={<IconArrowLeft size={16} />}
          >
            Back
          </Button>
          <Button
            component={Link}
            to={`/crm/customers/${customer.id}/edit`}
            leftSection={<IconEdit size={16} />}
          >
            Edit Customer
          </Button>
        </Group>
      </Group>
    </Paper>
  ), [customer])

  // Stats cards
  const statsCards = useMemo(() => (
    <SimpleGrid cols={{ base: 2, md: 3, lg: 6 }} spacing="md">
      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconWallet size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
          <Text size="xs" c="dimmed">Wallet Balance</Text>
        </Group>
        <Text size="xl" fw={700}>{formatCurrency(customer.wallet_balance)}</Text>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconShoppingBag size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
          <Text size="xs" c="dimmed">Total Orders</Text>
        </Group>
        <Text size="xl" fw={700}>{customer.total_orders}</Text>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconCoin size={20} style={{ color: 'var(--mantine-color-red-filled)' }} />
          <Text size="xs" c="dimmed">Total Spent</Text>
        </Group>
        <Text size="xl" fw={700}>{formatCurrency(customer.total_spent)}</Text>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconPackage size={20} style={{ color: 'var(--mantine-color-orange-filled)' }} />
          <Text size="xs" c="dimmed">Loyalty Points</Text>
        </Group>
        <Text size="xl" fw={700}>{customer.loyalty_points}</Text>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconTrendingUp size={20} style={{ color: 'var(--mantine-color-cyan-filled)' }} />
          <Text size="xs" c="dimmed">Avg Order Value</Text>
        </Group>
        <Text size="xl" fw={700}>{formatCurrency(customer.avg_order_value)}</Text>
      </Card>

      <Card withBorder p="md" radius="md">
        <Group  mb="xs">
          <IconCalendar size={20} style={{ color: 'var(--mantine-color-violet-filled)' }} />
          <Text size="xs" c="dimmed">Last Order</Text>
        </Group>
        <Text size="sm" fw={700} lineClamp={1}>{formatDate(customer.last_order_date)}</Text>
      </Card>
    </SimpleGrid>
  ), [customer])

  // Personal information
  const personalInfo = useMemo(() => (
    <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
      <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">Personal Information</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Group >
          <IconMail size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
          <Box>
            <Text size="xs" c="dimmed">Email</Text>
            <Text fw={500} size="sm">{customer.email || 'N/A'}</Text>
          </Box>
        </Group>
        <Group >
          <IconPhone size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
          <Box>
            <Text size="xs" c="dimmed">Phone</Text>
            <Text fw={500} size="sm">{customer.phone}</Text>
          </Box>
        </Group>
        <Group >
          <IconCalendar size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
          <Box>
            <Text size="xs" c="dimmed">Member Since</Text>
            <Text fw={500} size="sm">{formatDate(customer.created_at)}</Text>
          </Box>
        </Group>
        <Group >
          <IconCheck size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
          <Box>
            <Text size="xs" c="dimmed">Account Status</Text>
            <Badge
              color={customer.status === 'active' ? 'green' : 'gray'}
              variant="light"
              size="sm"
            >
              {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
            </Badge>
          </Box>
        </Group>
      </SimpleGrid>
    </Card>
  ), [customer])

  // Addresses
  const addressesSection = useMemo(() => (
    <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
      <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">Addresses</Title>
      <Stack >
        {customer.addresses.map((address) => (
          <Paper key={address.id} withBorder p="md" radius="md">
            <Group justify="space-between" mb="xs">
              <Group >
                <IconMapPin size={16} style={{ color: 'var(--mantine-color-red-filled)' }} />
                <Text fw={600} size="sm">{address.label}</Text>
                {address.is_default && (
                  <Badge size="xs" color="blue" variant="light">Default</Badge>
                )}
              </Group>
            </Group>
            <Text size="sm">{address.full_name}</Text>
            <Text size="sm" c="dimmed">{address.phone}</Text>
            <Text size="sm">{address.address}, {address.area}</Text>
            <Text size="sm">{address.city} - {address.zip}</Text>
          </Paper>
        ))}
      </Stack>
    </Card>
  ), [customer])

  // Recent orders table (desktop)
  const recentOrdersTable = useMemo(() => (
    <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
      <Group justify="space-between" mb="md">
        <Title order={4} className="text-base md:text-lg lg:text-xl">Recent Orders</Title>
        <Button
          variant="subtle"
          size="sm"
          component={Link}
          to="/sales/orders"
        >
          View All Orders
        </Button>
      </Group>

      <Box display={{ base: 'none', md: 'block' }}>
        <Table.ScrollContainer minWidth={1100}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order ID</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th>Items</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Payment</Table.Th>
                <Table.Th>Delivery</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {customer.recent_orders.map((order) => (
                <Table.Tr key={order.id}>
                  <Table.Td>
                    <Anchor
                      component={Link}
                      to={`/sales/orders/${order.id}`}
                      size="sm"
                      fw={600}
                    >
                      {order.id}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatDate(order.date)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{order.items} items</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={600} size="sm">{formatCurrency(order.total)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        order.status === 'delivered' ? 'green' :
                        order.status === 'shipped' ? 'blue' :
                        order.status === 'processing' ? 'yellow' :
                        order.status === 'cancelled' ? 'red' : 'gray'
                      }
                      variant="light"
                      size="sm"
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge size="xs" variant="light" color="green">Paid</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group >
                      <IconTruck size={14} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                      <Text size="xs">Home Delivery</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      component={Link}
                      to={`/sales/orders/${order.id}`}
                      size="sm"
                    >
                      <IconEye size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Box>

      {/* Mobile: Card view for orders */}
      <Stack  display={{ base: 'block', md: 'none' }}>
        {customer.recent_orders.map((order) => (
          <Card key={order.id} shadow="sm" p="sm" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Anchor
                component={Link}
                to={`/sales/orders/${order.id}`}
                size="sm"
                fw={600}
              >
                {order.id}
              </Anchor>
              <Badge
                color={
                  order.status === 'delivered' ? 'green' :
                  order.status === 'shipped' ? 'blue' :
                  'gray'
                }
                variant="light"
                size="sm"
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </Group>
            <Text size="sm" mb="xs" c="dimmed">{formatDate(order.date)}</Text>
            <Group  mb="xs">
              <Box>
                <Text size="xs" c="dimmed">Items</Text>
                <Text size="sm">{order.items} items</Text>
              </Box>
              <Box>
                <Text size="xs" c="dimmed">Total</Text>
                <Text fw={600} size="sm">{formatCurrency(order.total)}</Text>
              </Box>
            </Group>
            <Group >
              <Badge size="xs" variant="light" color="green">Paid</Badge>
              <Group >
                <IconTruck size={14} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                <Text size="xs">Home Delivery</Text>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    </Card>
  ), [customer])

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<IconChevronRight size={14} />}>
          <Anchor component={Link} to="/dashboard" c="dimmed">Dashboard</Anchor>
          <Anchor component={Link} to="/crm" c="dimmed">CRM</Anchor>
          <Anchor component={Link} to="/crm/customers" c="dimmed">Customers</Anchor>
          <Text c="red">{customer.name}</Text>
        </Breadcrumbs>

        {/* Header */}
        <Box>
          <Title order={1} className="text-lg md:text-xl lg:text-2xl">Customer Profile</Title>
          <Text c="dimmed" className="text-sm md:text-base">View and manage customer information</Text>
        </Box>

        {/* Profile Header */}
        {profileHeader}

        {/* Stats Cards */}
        {statsCards}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as 'overview' | 'orders' | 'wallet' | 'activity')}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconPackage size={14} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="wallet" leftSection={<IconWallet size={14} />}>
              Wallet
            </Tabs.Tab>
            <Tabs.Tab value="activity" leftSection={<IconClock size={14} />}>
              Activity
            </Tabs.Tab>
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Panel value="overview">
            <Stack  mt="md">
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                {personalInfo}
                {addressesSection}
              </SimpleGrid>
              {recentOrdersTable}
            </Stack>
          </Tabs.Panel>


          {/* Wallet Tab */}
          <Tabs.Panel value="wallet">
            <Stack  mt="md">
              <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
                <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">Wallet Transactions</Title>
                <Box display={{ base: 'none', md: 'block' }}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Amount</Table.Th>
                        <Table.Th>Balance</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {customer.wallet_transactions.map((txn) => (
                        <Table.Tr key={txn.id}>
                          <Table.Td>
                            <Text size="sm">{formatDateTime(txn.date)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={txn.type === 'credit' ? 'green' : 'red'}
                              variant="light"
                              size="sm"
                            >
                              {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{txn.description}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text
                              fw={600}
                              size="sm"
                              c={txn.type === 'credit' ? 'green' : 'red'}
                            >
                              {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600} size="sm">{formatCurrency(txn.balance)}</Text>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Box>

                {/* Mobile wallet transactions */}
                <Stack  display={{ base: 'block', md: 'none' }}>
                  {customer.wallet_transactions.map((txn) => (
                    <Paper key={txn.id} withBorder p="sm" radius="md">
                      <Group justify="space-between" mb="xs">
                        <Badge
                          color={txn.type === 'credit' ? 'green' : 'red'}
                          variant="light"
                          size="sm"
                        >
                          {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                        </Badge>
                        <Text fw={600} size="sm" c={txn.type === 'credit' ? 'green' : 'red'}>
                          {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </Text>
                      </Group>
                      <Text size="sm">{txn.description}</Text>
                      <Text size="xs" c="dimmed">{formatDateTime(txn.date)}</Text>
                      <Group  mt="xs">
                        <Text size="xs" c="dimmed">Balance:</Text>
                        <Text fw={600} size="xs">{formatCurrency(txn.balance)}</Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Tabs.Panel>

          {/* Activity Tab */}
          <Tabs.Panel value="activity">
            <Stack  mt="md">
              <Card withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
                <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">Activity Log</Title>
                <Timeline bulletSize={24}>
                  {customer.activity_log.map((activity) => (
                    <Timeline.Item
                      key={activity.id}
                      bullet={<IconClock size={12} />}
                      color="red"
                    >
                      <Text fw={600} size="sm">{activity.action}</Text>
                      <Text size="sm" c="dimmed">{activity.description}</Text>
                      <Text size="xs" c="dimmed">{formatDateTime(activity.date)}</Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  )
}
