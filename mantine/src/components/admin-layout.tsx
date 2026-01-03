import { Outlet } from 'react-router-dom'
import { Box } from '@mantine/core'
import { AppSidebarMantine } from './app-sidebar-mantine'
import { SiteHeaderMantine } from './site-header-mantine'
import { useDisclosure } from '@mantine/hooks'

export function AdminLayout() {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false)
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

  return (
    <Box style={{ display: 'flex', height: '100vh', backgroundColor: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' }}>
      {/* Mantine Sidebar */}
      <AppSidebarMantine
        mobileOpened={mobileOpened}
        desktopOpened={desktopOpened}
        toggleMobile={toggleMobile}
        toggleDesktop={toggleDesktop}
      />

      {/* Main Content */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <SiteHeaderMantine
          mobileOpened={mobileOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />

        {/* Page Content */}
        <Box style={{ flex: 1, overflow: 'auto' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
