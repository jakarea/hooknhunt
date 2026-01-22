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
  Progress,
  Textarea,
  NativeSelect,
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { IconRefresh, IconEye, IconPencil, IconTrash, IconPlus, IconBuilding, IconChartLine, IconTrashOff, IconCoin } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { notifications } from '@mantine/notifications'
import { getFixedAssets, getFixedAsset, createFixedAsset, updateFixedAsset, deleteFixedAsset, disposeFixedAsset, getFixedAssetsSummary, getAssetCategories, type FixedAsset } from '@/utils/api'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'

type AssetFormData = {
  name: string
  category: string
  subcategory: string
  location: string
  serialNumber: string
  description: string
  purchasePrice: string | number
  purchaseDate: Date | null
  supplier: string
  invoiceNumber: string
  salvageValue: string | number
  usefulLife: string | number
  depreciationMethod: string
  depreciationRate: string | number
  warrantyExpiry: Date | null
  notes: string
}

const CATEGORIES = [
  'Furniture',
  'Equipment',
  'Vehicle',
  'Computer',
  'Machinery',
  'Building',
  'Land',
  'Software',
  'Other',
]

const DEPRECIATION_METHODS = [
  { value: 'straight_line', label: 'Straight Line' },
  { value: 'declining_balance', label: 'Declining Balance' },
  { value: 'units_of_production', label: 'Units of Production' },
  { value: 'none', label: 'No Depreciation' },
]

const STATUSES = [
  { value: 'disposed', label: 'Disposed' },
  { value: 'sold', label: 'Sold' },
  { value: 'scrapped', label: 'Scrapped' },
  { value: 'lost', label: 'Lost' },
]

