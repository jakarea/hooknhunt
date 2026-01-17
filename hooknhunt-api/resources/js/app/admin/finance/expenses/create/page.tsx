'use client'

import { useState } from 'react'
import {
  Box,
  Stack,
  Group,
  Title,
  Text,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Button,
  Paper,
  Alert,
  FileInput,
  Divider,
} from '@mantine/core'
import {
  IconArrowLeft,
  IconDeviceFloppy,
  IconReceipt,
  IconUpload,
} from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { DateInput } from '@mantine/dates'
import { useTranslation } from 'react-i18next'

interface ExpenseAccount {
  id: number
  name: string
  code: string
}

interface PaidBy {
  id: number
  name: string
}

// Mock data for development
const mockExpenseAccounts: ExpenseAccount[] = [
  { id: 1, name: 'Office Supplies', code: 'OS' },
  { id: 2, name: 'Utilities', code: 'UTIL' },
  { id: 3, name: 'Rent', code: 'RENT' },
  { id: 4, name: 'Salaries', code: 'SAL' },
  { id: 5, name: 'Marketing', code: 'MKT' },
  { id: 6, name: 'Travel', code: 'TRV' },
  { id: 7, name: 'Maintenance', code: 'MAINT' },
  { id: 8, name: 'Miscellaneous', code: 'MISC' },
  { id: 9, name: 'Repairs', code: 'REP' },
  { id: 10, name: 'Insurance', code: 'INS' },
  { id: 11, name: 'Professional Fees', code: 'PROF' },
  { id: 12, name: 'Training', code: 'TRN' },
]

const mockPaidBy: PaidBy[] = [
  { id: 1, name: 'Ahmed Hassan' },
  { id: 2, name: 'Fatima Rahman' },
  { id: 3, name: 'Karim Uddin' },
  { id: 4, name: 'Ayesha Khan' },
  { id: 5, name: 'Rahim Ali' },
]

