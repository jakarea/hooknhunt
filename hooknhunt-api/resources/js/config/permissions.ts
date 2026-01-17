/**
 * ROUTE TO PERMISSION MAPPING
 * Dynamic - All permissions come from database
 */

// DO NOT HARDCODE PERMISSIONS!
// All permissions should come from database dynamically
// This file now only defines which routes require which permissions

// ============================================================
// ROUTE PERMISSIONS (from Database)
// ============================================================
export const ROUTE_PERMISSIONS: Record<string, string> = {
  // USER & ACCESS
  '/users': 'user.index',
  '/users/create': 'user.create',
  '/hrm/roles': 'role.index',
  '/hrm/roles/create': 'role.create',
  '/hrm/permissions': 'permission.index',

  // HRM
  '/hrm/staff': 'employee.index',
  '/hrm/staff/create': 'employee.create',
  '/hrm/departments': 'department.index',
  '/hrm/leaves': 'leave.index',
  '/hrm/attendance': 'attendance.index',
  '/hrm/payroll': 'payroll.index',

  // PRODUCTS
  '/catalog/products': 'product.index',
  '/catalog/products/create': 'product.create',
  '/catalog/variants': 'variant.index',
  '/catalog/categories': 'category.index',
  '/catalog/ brands': 'brand.index',
  '/catalog/attributes': 'attribute.index',
  '/catalog/units': 'unit.index',

  // INVENTORY
  '/inventory/stock': 'stock.index',
  '/inventory/warehouses': 'warehouse.index',

  // FINANCE (All from database)
  '/finance': 'finance.dashboard.index',
  '/finance/banks': 'finance.banks.index',
  '/finance/banks/create': 'finance.banks.create',
  '/finance/banks/edit': 'finance.banks.edit',
  '/finance/banks/deposit': 'finance.banks.deposit',
  '/finance/banks/withdraw': 'finance.banks.withdraw',
  '/finance/banks/transfer': 'finance.banks.transfer',
  '/finance/transactions': 'finance.transactions.index',
  '/finance/transactions/create': 'finance.transactions.create',
  '/finance/transactions/edit': 'finance.transactions.edit',
  '/finance/transactions/approve': 'finance.transactions.approve',
  '/finance/transactions/reject': 'finance.transactions.reject',
  '/finance/expenses': 'finance.expenses.index',
  '/finance/expenses/create': 'finance.expenses.create',
  '/finance/expenses/edit': 'finance.expenses.edit',
  '/finance/expenses/approve': 'finance.expenses.approve',
  '/finance/expenses/reject': 'finance.expenses.reject',
  '/finance/accounts': 'finance.accounts.index',
  '/finance/accounts/create': 'finance.accounts.create',
  '/finance/accounts/edit': 'finance.accounts.edit',

  // REPORTS (from database)
  '/finance/reports': 'finance.reports.index',
  '/finance/reports/profit-loss': 'finance.reports.profit-loss',
  '/finance/reports/balance-sheet': 'finance.reports.balance-sheet',
  '/finance/reports/cash-flow': 'finance.reports.cash-flow',
  '/finance/reports/trial-balance': 'finance.reports.trial-balance',
  '/finance/reports/general-ledger': 'finance.reports.general-ledger',

  // DAILY REPORTS (from database)
  '/finance/daily-reports': 'finance.daily-reports.index',
  '/finance/daily-reports/generate': 'finance.daily-reports.generate',
  '/finance/daily-reports/regenerate': 'finance.daily-reports.regenerate',
  '/finance/daily-reports/delete': 'finance.daily-reports.delete',

  // SALES
  '/sales/orders': 'order.index',
  '/sales/create': 'order.create',
}

/**
 * Helper function to get permission for a route
 */
export function getRoutePermission(route: string): string | null {
  // Exact match
  if (ROUTE_PERMISSIONS[route]) {
    return ROUTE_PERMISSIONS[route]
  }

  // Pattern matching for dynamic routes (e.g., /hrm/staff/123/edit)
  const patterns = [
    { pattern: /\/hrm\/employees\/\d+\/edit/, permission: 'employee.edit' },
    { pattern: /\/hrm\/employees\/\d+/, permission: 'employee.view' },
    { pattern: /\/hrm\/roles\/\d+\/edit/, permission: 'role.edit' },
    { pattern: /\/catalog\/products\/\d+\/edit/, permission: 'product.edit' },
    { pattern: /\/catalog\/products\/\d+/, permission: 'product.index' },
  ]

  for (const { pattern, permission } of patterns) {
    if (pattern.test(route)) {
      return permission
    }
  }

  return null
}

export type RoutePermission = typeof ROUTE_PERMISSIONS
