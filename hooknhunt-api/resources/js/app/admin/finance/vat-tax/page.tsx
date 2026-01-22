import { useEffect, useState, useCallback } from 'react'
import {
  Box,
  Group,
  Paper,
  Table,
  Text,
  Title,
  Button,
  Badge,
  Stack,
  Select,
  TextInput,
  NumberInput,
  Modal,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Container,
  SimpleGrid,
  Card,
  Flex,
  Alert,
  Textarea,
  NativeSelect,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconRefresh, IconEye, IconPencil, IconTrash, IconPlus, IconReceipt, IconCoin, IconCheck, IconFile, IconAlertTriangle, IconArrowDownRight, IconArrowUpRight } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import {
  getVatTaxLedgers,
  getVatTaxLedger,
  createVatTaxLedger,
  updateVatTaxLedger,
  deleteVatTaxLedger,
  markVatTaxAsPaid,
  markVatTaxAsFiled,
  getVatTaxSummary,
  getVatTaxNetCalculation,
  type VatTaxLedger,
  type VatTaxSummary,
} from '@/utils/api'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'

type LedgerFormData = {
  transactionType: string
  taxType: string
  baseAmount: string | number
  taxRate: string | number
  taxAmount: string | number
  direction: string
  flowType: string
  transactionDate: Date | null
  chartAccountId: string | number
  fiscalYear: string
  taxPeriod: string
  challanNumber: string
  challanDate: Date | null
  description: string
  notes: string
}

const TAX_TYPES = [
  { value: 'vat', label: 'VAT' },
  { value: 'tax', label: 'Tax' },
  { value: 'ait', label: 'AIT (Advance Income Tax)' },
]

const TRANSACTION_TYPES = [
  { value: 'purchase', label: 'Purchase' },
  { value: 'sale', label: 'Sale' },
  { value: 'expense', label: 'Expense' },
  { value: 'adjustment', label: 'Adjustment' },
]

const DIRECTIONS = [
  { value: 'input', label: 'Input (Paid on purchases)' },
  { value: 'output', label: 'Output (Collected on sales)' },
]

const FLOW_TYPES = [
  { value: 'debit', label: 'Debit' },
  { value: 'credit', label: 'Credit' },
]

const STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'filed', label: 'Filed' },
  { value: 'paid', label: 'Paid' },
]

