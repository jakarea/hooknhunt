'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  Card,
  Table,
  Tabs,
  Badge,
  Button,
  ActionIcon,
  Switch,
  NumberFormatter,
} from '@mantine/core'
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconPencil,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface Account {
  id: number
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  balance: number
  is_active: boolean
  parent_id?: number
  description?: string
}

type AccountType = 'all' | 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

// Mock data for development
const mockAccounts: Account[] = [
  // Assets
  { id: 1, code: '1000', name: 'Cash and Cash Equivalents', type: 'asset', balance: 1250000, is_active: true },
  { id: 2, code: '1010', name: 'Cash on Hand', type: 'asset', balance: 150000, is_active: true, parent_id: 1 },
  { id: 3, code: '1020', name: 'Bank Accounts', type: 'asset', balance: 1100000, is_active: true, parent_id: 1 },
  { id: 4, code: '1100', name: 'Accounts Receivable', type: 'asset', balance: 450000, is_active: true },
  { id: 5, code: '1200', name: 'Inventory', type: 'asset', balance: 890000, is_active: true },
  { id: 6, code: '1300', name: 'Prepaid Expenses', type: 'asset', balance: 75000, is_active: true },
  { id: 7, code: '1500', name: 'Fixed Assets', type: 'asset', balance: 2500000, is_active: true },
  { id: 8, code: '1510', name: 'Office Equipment', type: 'asset', balance: 350000, is_active: true, parent_id: 7 },
  { id: 9, code: '1520', name: 'Computer Equipment', type: 'asset', balance: 450000, is_active: true, parent_id: 7 },
  { id: 10, code: '1530', name: 'Furniture and Fixtures', type: 'asset', balance: 275000, is_active: true, parent_id: 7 },
  { id: 11, code: '1540', name: 'Vehicles', type: 'asset', balance: 850000, is_active: true, parent_id: 7 },
  { id: 12, code: '1600', name: 'Accumulated Depreciation', type: 'asset', balance: -450000, is_active: true },

  // Liabilities
  { id: 13, code: '2000', name: 'Accounts Payable', type: 'liability', balance: 320000, is_active: true },
  { id: 14, code: '2100', name: 'Accrued Expenses', type: 'liability', balance: 85000, is_active: true },
  { id: 15, code: '2200', name: 'Taxes Payable', type: 'liability', balance: 125000, is_active: true },
  { id: 16, code: '2300', name: 'Short-term Loans', type: 'liability', balance: 500000, is_active: true },
  { id: 17, code: '2500', name: 'Long-term Liabilities', type: 'liability', balance: 1500000, is_active: true },
  { id: 18, code: '2510', name: 'Bank Loans', type: 'liability', balance: 1200000, is_active: true, parent_id: 17 },
  { id: 19, code: '2520', name: 'Lease Obligations', type: 'liability', balance: 300000, is_active: true, parent_id: 17 },

  // Equity
  { id: 20, code: '3000', name: 'Owner\'s Equity', type: 'equity', balance: 3500000, is_active: true },
  { id: 21, code: '3100', name: 'Share Capital', type: 'equity', balance: 2000000, is_active: true },
  { id: 22, code: '3200', name: 'Retained Earnings', type: 'equity', balance: 1200000, is_active: true },
  { id: 23, code: '3300', name: 'Current Year Earnings', type: 'equity', balance: 300000, is_active: true },

  // Revenue
  { id: 24, code: '4000', name: 'Sales Revenue', type: 'revenue', balance: 8500000, is_active: true },
  { id: 25, code: '4100', name: 'Product Sales', type: 'revenue', balance: 7200000, is_active: true },
  { id: 26, code: '4200', name: 'Service Revenue', type: 'revenue', balance: 1300000, is_active: true },
  { id: 27, code: '4300', name: 'Other Income', type: 'revenue', balance: 250000, is_active: true },
  { id: 28, code: '4310', name: 'Interest Income', type: 'revenue', balance: 45000, is_active: true, parent_id: 27 },
  { id: 29, code: '4320', name: 'Discount Received', type: 'revenue', balance: 85000, is_active: true, parent_id: 27 },

  // Expenses
  { id: 30, code: '5000', name: 'Cost of Goods Sold', type: 'expense', balance: 5200000, is_active: true },
  { id: 31, code: '5100', name: 'Operating Expenses', type: 'expense', balance: 1850000, is_active: true },
  { id: 32, code: '5110', name: 'Rent Expense', type: 'expense', balance: 600000, is_active: true, parent_id: 31 },
  { id: 33, code: '5120', name: 'Utilities Expense', type: 'expense', balance: 150000, is_active: true, parent_id: 31 },
  { id: 34, code: '5130', name: 'Salaries and Wages', type: 'expense', balance: 800000, is_active: true, parent_id: 31 },
  { id: 35, code: '5140', name: 'Office Supplies', type: 'expense', balance: 85000, is_active: true, parent_id: 31 },
  { id: 36, code: '5150', name: 'Marketing Expenses', type: 'expense', balance: 150000, is_active: true, parent_id: 31 },
  { id: 37, code: '5200', name: 'Depreciation Expense', type: 'expense', balance: 275000, is_active: true },
  { id: 38, code: '5300', name: 'Interest Expense', type: 'expense', balance: 95000, is_active: true },
  { id: 39, code: '5400', name: 'Tax Expense', type: 'expense', balance: 450000, is_active: true },

  // Inactive accounts
  { id: 40, code: '6000', name: 'Old Bank Account', type: 'asset', balance: 0, is_active: false },
  { id: 41, code: '6100', name: 'Deprecated Expense Category', type: 'expense', balance: 0, is_active: false },
]

