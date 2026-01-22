'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Card,
  Table,
  Badge,
  Button,
  ActionIcon,
  TextInput,
  NumberFormatter,
  Skeleton,
  Tabs,
  Select,
  Paper,
  Alert,
  SimpleGrid,
} from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconPencil,
  IconTrash,
  IconAlertCircle,
  IconClock,
  IconCheck,
  IconX,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/usePermissions'
import { modals } from '@mantine/modals'
import {
  getVendorBills,
  deleteVendorBill,
  getAccountsPayableStatistics,
  getAgingReport,
  type VendorBill,
  type AccountsPayableStatistics,
  type AgingReport,
} from '@/utils/api'

export default function AccountsPayablePage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()

  if (!hasPermission('finance.view')) {
    return (
      <Stack p="xl">
        <Paper withBorder p="xl" shadow="sm" ta="center">
          <Title order={3}>Access Denied</Title>
          <Text c="dimmed">You don't have permission to view Accounts Payable.</Text>
        </Paper>
      </Stack>
    )
  }

  const [loading, setLoading] = useState(true)
  const [bills, setBills] = useState<VendorBill[]>([])
  const [statistics, setStatistics] = useState<AccountsPayableStatistics | null>(null)
  const [agingReport, setAgingReport] = useState<AgingReport | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [activeTab, setActiveTab] = useState<string>('bills')

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [billsRes, statsRes, agingRes] = await Promise.all([
        getVendorBills({ per_page: 50 }),
        getAccountsPayableStatistics(),
        getAgingReport(),
      ])
      setBills(billsRes.data || [])
      setStatistics(statsRes.data)
      setAgingReport(agingRes.data)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load accounts payable data',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleDelete = (bill: VendorBill) => {
    modals.openConfirmModal({
      title: 'Delete Bill',
      children: (
        <Text size="sm">
          Are you sure you want to delete bill {bill.bill_number}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteVendorBill(bill.id)
          notifications.show({
            title: 'Success',
            message: 'Bill deleted successfully',
            color: 'green',
          })
          fetchData()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete bill',
            color: 'red',
          })
        }
      },
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'gray',
      open: 'blue',
      partial: 'yellow',
      paid: 'green',
      overdue: 'red',
    }
    return colors[status] || 'gray'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      unpaid: 'red',
      partial: 'yellow',
      paid: 'green',
    }
    return colors[status] || 'gray'
  }

  if (loading) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Stack>
          <Skeleton height={40} width="100%" />
          <Group>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} height={100} style={{ flex: 1 }} />
            ))}
          </Group>
          <Skeleton height={400} radius="md" />
        </Stack>
      </Box>
    )
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Group justify="space-between">
          <Box>
            <Title order={1} className="text-lg md:text-xl lg:text-2xl">Accounts Payable</Title>
            <Text c="dimmed" className="text-sm md:text-base">Vendor bills and payments management</Text>
          </Box>
          <Group>
            <ActionIcon variant="light" onClick={fetchData}>
              <IconRefresh size={18} />
            </ActionIcon>
            <Button leftSection={<IconPlus size={16} />}>
              New Bill
            </Button>
          </Group>
        </Group>

        {/* Statistics Cards */}
        {statistics && (
          <Group>
            <Card withBorder p="md" radius="md" className="flex-1">
              <Text className="text-xs md:text-sm" c="dimmed">Total Bills</Text>
              <Text className="text-xl md:text-2xl" fw={700}>{statistics.total_bills}</Text>
            </Card>
            <Card withBorder p="md" radius="md" className="flex-1">
              <Text className="text-xs md:text-sm" c="dimmed">Unpaid</Text>
              <Text className="text-xl md:text-2xl" fw={700} c="red">{statistics.unpaid_bills}</Text>
            </Card>
            <Card withBorder p="md" radius="md" className="flex-1">
              <Text className="text-xs md:text-sm" c="dimmed">Overdue</Text>
              <Text className="text-xl md:text-2xl" fw={700} c="orange">{statistics.overdue_bills}</Text>
            </Card>
            <Card withBorder p="md" radius="md" className="flex-1">
              <Text className="text-xs md:text-sm" c="dimmed">Total Due</Text>
              <Text className="text-xl md:text-2xl" fw={700} c="blue">
                <NumberFormatter value={statistics.total_due} prefix="৳" thousandSeparator />
              </Text>
            </Card>
          </Group>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="bills" leftSection={<IconClock size={14} />}>Bills</Tabs.Tab>
            <Tabs.Tab value="aging" leftSection={<IconAlertCircle size={14} />}>Aging Report</Tabs.Tab>
          </Tabs.List>

          {/* Bills Tab */}
          <Tabs.Panel value="bills">
            {/* Filters */}
            <Paper withBorder p="md" radius="md" mb="md">
              <Group>
                <TextInput
                  placeholder="Search bills..."
                  leftSection={<IconSearch size={16} />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                  className="flex-1"
                />
                <Select
                  placeholder="Status"
                  clearable
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v || '')}
                  data={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'open', label: 'Open' },
                    { value: 'partial', label: 'Partially Paid' },
                    { value: 'paid', label: 'Paid' },
                    { value: 'overdue', label: 'Overdue' },
                  ]}
                  w={{ base: '100%', sm: 150 }}
                />
              </Group>
            </Paper>

            {/* Desktop Table */}
            <Card withBorder p="0" radius="md" display={{ base: 'none', md: 'block' }}>
              <Table.ScrollContainer minWidth={1000}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Bill #</Table.Th>
                      <Table.Th>Supplier</Table.Th>
                      <Table.Th>Bill Date</Table.Th>
                      <Table.Th>Due Date</Table.Th>
                      <Table.Th ta="right">Total</Table.Th>
                      <Table.Th ta="right">Balance</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th ta="center">Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {bills.length === 0 ? (
                      <Table.Tr>
                        <Table.Td colSpan={8}>
                          <Box py="xl" ta="center">
                            <Text c="dimmed">No bills found</Text>
                          </Box>
                        </Table.Td>
                      </Table.Tr>
                    ) : (
                      bills.map((bill) => (
                        <Table.Tr key={bill.id}>
                          <Table.Td><Text className="font-mono">{bill.bill_number}</Text></Table.Td>
                          <Table.Td>{bill.supplier_name || '-'}</Table.Td>
                          <Table.Td>{bill.bill_date}</Table.Td>
                          <Table.Td>{bill.due_date}</Table.Td>
                          <Table.Td ta="right">
                            <NumberFormatter value={bill.total_amount} prefix="৳" thousandSeparator />
                          </Table.Td>
                          <Table.Td ta="right">
                            <Text fw={600} c={bill.balance_due > 0 ? 'red' : 'green'}>
                              <NumberFormatter value={bill.balance_due} prefix="৳" thousandSeparator />
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs">
                              <Badge color={getStatusColor(bill.status)} variant="light">
                                {bill.status_label || bill.status}
                              </Badge>
                              <Badge color={getPaymentStatusColor(bill.payment_status)} variant="light">
                                {bill.payment_status_label || bill.payment_status}
                              </Badge>
                            </Group>
                          </Table.Td>
                          <Table.Td>
                            <Group gap="xs" justify="center">
                              <ActionIcon size="sm" color="blue" variant="light">
                                <IconPencil size={14} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                color="red"
                                variant="light"
                                onClick={() => handleDelete(bill)}
                              >
                                <IconTrash size={14} />
                              </ActionIcon>
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
            <Stack display={{ base: 'block', md: 'none' }} gap="sm">
              {bills.length === 0 ? (
                <Card withBorder p="xl" ta="center">
                  <Text c="dimmed">No bills found</Text>
                </Card>
              ) : (
                bills.map((bill) => (
                  <Card key={bill.id} withBorder p="sm" radius="md">
                    <Group justify="space-between" mb="xs">
                      <Text className="font-mono" fw={600}>{bill.bill_number}</Text>
                      <Badge color={getStatusColor(bill.status)} variant="light">
                        {bill.status_label || bill.status}
                      </Badge>
                    </Group>
                    <Text size="sm">{bill.supplier_name || '-'}</Text>
                    <Group mt="xs" justify="space-between">
                      <Text size="xs" c="dimmed">Due: {bill.due_date}</Text>
                      <Text size="sm" fw={600} c={bill.balance_due > 0 ? 'red' : 'green'}>
                        <NumberFormatter value={bill.balance_due} prefix="৳" thousandSeparator />
                      </Text>
                    </Group>
                    <Group mt="sm" justify="flex-end">
                      <ActionIcon size="sm" color="blue" variant="light">
                        <IconPencil size={14} />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        color="red"
                        variant="light"
                        onClick={() => handleDelete(bill)}
                      >
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Group>
                  </Card>
                ))
              )}
            </Stack>
          </Tabs.Panel>

          {/* Aging Report Tab */}
          <Tabs.Panel value="aging">
            {agingReport && (
              <Stack>
                <Alert icon={<IconAlertCircle size={16} />} color="blue">
                  <Text className="text-sm md:text-base">
                    Total Outstanding: <Text fw={700} span><NumberFormatter value={agingReport.total_due} prefix="৳" thousandSeparator /></Text>
                  </Text>
                </Alert>

                {/* Aging Buckets */}
                <Title order={3} className="text-base md:text-lg">Aging Summary</Title>
                <Card withBorder p="md">
                  <SimpleGrid cols={{ base: 1, sm: 2, md: 5 }}>
                    <Box>
                      <Text className="text-xs md:text-sm" c="dimmed">Current</Text>
                      <Text className="text-lg md:text-xl" fw={700} c="green">
                        <NumberFormatter value={agingReport.aging.current.amount} prefix="৳" thousandSeparator />
                      </Text>
                      <Text className="text-xs md:text-sm" c="dimmed">
                        {agingReport.aging.current.count} bills
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-xs md:text-sm" c="dimmed">1-30 Days</Text>
                      <Text className="text-lg md:text-xl" fw={700} c="yellow">
                        <NumberFormatter value={agingReport.aging['1_30_days'].amount} prefix="৳" thousandSeparator />
                      </Text>
                      <Text className="text-xs md:text-sm" c="dimmed">
                        {agingReport.aging['1_30_days'].count} bills
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-xs md:text-sm" c="dimmed">31-60 Days</Text>
                      <Text className="text-lg md:text-xl" fw={700} c="orange">
                        <NumberFormatter value={agingReport.aging['31_60_days'].amount} prefix="৳" thousandSeparator />
                      </Text>
                      <Text className="text-xs md:text-sm" c="dimmed">
                        {agingReport.aging['31_60_days'].count} bills
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-xs md:text-sm" c="dimmed">61-90 Days</Text>
                      <Text className="text-lg md:text-xl" fw={700} c="red">
                        <NumberFormatter value={agingReport.aging['61_90_days'].amount} prefix="৳" thousandSeparator />
                      </Text>
                      <Text className="text-xs md:text-sm" c="dimmed">
                        {agingReport.aging['61_90_days'].count} bills
                      </Text>
                    </Box>
                    <Box>
                      <Text className="text-xs md:text-sm" c="dimmed">Over 90 Days</Text>
                      <Text className="text-lg md:text-xl" fw={700} c="red">
                        <NumberFormatter value={agingReport.aging.over_90_days.amount} prefix="৳" thousandSeparator />
                      </Text>
                      <Text className="text-xs md:text-sm" c="dimmed">
                        {agingReport.aging.over_90_days.count} bills
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Card>

                {/* By Supplier */}
                <Title order={3} className="text-base md:text-lg">Aging by Supplier</Title>
                <Card withBorder p="0" radius="md">
                  <Table.ScrollContainer minWidth={800}>
                    <Table striped highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Supplier</Table.Th>
                          <Table.Th ta="right">Current</Table.Th>
                          <Table.Th ta="right">1-30</Table.Th>
                          <Table.Th ta="right">31-60</Table.Th>
                          <Table.Th ta="right">61-90</Table.Th>
                          <Table.Th ta="right">90+</Table.Th>
                          <Table.Th ta="right">Total</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {agingReport.by_supplier.map((supplier) => (
                          <Table.Tr key={supplier.supplier_id}>
                            <Table.Td>{supplier.supplier_name}</Table.Td>
                            <Table.Td ta="right">
                              <NumberFormatter value={supplier.current} prefix="৳" thousandSeparator />
                            </Table.Td>
                            <Table.Td ta="right">
                              <NumberFormatter value={supplier['1_30_days']} prefix="৳" thousandSeparator />
                            </Table.Td>
                            <Table.Td ta="right">
                              <NumberFormatter value={supplier['31_60_days']} prefix="৳" thousandSeparator />
                            </Table.Td>
                            <Table.Td ta="right">
                              <NumberFormatter value={supplier['61_90_days']} prefix="৳" thousandSeparator />
                            </Table.Td>
                            <Table.Td ta="right">
                              <NumberFormatter value={supplier.over_90_days} prefix="৳" thousandSeparator />
                            </Table.Td>
                            <Table.Td ta="right">
                              <Text fw={700}>
                                <NumberFormatter value={supplier.total_due} prefix="৳" thousandSeparator />
                              </Text>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  </Table.ScrollContainer>
                </Card>
              </Stack>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Box>
  )
}
