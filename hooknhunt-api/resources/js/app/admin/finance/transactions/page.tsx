'use client'

import { useState, useMemo } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  Select,
  Card,
  Table,
  Pagination,
  Badge,
  Button,
  ActionIcon,
  SimpleGrid,
  NumberFormatter,
} from '@mantine/core'
import {
  IconSearch,
  IconRefresh,
  IconDownload,
  IconArrowUp,
  IconArrowDown,
  IconArrowsExchange,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { DateInput } from '@mantine/dates'
import { useTranslation } from 'react-i18next'

interface Bank {
  id: number
  name: string
  type: string
  account_number: string
}

interface BankTransaction {
  id: number
  bank_id: number
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'
  amount: number
  balance_before: number
  balance_after: number
  reference_number: string
  description: string
  transaction_date: string
  bank?: Bank
}

type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'

// Mock data for development
const mockBanks: Bank[] = [
  { id: 1, name: 'Dutch-Bangla Bank', type: 'bank', account_number: '1234567890' },
  { id: 2, name: 'bKash', type: 'bkash', account_number: '01712345678' },
  { id: 3, name: 'Cash', type: 'cash', account_number: 'N/A' },
  { id: 4, name: 'Brac Bank', type: 'bank', account_number: '9876543210' },
  { id: 5, name: 'Nagad', type: 'nagad', account_number: '01898765432' },
]

const mockTransactions: BankTransaction[] = [
  {
    id: 1,
    bank_id: 1,
    type: 'deposit',
    amount: 50000,
    balance_before: 100000,
    balance_after: 150000,
    reference_number: 'TXN-2024-001',
    description: 'Sales collection',
    transaction_date: '2024-01-15',
    bank: mockBanks[0],
  },
  {
    id: 2,
    bank_id: 2,
    type: 'withdrawal',
    amount: 5000,
    balance_before: 25000,
    balance_after: 20000,
    reference_number: 'TXN-2024-002',
    description: 'Payment to supplier',
    transaction_date: '2024-01-15',
    bank: mockBanks[1],
  },
  {
    id: 3,
    bank_id: 1,
    type: 'transfer_in',
    amount: 30000,
    balance_before: 120000,
    balance_after: 150000,
    reference_number: 'TXN-2024-003',
    description: 'Transfer from Cash',
    transaction_date: '2024-01-14',
    bank: mockBanks[0],
  },
  {
    id: 4,
    bank_id: 3,
    type: 'withdrawal',
    amount: 10000,
    balance_before: 50000,
    balance_after: 40000,
    reference_number: 'TXN-2024-004',
    description: 'Office expenses',
    transaction_date: '2024-01-14',
    bank: mockBanks[2],
  },
  {
    id: 5,
    bank_id: 4,
    type: 'deposit',
    amount: 75000,
    balance_before: 200000,
    balance_after: 275000,
    reference_number: 'TXN-2024-005',
    description: 'Customer payment',
    transaction_date: '2024-01-13',
    bank: mockBanks[3],
  },
  {
    id: 6,
    bank_id: 2,
    type: 'deposit',
    amount: 15000,
    balance_before: 20000,
    balance_after: 35000,
    reference_number: 'TXN-2024-006',
    description: 'bKash payment received',
    transaction_date: '2024-01-13',
    bank: mockBanks[1],
  },
  {
    id: 7,
    bank_id: 1,
    type: 'transfer_out',
    amount: 20000,
    balance_before: 150000,
    balance_after: 130000,
    reference_number: 'TXN-2024-007',
    description: 'Transfer to bKash',
    transaction_date: '2024-01-12',
    bank: mockBanks[0],
  },
  {
    id: 8,
    bank_id: 5,
    type: 'deposit',
    amount: 25000,
    balance_before: 30000,
    balance_after: 55000,
    reference_number: 'TXN-2024-008',
    description: 'Nagad collection',
    transaction_date: '2024-01-12',
    bank: mockBanks[4],
  },
  {
    id: 9,
    bank_id: 3,
    type: 'deposit',
    amount: 45000,
    balance_before: 40000,
    balance_after: 85000,
    reference_number: 'TXN-2024-009',
    description: 'Cash sales',
    transaction_date: '2024-01-11',
    bank: mockBanks[2],
  },
  {
    id: 10,
    bank_id: 4,
    type: 'withdrawal',
    amount: 15000,
    balance_before: 275000,
    balance_after: 260000,
    reference_number: 'TXN-2024-010',
    description: 'Utility bill payment',
    transaction_date: '2024-01-11',
    bank: mockBanks[3],
  },
]

export default function TransactionsPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<TransactionType>('all')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Filter transactions based on current filters
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.reference_number?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Bank filter
      if (selectedBank && transaction.bank_id !== parseInt(selectedBank)) {
        return false
      }

      // Type filter
      if (selectedType !== 'all' && transaction.type !== selectedType) {
        return false
      }

      // Date filter
      if (startDate) {
        const transactionDate = new Date(transaction.transaction_date)
        if (transactionDate < startDate) return false
      }

      if (endDate) {
        const transactionDate = new Date(transaction.transaction_date)
        if (transactionDate > endDate) return false
      }

      return true
    })
  }, [searchQuery, selectedBank, selectedType, startDate, endDate])

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage])

  // Calculate statistics from filtered data
  const statistics = useMemo(() => {
    const totalDeposits = filteredTransactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalWithdrawals = filteredTransactions
      .filter((t) => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalTransferIn = filteredTransactions
      .filter((t) => t.type === 'transfer_in')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalTransferOut = filteredTransactions
      .filter((t) => t.type === 'transfer_out')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalInflow = totalDeposits + totalTransferIn
    const totalOutflow = totalWithdrawals + totalTransferOut

    return {
      total_deposits: totalDeposits,
      total_withdrawals: totalWithdrawals,
      total_transfer_in: totalTransferIn,
      total_transfer_out: totalTransferOut,
      total_inflow: totalInflow,
      total_outflow: totalOutflow,
      net_flow: totalInflow - totalOutflow,
      transaction_count: filteredTransactions.length,
    }
  }, [filteredTransactions])

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle refresh
  const handleRefresh = () => {
    notifications.show({
      title: t('finance.banksPage.transactionsPage.notification.refreshed'),
      message: t('finance.banksPage.transactionsPage.notification.refreshedMessage'),
      color: 'blue',
    })
    setCurrentPage(1)
  }

  // Handle export
  const handleExport = () => {
    // Create CSV content
    const headers = [
      t('finance.banksPage.transactionsPage.tableHeaders.date'),
      t('finance.banksPage.transactionsPage.tableHeaders.bank'),
      t('finance.banksPage.transactionsPage.tableHeaders.type'),
      t('finance.banksPage.transactionsPage.tableHeaders.description'),
      t('finance.banksPage.transactionsPage.tableHeaders.reference'),
      t('finance.banksPage.transactionsPage.tableHeaders.amount'),
      t('finance.banksPage.transactionsPage.tableHeaders.balanceAfter')
    ]
    const rows = paginatedTransactions.map((t) => [
      t.transaction_date,
      t.bank?.name || 'N/A',
      t.type,
      t.description || '',
      t.reference_number || '',
      t.amount.toString(),
      t.balance_after.toString(),
    ])

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    notifications.show({
      title: t('finance.banksPage.transactionsPage.notification.exportSuccess'),
      message: t('finance.banksPage.transactionsPage.notification.exportSuccessMessage'),
      color: 'green',
    })
  }

  // Get transaction type badge color and label
  const getTypeBadge = (type: string) => {
    const config: Record<string, { color: string; label: string; icon: any }> = {
      deposit: {
        color: 'green',
        label: t('finance.banksPage.transactionsPage.transactionTypes.deposit'),
        icon: IconArrowUp
      },
      withdrawal: {
        color: 'red',
        label: t('finance.banksPage.transactionsPage.transactionTypes.withdrawal'),
        icon: IconArrowDown
      },
      transfer_in: {
        color: 'cyan',
        label: t('finance.banksPage.transactionsPage.transactionTypes.transferIn'),
        icon: IconArrowDown
      },
      transfer_out: {
        color: 'orange',
        label: t('finance.banksPage.transactionsPage.transactionTypes.transferOut'),
        icon: IconArrowUp
      },
    }
    return config[type] || {
      color: 'gray',
      label: t('finance.banksPage.transactionsPage.transactionTypes.unknown'),
      icon: IconArrowsExchange
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Bank options for select
  const bankOptions = useMemo(
    () =>
      mockBanks.map((bank) => ({
        value: bank.id.toString(),
        label: `${bank.name} (${bank.account_number})`,
      })),
    []
  )

  // Type options
  const typeOptions = [
    { value: 'all', label: t('finance.banksPage.transactionsPage.typeLabels.all') },
    { value: 'deposit', label: t('finance.banksPage.transactionsPage.typeLabels.deposits') },
    { value: 'withdrawal', label: t('finance.banksPage.transactionsPage.typeLabels.withdrawals') },
    { value: 'transfer_in', label: t('finance.banksPage.transactionsPage.typeLabels.transfersIn') },
    { value: 'transfer_out', label: t('finance.banksPage.transactionsPage.typeLabels.transfersOut') },
  ]

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">
                {t('finance.banksPage.transactionsPage.title')}
              </Title>
              <Text c="dimmed" className="text-sm md:text-base">
                {t('finance.banksPage.transactionsPage.subtitle')}
              </Text>
            </Box>
            <Group>
              <ActionIcon variant="light" size="lg" onClick={handleRefresh}>
                <IconRefresh size={18} />
              </ActionIcon>
              <Button leftSection={<IconDownload size={16} />} variant="light" onClick={handleExport}>
                {t('finance.banksPage.transactionsPage.export')}
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Statistics Cards */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconArrowUp size={20} style={{ color: 'var(--mantine-color-green-filled)' }} />
              <Text size="xs" c="dimmed">{t('finance.banksPage.transactionsPage.totalInflow')}</Text>
            </Group>
            <Text size="xl" fw={700}>
              <NumberFormatter value={statistics.total_inflow} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconArrowDown size={20} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Text size="xs" c="dimmed">{t('finance.banksPage.transactionsPage.totalOutflow')}</Text>
            </Group>
            <Text size="xl" fw={700}>
              <NumberFormatter value={statistics.total_outflow} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconArrowsExchange size={20} style={{ color: 'var(--mantine-color-blue-filled)' }} />
              <Text size="xs" c="dimmed">{t('finance.banksPage.transactionsPage.netFlow')}</Text>
            </Group>
            <Text
              size="xl"
              fw={700}
              c={statistics.net_flow >= 0 ? 'green' : 'red'}
            >
              <NumberFormatter value={statistics.net_flow} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconRefresh size={20} style={{ color: 'var(--mantine-color-purple-filled)' }} />
              <Text size="xs" c="dimmed">{t('finance.banksPage.transactionsPage.transactionsCount')}</Text>
            </Group>
            <Text size="xl" fw={700}>{statistics.transaction_count}</Text>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <SimpleGrid cols={{ base: 1, md: 4 }} spacing="md">
          <TextInput
            placeholder={t('finance.banksPage.transactionsPage.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          <Select
            placeholder={t('finance.banksPage.transactionsPage.selectBank')}
            data={bankOptions}
            value={selectedBank}
            onChange={setSelectedBank}
            clearable
            searchable
          />

          <Select
            placeholder={t('finance.banksPage.transactionsPage.selectType')}
            data={typeOptions}
            value={selectedType}
            onChange={(value) => setSelectedType(value as TransactionType)}
          />

          <DateInput
            placeholder={t('finance.banksPage.transactionsPage.startDate')}
            value={startDate}
            onChange={(value) => setStartDate(value as Date | null)}
            maxDate={endDate || undefined}
            clearable
          />
        </SimpleGrid>

        {/* Desktop Table */}
        <Card withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }} shadow="sm">
          <Table.ScrollContainer minWidth={1000}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.date')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.bank')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.type')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.description')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.reference')}</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>{t('finance.banksPage.transactionsPage.tableHeaders.amount')}</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>{t('finance.banksPage.transactionsPage.tableHeaders.balanceAfter')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {paginatedTransactions.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={7}>
                      <Box py="xl" ta="center">
                        <Text c="dimmed">{t('finance.banksPage.transactionsPage.noTransactions')}</Text>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  paginatedTransactions.map((transaction) => {
                    const typeConfig = getTypeBadge(transaction.type)
                    return (
                      <Table.Tr key={transaction.id}>
                        <Table.Td>
                          <Text size="sm">{formatDate(transaction.transaction_date)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500}>
                            {transaction.bank?.name || 'N/A'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={typeConfig.color} size="sm" variant="light" leftSection={<typeConfig.icon size={12} />}>
                            {typeConfig.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{transaction.description || '-'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" c="dimmed">
                            {transaction.reference_number || '-'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text
                            size="sm"
                            fw={600}
                            ta="right"
                            c={['deposit', 'transfer_in'].includes(transaction.type) ? 'green' : 'red'}
                          >
                            {['deposit', 'transfer_in'].includes(transaction.type) ? '+' : '-'}৳{' '}
                            {transaction.amount.toLocaleString()}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm" fw={500} ta="right">
                            <NumberFormatter value={transaction.balance_after} prefix="৳" thousandSeparator />
                          </Text>
                        </Table.Td>
                      </Table.Tr>
                    )
                  })
                )}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Card>

        {/* Mobile Card View */}
        <Stack display={{ base: 'block', md: 'none' }}>
          {paginatedTransactions.length === 0 ? (
            <Card withBorder p="xl" ta="center" shadow="sm">
              <Text c="dimmed">{t('finance.banksPage.transactionsPage.noTransactions')}</Text>
            </Card>
          ) : (
            paginatedTransactions.map((transaction) => {
              const typeConfig = getTypeBadge(transaction.type)
              return (
                <Card key={transaction.id} shadow="sm" p="sm" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Badge color={typeConfig.color} size="sm" variant="light" leftSection={<typeConfig.icon size={12} />}>
                      {typeConfig.label}
                    </Badge>
                    <Text size="xs" c="dimmed">{formatDate(transaction.transaction_date)}</Text>
                  </Group>

                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500}>
                      {transaction.bank?.name || 'N/A'}
                    </Text>
                    <Text
                      size="sm"
                      fw={700}
                      c={['deposit', 'transfer_in'].includes(transaction.type) ? 'green' : 'red'}
                    >
                      {['deposit', 'transfer_in'].includes(transaction.type) ? '+' : '-'}৳{' '}
                      {transaction.amount.toLocaleString()}
                    </Text>
                  </Group>

                  {transaction.description && (
                    <Text size="xs" c="dimmed" mb="xs">
                      {transaction.description}
                    </Text>
                  )}

                  {transaction.reference_number && (
                    <Text size="xs" c="dimmed">
                      Ref: {transaction.reference_number}
                    </Text>
                  )}

                  <Box mt="xs">
                    <Text size="xs" c="dimmed">
                      {t('finance.banksPage.transactionsPage.tableHeaders.balanceAfter')}:{' '}
                      <Text span fw={500} c="bright">
                        <NumberFormatter value={transaction.balance_after} prefix="৳" thousandSeparator />
                      </Text>
                    </Text>
                  </Box>
                </Card>
              )
            })
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
