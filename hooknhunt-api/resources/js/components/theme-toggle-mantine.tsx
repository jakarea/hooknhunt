import { ActionIcon, useMantineColorScheme } from '@mantine/core'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export function ThemeToggleMantine() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const { t } = useTranslation()

  return (
    <ActionIcon
      variant="subtle"
      color="gray"
      size="lg"
      radius="md"
      aria-label={t('common.toggleColorScheme')}
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

