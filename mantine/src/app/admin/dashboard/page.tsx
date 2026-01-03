import { SimpleGrid, Paper, Text, Title, Box, Stack } from '@mantine/core'
import { DashboardQuote } from '@/components/dashboard-quote'

export default function AdminDashboardPage() {
  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack gap="lg">
        <Box>
          <Title order={1}>Main Dashboard</Title>
          <Text c="dimmed">Sales & Stock Widgets</Text>
        </Box>

        {/* Welcome Quote */}
        <DashboardQuote />

        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Total Sales</Text>
            <Text size="xl" fw="bold">$12,345</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Low Stock Items</Text>
            <Text size="xl" fw="bold">23</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Orders Today</Text>
            <Text size="xl" fw="bold">156</Text>
          </Paper>
          <Paper withBorder p="md" radius="lg">
            <Text fw={600} component="h3">Revenue</Text>
            <Text size="xl" fw="bold">$8,901</Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Box>
  )
}