export default function VatTaxLedgerPage() {
  const { t } = useTranslation()
  const [ledgers, setLedgers] = useState<VatTaxLedger[]>([])
  const [summary, setSummary] = useState<VatTaxSummary | null>(null)
  const [netCalculation, setNetCalculation] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [paidModalOpened, setPaidModalOpened] = useState(false)
  const [filedModalOpened, setFiledModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<VatTaxLedger | null>(null)
  const [actionEntryId, setActionEntryId] = useState<number | null>(null)
  const [filterTaxType, setFilterTaxType] = useState<string | null>(null)
  const [filterDirection, setFilterDirection] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const form = useForm<LedgerFormData>({
    initialValues: {
      transactionType: 'expense',
      taxType: 'vat',
      baseAmount: '',
      taxRate: '',
      taxAmount: '',
      direction: 'input',
      flowType: 'credit',
      transactionDate: new Date(),
      chartAccountId: '',
      fiscalYear: '',
      taxPeriod: '',
      challanNumber: '',
      challanDate: null,
      description: '',
      notes: '',
    },
    validate: {
      transactionType: (value) => (!value ? 'Transaction type is required' : null),
      taxType: (value) => (!value ? 'Tax type is required' : null),
      baseAmount: (value) => (value === '' ? 'Base amount is required' : null),
      taxRate: (value) => (value === '' ? 'Tax rate is required' : null),
      taxAmount: (value) => (value === '' ? 'Tax amount is required' : null),
      direction: (value) => (!value ? 'Direction is required' : null),
      flowType: (value) => (!value ? 'Flow type is required' : null),
      transactionDate: (value) => (!value ? 'Transaction date is required' : null),
    },
  })

  const paidForm = useForm({
    paymentDate: new Date(),
    paymentReference: '',
  })

  const filedForm = useForm({
    filingDate: new Date(),
    acknowledgementNumber: '',
  })

  // Auto-calculate tax amount when base amount and rate change
  useEffect(() => {
    const base = parseFloat(form.values.baseAmount as string) || 0
    const rate = parseFloat(form.values.taxRate as string) || 0
    const taxAmount = (base * rate) / 100
    form.setFieldValue('taxAmount', taxAmount.toFixed(2))
  }, [form.values.baseAmount, form.values.taxRate])

  const fetchLedgers = useCallback(async () => {
    try {
      setLoading(true)
      const filters: Record<string, any> = {}
      if (filterTaxType) filters.tax_type = filterTaxType
      if (filterDirection) filters.direction = filterDirection
      if (filterStatus) filters.status = filterStatus
      if (searchQuery) filters.search = searchQuery

      const response = await getVatTaxLedgers(filters)
      let data: VatTaxLedger[] = []

      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          data = response.data
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'data' in response.data) {
          data = response.data.data as any[]
        }
      }

      setLedgers(data)
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load VAT/Tax entries', color: 'red' })
    } finally {
      setLoading(false)
    }
  }, [filterTaxType, filterDirection, filterStatus, searchQuery])

  const fetchSummary = async () => {
    try {
      const response = await getVatTaxSummary()
      if (response && typeof response === 'object' && 'data' in response) {
        setSummary(response.data)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  const fetchNetCalculation = async () => {
    try {
      const response = await getVatTaxNetCalculation()
      if (response && typeof response === 'object' && 'data' in response) {
        setNetCalculation(response.data)
      }
    } catch (error) {
      console.error('Failed to load net calculation:', error)
    }
  }

  useEffect(() => {
    fetchLedgers()
    fetchSummary()
    fetchNetCalculation()
  }, [fetchLedgers])

  const handleSubmit = async (values: LedgerFormData) => {
    try {
      const payload = {
        transaction_type: values.transactionType,
        tax_type: values.taxType,
        base_amount: parseFloat(values.baseAmount as string),
        tax_rate: parseFloat(values.taxRate as string),
        tax_amount: parseFloat(values.taxAmount as string),
        direction: values.direction,
        flow_type: values.flowType,
        transaction_date: values.transactionDate ? new Date(values.transactionDate).toISOString().split('T')[0] : undefined,
        chart_account_id: values.chartAccountId ? parseInt(values.chartAccountId as string) : undefined,
        fiscal_year: values.fiscalYear || undefined,
        tax_period: values.taxPeriod || undefined,
        challan_number: values.challanNumber || undefined,
        challan_date: values.challanDate ? new Date(values.challanDate).toISOString().split('T')[0] : undefined,
        description: values.description || undefined,
        notes: values.notes || undefined,
      }

      if (editId) {
        await updateVatTaxLedger(editId, payload)
        notifications.show({ title: 'Success', message: 'Entry updated successfully', color: 'green' })
      } else {
        await createVatTaxLedger(payload)
        notifications.show({ title: 'Success', message: 'Entry created successfully', color: 'green' })
      }

      setModalOpened(false)
      form.reset()
      setEditId(null)
      fetchLedgers()
      fetchSummary()
      fetchNetCalculation()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save entry',
        color: 'red',
      })
    }
  }

  const openCreateModal = () => {
    setEditId(null)
    form.reset()
    setModalOpened(true)
  }

  const openEditModal = async (ledger: VatTaxLedger) => {
    setEditId(ledger.id)
    form.setValues({
      transactionType: ledger.transaction_type,
      taxType: ledger.tax_type,
      baseAmount: ledger.base_amount,
      taxRate: ledger.tax_rate,
      taxAmount: ledger.tax_amount,
      direction: ledger.direction,
      flowType: ledger.flow_type,
      transactionDate: new Date(ledger.transaction_date),
      chartAccountId: ledger.chart_account_id?.toString() || '',
      fiscalYear: ledger.fiscal_year || '',
      taxPeriod: ledger.tax_period || '',
      challanNumber: ledger.challan_number || '',
      challanDate: ledger.challan_date ? new Date(ledger.challan_date) : null,
      description: ledger.description || '',
      notes: ledger.notes || '',
    })
    setModalOpened(true)
  }

  const openViewModal = async (ledgerId: number) => {
    try {
      const response = await getVatTaxLedger(ledgerId)
      if (response && typeof response === 'object' && 'data' in response) {
        setSelectedEntry(response.data)
        setViewModalOpened(true)
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load entry details', color: 'red' })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Entry',
      children: <Text size="sm">Are you sure you want to delete this entry? This action cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteVatTaxLedger(id)
          notifications.show({ title: 'Success', message: 'Entry deleted successfully', color: 'green' })
          fetchLedgers()
          fetchSummary()
          fetchNetCalculation()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete entry',
            color: 'red',
          })
        }
      },
    })
  }

  const openPaidModal = (ledgerId: number) => {
    setActionEntryId(ledgerId)
    paidForm.reset()
    setPaidModalOpened(true)
  }

  const handleMarkAsPaid = async (values: { paymentDate: Date | null; paymentReference: string }) => {
    if (!actionEntryId) return

    try {
      await markVatTaxAsPaid(actionEntryId, {
        payment_date: values.paymentDate ? new Date(values.paymentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        payment_reference: values.paymentReference,
      })

      notifications.show({ title: 'Success', message: 'Entry marked as paid', color: 'green' })
      setPaidModalOpened(false)
      setActionEntryId(null)
      paidForm.reset()
      fetchLedgers()
      fetchSummary()
      fetchNetCalculation()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to mark as paid',
        color: 'red',
      })
    }
  }

  const openFiledModal = (ledgerId: number) => {
    setActionEntryId(ledgerId)
    filedForm.reset()
    setFiledModalOpened(true)
  }

  const handleMarkAsFiled = async (values: { filingDate: Date | null; acknowledgementNumber: string }) => {
    if (!actionEntryId) return

    try {
      await markVatTaxAsFiled(actionEntryId, {
        filing_date: values.filingDate ? new Date(values.filingDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        acknowledgement_number: values.acknowledgementNumber || undefined,
      })

      notifications.show({ title: 'Success', message: 'Entry marked as filed', color: 'green' })
      setFiledModalOpened(false)
      setActionEntryId(null)
      filedForm.reset()
      fetchLedgers()
      fetchSummary()
      fetchNetCalculation()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to mark as filed',
        color: 'red',
      })
    }
  }

  const getTaxTypeBadge = (taxType: string) => {
    if (taxType === 'vat') return <Badge color="blue">VAT</Badge>
    if (taxType === 'tax') return <Badge color="orange">Tax</Badge>
    if (taxType === 'ait') return <Badge color="purple">AIT</Badge>
    return <Badge>{taxType}</Badge>
  }

  const getDirectionBadge = (direction: string) => {
    if (direction === 'input') {
      return <Badge leftSection={<IconArrowDownRight size={12} />} color="green" variant="light">Input</Badge>
    }
    return <Badge leftSection={<IconArrowUpRight size={12} />} color="red" variant="light">Output</Badge>
  }

  const getStatusBadge = (status: string) => {
    if (status === 'pending') return <Badge color="yellow">Pending</Badge>
    if (status === 'filed') return <Badge color="blue">Filed</Badge>
    if (status === 'paid') return <Badge color="green">Paid</Badge>
    return <Badge>{status}</Badge>
  }

  return (
    <Container size="xl">
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Group>
            <IconReceipt size={32} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <div>
              <Title order={2}>VAT/Tax Ledger</Title>
              <Text c="dimmed" size="sm">Track VAT, tax, and AIT transactions</Text>
            </div>
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
            Add Entry
          </Button>
        </Flex>

        {/* Alert for net payable */}
        {netCalculation && netCalculation.total_net_payable > 0 && (
          <Alert variant="light" color="orange" title="Net Payable" icon={<IconCoin />}>
            <Text size="sm">
              Total net VAT/Tax payable: <Text fw={700}>{netCalculation.total_net_payable.toFixed(2)}৳</Text>
            </Text>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                VAT Collected (Output)
              </Text>
              <Text size="xl" fw={700} mt={5} c="green">
                {summary.vat.collected.toFixed(2)}৳
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                VAT Paid (Input)
              </Text>
              <Text size="xl" fw={700} mt={5} c="red">
                {summary.vat.paid.toFixed(2)}৳
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Tax/AIT Collected
              </Text>
              <Text size="xl" fw={700} mt={5} c="green">
                {summary.tax.collected.toFixed(2)}৳
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Net Payable
              </Text>
              <Text size="xl" fw={700} mt={5} c={summary.total.net_payable > 0 ? 'red' : 'green'}>
                {summary.total.net_payable.toFixed(2)}৳
              </Text>
            </Card>
          </SimpleGrid>
        )}

        {/* Filters */}
        <Paper p="md" withBorder>
          <Group>
            <TextInput
              placeholder="Search by description, challan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconReceipt size={16} />}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by Type"
              clearable
              data={TAX_TYPES}
              value={filterTaxType}
              onChange={setFilterTaxType}
              w={120}
            />
            <Select
              placeholder="Filter by Direction"
              clearable
              data={DIRECTIONS}
              value={filterDirection}
              onChange={setFilterDirection}
              w={150}
            />
            <Select
              placeholder="Filter by Status"
              clearable
              data={STATUSES}
              value={filterStatus}
              onChange={setFilterStatus}
              w={120}
            />
            <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={fetchLedgers}>
              Refresh
            </Button>
          </Group>
        </Paper>

        {/* Ledgers Table */}
        <Paper p="0" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Direction</Table.Th>
                  <Table.Th>Base Amount</Table.Th>
                  <Table.Th>Tax Rate</Table.Th>
                  <Table.Th>Tax Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Challan No</Table.Th>
                  <Table.Th ta="center">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center">
                      <Text c="dimmed">Loading...</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : ledgers.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center">
                      <Text c="dimmed">No VAT/Tax entries found</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  ledgers.map((ledger) => (
                    <Table.Tr key={ledger.id}>
                      <Table.Td>
                        <Text size="sm">{new Date(ledger.transaction_date).toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>{getTaxTypeBadge(ledger.tax_type)}</Table.Td>
                      <Table.Td>{getDirectionBadge(ledger.direction)}</Table.Td>
                      <Table.Td>
                        <Text ta="right">{ledger.base_amount.toFixed(2)}৳</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{ledger.tax_rate}%</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text ta="right" fw={500}>
                          {ledger.tax_amount.toFixed(2)}৳
                        </Text>
                      </Table.Td>
                      <Table.Td>{getStatusBadge(ledger.status)}</Table.Td>
                      <Table.Td>
                        <Text size="sm">{ledger.challan_number || '-'}</Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Group gap="xs" justify="center" wrap="nowrap">
                          <Tooltip label="View Details">
                            <ActionIcon size="sm" variant="light" color="blue" onClick={() => openViewModal(ledger.id)}>
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {ledger.status === 'pending' && (
                            <>
                              <Tooltip label="Edit">
                                <ActionIcon size="sm" variant="light" color="orange" onClick={() => openEditModal(ledger)}>
                                  <IconPencil size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Mark as Filed">
                                <ActionIcon size="sm" variant="light" color="blue" onClick={() => openFiledModal(ledger.id)}>
                                  <IconFile size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Delete">
                                <ActionIcon size="sm" variant="light" color="red" onClick={() => handleDelete(ledger.id)}>
                                  <IconTrash size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          {ledger.status === 'filed' && (
                            <Tooltip label="Mark as Paid">
                              <ActionIcon size="sm" variant="light" color="green" onClick={() => openPaidModal(ledger.id)}>
                                <IconCheck size={16} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))
                )}
              </Table.Tbody>
            </Table>
          </ScrollArea>
        </Paper>

        {/* Create/Edit Modal */}
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editId ? 'Edit Entry' : 'New Entry'} size="lg">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Group grow>
                <NativeSelect label="Transaction Type" data={TRANSACTION_TYPES} required {...form.getInputProps('transactionType')} />
                <NativeSelect label="Tax Type" data={TAX_TYPES} required {...form.getInputProps('taxType')} />
              </Group>

              <Group grow>
                <NativeSelect label="Direction" data={DIRECTIONS} required {...form.getInputProps('direction')} />
                <NativeSelect label="Flow Type" data={FLOW_TYPES} required {...form.getInputProps('flowType')} />
              </Group>

              <Group grow>
                <NumberInput label="Base Amount (৳)" required prefix="৳" decimalScale={2} {...form.getInputProps('baseAmount')} />
                <NumberInput label="Tax Rate (%)" required suffix="%" decimalScale={2} min={0} max={100} {...form.getInputProps('taxRate')} />
              </Group>

              <NumberInput
                label="Tax Amount (৳)"
                required
                prefix="৳"
                decimalScale={2}
                {...form.getInputProps('taxAmount')}
                description="Auto-calculated from base amount and tax rate"
              />

              <DatePicker label="Transaction Date" required {...form.getInputProps('transactionDate')} />

              <Group grow>
                <TextInput label="Fiscal Year" placeholder="2024-2025" {...form.getInputProps('fiscalYear')} />
                <TextInput label="Tax Period" placeholder="e.g., Jul-2024" {...form.getInputProps('taxPeriod')} />
              </Group>

              <Group grow>
                <TextInput label="Challan Number" {...form.getInputProps('challanNumber')} />
                <DatePicker label="Challan Date" {...form.getInputProps('challanDate')} />
              </Group>

              <Textarea label="Description" placeholder="Entry description..." {...form.getInputProps('description')} />
              <Textarea label="Notes" placeholder="Additional notes..." {...form.getInputProps('notes')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Mark as Paid Modal */}
        <Modal opened={paidModalOpened} onClose={() => setPaidModalOpened(false)} title="Mark as Paid" size="sm">
          <form onSubmit={paidForm.onSubmit(handleMarkAsPaid)}>
            <Stack>
              <DatePicker label="Payment Date" required {...paidForm.getInputProps('paymentDate')} />
              <TextInput label="Payment Reference" required placeholder="Payment receipt number..." {...paidForm.getInputProps('paymentReference')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setPaidModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="green">
                  Mark as Paid
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Mark as Filed Modal */}
        <Modal opened={filedModalOpened} onClose={() => setFiledModalOpened(false)} title="Mark as Filed" size="sm">
          <form onSubmit={filedForm.onSubmit(handleMarkAsFiled)}>
            <Stack>
              <DatePicker label="Filing Date" required {...filedForm.getInputProps('filingDate')} />
              <TextInput label="Acknowledgement Number" placeholder="Tax return acknowledgement..." {...filedForm.getInputProps('acknowledgementNumber')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setFiledModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  Mark as Filed
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal opened={viewModalOpened} onClose={() => setViewModalOpened(false)} title="Entry Details" size="md">
          {selectedEntry && (
            <Stack>
              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    Tax Type
                  </Text>
                  {getTaxTypeBadge(selectedEntry.tax_type)}
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Direction
                  </Text>
                  {getDirectionBadge(selectedEntry.direction)}
                </Box>
              </Group>

              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    Base Amount
                  </Text>
                  <Text size="lg" fw={500}>
                    {selectedEntry.base_amount.toFixed(2)}৳
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Tax Rate
                  </Text>
                  <Text size="md">{selectedEntry.tax_rate}%</Text>
                </Box>
              </Group>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  Tax Amount
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {selectedEntry.tax_amount.toFixed(2)}৳
                </Text>
              </Paper>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  Transaction Details
                </Text>
                <SimpleGrid cols={2}>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Transaction Date
                    </Text>
                    <Text size="md">{new Date(selectedEntry.transaction_date).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Status
                    </Text>
                    {getStatusBadge(selectedEntry.status)}
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Fiscal Year
                    </Text>
                    <Text size="md">{selectedEntry.fiscal_year || '-'}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Tax Period
                    </Text>
                    <Text size="md">{selectedEntry.tax_period || '-'}</Text>
                  </Box>
                </SimpleGrid>
              </Paper>

              {selectedEntry.challan_number && (
                <Paper withBorder p="sm" radius="md">
                  <Text fw={500} mb="xs">
                    Challan Details
                  </Text>
                  <SimpleGrid cols={2}>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Challan Number
                      </Text>
                      <Text size="md">{selectedEntry.challan_number}</Text>
                    </Box>
                    {selectedEntry.challan_date && (
                      <Box>
                        <Text size="sm" c="dimmed">
                          Challan Date
                        </Text>
                        <Text size="md">{new Date(selectedEntry.challan_date).toLocaleDateString()}</Text>
                      </Box>
                    )}
                  </SimpleGrid>
                </Paper>
              )}

              {selectedEntry.is_paid && (
                <Paper withBorder p="sm" radius="md" bg="green.0">
                  <Text fw={500} mb="xs" c="green">
                    Payment Details
                  </Text>
                  <SimpleGrid cols={2}>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Payment Date
                      </Text>
                      <Text size="md">{selectedEntry.payment_date ? new Date(selectedEntry.payment_date).toLocaleDateString() : '-'}</Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Payment Reference
                      </Text>
                      <Text size="md">{selectedEntry.payment_reference || '-'}</Text>
                    </Box>
                  </SimpleGrid>
                </Paper>
              )}

              {selectedEntry.description && (
                <Box>
                  <Text size="sm" c="dimmed">
                    Description
                  </Text>
                  <Text size="sm">{selectedEntry.description}</Text>
                </Box>
              )}

              {selectedEntry.notes && (
                <Box>
                  <Text size="sm" c="dimmed">
                    Notes
                  </Text>
                  <Text size="sm">{selectedEntry.notes}</Text>
                </Box>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  )
}
