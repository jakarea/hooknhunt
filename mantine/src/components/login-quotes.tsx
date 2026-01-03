import { useState, useEffect } from 'react'
import { Box, Text, Stack, Paper, ThemeIcon } from '@mantine/core'
import { IconQuote } from '@tabler/icons-react'

export function LoginQuotes() {
  const [quote, setQuote] = useState('')

  useEffect(() => {
    // Load quotes from JSON file
    fetch('/quotes.json')
      .then((res) => res.json())
      .then((data) => {
        // Get a random quote from LOGIN_QUOTES array
        const quotes = data.LOGIN_QUOTES || []
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setQuote(randomQuote)
      })
      .catch((err) => {
        console.error('Failed to load quotes:', err)
        // Fallback quote
        setQuote('ডিসিপ্লিন না থাকলে ট্যালেন্ট কোনো কাজে আসে না।')
      })
  }, [])

  return (
    <Stack
      gap="xl"
      align="center"
      justify="center"
      style={{ height: '100%', padding: '60px 40px' }}
    >
      {/* Quote Icon */}
      <ThemeIcon
        size={100}
        radius="50%"
        variant="filled"
        color="white"
        style={{
          opacity: 0.15,
        }}
      >
        <IconQuote size={50} stroke={1.5} />
      </ThemeIcon>

      {/* Quote Paper */}
      <Paper
        withBorder
        shadow="xl"
        p="60px"
        radius="lg"
        maw={700}
        style={{
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
        }}
      >
        <Stack gap="40px" align="center">
          {/* Quote Text - Bigger */}
          <Text
            size="36px"
            fw={600}
            c="white"
            ta="center"
            py="md"
            style={{
              lineHeight: 2,
              letterSpacing: '0.02em',
              fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif",
            }}
          >
            {quote}
          </Text>

          {/* Divider */}
          <Box
            w={80}
            h={3}
            style={{
              background: 'linear-gradient(90deg, transparent, white, transparent)',
              opacity: 0.6,
              borderRadius: '2px',
            }}
          />
        </Stack>
      </Paper>

      {/* Motivational Message */}
      <Text
        size="lg"
        fw={500}
        c="white"
        ta="center"
        style={{
          opacity: 0.95,
          maxWidth: 500,
          lineHeight: 1.6,
        }}
      >
        প্রতিদিন একটু এগিয়ে যান—লক্ষ্যে পৌঁছাতে বাধ্য হবেন!
      </Text>
    </Stack>
  )
}
