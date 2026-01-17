'use client'

import { useState } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  PasswordInput,
  Select,
  NumberInput,
  Textarea,
  Button,
  Paper,
  Alert,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconBuildingBank,
  IconCash,
  IconCoin,
} from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'

const getAccountTypes = (t: (key: string) => string) => [
  { value: 'cash', label: t('finance.banksPage.createPage.accountTypes.cash') },
  { value: 'bank', label: t('finance.banksPage.createPage.accountTypes.bank') },
  { value: 'bkash', label: t('finance.banksPage.createPage.accountTypes.bkash') },
  { value: 'nagad', label: t('finance.banksPage.createPage.accountTypes.nagad') },
  { value: 'rocket', label: t('finance.banksPage.createPage.accountTypes.rocket') },
  { value: 'other', label: t('finance.banksPage.createPage.accountTypes.other') },
]

export default function CreateBankPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    account_number: '',
    account_holder: '',
    branch: '',
    initial_balance: '',
    phone: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = t('finance.banksPage.createPage.validation.nameRequired')
    }

    if (!formData.type) {
      newErrors.type = t('finance.banksPage.createPage.validation.typeRequired')
    }

    if (formData.account_number && formData.account_number.length < 5) {
      newErrors.account_number = t('finance.banksPage.createPage.validation.accountNumberMinLength')
    }

    if (formData.phone && !/^[0-9+]+$/.test(formData.phone)) {
      newErrors.phone = t('finance.banksPage.createPage.validation.phoneInvalid')
    }

    if (formData.initial_balance && parseFloat(formData.initial_balance) < 0) {
      newErrors.initial_balance = t('finance.banksPage.createPage.validation.initialBalanceNegative')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      notifications.show({
        title: t('finance.banksPage.createPage.notification.validationError'),
        message: t('finance.banksPage.createPage.notification.validationErrorMessage'),
        color: 'red',
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      notifications.show({
        title: t('finance.banksPage.createPage.notification.success'),
        message: t('finance.banksPage.createPage.notification.successMessage', { name: formData.name }),
        color: 'green',
      })
      navigate('/finance/banks')
    }, 1000)
  }

  const getIconForType = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      cash: <IconCash />,
      bank: <IconBuildingBank />,
      bkash: <Text fw={700}>bKash</Text>,
      nagad: <Text fw={700} style={{ fontFamily: 'cursive' }}>Nagad</Text>,
      rocket: <Text fw={700} style={{ fontFamily: 'monospace' }}>Rocket</Text>,
      other: <IconCoin />,
    }
    return icons[type] || icons.other
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <div>
              <Title order={1}>{t('finance.banksPage.createPage.title')}</Title>
              <Text c="dimmed">{t('finance.banksPage.createPage.subtitle')}</Text>
            </div>
            <Button
              component={Link}
              to="/finance/banks"
              leftSection={<IconArrowLeft size={16} />}
              variant="light"
            >
              {t('finance.banksPage.createPage.backToBanks')}
            </Button>
          </Group>
        </Box>

        {/* Form */}
        <Paper withBorder p="xl" radius="md" shadow="sm" component="form" onSubmit={handleSubmit}>
          <Stack>
            <Alert variant="light" color="blue" title={t('finance.banksPage.createPage.accountInformation')} mb="md">
              <Text size="sm">{t('finance.banksPage.createPage.description')}</Text>
            </Alert>

            <Stack gap="md">
              {/* Account Name */}
              <TextInput
                required
                label={t('finance.banksPage.createPage.accountName')}
                placeholder={t('finance.banksPage.createPage.accountNamePlaceholder')}
                description={t('finance.banksPage.createPage.accountNameDescription')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.currentTarget.value)}
                error={errors.name}
                leftSection={<IconBuildingBank size={16} />}
              />

              {/* Account Type */}
              <Select
                required
                label={t('finance.banksPage.createPage.accountType')}
                placeholder={t('finance.banksPage.createPage.accountTypePlaceholder')}
                data={getAccountTypes(t)}
                value={formData.type}
                onChange={(value) => handleChange('type', value || '')}
                error={errors.type}
                searchable
              />

              {/* Account Number */}
              <TextInput
                label={t('finance.banksPage.createPage.accountNumber')}
                placeholder={t('finance.banksPage.createPage.accountNumberPlaceholder')}
                description={t('finance.banksPage.createPage.accountNumberDescription')}
                value={formData.account_number}
                onChange={(e) => handleChange('account_number', e.currentTarget.value)}
                error={errors.account_number}
                leftSection={<IconDeviceFloppy size={16} />}
              />

              {/* Account Holder Name */}
              <TextInput
                label={t('finance.banksPage.createPage.accountHolder')}
                placeholder={t('finance.banksPage.createPage.accountHolderPlaceholder')}
                value={formData.account_holder}
                onChange={(e) => handleChange('account_holder', e.currentTarget.value)}
                description={t('finance.banksPage.createPage.accountHolderDescription')}
              />

              {/* Branch */}
              <TextInput
                label={t('finance.banksPage.createPage.branch')}
                placeholder={t('finance.banksPage.createPage.branchPlaceholder')}
                value={formData.branch}
                onChange={(e) => handleChange('branch', e.currentTarget.value)}
                description={t('finance.banksPage.createPage.branchDescription')}
              />

              {/* Initial Balance */}
              <NumberInput
                label={t('finance.banksPage.createPage.initialBalance')}
                placeholder="0.00"
                description={t('finance.banksPage.createPage.initialBalanceDescription')}
                value={formData.initial_balance}
                onChange={(value) => handleChange('initial_balance', value || '')}
                error={errors.initial_balance}
                min={0}
                precision={2}
                thousandSeparator=","
                prefix="৳"
                hideControls
              />

              {/* Phone Number */}
              <TextInput
                label={t('finance.banksPage.createPage.phoneNumber')}
                placeholder={t('finance.banksPage.createPage.phonePlaceholder')}
                description={t('finance.banksPage.createPage.phoneDescription')}
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.currentTarget.value)}
                error={errors.phone}
                leftSection={<Text size="sm">+88</Text>}
              />

              {/* Notes */}
              <Textarea
                label={t('finance.banksPage.createPage.notes')}
                placeholder={t('finance.banksPage.createPage.notesPlaceholder')}
                description={t('finance.banksPage.createPage.notesDescription')}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.currentTarget.value)}
                minRows={3}
                maxRows={6}
              />
            </Stack>

            {/* Account Type Preview */}
            {formData.type && (
              <Alert variant="light" color="grape">
                <Group gap="sm">
                  {getIconForType(formData.type)}
                  <Text size="sm">
                    <Text span fw={600}>{t('finance.banksPage.createPage.accountTypePreview')}:</Text> {formData.type.toUpperCase()}
                  </Text>
                </Group>
              </Alert>
            )}

            {/* Form Actions */}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                onClick={() => navigate('/finance/banks')}
                disabled={isSubmitting}
              >
                {t('finance.banksPage.createPage.cancel')}
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('finance.banksPage.createPage.createAccount')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
