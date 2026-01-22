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
  ThemeIcon,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconRefresh, IconEye, IconPencil, IconTrash, IconPlus, IconCash, IconAlertTriangle, IconCheck, IconBan, IconX, IconClock, IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { getCheques, getCheque, createCheque, updateCheque, deleteCheque, depositCheque, clearCheque, bounceCheque, cancelCheque, getChequeAlerts, getChequesSummary, getBanks, type Cheque } from '@/utils/api'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'

type ChequeFormData = {
  chequeNumber: string
  issueDate: Date | null
  dueDate: Date | null
  amount: string | number
  payeeName: string
  bankId: string | number
  branchName: string
  type: string
  partyName: string
  partyContact: string
  notes: string
}

export default function ChequesPage() {
  const { t } = useTranslation()
  const [cheques, setCheques] = useState<Cheque[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [bounceModalOpened, setBounceModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [bounceChequeId, setBounceChequeId] = useState<number | null>(null)
  const [viewCheque, setViewCheque] = useState<Cheque | null>(null)
  const [filterType, setFilterType] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [summary, setSummary] = useState<any>(null)
  const [alerts, setAlerts] = useState<any>(null)

  const form = useForm<ChequeFormData>({
    initialValues: {
      chequeNumber: '',
      issueDate: null,
      dueDate: null,
      amount: '',
      payeeName: '',
      bankId: '',
      branchName: '',
      type: 'outgoing',
      partyName: '',
      partyContact: '',
      notes: '',
    },
    validate: {
      chequeNumber: (value) => (!value ? 'Cheque number is required' : null),
      issueDate: (value) => (!value ? 'Issue date is required' : null),
      dueDate: (value) => (!value ? 'Due date is required' : null),
      amount: (value) => (value === '' ? 'Amount is required' : null),
      payeeName: (value) => (!value ? 'Payee name is required' : null),
      bankId: (value) => (!value ? 'Bank is required' : null),
    },
  })

  const bounceForm = useForm({
    bounceReason: '',
  })

  const fetchCheques = useCallback(async () => {
    try {
      setLoading(true)
      const filters: Record<string, any> = {}
      if (filterType) filters.type = filterType
      if (filterStatus) filters.status = filterStatus
      if (searchQuery) filters.search = searchQuery

      const response = await getCheques(filters)
      let data: Cheque[] = []

      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          data = response.data
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'data' in response.data) {
          data = response.data.data as any[]
        }
      }

      setCheques(data)
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load cheques', color: 'red' })
    } finally {
      setLoading(false)
    }
  }, [filterType, filterStatus, searchQuery])

  const fetchSummary = async () => {
    try {
      const response = await getChequesSummary()
      if (response && typeof response === 'object' && 'data' in response) {
        setSummary(response.data)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await getChequeAlerts(7)
      if (response && typeof response === 'object' && 'data' in response) {
        setAlerts(response.data)
      }
    } catch (error) {
      console.error('Failed to load alerts:', error)
    }
  }

  const fetchBanks = async () => {
    try {
      const response = await getBanks()
      let data: any[] = []
      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          data = response.data
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'data' in response.data) {
          data = response.data.data as any[]
        }
      }
      setBanks(data)
    } catch (error) {
      console.error('Failed to load banks:', error)
    }
  }

  useEffect(() => {
    fetchCheques()
    fetchSummary()
    fetchAlerts()
    fetchBanks()
  }, [fetchCheques])

  const handleSubmit = async (values: ChequeFormData) => {
    try {
      const payload = {
        ...values,
        issue_date: values.issueDate ? new Date(values.issueDate).toISOString().split('T')[0] : undefined,
        due_date: values.dueDate ? new Date(values.dueDate).toISOString().split('T')[0] : undefined,
        amount: parseFloat(values.amount as string),
        bank_id: values.bankId ? parseInt(values.bankId as string) : undefined,
      }

      if (editId) {
        await updateCheque(editId, payload)
        notifications.show({ title: 'Success', message: 'Cheque updated successfully', color: 'green' })
      } else {
        await createCheque(payload)
        notifications.show({ title: 'Success', message: 'Cheque created successfully', color: 'green' })
      }

      setModalOpened(false)
      form.reset()
      setEditId(null)
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save cheque',
        color: 'red',
      })
    }
  }

  const openCreateModal = () => {
    setEditId(null)
    form.reset()
    setModalOpened(true)
  }

  const openEditModal = async (cheque: Cheque) => {
    setEditId(cheque.id)
    form.setValues({
      chequeNumber: cheque.chequeNumber,
      issueDate: new Date(cheque.issueDate),
      dueDate: new Date(cheque.dueDate),
      amount: cheque.amount,
      payeeName: cheque.payeeName,
      bankId: cheque.bankId || '',
      branchName: cheque.branchName || '',
      type: cheque.type,
      partyName: cheque.partyName || '',
      partyContact: cheque.partyContact || '',
      notes: cheque.notes || '',
    })
    setModalOpened(true)
  }

  const openViewModal = async (chequeId: number) => {
    try {
      const response = await getCheque(chequeId)
      if (response && typeof response === 'object' && 'data' in response) {
        setViewCheque(response.data)
        setViewModalOpened(true)
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load cheque details', color: 'red' })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Cheque',
      children: <Text size="sm">Are you sure you want to delete this cheque? This action cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteCheque(id)
          notifications.show({ title: 'Success', message: 'Cheque deleted successfully', color: 'green' })
          fetchCheques()
          fetchSummary()
          fetchAlerts()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete cheque',
            color: 'red',
          })
        }
      },
    })
  }

  const handleDeposit = async (id: number) => {
    try {
      await depositCheque(id)
      notifications.show({ title: 'Success', message: 'Cheque marked as deposited', color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to deposit cheque',
        color: 'red',
      })
    }
  }

  const handleClear = async (id: number) => {
    try {
      await clearCheque(id)
      notifications.show({ title: 'Success', message: 'Cheque cleared successfully', color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to clear cheque',
        color: 'red',
      })
    }
  }

  const openBounceModal = (chequeId: number) => {
    setBounceChequeId(chequeId)
    bounceForm.reset()
    setBounceModalOpened(true)
  }

  const handleBounce = async (values: { bounceReason: string }) => {
    if (!bounceChequeId) return

    try {
      await bounceCheque(bounceChequeId, values)
      notifications.show({ title: 'Success', message: 'Cheque marked as bounced', color: 'green' })
      setBounceModalOpened(false)
      setBounceChequeId(null)
      bounceForm.reset()
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to mark cheque as bounced',
        color: 'red',
      })
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelCheque(id)
      notifications.show({ title: 'Success', message: 'Cheque cancelled successfully', color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to cancel cheque',
        color: 'red',
      })
    }
  }

  const getStatusBadge = (cheque: Cheque) => {
    if (cheque.is_overdue) {
      return <Badge color="red">Overdue</Badge>
    }
    if (cheque.is_due_today) {
      return <Badge color="orange">Due Today</Badge>
    }
    if (cheque.status === 'pending') {
      return <Badge color="yellow">Pending</Badge>
    }
    if (cheque.status === 'deposited') return <Badge color="blue">Deposited</Badge>
    if (cheque.status === 'cleared') return <Badge color="green">Cleared</Badge>
    if (cheque.status === 'bounced' || cheque.status === 'dishonored') return <Badge color="red">Bounced</Badge>
    if (cheque.status === 'cancelled') return <Badge color="gray">Cancelled</Badge>
    return <Badge>{cheque.status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    if (type === 'incoming') {
      return <Badge leftSection={<IconArrowDownRight size={12} />} color="green" variant="light">Incoming</Badge>
    }
    return <Badge leftSection={<IconArrowUpRight size={12} />} color="red" variant="light">Outgoing</Badge>
  }

  return (
    <Container size="xl">
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Group>
            <IconCash size={32} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <div>
              <Title order={2}>Cheque / PDC Management</Title>
              <Text c="dimmed" size="sm">Track post-dated cheques and status</Text>
            </div>
          </Group>
          <Group>
            <Button variant="light" leftSection={<IconAlertTriangle size={16} />} onClick={fetchAlerts}>
              Refresh Alerts
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
              Add Cheque
            </Button>
          </Group>
        </Flex>

        {/* Alerts Section */}
        {alerts && (alerts.upcoming?.length > 0 || alerts.overdue?.length > 0) && (
          <Alert variant="light" color="orange" title="Cheques Requiring Attention" icon={<IconAlertTriangle />}>
            <Stack gap="xs">
              {alerts.overdue && alerts.overdue.length > 0 && (
                <Group>
                  <Badge color="red" size="lg">{alerts.overdue.length} Overdue</Badge>
                  <Text size="sm">
                    {alerts.overdue.map((c: any) => c.payee_name).join(', ')}
                  </Text>
                </Group>
              )}
              {alerts.upcoming && alerts.upcoming.length > 0 && (
                <Group>
                  <Badge color="yellow" size="lg">{alerts.upcoming.length} Due Within 7 Days</Badge>
                  <Text size="sm">
                    {alerts.upcoming.map((c: any) => c.payee_name).join(', ')}
                  </Text>
                </Group>
              )}
            </Stack>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Box>
                  <Text c="dimmed" size="sm" fw={500}>
                    Pending
                  </Text>
                  <Text size="xl" fw={700} mt={5}>
                    {summary.by_status?.pending || 0}
                  </Text>
                </Box>
                <ThemeIcon color="yellow" size={40} radius={40}>
                  <IconClock size={20} />
                </ThemeIcon>
              </Group>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Box>
                  <Text c="dimmed" size="sm" fw={500}>
                    Cleared
                  </Text>
                  <Text size="xl" fw={700} mt={5} c="green">
                    {summary.by_status?.cleared || 0}
                  </Text>
                </Box>
                <ThemeIcon color="green" size={40} radius={40}>
                  <IconCheck size={20} />
                </ThemeIcon>
              </Group>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Group justify="space-between">
                <Box>
                  <Text c="dimmed" size="sm" fw={500}>
                    Bounced
                  </Text>
                  <Text size="xl" fw={700} mt={5} c="red">
                    {summary.by_status?.bounced || 0}
                  </Text>
                </Box>
                <ThemeIcon color="red" size={40} radius={40}>
                  <IconBan size={20} />
                </ThemeIcon>
              </Group>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Pending Amount
              </Text>
              <Text size="xl" fw={700} mt={5} c="blue">
                {summary.amounts?.pending_amount?.toFixed(2)}৳
              </Text>
            </Card>
          </SimpleGrid>
        )}

        {/* Filters */}
        <Paper p="md" withBorder>
          <Group>
            <TextInput
              placeholder="Search by number, payee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconCash size={16} />}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by Type"
              clearable
              data={[
                { value: 'incoming', label: 'Incoming' },
                { value: 'outgoing', label: 'Outgoing' },
              ]}
              value={filterType}
              onChange={setFilterType}
              w={120}
            />
            <Select
              placeholder="Filter by Status"
              clearable
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'deposited', label: 'Deposited' },
                { value: 'cleared', label: 'Cleared' },
                { value: 'bounced', label: 'Bounced' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              w={120}
            />
            <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={fetchCheques}>
              Refresh
            </Button>
          </Group>
        </Paper>

        {/* Cheques Table */}
        <Paper p="0" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Cheque No</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Payee</Table.Th>
                  <Table.Th>Bank</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Issue Date</Table.Th>
                  <Table.Th>Due Date</Table.Th>
                  <Table.Th>Status</Table.Th>
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
                ) : cheques.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center">
                      <Text c="dimmed">No cheques found</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  cheques.map((cheque) => (
                    <Table.Tr key={cheque.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {cheque.chequeNumber}
                        </Text>
                      </Table.Td>
                      <Table.Td>{getTypeBadge(cheque.type)}</Table.Td>
                      <Table.Td>
                        <Text size="sm">{cheque.payeeName}</Text>
                        {cheque.partyName && (
                          <Text size="xs" c="dimmed">
                            {cheque.partyName}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{cheque.bank?.name || cheque.bankName || '-'}</Text>
                        {cheque.branchName && (
                          <Text size="xs" c="dimmed">
                            {cheque.branchName}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text ta="right" fw={500}>
                          {cheque.amount.toFixed(2)}৳
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{new Date(cheque.issueDate).toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{new Date(cheque.dueDate).toLocaleDateString()}</Text>
                        {cheque.days_until_due !== undefined && (
                          <Text size="xs" c={cheque.days_until_due < 0 ? 'red' : 'dimmed'}>
                            {cheque.days_until_due < 0 ? `${Math.abs(cheque.days_until_due)} days overdue` : `In ${cheque.days_until_due} days`}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>{getStatusBadge(cheque)}</Table.Td>
                      <Table.Td ta="center">
                        <Group gap="xs" justify="center" wrap="nowrap">
                          <Tooltip label="View Details">
                            <ActionIcon size="sm" variant="light" color="blue" onClick={() => openViewModal(cheque.id)}>
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {cheque.status === 'pending' && (
                            <>
                              <Tooltip label="Deposit">
                                <ActionIcon size="sm" variant="light" color="blue" onClick={() => handleDeposit(cheque.id)}>
                                  <IconCash size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Clear">
                                <ActionIcon size="sm" variant="light" color="green" onClick={() => handleClear(cheque.id)}>
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Bounce">
                                <ActionIcon size="sm" variant="light" color="red" onClick={() => openBounceModal(cheque.id)}>
                                  <IconBan size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Cancel">
                                <ActionIcon size="sm" variant="light" color="gray" onClick={() => handleCancel(cheque.id)}>
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Edit">
                                <ActionIcon size="sm" variant="light" color="orange" onClick={() => openEditModal(cheque)}>
                                  <IconPencil size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          {cheque.status === 'deposited' && (
                            <>
                              <Tooltip label="Clear">
                                <ActionIcon size="sm" variant="light" color="green" onClick={() => handleClear(cheque.id)}>
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Bounce">
                                <ActionIcon size="sm" variant="light" color="red" onClick={() => openBounceModal(cheque.id)}>
                                  <IconBan size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip label="Delete">
                            <ActionIcon size="sm" variant="light" color="red" onClick={() => handleDelete(cheque.id)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Tooltip>
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
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editId ? 'Edit Cheque' : 'New Cheque'} size="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Group grow>
                <TextInput label="Cheque Number" required {...form.getInputProps('chequeNumber')} />
                <Select
                  label="Type"
                  required
                  data={[
                    { value: 'incoming', label: 'Incoming (Receive)' },
                    { value: 'outgoing', label: 'Outgoing (Payment)' },
                  ]}
                  {...form.getInputProps('type')}
                />
              </Group>

              <Group grow>
                <DatePicker label="Issue Date" required {...form.getInputProps('issueDate')} />
                <DatePicker label="Due Date" required {...form.getInputProps('dueDate')} />
              </Group>

              <Group grow>
                <NumberInput label="Amount (৳)" required prefix="৳" decimalScale={2} {...form.getInputProps('amount')} />
                <TextInput label="Payee Name" required {...form.getInputProps('payeeName')} />
              </Group>

              <Select label="Bank" required data={banks.map((b) => ({ value: b.id.toString(), label: b.name }))} {...form.getInputProps('bankId')} />
              <TextInput label="Branch Name" {...form.getInputProps('branchName')} />

              <Group grow>
                <TextInput label="Party Name" {...form.getInputProps('partyName')} />
                <TextInput label="Party Contact" {...form.getInputProps('partyContact')} />
              </Group>

              <Textarea label="Notes" {...form.getInputProps('notes')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Bounce Modal */}
        <Modal opened={bounceModalOpened} onClose={() => setBounceModalOpened(false)} title="Mark Cheque as Bounced" size="sm">
          <form onSubmit={bounceForm.onSubmit(handleBounce)}>
            <Stack>
              <Textarea label="Bounce Reason" required placeholder="Enter reason for cheque bounce..." {...bounceForm.getInputProps('bounceReason')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setBounceModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="red">
                  Mark as Bounced
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal opened={viewModalOpened} onClose={() => setViewModalOpened(false)} title="Cheque Details" size="md">
          {viewCheque && (
            <Stack>
              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    Cheque Number
                  </Text>
                  <Text size="lg" fw={500}>
                    {viewCheque.chequeNumber}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Type
                  </Text>
                  {getTypeBadge(viewCheque.type)}
                </Box>
              </Group>

              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    Amount
                  </Text>
                  <Text size="lg" fw={500}>
                    {viewCheque.amount.toFixed(2)}৳
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    Status
                  </Text>
                  {getStatusBadge(viewCheque)}
                </Box>
              </Group>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  Dates
                </Text>
                <SimpleGrid cols={2}>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Issue Date
                    </Text>
                    <Text size="md">{new Date(viewCheque.issueDate).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Due Date
                    </Text>
                    <Text size="md">{new Date(viewCheque.dueDate).toLocaleDateString()}</Text>
                  </Box>
                  {viewCheque.depositDate && (
                    <Box>
                      <Text size="sm" c="dimmed">
                        Deposit Date
                      </Text>
                      <Text size="md">{new Date(viewCheque.depositDate).toLocaleDateString()}</Text>
                    </Box>
                  )}
                  {viewCheque.clearanceDate && (
                    <Box>
                      <Text size="sm" c="dimmed">
                        Clearance Date
                      </Text>
                      <Text size="md">{new Date(viewCheque.clearanceDate).toLocaleDateString()}</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </Paper>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  Bank Information
                </Text>
                <Text size="md">{viewCheque.bank?.name || viewCheque.bankName || '-'}</Text>
                {viewCheque.branchName && (
                  <Text size="sm" c="dimmed">
                    Branch: {viewCheque.branchName}
                  </Text>
                )}
              </Paper>

              <Box>
                <Text size="sm" c="dimmed">
                  Payee Name
                </Text>
                <Text size="md">{viewCheque.payeeName}</Text>
              </Box>

              {viewCheque.partyName && (
                <Box>
                  <Text size="sm" c="dimmed">
                    Party Name
                  </Text>
                  <Text size="md">{viewCheque.partyName}</Text>
                </Box>
              )}

              {viewCheque.bounceReason && (
                <Box>
                  <Text size="sm" c="red">
                    Bounce Reason
                  </Text>
                  <Text size="md">{viewCheque.bounceReason}</Text>
                </Box>
              )}

              {viewCheque.notes && (
                <Box>
                  <Text size="sm" c="dimmed">
                    Notes
                  </Text>
                  <Text size="sm">{viewCheque.notes}</Text>
                </Box>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Container>
  )
}
