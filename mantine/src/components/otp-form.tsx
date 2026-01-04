import { useState } from 'react'
import { Stack, PinInput, Text, Button, Anchor, Box } from '@mantine/core'

interface OTPFormProps extends React.ComponentProps<'form'> {
  phone?: string
}

export function OTPForm({ phone = '', className, ...props }: OTPFormProps) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log('OTP submitted:', otp)
      setLoading(false)
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className={className} {...props}>
      <Stack align="center" gap="xs">
        <Text size="xl" fw="bold">Verify OTP</Text>
        <Text size="sm" c="dimmed" style={{ textAlign: 'center', textWrap: 'balance' }}>
          Enter the 6-digit code sent to {phone || 'your phone'}
        </Text>

        <Stack gap="md">
        <Box>
          <Text component="label" size="sm" fw={500} mb="xs" display="block">
            OTP Code
          </Text>
          <PinInput
            length={6}
            type="number"
            value={otp}
            onChange={setOtp}
            placeholder="○"
            size="md"
          />
        </Box>

        <Button type="submit" fullWidth loading={loading}>
          Verify OTP
        </Button>

        <Text size="sm" ta="center" c="dimmed">
          Didn't receive the code?{' '}
          <Anchor href="#" inherit style={{ textDecoration: 'underline', textDecorationOffset: '2px' }}>
            Resend
          </Anchor>
        </Text>

        <Text size="sm" ta="center" c="dimmed">
          <Anchor href="/login" inherit style={{ textDecoration: 'underline', textDecorationOffset: '2px' }}>
            Back to Login
          </Anchor>
        </Text>
        </Stack>
      </Stack>
    </form>
  )
}
