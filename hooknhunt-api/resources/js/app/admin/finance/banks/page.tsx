import { useState } from 'react'
import { Title, Text, Stack, Paper, Group, Badge, Button, Card, SimpleGrid, TextInput, SegmentedControl, ActionIcon, Menu, Modal, NumberInput, Select, Textarea, ThemeIcon } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconSearch, IconDotsVertical, IconArrowUpRight, IconArrowDownLeft, IconArrowsExchange, IconEdit, IconTrash, IconBuildingBank, IconWallet, IconBrandCashapp, IconPhone, IconRocket, IconEye } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Mock data for bank accounts
const mockBanks = [
  {
    id: 1,
    name: 'Office Cash',
    type: 'cash',
    account_number: null,
    branch: null,
    balance: 50000,
    is_active: true,
    description: 'Main office petty cash'
  },
  {
    id: 2,
    name: 'Brac Bank',
    type: 'bank',
    account_number: '1234567890123',
    branch: 'Gulshan Branch',
    balance: 185000,
    is_active: true,
    description: 'Primary business account'
  },
  {
    id: 3,
    name: 'Dutch Bangla Bank',
    type: 'bank',
    account_number: '9876543210987',
    branch: 'Banani Branch',
    balance: 65000,
    is_active: true,
    description: 'Secondary business account'
  },
  {
    id: 4,
    name: 'bKash Business',
    type: 'bkash',
    account_number: '01712345678',
    branch: null,
    balance: 15000,
    is_active: true,
    description: 'bKash merchant account'
  },
  {
    id: 5,
    name: 'Nagad Merchant',
    type: 'nagad',
    account_number: '01898765432',
    branch: null,
    balance: 8000,
    is_active: true,
    description: 'Nagad merchant wallet'
  },
  {
    id: 6,
    name: 'Rocket Account',
    type: 'rocket',
    account_number: '01556781234',
    branch: null,
    balance: 5500,
    is_active: false,
    description: 'Rocket mobile banking'
  }
]

