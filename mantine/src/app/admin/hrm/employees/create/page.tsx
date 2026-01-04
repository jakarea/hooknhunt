import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Paper,
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  LoadingOverlay,
  SimpleGrid,
  Anchor,
  Avatar,
} from '@mantine/core'
import {
  IconChevronRight,
  IconArrowLeft,
  IconCheck,
  IconLock,
  IconUser,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import api from '@/lib/api'
import { usePermissions } from '@/hooks/usePermissions'

interface Role {
  id: number
  name: string
  slug: string
}

interface Department {
  id: number
  name: string
}

interface FormData {
  // Personal Info
  name: string
  email: string
  phone: string
  password: string
  gender: string
  dob: string
  address: string
  city: string

  // Professional Info
  role_id: string | null
  department_id: string | null
  designation: string
  joining_date: string
  base_salary: number | null
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  gender: '',
  dob: '',
  address: '',
  city: '',

  role_id: null,
  department_id: null,
  designation: '',
  joining_date: new Date().toISOString().split('T')[0],
  base_salary: null,
}

interface FieldErrors {
  [key: string]: string
}

export default function CreateEmployeePage() {
  const navigate = useNavigate()
  const { hasPermission } = usePermissions()

  // Permission check: Need employee.create permission
  if (!hasPermission('employee.create')) {
    return (
      <Box p={{ base: 'md', md: 'xl' }}>
        <Stack >
          <Paper withBorder p="xl" radius="lg">
            <Stack align="center" >
              <Avatar size={80} radius="xl" color="red">
                <IconLock size={40} />
              </Avatar>

              <Stack gap={0} ta="center">
                <Title order={3} c="red.6">
                  Access Denied
                </Title>
                <Text size="lg" c="dimmed">
                  You don't have permission to create employees.
                </Text>
                <Text size="sm" c="dimmed" mt="xs">
                  Please contact your administrator if you believe this is an error.
                </Text>
              </Stack>

              <Group  mt="md">
                <Button
                  variant="light"
                  color="gray"
                  leftSection={<IconArrowLeft size={16} />}
                  onClick={() => navigate('/hrm/employees')}
                >
                  Back to Employees
                </Button>
                <Button
                  variant="filled"
                  leftSection={<IconUser size={16} />}
                  onClick={() => navigate('/profile')}
                >
                  View My Profile
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    )
  }

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [roles, setRoles] = useState<Role[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  // Fetch roles and departments
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        setLoading(true)

        // Fetch roles
        const rolesResponse = await api.get('/hrm/roles')
        const rolesData = rolesResponse.data.data || rolesResponse.data || []
        setRoles(Array.isArray(rolesData) ? rolesData : [])

        // Fetch departments
        const deptResponse = await api.get('/hrm/departments')
        const deptData = deptResponse.data.data?.data || deptResponse.data.data || []
        setDepartments(Array.isArray(deptData) ? deptData : [])
      } catch (error) {
        console.error('Failed to load dropdown data:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load required data. Please refresh.',
          color: 'red',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchDropdownData()
  }, [])

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validate form
  const validateForm = (): string | null => {
    if (!formData.name.trim()) return 'Name is required'
    if (!formData.phone.trim()) return 'Phone number is required'
    if (!formData.email.trim()) return 'Email is required'
    if (!formData.password) return 'Password is required'
    if (formData.password.length < 6) return 'Password must be at least 6 characters'
    if (!formData.role_id) return 'Role is required'
    if (!formData.department_id) return 'Department is required'
    if (!formData.designation.trim()) return 'Designation is required'
    if (!formData.joining_date) return 'Joining date is required'
    if (!formData.base_salary || formData.base_salary <= 0) return 'Base salary is required'

    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setFieldErrors({})

    // Validate form
    const error = validateForm()
    if (error) {
      notifications.show({
        title: 'Validation Error',
        message: error,
        color: 'red',
      })
      return
    }

    try {
      setSubmitting(true)

      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone,
        password: formData.password,
        role_id: parseInt(formData.role_id as string),
        type: 'staff', // Required: staff or customer

        profile: {
          gender: formData.gender || null,
          dob: formData.dob || null,
          address: formData.address || null,
          city: formData.city || null,
          department_id: parseInt(formData.department_id as string),
          designation: formData.designation,
          joining_date: formData.joining_date,
          base_salary: formData.base_salary,
        },
      }

      await api.post('/user-management/users', payload)

      notifications.show({
        title: 'Success',
        message: 'Employee created successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      })

      // Navigate to employees list
      navigate('/hrm/employees')
    } catch (error: any) {
      console.error('Failed to create employee:', error)

      // Check for validation errors
      if (error.response?.data?.errors) {
        const errors: FieldErrors = {}
        const validationErrors = error.response.data.errors

        // Convert Laravel validation errors to simple object
        Object.keys(validationErrors).forEach((key) => {
          const messages = validationErrors[key]
          errors[key] = Array.isArray(messages) ? messages[0] : messages

          // Handle nested profile fields
          if (key.startsWith('profile.')) {
            const fieldName = key.replace('profile.', '')
            errors[fieldName] = errors[key]
          }
        })

        setFieldErrors(errors)

        notifications.show({
          title: 'Validation Error',
          message: 'Please fix the errors below and try again.',
          color: 'red',
        })
      } else {
        // Extract error message from response
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          'Failed to create employee. Please try again.'

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }} pos="relative">
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

      {!loading && (
        <Stack >
          {/* Breadcrumbs */}
          <Group >
            <Anchor component={Link} to="/dashboard" c="dimmed">
              Dashboard
            </Anchor>
            <IconChevronRight size={14} />
            <Anchor component={Link} to="/hrm/employees" c="dimmed">
              HRM
            </Anchor>
            <IconChevronRight size={14} />
            <Anchor component={Link} to="/hrm/employees" c="dimmed">
              Employees
            </Anchor>
            <IconChevronRight size={14} />
            <Text c="red">Add Employee</Text>
          </Group>

          {/* Header */}
          <Group justify="space-between">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">
                Add New Employee
              </Title>
              <Text c="dimmed">Create a new employee account and profile</Text>
            </Box>
            <Button
              component={Link}
              to="/hrm/employees"
              variant="light"
              leftSection={<IconArrowLeft size={16} />}
            >
              Back to Employees
            </Button>
          </Group>

          {/* Form */}
          <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg" component="form" onSubmit={handleSubmit}>
            <Stack >
              {/* Personal Information */}
              <Box>
                <Title order={4} mb="md">
                  Personal Information
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                  <TextInput
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    withAsterisk
                    error={fieldErrors.name}
                  />

                  <TextInput
                    label="Phone Number"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    withAsterisk
                    error={fieldErrors.phone}
                  />

                  <TextInput
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    withAsterisk
                    error={fieldErrors.email}
                  />

                  <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    withAsterisk
                    minLength={6}
                    error={fieldErrors.password}
                  />

                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    data={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' },
                    ]}
                    value={formData.gender}
                    onChange={(value) => handleInputChange('gender', value || '')}
                    clearable
                    error={fieldErrors.gender}
                  />

                  <TextInput
                    label="Date of Birth"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    error={fieldErrors.dob}
                  />

                  <TextInput
                    label="Address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={fieldErrors.address}
                  />

                  <TextInput
                    label="City"
                    placeholder="Dhaka"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={fieldErrors.city}
                  />
                </SimpleGrid>
              </Box>

              {/* Professional Information */}
              <Box>
                <Title order={4} mb="md">
                  Professional Information
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                  <Select
                    label="Role"
                    placeholder="Select role"
                    data={roles.map((role) => ({
                      value: role.id.toString(),
                      label: role.name,
                    }))}
                    value={formData.role_id}
                    onChange={(value) => handleInputChange('role_id', value)}
                    required
                    withAsterisk
                    searchable
                    error={fieldErrors.role_id}
                  />

                  <Select
                    label="Department"
                    placeholder="Select department"
                    data={departments.map((dept) => ({
                      value: dept.id.toString(),
                      label: dept.name,
                    }))}
                    value={formData.department_id}
                    onChange={(value) => handleInputChange('department_id', value)}
                    required
                    withAsterisk
                    searchable
                    error={fieldErrors.department_id}
                  />

                  <TextInput
                    label="Designation"
                    placeholder="Software Engineer"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    required
                    withAsterisk
                    error={fieldErrors.designation}
                  />

                  <TextInput
                    label="Joining Date"
                    type="date"
                    value={formData.joining_date}
                    onChange={(e) => handleInputChange('joining_date', e.target.value)}
                    required
                    withAsterisk
                    error={fieldErrors.joining_date}
                  />

                  <NumberInput
                    label="Base Salary (BDT)"
                    placeholder="15000"
                    value={formData.base_salary ?? ''}
                    onChange={(value) => handleInputChange('base_salary', value)}
                    required
                    withAsterisk
                    min={0}
                    prefix="৳"
                    decimalScale={2}
                    error={fieldErrors.base_salary}
                  />
                </SimpleGrid>
              </Box>

              {/* Submit Buttons */}
              <Group justify="flex-end" >
                <Button
                  type="button"
                  variant="default"
                  onClick={() => navigate('/hrm/employees')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={submitting} leftSection={<IconCheck size={16} />}>
                  Create Employee
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Box>
  )
}
