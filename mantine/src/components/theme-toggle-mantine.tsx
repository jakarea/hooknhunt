import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'

export function ThemeToggleMantine() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="lg"
      radius="md"
      aria-label="Toggle color scheme"
      onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
    >
      {colorScheme === 'light' ? (
        <IconMoon stroke={1.5} />
      ) : (
        <IconSun stroke={1.5} />
      )}
    </ActionIcon>
  )
}

