import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  IconDashboard,
  IconUsersGroup,
  IconShield,
  IconSearch,
  IconInnerShadowTop,
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
  ActionIcon,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useAuthStore } from "@/stores/authStore"
import { usePermissions } from "@/hooks/usePermissions"

interface NavItem {
  title: string
  url?: string
  icon?: any
  children?: NavItem[]
}


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
}: AppSidebarMantineProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [searchValue, setSearchValue] = React.useState("")
  const [opened, setOpened] = React.useState<Record<string, boolean>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { canAccessRoute } = usePermissions()
  const user = useAuthStore((state) => state.user)

  const toggleSection = (label: string) => {
    setOpened((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const data = React.useMemo(() => ({
    user: {
      name: user?.name || "Admin",
      email: user?.email || "admin@hooknhunt.com",
      avatar: "/avatars/default.jpg",
    },
    navItems: [
      {
        label: t("nav.main"),
        items: [
          {
            title: t("nav.dashboard"),
            url: "/dashboard",
            icon: IconDashboard,
          },
          // {
          //   title: t("nav.analytics"),
          //   url: "/dashboard/analytics",
          //   icon: IconChartBar,
          // },
          // {
          //   title: t("nav.notifications"),
          //   url: "/notifications",
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
          //     { title: t("products.productList"), url: "/catalog/products" },
          //     { title: t("products.createProduct"), url: "/catalog/products/create" },
          //     { title: t("products.variants"), url: "/catalog/variants" },
          //     { title: t("products.categories"), url: "/catalog/categories" },
          //     { title: t("products.brands"), url: "/catalog/brands" },
          //     { title: t("products.attributes"), url: "/catalog/attributes" },
          //     { title: t("products.units"), url: "/catalog/units" },
          //     { title: t("products.printLabels"), url: "/catalog/print-labels" },
          //   ],
          // },
          // {
          //   title: t("nav.inventory"),
          //   icon: IconBuildingWarehouse,
          //   children: [
          //     { title: t("inventory.currentStock"), url: "/inventory/stock" },
          //     { title: t("inventory.sorting"), url: "/inventory/sorting" },
          //     { title: t("inventory.stockHistory"), url: "/inventory/history" },
          //     { title: t("inventory.adjustments"), url: "/inventory/adjustments" },
          //     { title: t("inventory.stockTake"), url: "/inventory/stock-take" },
          //     { title: t("inventory.warehouses"), url: "/inventory/warehouses" },
          //     { title: t("inventory.transfers"), url: "/inventory/transfers" },
          //   ],
          // },
          // {
          //   title: t("nav.procurement"),
          //   icon: IconShoppingCart,
          //   children: [
          //     { title: t("procurement.orders"), url: "/procurement/orders" },
          //     { title: t("procurement.createPO"), url: "/procurement/create" },
          //     { title: t("procurement.suppliers"), url: "/procurement/suppliers" },
          //     { title: t("procurement.returns"), url: "/procurement/returns" },
          //   ],
          // },
          // {
          //   title: t("nav.importShipments"),
          //   icon: IconShip,
          //   children: [
          //     { title: t("shipments.shipments"), url: "/shipments" },
          //     { title: t("shipments.create"), url: "/shipments/create" },
          //     { title: t("shipments.view"), url: "/shipments/view" },
          //     { title: t("shipments.costing"), url: "/shipments/costing" },
          //     { title: t("shipments.receiveStock"), url: "/shipments/receive" },
          //   ],
          // },
          // {
          //   title: t("nav.sales"),
          //   icon: IconReceipt,
          //   children: [
          //     { title: t("sales.orders"), url: "/sales/orders" },
          //     { title: t("sales.create"), url: "/sales/create" },
          //     { title: t("sales.returns"), url: "/sales/returns" },
          //     { title: t("sales.quotations"), url: "/sales/quotations" },
          //   ],
          // },
          // {
          //   title: t("nav.pos"),
          //   icon: IconCashRegister,
          //   children: [
          //     { title: t("pos.posTerminal"), url: "/pos" },
          //     { title: t("pos.history"), url: "/pos/history" },
          //     { title: t("pos.register"), url: "/pos/register" },
          //     { title: t("pos.held"), url: "/pos/held" },
          //   ],
          // },
          // {
          //   title: t("nav.crm"),
          //   icon: IconUsers,
          //   children: [
          //     { title: t("crm.customers"), url: "/crm/customers" },
          //     { title: t("crm.leads"), url: "/crm/leads" },
          //     { title: t("crm.wallet"), url: "/crm/wallet" },
          //     { title: t("crm.loyalty"), url: "/crm/loyalty" },
          //   ],
          // },
          {
            title: t("nav.hrm"),
            icon: IconUsersGroup,
            children: [
              { title: t("hrm.employees"), url: "/hrm/employees" },
              { title: t("hrm.departments"), url: "/hrm/departments" },
              { title: t("hrm.leaves"), url: "/hrm/leaves" },
              { title: t("hrm.attendance"), url: "/hrm/attendance" },
              { title: t("hrm.payroll"), url: "/hrm/payroll" },
              { title: t("settings.roles"), url: "/hrm/roles" },
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
          //     { title: t("logistics.booking"), url: "/logistics/booking" },
          //     { title: t("logistics.tracking"), url: "/logistics/tracking" },
          //     { title: t("logistics.couriers"), url: "/logistics/couriers" },
          //     { title: t("logistics.zones"), url: "/logistics/zones" },
          //   ],
          // },
          // {
          //   title: t("nav.marketing"),
          //   icon: IconChartBar,
          //   children: [
          //     { title: t("marketing.campaigns"), url: "/marketing/campaigns" },
          //     { title: t("marketing.affiliates"), url: "/marketing/affiliates" },
          //   ],
          // },
          // {
          //   title: t("nav.finance"),
          //   icon: IconCoin,
          //   children: [
          //     { title: t("finance.transactions"), url: "/finance/transactions" },
          //     { title: t("finance.expenses"), url: "/finance/expenses" },
          //     { title: t("finance.accounts"), url: "/finance/accounts" },
          //     { title: t("finance.reports"), url: "/finance/reports/pl" },
          //   ],
          // },
          // {
          //   title: t("nav.reports"),
          //   icon: IconChartPie,
          //   children: [
          //     { title: t("reports.sales"), url: "/reports/sales" },
          //     { title: t("reports.stock"), url: "/reports/stock" },
          //     { title: t("reports.products"), url: "/reports/products" },
          //     { title: t("reports.customers"), url: "/reports/customers" },
          //     { title: t("reports.tax"), url: "/reports/tax" },
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
          //     { title: t("support.tickets"), url: "/support/tickets" },
          //     { title: t("support.categories"), url: "/support/categories" },
          //   ],
          // },
          // {
          //   title: t("nav.cms"),
          //   icon: IconBell,
          //   children: [
          //     { title: t("cms.banners"), url: "/cms/banners" },
          //     { title: t("cms.menus"), url: "/cms/menus" },
          //     { title: t("cms.pages"), url: "/cms/pages" },
          //     { title: t("cms.blog"), url: "/cms/blog" },
          //     { title: t("cms.media"), url: "/cms/media" },
          //   ],
          // },
          
          {
            title: t("settings.permissions"),
            url: "/settings/permissions",
            icon: IconShield,
          },
          // {
          //   title: t("settings.auditLogs"),
          //   url: "/audit-logs",
          //   icon: IconShield,
          // },
          // {
          //   title: t("settings.general"),
          //   url: "/settings/general",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.payments"),
          //   url: "/settings/payments",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.taxes"),
          //   url: "/settings/taxes",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.apiKeys"),
          //   url: "/settings/api",
          //   icon: IconSettings,
          // },
          // {
          //   title: t("settings.backup"),
          //   url: "/settings/backup",
          //   icon: IconSettings,
          // },
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
        const permittedItems = section.items.filter((item: NavItem) => {
          // Check if user has access to the item's URL
          if ('url' in item && item.url && !canAccessRoute(item.url)) {
            return false
          }

          // For items with children, filter children based on permissions
          if ('children' in item && item.children) {
            const permittedChildren = item.children.filter((child) =>
              child.url ? canAccessRoute(child.url) : true
            )
            // Only show parent if it has accessible children or if the parent URL itself is accessible
            return permittedChildren.length > 0 || (('url' in item) && item.url && canAccessRoute(item.url))
          }

          return true
        })

        // For items with children, filter the children
        const itemsWithPermittedChildren = permittedItems.map((item: NavItem) => {
          if (!('children' in item) || !item.children) return item

          const permittedChildren = item.children.filter((child) =>
            child.url ? canAccessRoute(child.url) : true
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
        const filteredItems = section.items.filter((item: NavItem) => {
          const matchesTitle = item.title.toLowerCase().includes(query)

          // Check if any children match
          const hasMatchingChildren =
            ('children' in item && item.children) &&
            item.children.some((child) => child.title.toLowerCase().includes(query))

          return matchesTitle || hasMatchingChildren
        })

        // For matching items, also filter their children
        const itemsWithFilteredChildren = filteredItems.map((item: NavItem) => {
          if (!('children' in item) || !item.children) return item

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
  }, [data.navItems, searchValue, canAccessRoute])

  const renderNavLink = (item: NavItem, index: number, allItems: NavItem[]) => {
    const hasChildren = 'children' in item && item.children && item.children.length > 0
    const isOpen = opened[item.title] || searchValue.trim() !== '' // Auto-expand when searching

    // Smart URL matching for active state (computed directly, no useMemo needed)
    const isActive = (() => {
      if (!('url' in item) || !item.url) return false

      // Exact match
      if (location.pathname === item.url) return true

      // Parent route match (e.g., /users matches /users/7 or /users/7/edit)
      // But only if the current path starts with the item URL + '/'
      if (location.pathname.startsWith(item.url + '/')) {
        // Check if this is a sibling route by comparing with ALL items at the same level
        const siblingRoutes = allItems
          .filter((sibling) => 'url' in sibling && sibling.url && sibling.url !== item.url)
          .map((sibling) => sibling.url)

        // If current path starts with any sibling URL + '/', this is a sibling route, not a child
        const isSibling = siblingRoutes.some((siblingUrl) =>
          siblingUrl && location.pathname.startsWith(siblingUrl + '/') || location.pathname === siblingUrl
        )

        return !isSibling
      }

      return false
    })()

    // Auto-expand if any child is active (computed directly, no useMemo needed)
    const hasActiveChild = (() => {
      if (!hasChildren) return false
      return Array.isArray(item.children) && item.children.some((child: any) => {
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
  to={('url' in item && item.url) || '/'}
        component={('url' in item) ? Link : undefined}
        childrenOffset={28}
        defaultOpened={isActive || isOpen || hasActiveChild}
        onClick={hasChildren ? () => toggleSection(item.title) : undefined}
        active={isActive}
        styles={() => ({
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
          Array.isArray(item.children) && item.children.map((child: NavItem, childIndex: number) => {
            // Smart child matching (computed directly, no useMemo needed)
            const isChildActive = (() => {
              // Exact match
              if (location.pathname === child.url) return true
              // Child route match (e.g., /users/roles matches /users/roles/create)
              if (location.pathname.startsWith(child.url + '/')) return true
              return false
            })()

            return (
              <NavLink
                key={childIndex}
                label={child.title}
                to={child.url || '/'}
                component={Link}
                active={isChildActive}
                styles={() => ({
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
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
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
