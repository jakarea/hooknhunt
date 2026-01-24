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
      chequeNumber: (value) => (!value ? t('finance.chequesPage.validation.chequeNumberRequired') : null),
      issueDate: (value) => (!value ? t('finance.chequesPage.validation.issueDateRequired') : null),
      dueDate: (value) => (!value ? t('finance.chequesPage.validation.dueDateRequired') : null),
      amount: (value) => (value === '' ? t('finance.chequesPage.validation.amountRequired') : null),
      payeeName: (value) => (!value ? t('finance.chequesPage.validation.payeeNameRequired') : null),
      bankId: (value) => (!value ? t('finance.chequesPage.validation.bankRequired') : null),
    },
  })

  const bounceForm = useForm({
    bounceReason: '',
    validate: {
      bounceReason: (value) => (!value ? t('finance.chequesPage.validation.bounceReasonRequired') : null),
    },
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
      notifications.show({ title: t('common.error') || 'Error', message: t('finance.chequesPage.notification.fetchError'), color: 'red' })
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
        notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.updateSuccess'), color: 'green' })
      } else {
        await createCheque(payload)
        notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.createSuccess'), color: 'green' })
      }

      setModalOpened(false)
      form.reset()
      setEditId(null)
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: t('common.error') || 'Error',
        message: error.response?.data?.message || t('finance.chequesPage.notification.saveError'),
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
      notifications.show({ title: t('common.error') || 'Error', message: t('finance.chequesPage.notification.loadError'), color: 'red' })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: t('finance.chequesPage.notification.deleteTitle'),
      children: <Text size="sm">{t('finance.chequesPage.notification.deleteConfirm')}</Text>,
      labels: { confirm: t('common.delete') || 'Delete', cancel: t('common.cancel') || 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteCheque(id)
          notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.deleteSuccess'), color: 'green' })
          fetchCheques()
          fetchSummary()
          fetchAlerts()
        } catch (error: any) {
          notifications.show({
            title: t('common.error') || 'Error',
            message: error.response?.data?.message || t('finance.chequesPage.notification.deleteError'),
            color: 'red',
          })
        }
      },
    })
  }

  const handleDeposit = async (id: number) => {
    try {
      await depositCheque(id)
      notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.depositSuccess'), color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: t('common.error') || 'Error',
        message: error.response?.data?.message || t('finance.chequesPage.notification.depositError'),
        color: 'red',
      })
    }
  }

  const handleClear = async (id: number) => {
    try {
      await clearCheque(id)
      notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.clearSuccess'), color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: t('common.error') || 'Error',
        message: error.response?.data?.message || t('finance.chequesPage.notification.clearError'),
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
      notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.bounceSuccess'), color: 'green' })
      setBounceModalOpened(false)
      setBounceChequeId(null)
      bounceForm.reset()
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: t('common.error') || 'Error',
        message: error.response?.data?.message || t('finance.chequesPage.notification.bounceError'),
        color: 'red',
      })
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await cancelCheque(id)
      notifications.show({ title: t('common.success') || 'Success', message: t('finance.chequesPage.notification.cancelSuccess'), color: 'green' })
      fetchCheques()
      fetchSummary()
      fetchAlerts()
    } catch (error: any) {
      notifications.show({
        title: t('common.error') || 'Error',
        message: error.response?.data?.message || t('finance.chequesPage.notification.cancelError'),
        color: 'red',
      })
    }
  }

  const getStatusBadge = (cheque: Cheque) => {
    if (cheque.is_overdue) {
      return <Badge color="red">{t('finance.chequesPage.statusBadges.overdue')}</Badge>
    }
    if (cheque.is_due_today) {
      return <Badge color="orange">{t('finance.chequesPage.statusBadges.dueToday')}</Badge>
    }
    if (cheque.status === 'pending') {
      return <Badge color="yellow">{t('finance.chequesPage.statusBadges.pending')}</Badge>
    }
    if (cheque.status === 'deposited') return <Badge color="blue">{t('finance.chequesPage.statusBadges.deposited')}</Badge>
    if (cheque.status === 'cleared') return <Badge color="green">{t('finance.chequesPage.statusBadges.cleared')}</Badge>
    if (cheque.status === 'bounced' || cheque.status === 'dishonored') return <Badge color="red">{t('finance.chequesPage.statusBadges.bounced')}</Badge>
    if (cheque.status === 'cancelled') return <Badge color="gray">{t('finance.chequesPage.statusBadges.cancelled')}</Badge>
    return <Badge>{cheque.status}</Badge>
  }

  const getTypeBadge = (type: string) => {
    if (type === 'incoming') {
      return <Badge leftSection={<IconArrowDownRight size={12} />} color="green" variant="light">{t('finance.chequesPage.typeBadges.incoming')}</Badge>
    }
    return <Badge leftSection={<IconArrowUpRight size={12} />} color="red" variant="light">{t('finance.chequesPage.typeBadges.outgoing')}</Badge>
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Group>
            <IconCash size={32} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <div>
              <Title order={2}>{t('finance.chequesPage.title')}</Title>
              <Text c="dimmed" size="sm">{t('finance.chequesPage.subtitle')}</Text>
            </div>
          </Group>
          <Group>
            <Button variant="light" leftSection={<IconAlertTriangle size={16} />} onClick={fetchAlerts}>
              {t('finance.chequesPage.refreshAlerts')}
            </Button>
            <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
              {t('finance.chequesPage.addCheque')}
            </Button>
          </Group>
        </Flex>

        {/* Alerts Section */}
        {alerts && (alerts.upcoming?.length > 0 || alerts.overdue?.length > 0) && (
          <Alert variant="light" color="orange" title={t('finance.chequesPage.alerts.title')} icon={<IconAlertTriangle />}>
            <Stack gap="xs">
              {alerts.overdue && alerts.overdue.length > 0 && (
                <Group>
                  <Badge color="red" size="lg">{t('finance.chequesPage.alerts.overdue', { count: alerts.overdue.length })}</Badge>
                  <Text size="sm">
                    {alerts.overdue.map((c: any) => c.payee_name).join(', ')}
                  </Text>
                </Group>
              )}
              {alerts.upcoming && alerts.upcoming.length > 0 && (
                <Group>
                  <Badge color="yellow" size="lg">{t('finance.chequesPage.alerts.dueWithin', { count: alerts.upcoming.length })}</Badge>
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
                    {t('finance.chequesPage.summary.pending')}
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
                    {t('finance.chequesPage.summary.cleared')}
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
                    {t('finance.chequesPage.summary.bounced')}
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
                {t('finance.chequesPage.summary.pendingAmount')}
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
              placeholder={t('finance.chequesPage.filters.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconCash size={16} />}
              style={{ flex: 1 }}
            />
            <Select
              placeholder={t('finance.chequesPage.filters.filterType')}
              clearable
              data={[
                { value: 'incoming', label: t('finance.chequesPage.filters.incoming') },
                { value: 'outgoing', label: t('finance.chequesPage.filters.outgoing') },
              ]}
              value={filterType}
              onChange={setFilterType}
              w={120}
            />
            <Select
              placeholder={t('finance.chequesPage.filters.filterStatus')}
              clearable
              data={[
                { value: 'pending', label: t('finance.chequesPage.filters.pending') },
                { value: 'deposited', label: t('finance.chequesPage.filters.deposited') },
                { value: 'cleared', label: t('finance.chequesPage.filters.cleared') },
                { value: 'bounced', label: t('finance.chequesPage.filters.bounced') },
                { value: 'cancelled', label: t('finance.chequesPage.filters.cancelled') },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              w={120}
            />
            <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={fetchCheques}>
              {t('finance.chequesPage.refresh')}
            </Button>
          </Group>
        </Paper>

        {/* Cheques Table */}
        <Paper p="0" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t('finance.chequesPage.table.chequeNo')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.type')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.payee')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.bank')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.amount')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.issueDate')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.dueDate')}</Table.Th>
                  <Table.Th>{t('finance.chequesPage.table.status')}</Table.Th>
                  <Table.Th ta="center">{t('finance.chequesPage.table.actions')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center">
                      <Text c="dimmed">{t('finance.chequesPage.table.loading')}</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : cheques.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={9} ta="center">
                      <Text c="dimmed">{t('finance.chequesPage.table.noChequesFound')}</Text>
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
                          <Tooltip label={t('finance.chequesPage.actions.viewDetails')}>
                            <ActionIcon size="sm" variant="light" color="blue" onClick={() => openViewModal(cheque.id)}>
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {cheque.status === 'pending' && (
                            <>
                              <Tooltip label={t('finance.chequesPage.actions.deposit')}>
                                <ActionIcon size="sm" variant="light" color="blue" onClick={() => handleDeposit(cheque.id)}>
                                  <IconCash size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={t('finance.chequesPage.actions.clear')}>
                                <ActionIcon size="sm" variant="light" color="green" onClick={() => handleClear(cheque.id)}>
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={t('finance.chequesPage.actions.bounce')}>
                                <ActionIcon size="sm" variant="light" color="red" onClick={() => openBounceModal(cheque.id)}>
                                  <IconBan size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={t('finance.chequesPage.actions.cancel')}>
                                <ActionIcon size="sm" variant="light" color="gray" onClick={() => handleCancel(cheque.id)}>
                                  <IconX size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={t('finance.chequesPage.actions.edit')}>
                                <ActionIcon size="sm" variant="light" color="orange" onClick={() => openEditModal(cheque)}>
                                  <IconPencil size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          {cheque.status === 'deposited' && (
                            <>
                              <Tooltip label={t('finance.chequesPage.actions.clear')}>
                                <ActionIcon size="sm" variant="light" color="green" onClick={() => handleClear(cheque.id)}>
                                  <IconCheck size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label={t('finance.chequesPage.actions.bounce')}>
                                <ActionIcon size="sm" variant="light" color="red" onClick={() => openBounceModal(cheque.id)}>
                                  <IconBan size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip label={t('finance.chequesPage.actions.delete')}>
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
        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editId ? t('finance.chequesPage.modal.editTitle') : t('finance.chequesPage.modal.newTitle')} size="md">
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Group grow>
                <TextInput label={t('finance.chequesPage.modal.chequeNumber')} required {...form.getInputProps('chequeNumber')} />
                <Select
                  label={t('finance.chequesPage.modal.type')}
                  required
                  data={[
                    { value: 'incoming', label: t('finance.chequesPage.modal.typeIncoming') },
                    { value: 'outgoing', label: t('finance.chequesPage.modal.typeOutgoing') },
                  ]}
                  {...form.getInputProps('type')}
                />
              </Group>

              <Group grow>
                <DatePicker label={t('finance.chequesPage.modal.issueDate')} required {...form.getInputProps('issueDate')} />
                <DatePicker label={t('finance.chequesPage.modal.dueDate')} required {...form.getInputProps('dueDate')} />
              </Group>

              <Group grow>
                <NumberInput label={t('finance.chequesPage.modal.amount')} required prefix="৳" decimalScale={2} {...form.getInputProps('amount')} />
                <TextInput label={t('finance.chequesPage.modal.payeeName')} required {...form.getInputProps('payeeName')} />
              </Group>

              <Select label={t('finance.chequesPage.modal.bank')} required data={banks.map((b) => ({ value: b.id.toString(), label: b.name }))} {...form.getInputProps('bankId')} />
              <TextInput label={t('finance.chequesPage.modal.branchName')} {...form.getInputProps('branchName')} />

              <Group grow>
                <TextInput label={t('finance.chequesPage.modal.partyName')} {...form.getInputProps('partyName')} />
                <TextInput label={t('finance.chequesPage.modal.partyContact')} {...form.getInputProps('partyContact')} />
              </Group>

              <Textarea label={t('finance.chequesPage.modal.notes')} {...form.getInputProps('notes')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setModalOpened(false)}>
                  {t('finance.chequesPage.modal.cancel')}
                </Button>
                <Button type="submit">{editId ? t('finance.chequesPage.modal.update') : t('finance.chequesPage.modal.create')}</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Bounce Modal */}
        <Modal opened={bounceModalOpened} onClose={() => setBounceModalOpened(false)} title={t('finance.chequesPage.modal.bounceTitle')} size="sm">
          <form onSubmit={bounceForm.onSubmit(handleBounce)}>
            <Stack>
              <Textarea label={t('finance.chequesPage.modal.bounceReason')} required placeholder={t('finance.chequesPage.modal.bounceReasonPlaceholder')} {...bounceForm.getInputProps('bounceReason')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setBounceModalOpened(false)}>
                  {t('finance.chequesPage.modal.cancel')}
                </Button>
                <Button type="submit" color="red">
                  {t('finance.chequesPage.modal.markAsBounced')}
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal opened={viewModalOpened} onClose={() => setViewModalOpened(false)} title={t('finance.chequesPage.modal.viewTitle')} size="md">
          {viewCheque && (
            <Stack>
              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.chequeNumber')}
                  </Text>
                  <Text size="lg" fw={500}>
                    {viewCheque.chequeNumber}
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.type')}
                  </Text>
                  {getTypeBadge(viewCheque.type)}
                </Box>
              </Group>

              <Group grow>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.amount')}
                  </Text>
                  <Text size="lg" fw={500}>
                    {viewCheque.amount.toFixed(2)}৳
                  </Text>
                </Box>
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.status')}
                  </Text>
                  {getStatusBadge(viewCheque)}
                </Box>
              </Group>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  {t('finance.chequesPage.modal.dates')}
                </Text>
                <SimpleGrid cols={2}>
                  <Box>
                    <Text size="sm" c="dimmed">
                      {t('finance.chequesPage.modal.view.issueDate')}
                    </Text>
                    <Text size="md">{new Date(viewCheque.issueDate).toLocaleDateString()}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      {t('finance.chequesPage.modal.view.dueDate')}
                    </Text>
                    <Text size="md">{new Date(viewCheque.dueDate).toLocaleDateString()}</Text>
                  </Box>
                  {viewCheque.depositDate && (
                    <Box>
                      <Text size="sm" c="dimmed">
                        {t('finance.chequesPage.modal.view.depositDate')}
                      </Text>
                      <Text size="md">{new Date(viewCheque.depositDate).toLocaleDateString()}</Text>
                    </Box>
                  )}
                  {viewCheque.clearanceDate && (
                    <Box>
                      <Text size="sm" c="dimmed">
                        {t('finance.chequesPage.modal.view.clearanceDate')}
                      </Text>
                      <Text size="md">{new Date(viewCheque.clearanceDate).toLocaleDateString()}</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </Paper>

              <Paper withBorder p="sm" radius="md">
                <Text fw={500} mb="xs">
                  {t('finance.chequesPage.modal.bankInformation')}
                </Text>
                <Text size="md">{viewCheque.bank?.name || viewCheque.bankName || '-'}</Text>
                {viewCheque.branchName && (
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.branch', { branch: viewCheque.branchName })}
                  </Text>
                )}
              </Paper>

              <Box>
                <Text size="sm" c="dimmed">
                  {t('finance.chequesPage.modal.view.payeeName')}
                </Text>
                <Text size="md">{viewCheque.payeeName}</Text>
              </Box>

              {viewCheque.partyName && (
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.partyName')}
                  </Text>
                  <Text size="md">{viewCheque.partyName}</Text>
                </Box>
              )}

              {viewCheque.bounceReason && (
                <Box>
                  <Text size="sm" c="red">
                    {t('finance.chequesPage.modal.view.bounceReason')}
                  </Text>
                  <Text size="md">{viewCheque.bounceReason}</Text>
                </Box>
              )}

              {viewCheque.notes && (
                <Box>
                  <Text size="sm" c="dimmed">
                    {t('finance.chequesPage.modal.view.notes')}
                  </Text>
                  <Text size="sm">{viewCheque.notes}</Text>
                </Box>
              )}
            </Stack>
          )}
        </Modal>
      </Stack>
    </Box>
  )
}
