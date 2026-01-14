import React from 'react'
import { Alert, Center, Stack, Text } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'

interface AccessDeniedProps {
  message: string
}

export function AccessDenied({ message }: AccessDeniedProps) {
  return (
    <Center mih="100vh">
      <Stack align="center" gap="md" maw={500}>
        <Alert variant="light" color="red" title="Access Denied" icon={<IconAlertCircle />}>
          <Text size="sm">{message}</Text>
        </Alert>
      </Stack>
    </Center>
  )
}
