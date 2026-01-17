'use client'

import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  Card,
  Table,
  Button,
  Badge,
  Tabs,
  Alert,
  NumberFormatter,
} from '@mantine/core'
import {
  IconDownload,
  IconPrinter,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { DateInput } from '@mantine/dates'

interface Account {
  id: number
  code: string
  name: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  debit: number
  credit: number
}

type AccountType = 'all' | 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'

// Mock data for development
const mockAccounts: Account[] = [
  // Assets
  { id: 1, code: '1000', name: 'Cash', type: 'asset', debit: 150000, credit: 0 },
  { id: 2, code: '1010', name: 'Cash on Hand', type: 'asset', debit: 50000, credit: 0 },
  { id: 3, code: '1020', name: 'Bank Accounts', type: 'asset', debit: 1100000, credit: 0 },
  { id: 4, code: '1100', name: 'Accounts Receivable', type: 'asset', debit: 450000, credit: 0 },
  { id: 5, code: '1200', name: 'Inventory', type: 'asset', debit: 890000, credit: 0 },
  { id: 6, code: '1300', name: 'Prepaid Expenses', type: 'asset', debit: 75000, credit: 0 },
  { id: 7, code: '1500', name: 'Fixed Assets', type: 'asset', debit: 2500000, credit: 0 },
  { id: 8, code: '1510', name: 'Office Equipment', type: 'asset', debit: 350000, credit: 0 },
  { id: 9, code: '1520', name: 'Computer Equipment', type: 'asset', debit: 450000, credit: 0 },
  { id: 10, code: '1530', name: 'Furniture and Fixtures', type: 'asset', debit: 275000, credit: 0 },
  { id: 11, code: '1540', name: 'Vehicles', type: 'asset', debit: 850000, credit: 0 },
  { id: 12, code: '1600', name: 'Accumulated Depreciation', type: 'asset', debit: 0, credit: 450000 },

  // Liabilities
  { id: 13, code: '2000', name: 'Accounts Payable', type: 'liability', debit: 0, credit: 320000 },
  { id: 14, code: '2100', name: 'Accrued Expenses', type: 'liability', debit: 0, credit: 85000 },
  { id: 15, code: '2200', name: 'Taxes Payable', type: 'liability', debit: 0, credit: 125000 },
  { id: 16, code: '2300', name: 'Short-term Loans', type: 'liability', debit: 0, credit: 500000 },
  { id: 17, code: '2500', name: 'Long-term Liabilities', type: 'liability', debit: 0, credit: 1500000 },
  { id: 18, code: '2510', name: 'Bank Loans', type: 'liability', debit: 0, credit: 1200000 },
  { id: 19, code: '2520', name: 'Lease Obligations', type: 'liability', debit: 0, credit: 300000 },

  // Equity
  { id: 20, code: '3000', name: 'Owner\'s Equity', type: 'equity', debit: 0, credit: 3500000 },
  { id: 21, code: '3100', name: 'Share Capital', type: 'equity', debit: 0, credit: 2000000 },
  { id: 22, code: '3200', name: 'Retained Earnings', type: 'equity', debit: 0, credit: 1200000 },
  { id: 23, code: '3300', name: 'Current Year Earnings', type: 'equity', debit: 0, credit: 300000 },

  // Revenue
  { id: 24, code: '4000', name: 'Sales Revenue', type: 'revenue', debit: 0, credit: 8500000 },
  { id: 25, code: '4100', name: 'Product Sales', type: 'revenue', debit: 0, credit: 7200000 },
  { id: 26, code: '4200', name: 'Service Revenue', type: 'revenue', debit: 0, credit: 1300000 },
  { id: 27, code: '4300', name: 'Other Income', type: 'revenue', debit: 0, credit: 250000 },
  { id: 28, code: '4310', name: 'Interest Income', type: 'revenue', debit: 0, credit: 45000 },
  { id: 29, code: '4320', name: 'Discount Received', type: 'revenue', debit: 0, credit: 85000 },

  // Expenses
  { id: 30, code: '5000', name: 'Cost of Goods Sold', type: 'expense', debit: 5200000, credit: 0 },
  { id: 31, code: '5100', name: 'Operating Expenses', type: 'expense', debit: 1850000, credit: 0 },
  { id: 32, code: '5110', name: 'Rent Expense', type: 'expense', debit: 600000, credit: 0 },
  { id: 33, code: '5120', name: 'Utilities Expense', type: 'expense', debit: 150000, credit: 0 },
  { id: 34, code: '5130', name: 'Salaries and Wages', type: 'expense', debit: 800000, credit: 0 },
  { id: 35, code: '5140', name: 'Office Supplies', type: 'expense', debit: 85000, credit: 0 },
  { id: 36, code: '5150', name: 'Marketing Expenses', type: 'expense', debit: 150000, credit: 0 },
  { id: 37, code: '5200', name: 'Depreciation Expense', type: 'expense', debit: 275000, credit: 0 },
  { id: 38, code: '5300', name: 'Interest Expense', type: 'expense', debit: 95000, credit: 0 },
  { id: 39, code: '5400', name: 'Tax Expense', type: 'expense', debit: 450000, credit: 0 },
]

export default function TrialBalancePage() {
  const { t } = useTranslation()
  const [asOfDate, setAsOfDate] = useState<Date | null>(new Date())
  const [activeTab, setActiveTab] = useState<AccountType>('all')

  // Get account type configuration
  const getTypeConfig = (type: Account['type']) => {
    const configs = {
      asset: { color: 'green', label: 'Asset' },
      liability: { color: 'red', label: 'Liability' },
      equity: { color: 'blue', label: 'Equity' },
      revenue: { color: 'cyan', label: 'Revenue' },
      expense: { color: 'orange', label: 'Expense' },
    }
    return configs[type]
  }

  // Filter and sort accounts
  const filteredAccounts = useMemo(() => {
    let accounts = mockAccounts

    // Filter by type
    if (activeTab !== 'all') {
      accounts = accounts.filter((account) => account.type === activeTab)
    }

    // Sort by code
    return accounts.sort((a, b) => a.code.localeCompare(b.code))
  }, [activeTab])

  // Calculate totals
  const totals = useMemo(() => {
    const totalDebit = filteredAccounts.reduce((sum, account) => sum + account.debit, 0)
    const totalCredit = filteredAccounts.reduce((sum, account) => sum + account.credit, 0)
    const isBalanced = totalDebit === totalCredit

    return { totalDebit, totalCredit, isBalanced }
  }, [filteredAccounts])

  // Calculate account balance
  const getBalance = (account: Account) => {
    if (account.debit > account.credit) {
      return { amount: account.debit - account.credit, type: 'debit' as const }
    } else if (account.credit > account.debit) {
      return { amount: account.credit - account.debit, type: 'credit' as const }
    }
    return { amount: 0, type: 'balanced' as const }
  }

  // Handle export
  const handleExport = () => {
    notifications.show({
      title: t('finance.trialBalancePage.notification.exportSuccess'),
      message: t('finance.trialBalancePage.notification.exportSuccessMessage'),
      color: 'green',
    })
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <Box>
              <Title order={1}>{t('finance.trialBalancePage.title')}</Title>
              <Text c="dimmed">{t('finance.trialBalancePage.subtitle')}</Text>
            </Box>
            <Group>
              <Button leftSection={<IconDownload size={16} />} variant="light" onClick={handleExport}>
                {t('finance.trialBalancePage.exportExcel')}
              </Button>
              <Button leftSection={<IconPrinter size={16} />} variant="light" onClick={handlePrint}>
                {t('finance.trialBalancePage.print')}
              </Button>
            </Group>
          </Group>
        </Box>

        {/* Filters */}
        <Card withBorder p="md" radius="md">
          <Group justify="space-between">
            <DateInput
              label={t('finance.trialBalancePage.asOfDate')}
              placeholder={t('finance.trialBalancePage.asOfDatePlaceholder')}
              value={asOfDate}
              onChange={setAsOfDate}
              clearable
              style={{ width: 200 }}
            />
            <Text size="sm" c="dimmed">
              {t('finance.trialBalancePage.showingAccounts', { count: filteredAccounts.length })}
            </Text>
          </Group>
        </Card>

        {/* Tabs for account types */}
        <Tabs value={activeTab} onChange={(value) => setActiveTab(value as AccountType)}>
          <Tabs.List>
            <Tabs.Tab value="all">All ({mockAccounts.length})</Tabs.Tab>
            <Tabs.Tab value="asset">Assets</Tabs.Tab>
            <Tabs.Tab value="liability">Liabilities</Tabs.Tab>
            <Tabs.Tab value="equity">Equity</Tabs.Tab>
            <Tabs.Tab value="revenue">Revenue</Tabs.Tab>
            <Tabs.Tab value="expense">Expenses</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value={activeTab}>
            <Card withBorder p="0" radius="md" mt="md" shadow="sm">
              <Table.ScrollContainer minWidth={900}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('finance.trialBalancePage.tableHeaders.accountCode')}</Table.Th>
                      <Table.Th>{t('finance.trialBalancePage.tableHeaders.accountName')}</Table.Th>
                      <Table.Th>Type</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>{t('finance.trialBalancePage.tableHeaders.debit')}</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>{t('finance.trialBalancePage.tableHeaders.credit')}</Table.Th>
                      <Table.Th style={{ textAlign: 'right' }}>Balance</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {filteredAccounts.map((account) => {
                      const typeConfig = getTypeConfig(account.type)
                      const balance = getBalance(account)

                      return (
                        <Table.Tr key={account.id}>
                          <Table.Td>
                            <Text style={{ fontFamily: 'monospace' }} fw={600}>
                              {account.code}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" fw={500}>{account.name}</Text>
                          </Table.Td>
                          <Table.Td>
                            <Badge color={typeConfig.color} variant="light" size="sm">
                              {typeConfig.label}
                            </Badge>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" ta="right" fw={600} c="teal">
                              {account.debit > 0 ? (
                                <NumberFormatter value={account.debit} prefix="৳" thousandSeparator />
                              ) : (
                                '-'
                              )}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            <Text size="sm" ta="right" fw={600} c="orange">
                              {account.credit > 0 ? (
                                <NumberFormatter value={account.credit} prefix="৳" thousandSeparator />
                              ) : (
                                '-'
                              )}
                            </Text>
                          </Table.Td>
                          <Table.Td>
                            {balance.amount > 0 ? (
                              <Text
                                size="sm"
                                ta="right"
                                fw={700}
                                c={balance.type === 'debit' ? 'teal' : 'orange'}
                              >
                                <NumberFormatter value={balance.amount} prefix="৳" thousandSeparator />
                                <Text span size="xs" ml="xs" c="dimmed" fw={400}>
                                  {balance.type}
                                </Text>
                              </Text>
                            ) : (
                              <Text size="sm" ta="right" c="dimmed">
                                -
                              </Text>
                            )}
                          </Table.Td>
                        </Table.Tr>
                      )
                    })}

                    {/* Totals Row */}
                    <Table.Tr bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))">
                      <Table.Td colSpan={3}>
                        <Text size="sm" fw={700}>{t('finance.trialBalancePage.totalAccounts')}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ta="right" fw={700} c="teal">
                          <NumberFormatter value={totals.totalDebit} prefix="৳" thousandSeparator />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ta="right" fw={700} c="orange">
                          <NumberFormatter value={totals.totalCredit} prefix="৳" thousandSeparator />
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" ta="right" fw={700}>
                          -
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Table.ScrollContainer>
            </Card>
          </Tabs.Panel>
        </Tabs>

        {/* Balance Verification Alert */}
        {totals.isBalanced ? (
          <Alert
            variant="light"
            color="teal"
            title={`${t('finance.trialBalancePage.title')} ${t('finance.trialBalancePage.balanced')}`}
            icon={<IconCheck size={20} />}
          >
            <Group gap="xl">
              <Text size="sm">
                {t('finance.trialBalancePage.debitEqualsCredit')} {t('finance.trialBalancePage.asOf')} {formatDate(asOfDate)}
              </Text>
              <Text size="sm" fw={600}>
                ৳{totals.totalDebit.toLocaleString()}
              </Text>
            </Group>
          </Alert>
        ) : (
          <Alert
            variant="light"
            color="red"
            title={`${t('finance.trialBalancePage.title')} ${t('finance.trialBalancePage.notBalanced')}`}
            icon={<IconX size={20} />}
          >
            <Group gap="xl">
              <Text size="sm">
                There's a discrepancy of ৳{Math.abs(totals.totalDebit - totals.totalCredit).toLocaleString()}
              </Text>
              <Group gap="md">
                <Text size="sm">
                  {t('finance.trialBalancePage.tableHeaders.debit')}: <Text span fw={600} c="teal">৳{totals.totalDebit.toLocaleString()}</Text>
                </Text>
                <Text size="sm">
                  {t('finance.trialBalancePage.tableHeaders.credit')}: <Text span fw={600} c="orange">৳{totals.totalCredit.toLocaleString()}</Text>
                </Text>
              </Group>
            </Group>
          </Alert>
        )}

        {/* Print-only section - only visible when printing */}
        <div style={{ display: 'none' }} className="print-only">
          <Box p="xl" style={{ backgroundColor: 'white' }}>
            <Stack gap="lg">
              {/* Print Header */}
              <Box>
                <Title order={1} style={{ textAlign: 'center', marginBottom: '10px' }}>
                  {t('finance.trialBalancePage.title')}
                </Title>
                <Text style={{ textAlign: 'center', fontSize: '14px', color: '#666' }}>
                  {t('finance.trialBalancePage.asOf')} {formatDate(asOfDate)}
                </Text>
                <Text style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '5px' }}>
                  {t('finance.trialBalancePage.showingAccounts', { count: filteredAccounts.length })}
                </Text>
              </Box>

              {/* Print Table */}
              <Table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <Table.Thead>
                  <Table.Tr style={{ backgroundColor: '#f5f5f5' }}>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{t('finance.trialBalancePage.tableHeaders.accountCode')}</Table.Th>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{t('finance.trialBalancePage.tableHeaders.accountName')}</Table.Th>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>Type</Table.Th>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>{t('finance.trialBalancePage.tableHeaders.debit')}</Table.Th>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>{t('finance.trialBalancePage.tableHeaders.credit')}</Table.Th>
                    <Table.Th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', textAlign: 'right' }}>Balance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredAccounts.map((account) => {
                    const typeConfig = getTypeConfig(account.type)
                    const balance = getBalance(account)

                    return (
                      <Table.Tr key={account.id}>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          <Text style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {account.code}
                          </Text>
                        </Table.Td>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          <Text>{account.name}</Text>
                        </Table.Td>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px' }}>
                          <Text>{typeConfig.label}</Text>
                        </Table.Td>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                          {account.debit > 0 ? (
                            <Text>{account.debit.toLocaleString()}</Text>
                          ) : (
                            <Text style={{ color: '#999' }}>-</Text>
                          )}
                        </Table.Td>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                          {account.credit > 0 ? (
                            <Text>{account.credit.toLocaleString()}</Text>
                          ) : (
                            <Text style={{ color: '#999' }}>-</Text>
                          )}
                        </Table.Td>
                        <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right' }}>
                          {balance.amount > 0 ? (
                            <Text style={{ fontWeight: 700 }}>
                              {balance.amount.toLocaleString()} {balance.type}
                            </Text>
                          ) : (
                            <Text style={{ color: '#999' }}>-</Text>
                          )}
                        </Table.Td>
                      </Table.Tr>
                    )
                  })}

                  {/* Totals Row */}
                  <Table.Tr style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                    <Table.Td colSpan={3} style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                      {t('finance.trialBalancePage.totalAccounts')}
                    </Table.Td>
                    <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      {totals.totalDebit.toLocaleString()}
                    </Table.Td>
                    <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      {totals.totalCredit.toLocaleString()}
                    </Table.Td>
                    <Table.Td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>
                      -
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>

              {/* Balance Verification */}
              <Box p="md" style={{ border: '2px solid #333', backgroundColor: '#f9f9f9' }}>
                <Text style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  {t('finance.trialBalancePage.debitEqualsCredit')}: {totals.isBalanced ? t('finance.trialBalancePage.balanced') : t('finance.trialBalancePage.notBalanced')}
                </Text>
                <Text style={{ fontSize: '12px' }}>
                  {totals.isBalanced
                    ? `${t('finance.trialBalancePage.debitEqualsCredit')} ${t('finance.trialBalancePage.asOf')} ${formatDate(asOfDate)}`
                    : `Discrepancy: ${Math.abs(totals.totalDebit - totals.totalCredit).toLocaleString()}`
                  }
                </Text>
              </Box>

              {/* Footer */}
              <Text style={{ textAlign: 'center', fontSize: '10px', color: '#999', marginTop: '20px' }}>
                Generated by Hook & Hunt ERP System • {new Date().toLocaleString()}
              </Text>
            </Stack>
          </Box>
        </div>
      </Stack>

      {/* Print-specific styling */}
      <style jsx global>{`
        @media print {
          /* Hide everything except print-only section */
          body * {
            visibility: hidden;
          }

          .print-only,
          .print-only * {
            visibility: visible;
          }

          .print-only {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }

          /* Ensure colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          /* Page breaks */
          table {
            page-break-inside: auto;
          }

          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }

          thead {
            display: table-header-group;
          }
        }
      `}</style>
    </Box>
  )
}
