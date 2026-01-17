import { useState } from 'react'
import { Title, Text, Stack, Paper, Group, Grid, Card, Badge, Button, Table, SimpleGrid } from '@mantine/core'
import { IconDashboard, IconCoin, IconWallet, IconBuildingBank, IconMoneybag, IconPlus, IconArrowRight, IconRefresh, IconCheck, IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Mock data
const mockSummary = {
  total_cash: 50000,
  total_bank: 250000,
  total_bkash: 15000,
  total_nagad: 8000,
  total_balance: 323500,
  account_count: 5,
  by_type: {
    cash: { count: 1, total_balance: 50000 },
    bank: { count: 2, total_balance: 250000 },
    bkash: { count: 1, total_balance: 15000 },
    nagad: { count: 1, total_balance: 8000 }
  }
}

const mockTransactions = [
  {
    id: 1,
    date: '2026-01-17',
    type: 'deposit',
    amount: 25000,
    balance_after: 75000,
    description: 'Sales deposit - Order #1234',
    bank: { name: 'Brac Bank', type: 'bank' }
  },
  {
    id: 2,
    date: '2026-01-17',
    type: 'withdrawal',
    amount: 5000,
    balance_after: 70000,
    description: 'Office rent payment',
    bank: { name: 'Brac Bank', type: 'bank' }
  },
  {
    id: 3,
    date: '2026-01-17',
    type: 'deposit',
    amount: 10000,
    balance_after: 80000,
    description: 'bKash payment - Order #1235',
    bank: { name: 'bKash', type: 'bkash' }
  },
  {
    id: 4,
    date: '2026-01-16',
    type: 'withdrawal',
    amount: 2000,
    balance_after: 70000,
    description: 'Office supplies purchase',
    bank: { name: 'Cash', type: 'cash' }
  },
  {
    id: 5,
    date: '2026-01-16',
    type: 'deposit',
    amount: 15000,
    balance_after: 70000,
    description: 'Wholesale payment received',
    bank: { name: 'Nagad', type: 'nagad' }
  }
]

const mockPendingExpenses = [
  {
    id: 1,
    title: 'Office Rent - January 2026',
    amount: 25000,
    expense_date: '2026-01-15',
    is_approved: false,
    account: { name: 'Office Rent' },
    paid_by: { name: 'John Doe' }
  },
  {
    id: 2,
    title: 'Office Supplies',
    amount: 5000,
    expense_date: '2026-01-16',
    is_approved: false,
    account: { name: 'Office Supplies' },
    paid_by: { name: 'Jane Smith' }
  },
  {
    id: 3,
    title: 'Utility Bills',
    amount: 3500,
    expense_date: '2026-01-17',
    is_approved: false,
    account: { name: 'Utilities' },
    paid_by: { name: 'Bob Johnson' }
  },
  {
    id: 4,
    title: 'Staff Tea Snacks',
    amount: 1500,
    expense_date: '2026-01-17',
    is_approved: false,
    account: { name: 'Employee Benefits' },
    paid_by: { name: 'Alice Williams' }
  },
  {
    id: 5,
    title: 'Internet Bill',
    amount: 2000,
    expense_date: '2026-01-15',
    is_approved: false,
    account: { name: 'Internet & Connectivity' },
    paid_by: { name: 'Charlie Brown' }
  }
]

export default function FinanceDashboardPage() {
  const { t } = useTranslation()
  const [refreshing, setRefreshing] = useState(false)

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1000)
  }

  return (
    <Stack p="xl">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>{t('finance.dashboardPage.title')}</Title>
          <Text c="dimmed">{t('finance.dashboardPage.subtitle')}</Text>
        </div>
        <Button
          leftSection={<IconRefresh size={16} />}
          onClick={handleRefresh}
          loading={refreshing}
          variant="light"
        >
          {t('finance.dashboardPage.refresh')}
        </Button>
      </Group>

      {/* Statistics Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconWallet size={24} color="green" />
            <Text size="xs" c="dimmed">{t('finance.dashboardPage.totalCash')}</Text>
          </Group>
          <Text size="xl" fw={700} c="green">
            {formatCurrency(mockSummary.by_type.cash.total_balance)}
          </Text>
        </Card>

        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconBuildingBank size={24} color="blue" />
            <Text size="xs" c="dimmed">{t('finance.dashboardPage.totalBankBalance')}</Text>
          </Group>
          <Text size="xl" fw={700} c="blue">
            {formatCurrency(mockSummary.by_type.bank.total_balance)}
          </Text>
        </Card>

        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconMoneybag size={24} color="purple" />
            <Text size="xs" c="dimmed">{t('finance.dashboardPage.bkashBalance')}</Text>
          </Group>
          <Text size="xl" fw={700} c="purple">
            {formatCurrency(mockSummary.by_type.bkash.total_balance)}
          </Text>
        </Card>

        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconCoin size={24} color="orange" />
            <Text size="xs" c="dimmed">{t('finance.dashboardPage.totalBalance')}</Text>
          </Group>
          <Text size="xl" fw={700} c="orange">
            {formatCurrency(mockSummary.total_balance)}
          </Text>
        </Card>
      </SimpleGrid>

      {/* Quick Actions */}
      <Paper withBorder p="md" shadow="sm">
        <Text fw={600} mb="xs">{t('finance.dashboardPage.quickActions')}</Text>
        <SimpleGrid cols={{ base: 2, md: 4 }}>
          <Button
            component={Link}
            to="/finance/expenses/create"
            variant="light"
            leftSection={<IconPlus size={16} />}
            fullWidth
          >
            {t('finance.dashboardPage.newExpense')}
          </Button>
          <Button
            component={Link}
            to="/finance/banks/create"
            variant="light"
            leftSection={<IconDashboard size={16} />}
            fullWidth
          >
            {t('finance.dashboardPage.addBank')}
          </Button>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={handleRefresh}
            fullWidth
          >
            {t('finance.dashboardPage.refreshData')}
          </Button>
          <Button
            component={Link}
            to="/finance/accounts"
            variant="light"
            c="green"
            leftSection={<IconCheck size={16} />}
            fullWidth
          >
            {t('finance.dashboardPage.allAccounts')}
          </Button>
        </SimpleGrid>
      </Paper>

      {/* Revenue vs Expenses */}
      <Paper withBorder p="md" shadow="sm" mt="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>{t('finance.dashboardPage.revenueVsExpenses')} (January 2026)</Text>
          <Badge color="blue">{t('finance.dashboardPage.monthlyView')}</Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {/* Revenue Card */}
          <Card withBorder p="md">
            <Group gap="xs" mb="sm">
              <Group gap="xs">
                <IconTrendingUp size={20} color="green" />
                <Text size="sm" c="dimmed">{t('finance.dashboardPage.totalRevenue')}</Text>
              </Group>
              <Text size="xxl" fw={700} c="green">
                ৳5,25,000.00
              </Text>
              <Text size="xs" c="dimmed">
                +15.3% {t('finance.dashboardPage.fromLastMonth')}
              </Text>
            </Group>

            {/* Revenue Breakdown */}
            <Stack gap={4} mt="sm">
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.salesRevenue')}</Text>
                <Text size="xs" fw={500}>৳3,50,000</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.wholesaleRevenue')}</Text>
                <Text size="xs" fw={500}>৳1,50,000</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.darazRevenue')}</Text>
                <Text size="xs" fw={500}>৳250,000</Text>
              </Group>
            </Stack>
          </Card>

          {/* Expenses Card */}
          <Card withBorder p="md">
            <Group gap="xs" mb="sm">
              <Group gap="xs">
                <IconTrendingDown size={20} color="red" />
                <Text size="sm" c="dimmed">{t('finance.dashboardPage.totalExpenses')}</Text>
              </Group>
              <Text size="xxl" fw={700} c="red">
                ৳3,80,000.00
              </Text>
              <Text size="xs" c="dimmed">
                +8.2% {t('finance.dashboardPage.fromLastMonth')}
              </Text>
            </Group>

            {/* Expenses Breakdown */}
            <Stack gap={4} mt="sm">
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.costOfGoodsSold')}</Text>
                <Text size="xs" fw={500}>৳1,80,000</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.operationalExpenses')}</Text>
                <Text size="xs" fw={500}>৳950,000</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.administrative')}</Text>
                <Text size="xs" fw={500}>৳250,000</Text>
              </Group>
              <Group justify="space-between">
                <Text size="xs">{t('finance.dashboardPage.financeCharges')}</Text>
                <Text size="xs" fw={500}>৳800,000</Text>
              </Group>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Net Profit Summary */}
        <Card withBorder p="md" mt="xs">
          <Group justify="space-between">
            <Group gap="xs">
              <IconCoin size={20} color="gray" />
              <Text size="sm" c="dimmed">{t('finance.dashboardPage.netProfit')} (January)</Text>
            </Group>
            <Badge
              color="green"
              size="lg"
              variant="filled"
            >
              {t('finance.dashboardPage.profit')}: ৳1,45,000.00
            </Badge>
          </Group>
        </Card>
      </Paper>

      {/* Recent Transactions */}
      <Paper withBorder p="md" shadow="sm" mt="md">
        <Group justify="space-between" mb="xs">
          <Text fw={600}>{t('finance.dashboardPage.recentTransactions')}</Text>
          <Button
            component={Link}
            to="/finance/transactions"
            variant="subtle"
            size="xs"
            rightSection={<IconArrowRight size={14} />}
          >
            {t('finance.dashboardPage.viewAll')}
          </Button>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('finance.dashboardPage.date')}</Table.Th>
              <Table.Th>{t('finance.dashboardPage.bank')}</Table.Th>
              <Table.Th>{t('finance.dashboardPage.type')}</Table.Th>
              <Table.Th>{t('finance.dashboardPage.amount')}</Table.Th>
              <Table.Th>{t('finance.dashboardPage.balance')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockTransactions.map((tx) => (
              <Table.Tr key={tx.id}>
                <Table.Td>{formatDate(tx.date)}</Table.Td>
                <Table.Td>{tx.bank.name}</Table.Td>
                <Table.Td>
                  <Badge
                    color={tx.type === 'deposit' ? 'green' : tx.type === 'withdrawal' ? 'red' : 'blue'}
                    variant="light"
                  >
                    {t(`finance.dashboardPage.${tx.type}`)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text
                    fw={600}
                    c={tx.type === 'deposit' ? 'green' : 'red'}
                  >
                    {formatCurrency(tx.amount)}
                  </Text>
                </Table.Td>
                <Table.Td>{formatCurrency(tx.balance_after)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      {/* Pending Expenses */}
      {mockPendingExpenses.length > 0 && (
        <Paper withBorder p="md" shadow="sm" mt="md">
          <Group justify="space-between" mb="xs">
            <Text fw={600}>{t('finance.dashboardPage.pendingExpenses')}</Text>
            <Badge size="xs">{mockPendingExpenses.length} {t('finance.dashboardPage.pending')}</Badge>
          </Group>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('finance.dashboardPage.title')}</Table.Th>
                <Table.Th>{t('finance.dashboardPage.category')}</Table.Th>
                <Table.Th>{t('finance.dashboardPage.amount')}</Table.Th>
                <Table.Th>{t('finance.dashboardPage.date')}</Table.Th>
                <Table.Th>{t('finance.dashboardPage.paidBy')}</Table.Th>
                <Table.Th>{t('finance.dashboardPage.action')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {mockPendingExpenses.map((expense) => (
                <Table.Tr key={expense.id}>
                  <Table.Td>{expense.title}</Table.Td>
                  <Table.Td>{expense.account.name}</Table.Td>
                  <Table.Td fw={600}>{formatCurrency(expense.amount)}</Table.Td>
                  <Table.Td>{formatDate(expense.expense_date)}</Table.Td>
                  <Table.Td>{expense.paid_by.name}</Table.Td>
                  <Table.Td>
                    <Button
                      size="xs"
                      variant="light"
                      component={Link}
                      to={`/finance/expenses/${expense.id}/approve`}
                    >
                      {t('finance.dashboardPage.approve')}
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      )}

      {/* Summary Stats */}
      <SimpleGrid cols={{ base: 1, md: 3 }} mt="md">
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconDashboard size={40} />
            <div>
              <Text size="xs" c="dimmed">{t('finance.dashboardPage.totalBalance')}</Text>
              <Text size="xl" fw={700} style={{ fontFamily: 'monospace' }}>
                {formatCurrency(mockSummary.total_balance)}
              </Text>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconCoin size={40} />
            <div>
              <Text size="xs" c="dimmed">{t('finance.dashboardPage.activeBankAccounts')}</Text>
              <Text size="xl" fw={700}>
                {mockSummary.account_count} {t('finance.dashboardPage.accounts')}
              </Text>
            </div>
          </Group>
        </Card>

        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <IconRefresh size={40} />
            <div>
              <Text size="xs" c="dimmed">{t('finance.dashboardPage.totalTransactions')}</Text>
              <Text size="xl" fw={700}>
                {mockTransactions.length} {t('finance.dashboardPage.records')}
              </Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>
    </Stack>
  )
}
