import { useState, useEffect } from 'react'
import {
  Stack,
  Group,
  Text,
  Paper,
  Button,
  Card,
  Badge,
  ActionIcon,
  Modal,
  TextInput,
  SimpleGrid,
  ColorInput,
  Switch,
  Divider,
  LoadingOverlay,
} from '@mantine/core'
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconTag,
  IconRuler,
  IconScale,
  IconColorPicker,
  IconRefresh,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getAttributes, createAttribute, updateAttribute, deleteAttribute, type Attribute } from '@/utils/api'

export default function VariantsPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [modalOpened, setModalOpened] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    name: '',
    type: 'select' as 'select' | 'color',
  })
  const [options, setOptions] = useState<Array<{
    id?: number
    value: string
    label: string
    swatchValue?: string
    sortOrder: number
  }>>([])

  // Fetch attributes
  const fetchAttributes = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      else setRefreshing(true)

      const response = await getAttributes()
      const attrs = Array.isArray(response) ? response : (response?.data || [])

      // Filter only select and color types (for variants)
      const variantAttributes = attrs.filter((attr: Attribute) =>
        attr.type === 'select' || attr.type === 'color'
      )

      setAttributes(variantAttributes)
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to load variant types',
        color: 'red'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchAttributes()
  }, [])

  // Get icon for variant type
  const getTypeIcon = (attribute: Attribute) => {
    const name = attribute.displayName?.toLowerCase() || ''
    if (name.includes('color')) return <IconColorPicker size={20} />
    if (name.includes('size')) return <IconRuler size={20} />
    if (name.includes('weight')) return <IconScale size={20} />
    return <IconTag size={20} />
  }

  // Add new type
  const handleAdd = () => {
    setFormData({ displayName: '', name: '', type: 'select' })
    setOptions([])
    setEditingAttribute(null)
    setModalOpened(true)
  }

  // Edit type
  const handleEdit = (attribute: Attribute) => {
    setFormData({
      displayName: attribute.displayName || '',
      name: attribute.name || '',
      type: (attribute.type === 'color' ? 'color' : 'select')
    })

    // Transform options to form format
    const formOptions = attribute.options?.map(opt => ({
      id: opt.id,
      value: opt.value || '',
      label: opt.label || opt.value || '',
      swatchValue: opt.swatchValue || undefined,
      sortOrder: opt.sortOrder
    })) || []

    setOptions(formOptions)
    setEditingAttribute(attribute)
    setModalOpened(true)
  }

  // Delete type
  const handleDelete = async (attribute: Attribute) => {
    try {
      await deleteAttribute(attribute.id)
      await fetchAttributes(false)
      notifications.show({
        title: 'Deleted',
        message: `"${attribute.displayName}" has been deleted`,
        color: 'green'
      })
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete',
        color: 'red'
      })
    }
  }

  // Add value
  const handleAddValue = () => {
    const newValue = {
      value: '',
      label: '',
      swatchValue: formData.type === 'color' ? '#000000' : undefined,
      sortOrder: options.length + 1
    }
    setOptions([...options, newValue])
  }

  // Update value
  const handleUpdateValue = (index: number, field: string, val: any) => {
    const newOptions = [...options]
    newOptions[index] = { ...newOptions[index], [field]: val }
    setOptions(newOptions)
  }

  // Remove value
  const handleRemoveValue = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  // Save
  const handleSave = async () => {
    if (!formData.displayName || !formData.name) {
      notifications.show({
        title: 'Validation Error',
        message: 'Display Name and Code Name are required',
        color: 'red'
      })
      return
    }

    setSubmitting(true)
    try {
      // Transform to snake_case for backend
      const payload: any = {
        name: formData.name,
        display_name: formData.displayName,
        type: formData.type,
        is_required: true,
        is_visible: true,
        sort_order: 0,
        options: options.map(opt => ({
          value: opt.value,
          label: opt.label || opt.value,
          swatch_value: opt.swatchValue,
          sort_order: opt.sortOrder
        }))
      }

      if (editingAttribute) {
        await updateAttribute(editingAttribute.id, payload)
        notifications.show({
          title: 'Updated',
          message: `"${formData.displayName}" has been updated`,
          color: 'green'
        })
      } else {
        await createAttribute(payload)
        notifications.show({
          title: 'Created',
          message: `"${formData.displayName}" has been created`,
          color: 'green'
        })
      }

      setModalOpened(false)
      await fetchAttributes(false)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save',
        color: 'red'
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Auto-generate code name from display name
  const handleDisplayNameChange = (value: string) => {
    setFormData({
      ...formData,
      displayName: value,
      name: value.toLowerCase().replace(/\s+/g, '_')
    })
  }

  return (
    <Stack p="xl" gap="md">
      {/* Header */}
      <Group justify="space-between">
        <div>
          <Text className="text-2xl" fw={700}>Variant Types</Text>
          <Text c="dimmed">Manage variant types and their values</Text>
        </div>
        <Group>
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            loading={refreshing}
            onClick={() => fetchAttributes(false)}
          >
            Refresh
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={handleAdd}>
            Add Type
          </Button>
        </Group>
      </Group>

      {/* Variant Types List */}
      {loading ? (
        <Paper withBorder p="xl">
          <Text ta="center" c="dimmed">Loading...</Text>
        </Paper>
      ) : attributes.length === 0 ? (
        <Paper withBorder p="xl">
          <Text ta="center" c="dimmed">No variant types found. Click "Add Type" to create one.</Text>
        </Paper>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }}>
          {attributes.map((attribute) => (
            <Card key={attribute.id} withBorder shadow="sm">
              <Stack gap="sm">
                {/* Header */}
                <Group justify="space-between">
                  <Group gap="sm">
                    <div className="text-blue-600">{getTypeIcon(attribute)}</div>
                    <div>
                      <Text fw={600}>{attribute.displayName}</Text>
                      <Text size="xs" c="dimmed">Code: {attribute.name}</Text>
                    </div>
                  </Group>
                  <Group gap="xs">
                    <ActionIcon size="sm" variant="light" color="blue" onClick={() => handleEdit(attribute)}>
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon size="sm" variant="light" color="red" onClick={() => handleDelete(attribute)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Group>

                <Divider />

                {/* Values */}
                <Stack gap="xs">
                  <Group gap="xs">
                    <Text size="sm" fw={500}>Values</Text>
                    <Badge size="xs">{attribute.options?.length || 0}</Badge>
                  </Group>
                  {attribute.options?.map((option) => (
                    <Group key={option.id} gap="sm">
                      {attribute.type === 'color' && option.swatchValue && (
                        <Paper
                          w={24}
                          h={24}
                          style={{
                            backgroundColor: option.swatchValue,
                            border: '1px solid #e5e7eb',
                            flexShrink: 0
                          }}
                        />
                      )}
                      <Text size="sm">{option.label || option.value}</Text>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* Add/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingAttribute ? 'Edit Variant Type' : 'Add Variant Type'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Display Name*"
            placeholder="e.g., Color, Size, Weight"
            value={formData.displayName}
            onChange={(e) => handleDisplayNameChange(e.currentTarget.value)}
            description="User-friendly name shown in UI"
          />

          <TextInput
            label="Code Name*"
            placeholder="e.g., color, size, weight"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
            description="Internal code (auto-generated from display name)"
          />

          <Switch
            label="Color Type (with swatches)"
            checked={formData.type === 'color'}
            onChange={(e) => setFormData({ ...formData, type: e.currentTarget.checked ? 'color' : 'select' })}
          />

          <Divider label="Values" labelPosition="center" />

          <Group justify="space-between">
            <Text size="sm" fw={500}>Values ({options.length})</Text>
            <Button size="xs" variant="light" onClick={handleAddValue}>Add Value</Button>
          </Group>

          {options.length === 0 ? (
            <Paper withBorder p="xl" bg="gray.0">
              <Text c="dimmed" ta="center" size="sm">No values added</Text>
            </Paper>
          ) : (
            <Stack gap="xs">
              {options.map((option, index) => (
                <Paper key={index} withBorder p="xs" bg="gray.0">
                  <Group>
                    <Badge size="sm">{index + 1}</Badge>
                    <TextInput
                      placeholder="Value (e.g., red, s)"
                      size="xs"
                      value={option.value}
                      onChange={(e) => handleUpdateValue(index, 'value', e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />
                    <TextInput
                      placeholder="Label (e.g., Red, Small)"
                      size="xs"
                      value={option.label}
                      onChange={(e) => handleUpdateValue(index, 'label', e.currentTarget.value)}
                      style={{ flex: 1 }}
                    />
                    {formData.type === 'color' && (
                      <ColorInput
                        size="xs"
                        value={option.swatchValue}
                        onChange={(v) => handleUpdateValue(index, 'swatchValue', v)}
                      />
                    )}
                    <ActionIcon
                      size="sm"
                      color="red"
                      variant="light"
                      onClick={() => handleRemoveValue(index)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}

          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setModalOpened(false)}>Cancel</Button>
            <Button onClick={handleSave} loading={submitting}>
              {editingAttribute ? 'Update' : 'Create'} Type
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
