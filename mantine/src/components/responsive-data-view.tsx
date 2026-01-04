import type { ReactNode } from 'react'
import {
  Table,
  Paper,
  Box,
  Text,
  Group,
  Stack,
} from '@mantine/core'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (value: any, row: T) => ReactNode
  sortable?: boolean
}

interface ResponsiveDataViewProps<T> {
  data: T[]
  columns: Column<T>[]
  title?: string
  loading?: boolean
  onRowClick?: (row: T) => void
  actions?: (row: T) => ReactNode
  emptyMessage?: string
}

export function ResponsiveDataView<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  onRowClick,
  actions,
  emptyMessage = 'No data found',
}: ResponsiveDataViewProps<T>) {
  if (loading) {
    return (
      <Box p="md">
        <Text ta="center" c="dimmed">
          Loading...
        </Text>
      </Box>
    )
  }

  if (data.length === 0) {
    return (
      <Box p="md">
        <Text ta="center" c="dimmed">
          {emptyMessage}
        </Text>
      </Box>
    )
  }

  return (
    <Stack gap="md">
      {/* Mobile View: Cards */}
      <Box display={{ base: 'block', md: 'none' }}>
        <Stack gap="sm">
          {data.map((row, index) => (
            <Paper
              key={index}
              p="md"
              withBorder
              onClick={() => onRowClick?.(row)}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              <Stack gap="xs">
                {columns.map((column) => (
                  <Box key={String(column.key)}>
                    <Text size="xs" c="dimmed" fw={500}>
                      {column.label}
                    </Text>
                    <Text size="sm">
                      {column.render
                        ? column.render(row[column.key as keyof T], row)
                        : String(row[column.key as keyof T] ?? '-')}
                    </Text>
                  </Box>
                ))}
                {actions && (
                  <Group mt="xs">{actions(row)}</Group>
                )}
              </Stack>
            </Paper>
          ))}
        </Stack>
      </Box>

      {/* Desktop View: Table */}
      <Box display={{ base: 'none', md: 'block' }}>
        <Paper withBorder>
          <Table.ScrollContainer minWidth={500}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  {columns.map((column) => (
                    <Table.Th key={String(column.key)}>
                      {column.label}
                    </Table.Th>
                  ))}
                  {actions && <Table.Th>Actions</Table.Th>}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {data.map((row, index) => (
                  <Table.Tr
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {columns.map((column) => (
                      <Table.Td key={String(column.key)}>
                        {column.render
                          ? column.render(row[column.key as keyof T], row)
                          : String(row[column.key as keyof T] ?? '-')}
                      </Table.Td>
                    ))}
                    {actions && <Table.Td>{actions(row)}</Table.Td>}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </Box>
    </Stack>
  )
}
