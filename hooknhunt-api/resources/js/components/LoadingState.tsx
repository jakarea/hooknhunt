import React from 'react'
import { Loader, Center, Text, Stack } from '@mantine/core'

export function LoadingState() {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="md">
        <Loader size="lg" color="red" />
        <Text size="sm" c="dimmed">Loading...</Text>
      </Stack>
    </Center>
  )
}
