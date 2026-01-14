import { Paper, Text, Stack, ThemeIcon } from '@mantine/core'
import { IconQuote } from '@tabler/icons-react'
import { QUOTES } from '@/config/quotes'

export function DashboardQuote() {
  // Get a quote based on the day of the month (1-31)
  const quotes = QUOTES.DASHBOARD_QUOTES
  const dayOfMonth = new Date().getDate() // Returns 1-31

  // Use day of month as index (subtract 1 for 0-based array)
  const quoteIndex = Math.min(dayOfMonth - 1, quotes.length - 1)
  const quote = quotes[quoteIndex]

  console.log(`📅 Day ${dayOfMonth}: Showing quote ${quoteIndex + 1} of ${quotes.length}`)

  return (
    <Paper
      withBorder
      p="xl"
      radius="lg"
      style={{
        background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(153, 27, 27, 0.03) 100%)',
        borderColor: 'rgba(220, 38, 38, 0.2)',
      }}
    >
      <Stack gap="md" align="center">
        {/* Quote Icon */}
        <ThemeIcon
          size={40}
          radius="50%"
          variant="light"
          color="red"
          style={{ opacity: 0.8 }}
        >
          <IconQuote size={20} stroke={1.5} />
        </ThemeIcon>

        {/* Quote Text */}
        <Text
          size="xl"
          fw={600}
          ta="center"
          c="dimmed"
          style={{
            lineHeight: 1.8,
            fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
          }}
        >
          {quote}
        </Text>

        {/* Date indicator */}
        <Text
          size="xs"
          c="red"
          fw={500}
          style={{
            opacity: 0.7,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          আজকের প্রেরণা • {new Date().toLocaleDateString('bn-BD', { month: 'long', day: 'numeric' })}
        </Text>
      </Stack>
    </Paper>
  )
}
