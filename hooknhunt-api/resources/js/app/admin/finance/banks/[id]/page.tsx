import { Title, Text, Stack, Paper, Group, Badge } from '@mantine/core'

export default function BankDetailsPage() {
  return (
    <Stack p="xl">
      <Title order={1}>Bank Account Details</Title>
      <Text c="dimmed">View bank account details and transaction history</Text>

      <Paper withBorder p="xl" mt="md">
        <Stack gap="md">
          <Group>
            <Badge color="blue" size="lg">TO DO</Badge>
            <Text fw={500} size="lg">Bank Account Details Page</Text>
          </Group>

          <Stack gap="xs" mt="md">
            <Text fw={600}>Tasks to Complete: Tasks to Complete:</Text>
            <Text>1. Fetch bank details (GET /api/v2/finance/banks/&#123;id&#125;)</Text>
            <Text>2. Show account info card (name, type, balance, account number, branch)</Text>
            <Text>3. Display statistics cards: Current Balance, Total Deposits, Total Withdrawals, Net Flow</Text>
            <Text>4. Action buttons: Deposit, Withdraw, Edit, Delete</Text>
            <Text>5. Transaction history table (last 50 transactions)</Text>
            <Text>6. Filter transactions by type and date range</Text>
            <Text>7. Pagination for transactions</Text>
            <Text>8. Show journal entry link for each transaction</Text>
            <Text>9. Back button to banks list</Text>
            <Text>10. Permission checks for edit/delete actions</Text>
          </Stack>

          <Stack gap="xs" mt="md">
            <Text fw={600}>Table Columns: Statistics to Show:</Text>
            <Text>• Current Balance: bank.current_balance</Text>
            <Text>• Total Deposits: Sum of all deposit transactions</Text>
            <Text>• Total Withdrawals: Sum of all withdrawal transactions</Text>
            <Text>• Net Flow: Deposits - Withdrawals</Text>
          </Stack>

          <Stack gap="xs" mt="md">
            <Text fw={600} color="red">Not Started Yet Not Started Yet</Text>
            <Text c="dimmed" size="sm">This is a placeholder page. Implementation pending.</Text>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  )
}
