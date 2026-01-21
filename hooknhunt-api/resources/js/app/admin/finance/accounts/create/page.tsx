'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  Select,
  Textarea,
  Button,
  Paper,
  Alert,
  Badge,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconInfoCircle,
  IconChartBar,
} from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { usePermissions } from '@/hooks/usePermissions'

// Mock existing accounts for validation
const mockExistingCodes = [
  '1000', '1010', '1020', '1100', '1200', '1300', '1500', '1510', '1520', '1530', '1540', '1600',
  '2000', '2100', '2200', '2300', '2500', '2510', '2520',
  '3000', '3100', '3200', '3300',
  '4000', '4100', '4200', '4300', '4310', '4320',
  '5000', '5100', '5110', '5120', '5130', '5140', '5150', '5200', '5300', '5400',
]

// Generate next available code for a type
const generateNextCode = (type: string, existingCodes: string[]): string => {
  const prefix = type === 'asset' ? '1' : type === 'liability' ? '2' : type === 'equity' ? '3' : type === 'revenue' ? '4' : '5'
  const rangeStart = parseInt(prefix + '000')

  // Get existing codes for this type
  const typeCodes = existingCodes
    .filter((code) => code.startsWith(prefix))
    .map((code) => parseInt(code))
    .sort((a, b) => a - b)

  // Find next available number
  let nextNumber = rangeStart
  for (const code of typeCodes) {
    if (code === nextNumber) {
      nextNumber++
    } else {
      break
    }
  }

  return nextNumber.toString()
}

