import { notifications } from '@mantine/notifications'
import { api } from '@/lib/api'

export type BankAccount = {
  id: number
  name: string
  type: 'cash' | 'bank' | 'bkash' | 'nagad' | 'rocket' | 'other'
  accountNumber?: string | null
  accountName?: string | null
  branch?: string | null
  currentBalance: number
  phone?: string | null
  status: 'active' | 'inactive'
  notes?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export type BankAccountFilter = {
  type?: 'all' | 'cash' | 'bank' | 'bkash' | 'nagad' | 'rocket' | 'other'
}

export type BankSummaryByType = {
  cash: { count: number; total_balance: number }
  bank: { count: number; total_balance: number }
  bkash: { count: number; total_balance: number }
  nagad: { count: number; total_balance: number }
  rocket: { count: number; total_balance: number }
}

export type BankSummary = {
  totalBalance: number
  accountCount: number
  byType: BankSummaryByType
}

export type BankFilters = {
  search?: string
  type?: BankAccountFilter['type']
  status?: 'active' | 'inactive'
}

// ============================================
// BANK ACCOUNTS API METHODS
// ============================================

/**
 * Get all bank accounts with optional filters
 * GET /api/v2/finance/banks
 */
export const getBanks = async (filters?: BankFilters) => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.type && filters.type !== 'all') params.append('type', filters.type)
  if (filters?.status) params.append('status', filters.status)

  const response = await api.get(`finance/banks?${params}`)
  return response.data
}

/**
 * Create a new bank account
 * POST /api/v2/finance/banks
 */
export const createBank = async (data: {
  name: string
  type: 'cash' | 'bank' | 'bkash' | 'nagad' | 'rocket' | 'other'
  account_number?: string
  account_name?: string
  branch?: string
  initial_balance?: number
  phone?: string
  notes?: string
}) => {
  const response = await api.post('finance/banks', data)
  return response.data
}

/**
 * Get single bank account by ID
 * GET /api/v2/finance/banks/{id}
 */
export const getBank = async (id: number) => {
  const response = await api.get(`finance/banks/${id}`)
  return response.data
}

/**
 * Update bank account
 * PUT/PATCH /api/v2/finance/banks/{id}
 */
export const updateBank = async (id: number, data: {
  name?: string
  type?: 'cash' | 'bank' | 'bkash' | 'nagad' | 'rocket' | 'other'
  account_number?: string
  account_name?: string
  branch?: string
  phone?: string
  notes?: string
  is_active?: boolean
}) => {
  const response = await api.put(`finance/banks/${id}`, data)
  return response.data
}

/**
 * Delete bank account
 * DELETE /api/v2/finance/banks/{id}
 */
export const deleteBank = async (id: number) => {
  const response = await api.delete(`finance/banks/${id}`)
  return response.data
}

/**
 * Get banks summary for dashboard
 * GET /api/v2/finance/banks/summary
 */
export const getBanksSummary = async () => {
  const response = await api.get('finance/banks/summary')
  return response.data
}

// ============================================
// BANK TRANSACTION API METHODS
// ============================================

export type BankTransaction = {
  id: number
  bank_id: number
  bank: {
    id: number
    name: string
    type: string
  }
  type: 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'
  amount: number
  balance_before: number
  balance_after: number
  reference_number?: string
  description: string
  transaction_date: string
  created_at: string
}

export type TransactionType = 'all' | 'deposit' | 'withdrawal' | 'transfer_in' | 'transfer_out'

export type TransactionFilters = {
  search?: string
  bank_id?: number | null
  type?: TransactionType
  start_date?: string
  end_date?: string
}

/**
 * Get all bank transactions
 * GET /api/v2/finance/bank-transactions
 */
export const getBankTransactions = async (filters?: TransactionFilters) => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.bank_id) params.append('bank_id', filters.bank_id)
  if (filters?.type && filters.type !== 'all') params.append('type', filters.type)
  if (filters?.start_date) params.append('start_date', filters.start_date)
  if (filters?.end_date) params.append('end_date', filters.end_date)

  const response = await api.get(`bank-transactions?${params}`)
  return response.data
}

/**
 * Create deposit transaction
 * POST /api/v2/finance/banks/{id}/deposit
 */
export const createDeposit = async (bankId: number, data: {
  amount: number
  transaction_date: string
  description?: string
  reference_number?: string
}) => {
  const response = await api.post(`finance/banks/${bankId}/deposit`, data)
  return response.data
}

