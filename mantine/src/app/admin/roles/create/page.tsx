import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  TextInput,
  Checkbox,
  Paper,
  SimpleGrid,
  Breadcrumbs,
  Anchor,
  Grid,
  LoadingOverlay,
} from '@mantine/core'
import { IconChevronRight, IconDeviceFloppy, IconSearch } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'

interface Permission {
  id: number
  name: string
  slug: string
  group_name: string
}

interface PermissionGroup {
  groupName: string
  permissions: Permission[]
}

interface ValidationErrors {
  roleName?: string
  description?: string
}

export default function CreateRolePage() {
  const navigate = useNavigate()

  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [saving, setSaving] = useState(false)

  // Fetch permissions on mount
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get('/hrm/permissions')
        if (response.data.status) {
          const permissions = response.data.data

          // Group permissions by group_name
          const grouped = permissions.reduce((acc: Record<string, Permission[]>, perm: Permission) => {
            if (!acc[perm.group_name]) {
              acc[perm.group_name] = []
            }
            acc[perm.group_name].push(perm)
            return acc
          }, {} as Record<string, Permission[]>)

          const groups = Object.entries(grouped).map(([groupName, perms]) => ({
            groupName,
            permissions: perms as Permission[],
          }))

          setPermissionGroups(groups)
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load permissions. Please refresh the page.',
          color: 'red',
        })
      } finally {
        setLoadingPermissions(false)
      }
    }

    fetchPermissions()
  }, [])

  // Memoized filtered groups for performance
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return permissionGroups

    const query = searchQuery.toLowerCase()
    return permissionGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter(
          (perm) =>
            perm.name.toLowerCase().includes(query) ||
            perm.slug.toLowerCase().includes(query) ||
            group.groupName.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.permissions.length > 0)
  }, [searchQuery, permissionGroups])

  // Memoized total permissions count
  const totalSelectedPermissions = useMemo(() => selectedPermissionIds.length, [selectedPermissionIds])
  const totalPermissions = useMemo(() => permissionGroups.reduce((sum, group) => sum + group.permissions.length, 0), [permissionGroups])

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {}

    if (!roleName.trim()) {
      errors.roleName = 'Role name is required'
    } else if (roleName.trim().length < 3) {
      errors.roleName = 'Role name must be at least 3 characters'
    } else if (roleName.trim().length > 100) {
      errors.roleName = 'Role name must not exceed 100 characters'
    }

    if (roleDescription.length > 500) {
      errors.description = 'Description must not exceed 500 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [roleName, roleDescription])

  // Handle select all permissions
  const handleSelectAll = useCallback(() => {
    const allIds = permissionGroups.flatMap((group) =>
      group.permissions.map((perm) => perm.id)
    )
    setSelectedPermissionIds(allIds)
  }, [permissionGroups])

  // Handle deselect all permissions
  const handleDeselectAll = useCallback(() => {
    setSelectedPermissionIds([])
  }, [])

  // Handle group select all
  const handleGroupSelectAll = useCallback((group: PermissionGroup) => {
    const groupIds = group.permissions.map((perm) => perm.id)
    const allSelected = groupIds.every((id) => selectedPermissionIds.includes(id))

    if (allSelected) {
      // Deselect all in group
      setSelectedPermissionIds((prev) => prev.filter((id) => !groupIds.includes(id)))
    } else {
      // Select all in group
      setSelectedPermissionIds((prev) => [
        ...prev.filter((id) => !groupIds.includes(id)),
        ...groupIds,
      ])
    }
  }, [selectedPermissionIds])

  // Handle permission toggle
  const handlePermissionToggle = useCallback((permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }, [])

  // Check if group has any permissions selected
  const hasAnyPermissionInGroup = useCallback((group: PermissionGroup) => {
    return group.permissions.some((perm) => selectedPermissionIds.includes(perm.id))
  }, [selectedPermissionIds])

  // Check if group has all permissions selected
  const hasAllPermissionsInGroup = useCallback((group: PermissionGroup) => {
    return group.permissions.every((perm) => selectedPermissionIds.includes(perm.id))
  }, [selectedPermissionIds])

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const response = await api.post('/hrm/roles', {
        name: roleName.trim(),
        description: roleDescription.trim() || null,
        permissions: selectedPermissionIds,
      })

      if (response.data.status) {
        notifications.show({
          title: 'Success',
          message: 'Role created successfully',
          color: 'green',
        })
        navigate('/hrm/roles')
      } else {
        throw new Error(response.data.message || 'Failed to create role')
      }
    } catch (error: any) {
      console.error('Failed to create role:', error)
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || error.message || 'Failed to create role. Please try again.',
        color: 'red',
      })
    } finally {
      setSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate('/hrm/roles')
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<IconChevronRight size={14} />}>
          <Anchor href="/dashboard" c="dimmed">Dashboard</Anchor>
          <Anchor href="/hrm/roles" c="dimmed">Roles</Anchor>
          <Text c="red">Create Role</Text>
        </Breadcrumbs>

        {/* Header */}
        <Box>
          <Title order={1}>Create Role</Title>
          <Text c="dimmed">Create a new role with specific permissions</Text>
        </Box>

        <Stack >
          {/* Role Information Section */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg" pos="relative">
            <LoadingOverlay visible={loadingPermissions} overlayProps={{ blur: 2 }} />
            <Stack >
              <Title order={3}>Role Information</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Role Name"
                    placeholder="Enter role name"
                    value={roleName}
                    onChange={(e) => {
                      setRoleName(e.currentTarget.value)
                      setValidationErrors((prev) => ({ ...prev, roleName: undefined }))
                    }}
                    error={validationErrors.roleName}
                    required
                    size="md"
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Description"
                    placeholder="Enter role description"
                    value={roleDescription}
                    onChange={(e) => {
                      setRoleDescription(e.currentTarget.value)
                      setValidationErrors((prev) => ({ ...prev, description: undefined }))
                    }}
                    error={validationErrors.description}
                    size="md"
                  />
                </Grid.Col>
              </Grid>

              <Group justify="space-between" mt="md">
                <Text size="sm" c="dimmed">
                  {totalSelectedPermissions} of {totalPermissions} permissions selected
                </Text>
                <Group >
                  <Button variant="default" onClick={handleCancel} size="md" disabled={saving}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    leftSection={<IconDeviceFloppy size={16} />}
                    disabled={!roleName.trim() || saving || loadingPermissions}
                    loading={saving}
                    size="md"
                  >
                    Create Role
                  </Button>
                </Group>
              </Group>
            </Stack>
          </Paper>

          {/* Permissions Section */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
            <Stack >
              <Group justify="space-between">
                <div>
                  <Title order={3}>Permissions</Title>
                  <Text size="sm" c="dimmed">Select permissions for this role</Text>
                </div>
                <Group >
                  <Button variant="light" size="sm" onClick={handleSelectAll} disabled={loadingPermissions}>
                    Select All
                  </Button>
                  <Button variant="light" size="sm" onClick={handleDeselectAll} disabled={loadingPermissions}>
                    Deselect All
                  </Button>
                </Group>
              </Group>

              <TextInput
                placeholder="Search permissions..."
                leftSection={<IconSearch size={16} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                size="md"
                disabled={loadingPermissions}
              />

              {loadingPermissions ? (
                <Box py="xl" ta="center">
                  <Text c="dimmed">Loading permissions...</Text>
                </Box>
              ) : filteredGroups.length === 0 ? (
                <Box py="xl" ta="center">
                  <Text c="dimmed">No permissions found matching "{searchQuery}"</Text>
                </Box>
              ) : (
                <Stack >
                  {filteredGroups.map((group) => {
                    const hasAny = hasAnyPermissionInGroup(group)
                    const hasAll = hasAllPermissionsInGroup(group)

                    return (
                      <Paper
                        key={group.groupName}
                        withBorder
                        p="md"
                        radius="md"
                        bd={hasAny ? '1px solid var(--mantine-color-blue-4)' : undefined}
                        bg={hasAny ? 'light-dark(var(--mantine-color-blue-0), var(--mantine-color-dark-6))' : undefined}
                      >
                        <Stack >
                          {/* Group Header */}
                          <Group justify="space-between">
                            <Box>
                              <Text fw={600} size="sm">{group.groupName}</Text>
                              <Text size="xs" c="dimmed">
                                {group.permissions.filter(p => selectedPermissionIds.includes(p.id)).length} of {group.permissions.length} selected
                              </Text>
                            </Box>
                            <Button
                              variant="light"
                              size="xs"
                              onClick={() => handleGroupSelectAll(group)}
                            >
                              {hasAll ? 'Deselect All' : 'Select All'}
                            </Button>
                          </Group>

                          {/* Permissions List */}
                          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                            {group.permissions.map((permission) => (
                              <Checkbox
                                key={permission.id}
                                label={permission.name}
                                checked={selectedPermissionIds.includes(permission.id)}
                                onChange={() => handlePermissionToggle(permission.id)}
                                size="sm"
                              />
                            ))}
                          </SimpleGrid>
                        </Stack>
                      </Paper>
                    )
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}
