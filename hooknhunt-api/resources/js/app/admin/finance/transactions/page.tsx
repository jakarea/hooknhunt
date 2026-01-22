'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
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
  Skeleton,
} from '@mantine/core'
import { usePermissions } from '@/hooks/usePermissions'
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
import {
  getBankTransactions,
  getBankTransactionStatistics,
  getBanks,
  type BankTransaction,
  type TransactionType,
} from '@/utils/api'

export default function TransactionsPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  // Permission check - user needs finance transactions view permission
  if (!hasPermission('finance_transactions_view')) {
    return (
      <Stack p="xl">
        <Card withBorder p="xl" shadow="sm" ta="center">
          <Title order={3}>Access Denied</Title>
          <Text c="dimmed">You don't have permission to view Transactions.</Text>
        </Card>
      </Stack>
    )
  }

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [transactions, setTransactions] = useState<BankTransaction[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBank, setSelectedBank] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<TransactionType>('all')
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Fetch transactions
  const fetchTransactions = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (selectedBank) filters.bank_id = parseInt(selectedBank)
      if (selectedType !== 'all') filters.type = selectedType
      if (startDate) filters.start_date = startDate.toISOString().split('T')[0]
      if (endDate) filters.end_date = endDate.toISOString().split('T')[0]

      const response = await getBankTransactions(filters)

      // Handle nested response structure: { data: { data: [...], ... } }
      let transactionsData: BankTransaction[] = []
      if (response && typeof response === 'object') {
        if ('data' in response) {
          const innerData = response.data
          if (typeof innerData === 'object' && 'data' in innerData && Array.isArray(innerData.data)) {
            transactionsData = innerData.data
          } else if (Array.isArray(innerData)) {
            transactionsData = innerData
          }
        } else if (Array.isArray(response)) {
          transactionsData = response
        }
      }

      setTransactions(transactionsData)
      setCurrentPage(1)
    } catch (error) {
      notifications.show({
        title: t('finance.banksPage.transactionsPage.notification.errorLoading'),
        message: t('common.somethingWentWrong'),
        color: 'red',
      })
      setTransactions([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [searchQuery, selectedBank, selectedType, startDate, endDate, t])

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const filters: any = {}
      if (selectedBank) filters.bank_id = parseInt(selectedBank)
      if (startDate) filters.start_date = startDate.toISOString().split('T')[0]
      if (endDate) filters.end_date = endDate.toISOString().split('T')[0]

      const response = await getBankTransactionStatistics(filters)

      if (response && typeof response === 'object') {
        if ('data' in response) {
          setStatistics(response.data)
        } else {
          setStatistics(response)
        }
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }, [selectedBank, startDate, endDate])

  // Fetch banks for dropdown
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await getBanks()
        let banksData: any[] = []
        if (response && typeof response === 'object') {
          if ('data' in response && Array.isArray(response.data)) {
            banksData = response.data
          } else if (Array.isArray(response)) {
            banksData = response
          }
        }
        setBanks(banksData)
      } catch (error) {
        console.error('Failed to fetch banks:', error)
      }
    }
    fetchBanks()
  }, [])

  // Initial load
  useEffect(() => {
    fetchTransactions(true)
    fetchStatistics()
  }, [])

  // Refresh statistics when filters change
  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  // Manual refresh
  const handleRefresh = () => {
    fetchTransactions(false)
    fetchStatistics()
    notifications.show({
      title: t('finance.banksPage.transactionsPage.notification.refreshed'),
      message: t('finance.banksPage.transactionsPage.notification.refreshedMessage'),
      color: 'blue',
    })
  }

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(transactions.length / itemsPerPage)
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return transactions.slice(start, start + itemsPerPage)
  }, [transactions, currentPage])

  // Handle export
  const handleExport = () => {
    // Create CSV content
    const headers = [
      t('finance.banksPage.transactionsPage.tableHeaders.date'),
      t('finance.banksPage.transactionsPage.tableHeaders.type'),
      t('finance.banksPage.transactionsPage.tableHeaders.description'),
      t('finance.banksPage.transactionsPage.tableHeaders.reference'),
      t('finance.banksPage.transactionsPage.tableHeaders.balanceBefore'),
      t('finance.banksPage.transactionsPage.tableHeaders.amount'),
      t('finance.banksPage.transactionsPage.tableHeaders.balanceAfter')
    ]
    const rows = paginatedTransactions.map((t) => [
      t.transactionDate,
      t.bank?.name ? `${t.type} (${t.bank.name})` : t.type,
      t.description || '',
      t.referenceNumber || '',
      t.balanceBefore || '0',
      t.amount,
      t.balanceAfter || '0',
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

  // Format amount (handle string from API)
  const formatAmount = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return num.toLocaleString()
  }

  // Bank options for select
  const bankOptions = useMemo(
    () =>
      banks.map((bank) => ({
        value: bank.id.toString(),
        label: bank.name,
      })),
    [banks]
  )

  // Type options
  const typeOptions = [
    { value: 'all', label: t('finance.banksPage.transactionsPage.typeLabels.all') },
    { value: 'deposit', label: t('finance.banksPage.transactionsPage.typeLabels.deposits') },
    { value: 'withdrawal', label: t('finance.banksPage.transactionsPage.typeLabels.withdrawals') },
    { value: 'transfer_in', label: t('finance.banksPage.transactionsPage.typeLabels.transfersIn') },
    { value: 'transfer_out', label: t('finance.banksPage.transactionsPage.typeLabels.transfersOut') },
  ]

  // Loading state
  if (loading) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Stack>
          <Skeleton height={40} width="100%" />
          <SimpleGrid cols={{ base: 2, md: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={100} radius="md" />
            ))}
          </SimpleGrid>
          <Skeleton height={60} radius="md" />
          <Skeleton height={400} radius="md" />
        </Stack>
      </Box>
    )
  }

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
              <ActionIcon variant="light" className="text-lg md:text-xl lg:text-2xl" onClick={handleRefresh} loading={refreshing}>
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
              <IconArrowUp size={20} style={{ color: 'var(--mantine-color-green-6)' }} />
              <Text className="text-xs md:text-sm" c="dimmed">{t('finance.banksPage.transactionsPage.totalInflow')}</Text>
            </Group>
            <Text className="text-xl md:text-2xl lg:text-3xl" fw={700}>
              <NumberFormatter value={statistics?.total_inflow || 0} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconArrowDown size={20} style={{ color: 'var(--mantine-color-red-6)' }} />
              <Text className="text-xs md:text-sm" c="dimmed">{t('finance.banksPage.transactionsPage.totalOutflow')}</Text>
            </Group>
            <Text className="text-xl md:text-2xl lg:text-3xl" fw={700}>
              <NumberFormatter value={statistics?.total_outflow || 0} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconArrowsExchange size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
              <Text className="text-xs md:text-sm" c="dimmed">{t('finance.banksPage.transactionsPage.netFlow')}</Text>
            </Group>
            <Text
              className="text-xl md:text-2xl lg:text-3xl"
              fw={700}
              c={(statistics?.net_flow || 0) >= 0 ? 'green' : 'red'}
            >
              <NumberFormatter value={statistics?.net_flow || 0} prefix="৳" thousandSeparator />
            </Text>
          </Card>

          <Card withBorder p="md" radius="md">
            <Group mb="xs">
              <IconRefresh size={20} style={{ color: 'var(--mantine-color-purple-6)' }} />
              <Text className="text-xs md:text-sm" c="dimmed">{t('finance.banksPage.transactionsPage.transactionsCount')}</Text>
            </Group>
            <Text className="text-xl md:text-2xl lg:text-3xl" fw={700}>{statistics?.transaction_count || 0}</Text>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <SimpleGrid cols={{ base: 1, md: 5 }} spacing="md">
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
            onChange={setStartDate}
            maxDate={endDate || undefined}
            clearable
          />

          <DateInput
            placeholder={t('finance.banksPage.transactionsPage.endDate')}
            value={endDate}
            onChange={setEndDate}
            minDate={startDate || undefined}
            clearable
          />
        </SimpleGrid>

        {/* Desktop Table */}
        <Card withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }} shadow="sm">
          <Table.ScrollContainer minWidth={900}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.date')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.type')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.description')}</Table.Th>
                  <Table.Th>{t('finance.banksPage.transactionsPage.tableHeaders.reference')}</Table.Th>
                  <Table.Th style={{ textAlign: 'right' }}>{t('finance.banksPage.transactionsPage.tableHeaders.balanceBefore')}</Table.Th>
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
                          <Text className="text-sm md:text-base">{formatDate(transaction.transactionDate)}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={typeConfig.color} className="text-sm md:text-base" variant="light" leftSection={<typeConfig.icon size={12} />}>
                            {transaction.bank?.name ? `${typeConfig.label} (${transaction.bank.name})` : typeConfig.label}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Text className="text-sm md:text-base">{transaction.description || '-'}</Text>
                        </Table.Td>
                        <Table.Td>
                          <Text className="text-sm md:text-base" c="dimmed">
                            {transaction.referenceNumber || '-'}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text className="text-sm md:text-base" fw={500} ta="right">
                            <NumberFormatter value={parseFloat(transaction.balanceBefore || '0')} prefix="৳" thousandSeparator />
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text
                            className="text-sm md:text-base"
                            fw={600}
                            ta="right"
                            c={['deposit', 'transfer_in'].includes(transaction.type) ? 'green' : 'red'}
                          >
                            {['deposit', 'transfer_in'].includes(transaction.type) ? '+' : '-'}৳{' '}
                            {formatAmount(transaction.amount)}
                          </Text>
                        </Table.Td>
                        <Table.Td>
                          <Text className="text-sm md:text-base" fw={500} ta="right">
                            <NumberFormatter value={parseFloat(transaction.balanceAfter || '0')} prefix="৳" thousandSeparator />
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
                    <Badge color={typeConfig.color} className="text-sm md:text-base" variant="light" leftSection={<typeConfig.icon size={12} />}>
                      {transaction.bank?.name ? `${typeConfig.label} (${transaction.bank.name})` : typeConfig.label}
                    </Badge>
                    <Text className="text-xs md:text-sm" c="dimmed">{formatDate(transaction.transactionDate)}</Text>
                  </Group>

                  <Group justify="space-between" mb="xs">
                    <Text className="text-sm md:text-base" fw={500} truncate style={{ maxWidth: '60%' }}>
                      {transaction.description || '-'}
                    </Text>
                    <Text
                      className="text-sm md:text-base"
                      fw={700}
                      c={['deposit', 'transfer_in'].includes(transaction.type) ? 'green' : 'red'}
                    >
                      {['deposit', 'transfer_in'].includes(transaction.type) ? '+' : '-'}৳{' '}
                      {formatAmount(transaction.amount)}
                    </Text>
                  </Group>

                  {transaction.referenceNumber && (
                    <Text className="text-xs md:text-sm" c="dimmed">
                      Ref: {transaction.referenceNumber}
                    </Text>
                  )}

                  <Group justify="space-between" mt="xs">
                    <Text className="text-xs md:text-sm" c="dimmed">
                      {t('finance.banksPage.transactionsPage.tableHeaders.balanceBefore')}:{' '}
                      <Text span fw={500} c="bright">
                        <NumberFormatter value={parseFloat(transaction.balanceBefore || '0')} prefix="৳" thousandSeparator />
                      </Text>
                    </Text>
                    <Text className="text-xs md:text-sm" c="dimmed">
                      {t('finance.banksPage.transactionsPage.tableHeaders.balanceAfter')}:{' '}
                      <Text span fw={500} c="bright">
                        <NumberFormatter value={parseFloat(transaction.balanceAfter || '0')} prefix="৳" thousandSeparator />
                      </Text>
                    </Text>
                  </Group>
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
              onChange={setCurrentPage}
              className="text-sm md:text-base"
            />
          </Group>
        )}
      </Stack>
    </Box>
  )
}