export default function FixedAssetsPage() {
  const { t } = useTranslation()
  const [assets, setAssets] = useState<FixedAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpened, setModalOpened] = useState(false)
  const [disposeModalOpened, setDisposeModalOpened] = useState(false)
  const [viewModalOpened, setViewModalOpened] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [viewAsset, setViewAsset] = useState<FixedAsset | null>(null)
  const [disposeAssetId, setDisposeAssetId] = useState<number | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterLocation, setFilterLocation] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [summary, setSummary] = useState<any>(null)

  const form = useForm<AssetFormData>({
    initialValues: {
      name: '',
      category: 'Equipment',
      subcategory: '',
      location: '',
      serialNumber: '',
      description: '',
      purchasePrice: '',
      purchaseDate: null,
      supplier: '',
      invoiceNumber: '',
      salvageValue: 0,
      usefulLife: 5,
      depreciationMethod: 'straight_line',
      depreciationRate: 0,
      warrantyExpiry: null,
      notes: '',
    },
    validate: {
      name: (value) => (!value ? 'Asset name is required' : null),
      category: (value) => (!value ? 'Category is required' : null),
      purchasePrice: (value) => (value === '' ? 'Purchase price is required' : null),
      purchaseDate: (value) => (!value ? 'Purchase date is required' : null),
      usefulLife: (value) => (value === '' ? 'Useful life is required' : null),
    },
  })

  const disposeForm = useForm({
    initialValues: {
      status: 'disposed',
      disposalDate: null as Date | null,
      disposalValue: '',
      disposalReason: '',
      disposalReference: '',
    },
    validate: {
      status: (value) => (!value ? 'Status is required' : null),
      disposalDate: (value) => (!value ? 'Disposal date is required' : null),
    },
  })

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true)
      const filters: Record<string, any> = {}
      if (filterCategory) filters.category = filterCategory
      if (filterStatus) filters.status = filterStatus
      if (filterLocation) filters.location = filterLocation
      if (searchQuery) filters.search = searchQuery

      const response = await getFixedAssets(filters)
      let data: FixedAsset[] = []

      if (response && typeof response === 'object') {
        if ('data' in response && Array.isArray(response.data)) {
          data = response.data
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'data' in response.data) {
          data = response.data.data as any[]
        }
      }

      setAssets(data)
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load assets', color: 'red' })
    } finally {
      setLoading(false)
    }
  }, [filterCategory, filterStatus, filterLocation, searchQuery])

  const fetchSummary = async () => {
    try {
      const response = await getFixedAssetsSummary()
      if (response && typeof response === 'object' && 'data' in response) {
        setSummary(response.data)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  useEffect(() => {
    fetchAssets()
    fetchSummary()
  }, [fetchAssets])

  const handleSubmit = async (values: AssetFormData) => {
    try {
      const payload = {
        ...values,
        purchase_price: parseFloat(values.purchasePrice as string),
        purchase_date: values.purchaseDate ? new Date(values.purchaseDate).toISOString().split('T')[0] : undefined,
        salvage_value: parseFloat(values.salvageValue as string),
        useful_life: parseInt(values.usefulLife as string),
        depreciation_rate: values.depreciationMethod === 'declining_balance' ? parseFloat(values.depreciationRate as string) : 0,
        warranty_expiry: values.warrantyExpiry ? new Date(values.warrantyExpiry).toISOString().split('T')[0] : undefined,
      }

      if (editId) {
        await updateFixedAsset(editId, payload)
        notifications.show({ title: 'Success', message: 'Asset updated successfully', color: 'green' })
      } else {
        await createFixedAsset(payload)
        notifications.show({ title: 'Success', message: 'Asset created successfully', color: 'green' })
      }

      setModalOpened(false)
      form.reset()
      setEditId(null)
      fetchAssets()
      fetchSummary()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save asset',
        color: 'red',
      })
    }
  }

  const openCreateModal = () => {
    setEditId(null)
    form.reset()
    setModalOpened(true)
  }

  const openEditModal = async (asset: FixedAsset) => {
    setEditId(asset.id)
    form.setValues({
      name: asset.name,
      category: asset.category,
      subcategory: asset.subcategory || '',
      location: asset.location || '',
      serialNumber: asset.serialNumber || '',
      description: asset.description || '',
      purchasePrice: asset.purchasePrice,
      purchaseDate: new Date(asset.purchaseDate),
      supplier: asset.supplier || '',
      invoiceNumber: asset.invoiceNumber || '',
      salvageValue: asset.salvageValue,
      usefulLife: asset.usefulLife,
      depreciationMethod: asset.depreciationMethod,
      depreciationRate: asset.depreciationRate,
      warrantyExpiry: asset.warrantyExpiry ? new Date(asset.warrantyExpiry) : null,
      notes: asset.notes || '',
    })
    setModalOpened(true)
  }

  const openViewModal = async (assetId: number) => {
    try {
      const response = await getFixedAsset(assetId)
      if (response && typeof response === 'object' && 'data' in response) {
        setViewAsset(response.data)
        setViewModalOpened(true)
      }
    } catch (error) {
      notifications.show({ title: 'Error', message: 'Failed to load asset details', color: 'red' })
    }
  }

  const handleDelete = (id: number) => {
    modals.openConfirmModal({
      title: 'Delete Asset',
      children: <Text size="sm">Are you sure you want to delete this asset? This action cannot be undone.</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteFixedAsset(id)
          notifications.show({ title: 'Success', message: 'Asset deleted successfully', color: 'green' })
          fetchAssets()
          fetchSummary()
        } catch (error: any) {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || 'Failed to delete asset',
            color: 'red',
          })
        }
      },
    })
  }

  const openDisposeModal = (assetId: number) => {
    setDisposeAssetId(assetId)
    disposeForm.reset()
    setDisposeModalOpened(true)
  }

  const handleDispose = async (values: any) => {
    if (!disposeAssetId) return

    try {
      await disposeFixedAsset(disposeAssetId, {
        status: values.status,
        disposal_date: values.disposalDate ? new Date(values.disposalDate).toISOString().split('T')[0] : undefined,
        disposal_value: values.disposalValue ? parseFloat(values.disposalValue) : undefined,
        disposal_reason: values.disposalReason,
        disposal_reference: values.disposalReference,
      })

      notifications.show({ title: 'Success', message: 'Asset disposed successfully', color: 'green' })
      setDisposeModalOpened(false)
      setDisposeAssetId(null)
      disposeForm.reset()
      fetchAssets()
      fetchSummary()
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to dispose asset',
        color: 'red',
      })
    }
  }

  const getDepreciationMethodLabel = (method: string) => {
    return DEPRECIATION_METHODS.find((m) => m.value === method)?.label || method
  }

  const getStatusBadge = (asset: FixedAsset) => {
    if (asset.status === 'active' && asset.is_fully_depreciated) {
      return <Badge color="gray">Fully Depreciated</Badge>
    }
    if (asset.status === 'active') {
      return <Badge color="green">Active</Badge>
    }
    if (asset.status === 'sold') return <Badge color="blue">Sold</Badge>
    if (asset.status === 'disposed') return <Badge color="yellow">Disposed</Badge>
    if (asset.status === 'scrapped') return <Badge color="orange">Scrapped</Badge>
    if (asset.status === 'lost') return <Badge color="red">Lost</Badge>
    return <Badge>{asset.status}</Badge>
  }

  return (
    <Container size="xl">
      <Stack gap="md">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Group>
            <IconBuilding size={32} style={{ color: 'var(--mantine-color-blue-6)' }} />
            <div>
              <Title order={2}>Fixed Asset Register</Title>
              <Text c="dimmed" size="sm">Track company assets and depreciation</Text>
            </div>
          </Group>
          <Button leftSection={<IconPlus size={16} />} onClick={openCreateModal}>
            Add Asset
          </Button>
        </Flex>

        {/* Summary Cards */}
        {summary && (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Total Assets
              </Text>
              <Text size="xl" fw={700} mt={5}>
                {summary.total_assets}
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Active Assets
              </Text>
              <Text size="xl" fw={700} mt={5} c="green">
                {summary.active_assets}
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Total Value
              </Text>
              <Text size="xl" fw={700} mt={5} c="blue">
                {summary.total_purchase_value?.toFixed(2)}৳
              </Text>
            </Card>
            <Card padding="lg" radius="md" withBorder>
              <Text c="dimmed" size="sm" fw={500}>
                Net Book Value
              </Text>
              <Text size="xl" fw={700} mt={5} c="cyan">
                {summary.total_net_book_value?.toFixed(2)}৳
              </Text>
            </Card>
          </SimpleGrid>
        )}

        {/* Filters */}
        <Paper p="md" withBorder>
          <Group>
            <TextInput
              placeholder="Search by name, code, serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconChartLine size={16} />}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Filter by Category"
              clearable
              data={CATEGORIES.map((c) => ({ value: c, label: c }))}
              value={filterCategory}
              onChange={setFilterCategory}
              w={150}
            />
            <Select
              placeholder="Filter by Status"
              clearable
              data={[
                { value: 'active', label: 'Active' },
                { value: 'disposed', label: 'Disposed' },
                { value: 'sold', label: 'Sold' },
                { value: 'scrapped', label: 'Scrapped' },
                { value: 'lost', label: 'Lost' },
              ]}
              value={filterStatus}
              onChange={setFilterStatus}
              w={120}
            />
            <Button leftSection={<IconRefresh size={16} />} variant="light" onClick={fetchAssets}>
              Refresh
            </Button>
          </Group>
        </Paper>

        {/* Assets Table */}
        <Paper p="0" withBorder>
          <ScrollArea>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Asset Code</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Purchase Date</Table.Th>
                  <Table.Th>Purchase Price</Table.Th>
                  <Table.Th>Depreciation</Table.Th>
                  <Table.Th>Net Book Value</Table.Th>
                  <Table.Th>Progress</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th ta="center">Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {loading ? (
                  <Table.Tr>
                    <Table.Td colSpan={10} ta="center">
                      <Text c="dimmed">Loading...</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : assets.length === 0 ? (
                  <Table.Tr>
                    <Table.Td colSpan={10} ta="center">
                      <Text c="dimmed">No assets found</Text>
                    </Table.Td>
                  </Table.Tr>
                ) : (
                  assets.map((asset) => (
                    <Table.Tr key={asset.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {asset.assetCode}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{asset.name}</Text>
                        {asset.location && (
                          <Text size="xs" c="dimmed">
                            {asset.location}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{asset.category}</Text>
                        {asset.subcategory && (
                          <Text size="xs" c="dimmed">
                            {asset.subcategory}
                          </Text>
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{new Date(asset.purchaseDate).toLocaleDateString()}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text ta="right">{asset.purchasePrice.toFixed(2)}৳</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text ta="right" size="sm" c="red">
                          {asset.accumulatedDepreciation.toFixed(2)}৳
                        </Text>
                        <Text ta="right" size="xs" c="dimmed">
                          {getDepreciationMethodLabel(asset.depreciationMethod)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text ta="right" fw={500} c={asset.netBookValue > 0 ? 'green' : 'gray'}>
                          {asset.netBookValue.toFixed(2)}৳
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {asset.depreciationMethod !== 'none' && (
                          <Box w={80}>
                            <Progress
                              value={asset.depreciation_progress || 0}
                              size="sm"
                              color={asset.is_fully_depreciated ? 'gray' : 'blue'}
                            />
                            <Text size="xs" c="dimmed" mt={2}>
                              {Math.round(asset.depreciation_progress || 0)}%
                            </Text>
                          </Box>
                        )}
                      </Table.Td>
                      <Table.Td>{getStatusBadge(asset)}</Table.Td>
                      <Table.Td ta="center">
                        <Group gap="xs" justify="center">
                          <Tooltip label="View Details">
                            <ActionIcon
                              size="sm"
                              variant="light"
                              color="blue"
                              onClick={() => openViewModal(asset.id)}
                            >
                              <IconEye size={16} />
                            </ActionIcon>
                          </Tooltip>
                          {asset.status === 'active' && (
                            <>
                              <Tooltip label="Edit">
                                <ActionIcon
                                  size="sm"
                                  variant="light"
                                  color="orange"
                                  onClick={() => openEditModal(asset)}
                                >
                                  <IconPencil size={16} />
                                </ActionIcon>
                              </Tooltip>
                              <Tooltip label="Dispose">
                                <ActionIcon
                                  size="sm"
                                  variant="light"
                                  color="red"
                                  onClick={() => openDisposeModal(asset.id)}
                                >
                                  <IconTrashOff size={16} />
                                </ActionIcon>
                              </Tooltip>
                            </>
                          )}
                          <Tooltip label="Delete">
                            <ActionIcon size="sm" variant="light" color="red" onClick={() => handleDelete(asset.id)}>
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
        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title={editId ? 'Edit Asset' : 'New Asset'}
          size="lg"
        >
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Group grow>
                <TextInput label="Asset Name" placeholder="e.g., Office Desk" required {...form.getInputProps('name')} />
                <Select label="Category" data={CATEGORIES} required {...form.getInputProps('category')} />
              </Group>

              <Group grow>
                <TextInput label="Subcategory" placeholder="e.g., Executive Desk" {...form.getInputProps('subcategory')} />
                <TextInput label="Location" placeholder="e.g., Head Office" {...form.getInputProps('location')} />
              </Group>

              <Group grow>
                <TextInput label="Serial Number" placeholder="Asset serial number" {...form.getInputProps('serialNumber')} />
                <DatePicker label="Purchase Date" required {...form.getInputProps('purchaseDate')} />
              </Group>

              <Group grow>
                <NumberInput label="Purchase Price (৳)" required prefix="৳" decimalScale={2} {...form.getInputProps('purchasePrice')} />
                <NumberInput label="Salvage Value (৳)" prefix="৳" decimalScale={2} {...form.getInputProps('salvageValue')} />
              </Group>

              <Group grow>
                <NumberInput label="Useful Life (Years)" required min={1} max={100} {...form.getInputProps('usefulLife')} />
                <Select
                  label="Depreciation Method"
                  required
                  data={DEPRECIATION_METHODS}
                  {...form.getInputProps('depreciationMethod')}
                />
              </Group>

              {form.values.depreciationMethod === 'declining_balance' && (
                <NumberInput label="Depreciation Rate (%)" placeholder="e.g., 10" min={0} max={100} {...form.getInputProps('depreciationRate')} />
              )}

              <Group grow>
                <TextInput label="Supplier" placeholder="Vendor name" {...form.getInputProps('supplier')} />
                <TextInput label="Invoice Number" placeholder="Purchase invoice" {...form.getInputProps('invoiceNumber')} />
              </Group>

              <DatePicker label="Warranty Expiry" placeholder="Warranty end date" {...form.getInputProps('warrantyExpiry')} />

              <Textarea label="Description" placeholder="Asset details" {...form.getInputProps('description')} />
              <Textarea label="Notes" placeholder="Additional notes" {...form.getInputProps('notes')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Dispose Modal */}
        <Modal opened={disposeModalOpened} onClose={() => setDisposeModalOpened(false)} title="Dispose Asset" size="md">
          <form onSubmit={disposeForm.onSubmit(handleDispose)}>
            <Stack>
              <NativeSelect label="Disposition Type" data={STATUSES} {...disposeForm.getInputProps('status')} />
              <DatePicker label="Disposition Date" required {...disposeForm.getInputProps('disposalDate')} />
              <NumberInput label="Disposition Value (৳)" prefix="৳" decimalScale={2} {...disposeForm.getInputProps('disposalValue')} />
              <Textarea label="Reason" placeholder="Why is this asset being disposed?" {...disposeForm.getInputProps('disposalReason')} />
              <TextInput label="Reference" placeholder="Disposal document reference" {...disposeForm.getInputProps('disposalReference')} />

              <Group justify="flex-end">
                <Button variant="light" onClick={() => setDisposeModalOpened(false)}>
                  Cancel
                </Button>
                <Button type="submit" color="red">
                  Dispose Asset
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* View Details Modal */}
        <Modal opened={viewModalOpened} onClose={() => setViewModalOpened(false)} title="Asset Details" size="lg">
          {viewAsset && (
            <ScrollArea.Autosize mah={600}>
              <Stack>
                <Group grow>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Asset Code
                    </Text>
                    <Text size="lg" fw={500}>
                      {viewAsset.assetCode}
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Asset Name
                    </Text>
                    <Text size="lg" fw={500}>
                      {viewAsset.name}
                    </Text>
                  </Box>
                </Group>

                <Group grow>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Category
                    </Text>
                    <Text size="md">{viewAsset.category}</Text>
                  </Box>
                  <Box>
                    <Text size="sm" c="dimmed">
                      Subcategory
                    </Text>
                    <Text size="md">{viewAsset.subcategory || '-'}</Text>
                  </Box>
                </Group>

                <Box>
                  <Text size="sm" c="dimmed">
                    Description
                  </Text>
                  <Text size="sm">{viewAsset.description || '-'}</Text>
                </Box>

                <Paper withBorder p="sm" radius="md">
                  <Text fw={500} mb="xs">
                    Financial Details
                  </Text>
                  <SimpleGrid cols={2}>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Purchase Price
                      </Text>
                      <Text size="md" fw={500}>
                        {viewAsset.purchasePrice.toFixed(2)}৳
                      </Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Purchase Date
                      </Text>
                      <Text size="md">{new Date(viewAsset.purchaseDate).toLocaleDateString()}</Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Salvage Value
                      </Text>
                      <Text size="md">{viewAsset.salvageValue.toFixed(2)}৳</Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Useful Life
                      </Text>
                      <Text size="md">{viewAsset.usefulLife} years</Text>
                    </Box>
                  </SimpleGrid>
                </Paper>

                <Paper withBorder p="sm" radius="md">
                  <Text fw={500} mb="xs">
                    Depreciation Details
                  </Text>
                  <SimpleGrid cols={2}>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Method
                      </Text>
                      <Text size="md">{getDepreciationMethodLabel(viewAsset.depreciationMethod)}</Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Accumulated Depreciation
                      </Text>
                      <Text size="md" c="red" fw={500}>
                        {viewAsset.accumulatedDepreciation.toFixed(2)}৳
                      </Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Net Book Value
                      </Text>
                      <Text size="md" c="green" fw={500}>
                        {viewAsset.netBookValue.toFixed(2)}৳
                      </Text>
                    </Box>
                    <Box>
                      <Text size="sm" c="dimmed">
                        Remaining Life
                      </Text>
                      <Text size="md">{viewAsset.remaining_life} years</Text>
                    </Box>
                  </SimpleGrid>

                  <Progress
                    value={viewAsset.depreciation_progress || 0}
                    size="lg"
                    color={viewAsset.is_fully_depreciated ? 'gray' : 'blue'}
                    mt="md"
                  />
                  <Text size="sm" c="dimmed" mt={4}>
                    {Math.round(viewAsset.depreciation_progress || 0)}% depreciated
                  </Text>
                </Paper>

                {viewAsset.depreciation_schedule && viewAsset.depreciation_schedule.length > 0 && (
                  <Paper withBorder p="sm" radius="md">
                    <Text fw={500} mb="xs">
                      Depreciation Schedule
                    </Text>
                    <ScrollArea>
                      <Table striped fontSize="xs">
                        <Table.Thead>
                          <Table.Tr>
                            <Table.Th>Year</Table.Th>
                            <Table.Th>Depreciation</Table.Th>
                            <Table.Th>Accumulated</Table.Th>
                            <Table.Th>Book Value</Table.Th>
                          </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                          {viewAsset.depreciation_schedule.map((item) => (
                            <Table.Tr key={item.year}>
                              <Table.Td>{item.year}</Table.Td>
                              <Table.Td>{item.depreciation.toFixed(2)}৳</Table.Td>
                              <Table.Td>{item.accumulated.toFixed(2)}৳</Table.Td>
                              <Table.Td>{item.book_value.toFixed(2)}৳</Table.Td>
                            </Table.Tr>
                          ))}
                        </Table.Tbody>
                      </Table>
                    </ScrollArea>
                  </Paper>
                )}

                {viewAsset.supplier && (
                  <Box>
                    <Text size="sm" c="dimmed">
                      Supplier
                    </Text>
                    <Text size="sm">{viewAsset.supplier}</Text>
                  </Box>
                )}

                {viewAsset.notes && (
                  <Box>
                    <Text size="sm" c="dimmed">
                      Notes
                    </Text>
                    <Text size="sm">{viewAsset.notes}</Text>
                  </Box>
                )}
              </Stack>
            </ScrollArea.Autosize>
          )}
        </Modal>
      </Stack>
    </Container>
  )
}
