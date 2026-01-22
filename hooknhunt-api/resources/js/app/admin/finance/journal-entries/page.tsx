import { useEffect, useState } from 'react'
import {
  Paper,
  Group,
  Text,
  Button,
  Stack,
  Table,
  Badge,
  NumberFormatter,
  ActionIcon,
  TextInput,
  Select,
  Menu,
  ScrollArea,
  Grid,
  Alert,
  Modal,
  Box,
} from '@mantine/core'
import {
  IconBook,
  IconPlus,
  IconPencil,
  IconTrash,
  IconEye,
  IconRefresh,
  IconDots,
  IconSearch,
  IconFilter,
  IconX,
  IconArrowsLeftRight,
  IconScale,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  getJournalEntries,
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  reverseJournalEntry,
  getNextJournalEntryNumber,
  getJournalEntryStatistics,
  getAccounts,
  type JournalEntry,
  type JournalItem,
  type ChartOfAccount,
} from '@/utils/api'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'

export default function JournalEntriesPage() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [reverseModalOpened, setReverseModalOpened] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [nextNumber, setNextNumber] = useState<string>('')

  // Filters
  const [filters, setFilters] = useState({
    entry_number: '',
    start_date: '',
    end_date: '',
    is_reversed: '',
    search: '',
  })

  // Form for create/edit
  const form = useForm({
    initialValues: {
      entry_number: '',
      date: new Date(),
      description: '',
      items: [
        { account_id: '', debit: '', credit: '' },
        { account_id: '', debit: '', credit: '' },
      ],
    },
    validate: {
      entry_number: (val: string) => (val ? null : 'Entry number is required'),
      date: (val: Date) => (val ? null : 'Date is required'),
      items: {
        account_id: (val: string) => (val ? null : 'Account is required'),
      },
    },
  })

  // Form for reverse
  const reverseForm = useForm({
    initialValues: {
      reason: '',
    },
  })

  useEffect(() => {
    fetchEntries()
    fetchAccounts()
    fetchNextNumber()
  }, [])

  const fetchEntries = async () => {
    setLoading(true)
    try {
      const response = await getJournalEntries({
        ...filters,
        entry_number: filters.entry_number || undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        is_reversed: filters.is_reversed === 'true' ? true : filters.is_reversed === 'false' ? false : undefined,
        search: filters.search || undefined,
      })
      // Handle nested response structure
      const entriesData = response?.data || response || []
      setEntries(Array.isArray(entriesData) ? entriesData : entriesData?.data || [])
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to fetch journal entries',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts()
      // Handle nested response structure
      const accountsData = response?.data || response || []
      setAccounts(Array.isArray(accountsData) ? accountsData : [])
    } catch (error: any) {
      console.error('Failed to fetch accounts:', error)
      setAccounts([])
    }
  }

  const fetchNextNumber = async () => {
    try {
      const response = await getNextJournalEntryNumber()
      setNextNumber(response.data?.next_entry_number || 'JE-000001')
      form.setFieldValue('entry_number', response.data?.next_entry_number || 'JE-000001')
    } catch (error: any) {
      console.error('Failed to fetch next number:', error)
    }
  }

  const handleOpenCreate = () => {
    setEditId(null)
    form.reset()
    fetchNextNumber()
    form.setValues({
      entry_number: nextNumber,
      date: new Date(),
      description: '',
      items: [
        { account_id: '', debit: '', credit: '' },
        { account_id: '', debit: '', credit: '' },
      ],
    })
    setModalOpened(true)
  }

  const handleOpenEdit = async (id: number) => {
    try {
      const response = await getJournalEntry(id)
      const entry = response.data

      setEditId(id)
      form.setValues({
        entry_number: entry.entry_number,
        date: new Date(entry.date),
        description: entry.description || '',
        items: entry.items?.map((item: JournalItem) => ({
          account_id: item.account_id.toString(),
          debit: item.debit.toString(),
          credit: item.credit.toString(),
        })) || [
          { account_id: '', debit: '', credit: '' },
          { account_id: '', debit: '', credit: '' },
        ],
      })
      setModalOpened(true)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load journal entry',
        color: 'red',
      })
    }
  }

  const handleOpenView = async (id: number) => {
    try {
      const response = await getJournalEntry(id)
      setSelectedEntry(response.data)
      setViewModalOpened(true)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load journal entry',
        color: 'red',
      })
    }
  }

  const handleOpenReverse = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    reverseForm.reset()
    setReverseModalOpened(true)
  }

  const handleSubmit = async (values: typeof form.values) => {
    // Validate items
    const validItems = values.items.filter(item => item.account_id && (item.debit || item.credit))

    if (validItems.length < 2) {
      notifications.show({
        title: 'Validation Error',
        message: 'At least 2 valid journal items are required',
        color: 'red',
      })
      return
    }

    // Check if each item has either debit or credit (not both)
    for (const item of validItems) {
      const debit = parseFloat(item.debit) || 0
      const credit = parseFloat(item.credit) || 0

      if (debit > 0 && credit > 0) {
        notifications.show({
          title: 'Validation Error',
          message: 'Each item can have either debit or credit, not both',
          color: 'red',
        })
        return
      }

      if (debit === 0 && credit === 0) {
        notifications.show({
          title: 'Validation Error',
          message: 'Each item must have either debit or credit amount',
          color: 'red',
        })
        return
      }
    }

    // Calculate totals
    const totalDebit = validItems.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0)
    const totalCredit = validItems.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0)

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      notifications.show({
        title: 'Validation Error',
        message: `Journal entry must be balanced. Debit: ${totalDebit.toFixed(2)}, Credit: ${totalCredit.toFixed(2)}`,
        color: 'red',
      })
      return
    }

    try {
      const payload = {
        entry_number: values.entry_number,
        date: values.date.toISOString().split('T')[0],
        description: values.description || null,
        items: validItems.map(item => ({
          account_id: parseInt(item.account_id),
          debit: parseFloat(item.debit) || 0,
          credit: parseFloat(item.credit) || 0,
        })),
      }

      if (editId) {
        await updateJournalEntry(editId, payload)
        notifications.show({
          title: 'Success',
          message: 'Journal entry updated successfully',
          color: 'green',
        })
      } else {
        await createJournalEntry(payload)
        notifications.show({
          title: 'Success',
          message: 'Journal entry created successfully',
          color: 'green',
        })
      }

      setModalOpened(false)
      fetchEntries()
      fetchNextNumber()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save journal entry',
        color: 'red',
      })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Journal Entry',
      children: (
        <Text size="sm">Are you sure you want to delete this journal entry? This action cannot be undone.</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteJournalEntry(id)
          notifications.show({
            title: 'Success',
            message: 'Journal entry deleted successfully',
            color: 'green',
          })
          fetchEntries()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete journal entry',
            color: 'red',
          })
        }
      },
    })
  }

  const handleReverse = async () => {
    if (!selectedEntry) return

    try {
      await reverseJournalEntry(selectedEntry.id, {
        reason: reverseForm.values.reason || null,
      })
      notifications.show({
        title: 'Success',
        message: 'Journal entry reversed successfully',
        color: 'green',
      })
      setReverseModalOpened(false)
      fetchEntries()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to reverse journal entry',
        color: 'red',
      })
    }
  }

  const addJournalItem = () => {
    form.insertListItem('items', { account_id: '', debit: '', credit: '' })
  }

  const removeJournalItem = (index: number) => {
    if (form.values.items.length > 2) {
      form.removeListItem('items', index)
    } else {
      notifications.show({
        title: 'Validation Error',
        message: 'At least 2 journal items are required',
        color: 'red',
      })
    }
  }

  const calculateTotals = () => {
    const totalDebit = form.values.items.reduce((sum, item) => sum + (parseFloat(item.debit) || 0), 0)
    const totalCredit = form.values.items.reduce((sum, item) => sum + (parseFloat(item.credit) || 0), 0)
    return { totalDebit, totalCredit }
  }

  const totals = calculateTotals()

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <IconBook size={32} />
            <Stack gap={0}>
              <Text size="lg" fw={500}>Journal Entries</Text>
              <Text size="sm" c="dimmed">Manage manual journal entries and adjustments</Text>
            </Stack>
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            New Entry
          </Button>
        </Group>

        {/* Filters */}
        <Paper p="md" withBorder>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Search description..."
                leftSection={<IconSearch size={16} />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <TextInput
                placeholder="Entry number"
                value={filters.entry_number}
                onChange={(e) => setFilters({ ...filters, entry_number: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 2 }}>
              <DateInput
                placeholder="Start date"
                value={filters.start_date ? new Date(filters.start_date) : null}
                onChange={(value) => setFilters({ ...filters, start_date: value ? value.toISOString().split('T')[0] : '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 6, md: 2 }}>
              <DateInput
                placeholder="End date"
                value={filters.end_date ? new Date(filters.end_date) : null}
                onChange={(value) => setFilters({ ...filters, end_date: value ? value.toISOString().split('T')[0] : '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Select
                placeholder="Status"
                data={[
                  { value: '', label: 'All' },
                  { value: 'false', label: 'Active' },
                  { value: 'true', label: 'Reversed' },
                ]}
                value={filters.is_reversed}
                onChange={(value) => setFilters({ ...filters, is_reversed: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 1 }}>
              <Group>
                <Button variant="light" onClick={fetchEntries} loading={loading}>
                  <IconFilter size={16} />
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => setFilters({ entry_number: '', start_date: '', end_date: '', is_reversed: '', search: '' })}
                >
                  <IconX size={16} />
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Balance Check Alert */}
        {Math.abs(totals.totalDebit - totals.totalCredit) > 0.01 && modalOpened && (
          <Alert color="red" icon={<IconScale size={16} />}>
            Journal entry is not balanced. Debit: {totals.totalDebit.toFixed(2)}, Credit: {totals.totalCredit.toFixed(2)}
          </Alert>
        )}

        {/* Table */}
        <Paper withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Entry #</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Description</Table.Th>
                  <Table.Th>Debit</Table.Th>
                  <Table.Th>Credit</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created By</Table.Th>
                  <Table.Th ta="right">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center">
                      <Text c="dimmed">Loading...</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : entries.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={8} ta="center">
                      <Text c="dimmed">No journal entries found</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  entries.map((entry) => (
                    <Table.Tr key={entry.id}>
                      <Table.Td>
                        <Text fw={500}>{entry.entry_number}</Text>
                      </Table.Td>
                      <Table.Td>{new Date(entry.date).toLocaleDateString()}</Table.Td>
                      <Table.Td>
                        <Text size="sm" lineClamp={1}>{entry.description || '-'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c="green">
                          <NumberFormatter value={entry.total_debit || 0} decimalScale={2} thousandSeparator prefix="BDT " />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text c="red">
                          <NumberFormatter value={entry.total_credit || 0} decimalScale={2} thousandSeparator prefix="BDT " />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {entry.is_reversed ? (
                          <Badge color="orange" variant="light">Reversed</Badge>
                        ) : (
                          <Badge color="green" variant="light">Active</Badge>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{entry.creator?.name || '-'}</Text>
                      </Table.Td>
                      <Table.Td ta="right">
                        <Group gap="xs" justify="flex-end">
                          <ActionIcon
                            size="sm"
                            variant="subtle"
                            color="blue"
                            onClick={() => handleOpenView(entry.id)}
                          >
                            <IconEye size={16} />
                          </ActionIcon>
                          {!entry.is_reversed && (
                            <>
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="yellow"
                                onClick={() => handleOpenEdit(entry.id)}
                              >
                                <IconPencil size={16} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="orange"
                                onClick={() => handleOpenReverse(entry)}
                              >
                                <IconRefresh size={16} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                variant="subtle"
                                color="red"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <IconTrash size={16} />
                              </ActionIcon>
                            </>
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
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={500}>{editId ? 'Edit Journal Entry' : 'New Journal Entry'}</Text>}
        size="xl"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <Group>
              <TextInput
                label="Entry Number"
                required
                {...form.getInputProps('entry_number')}
                style={{ flex: 1 }}
              />
              <DateInput
                label="Date"
                required
                value={form.values.date}
                onChange={(value) => form.setFieldValue('date', value as Date)}
                style={{ flex: 1 }}
              />
            </Group>

            <TextInput
              label="Description"
              placeholder="Entry description..."
              {...form.getInputProps('description')}
            />

            <Text fw={500} size="sm">Journal Items</Text>

            {form.values.items.map((item, index) => (
              <Group key={index} gap="md">
                <Select
                  placeholder="Select account"
                  data={accounts.map(acc => ({
                    value: acc.id.toString(),
                    label: `${acc.account_code} - ${acc.account_name}`,
                  }))}
                  {...form.getInputProps(`items.${index}.account_id`)}
                  style={{ flex: 2 }}
                  searchable
                />
                <TextInput
                  placeholder="Debit"
                  type="number"
                  step="0.01"
                  {...form.getInputProps(`items.${index}.debit`)}
                  style={{ flex: 1 }}
                />
                <TextInput
                  placeholder="Credit"
                  type="number"
                  step="0.01"
                  {...form.getInputProps(`items.${index}.credit`)}
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  color="red"
                  variant="subtle"
                  onClick={() => removeJournalItem(index)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}

            <Button variant="light" onClick={addJournalItem} fullWidth>
              <IconPlus size={16} style={{ marginRight: 8 }} />
              Add Item
            </Button>

            {/* Totals */}
            <Group>
              <Paper flex={1} p="sm" withBorder bg="green.0">
                <Text size="sm" c="green">Total Debit</Text>
                <Text size="lg" fw={500}>
                  <NumberFormatter value={totals.totalDebit} decimalScale={2} thousandSeparator />
                </Text>
              </Paper>
              <Paper flex={1} p="sm" withBorder bg="red.0">
                <Text size="sm" c="red">Total Credit</Text>
                <Text size="lg" fw={500}>
                  <NumberFormatter value={totals.totalCredit} decimalScale={2} thousandSeparator />
                </Text>
              </Paper>
              <Paper flex={1} p="sm" withBorder bg={Math.abs(totals.totalDebit - totals.totalCredit) < 0.01 ? 'blue.0' : 'orange.0'}>
                <Text size="sm">Difference</Text>
                <Text size="lg" fw={500}>
                  <NumberFormatter value={Math.abs(totals.totalDebit - totals.totalCredit)} decimalScale={2} thousandSeparator />
                </Text>
              </Paper>
            </Group>

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>Cancel</Button>
              <Button type="submit">{editId ? 'Update' : 'Create'} Entry</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={<Text fw={500}>Journal Entry Details</Text>}
        size="lg"
      >
        {selectedEntry && (
          <Stack>
            <Group>
              <div>
                <Text size="xs" c="dimmed">Entry Number</Text>
                <Text fw={500}>{selectedEntry.entry_number}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Date</Text>
                <Text>{new Date(selectedEntry.date).toLocaleDateString()}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Status</Text>
                {selectedEntry.is_reversed ? (
                  <Badge color="orange" variant="light">Reversed</Badge>
                ) : (
                  <Badge color="green" variant="light">Active</Badge>
                )}
              </div>
            </Group>

            {selectedEntry.description && (
              <>
                <Text size="xs" c="dimmed">Description</Text>
                <Text>{selectedEntry.description}</Text>
              </>
            )}

            <Text fw={500} size="sm">Journal Items</Text>

            <Paper withBorder>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Account</Table.Th>
                    <Table.Th ta="right">Debit</Table.Th>
                    <Table.Th ta="right">Credit</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {selectedEntry.items?.map((item) => (
                    <Table.Tr key={item.id}>
                      <Table.Td>
                        {item.account?.account_code} - {item.account?.account_name}
                      </Table.Td>
                      <Table.Td ta="right">
                        {item.debit > 0 ? (
                          <Text c="green">
                            <NumberFormatter value={item.debit} decimalScale={2} thousandSeparator />
                          </Text>
                        ) : '-'}
                      </Table.Td>
                      <Table.Td ta="right">
                        {item.credit > 0 ? (
                          <Text c="red">
                            <NumberFormatter value={item.credit} decimalScale={2} thousandSeparator />
                          </Text>
                        ) : '-'}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                  <Table.Tr fw={500}>
                    <Table.Td>Total</Table.Td>
                    <Table.Td ta="right">
                      <Text c="green">
                        <NumberFormatter value={selectedEntry.total_debit || 0} decimalScale={2} thousandSeparator />
                      </Text>
                    </Table.Td>
                    <Table.Td ta="right">
                      <Text c="red">
                        <NumberFormatter value={selectedEntry.total_credit || 0} decimalScale={2} thousandSeparator />
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Paper>

            <Group justify="flex-end">
              <Button onClick={() => setViewModalOpened(false)}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>

      {/* Reverse Modal */}
      <Modal
        opened={reverseModalOpened}
        onClose={() => setReverseModalOpened(false)}
        title={<Text fw={500}>Reverse Journal Entry</Text>}
        size="md"
      >
        <Stack>
          {selectedEntry && (
            <>
              <Text size="sm">
                Are you sure you want to reverse journal entry <Text span fw={500}>{selectedEntry.entry_number}</Text>?
              </Text>
              <Text size="sm" c="dimmed">
                This will create a new entry with opposite debits and credits.
              </Text>

              <TextInput
                label="Reason (optional)"
                placeholder="Reason for reversal..."
                {...reverseForm.getInputProps('reason')}
              />

              <Group justify="flex-end">
                <Button variant="subtle" onClick={() => setReverseModalOpened(false)}>Cancel</Button>
                <Button
                  color="orange"
                  leftSection={<IconRefresh size={16} />}
                  onClick={handleReverse}
                >
                  Reverse Entry
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </Modal>
    </Box>
  )
}
