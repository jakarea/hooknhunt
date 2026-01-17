import { Title, Text, Stack, Paper, Group, Badge } from '@mantine/core'

export default function EditBankPage() {
  return (
    <Stack p="xl">
      <Title order={1}>Edit Bank Account</Title>
      <Text c="dimmed">Update bank account information</Text>

      <Paper withBorder p="xl" mt="md">
        <Stack gap="md">
          <Group>
            <Badge color="blue" size="lg">TO DO</Badge>
            <Text fw={500} size="lg">Edit Bank Account Form</Text>
          </Group>

          <Stack gap="xs" mt="md">
            <Text fw={600}>Tasks to Complete:</Text>
            <Text>1. Fetch existing bank data (GET /api/v2/finance/banks/&#123;id&#125;)</Text>
            <Text>2. Pre-fill form with current values</Text>
            <Text>3. Same fields as create form (name, type, account_number, etc.)</Text>
            <Text>4. PUT to /api/v2/finance/banks/&#123;id&#125; on submit</Text>
            <Text>5. Show success notification and redirect to details page</Text>
            <Text>6. Error handling with validation messages</Text>
            <Text>7. Cancel button to go back to details</Text>
            <Text>8. Permission check: finance.banks.edit</Text>
            <Text>9. Prevent editing if account has transactions (optional rule)</Text>
            <Text>10. Show "Last updated by" info</Text>
          </Stack>

          <Stack gap="xs" mt="md">
            <Text fw={600}>Validation Rules:</Text>
            <Text>• Account number must be unique (except current account)</Text>
            <Text>• Type is required and cannot be changed if transactions exist</Text>
            <Text>• Balance field should be disabled (edited via deposits/withdrawals)</Text>
          </Stack>

          <Stack gap="xs" mt="md">
            <Text fw={600} c="red">Not Started Yet</Text>
            <Text c="dimmed" size="sm">This is a placeholder page. Implementation pending.</Text>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}
