import { useState, useEffect, useMemo } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Paper,
  TextInput,
  Badge,
  LoadingOverlay,
  Card,
  SimpleGrid,
  Collapse,
  ActionIcon,
} from '@mantine/core'
import {
  IconSearch,
  IconChevronDown,
  IconChevronUp,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

interface Permission {
  id: number
  name: string
  slug: string
  group_name: string
}

interface GroupedPermissions {
  [group: string]: Permission[]
}

export default function PermissionsListPage() {
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openedGroups, setOpenedGroups] = useState<Set<string>>(new Set())

  // Fetch permissions
  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const response = await api.get('/hrm/permissions')
      setPermissions(response.data.data)
    } catch (error: any) {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to load permissions',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  // Group permissions by group_name
  const groupedPermissions = useMemo(() => {
    const groups: GroupedPermissions = {}
    permissions.forEach((permission) => {
      if (!groups[permission.group_name]) {
        groups[permission.group_name] = []
      }
      groups[permission.group_name].push(permission)
    })
    return groups
  }, [permissions])

  // Filter permissions based on search
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedPermissions
    }

    const query = searchQuery.toLowerCase()
    const filtered: GroupedPermissions = {}

    Object.entries(groupedPermissions).forEach(([group, perms]) => {
      const matchingPerms = perms.filter(
        (perm) =>
          perm.name.toLowerCase().includes(query) ||
          perm.slug.toLowerCase().includes(query)
      )

      if (matchingPerms.length > 0) {
        filtered[group] = matchingPerms
      }
    })

    return filtered
  }, [groupedPermissions, searchQuery])

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setOpenedGroups((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(group)) {
        newSet.delete(group)
      } else {
        newSet.add(group)
      }
      return newSet
    })
  }

  // Get permission color based on action
  const getPermissionColor = (slug: string) => {
    if (slug.includes('.index') || slug.includes('.view')) return 'blue'
    if (slug.includes('.create')) return 'green'
    if (slug.includes('.edit') || slug.includes('.update')) return 'orange'
    if (slug.includes('.delete') || slug.includes('.ban')) return 'red'
    return 'gray'
  }

  if (loading) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
        <Text className="text-sm md:text-base">Loading permissions...</Text>
      </Box>
    )
  }

  const groups = Object.entries(filteredGroups)

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Header */}
        <Box>
          <Title className="text-xl md:text-2xl lg:text-3xl font-semibold">Permissions</Title>
          <Text className="text-sm md:text-base text-gray-500">
            View all system permissions and their assignments
          </Text>
        </Box>

        {/* Search */}
        <TextInput
          placeholder="Search permissions..."
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          className="w-full md:w-auto md:min-w-[400px]"
          size="md"
        />

        {/* Stats */}
        <Group >
          <Paper p="md" radius="md" withBorder className="flex-1">
            <Stack gap={0}>
              <Text className="text-xs md:text-sm text-gray-500">Total Permissions</Text>
              <Text className="text-xl md:text-2xl font-semibold">
                {permissions.length}
              </Text>
            </Stack>
          </Paper>
          <Paper p="md" radius="md" withBorder className="flex-1">
            <Stack gap={0}>
              <Text className="text-xs md:text-sm text-gray-500">Permission Groups</Text>
              <Text className="text-xl md:text-2xl font-semibold">
                {Object.keys(groupedPermissions).length}
              </Text>
            </Stack>
          </Paper>
        </Group>

        {/* Content */}
        {groups.length === 0 ? (
          <Paper withBorder p="xl">
            <Text className="text-sm text-center text-gray-500">
              No permissions found matching "{searchQuery}"
            </Text>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
            {groups.map(([group, perms]) => (
              <PermissionGroupCard
                key={group}
                group={group}
                permissions={perms}
                isOpen={openedGroups.has(group)}
                onToggle={() => toggleGroup(group)}
                getPermissionColor={getPermissionColor}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Box>
  )
}

// Permission Group Card Component
interface PermissionGroupCardProps {
  group: string
  permissions: Permission[]
  isOpen: boolean
  onToggle: () => void
  getPermissionColor: (slug: string) => string
}

function PermissionGroupCard({
  group,
  permissions,
  isOpen,
  onToggle,
  getPermissionColor,
}: PermissionGroupCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack >
        {/* Group Header */}
        <Group justify="space-between">
          <Text className="text-base md:text-lg font-semibold">{group}</Text>
          <Group >
            <Badge variant="light" className="text-xs md:text-sm">
              {permissions.length} permissions
            </Badge>
            <ActionIcon
              variant="light"
              size="sm"
              onClick={onToggle}
            >
              {isOpen ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          </Group>
        </Group>

        {/* Permissions List */}
        <Collapse in={isOpen}>
          <Stack  mt="sm">
            {permissions.map((permission) => (
              <Paper
                key={permission.id}
                withBorder
                p="sm"
                radius="sm"
                className="transition-all hover:bg-gray-0"
              >
                <Group justify="space-between">
                  <Box style={{ flex: 1 }}>
                    <Text className="text-sm font-medium">{permission.name}</Text>
                    <Text className="text-xs text-gray-500">{permission.slug}</Text>
                  </Box>
                  <Badge
                    color={getPermissionColor(permission.slug)}
                    variant="light"
                    className="text-xs"
                  >
                    {permission.slug.split('.').pop()}
                  </Badge>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  )
}
