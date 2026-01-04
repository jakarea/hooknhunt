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
  Card,
  TextInput,
  Select,
  ActionIcon,
  SimpleGrid,
  Avatar,
  Table,
} from '@mantine/core'
import {
  IconPlus,
  IconSearch,
  IconWallet,
  IconCoin,
  IconTrendingUp,
  IconTrendingDown,
  IconEye,
  IconCalendar,
  IconReceipt,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

// Mock wallet data
const mockWallets = [
  {
    id: 1,
    customer_id: 1,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+880 1712-345678',
    balance: 1500.00,
    total_credits: 5000.00,
    total_debits: 3500.00,
    last_transaction: '2024-12-29 16:45',
    status: 'active',
  },
  {
    id: 2,
    customer_id: 2,
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    customer_phone: '+880 1812-345678',
    balance: 5000.00,
    total_credits: 15000.00,
    total_debits: 10000.00,
    last_transaction: '2024-12-28 14:20',
    status: 'active',
  },
  {
    id: 3,
    customer_id: 3,
    customer_name: 'Bob Johnson',
    customer_email: 'bob@example.com',
    customer_phone: '+880 1912-345678',
    balance: 0.00,
    total_credits: 1000.00,
    total_debits: 1000.00,
    last_transaction: '2024-12-20 10:30',
    status: 'active',
  },
  {
    id: 4,
    customer_id: 4,
    customer_name: 'Alice Williams',
    customer_email: 'alice@example.com',
    customer_phone: '+880 1612-345678',
    balance: -500.00,
    total_credits: 2000.00,
    total_debits: 2500.00,
    last_transaction: '2024-12-25 09:15',
    status: 'active',
  },
  {
    id: 5,
    customer_id: 5,
    customer_name: 'Charlie Brown',
    customer_email: 'charlie@example.com',
    customer_phone: '+880 1312-345678',
    balance: 12000.00,
    total_credits: 25000.00,
    total_debits: 13000.00,
    last_transaction: '2024-12-29 11:50',
    status: 'active',
  },
]

// Mock transactions
const mockTransactions = [
  {
    id: 1,
    wallet_id: 1,
    customer_name: 'John Doe',
    type: 'credit',
    amount: 500.00,
    description: 'Order refund - INV-2024-1100',
    balance_after: 1500.00,
    created_at: '2024-12-29 16:45',
    created_by: 'System',
  },
  {
    id: 2,
    wallet_id: 2,
    customer_name: 'Jane Smith',
    type: 'credit',
    amount: 2000.00,
    description: 'Loyalty points redemption',
    balance_after: 5000.00,
    created_at: '2024-12-28 14:20',
    created_by: 'Admin',
  },
  {
    id: 3,
    wallet_id: 1,
    customer_name: 'John Doe',
    type: 'debit',
    amount: 800.00,
    description: 'Order payment - INV-2024-1234',
    balance_after: 1000.00,
    created_at: '2024-12-28 10:15',
    created_by: 'System',
  },
  {
    id: 4,
    wallet_id: 4,
    customer_name: 'Alice Williams',
    type: 'debit',
    amount: 500.00,
    description: 'Order payment - INV-2024-1190',
    balance_after: -500.00,
    created_at: '2024-12-25 09:15',
    created_by: 'System',
  },
  {
    id: 5,
    wallet_id: 5,
    customer_name: 'Charlie Brown',
    type: 'credit',
    amount: 5000.00,
    description: 'Manual adjustment',
    balance_after: 12000.00,
    created_at: '2024-12-29 11:50',
    created_by: 'John Doe',
  },
]

export default function WalletPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [balanceFilter, setBalanceFilter] = useState<string | null>('all')
  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter wallets
  const filteredWallets = useMemo(() => {
    let result = mockWallets

    // Balance filter
    if (balanceFilter === 'positive') {
      result = result.filter((w) => w.balance > 0)
    } else if (balanceFilter === 'zero') {
      result = result.filter((w) => w.balance === 0)
    } else if (balanceFilter === 'negative') {
      result = result.filter((w) => w.balance < 0)
    }

    // Search filter
    if (!searchQuery.trim()) {
      return result
    }

    const query = searchQuery.toLowerCase()
    return result.filter((wallet) =>
      wallet.customer_name.toLowerCase().includes(query) ||
      wallet.customer_email.toLowerCase().includes(query) ||
      wallet.customer_phone.toLowerCase().includes(query)
    )
  }, [searchQuery, balanceFilter])

  // Pagination
  const paginatedWallets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredWallets.slice(startIndex, endIndex)
  }, [filteredWallets, currentPage])

  const totalPages = Math.ceil(filteredWallets.length / itemsPerPage)

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockTransactions
    }

    const query = searchQuery.toLowerCase()
    return mockTransactions.filter((txn) =>
      txn.customer_name.toLowerCase().includes(query) ||
      txn.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date/time
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Calculate stats
  const totalBalance = useMemo(() => {
    return filteredWallets.reduce((sum, w) => sum + w.balance, 0)
  }, [filteredWallets])

  const totalCredits = useMemo(() => {
    return filteredWallets.reduce((sum, w) => sum + w.total_credits, 0)
  }, [filteredWallets])

  const totalDebits = useMemo(() => {
    return filteredWallets.reduce((sum, w) => sum + w.total_debits, 0)
  }, [filteredWallets])

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, balanceFilter])

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Title order={1} className="text-lg md:text-xl lg:text-2xl">Customer Wallets</Title>
          <Text c="dimmed" className="text-sm md:text-base">Manage customer wallet balances and transactions</Text>
        </Box>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconWallet size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
              <Text size="xs" c="dimmed">Total Balance</Text>
            </Group>
            <Text size="xl" fw={700}>{formatCurrency(totalBalance)}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconTrendingUp size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
              <Text size="xs" c="dimmed">Total Credits</Text>
            </Group>
            <Text size="xl" fw={700} c="green">{formatCurrency(totalCredits)}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconTrendingDown size={20} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Text size="xs" c="dimmed">Total Debits</Text>
            </Group>
            <Text size="xl" fw={700} c="red">{formatCurrency(totalDebits)}</Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group  mb="xs">
              <IconCoin size={20} style={{ color: 'var(--mantine-color-orange-filled)' }} />
              <Text size="xs" c="dimmed">Active Wallets</Text>
            </Group>
            <Text size="xl" fw={700}>{filteredWallets.length}</Text>
          </Card>
        </SimpleGrid>

        {/* Tabs */}
        <Box>
          <Group >
            <Button
              variant={activeTab === 'wallets' ? 'filled' : 'light'}
              onClick={() => setActiveTab('wallets')}
            >
              Wallets ({filteredWallets.length})
            </Button>
            <Button
              variant={activeTab === 'transactions' ? 'filled' : 'light'}
              onClick={() => setActiveTab('transactions')}
            >
              Transactions ({filteredTransactions.length})
            </Button>
          </Group>
        </Box>

        {/* Filters */}
        <Group justify="space-between" wrap="wrap">
          <Group  style={{ flex: 1, maxWidth: '100%' }}>
            <TextInput
              placeholder="Search by customer name..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: '400px' }}
              size="md"
            />
            <Select
              placeholder="Filter by balance"
              value={balanceFilter}
              onChange={setBalanceFilter}
              data={[
                { value: 'all', label: 'All Balances' },
                { value: 'positive', label: 'Positive Balance' },
                { value: 'zero', label: 'Zero Balance' },
                { value: 'negative', label: 'Negative Balance (Due)' },
              ]}
              size="md"
              style={{ minWidth: '180px' }}
              clearable
            />
          </Group>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => {
              notifications.show({
                title: 'Add Funds',
                message: 'Add funds to customer wallet modal would open here',
                color: 'blue',
              })
            }}
          >
            Add Funds
          </Button>
        </Group>

        {/* Wallets Tab */}
        {activeTab === 'wallets' && (
          <>
            {/* Mobile: Card View */}
            <Stack  display={{ base: 'block', md: 'none' }}>
              {paginatedWallets.length === 0 ? (
                <Paper withBorder p="xl" ta="center">
                  <Text c="dimmed">No wallets found</Text>
                </Paper>
              ) : (
                paginatedWallets.map((wallet) => (
                  <Card key={wallet.id} shadow="sm" p="md" radius="md" withBorder>
                    <Stack >
                      {/* Header */}
                      <Group justify="space-between">
                        <Group >
                          <Avatar
                            src={null}
                            alt={wallet.customer_name}
                            radius="xl"
                            size="sm"
                            color="red"
                          >
                            {wallet.customer_name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Text fw={600} size="sm">{wallet.customer_name}</Text>
                            <Text size="xs" c="dimmed">{wallet.customer_phone}</Text>
                          </Box>
                        </Group>
                        <Badge
                          color={wallet.balance >= 0 ? 'green' : 'red'}
                          variant="light"
                        >
                          {wallet.balance >= 0 ? 'Active' : 'Due'}
                        </Badge>
                      </Group>

                      {/* Balance */}
                      <Box
                        p="sm"
                        style={{
                          backgroundColor: wallet.balance >= 0 ? 'var(--mantine-color-green-0)' : 'var(--mantine-color-red-0)',
                          borderRadius: '8px',
                        }}
                      >
                        <Text size="xs" c="dimmed">Current Balance</Text>
                        <Text
                          size="xl"
                          fw={700}
                          c={wallet.balance >= 0 ? 'green' : 'red'}
                        >
                          {formatCurrency(wallet.balance)}
                        </Text>
                      </Box>

                      {/* Stats */}
                      <SimpleGrid cols={2}>
                        <Box>
                          <Text size="xs" c="dimmed">Total Credits</Text>
                          <Text size="sm" fw={500} c="green">{formatCurrency(wallet.total_credits)}</Text>
                        </Box>
                        <Box>
                          <Text size="xs" c="dimmed">Total Debits</Text>
                          <Text size="sm" fw={500} c="red">{formatCurrency(wallet.total_debits)}</Text>
                        </Box>
                      </SimpleGrid>

                      {/* Last transaction */}
                      <Group >
                        <IconCalendar size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
                        <Text size="xs" c="dimmed">
                          Last: {formatDateTime(wallet.last_transaction)}
                        </Text>
                      </Group>

                      {/* Actions */}
                      <Group >
                        <Button
                          variant="light"
                          size="xs"
                          component={Link}
                          to={`/crm/customers/${wallet.customer_id}`}
                          leftSection={<IconEye size={14} />}
                          style={{ flex: 1 }}
                        >
                          View Customer
                        </Button>
                        <Button
                          variant="light"
                          size="xs"
                          color="green"
                          leftSection={<IconPlus size={14} />}
                          style={{ flex: 1 }}
                          onClick={() => {
                            notifications.show({
                              title: 'Add Funds',
                              message: `Add funds to ${wallet.customer_name}'s wallet`,
                              color: 'green',
                            })
                          }}
                        >
                          Add Funds
                        </Button>
                      </Group>
                    </Stack>
                  </Card>
                ))
              )}
            </Stack>

            {/* Desktop: Table View */}
            <Paper withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }} >
              <Table.ScrollContainer minWidth={1000}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Balance</Table.Th>
                      <Table.Th>Total Credits</Table.Th>
                      <Table.Th>Total Debits</Table.Th>
                      <Table.Th>Last Transaction</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedWallets.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={7}>
                          <Box py="xl" ta="center">
                            <Text c="dimmed">No wallets found</Text>
                          </Box>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      paginatedWallets.map((wallet) => (
                        <Table.Tr key={wallet.id}>
                          <Table.Td>
                            <Group >
                              <Avatar
                                src={null}
                                alt={wallet.customer_name}
                                radius="xl"
                                size="sm"
                                color="red"
                              >
                                {wallet.customer_name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Text fw={600} size="sm">{wallet.customer_name}</Text>
                                <Text size="xs" c="dimmed">{wallet.customer_phone}</Text>
                              </Box>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Text
                              fw={700}
                              size="sm"
                              c={wallet.balance >= 0 ? 'green' : 'red'}
                            >
                              {formatCurrency(wallet.balance)}
                            </Text>
                            {wallet.balance < 0 && (
                              <Badge size="xs" color="red" variant="light" mt="xs">Due</Badge>
                            )}
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="green">{formatCurrency(wallet.total_credits)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" c="red">{formatCurrency(wallet.total_debits)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{formatDateTime(wallet.last_transaction)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={wallet.balance >= 0 ? 'green' : 'red'}
                              variant="light"
                              size="sm"
                            >
                              {wallet.balance >= 0 ? 'Active' : 'Due'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Group >
                              <ActionIcon
                                variant="subtle"
                                color="gray"
                                component={Link}
                                to={`/crm/customers/${wallet.customer_id}`}
                                size="sm"
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="green"
                                size="sm"
                                onClick={() => {
                                  notifications.show({
                                    title: 'Add Funds',
                                    message: `Add funds to ${wallet.customer_name}'s wallet`,
                                    color: 'green',
                                  })
                                }}
                              >
                                <IconPlus size={16} />
                              </ActionIcon>
                            </Group>
                          </Table.Td>
                        </Table.Tr>
                      ))
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
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Text size="sm" c="dimmed">
                  Page {currentPage} of {totalPages}
                </Text>
                <Button
                  variant="light"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </Group>
            )}
          </>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <>
            {/* Mobile: Card View */}
            <Stack  display={{ base: 'block', md: 'none' }}>
              {filteredTransactions.length === 0 ? (
                <Paper withBorder p="xl" ta="center">
                  <Text c="dimmed">No transactions found</Text>
                </Paper>
              ) : (
                filteredTransactions.map((txn) => (
                  <Card key={txn.id} shadow="sm" p="sm" radius="md" withBorder>
                    <Group justify="space-between" mb="xs">
                      <Group >
                        <IconReceipt size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />
                        <Text fw={600} size="sm">{txn.customer_name}</Text>
                      </Group>
                      <Badge
                        color={txn.type === 'credit' ? 'green' : 'red'}
                        variant="light"
                        size="sm"
                      >
                        {txn.type === 'credit' ? 'Credit' : 'Debit'}
                      </Badge>
                    </Group>
                    <Text size="sm" mb="xs">{txn.description}</Text>
                    <Group justify="space-between">
                      <Text
                        fw={700}
                        size="lg"
                        c={txn.type === 'credit' ? 'green' : 'red'}
                      >
                        {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </Text>
                      <Box style={{ textAlign: 'right' }}>
                        <Text size="xs" c="dimmed">Balance: {formatCurrency(txn.balance_after)}</Text>
                        <Text size="xs" c="dimmed">{formatDateTime(txn.created_at)}</Text>
                      </Box>
                    </Group>
                    <Text size="xs" c="dimmed" mt="xs">By {txn.created_by}</Text>
                  </Card>
                ))
              )}
            </Stack>

            {/* Desktop: Table View */}
            <Paper withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }} >
              <Table.ScrollContainer minWidth={1000}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Customer</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th>Description</Table.Th>
                      <Table.Th>Amount</Table.Th>
                      <Table.Th>Balance After</Table.Th>
                      <Table.Th>Date</Table.Th>
                      <Table.Th>By</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredTransactions.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={7}>
                          <Box py="xl" ta="center">
                            <Text c="dimmed">No transactions found</Text>
                          </Box>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      filteredTransactions.map((txn) => (
                        <Table.Tr key={txn.id}>
                          <Table.Td>
                            <Text fw={600} size="sm">{txn.customer_name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge
                              color={txn.type === 'credit' ? 'green' : 'red'}
                              variant="light"
                              size="sm"
                            >
                              {txn.type === 'credit' ? 'Credit' : 'Debit'}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{txn.description}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text
                              fw={700}
                              size="sm"
                              c={txn.type === 'credit' ? 'green' : 'red'}
                            >
                              {txn.type === 'credit' ? '+' : '-'}{formatCurrency(txn.amount)}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text fw={600} size="sm">{formatCurrency(txn.balance_after)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{formatDateTime(txn.created_at)}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm">{txn.created_by}</Text>
                          </Table.Td>
                        </Table.Tr>
                      ))
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Paper>
          </>
        )}
      </Stack>
    </Box>
  )
}
