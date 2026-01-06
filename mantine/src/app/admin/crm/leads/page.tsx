import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Paper,
  Card,
  TextInput,
  Select,
  ActionIcon,
  Avatar,
  Menu,
  Progress,
  SimpleGrid,
} from '@mantine/core'
import {
  IconPlus,
  IconSearch,
  IconDots,
  IconPhone,
  IconMail,
  IconClock,
  IconUser,
  IconEye,
  IconPencil,
  IconTrash,
} from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'

// Mock leads data
const mockLeads = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    email: 'sarah@example.com',
    phone: '+880 1712-345678',
    company: 'Tech Solutions Ltd',
    position: 'Procurement Manager',
    source: 'website',
    status: 'new',
    stage: 'lead',
    value: 50000,
    probability: 20,
    assigned_to: 'John Doe',
    created_at: '2024-12-28',
    last_contact: '2024-12-29',
    notes: 'Interested in bulk order for office supplies',
  },
  {
    id: 2,
    name: 'Michael Rahman',
    email: 'michael@example.com',
    phone: '+880 1812-345678',
    company: 'Retail Hub',
    position: 'Owner',
    source: 'referral',
    status: 'contacted',
    stage: 'qualified',
    value: 120000,
    probability: 50,
    assigned_to: 'Jane Smith',
    created_at: '2024-12-25',
    last_contact: '2024-12-28',
    notes: 'Referred by existing customer',
  },
  {
    id: 3,
    name: 'Fatima Khan',
    email: 'fatima@example.com',
    phone: '+880 1912-345678',
    company: 'Fashion House',
    position: 'Buying Manager',
    source: 'trade_show',
    status: 'contacted',
    stage: 'proposal',
    value: 200000,
    probability: 70,
    assigned_to: 'John Doe',
    created_at: '2024-12-20',
    last_contact: '2024-12-27',
    notes: 'Requested custom catalog',
  },
  {
    id: 4,
    name: 'David Hossain',
    email: 'david@example.com',
    phone: '+880 1612-345678',
    company: 'Super Mart',
    position: 'Director',
    source: 'cold_call',
    status: 'new',
    stage: 'lead',
    value: 80000,
    probability: 15,
    assigned_to: 'Jane Smith',
    created_at: '2024-12-29',
    last_contact: null,
    notes: 'Initial contact made',
  },
  {
    id: 5,
    name: 'Riya Islam',
    email: 'riya@example.com',
    phone: '+880 1312-345678',
    company: 'Boutique Style',
    position: 'Owner',
    source: 'website',
    status: 'negotiation',
    stage: 'negotiation',
    value: 150000,
    probability: 85,
    assigned_to: 'John Doe',
    created_at: '2024-12-15',
    last_contact: '2024-12-29',
    notes: 'Price negotiation in progress',
  },
]

type Stage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

const stageConfig: Record<Stage, { label: string; color: string; order: number }> = {
  lead: { label: 'Lead', color: 'gray', order: 1 },
  qualified: { label: 'Qualified', color: 'blue', order: 2 },
  proposal: { label: 'Proposal', color: 'yellow', order: 3 },
  negotiation: { label: 'Negotiation', color: 'orange', order: 4 },
  closed_won: { label: 'Won', color: 'green', order: 5 },
  closed_lost: { label: 'Lost', color: 'red', order: 6 },
}