/**
 * Create withdrawal transaction
 * POST /api/v2/finance/banks/{id}/withdraw
 */
export const createWithdrawal = async (bankId: number, data: {
  amount: number
  transaction_date: string
  account_id: number
  description?: string
  reference_number?: string
}) => {
  const response = await api.post(`finance/banks/${bankId}/withdraw`, data)
  return response.data
}

/**
 * Create transfer transaction
 * POST /api/v2/finance/banks/transfer
 */
export const createTransfer = async (fromBankId: number, data: {
  from_bank_id: number
  to_bank_id: number
  amount: number
  transaction_date: string
  description?: string
  reference_number?: string
}) => {
  const response = await api.post(`finance/banks/transfer`, { ...data, from_bank_id: fromBankId })
  return response.data
}

// ============================================
// CHART OF ACCOUNTS API METHODS
// ============================================

export type ChartOfAccount = {
  id: number
  name: string
  code: string
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'
  is_active: boolean
}

/**
 * Get all chart of accounts
 * GET /api/v2/finance/accounts
 */
export const getAccounts = async () => {
  const response = await api.get('finance/accounts')
  return response.data
}

// ============================================
// FINANCE DASHBOARD API METHODS
// ============================================

export type DashboardSummary = {
  banks_summary: {
    total_balance: number
    account_count: number
    by_type: BankSummaryByType
  }
  recent_transactions: BankTransaction[]
  expenses: {
    pending_count: number
    pending_amount: number
  }
  revenue_vs_expenses: {
    revenue: number
    expenses: number
    net_income: number
    start_date: string
    end_date: string
  }
}

/**
 * Get finance dashboard summary
 * GET /api/v2/finance/dashboard
 */
export const getFinanceDashboard = async () => {
  const response = await api.get('finance/dashboard')
  return response.data
}

// ============================================
// EXPENSES API METHODS
// ============================================

export type Expense = {
  id: number
  title: string
  amount: number
  expense_date: string
  is_approved: boolean
  account: {
    id: number
    name: string
    code: string
  }
  paid_by: {
    id: number
    name: string
  }
  reference_number?: string
  notes?: string
  created_at: string
  updated_at: string
}

export type ExpenseFilters = {
  search?: string
  account_id?: number
  is_approved?: boolean
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

/**
 * Get all expenses
 * GET /api/v2/finance/expenses
 */
export const getExpenses = async (filters?: ExpenseFilters) => {
  const params = new URLSearchParams()

  if (filters?.search) params.append('search', filters.search)
  if (filters?.account_id) params.append('account_id', filters.account_id)
  if (filters?.is_approved !== undefined) params.append('is_approved', filters.is_approved ? '1' : '0')
  if (filters?.start_date) params.append('start_date', filters.start_date)
  if (filters?.end_date) params.append('end_date', filters.end_date)

  // Pagination
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.per_page) params.append('per_page', filters.per_page.toString())

  const response = await api.get(`expenses?${params}`)
  return response.data
}

/**
 * Get single expense
 * GET /api/v2/finance/expenses/{id}
 */
export const getExpense = async (id: number) => {
  const response = await api.get(`expenses/${id}`)
  return response.data
}

/**
 * Create expense
 * POST /api/v2/finance/expenses
 */
export const createExpense = async (data: {
  title: string
  amount: number
  account_id: number
  expense_date: string
  reference_number?: string
  notes?: string
}) => {
  const response = await api.post('expenses', data)
  return response.data
}

/**
 * Approve expense
 * POST /api/v2/finance/expenses/{id}/approve
 */
export const approveExpense = async (id: number) => {
  const response = await api.post(`expenses/${id}/approve`)
  return response.data
}

/**
 * Update expense
 * PUT/PATCH /api/v2/finance/expenses/{id}
 */
export const updateExpense = async (id: number, data: {
  title?: string
  amount?: number
  account_id?: number
  expense_date?: string
  reference_number?: string
  notes?: string
}) => {
  const response = await api.put(`expenses/${id}`, data)
  return response.data
}

/**
 * Delete expense
 * DELETE /api/v2/finance/expenses/{id}
 */
const deleteExpense = async (id: number) => {
  const response = await api.delete(`expenses/${id}`)
  return response.data
}
