import { useState, useEffect } from 'react'
import { SimpleGrid, Paper, Text, Title, Box, Stack, Group } from '@mantine/core'
import { QUOTES } from '@/config/quotes'

export default function AdminDashboardPage() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    // Get a quote based on the day of the month (1-31)
    const quotes = QUOTES.DASHBOARD_QUOTES
    const dayOfMonth = new Date().getDate()

    // Use day of month as index (subtract 1 for 0-based array)
    const quoteIndex = Math.min(dayOfMonth - 1, quotes.length - 1)
    setQuote(quotes[quoteIndex])
  }, [])

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack >
        <Box>
          <Group justify="space-between" align="flex-start">
            <Box>
              <Title order={1}>Main Dashboard</Title>
              <Text c="dimmed">Sales & Stock Widgets</Text>
            </Box>
            {quote && (
              <Text
                size="lg"
                c="red"
                fw={500}
                style={{
                  lineHeight: 1.6,
                  fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
                  maxWidth: '500px',
                  textAlign: 'right',
                }}
              >
                {quote}
              </Text>
            )}
          </Group>
        </Box>

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
