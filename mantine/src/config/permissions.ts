/**
 * CENTRAL PERMISSION CONFIGURATION
 * Single source of truth for all route-permission mappings
 *
 * HOW TO ADD NEW ROUTES:
 * 1. Add route to the appropriate section below
 * 2. That's it! No need to modify sidebar or individual components
 */

export const PERMISSION_CONFIG = {
  // ============================================================
  // USER & ACCESS MANAGEMENT
  // ============================================================
  users: {
    index: 'user.index',
    create: 'user.create',
    edit: 'user.edit',
    delete: 'user.delete',
    view: 'user.view',
    ban: 'user.ban',
    impersonate: 'user.impersonate',
  },

  roles: {
    index: 'role.index',
    create: 'role.create',
    edit: 'role.edit',
    delete: 'role.delete',
    assign: 'role.assign',
    viewPermissions: 'permission.index',
    assignPermissions: 'permission.assign',
  },

  // ============================================================
  // HRM MODULE
  // ============================================================
  employees: {
    index: 'employee.index',
    create: 'employee.create',
    edit: 'employee.edit',
    delete: 'employee.delete',
    view: 'employee.view',
  },

  departments: {
    index: 'department.index',
    create: 'department.create',
    edit: 'department.edit',
    delete: 'department.delete',
  },

  attendance: {
    index: 'attendance.index',
    create: 'attendance.create',
    edit: 'attendance.edit',
    approve: 'attendance.approve',
  },

  leaves: {
    index: 'leave.index',
    create: 'leave.create',
    approve: 'leave.approve',
    reject: 'leave.reject',
    cancel: 'leave.cancel',
  },

  payroll: {
    index: 'payroll.index',
    create: 'payroll.create',
    edit: 'payroll.edit',
    process: 'payroll.process',
    approve: 'payroll.approve',
  },

  // ============================================================
  // PRODUCT CATALOG
  // ============================================================
  products: {
    index: 'product.index',
    create: 'product.create',
    edit: 'product.edit',
    delete: 'product.delete',
    import: 'product.import',
    export: 'product.export',
  },

  variants: {
    index: 'variant.index',
    create: 'variant.create',
    edit: 'variant.edit',
    delete: 'variant.delete',
  },

  categories: {
    index: 'category.index',
    create: 'category.create',
    edit: 'category.edit',
    delete: 'category.delete',
  },

  brands: {
    index: 'brand.index',
    create: 'brand.create',
    edit: 'brand.edit',
    delete: 'brand.delete',
  },

  attributes: {
    index: 'attribute.index',
    create: 'attribute.create',
    edit: 'attribute.edit',
    delete: 'attribute.delete',
  },

  units: {
    index: 'unit.index',
    create: 'unit.create',
    edit: 'unit.edit',
    delete: 'unit.delete',
  },

  // ============================================================
  // INVENTORY
  // ============================================================
  stock: {
    index: 'stock.index',
    adjust: 'stock.adjust',
    transfer: 'stock.transfer',
  },

  warehouses: {
    index: 'warehouse.index',
    create: 'warehouse.create',
    edit: 'warehouse.edit',
    delete: 'warehouse.delete',
  },

  // ============================================================
  // SALES
  // ============================================================
  orders: {
    index: 'order.index',
    create: 'order.create',
    edit: 'order.edit',
    delete: 'order.delete',
    view: 'order.view',
    cancel: 'order.cancel',
    refund: 'order.refund',
  },

  // ============================================================
  // MODULE LEVEL PERMISSIONS (High-level access)
  // ============================================================
  modules: {
    product: 'product.manage',
    inventory: 'inventory.manage',
    sales: 'sales.manage',
    shipment: 'shipment.manage',
    supplier: 'supplier.manage',
    hrm: 'hrm.manage',
    crm: 'crm.manage',
    account: 'account.manage',
    support: 'support.manage',
    media: 'media.manage',
  },
} as const

/**
 * ROUTE TO PERMISSION MAPPING
 * Auto-generated from config above
 */
export const ROUTE_PERMISSIONS: Record<string, string> = {
  // USER & ACCESS
  '/users': PERMISSION_CONFIG.users.index,
  '/users/create': PERMISSION_CONFIG.users.create,
  '/hrm/roles': PERMISSION_CONFIG.roles.index,
  '/hrm/roles/create': PERMISSION_CONFIG.roles.create,
  '/hrm/permissions': PERMISSION_CONFIG.roles.viewPermissions,

  // HRM
  '/hrm/employees': PERMISSION_CONFIG.employees.index,
  '/hrm/employees/create': PERMISSION_CONFIG.employees.create,
  '/hrm/departments': PERMISSION_CONFIG.departments.index,
  '/hrm/leaves': PERMISSION_CONFIG.leaves.index,
  '/hrm/attendance': PERMISSION_CONFIG.attendance.index,
  '/hrm/payroll': PERMISSION_CONFIG.payroll.index,

  // PRODUCTS
  '/catalog/products': PERMISSION_CONFIG.products.index,
  '/catalog/products/create': PERMISSION_CONFIG.products.create,
  '/catalog/variants': PERMISSION_CONFIG.variants.index,
  '/catalog/categories': PERMISSION_CONFIG.categories.index,
  '/catalog/brands': PERMISSION_CONFIG.brands.index,
  '/catalog/attributes': PERMISSION_CONFIG.attributes.index,
  '/catalog/units': PERMISSION_CONFIG.units.index,

  // INVENTORY
  '/inventory/stock': PERMISSION_CONFIG.stock.index,
  '/inventory/warehouses': PERMISSION_CONFIG.warehouses.index,

  // SALES
  '/sales/orders': PERMISSION_CONFIG.orders.index,
  '/sales/create': PERMISSION_CONFIG.orders.create,
}

/**
 * Helper function to get permission for a route
 */
export function getRoutePermission(route: string): string | null {
  // Exact match
  if (ROUTE_PERMISSIONS[route]) {
    return ROUTE_PERMISSIONS[route]
  }

  // Pattern matching for dynamic routes (e.g., /hrm/employees/123/edit)
  const patterns = [
    { pattern: /\/hrm\/employees\/\d+\/edit/, permission: PERMISSION_CONFIG.employees.edit },
    { pattern: /\/hrm\/employees\/\d+/, permission: PERMISSION_CONFIG.employees.view },
    { pattern: /\/hrm\/roles\/\d+\/edit/, permission: PERMISSION_CONFIG.roles.edit },
    { pattern: /\/catalog\/products\/\d+\/edit/, permission: PERMISSION_CONFIG.products.edit },
    { pattern: /\/catalog\/products\/\d+/, permission: PERMISSION_CONFIG.products.index },
  ]

  for (const { pattern, permission } of patterns) {
    if (pattern.test(route)) {
      return permission
    }
  }

  return null
}

/**
 * Type exports for TypeScript
 */
export type PermissionKey = typeof PERMISSION_CONFIG
export type RoutePermission = typeof ROUTE_PERMISSIONS
