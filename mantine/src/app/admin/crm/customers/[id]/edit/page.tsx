import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Paper,
  TextInput,
  Select,
  NumberInput,
  SimpleGrid,
  Alert,
  Breadcrumbs,
  Anchor,
  LoadingOverlay,
} from '@mantine/core'
import {
  IconChevronRight,
  IconArrowLeft,
  IconDeviceFloppy,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'

// Mock customer data
const mockCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+880 1712-345678',
  type: 'retail',
  status: 'active',
  wallet_balance: 1500.00,
  loyalty_points: 450,
  tier: 'silver',
  notes: 'VIP customer - prefers evening delivery',
  addresses: [
    {
      id: 1,
      label: 'Home',
      full_name: 'John Doe',
      phone: '+880 1712-345678',
      address: 'House 12, Road 5',
      area: 'Dhanmondi',
      city: 'Dhaka',
      zip: '1209',
      is_default: true,
    },
    {
      id: 2,
      label: 'Office',
      full_name: 'John Doe',
      phone: '+880 1712-345678',
      address: 'Plot 45, Gulshan Avenue',
      area: 'Gulshan',
      city: 'Dhaka',
      zip: '1213',
      is_default: false,
    },
  ],
}

export default function EditCustomerPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: mockCustomer.name,
    email: mockCustomer.email,
    phone: mockCustomer.phone,
    type: mockCustomer.type,
    status: mockCustomer.status,
    notes: mockCustomer.notes,
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Customer name is required',
        color: 'red',
      })
      return
    }

    if (!formData.phone.trim()) {
      notifications.show({
        title: 'Validation Error',
        message: 'Phone number is required',
        color: 'red',
      })
      return
    }

    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      notifications.show({
        title: 'Customer Updated',
        message: `${formData.name} has been updated successfully`,
        color: 'green',
      })

      navigate(`/crm/customers/${id}`)
    } catch (error) {
      setLoading(false)
      notifications.show({
        title: 'Error',
        message: 'Failed to update customer. Please try again.',
        color: 'red',
      })
    }
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<IconChevronRight size={14} />}>
          <Anchor component={Link} to="/dashboard" c="dimmed">Dashboard</Anchor>
          <Anchor component={Link} to="/crm" c="dimmed">CRM</Anchor>
          <Anchor component={Link} to="/crm/customers" c="dimmed">Customers</Anchor>
          <Anchor component={Link} to={`/crm/customers/${id}`} c="dimmed">{mockCustomer.name}</Anchor>
          <Text c="red">Edit</Text>
        </Breadcrumbs>

        {/* Header */}
        <Box>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Title order={1} className="text-lg md:text-xl lg:text-2xl">Edit Customer</Title>
              <Text c="dimmed" className="text-sm md:text-base">Update customer information</Text>
            </Box>
            <Button
              variant="default"
              size="sm"
              component={Link}
              to={`/crm/customers/${id}`}
              leftSection={<IconArrowLeft size={16} />}
            >
              Back
            </Button>
          </Group>
        </Box>

        <Paper withBorder p={{ base: 'md', md: 'xl' }} radius="lg" pos="relative">
          <LoadingOverlay visible={loading} />

          <form onSubmit={handleSubmit}>
            <Stack >
              {/* Customer Info */}
              <Box>
                <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">
                  Customer Information
                </Title>
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
                  <TextInput
                    id="name"
                    label="Full Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.currentTarget.value)}
                    required
                    size="md"
                    withAsterisk
                  />

                  <TextInput
                    id="email"
                    type="email"
                    label="Email Address"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.currentTarget.value)}
                    size="md"
                  />

                  <TextInput
                    id="phone"
                    label="Phone Number"
                    placeholder="+880 1712-345678"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.currentTarget.value)}
                    required
                    size="md"
                    withAsterisk
                  />

                  <Select
                    id="type"
                    label="Customer Type"
                    placeholder="Select type"
                    data={[
                      { value: 'retail', label: 'Retail' },
                      { value: 'wholesale', label: 'Wholesale' },
                    ]}
                    value={formData.type}
                    onChange={(value) => handleChange('type', value || 'retail')}
                    size="md"
                  />

                  <Select
                    id="status"
                    label="Account Status"
                    placeholder="Select status"
                    data={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'suspended', label: 'Suspended' },
                    ]}
                    value={formData.status}
                    onChange={(value) => handleChange('status', value || 'active')}
                    size="md"
                  />

                  <Box />
                </SimpleGrid>
              </Box>

              {/* Notes */}
              <Box>
                <TextInput
                  id="notes"
                  label="Notes"
                  placeholder="Add customer notes..."
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.currentTarget.value)}
                  size="md"
                  description="Internal notes about this customer (VIP, preferences, etc.)"
                />
              </Box>

              {/* Account Settings */}
              <Box>
                <Title order={4} className="text-base md:text-lg lg:text-xl" mb="md">
                  Account Settings
                </Title>
                <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
                  <NumberInput
                    id="wallet_balance"
                    label="Wallet Balance"
                    placeholder="0.00"
                    value={mockCustomer.wallet_balance}
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="৳"
                    readOnly
                    size="md"
                    description="Add funds via Wallet page"
                  />

                  <NumberInput
                    id="loyalty_points"
                    label="Loyalty Points"
                    placeholder="0"
                    value={mockCustomer.loyalty_points}
                    readOnly
                    size="md"
                    description="Points are earned automatically"
                  />

                  <Select
                    id="tier"
                    label="Loyalty Tier"
                    placeholder="Select tier"
                    data={[
                      { value: 'bronze', label: 'Bronze' },
                      { value: 'silver', label: 'Silver' },
                      { value: 'gold', label: 'Gold' },
                      { value: 'platinum', label: 'Platinum' },
                    ]}
                    value={mockCustomer.tier}
                    readOnly
                    size="md"
                    description="Auto-updated based on points"
                  />
                </SimpleGrid>
              </Box>

              {/* Info Alert */}
              <Alert variant="light" color="blue" icon={<IconDeviceFloppy size={14} />}>
                <Text size="sm">
                  Changes will be saved immediately. All fields marked with * are required.
                </Text>
              </Alert>

              {/* Actions */}
              <Group justify="flex-end" >
                <Button
                  variant="default"
                  component={Link}
                  to={`/crm/customers/${id}`}
                  size="md"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  leftSection={<IconDeviceFloppy size={16} />}
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Box>
  )
}
