import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Checkbox,
  Paper,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'

interface FormErrors {
  phone?: string
  password?: string
}

export function LoginForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    // Prevent double submission
    if (loading) {
      return
    }


    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        login_id: phoneNumber,
        password,
      })


      // Check response status
      if (!response.data?.status) {
        throw new Error(response.data?.message || 'Login failed')
      }

      // API V2 response structure: { status, message, data: { token/accessToken, user } }
      const { data } = response.data

      // Handle different token field names (token, accessToken, access_token)
      const token = data.token || data.accessToken || data.access_token
      const user = data.user

      if (!token) {
        console.error('Token not found in response. Available keys:', Object.keys(data))
        throw new Error('Token not found in login response')
      }


      // Store token immediately
      localStorage.setItem('token', token)

      // Extract permissions from login response (user.role.permissions is already included)
      const rolePermissions = user?.role?.permissions || []
      const permissions = rolePermissions.map((p: { slug: string }) => p.slug)


      login(token, user, permissions, rolePermissions)


      notifications.show({
        title: 'Success',
        message: t('auth.login.success'),
        color: 'green',
      })

      // Small delay to ensure localStorage is written before navigation
      setTimeout(() => {
        navigate('/dashboard')
      }, 300)
    } catch (error) {
      console.error('Login error:', error)
      const apiError = error as { response?: { data?: { message?: string; errors?: string | { action?: string }; error?: string } }, message?: string }

      // Handle different response structures
      let errorMessage = t('auth.login.errors.loginFailed')

      if (apiError?.response?.data) {
        const responseData = apiError.response.data

        // Check for message in different possible locations
        if (responseData.message) {
          errorMessage = responseData.message
        } else if (responseData.errors && typeof responseData.errors === 'string') {
          errorMessage = responseData.errors
        } else if (responseData.error) {
          errorMessage = responseData.error
        }
      } else if (apiError?.message) {
        errorMessage = apiError.message
      }


      // Show error notification
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      })

      // Also show inline validation error if phone verification is needed
      if (apiError?.response?.data?.errors && typeof apiError.response.data.errors === 'object' && 'action' in apiError.response.data.errors && apiError.response.data.errors.action === 'verify_otp') {
        setErrors({ phone: errorMessage })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Paper
      withBorder
      shadow="md"
      p={{ base: 'md', md: 'xl', lg: '32px' }}
      radius="lg"
      miw={{ base: '100%', md: 400 }}
    >
      <Stack gap="lg">
        {/* Header */}
        <Stack align="center" gap="xs">
          <Text
            size="2xl"
            fw="bold"
            ta="center"
          >
            {t('auth.login.title')}
          </Text>
          <Text
            size="md"
            c="dimmed"
            ta="center"
            maw={350}
          >
            {t('auth.login.subtitle')}
          </Text>
        </Stack>

        {/* Form */}
        <Stack gap="md">
          <TextInput
            id="phone_number"
            label={t('auth.login.phoneLabel')}
            placeholder={t('auth.login.phonePlaceholder')}
            required
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.currentTarget.value)
              if (errors.phone) setErrors({ ...errors, phone: undefined })
            }}
            size="md"
            error={errors.phone}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          <PasswordInput
            id="password"
            label={t('auth.login.passwordLabel')}
            placeholder={t('auth.login.passwordPlaceholder')}
            required
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value)
              if (errors.password) setErrors({ ...errors, password: undefined })
            }}
            size="md"
            error={errors.password}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          <Checkbox
            id="remember_me"
            label={t('auth.login.rememberMe')}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.currentTarget.checked)}
            size="md"
          />

          <Button
            fullWidth
            size="lg"
            loading={loading}
            disabled={loading}
            mt="sm"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            {loading ? t('auth.login.submittingButton') : t('auth.login.submitButton')}
          </Button>
        </Stack>

        {/* Footer */}
        <Text size="sm" ta="center" c="dimmed">
          {t('auth.login.havingTrouble')}{' '}
          <Text
            component="a"
            href="#"
            c="blue"
            inherit
            style={{ textDecoration: 'underline' }}
          >
            {t('auth.login.contactSupport')}
          </Text>
        </Text>
      </Stack>
    </Paper>
  )
}
