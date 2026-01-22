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
  Progress,
  Grid,
  Alert,
  Card,
  Modal,
} from '@mantine/core'
import {
  IconChartPie,
  IconPlus,
  IconPencil,
  IconTrash,
  IconEye,
 IconCheck,
  IconAlertTriangle,
  IconTrendingUp,
  IconTrendingDown,
  IconSearch,
  IconFilter,
  IconX,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { modals } from '@mantine/modals'
import {
  getBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  approveBudget,
  getBudgetStatistics,
  getAccounts,
  type Budget,
  type ChartOfAccount,
} from '@/utils/api'
import { useForm } from '@mantine/form'
import { DateInput } from '@mantine/dates'

export default function BudgetsPage() {
  const { t } = useTranslation()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
  const [statistics, setStatistics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  // Filters
  const [filters, setFilters] = useState({
    fiscal_year: '',
    period_type: '',
    status: '',
    scope_type: '',
    search: '',
  })

  // Form for create/edit
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      account_id: '',
      scope_type: 'company' as 'company' | 'department' | 'account',
      scope_id: '',
      period_type: 'monthly' as 'monthly' | 'quarterly' | 'yearly' | 'custom',
      fiscal_year: new Date().getFullYear().toString(),
      period_name: '',
      start_date: null as Date | null,
      end_date: null as Date | null,
      planned_amount: '',
      alert_threshold: '80',
      notes: '',
    },
    validate: {
      name: (val: string) => (val ? null : 'Budget name is required'),
      scope_type: (val: string) => (val ? null : 'Scope type is required'),
      period_type: (val: string) => (val ? null : 'Period type is required'),
      fiscal_year: (val: string) => (val ? null : 'Fiscal year is required'),
      start_date: (val: Date | null) => (val ? null : 'Start date is required'),
      end_date: (val: Date | null) => (val ? null : 'End date is required'),
      planned_amount: (val: string) => (val && parseFloat(val) > 0 ? null : 'Planned amount is required'),
    },
  })

  useEffect(() => {
    fetchBudgets()
    fetchAccounts()
    fetchStatistics()
  }, [])

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const response = await getBudgets({
        ...filters,
        fiscal_year: filters.fiscal_year || undefined,
        period_type: filters.period_type as any || undefined,
        status: filters.status as any || undefined,
        scope_type: filters.scope_type as any || undefined,
        search: filters.search || undefined,
      })
      setBudgets(response.data || [])
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to fetch budgets',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAccounts = async () => {
    try {
      const response = await getAccounts()
      setAccounts(response || [])
    } catch (error: any) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await getBudgetStatistics(filters.fiscal_year || undefined)
      setStatistics(response.data)
    } catch (error: any) {
      console.error('Failed to fetch statistics:', error)
    }
  }

  const handleOpenCreate = () => {
    setEditId(null)
    form.reset()
    form.setValues({
      name: '',
      description: '',
      account_id: '',
      scope_type: 'company',
      scope_id: '',
      period_type: 'monthly',
      fiscal_year: new Date().getFullYear().toString(),
      period_name: '',
      start_date: null,
      end_date: null,
      planned_amount: '',
      alert_threshold: '80',
      notes: '',
    })
    setModalOpened(true)
  }

  const handleOpenEdit = async (id: number) => {
    try {
      const response = await getBudget(id)
      const budget = response.data

      setEditId(id)
      form.setValues({
        name: budget.name,
        description: budget.description || '',
        account_id: budget.account_id?.toString() || '',
        scope_type: budget.scope_type,
        scope_id: budget.scope_id || '',
        period_type: budget.period_type,
        fiscal_year: budget.fiscal_year,
        period_name: budget.period_name || '',
        start_date: new Date(budget.start_date),
        end_date: new Date(budget.end_date),
        planned_amount: budget.planned_amount.toString(),
        alert_threshold: budget.alert_threshold.toString(),
        notes: budget.notes || '',
      })
      setModalOpened(true)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load budget',
        color: 'red',
      })
    }
  }

  const handleOpenView = async (id: number) => {
    try {
      const response = await getBudget(id)
      setSelectedBudget(response.data)
      setViewModalOpened(true)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load budget',
        color: 'red',
      })
    }
  }

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const payload = {
        name: values.name,
        description: values.description || null,
        account_id: values.account_id ? parseInt(values.account_id) : null,
        scope_type: values.scope_type,
        scope_id: values.scope_id || null,
        period_type: values.period_type,
        fiscal_year: values.fiscal_year,
        period_name: values.period_name || null,
        start_date: values.start_date?.toISOString().split('T')[0],
        end_date: values.end_date?.toISOString().split('T')[0],
        planned_amount: parseFloat(values.planned_amount),
        alert_threshold: parseFloat(values.alert_threshold),
        notes: values.notes || null,
      }

      if (editId) {
        await updateBudget(editId, payload)
        notifications.show({
          title: 'Success',
          message: 'Budget updated successfully',
          color: 'green',
        })
      } else {
        await createBudget(payload)
        notifications.show({
          title: 'Success',
          message: 'Budget created successfully',
          color: 'green',
        })
      }

      setModalOpened(false)
      fetchBudgets()
      fetchStatistics()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save budget',
        color: 'red',
      })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Budget',
      children: (
        <Text size="sm">Are you sure you want to delete this budget? This action cannot be undone.</Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteBudget(id)
          notifications.show({
            title: 'Success',
            message: 'Budget deleted successfully',
            color: 'green',
          })
          fetchBudgets()
          fetchStatistics()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete budget',
            color: 'red',
          })
        }
      },
    })
  }

  const handleApprove = (id: number) => {
    modals.openConfirmModal({
      title: 'Approve Budget',
      children: (
        <Text size="sm">Are you sure you want to approve this budget? This will activate it for tracking.</Text>
      ),
      labels: { confirm: 'Approve', cancel: 'Cancel' },
      confirmProps: { color: 'green' },
      onConfirm: async () => {
        try {
          await approveBudget(id)
          notifications.show({
            title: 'Success',
            message: 'Budget approved successfully',
            color: 'green',
          })
          fetchBudgets()
          fetchStatistics()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to approve budget',
            color: 'red',
          })
        }
      },
    })
  }

  const getStatusBadge = (budget: Budget) => {
    const colors: Record<string, string> = {
      draft: 'gray',
      active: budget.needs_alert ? 'orange' : 'green',
      completed: 'blue',
      exceeded: 'red',
    }
    return <Badge color={colors[budget.status] || 'gray'}>{budget.status_label}</Badge>
  }

  const getVarianceIcon = (budget: Budget) => {
    if (budget.variance_status === 'favorable') return <IconTrendingUp size={16} color="green" />
    if (budget.variance_status === 'unfavorable') return <IconTrendingDown size={16} color="red" />
    return null
  }

  return (
    <>
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group>
            <IconChartPie size={32} />
            <Stack gap={0}>
              <Text size="lg" fw={500}>Budget Management</Text>
              <Text size="sm" c="dimmed">Plan, track, and analyze budgets</Text>
            </Stack>
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={handleOpenCreate}>
            New Budget
          </Button>
        </Group>

        {/* Statistics Cards */}
        {statistics && (
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed">Total Budgets</Text>
                <Text size="xl" fw={500}>{statistics.total_budgets}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed">Active Budgets</Text>
                <Text size="xl" fw={500} c="green">{statistics.active_budgets}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed">Exceeded Budgets</Text>
                <Text size="xl" fw={500} c="red">{statistics.exceeded_budgets}</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Card padding="md" withBorder>
                <Text size="sm" c="dimmed">Total Planned</Text>
                <Text size="xl" fw={500}>
                  <NumberFormatter value={statistics.total_planned_amount} decimalScale={2} thousandSeparator prefix="BDT " />
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        )}

        {/* Filters */}
        <Paper p="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 3 }}>
              <TextInput
                placeholder="Search budgets..."
                leftSection={<IconSearch size={16} />}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <TextInput
                placeholder="Fiscal Year"
                value={filters.fiscal_year}
                onChange={(e) => setFilters({ ...filters, fiscal_year: e.target.value })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Select
                placeholder="Period Type"
                data={[
                  { value: '', label: 'All' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'yearly', label: 'Yearly' },
                  { value: 'custom', label: 'Custom' },
                ]}
                value={filters.period_type}
                onChange={(value) => setFilters({ ...filters, period_type: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Select
                placeholder="Status"
                data={[
                  { value: '', label: 'All' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'exceeded', label: 'Exceeded' },
                ]}
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 2 }}>
              <Select
                placeholder="Scope Type"
                data={[
                  { value: '', label: 'All' },
                  { value: 'company', label: 'Company' },
                  { value: 'department', label: 'Department' },
                  { value: 'account', label: 'Account' },
                ]}
                value={filters.scope_type}
                onChange={(value) => setFilters({ ...filters, scope_type: value || '' })}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 1 }}>
              <Group>
                <Button variant="light" onClick={fetchBudgets} loading={loading}>
                  <IconFilter size={16} />
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => setFilters({ fiscal_year: '', period_type: '', status: '', scope_type: '', search: '' })}
                >
                  <IconX size={16} />
                </Button>
              </Group>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Alert for budgets needing attention */}
        {budgets.filter(b => b.needs_alert).length > 0 && (
          <Alert icon={<IconAlertTriangle size={16} />} color="orange">
            {budgets.filter(b => b.needs_alert).length} budget(s) exceed alert threshold and require attention
          </Alert>
        )}

        {/* Table */}
        <Paper withBorder>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Budget Name</Table.Th>
                <Table.Th>Period</Table.Th>
                <Table.Th>Planned</Table.Th>
                <Table.Th>Actual</Table.Th>
                <Table.Th>Variance</Table.Th>
                <Table.Th>Usage</Table.Th>
                <Table.Th>Status</Table.Th>
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
              ) : budgets.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8} ta="center">
                    <Text c="dimmed">No budgets found</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                budgets.map((budget) => (
                  <Table.Tr key={budget.id}>
                    <Table.Td>
                      <Text fw={500} size="sm">{budget.name}</Text>
                      {budget.description && (
                        <Text size="xs" c="dimmed" lineClamp={1}>{budget.description}</Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{budget.period_type_label}</Text>
                      <Text size="xs" c="dimmed">{budget.fiscal_year}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        <NumberFormatter value={budget.planned_amount} decimalScale={2} thousandSeparator prefix="BDT " />
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        <NumberFormatter value={budget.actual_amount} decimalScale={2} thousandSeparator prefix="BDT " />
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        {getVarianceIcon(budget)}
                        <Text size="sm" c={budget.variance_color}>
                          <NumberFormatter value={Math.abs(budget.variance)} decimalScale={2} thousandSeparator prefix="BDT " />
                          ({budget.variance_percentage.toFixed(1)}%)
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Progress
                        value={Math.min(budget.usage_percentage || 0, 100)}
                        color={budget.is_exceeded ? 'red' : budget.usage_percentage! > 80 ? 'orange' : 'green'}
                        size="md"
                        style={{ width: 100 }}
                      />
                      <Text size="xs" c="dimmed">{budget.usage_percentage?.toFixed(1)}%</Text>
                    </Table.Td>
                    <Table.Td>{getStatusBadge(budget)}</Table.Td>
                    <Table.Td ta="right">
                      <Group gap="xs" justify="flex-end">
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="blue"
                          onClick={() => handleOpenView(budget.id)}
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                        {budget.status === 'draft' && (
                          <>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="yellow"
                              onClick={() => handleOpenEdit(budget.id)}
                            >
                              <IconPencil size={16} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="green"
                              onClick={() => handleApprove(budget.id)}
                            >
                              <IconCheck size={16} />
                            </ActionIcon>
                            <ActionIcon
                              size="sm"
                              variant="subtle"
                              color="red"
                              onClick={() => handleDelete(budget.id)}
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
        </Paper>
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text fw={500}>{editId ? 'Edit Budget' : 'New Budget'}</Text>}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Budget Name"
              placeholder="Enter budget name"
              required
              {...form.getInputProps('name')}
            />

            <TextInput
              label="Description"
              placeholder="Budget description (optional)"
              {...form.getInputProps('description')}
            />

            <Group>
              <Select
                label="Scope Type"
                required
                data={[
                  { value: 'company', label: 'Company' },
                  { value: 'department', label: 'Department' },
                  { value: 'account', label: 'Account' },
                ]}
                {...form.getInputProps('scope_type')}
              />
              <TextInput
                label="Scope ID"
                placeholder="Department/Account ID"
                {...form.getInputProps('scope_id')}
              />
            </Group>

            <Select
              label="Account (Optional)"
              placeholder="Link to chart of account"
              data={accounts.map(acc => ({
                value: acc.id.toString(),
                label: `${acc.account_code} - ${acc.account_name}`,
              }))}
              {...form.getInputProps('account_id')}
              searchable
            />

            <Group>
              <Select
                label="Period Type"
                required
                data={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'yearly', label: 'Yearly' },
                  { value: 'custom', label: 'Custom' },
                ]}
                {...form.getInputProps('period_type')}
              />
              <TextInput
                label="Fiscal Year"
                placeholder="2024-2025"
                required
                {...form.getInputProps('fiscal_year')}
              />
            </Group>

            <TextInput
              label="Period Name"
              placeholder="e.g., July 2024, Q1 2024"
              {...form.getInputProps('period_name')}
            />

            <Group>
              <DateInput
                label="Start Date"
                required
                value={form.values.start_date}
                onChange={(value) => form.setFieldValue('start_date', value)}
                style={{ flex: 1 }}
              />
              <DateInput
                label="End Date"
                required
                value={form.values.end_date}
                onChange={(value) => form.setFieldValue('end_date', value)}
                style={{ flex: 1 }}
              />
            </Group>

            <TextInput
              label="Planned Amount"
              placeholder="0.00"
              required
              type="number"
              step="0.01"
              {...form.getInputProps('planned_amount')}
            />

            <TextInput
              label="Alert Threshold (%)"
              placeholder="80"
              type="number"
              {...form.getInputProps('alert_threshold')}
            />

            <TextInput
              label="Notes"
              placeholder="Additional notes (optional)"
              {...form.getInputProps('notes')}
            />

            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setModalOpened(false)}>Cancel</Button>
              <Button type="submit">{editId ? 'Update' : 'Create'} Budget</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={() => setViewModalOpened(false)}
        title={<Text fw={500}>Budget Details</Text>}
        size="md"
      >
        {selectedBudget && (
          <Stack>
            <Group>
              <div>
                <Text size="xs" c="dimmed">Budget Name</Text>
                <Text fw={500}>{selectedBudget.name}</Text>
              </div>
              <div>
                <Text size="xs" c="dimmed">Status</Text>
                {getStatusBadge(selectedBudget)}
              </div>
            </Group>

            {selectedBudget.description && (
              <>
                <Text size="xs" c="dimmed">Description</Text>
                <Text>{selectedBudget.description}</Text>
              </>
            )}

            <Grid>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Period</Text>
                <Text>{selectedBudget.period_type_label}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Fiscal Year</Text>
                <Text>{selectedBudget.fiscal_year}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">Start Date</Text>
                <Text>{new Date(selectedBudget.start_date).toLocaleDateString()}</Text>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text size="xs" c="dimmed">End Date</Text>
                <Text>{new Date(selectedBudget.end_date).toLocaleDateString()}</Text>
              </Grid.Col>
            </Grid>

            <Paper withBorder p="md">
              <Grid>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Planned Amount</Text>
                  <Text size="lg" fw={500} c="blue">
                    <NumberFormatter value={selectedBudget.planned_amount} decimalScale={2} thousandSeparator prefix="BDT " />
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Actual Amount</Text>
                  <Text size="lg" fw={500} c="red">
                    <NumberFormatter value={selectedBudget.actual_amount} decimalScale={2} thousandSeparator prefix="BDT " />
                  </Text>
                </Grid.Col>
                <Grid.Col span={4}>
                  <Text size="xs" c="dimmed">Variance</Text>
                  <Text size="lg" fw={500} c={selectedBudget.variance_color}>
                    <Group gap={4}>
                      {getVarianceIcon(selectedBudget)}
                      <NumberFormatter value={Math.abs(selectedBudget.variance)} decimalScale={2} thousandSeparator prefix="BDT " />
                    </Group>
                  </Text>
                </Grid.Col>
              </Grid>
            </Paper>

            <Progress
              value={Math.min(selectedBudget.usage_percentage || 0, 100)}
              color={selectedBudget.is_exceeded ? 'red' : selectedBudget.usage_percentage! > 80 ? 'orange' : 'green'}
              size="xl"
              label={`${selectedBudget.usage_percentage?.toFixed(1)}%`}
            />

            <Group justify="flex-end">
              <Button onClick={() => setViewModalOpened(false)}>Close</Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  )
}
