import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  IconDashboard,
  IconChartBar,
  IconPackage,
  IconShoppingCart,
  IconShip,
  IconBuildingWarehouse,
  IconReceipt,
  IconCashRegister,
  IconUsers,
  IconUsersGroup,
  IconChartPie,
  IconShield,
  IconSettings,
  IconBell,
  IconUser,
  IconSearch,
  IconInnerShadowTop,
  IconCoin,
  IconChevronRight,
} from "@tabler/icons-react"
import {
  Box,
  TextInput,
  ScrollArea,
  NavLink,
  Text,
  Group,
  Avatar,
  rem,
  Drawer,
  Burger,
  ActionIcon,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useAuthStore } from "@/stores/authStore"

interface AppSidebarMantineProps {
  mobileOpened: boolean
  desktopOpened: boolean
  toggleMobile: () => void
  toggleDesktop: () => void
}

export function AppSidebarMantine({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}: AppSidebarMantineProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [searchValue, setSearchValue] = React.useState("")
  const [opened, setOpened] = React.useState<Record<string, boolean>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")
  const hasPermission = useAuthStore((state) => state.hasPermission)
  const isSuperAdmin = useAuthStore((state) => state.isSuperAdmin)
  const user = useAuthStore((state) => state.user)

  const toggleSection = (label: string) => {
    setOpened((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  // Permission mapping for menu items
  const canAccess = React.useCallback((url: string): boolean => {
    // Super admin has access to everything
    if (isSuperAdmin()) return true

    // Map URLs to required permissions
    const permissionMap: Record<string, string> = {
      // User Management
      '/admin/settings/users': 'user.index',
      '/admin/users': 'user.index',
      '/admin/roles': 'role.index',
      '/admin/hrm/roles': 'role.index',
      '/admin/settings/roles': 'role.index',
      '/admin/permissions': 'permission.index',
      '/admin/settings/permissions': 'user.direct-access',
      '/admin/hrm/employees': 'staff.index',
      '/admin/hrm/employees/create': 'staff.create',

      // Products (examples - add more as needed)
      '/admin/catalog/products': 'product.index',
      '/admin/catalog/products/create': 'product.create',

      // Add more mappings as needed
    }

    const requiredPermission = permissionMap[url]
    return requiredPermission ? hasPermission(requiredPermission) : true
  }, [hasPermission, isSuperAdmin])

  const data = React.useMemo(() => ({
    user: {
      name: user?.name || "Admin",
      email: user?.email || user?.phone_number || "admin@hooknhunt.com",
      avatar: "/avatars/default.jpg",
    },
    navItems: [
      {
        label: t("nav.main"),
        items: [
          {
            title: t("nav.dashboard"),
            url: "/admin/dashboard",
            icon: IconDashboard,
          },
          // {
          //   title: t("nav.analytics"),
          //   url: "/admin/dashboard/analytics",
          //   icon: IconChartBar,
          // },
          // {
          //   title: t("nav.notifications"),
          //   url: "/admin/notifications",
          //   icon: IconBell,
          // },
        ],
      },
      {
        label: t("sections.operations"),
        items: [
          // {
          //   title: t("nav.products"),
          //   icon: IconPackage,
          //   children: [
          //     { title: t("products.productList"), url: "/admin/catalog/products" },
          //     { title: t("products.createProduct"), url: "/admin/catalog/products/create" },
          //     { title: t("products.variants"), url: "/admin/catalog/variants" },
          //     { title: t("products.categories"), url: "/admin/catalog/categories" },
          //     { title: t("products.brands"), url: "/admin/catalog/brands" },
          //     { title: t("products.attributes"), url: "/admin/catalog/attributes" },
          //     { title: t("products.units"), url: "/admin/catalog/units" },
          //     { title: t("products.printLabels"), url: "/admin/catalog/print-labels" },
          //   ],
          // },
          // {
          //   title: t("nav.inventory"),
          //   icon: IconBuildingWarehouse,
          //   children: [
          //     { title: t("inventory.currentStock"), url: "/admin/inventory/stock" },
          //     { title: t("inventory.sorting"), url: "/admin/inventory/sorting" },
          //     { title: t("inventory.stockHistory"), url: "/admin/inventory/history" },
          //     { title: t("inventory.adjustments"), url: "/admin/inventory/adjustments" },
          //     { title: t("inventory.stockTake"), url: "/admin/inventory/stock-take" },
          //     { title: t("inventory.warehouses"), url: "/admin/inventory/warehouses" },
          //     { title: t("inventory.transfers"), url: "/admin/inventory/transfers" },
          //   ],
          // },
          // {
          //   title: t("nav.procurement"),
          //   icon: IconShoppingCart,
          //   children: [
          //     { title: t("procurement.orders"), url: "/admin/procurement/orders" },
          //     { title: t("procurement.createPO"), url: "/admin/procurement/create" },
          //     { title: t("procurement.suppliers"), url: "/admin/procurement/suppliers" },
          //     { title: t("procurement.returns"), url: "/admin/procurement/returns" },
          //   ],
          // },
          // {
          //   title: t("nav.importShipments"),
          //   icon: IconShip,
          //   children: [
          //     { title: t("shipments.shipments"), url: "/admin/shipments" },
          //     { title: t("shipments.create"), url: "/admin/shipments/create" },
          //     { title: t("shipments.view"), url: "/admin/shipments/view" },
          //     { title: t("shipments.costing"), url: "/admin/shipments/costing" },
          //     { title: t("shipments.receiveStock"), url: "/admin/shipments/receive" },
          //   ],
          // },
          // {
          //   title: t("nav.sales"),
          //   icon: IconReceipt,
          //   children: [
          //     { title: t("sales.orders"), url: "/admin/sales/orders" },
          //     { title: t("sales.create"), url: "/admin/sales/create" },
          //     { title: t("sales.returns"), url: "/admin/sales/returns" },
          //     { title: t("sales.quotations"), url: "/admin/sales/quotations" },
          //   ],
          // },
          // {
          //   title: t("nav.pos"),
          //   icon: IconCashRegister,
          //   children: [
          //     { title: t("pos.posTerminal"), url: "/admin/pos" },
          //     { title: t("pos.history"), url: "/admin/pos/history" },
          //     { title: t("pos.register"), url: "/admin/pos/register" },
          //     { title: t("pos.held"), url: "/admin/pos/held" },
          //   ],
          // },
          // {
          //   title: t("nav.crm"),
          //   icon: IconUsers,
          //   children: [
          //     { title: t("crm.customers"), url: "/admin/crm/customers" },
          //     { title: t("crm.leads"), url: "/admin/crm/leads" },
          //     { title: t("crm.wallet"), url: "/admin/crm/wallet" },
          //     { title: t("crm.loyalty"), url: "/admin/crm/loyalty" },
          //   ],
          // },
          {
            title: t("nav.hrm"),
            icon: IconUsersGroup,
            children: [
              { title: t("hrm.employees"), url: "/admin/hrm/employees" },
              { title: t("hrm.departments"), url: "/admin/hrm/departments" },
              { title: t("hrm.leaves"), url: "/admin/hrm/leaves" },
              { title: t("hrm.attendance"), url: "/admin/hrm/attendance" },
              { title: t("hrm.payroll"), url: "/admin/hrm/payroll" },
              { title: t("settings.roles"), url: "/admin/hrm/roles" },
            ],
          },
        ],
      },
      {
        label: t("sections.financeReports"),
        items: [
          // {
          //   title: t("nav.logistics"),
          //   icon: IconShip,
          //   children: [
          //     { title: t("logistics.booking"), url: "/admin/logistics/booking" },
          //     { title: t("logistics.tracking"), url: "/admin/logistics/tracking" },
          //     { title: t("logistics.couriers"), url: "/admin/logistics/couriers" },
          //     { title: t("logistics.zones"), url: "/admin/logistics/zones" },
          //   ],
          // },
          // {
          //   title: t("nav.marketing"),
          //   icon: IconChartBar,
          //   children: [
          //     { title: t("marketing.campaigns"), url: "/admin/marketing/campaigns" },
          //     { title: t("marketing.affiliates"), url: "/admin/marketing/affiliates" },
          //   ],
          // },
          // {
          //   title: t("nav.finance"),
          //   icon: IconCoin,
          //   children: [
          //     { title: t("finance.transactions"), url: "/admin/finance/transactions" },
          //     { title: t("finance.expenses"), url: "/admin/finance/expenses" },
          //     { title: t("finance.accounts"), url: "/admin/finance/accounts" },
          //     { title: t("finance.reports"), url: "/admin/finance/reports/pl" },
          //   ],
          // },
          // {
          //   title: t("nav.reports"),
          //   icon: IconChartPie,
          //   children: [
          //     { title: t("reports.sales"), url: "/admin/reports/sales" },
          //     { title: t("reports.stock"), url: "/admin/reports/stock" },
          //     { title: t("reports.products"), url: "/admin/reports/products" },
          //     { title: t("reports.customers"), url: "/admin/reports/customers" },
          //     { title: t("reports.tax"), url: "/admin/reports/tax" },
          //   ],
          // },
        ],
      },
      {
        label: t("nav.settings"),
        items: [
          // {
          //   title: t("nav.support"),
          //   icon: IconShield,
          //   children: [
          //     { title: t("support.tickets"), url: "/admin/support/tickets" },
          //     { title: t("support.categories"), url: "/admin/support/categories" },
          //   ],
          // },
          // {
          //   title: t("nav.cms"),
          //   icon: IconBell,
          //   children: [
          //     { title: t("cms.banners"), url: "/admin/cms/banners" },
          //     { title: t("cms.menus"), url: "/admin/cms/menus" },
          //     { title: t("cms.pages"), url: "/admin/cms/pages" },
          //     { title: t("cms.blog"), url: "/admin/cms/blog" },
          //     { title: t("cms.media"), url: "/admin/cms/media" },
          //   ],
          // },
          
          {
            title: t("settings.permissions"),
            url: "/admin/settings/permissions",
            icon: IconShield,
          },
          // {
          //   title: t("settings.auditLogs"),
          //   url: "/admin/audit-logs",
          //   icon: IconShield,
          // },
          // {
          //   title: t("settings.general"),
          //   url: "/admin/settings/general",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.payments"),
          //   url: "/admin/settings/payments",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.taxes"),
          //   url: "/admin/settings/taxes",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.apiKeys"),
          //   url: "/admin/settings/api",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.backup"),
          //   url: "/admin/settings/backup",
          //   icon: IconSettings,
          // },
          {
            title: t("settings.profile"),
            url: "/admin/profile",
            icon: IconUser,
          },
        ],
      },
    ],
  }), [t, user])

  // Filter navigation items based on search and permissions
  const filteredNavItems = React.useMemo(() => {
    let items = data.navItems

    // Filter by permissions
    items = items
      .map((section) => {
        // Filter items within each section based on permissions
        const permittedItems = section.items.filter((item) => {
          // Check if user has access to the item's URL
          if (item.url && !canAccess(item.url)) {
            return false
          }

          // For items with children, filter children based on permissions
          if (item.children) {
            const permittedChildren = item.children.filter((child) =>
              child.url ? canAccess(child.url) : true
            )
            // Only show parent if it has accessible children or if the parent URL itself is accessible
            return permittedChildren.length > 0 || (item.url && canAccess(item.url))
          }

          return true
        })

        // For items with children, filter the children
        const itemsWithPermittedChildren = permittedItems.map((item) => {
          if (!item.children) return item

          const permittedChildren = item.children.filter((child) =>
            child.url ? canAccess(child.url) : true
          )

          return { ...item, children: permittedChildren }
        })

        // Only return section if it has accessible items
        if (itemsWithPermittedChildren.length === 0) {
          return null
        }

        return { ...section, items: itemsWithPermittedChildren }
      })
      .filter((section): section is (typeof data.navItems)[0] => section !== null)

    // Then filter by search if there's a search value
    if (!searchValue.trim()) {
      return items
    }

    const query = searchValue.toLowerCase()

    return items
      .map((section) => {
        // Filter items within each section
        const filteredItems = section.items.filter((item) => {
          const matchesTitle = item.title.toLowerCase().includes(query)

          // Check if any children match
          const hasMatchingChildren =
            item.children &&
            item.children.some((child) => child.title.toLowerCase().includes(query))

          return matchesTitle || hasMatchingChildren
        })

        // For matching items, also filter their children
        const itemsWithFilteredChildren = filteredItems.map((item) => {
          if (!item.children) return item

          const filteredChildren = item.children.filter((child) =>
            child.title.toLowerCase().includes(query)
          )

          return { ...item, children: filteredChildren }
        })

        // Only return section if it has matching items
        if (itemsWithFilteredChildren.length === 0) {
          return null
        }

        return { ...section, items: itemsWithFilteredChildren }
      })
      .filter((section): section is (typeof data.navItems)[0] => section !== null)
  }, [data.navItems, searchValue, canAccess])

  const renderNavLink = (item: any, index: number, allItems: any[]) => {
    const hasChildren = item.children && item.children.length > 0
    const isOpen = opened[item.title] || searchValue.trim() !== '' // Auto-expand when searching

    // Smart URL matching for active state (computed directly, no useMemo needed)
    const isActive = (() => {
      if (!item.url) return false

      // Exact match
      if (location.pathname === item.url) return true

      // Parent route match (e.g., /admin/users matches /admin/users/7 or /admin/users/7/edit)
      // But only if the current path starts with the item URL + '/'
      if (location.pathname.startsWith(item.url + '/')) {
        // Check if this is a sibling route by comparing with ALL items at the same level
        const siblingRoutes = allItems
          .filter((sibling) => sibling.url && sibling.url !== item.url)
          .map((sibling) => sibling.url)

        // If current path starts with any sibling URL + '/', this is a sibling route, not a child
        const isSibling = siblingRoutes.some((siblingUrl: string) =>
          location.pathname.startsWith(siblingUrl + '/') || location.pathname === siblingUrl
        )

        return !isSibling
      }

      return false
    })()

    // Auto-expand if any child is active (computed directly, no useMemo needed)
    const hasActiveChild = (() => {
      if (!hasChildren) return false
      return item.children.some((child: any) => {
        // Exact match
        if (location.pathname === child.url) return true
        // Child route match
        if (location.pathname.startsWith(child.url + '/')) return true
        return false
      })
    })()

    return (
      <NavLink
        key={index}
        label={item.title}
        leftSection={item.icon ? <item.icon style={{ width: rem(16), height: rem(16) }} /> : undefined}
        rightSection={
          hasChildren ? (
            <IconChevronRight
              size={14}
              style={{
                width: rem(14),
                height: rem(14),
                transform: (isOpen || hasActiveChild) ? 'rotate(90deg)' : 'none',
                transition: 'transform 200ms ease',
              }}
            />
          ) : null
        }
        href={item.url || undefined}
        component={item.url ? Link : undefined}
        to={item.url || undefined}
        childrenOffset={28}
        defaultOpened={isActive || isOpen || hasActiveChild}
        onClick={hasChildren ? () => toggleSection(item.title) : undefined}
        active={isActive}
        styles={(theme) => ({
          root: {
            backgroundColor: isActive
              ? 'light-dark(var(--mantine-color-red-0), var(--mantine-color-dark-8))'
              : 'transparent',
            color: isActive
              ? 'light-dark(var(--mantine-color-red-filled), var(--mantine-color-red-5))'
              : 'inherit',
            fontWeight: isActive ? 600 : 400,
            '&:hover': {
              backgroundColor: !isActive
                ? 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))'
                : undefined,
            },
          },
          label: {
            fontSize: '0.875rem',
          },
        })}
      >
        {hasChildren &&
          item.children.map((child: any, childIndex: number) => {
            // Smart child matching (computed directly, no useMemo needed)
            const isChildActive = (() => {
              // Exact match
              if (location.pathname === child.url) return true
              // Child route match (e.g., /admin/users/roles matches /admin/users/roles/create)
              if (location.pathname.startsWith(child.url + '/')) return true
              return false
            })()

            return (
              <NavLink
                key={childIndex}
                label={child.title}
                href={child.url}
                component={Link}
                to={child.url}
                active={isChildActive}
                styles={(theme) => ({
                  root: {
                    backgroundColor: isChildActive
                      ? 'light-dark(var(--mantine-color-red-0), var(--mantine-color-dark-8))'
                      : 'transparent',
                    color: isChildActive
                      ? 'light-dark(var(--mantine-color-red-filled), var(--mantine-color-red-5))'
                      : 'inherit',
                    fontWeight: isChildActive ? 600 : 400,
                    '&:hover': {
                      backgroundColor: !isChildActive
                        ? 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))'
                        : undefined,
                    },
                  },
                  label: {
                    fontSize: '0.875rem',
                  },
                })}
              />
            )
          })}
      </NavLink>
    )
  }

  const sidebarContent = (
    <>
      {/* Header */}
      <Box
        p="md"
        ml="calc(var(--mantine-spacing-md) * -1)"
        mr="calc(var(--mantine-spacing-md) * -1)"
        mt="calc(var(--mantine-spacing-md) * -1)"
        style={{ borderBottom: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))' }}
      >
        <Group justify="space-between">
          <Link to="/admin/dashboard" style={{ textDecoration: 'none' }}>
            <Group gap="xs">
              <IconInnerShadowTop size={24} style={{ color: 'var(--mantine-color-red-filled)' }} />
              <Text fw={700} size="lg" c="light-dark(var(--mantine-color-dark-0), var(--mantine-color-dark-0))">
                {t("common.appName")}
              </Text>
            </Group>
          </Link>
          {isMobile && (
            <ActionIcon onClick={toggleMobile} variant="subtle">
              <IconChevronRight size={20} />
            </ActionIcon>
          )}
        </Group>
      </Box>

      {/* Navigation Links */}
      <ScrollArea
        style={{ flex: 1, marginLeft: 'calc(var(--mantine-spacing-md) * -1)', marginRight: 'calc(var(--mantine-spacing-md) * -1)' }}
      >
        <Box p="md">
          {filteredNavItems.map((section, sectionIndex) => (
            <Box key={sectionIndex} mb="xl">
              {section.label && (
                <Text
                  size="xs"
                  fw={700}
                  c="dimmed"
                  mb="xs"
                  style={{
                    paddingLeft: 'var(--mantine-spacing-md)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {section.label}
                </Text>
              )}
              {section.items.map((item, itemIndex) => renderNavLink(item, itemIndex, section.items))}
            </Box>
          ))}
        </Box>
      </ScrollArea>

      {/* Footer - Search & User */}
      <Box
        ml="calc(var(--mantine-spacing-md) * -1)"
        mr="calc(var(--mantine-spacing-md) * -1)"
        style={{ borderTop: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))' }}
      >
        {/* Search */}
        <Box px={{ base: 'md', md: 'md' }} pt={{ base: 'sm', md: 'md' }} pb="xs">
          <TextInput
            placeholder="Search menu items..."
            leftSection={<IconSearch size={16} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.currentTarget.value)}
          />
        </Box>

        {/* User Profile */}
        <Box p="md" pt="xs">
          <Group>
            <Avatar src={data.user.avatar} radius="xl" color="red" alt={data.user.name}>
              {data.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box style={{ flex: 1 }}>
              <Text size="sm" fw={500} c="light-dark(var(--mantine-color-dark-9), var(--mantine-color-dark-0))">
                {data.user.name}
              </Text>
              <Text size="xs" c="dimmed">
                {data.user.email}
              </Text>
            </Box>
          </Group>
        </Box>
      </Box>
    </>
  )

  // Mobile: Drawer
  if (isMobile) {
    return (
      <Drawer
        opened={mobileOpened}
        onClose={toggleMobile}
        size={280}
        padding={0}
        withCloseButton={false}
        styles={{
          body: { padding: 0 },
          content: {
            backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
          },
        }}
      >
        <Box
          h="100vh"
          display="flex"
          style={{ flexDirection: 'column' }}
        >
          {sidebarContent}
        </Box>
      </Drawer>
    )
  }

  // Desktop: Persistent Sidebar
  return (
    <Box
      bg="light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))"
      h="100vh"
      w={desktopOpened ? rem(280) : rem(0)}
      p={desktopOpened ? 'var(--mantine-spacing-md)' : 0}
      display="flex"
      style={{ flexDirection: 'column', overflow: 'hidden', transition: 'width 200ms ease' }}
      bd={desktopOpened ? '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))' : undefined}
    >
      {sidebarContent}
    </Box>
  )
}
