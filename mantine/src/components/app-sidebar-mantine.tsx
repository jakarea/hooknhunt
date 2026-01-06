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
  icon?: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
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
  const user = useAuthStore((state) => state.user)
  const { permissions, permissionObjects, isSuperAdmin } = usePermissions()

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
        label: t("nav.hrm"),
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
      //     {
      //       title: t("nav.inventory"),
      //       icon: IconBuildingWarehouse,
      //       children: [
      //         { title: t("inventory.currentStock"), url: "/inventory/stock" },
      //         { title: t("inventory.sorting"), url: "/inventory/sorting" },
      //         { title: t("inventory.stockHistory"), url: "/inventory/history" },
      //         { title: t("inventory.adjustments"), url: "/inventory/adjustments" },
      //         { title: t("inventory.stockTake"), url: "/inventory/stock-take" },
      //         { title: t("inventory.warehouses"), url: "/inventory/warehouses" },
      //         { title: t("inventory.transfers"), url: "/inventory/transfers" },
      //       ],
      //     },
      //     {
      //       title: t("nav.procurement"),
      //       icon: IconShoppingCart,
      //       children: [
      //         { title: t("procurement.orders"), url: "/procurement/orders" },
      //         { title: t("procurement.createPO"), url: "/procurement/create" },
      //         { title: t("procurement.suppliers"), url: "/procurement/suppliers" },
      //         { title: t("procurement.returns"), url: "/procurement/returns" },
      //       ],
      //     },
      //     {
      //       title: t("nav.importShipments"),
      //       icon: IconShip,
      //       children: [
      //         { title: t("shipments.shipments"), url: "/shipments" },
      //         { title: t("shipments.create"), url: "/shipments/create" },
      //         { title: t("shipments.view"), url: "/shipments/view" },
      //         { title: t("shipments.costing"), url: "/shipments/costing" },
      //         { title: t("shipments.receiveStock"), url: "/shipments/receive" },
      //       ],
      //     },
      //     {
      //       title: t("nav.sales"),
      //       icon: IconReceipt,
      //       children: [
      //         { title: t("sales.orders"), url: "/sales/orders" },
      //         { title: t("sales.create"), url: "/sales/create" },
      //         { title: t("sales.returns"), url: "/sales/returns" },
      //         { title: t("sales.quotations"), url: "/sales/quotations" },
      //       ],
      //     },
      //     {
      //       title: t("nav.pos"),
      //       icon: IconCashRegister,
      //       children: [
      //         { title: t("pos.posTerminal"), url: "/pos" },
      //         { title: t("pos.history"), url: "/pos/history" },
      //         { title: t("pos.register"), url: "/pos/register" },
      //         { title: t("pos.held"), url: "/pos/held" },
      //       ],
      //     },
      //     {
      //       title: t("nav.crm"),
      //       icon: IconUsers,
      //       children: [
      //         { title: t("crm.customers"), url: "/crm/customers" },
      //         { title: t("crm.leads"), url: "/crm/leads" },
      //         { title: t("crm.wallet"), url: "/crm/wallet" },
      //         { title: t("crm.loyalty"), url: "/crm/loyalty" },
      //       ],
      //     },
          {
            title: t("hrm.title"),
            icon: IconUsersGroup,
            children: [
              { title: t("hrm.staff"), url: "/hrm/staff" },
              { title: t("hrm.departments"), url: "/hrm/departments" },
              { title: t("hrm.leaves"), url: "/hrm/leaves" },
              { title: t("hrm.attendance"), url: "/hrm/attendance" },
              { title: t("hrm.payroll"), url: "/hrm/payroll" },
              { title: t("settings.roles"), url: "/hrm/roles" },
            ],
          },
      //   ],
      // },
      // {
      //   label: t("sections.financeReports"),
      //   items: [
      //     {
      //       title: t("nav.logistics"),
      //       icon: IconShip,
      //       children: [
      //         { title: t("logistics.booking"), url: "/logistics/booking" },
      //         { title: t("logistics.tracking"), url: "/logistics/tracking" },
      //         { title: t("logistics.couriers"), url: "/logistics/couriers" },
      //         { title: t("logistics.zones"), url: "/logistics/zones" },
      //       ],
      //     },
      //     {
      //       title: t("nav.marketing"),
      //       icon: IconChartBar,
      //       children: [
      //         { title: t("marketing.campaigns"), url: "/marketing/campaigns" },
      //         { title: t("marketing.affiliates"), url: "/marketing/affiliates" },
      //       ],
      //     },
      //     {
      //       title: t("nav.finance"),
      //       icon: IconCoin,
      //       children: [
      //         { title: t("finance.transactions"), url: "/finance/transactions" },
      //         { title: t("finance.expenses"), url: "/finance/expenses" },
      //         { title: t("finance.accounts"), url: "/finance/accounts" },
      //         { title: t("finance.reports"), url: "/finance/reports/pl" },
      //       ],
      //     },
      //     {
      //       title: t("nav.reports"),
      //       icon: IconChartPie,
      //       children: [
      //         { title: t("reports.sales"), url: "/reports/sales" },
      //         { title: t("reports.stock"), url: "/reports/stock" },
      //         { title: t("reports.products"), url: "/reports/products" },
      //         { title: t("reports.customers"), url: "/reports/customers" },
      //         { title: t("reports.tax"), url: "/reports/tax" },
      //       ],
      //     },
        ],
      },
      {
        label: t("nav.settings"),
        items: [
          {
            title: t("settings.permissions"),
            url: "/settings/permissions",
            icon: IconShield,
          },
        ],
      },
    ],
  }), [t])

  // Filter navigation items based on search only
  const filteredNavItems = React.useMemo(() => {

    // Super admins see everything - no permission filtering
    if (isSuperAdmin()) {
      let items = data.navItems

      // Still apply search filtering for super admins
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase()

        items = items
          .map((section) => {
            const filteredItems = section.items.filter((item: NavItem) => {
              const matchesTitle = item.title.toLowerCase().includes(query)
              const hasMatchingChildren =
                ('children' in item && item.children) &&
                item.children.some((child) => child.title.toLowerCase().includes(query))
              return matchesTitle || hasMatchingChildren
            })

            const itemsWithFilteredChildren = filteredItems.map((item: NavItem) => {
              if (!('children' in item) || !item.children) return item

              const filteredChildren = item.children.filter((child) =>
                child.title.toLowerCase().includes(query)
              )

              return { ...item, children: filteredChildren }
            })

            if (itemsWithFilteredChildren.length === 0) {
              return null
            }

            return { ...section, items: itemsWithFilteredChildren }
          })
          .filter((section): section is (typeof data.navItems)[0] => section !== null)
      }

      return items
    }

    // Create nested permissions object from permissionObjects
    const nestedPermissions: Record<string, Record<string, string[]>> = {};
    permissionObjects.forEach(perm => {
      const parts = perm.slug.split('.');
      if (parts.length >= 3) {
        const module = parts[0]; // hrm
        const resource = parts[1]; // attendance
        const action = parts[2]; // approve

        if (!nestedPermissions[module]) {
          nestedPermissions[module] = {};
        }
        if (!nestedPermissions[module][resource]) {
          nestedPermissions[module][resource] = [];
        }
        nestedPermissions[module][resource].push(action);
      }
    });

    console.log("Nested Permissions:", nestedPermissions)

    // Helper function to check if user has any permission for a given URL/path
    const hasPermissionForPath = (path: string): boolean => {
      // Remove leading slash and split
      const pathParts = path.replace(/^\//, '').split('/')

      // Map common paths to permission modules
      const pathToModuleMap: Record<string, string> = {
        'catalog': 'product',
        'inventory': 'inventory',
        'procurement': 'procurement',
        'shipments': 'shipment',
        'sales': 'sales',
        'pos': 'sales',
        'crm': 'crm',
        'hrm': 'hrm',
        'logistics': 'shipment',
        'marketing': 'crm',
        'finance': 'finance',
        'reports': 'report',
        'settings': 'system',
      }

      const firstPath = pathParts[0]
      const module = pathToModuleMap[firstPath] || firstPath

      // Check if user has any permissions for this module
      if (!nestedPermissions[module]) {
        return false
      }

      // For HRM, check specific resource permissions (staff, departments, leaves, etc.)
      if (module === 'hrm' && pathParts.length > 1) {
        // URL path to permission resource key mapping
        // The permission slugs use the resource name from the slug (e.g., hrm.departments.create)
        const resourceMap: Record<string, string> = {
          'staff': 'staff',
          'departments': 'departments',  // Keep as plural
          'leaves': 'leaves',            // Keep as plural
          'attendance': 'attendance',
          'payroll': 'payroll',
          'roles': 'roles',              // Keep as plural
        }

        const resource = resourceMap[pathParts[1]] || pathParts[1]

        // Check if user has permissions for this specific HRM resource
        return !!nestedPermissions[module][resource]
      }

      // For other modules, return true if they have any permission for the module
      return true
    }

    // Helper function to filter items based on permissions
    const filterItemsByPermissions = (items: NavItem[]): NavItem[] => {
      return items.filter((item) => {
        // If item has a URL, check permissions
        if ('url' in item && item.url) {
          // Always show dashboard, notifications, analytics (main section items)
          if (['/dashboard', '/notifications', '/dashboard/analytics'].includes(item.url)) {
            return true
          }
          return hasPermissionForPath(item.url)
        }

        // If item has children, filter children and check if any remain
        if ('children' in item && item.children && item.children.length > 0) {
          const filteredChildren = filterItemsByPermissions(item.children)
          // Keep parent item if it has any children after filtering
          if (filteredChildren.length > 0) {
            return true
          }
        }

        return false
      }).map((item) => {
        // If item has children, recursively filter them
        if ('children' in item && item.children && item.children.length > 0) {
          return {
            ...item,
            children: filterItemsByPermissions(item.children)
          }
        }
        return item
      })
    }

    // Apply permission filtering to all sections
    let items = data.navItems.map((section) => ({
      ...section,
      items: filterItemsByPermissions(section.items)
    })).filter((section) => section.items.length > 0)

    // If there's a search value, filter items
    if (searchValue.trim()) {
      const query = searchValue.toLowerCase()

      items = items
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
    }

    return items
  }, [data, data.navItems, searchValue, permissions, permissionObjects, isSuperAdmin])

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
      return Array.isArray(item.children) && item.children.some((child) => {
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
