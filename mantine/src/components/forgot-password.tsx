import { useState } from 'react'
import { Stack, TextInput, Text, Button, Anchor } from '@mantine/core'

interface ForgotPasswordFormProps extends React.ComponentProps<'form'> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('Reset password for:', phone)
      setLoading(false)
    }, 1000)
  }

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit}
      gap="lg"
      className={className}
      {...props}
    >
      <Stack align="center" gap="xs">
        <Text size="xl" fw="bold">Forgot Password</Text>
        <Text size="sm" c="dimmed" style={{ textAlign: 'center', textWrap: 'balance' }}>
          Enter your phone number and we'll send you an OTP to reset your password
        </Text>
      </Stack>

      <Stack gap="md">
        <TextInput
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="01XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.currentTarget.value)}
          required
          size="md"
        />

        <Button type="submit" fullWidth loading={loading}>
          Send OTP
        </Button>

        <Text size="sm" ta="center" c="dimmed">
          Remember your password?{' '}
          <Anchor href="/login" inherit style={{ textDecoration: 'underline', textDecorationOffset: '2px' }}>
            Sign in
          </Anchor>
        </Text>
      </Stack>
    </Stack>
  )
}
