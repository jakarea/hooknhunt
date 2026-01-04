import { useState, useEffect } from 'react'
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
  SimpleGrid,
  Avatar,
  Anchor,
  LoadingOverlay,
} from '@mantine/core'
import {
  IconChevronRight,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconId,
  IconBuilding,
  IconCoin,
  IconShield,
  IconClock,
  IconUser,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

interface User {
  id: number
  name: string
  phone: string
  email?: string
  role_id: number
  is_active: boolean
  phone_verified_at?: string
  last_login_at?: string
  created_at: string
  updated_at: string
  role?: {
    id: number
    name: string
    slug: string
  }
  profile?: {
    department_id?: number
    designation?: string
    joining_date?: string
    base_salary?: number
    address?: string
    city?: string
    dob?: string
    gender?: string
    department_name?: string
  }
}

interface Permission {
  id: number
  name: string
  slug: string
  group_name: string
}

export default function ProfilePage() {
  const { user: authUser } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch current user's complete profile data
  useEffect(() => {
    if (!authUser?.id) return

    const fetchProfile = async () => {
      try {
        setLoading(true)

        // Fetch user details with permissions
        const response = await api.get(`/user-management/users/${authUser.id}`)

        const userData = response.data.data.user
        const rolePerms = response.data.data.role_permissions || []
        const granted = response.data.data.granted_permissions || []
        const blocked = response.data.data.blocked_permissions || []

        setUser(userData)

        // Combine role permissions with granted permissions, exclude blocked
        const allPermissions = [...rolePerms, ...granted]
        const blockedIds = blocked.map((p: Permission) => p.id)
        const finalPermissions = allPermissions.filter((p: Permission) => !blockedIds.includes(p.id))

        setPermissions(finalPermissions)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load profile data. Please try again.',
          color: 'red',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [authUser?.id])

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      {!loading && user && (
        <Stack >
          {/* Breadcrumbs */}
          <Group >
            <Anchor component={Link} to="/dashboard" c="dimmed">Dashboard</Anchor>
            <IconChevronRight size={14} />
            <Text c="red">My Profile</Text>
          </Group>

          {/* Header */}
          <Box>
            <Title order={1}>My Profile</Title>
            <Text c="dimmed">View and manage your account information</Text>
          </Box>

          {/* Profile Header Card */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
            <Group justify="space-between" align="flex-start">
              <Group gap="xl">
                <Avatar
                  src={null}
                  alt={user.name}
                  radius="xl"
                  size="xl"
                  color="red"
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Group  mb="xs">
                    <Title order={2}>{user.name}</Title>
                    <Badge
                      color={user.is_active ? 'green' : 'gray'}
                      variant="light"
                      size="lg"
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Group>
                  <Text size="lg" c="dimmed" mb="xs">{user.profile?.designation || 'N/A'}</Text>
                  <Group >
                    {user.email && (
                      <Group >
                        <IconMail size={16} />
                        <Text size="sm">{user.email}</Text>
                      </Group>
                    )}
                    <Group >
                      <IconPhone size={16} />
                      <Text size="sm">{user.phone}</Text>
                    </Group>
                  </Group>
                </Box>
              </Group>
              <Button
                component={Link}
                to={`/hrm/employees/${user.id}/edit`}
                leftSection={<IconEdit size={16} />}
                variant="light"
              >
                Edit Profile
              </Button>
            </Group>
          </Paper>

          {/* Information Sections Grid */}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {/* Personal Information */}
            <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
              <Title order={4} mb="md">Personal Information</Title>
              <Stack >
                <Group >
                  <IconUser size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Full Name</Text>
                    <Text fw={500}>{user.name}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">User ID</Text>
                    <Text fw={500}>#{user.id}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconPhone size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Phone</Text>
                    <Text fw={500}>{user.phone}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconMail size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Email</Text>
                    <Text fw={500}>{user.email || 'N/A'}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconCalendar size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Date of Birth</Text>
                    <Text fw={500}>{formatDate(user.profile?.dob || null)}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Gender</Text>
                    <Text fw={500}>
                      {user.profile?.gender
                        ? user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1)
                        : 'N/A'}
                    </Text>
                  </Box>
                </Group>
                <Group >
                  <IconMapPin size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Address</Text>
                    <Text fw={500}>
                      {user.profile?.address
                        ? `${user.profile.address}, ${user.profile.city || ''}`.trim()
                        : 'N/A'}
                    </Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>

            {/* Professional Information */}
            <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
              <Title order={4} mb="md">Professional Information</Title>
              <Stack >
                <Group >
                  <IconShield size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Role</Text>
                    <Badge variant="light" color="red">{user.role?.name || 'N/A'}</Badge>
                  </Box>
                </Group>
                <Group >
                  <IconBuilding size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Department</Text>
                    <Text fw={500}>{user.profile?.department_name || 'N/A'}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconId size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Designation</Text>
                    <Text fw={500}>{user.profile?.designation || 'N/A'}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconCalendar size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Joining Date</Text>
                    <Text fw={500}>{formatDate(user.profile?.joining_date || null)}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconCoin size={18} style={{ color: 'var(--mantine-color-red-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Base Salary</Text>
                    <Text fw={500}>
                      {user.profile?.base_salary
                        ? `${parseFloat(String(user.profile.base_salary)).toLocaleString()} BDT`
                        : 'N/A'}
                    </Text>
                  </Box>
                </Group>
                <Group >
                  <IconClock size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Account Created</Text>
                    <Text fw={500}>{formatDate(user.created_at)}</Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>
          </SimpleGrid>

          {/* Account Security & Permissions */}
          <SimpleGrid cols={{ base: 1, md: 2 }}>
            {/* Account Security */}
            <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
              <Title order={4} mb="md">Account Security</Title>
              <Stack >
                <Group >
                  <IconShield size={18} style={{ color: user.is_active ? 'green' : 'gray' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Account Status</Text>
                    <Badge color={user.is_active ? 'green' : 'gray'} variant="light">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </Box>
                </Group>
                <Group >
                  <IconPhone size={18} style={{ color: user.phone_verified_at ? 'green' : 'orange' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Phone Verification</Text>
                    <Badge color={user.phone_verified_at ? 'green' : 'orange'} variant="light">
                      {user.phone_verified_at ? 'Verified' : 'Not Verified'}
                    </Badge>
                  </Box>
                </Group>
                <Group >
                  <IconClock size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Last Login</Text>
                    <Text fw={500} size="sm">{formatDateTime(user.last_login_at ?? '')}</Text>
                  </Box>
                </Group>
                <Group >
                  <IconCalendar size={18} style={{ color: 'var(--mantine-color-blue-filled)' }} />
                  <Box style={{ flex: 1 }}>
                    <Text size="xs" c="dimmed">Last Updated</Text>
                    <Text fw={500} size="sm">{formatDateTime(user.updated_at)}</Text>
                  </Box>
                </Group>
              </Stack>
            </Paper>

            {/* Permissions */}
            <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg">
              <Title order={4} mb="md">Permissions & Access</Title>
              {permissions.length > 0 ? (
                <SimpleGrid cols={1}>
                  {permissions.map((permission) => (
                    <Paper key={permission.id} withBorder p="sm" radius="md">
                      <Group >
                        <IconShield size={16} style={{ color: 'var(--mantine-color-red-filled)' }} />
                        <Box>
                          <Text fw={500} size="sm">{permission.name}</Text>
                          <Text size="xs" c="dimmed">{permission.group_name}</Text>
                        </Box>
                      </Group>
                    </Paper>
                  ))}
                </SimpleGrid>
              ) : (
                <Text c="dimmed">No permissions assigned</Text>
              )}
            </Paper>
          </SimpleGrid>
        </Stack>
      )}
    </Box>
  )
}