export default function CreateExpensePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    account_id: '',
    expense_date: new Date(),
    reference_number: '',
    paid_by_id: '',
    notes: '',
    attachment: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (field: string, value: any) => {
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

    if (!formData.title.trim()) {
      newErrors.title = t('finance.banksPage.expensesCreatePage.validation.titleRequired')
    }

    if (!formData.amount || parseFloat(formData.amount as string) <= 0) {
      newErrors.amount = t('finance.banksPage.expensesCreatePage.validation.amountRequired')
    }

    if (!formData.account_id) {
      newErrors.account_id = t('finance.banksPage.expensesCreatePage.validation.accountRequired')
    }

    if (!formData.expense_date) {
      newErrors.expense_date = t('finance.banksPage.expensesCreatePage.validation.dateRequired')
    }

    if (formData.attachment) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (formData.attachment.size > maxSize) {
        newErrors.attachment = t('finance.banksPage.expensesCreatePage.validation.fileSize')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      notifications.show({
        title: t('finance.banksPage.expensesCreatePage.notification.validationError'),
        message: t('finance.banksPage.expensesCreatePage.notification.validationErrorMessage'),
        color: 'red',
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      notifications.show({
        title: t('finance.banksPage.expensesCreatePage.notification.success'),
        message: t('finance.banksPage.expensesCreatePage.notification.successMessage', { title: formData.title }),
        color: 'green',
      })
      navigate('/finance/expenses')
    }, 1000)
  }

  return (
    <Box p={{ base: 'md', md: 'xl' }}>
      <Stack>
        {/* Header */}
        <Box>
          <Group justify="space-between">
            <div>
              <Title order={1}>{t('finance.banksPage.expensesCreatePage.title')}</Title>
              <Text c="dimmed">{t('finance.banksPage.expensesCreatePage.subtitle')}</Text>
            </div>
            <Button
              component={Link}
              to="/finance/expenses"
              leftSection={<IconArrowLeft size={16} />}
              variant="light"
            >
              {t('finance.banksPage.expensesCreatePage.backToExpenses')}
            </Button>
          </Group>
        </Box>

        {/* Form */}
        <Paper withBorder p="xl" radius="md" shadow="sm" component="form" onSubmit={handleSubmit}>
          <Stack>
            <Alert variant="light" color="blue" title={t('finance.banksPage.expensesCreatePage.expenseInformation')} mb="md">
              <Text size="sm">{t('finance.banksPage.expensesCreatePage.description')}</Text>
            </Alert>

            <Stack gap="md">
              {/* Expense Title */}
              <TextInput
                required
                label={t('finance.banksPage.expensesCreatePage.expenseTitle')}
                placeholder={t('finance.banksPage.expensesCreatePage.expenseTitlePlaceholder')}
                description={t('finance.banksPage.expensesCreatePage.expenseTitleDescription')}
                value={formData.title}
                onChange={(e) => handleChange('title', e.currentTarget.value)}
                error={errors.title}
                leftSection={<IconReceipt size={16} />}
              />

              {/* Amount */}
              <NumberInput
                required
                label={t('finance.banksPage.expensesCreatePage.amount')}
                placeholder={t('finance.banksPage.expensesCreatePage.amountPlaceholder')}
                description={t('finance.banksPage.expensesCreatePage.amountDescription')}
                value={formData.amount}
                onChange={(value) => handleChange('amount', value || '')}
                error={errors.amount}
                min={0.01}
                precision={2}
                thousandSeparator=","
                prefix="৳"
                hideControls
                leftSection={<Text size="sm">৳</Text>}
              />

              {/* Expense Account */}
              <Select
                required
                label={t('finance.banksPage.expensesCreatePage.expenseAccount')}
                placeholder={t('finance.banksPage.expensesCreatePage.selectAccount')}
                description={t('finance.banksPage.expensesCreatePage.expenseAccountDescription')}
                data={mockExpenseAccounts.map((account) => ({
                  value: account.id.toString(),
                  label: `${account.name} (${account.code})`,
                }))}
                value={formData.account_id}
                onChange={(value) => handleChange('account_id', value || '')}
                error={errors.account_id}
                searchable
              />

              {/* Payroll Warning */}
              {formData.account_id && mockExpenseAccounts.find((acc) => acc.id === parseInt(formData.account_id as string))?.name === 'Salaries' && (
                <Alert variant="light" color="yellow" title={t('finance.banksPage.expensesCreatePage.payrollWarning.title')}>
                  <Stack gap="xs">
                    <Text size="sm">
                      <strong>{t('finance.banksPage.expensesCreatePage.payrollWarning.note')}</strong> {t('finance.banksPage.expensesCreatePage.payrollWarning.noteText')}{' '}
                      <Text span fw={600} c="blue">{t('finance.banksPage.expensesCreatePage.payrollWarning.hrmModule')}</Text> {t('finance.banksPage.expensesCreatePage.payrollWarning.moduleText')}
                    </Text>
                    <Text size="sm">
                      {t('finance.banksPage.expensesCreatePage.payrollWarning.accountUsage')}
                    </Text>
                    <Text size="sm" ml="sm">• {t('finance.banksPage.expensesCreatePage.payrollWarning.contractWorkers')}</Text>
                    <Text size="sm" ml="sm">• {t('finance.banksPage.expensesCreatePage.payrollWarning.oneTimeBonuses')}</Text>
                    <Text size="sm" ml="sm">• {t('finance.banksPage.expensesCreatePage.payrollWarning.adjustments')}</Text>
                    <Text size="sm" ml="sm">• {t('finance.banksPage.expensesCreatePage.payrollWarning.taxPayments')}</Text>
                    <Divider />
                    <Text size="xs" c="dimmed">
                      {t('finance.banksPage.expensesCreatePage.payrollWarning.noteText2')}
                    </Text>
                  </Stack>
                </Alert>
              )}

              {/* Expense Date */}
              <DateInput
                required
                label={t('finance.banksPage.expensesCreatePage.expenseDate')}
                placeholder={t('finance.banksPage.expensesCreatePage.selectDate')}
                description={t('finance.banksPage.expensesCreatePage.expenseDateDescription')}
                value={formData.expense_date}
                onChange={(value) => handleChange('expense_date', value)}
                error={errors.expense_date}
                maxDate={new Date()}
                clearable
              />

              {/* Reference Number */}
              <TextInput
                label={t('finance.banksPage.expensesCreatePage.referenceNumber')}
                placeholder={t('finance.banksPage.expensesCreatePage.referenceNumberPlaceholder')}
                description={t('finance.banksPage.expensesCreatePage.referenceNumberDescription')}
                value={formData.reference_number}
                onChange={(e) => handleChange('reference_number', e.currentTarget.value)}
              />

              {/* Paid By */}
              <Select
                label={t('finance.banksPage.expensesCreatePage.paidBy')}
                placeholder={t('finance.banksPage.expensesCreatePage.selectPerson')}
                description={t('finance.banksPage.expensesCreatePage.paidByDescription')}
                data={mockPaidBy.map((person) => ({
                  value: person.id.toString(),
                  label: person.name,
                }))}
                value={formData.paid_by_id}
                onChange={(value) => handleChange('paid_by_id', value || '')}
                searchable
                clearable
              />

              {/* Attachment */}
              <FileInput
                label={t('finance.banksPage.expensesCreatePage.attachment')}
                placeholder={t('finance.banksPage.expensesCreatePage.attachmentPlaceholder')}
                description={t('finance.banksPage.expensesCreatePage.attachmentDescription')}
                value={formData.attachment}
                onChange={(value) => handleChange('attachment', value)}
                error={errors.attachment}
                accept="image/*,.pdf"
                leftSection={<IconUpload size={16} />}
                clearable
              />

              {/* Notes */}
              <Textarea
                label={t('finance.banksPage.expensesCreatePage.notes')}
                placeholder={t('finance.banksPage.expensesCreatePage.notesPlaceholder')}
                description={t('finance.banksPage.expensesCreatePage.notesDescription')}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.currentTarget.value)}
                minRows={3}
                maxRows={6}
              />
            </Stack>

            {/* Form Actions */}
            <Group justify="flex-end" mt="xl">
              <Button
                variant="light"
                onClick={() => navigate('/finance/expenses')}
                disabled={isSubmitting}
              >
                {t('finance.banksPage.expensesCreatePage.cancel')}
              </Button>
              <Button
                type="submit"
                leftSection={<IconDeviceFloppy size={16} />}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t('finance.banksPage.expensesCreatePage.createExpense')}
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