export default function CreateAccountPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const navigate = useNavigate()

  // Permission check - user needs finance accounts create permission
  if (!hasPermission('finance_accounts_create')) {
    return (
      <Stack p="xl">
        <Paper withBorder p="xl" shadow="sm" ta="center">
          <Title order={3}>Access Denied</Title>
          <Text c="dimmed">You don't have permission to create Chart of Accounts.</Text>
          <Button
            component={Link}
            to="/finance"
            leftSection={<IconArrowLeft size={16} />}
            mt="md"
          >
            Back to Finance
          </Button>
        </Paper>
      </Stack>
    )
  }

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Account type configuration with translations
  const accountTypes = [
    { value: 'asset', label: t('finance.accountsCreatePage.accountTypes.asset'), codePrefix: '1', color: 'green' },
    { value: 'liability', label: t('finance.accountsCreatePage.accountTypes.liability'), codePrefix: '2', color: 'red' },
    { value: 'equity', label: t('finance.accountsCreatePage.accountTypes.equity'), codePrefix: '3', color: 'blue' },
    { value: 'revenue', label: t('finance.accountsCreatePage.accountTypes.revenue'), codePrefix: '4', color: 'cyan' },
    { value: 'expense', label: t('finance.accountsCreatePage.accountTypes.expense'), codePrefix: '5', color: 'orange' },
  ]

  // Auto-generate code when type changes
  useEffect(() => {
    if (formData.type && !formData.code) {
      const nextCode = generateNextCode(formData.type, mockExistingCodes)
      setFormData((prev) => ({ ...prev, code: nextCode }))
    }
  }, [formData.type])

  const handleChange = (field: string, value: string) => {
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
      newErrors.name = t('finance.accountsCreatePage.validation.nameRequired')
    }

    if (!formData.code.trim()) {
      newErrors.code = t('finance.accountsCreatePage.validation.codeRequired')
    } else if (mockExistingCodes.includes(formData.code)) {
      newErrors.code = t('finance.accountsCreatePage.validation.codeExists')
    } else if (!/^\d{4}$/.test(formData.code)) {
      newErrors.code = t('finance.accountsCreatePage.validation.codeFormat')
    }

    if (!formData.type) {
      newErrors.type = t('finance.accountsCreatePage.validation.typeRequired')
    }

    // Validate code prefix matches type
    if (formData.code && formData.type) {
      const typeConfig = accountTypes.find((t) => t.value === formData.type)
      if (typeConfig && !formData.code.startsWith(typeConfig.codePrefix)) {
        newErrors.code = t('finance.accountsCreatePage.validation.codePrefixMismatch', { prefix: typeConfig.codePrefix, type: typeConfig.label })
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      notifications.show({
        title: t('finance.accountsCreatePage.notification.validationError'),
        message: t('finance.accountsCreatePage.notification.validationErrorMessage'),
        color: 'red',
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      notifications.show({
        title: t('finance.accountsCreatePage.notification.success'),
        message: t('finance.accountsCreatePage.notification.successMessage', { name: formData.name, code: formData.code }),
        color: 'green',
      })
      navigate('/finance/accounts')
    }, 1000)
  }

  const selectedTypeConfig = accountTypes.find((t) => t.value === formData.type)

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <div>
              <Title order={1}>{t('finance.accountsCreatePage.title')}</Title>
              <Text c="dimmed">{t('finance.accountsCreatePage.subtitle')}</Text>
            </div>
            <Button
              component={Link}
              to="/finance/accounts"
              leftSection={<IconArrowLeft size={16} />}
              variant="light"
            >
              {t('finance.accountsCreatePage.backToAccounts')}
            </Button>
          </Group>
        </Box>

        {/* Form */}
        <Paper withBorder p="xl" radius="md" shadow="sm" component="form" onSubmit={handleSubmit}>
          <Stack>
            <Alert variant="light" color="blue" title={t('finance.accountsCreatePage.accountInformation')} mb="md">
              <Text className="text-sm md:text-base">{t('finance.accountsCreatePage.description')}</Text>
            </Alert>

            {/* Code Format Guide */}
            <Alert variant="light" color="grape" icon={<IconInfoCircle size={16} />}>
              <Stack gap="xs">
                <Text className="text-sm md:text-base" fw={600}>{t('finance.accountsCreatePage.codeFormatTitle')}</Text>
                <Group>
                  <Badge color="green" variant="light">{t('finance.accountsCreatePage.codeRanges.assets')}</Badge>
                  <Badge color="red" variant="light">{t('finance.accountsCreatePage.codeRanges.liabilities')}</Badge>
                  <Badge color="blue" variant="light">{t('finance.accountsCreatePage.codeRanges.equity')}</Badge>
                </Group>
                <Group>
                  <Badge color="cyan" variant="light">{t('finance.accountsCreatePage.codeRanges.revenue')}</Badge>
                  <Badge color="orange" variant="light">{t('finance.accountsCreatePage.codeRanges.expenses')}</Badge>
                </Group>
              </Stack>
            </Alert>

            <Stack gap="md">
              {/* Account Name */}
              <TextInput
                required
                label={t('finance.accountsCreatePage.accountName')}
                placeholder={t('finance.accountsCreatePage.accountNamePlaceholder')}
                description={t('finance.accountsCreatePage.accountNameDescription')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.currentTarget.value)}
                error={errors.name}
                leftSection={<IconChartBar size={16} />}
              />

              {/* Account Type */}
              <Select
                required
                label={t('finance.accountsCreatePage.accountType')}
                placeholder={t('finance.accountsCreatePage.accountTypePlaceholder')}
                description={t('finance.accountsCreatePage.accountTypeDescription')}
                data={accountTypes.map((type) => ({
                  value: type.value,
                  label: type.label,
                }))}
                value={formData.type}
                onChange={(value) => handleChange('type', value || '')}
                error={errors.type}
              />

              {/* Account Code */}
              <TextInput
                required
                label={t('finance.accountsCreatePage.accountCode')}
                placeholder={t('finance.accountsCreatePage.accountCodePlaceholder')}
                description={selectedTypeConfig ? t('finance.accountsCreatePage.accountCodeDescription', { prefix: selectedTypeConfig.codePrefix, type: selectedTypeConfig.label }) : t('finance.accountsCreatePage.accountCodeDescriptionDefault')}
                value={formData.code}
                onChange={(e) => handleChange('code', e.currentTarget.value)}
                error={errors.code}
                leftSection={<Text className="text-sm md:text-base" fw={700}>#</Text>}
              />

              {/* Auto-generated code notice */}
              {formData.type && formData.code && !errors.code && (
                <Alert variant="light" color="teal">
                  <Text className="text-sm md:text-base">
                    ✓ {t('finance.accountsCreatePage.codeAvailable', { code: formData.code })}{' '}
                    <Text span fw={600} c={selectedTypeConfig?.color as any}>{selectedTypeConfig?.label}</Text>
                  </Text>
                </Alert>
              )}

              {/* Description */}
              <Textarea
                label={t('finance.accountsCreatePage.descriptionLabel')}
                placeholder={t('finance.accountsCreatePage.descriptionPlaceholder')}
                description={t('finance.accountsCreatePage.descriptionDescription')}
                value={formData.description}
                onChange={(e) => handleChange('description', e.currentTarget.value)}
                minRows={3}
                maxRows={6}
              />
            </Stack>

            {/* Form Actions */}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                onClick={() => navigate('/finance/accounts')}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('finance.accountsCreatePage.createAccount')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