export default function AccountsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<AccountType>('all')
  const [showInactive, setShowInactive] = useState(false)

  // Get account type configuration
  const getTypeConfig = (type: Account['type']) => {
    const configs = {
      asset: { color: 'green', label: t('finance.accountsPage.types.asset') },
      liability: { color: 'red', label: t('finance.accountsPage.types.liability') },
      equity: { color: 'blue', label: t('finance.accountsPage.types.equity') },
      revenue: { color: 'cyan', label: t('finance.accountsPage.types.revenue') },
      expense: { color: 'orange', label: t('finance.accountsPage.types.expense') },
    }
    return configs[type]
  }

  // Filter accounts based on current filters
  const filteredAccounts = useMemo(() => {
    return mockAccounts.filter((account) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          account.name?.toLowerCase().includes(searchLower) ||
          account.code?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Type filter (tabs)
      if (activeTab !== 'all' && account.type !== activeTab) {
        return false
      }

      // Active status filter
      if (!showInactive && !account.is_active) {
        return false
      }

      return true
    })
  }, [searchQuery, activeTab, showInactive])

  // Calculate statistics
  const statistics = useMemo(() => {
    const assets = filteredAccounts
      .filter((a) => a.type === 'asset')
      .reduce((sum, a) => sum + a.balance, 0)
    const liabilities = filteredAccounts
      .filter((a) => a.type === 'liability')
      .reduce((sum, a) => sum + a.balance, 0)
    const equity = filteredAccounts
      .filter((a) => a.type === 'equity')
      .reduce((sum, a) => sum + a.balance, 0)
    const revenue = filteredAccounts
      .filter((a) => a.type === 'revenue')
      .reduce((sum, a) => sum + a.balance, 0)
    const expenses = filteredAccounts
      .filter((a) => a.type === 'expense')
      .reduce((sum, a) => sum + a.balance, 0)

    return {
      total_assets: assets,
      total_liabilities: liabilities,
      total_equity: equity,
      total_revenue: revenue,
      total_expenses: expenses,
      net_income: revenue - expenses,
      total_count: filteredAccounts.length,
    }
  }, [filteredAccounts])

  // Handle refresh
  const handleRefresh = () => {
    notifications.show({
      title: t('finance.accountsPage.notification.refreshed'),
      message: t('finance.accountsPage.notification.refreshedMessage'),
      color: 'blue',
    })
  }

  // Handle edit
  const handleEdit = (accountId: number) => {
    notifications.show({
      title: t('finance.accountsPage.notification.edit'),
      message: t('finance.accountsPage.notification.editMessage', { id: accountId }),
      color: 'blue',
    })
  }

  // Format account code with monospace
  const formatCode = (code: string) => {
    return <Text style={{ fontFamily: 'monospace' }} fw={600}>{code}</Text>
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">{t('finance.accountsPage.title')}</Title>
              <Text c="dimmed" className="text-sm md:text-base">{t('finance.accountsPage.subtitle')}</Text>
            </Box>
            <Group>
              <ActionIcon variant="light" size="lg" onClick={handleRefresh}>
                <IconRefresh size={18} />
              </ActionIcon>
              <Button
                leftSection={<IconPlus size={16} />}
                component={Link}
                to="/finance/accounts/create"
              >
                {t('finance.accountsPage.addAccount')}
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Statistics Cards */}
        <Group>
          <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
            <Group mb="xs">
              <Badge color="green" size="sm" variant="light">{t('finance.accountsPage.types.assets')}</Badge>
            </Group>
            <Text size="xl" fw={700} c="green">
              <NumberFormatter value={statistics.total_assets} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
            <Group mb="xs">
              <Badge color="red" size="sm" variant="light">{t('finance.accountsPage.types.liabilities')}</Badge>
            </Group>
            <Text size="xl" fw={700} c="red">
              <NumberFormatter value={statistics.total_liabilities} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
            <Group mb="xs">
              <Badge color="blue" size="sm" variant="light">{t('finance.accountsPage.types.equity')}</Badge>
            </Group>
            <Text size="xl" fw={700} c="blue">
              <NumberFormatter value={statistics.total_equity} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
            <Group mb="xs">
              <Badge color="cyan" size="sm" variant="light">{t('finance.accountsPage.types.revenue')}</Badge>
            </Group>
            <Text size="xl" fw={700} c="cyan">
              <NumberFormatter value={statistics.total_revenue} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md" style={{ flex: 1 }}>
            <Group mb="xs">
              <Badge color="orange" size="sm" variant="light">{t('finance.accountsPage.types.expenses')}</Badge>
            </Group>
            <Text size="xl" fw={700} c="orange">
              <NumberFormatter value={statistics.total_expenses} prefix="৳" thousandSeparator />
            </Text>
          </Card>
        </Group>

        {/* Filters */}
        <Group>
          <TextInput
            placeholder={t('finance.accountsPage.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />

          <Group gap="sm">
            <Switch
              label={t('finance.accountsPage.showInactive')}
              checked={showInactive}
              onChange={(event) => setShowInactive(event.currentTarget.checked)}
              color="gray"
            />
          </Group>
        </Group>

        {/* Tabs for account types */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as AccountType)}>
          <Tabs.List>
            <Tabs.Tab value="all">{t('finance.accountsPage.tabs.all')} ({filteredAccounts.length})</Tabs.Tab>
            <Tabs.Tab value="asset">{t('finance.accountsPage.tabs.assets')}</Tabs.Tab>
            <Tabs.Tab value="liability">{t('finance.accountsPage.tabs.liabilities')}</Tabs.Tab>
            <Tabs.Tab value="equity">{t('finance.accountsPage.tabs.equity')}</Tabs.Tab>
            <Tabs.Tab value="revenue">{t('finance.accountsPage.tabs.revenue')}</Tabs.Tab>
            <Tabs.Tab value="expense">{t('finance.accountsPage.tabs.expenses')}</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab}>
            <Card withBorder p="0" radius="md" mt="md" shadow="sm">
              <Table.ScrollContainer minWidth={1000}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('finance.accountsPage.tableHeaders.code')}</Table.Th>
                      <Table.Th>{t('finance.accountsPage.tableHeaders.accountName')}</Table.Th>
                      <Table.Th>{t('finance.accountsPage.tableHeaders.type')}</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>{t('finance.accountsPage.tableHeaders.balance')}</Table.Th>
                      <Table.Th>{t('finance.accountsPage.tableHeaders.status')}</Table.Th>
                      <Table.Th style={{ textAlign: 'center' }}>{t('finance.accountsPage.tableHeaders.actions')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredAccounts.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={6}>
                          <Box py="xl" ta="center">
                            <Text c="dimmed">{t('finance.accountsPage.noAccounts')}</Text>
                          </Box>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      filteredAccounts.map((account) => {
                        const typeConfig = getTypeConfig(account.type)
                        return (
                          <Table.Tr key={account.id}>
                            <Table.Td>{formatCode(account.code)}</Table.Td>
                            <Table.Td>
                              <Text size="sm" fw={500}>
                                {account.name}
                                {account.parent_id && (
                                  <Text size="xs" c="dimmed" mt={2}>
                                    {t('finance.accountsPage.subAccount')}
                                  </Text>
                                )}
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              <Badge color={typeConfig.color} variant="light" size="sm">
                                {typeConfig.label}
                              </Badge>
                            </Table.Td>
                            <Table.Td>
                              <Text
                                size="sm"
                                fw={600}
                                ta="right"
                                c={account.balance >= 0 ? 'green' : 'red'}
                              >
                                <NumberFormatter value={Math.abs(account.balance)} prefix="৳" thousandSeparator />
                                {account.balance < 0 && ' (Cr)'}
                              </Text>
                            </Table.Td>
                            <Table.Td>
                              {account.is_active ? (
                                <Badge color="green" variant="light" size="sm" leftSection={<IconCheck size={12} />}>
                                  {t('finance.accountsPage.active')}
                                </Badge>
                              ) : (
                                <Badge color="gray" variant="light" size="sm" leftSection={<IconX size={12} />}>
                                  {t('finance.accountsPage.inactive')}
                                </Badge>
                              )}
                            </Table.Td>
                            <Table.Td>
                              <Group gap="xs" justify="center">
                                <ActionIcon
                                  size="sm"
                                  color="blue"
                                  variant="light"
                                  onClick={() => handleEdit(account.id)}
                                  title={t('common.edit')}
                                >
                                  <IconPencil size={14} />
                                </ActionIcon>
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        )
                      })
                    )}
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>
          </Tabs.Panel>
        </Tabs>

        {/* Summary Stats */}
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              {t('finance.accountsPage.totalAccounts')}: {statistics.total_count}
            </Text>
            {activeTab === 'all' && (
              <Group gap="xl">
                <Text size="sm">
                  <Text span fw={600} c="green">{t('finance.accountsPage.netIncome')}:</Text> ৳{statistics.net_income.toLocaleString()}
                </Text>
              </Group>
            )}
          </Group>
        </Card>
      </Stack>
    </Box>
  )
}