export default function BanksPage() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [depositOpened, { open: openDeposit, close: closeDeposit }] = useDisclosure(false)
  const [withdrawOpened, { open: openWithdraw, close: closeWithdraw }] = useDisclosure(false)
  const [transferOpened, { open: openTransfer, close: closeTransfer }] = useDisclosure(false)
  const [selectedBank, setSelectedBank] = useState<typeof mockBanks[0] | null>(null)

  // Type icons and colors
  const getTypeConfig = (t: (key: string) => string) => ({
    cash: { icon: <IconWallet size={24} />, color: 'green', label: t('finance.banksPage.filterCash') },
    bank: { icon: <IconBuildingBank size={24} />, color: 'blue', label: t('finance.banksPage.filterBank') },
    bkash: { icon: <IconPhone size={24} />, color: 'pink', label: t('finance.banksPage.filterBkash') },
    nagad: { icon: <IconBrandCashapp size={24} />, color: 'orange', label: t('finance.banksPage.filterNagad') },
    rocket: { icon: <IconRocket size={24} />, color: 'grape', label: t('finance.banksPage.filterRocket') }
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Filter banks
  const filteredBanks = mockBanks.filter((bank) => {
    const matchesSearch = bank.name.toLowerCase().includes(search.toLowerCase()) ||
      bank.account_number?.toLowerCase().includes(search.toLowerCase()) ||
      bank.description?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || bank.type === typeFilter
    return matchesSearch && matchesType
  })

  // Handle quick actions
  const handleDeposit = (bank: typeof mockBanks[0]) => {
    setSelectedBank(bank)
    openDeposit()
  }

  const handleWithdraw = (bank: typeof mockBanks[0]) => {
    setSelectedBank(bank)
    openWithdraw()
  }

  const handleTransfer = (bank: typeof mockBanks[0]) => {
    setSelectedBank(bank)
    openTransfer()
  }

  return (
    <Stack p="xl">
      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <div>
          <Title order={1}>{t('finance.banksPage.title')}</Title>
          <Text c="dimmed">{t('finance.banksPage.subtitle')}</Text>
        </div>
        <Button
          component={Link}
          to="/finance/banks/create"
          leftSection={<IconPlus size={16} />}
        >
          {t('finance.banksPage.addAccount')}
        </Button>
      </Group>

      {/* Filters */}
      <Paper withBorder p="md" shadow="sm">
        <Group justify="space-between">
          <TextInput
            placeholder={t('finance.banksPage.searchPlaceholder')}
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={300}
          />
          <SegmentedControl
            value={typeFilter}
            onChange={setTypeFilter}
            data={[
              { label: t('finance.banksPage.filterAll'), value: 'all' },
              { label: t('finance.banksPage.filterCash'), value: 'cash' },
              { label: t('finance.banksPage.filterBank'), value: 'bank' },
              { label: t('finance.banksPage.filterBkash'), value: 'bkash' },
              { label: t('finance.banksPage.filterNagad'), value: 'nagad' },
              { label: t('finance.banksPage.filterRocket'), value: 'rocket' }
            ]}
          />
        </Group>
      </Paper>

      {/* Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 5 }}>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <ThemeIcon color="green" size="lg" variant="light">
              <IconWallet size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{t('finance.banksPage.filterCash')}</Text>
              <Text fw={700}>{formatCurrency(50000)}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <ThemeIcon color="blue" size="lg" variant="light">
              <IconBuildingBank size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{t('finance.banksPage.filterBank')}</Text>
              <Text fw={700}>{formatCurrency(250000)}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <ThemeIcon color="pink" size="lg" variant="light">
              <IconPhone size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{t('finance.banksPage.filterBkash')}</Text>
              <Text fw={700}>{formatCurrency(15000)}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <ThemeIcon color="orange" size="lg" variant="light">
              <IconBrandCashapp size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{t('finance.banksPage.filterNagad')}</Text>
              <Text fw={700}>{formatCurrency(8000)}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder p="md" shadow="sm">
          <Group gap="xs">
            <ThemeIcon color="grape" size="lg" variant="light">
              <IconRocket size={20} />
            </ThemeIcon>
            <div>
              <Text size="xs" c="dimmed">{t('finance.banksPage.filterRocket')}</Text>
              <Text fw={700}>{formatCurrency(5500)}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Bank Cards Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
        {filteredBanks.map((bank) => {
          const config = getTypeConfig(t)
          return (
            <Card key={bank.id} withBorder shadow="sm" padding="lg" radius="md">
              {/* Card Header */}
              <Group justify="space-between" mb="md">
                <Group gap="sm">
                  <ThemeIcon color={config.color} size="xl" variant="light" radius="md">
                    {config.icon}
                  </ThemeIcon>
                  <div>
                    <Text fw={600}>{bank.name}</Text>
                    <Badge color={config.color} variant="light" size="sm">
                      {config.label}
                    </Badge>
                  </div>
                </Group>
                <Group gap="xs">
                  <Badge color={bank.is_active ? 'green' : 'gray'} variant="dot">
                    {bank.is_active ? t('finance.banksPage.active') : t('finance.banksPage.inactive')}
                  </Badge>
                  <Menu shadow="md" width={150} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray">
                        <IconDotsVertical size={16} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                      <Menu.Item
                        leftSection={<IconEye size={14} />}
                        component={Link}
                        to={`/finance/banks/${bank.id}`}
                      >
                        {t('finance.banksPage.viewDetails')}
                      </Menu.Item>
                      <Menu.Item
                        leftSection={<IconEdit size={14} />}
                        component={Link}
                        to={`/finance/banks/${bank.id}/edit`}
                      >
                        {t('finance.banksPage.edit')}
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        leftSection={<IconTrash size={14} />}
                        color="red"
                      >
                        {t('finance.banksPage.delete')}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Group>

              {/* Account Info */}
              <Stack gap="xs" mb="md">
                {bank.account_number && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">{t('finance.banksPage.accountNo')}</Text>
                    <Text size="sm" fw={500}>{bank.account_number}</Text>
                  </Group>
                )}
                {bank.branch && (
                  <Group justify="space-between">
                    <Text size="sm" c="dimmed">{t('finance.banksPage.branch')}</Text>
                    <Text size="sm" fw={500}>{bank.branch}</Text>
                  </Group>
                )}
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">{t('finance.banksPage.balance')}</Text>
                  <Text size="lg" fw={700} c={config.color}>
                    {formatCurrency(bank.balance)}
                  </Text>
                </Group>
              </Stack>

              {/* Quick Actions */}
              <Group grow>
                <Button
                  variant="light"
                  color="green"
                  size="xs"
                  leftSection={<IconArrowDownLeft size={14} />}
                  onClick={() => handleDeposit(bank)}
                >
                  {t('finance.banksPage.deposit')}
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="xs"
                  leftSection={<IconArrowUpRight size={14} />}
                  onClick={() => handleWithdraw(bank)}
                >
                  {t('finance.banksPage.withdraw')}
                </Button>
                <Button
                  variant="light"
                  color="blue"
                  size="xs"
                  leftSection={<IconArrowsExchange size={14} />}
                  onClick={() => handleTransfer(bank)}
                >
                  {t('finance.banksPage.transfer')}
                </Button>
              </Group>
            </Card>
          )
        })}
      </SimpleGrid>

      {/* Empty State */}
      {filteredBanks.length === 0 && (
        <Paper withBorder p="xl" ta="center">
          <Text c="dimmed">{t('finance.banksPage.noAccountsFound')}</Text>
        </Paper>
      )}

      {/* Deposit Modal */}
      <Modal opened={depositOpened} onClose={closeDeposit} title={t('finance.banksPage.depositModal.title')} centered>
        <Stack>
          <TextInput
            label={t('finance.banksPage.depositModal.account')}
            value={selectedBank?.name || ''}
            disabled
          />
          <NumberInput
            label={t('finance.banksPage.depositModal.amount')}
            placeholder={t('finance.banksPage.depositModal.amountPlaceholder')}
            prefix="৳"
            thousandSeparator=","
            min={0}
          />
          <Select
            label={t('finance.banksPage.depositModal.depositMethod')}
            placeholder={t('finance.banksPage.depositModal.methodPlaceholder')}
            data={[
              { value: 'cash', label: t('finance.banksPage.depositModal.methodCash') },
              { value: 'transfer', label: t('finance.banksPage.depositModal.methodTransfer') },
              { value: 'cheque', label: t('finance.banksPage.depositModal.methodCheque') },
              { value: 'other', label: t('finance.banksPage.depositModal.methodOther') }
            ]}
          />
          <Textarea
            label={t('finance.banksPage.depositModal.description')}
            placeholder={t('finance.banksPage.depositModal.descriptionPlaceholder')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={closeDeposit}>{t('finance.banksPage.depositModal.cancel')}</Button>
            <Button color="green" onClick={closeDeposit}>{t('finance.banksPage.depositModal.confirm')}</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Withdraw Modal */}
      <Modal opened={withdrawOpened} onClose={closeWithdraw} title={t('finance.banksPage.withdrawModal.title')} centered>
        <Stack>
          <TextInput
            label={t('finance.banksPage.depositModal.account')}
            value={selectedBank?.name || ''}
            disabled
          />
          <Text size="sm" c="dimmed">
            {t('finance.banksPage.withdrawModal.availableBalance')} {selectedBank ? formatCurrency(selectedBank.balance) : '৳0.00'}
          </Text>
          <NumberInput
            label={t('finance.banksPage.withdrawModal.amount')}
            placeholder={t('finance.banksPage.withdrawModal.amountPlaceholder')}
            prefix="৳"
            thousandSeparator=","
            min={0}
            max={selectedBank?.balance}
          />
          <Select
            label={t('finance.banksPage.withdrawModal.withdrawalMethod')}
            placeholder={t('finance.banksPage.withdrawModal.methodPlaceholder')}
            data={[
              {
                value: 'cash', label: t('finance.banksPage.withdrawModal.methodCash')
              },
              {
                value: 'transfer', label: t('finance.banksPage.withdrawModal.methodTransfer')
              },
              { value: 'cheque', label: t('finance.banksPage.withdrawModal.methodCheque') },
              { value: 'other', label: t('finance.banksPage.withdrawModal.methodOther') }
            ]}
          />
          <Textarea
            label={t('finance.banksPage.withdrawModal.description')}
            placeholder={t('finance.banksPage.withdrawModal.descriptionPlaceholder')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={closeWithdraw}>{t('finance.banksPage.withdrawModal.cancel')}</Button>
            <Button color="red" onClick={closeWithdraw}>{t('finance.banksPage.withdrawModal.confirm')}</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Transfer Modal */}
      <Modal opened={transferOpened} onClose={closeTransfer} title={t('finance.banksPage.transferModal.title')} centered>
        <Stack>
          <TextInput
            label={t('finance.banksPage.transferModal.fromAccount')}
            value={selectedBank?.name || ''}
            disabled
          />
          <Text size="sm" c="dimmed">
            {t('finance.banksPage.withdrawModal.availableBalance')} {selectedBank ? formatCurrency(selectedBank.balance) : '৳0.00'}
          </Text>
          <Select
            label={t('finance.banksPage.transferModal.toAccount')}
            placeholder={t('finance.banksPage.transferModal.toAccountPlaceholder')}
            data={mockBanks
              .filter((b) => b.id !== selectedBank?.id)
              .map((b) => ({ value: b.id.toString(), label: b.name }))}
          />
          <NumberInput
            label={t('finance.banksPage.depositModal.amount')}
            placeholder={t('finance.banksPage.depositModal.amountPlaceholder')}
            prefix="৳"
            thousandSeparator=","
            min={0}
            max={selectedBank?.balance}
          />
          <Textarea
            label={t('finance.banksPage.depositModal.description')}
            placeholder={t('finance.banksPage.depositModal.descriptionPlaceholder')}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={closeTransfer}>{t('finance.banksPage.depositModal.cancel')}</Button>
            <Button color="blue" onClick={closeTransfer}>{t('finance.banksPage.transferModal.confirm')}</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  )
}
