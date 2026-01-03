import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  Grid,
  Breadcrumbs,
  Anchor,
  Alert,
  LoadingOverlay,
} from '@mantine/core'
import { IconChevronRight, IconDeviceFloppy, IconInfoCircle, IconSearch } from '@tabler/icons-react'
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

interface RoleData {
  id: number
  name: string
  slug: string
  description: string | null
  permissions: Permission[]
  users: any[]
}

interface ValidationErrors {
  roleName?: string
  description?: string
}

export default function EditRolePage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [usersCount, setUsersCount] = useState(0)
  const [roleSlug, setRoleSlug] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([])
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([])
  const [loadingPermissions, setLoadingPermissions] = useState(true)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch role data and permissions
  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        setInitialLoading(true)
        setError(null)

        // Fetch role details
        const roleResponse = await api.get(`/hrm/roles/${id}`)
        const roleData: RoleData = roleResponse.data.data

        setRoleName(roleData.name)
        setRoleDescription(roleData.description || '')
        setRoleSlug(roleData.slug)
        setUsersCount(roleData.users?.length || 0)

        // Fetch all available permissions
        const permsResponse = await api.get('/hrm/permissions')
        const allPerms: Permission[] = permsResponse.data.data || permsResponse.data || []

        // Extract permission IDs from role
        const permIds = roleData.permissions.map((p) => p.id)
        setSelectedPermissionIds(permIds)

        // Group permissions by group_name
        const grouped = allPerms.reduce((acc: Record<string, Permission[]>, perm: Permission) => {
          if (!acc[perm.group_name]) {
            acc[perm.group_name] = []
          }
          acc[perm.group_name].push(perm)
          return acc
        }, {})

        const groups = Object.entries(grouped).map(([groupName, perms]) => ({
          groupName,
          permissions: perms,
        }))

        setPermissionGroups(groups)
      } catch (err: any) {
        console.error('Failed to fetch role data:', err)
        setError(err.response?.data?.message || 'Failed to load role data')
        notifications.show({
          title: 'Error',
          message: 'Failed to load role data',
          color: 'red',
        })
      } finally {
        setInitialLoading(false)
        setLoadingPermissions(false)
      }
    }

    fetchRoleData()
  }, [id])

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

    setLoading(true)

    try {
      // Update role basic info
      await api.put(`/hrm/roles/${id}`, {
        name: roleName,
        description: roleDescription,
      })

      // Sync permissions to role
      await api.post(`/hrm/roles/${id}/sync-permissions`, {
        permissions: selectedPermissionIds,
      })

      notifications.show({
        title: 'Success',
        message: 'Role updated successfully',
        color: 'green',
      })

      navigate('/admin/hrm/roles')
    } catch (error: any) {
      console.error('Failed to update role:', error)

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to update role'

      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate('/admin/hrm/roles')
  }

  if (initialLoading) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <LoadingOverlay visible overlayProps={{ blur: 2 }} />
        <Text>Loading role data...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Alert variant="light" color="red" title="Error loading role">
          <Text size="sm">{error}</Text>
          <Button mt="md" onClick={() => navigate('/admin/hrm/roles')}>
            Back to Roles
          </Button>
        </Alert>
      </Box>
    )
  }

  // Prevent editing super_admin role
  if (roleSlug === 'super_admin') {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Alert variant="light" color="red" icon={<IconInfoCircle />} title="Access Denied">
          <Text size="sm">
            Super Admin role cannot be modified. This role has full system access by design.
          </Text>
          <Button mt="md" onClick={() => navigate('/admin/hrm/roles')}>
            Back to Roles
          </Button>
        </Alert>
      </Box>
    )
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<IconChevronRight size={14} />}>
          <Anchor href="/admin/dashboard" c="dimmed">{t('nav.dashboard')}</Anchor>
          <Anchor href="/admin/hrm/roles" c="dimmed">{t('settings.roles')}</Anchor>
          <Text>Edit Role: {roleName}</Text>
        </Breadcrumbs>

        {/* Header */}
        <Box>
          <Title order={1}>Edit Role: {roleName}</Title>
          <Text c="dimmed">Manage role permissions and settings</Text>
        </Box>

        {/* Warning Alert */}
        {usersCount > 0 && (
          <Alert variant="light" color="yellow" icon={<IconInfoCircle />}>
            <Text size="sm">
              This role is assigned to {usersCount} user(s). Modifying permissions will immediately affect these users.
            </Text>
          </Alert>
        )}

        <Stack gap="lg">
          {/* Role Information Section */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg" pos="relative">
            <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
            <Stack gap="lg">
              <Title order={3}>Role Information</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TextInput
                    label="Role Name"
                    placeholder="e.g. Sales Manager"
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
                    placeholder="Brief role description"
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

              <Group justify="flex-end" mt="md">
                <Button variant="default" onClick={handleCancel} size="md" disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  leftSection={<IconDeviceFloppy size={16} />}
                  disabled={!roleName.trim() || loading}
                  size="md"
                >
                  {loading ? 'Saving...' : 'Update Role'}
                </Button>
              </Group>
            </Stack>
          </Paper>

          {/* Permissions Section */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
            <Stack gap="lg">
              <Group justify="space-between">
                <div>
                  <Title order={{ base: 4, md: 3 }}>Role Permissions</Title>
                  <Text size="sm" c="dimmed">Select which permissions this role should have</Text>
                </div>
                <Group gap="xs">
                  <Button variant="light" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button variant="light" size="sm" onClick={handleDeselectAll}>
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
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                  {filteredGroups.map((group) => {
                    const hasAny = hasAnyPermissionInGroup(group)
                    const hasAll = hasAllPermissionsInGroup(group)

                    return (
                      <Paper
                        key={group.groupName}
                        withBorder
                        p="md"
                        radius="md"
                        bd={hasAny ? '2px solid var(--mantine-color-blue-4)' : undefined}
                        bg={hasAny ? 'light-dark(var(--mantine-color-blue-0), rgba(66, 153, 225, 0.1))' : undefined}
                      >
                        <Stack gap="sm">
                          {/* Group Header */}
                          <Group justify="space-between">
                            <Text fw={600} size="sm">{group.groupName}</Text>
                            <Button
                              variant="light"
                              size="xs"
                              onClick={() => handleGroupSelectAll(group)}
                            >
                              {hasAll ? 'Deselect All' : 'Select All'}
                            </Button>
                          </Group>

                          {/* Permission List */}
                          <Stack gap="xs">
                            {group.permissions.map((permission) => (
                              <Group key={permission.id} gap="sm">
                                <Checkbox
                                  checked={selectedPermissionIds.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  label={permission.name}
                                  size="sm"
                                  styles={{ label: { fontSize: '13px' } }}
                                />
                              </Group>
                            ))}
                          </Stack>
                        </Stack>
                      </Paper>
                    )
                  })}
                </SimpleGrid>
              )}

              <Text size="sm" c="dimmed" mt="md">
                {totalSelectedPermissions} of {totalPermissions} permissions selected
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}