const sourceConfig = [
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'trade_show', label: 'Trade Show' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'other', label: 'Other' },
]

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<string | null>('all')
  const [sourceFilter, setSourceFilter] = useState<string | null>('all')

  // Filter leads
  const filteredLeads = useMemo(() => {
    let result = mockLeads

    // Stage filter
    if (stageFilter && stageFilter !== 'all') {
      result = result.filter((lead) => lead.stage === stageFilter)
    }

    // Source filter
    if (sourceFilter && sourceFilter !== 'all') {
      result = result.filter((lead) => lead.source === sourceFilter)
    }

    // Search filter
    if (!searchQuery.trim()) {
      return result
    }

    const query = searchQuery.toLowerCase()
    return result.filter((lead) =>
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.company.toLowerCase().includes(query)
    )
  }, [searchQuery, stageFilter, sourceFilter])

  // Group leads by stage for kanban
  const leadsByStage = useMemo(() => {
    const stages: Stage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
    return stages.map((stage) => ({
      stage,
      ...stageConfig[stage],
      leads: filteredLeads.filter((lead) => lead.stage === stage),
    }))
  }, [filteredLeads])

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Delete lead handler
  const openDeleteModal = (_id: number, name: string) => {
    modals.openConfirmModal({
      title: 'Delete Lead',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{name}</strong>? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          notifications.show({
            title: 'Lead Deleted',
            message: `${name} has been deleted successfully`,
            color: 'green',
          })
        } catch {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete lead. Please try again.',
            color: 'red',
          })
        }
      },
    })
  }

  // Lead card component
  const LeadCard = ({ lead }: { lead: typeof mockLeads[0] }) => (
    <Card
      shadow="sm"
      p="sm"
      radius="md"
      withBorder
      style={{
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--mantine-color-red-9)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ''
      }}
    >
      <Stack >
        {/* Header */}
        <Group justify="space-between" wrap="nowrap">
          <Group  style={{ flex: 1, minWidth: 0 }}>
            <Avatar
              size="sm"
              radius="xl"
              color="red"
            >
              {lead.name.charAt(0)}
            </Avatar>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="sm" truncate>{lead.name}</Text>
              <Text size="xs" c="dimmed" truncate>{lead.company}</Text>
            </Box>
          </Group>
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" size="sm">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Actions</Menu.Label>
              <Menu.Item
                leftSection={<IconEye size={14} />}
                component={Link}
                to={`/crm/leads/${lead.id}`}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPencil size={14} />}
                component={Link}
                to={`/crm/leads/${lead.id}/edit`}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                leftSection={<IconPhone size={14} />}
                color="blue"
              >
                Call Now
              </Menu.Item>
              <Menu.Item
                leftSection={<IconMail size={14} />}
                color="green"
              >
                Send Email
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={14} />}
                color="red"
                onClick={() => openDeleteModal(lead.id, lead.name)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Contact info */}
        <Stack gap={4}>
          {lead.email && (
            <Group gap={4} style={{ flexWrap: 'wrap' }}>
              <IconMail size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
              <Text size="xs" truncate style={{ flex: 1 }}>{lead.email}</Text>
            </Group>
          )}
          <Group gap={4} style={{ flexWrap: 'wrap' }}>
            <IconPhone size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
            <Text size="xs">{lead.phone}</Text>
          </Group>
        </Stack>

        {/* Value & Probability */}
        <Group justify="space-between">
          <Box>
            <Text size="xs" c="dimmed">Value</Text>
            <Text fw={600} size="sm">{formatCurrency(lead.value)}</Text>
          </Box>
          <Box style={{ textAlign: 'right' }}>
            <Text size="xs" c="dimmed">Probability</Text>
            <Text fw={600} size="sm" c={lead.probability >= 70 ? 'green' : lead.probability >= 40 ? 'yellow' : 'red'}>
              {lead.probability}%
            </Text>
          </Box>
        </Group>

        {/* Probability bar */}
        <Progress
          value={lead.probability}
          color={lead.probability >= 70 ? 'green' : lead.probability >= 40 ? 'yellow' : 'red'}
          size="xs"
        />

        {/* Assigned to */}
        {lead.assigned_to && (
          <Group >
            <IconUser size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
            <Text size="xs" c="dimmed">Assigned to {lead.assigned_to}</Text>
          </Group>
        )}

        {/* Last contact */}
        <Group >
          <IconClock size={14} style={{ color: 'var(--mantine-color-gray-5)' }} />
          <Text size="xs" c="dimmed">
            Last contact: {formatDate(lead.last_contact)}
          </Text>
        </Group>
      </Stack>
    </Card>
  )

  // Calculate total value
  const totalValue = useMemo(() => {
    return filteredLeads.reduce((sum, lead) => sum + lead.value, 0)
  }, [filteredLeads])

  const weightedValue = useMemo(() => {
    return filteredLeads.reduce((sum, lead) => sum + (lead.value * lead.probability / 100), 0)
  }, [filteredLeads])

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Group justify="space-between" wrap="wrap">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">Leads Pipeline</Title>
              <Text c="dimmed" className="text-sm md:text-base">Manage and track your sales leads</Text>
            </Box>
            <Button
              component={Link}
              to="/crm/leads/create"
              leftSection={<IconPlus size={16} />}
            >
              Add Lead
            </Button>
          </Group>
        </Box>

        {/* Stats */}
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
          <Card withBorder p="md" radius="md">
            <Text size="xs" c="dimmed">Total Leads</Text>
            <Text size="xl" fw={700}>{filteredLeads.length}</Text>
          </Card>
          <Card withBorder p="md" radius="md">
            <Text size="xs" c="dimmed">Total Value</Text>
            <Text size="xl" fw={700}>{formatCurrency(totalValue)}</Text>
          </Card>
          <Card withBorder p="md" radius="md">
            <Text size="xs" c="dimmed">Weighted Value</Text>
            <Text size="xl" fw={700}>{formatCurrency(weightedValue)}</Text>
          </Card>
          <Card withBorder p="md" radius="md">
            <Text size="xs" c="dimmed">Conversion Rate</Text>
            <Text size="xl" fw={700}>
              {filteredLeads.length > 0
                ? Math.round((filteredLeads.filter(l => l.stage === 'closed_won').length / filteredLeads.length) * 100)
                : 0}%
            </Text>
          </Card>
        </SimpleGrid>

        {/* Filters */}
        <Group justify="space-between" wrap="wrap">
          <Group  style={{ flex: 1, maxWidth: '100%' }}>
            <TextInput
              placeholder="Search leads..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1, maxWidth: '400px' }}
              size="md"
            />
            <Select
              placeholder="Filter by stage"
              value={stageFilter}
              onChange={setStageFilter}
              data={[
                { value: 'all', label: 'All Stages' },
                { value: 'lead', label: 'Lead' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'proposal', label: 'Proposal' },
                { value: 'negotiation', label: 'Negotiation' },
                { value: 'closed_won', label: 'Won' },
                { value: 'closed_lost', label: 'Lost' },
              ]}
              size="md"
              style={{ minWidth: '150px' }}
              clearable
            />
            <Select
              placeholder="Filter by source"
              value={sourceFilter}
              onChange={setSourceFilter}
              data={[{ value: 'all', label: 'All Sources' }, ...sourceConfig]}
              size="md"
              style={{ minWidth: '150px' }}
              clearable
            />
          </Group>
        </Group>

        {/* Kanban Board - Desktop */}
        <Box display={{ base: 'none', lg: 'block' }}>
          <Group  style={{ alignItems: 'flex-start' }} wrap="nowrap">
            {leadsByStage.map((stageData) => (
              <Paper
                key={stageData.stage}
                withBorder
                p="sm"
                radius="lg"
                style={{
                  flex: 1,
                  minWidth: '280px',
                  maxWidth: '320px',
                  backgroundColor: stageData.stage === 'closed_won' ? 'var(--mantine-color-green-0)' :
                                   stageData.stage === 'closed_lost' ? 'var(--mantine-color-red-0)' :
                                   'var(--mantine-color-gray-0)',
                }}
              >
                <Stack >
                  {/* Stage header */}
                  <Group justify="space-between">
                    <Badge
                      color={stageData.color}
                      variant="light"
                      size="lg"
                      radius="sm"
                    >
                      {stageData.label} ({stageData.leads.length})
                    </Badge>
                  </Group>

                  {/* Stage value */}
                  {stageData.leads.length > 0 && (
                    <Text size="xs" c="dimmed">
                      {formatCurrency(stageData.leads.reduce((sum, lead) => sum + lead.value, 0))}
                    </Text>
                  )}

                  {/* Leads in this stage */}
                  {stageData.leads.length > 0 ? (
                    <Stack >
                      {stageData.leads.map((lead) => (
                        <LeadCard key={lead.id} lead={lead} />
                      ))}
                    </Stack>
                  ) : (
                    <Box p="xl" ta="center">
                      <Text size="sm" c="dimmed">No leads</Text>
                    </Box>
                  )}
                </Stack>
              </Paper>
            ))}
          </Group>
        </Box>

        {/* Mobile: List View */}
        <Stack  display={{ base: 'block', lg: 'none' }}>
          {filteredLeads.length === 0 ? (
            <Paper withBorder p="xl" ta="center">
              <Text c="dimmed">No leads found</Text>
            </Paper>
          ) : (
            filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
