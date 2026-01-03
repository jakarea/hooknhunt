import { create } from 'zustand'

export interface Role {
  id: number
  name: string
  slug: string
  description?: string
}

export interface Permission {
  id: number
  name: string
  slug: string
  group_name?: string
}

export interface User {
  id: number
  name: string
  email: string
  phone_number: string
  whatsapp_number?: string
  otp_code?: string
  otp_expires_at?: string
  phone_verified_at?: string
  created_at: string
  updated_at: string
  role?: Role
  role_id?: number
}

interface AuthState {
  user: User | null
  token: string | null
  permissions: string[] // Array of permission slugs
  hydrated: boolean // Track if we've loaded from localStorage
  isAuthenticated: () => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (roleSlug: string) => boolean
  isSuperAdmin: () => boolean
  login: (token: string, user: User, permissions?: string[]) => void
  setPermissions: (permissions: string[]) => void
  logout: () => void
  loadUserFromStorage: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  permissions: [],
  hydrated: false,
  isAuthenticated: () => !!get().token, // Check for both null and undefined

  // Permission checking methods
  hasPermission: (permission: string) => {
    const { permissions, user } = get()
    // Super admin has all permissions
    if (user?.role?.slug === 'super_admin') return true
    return permissions.includes(permission)
  },

  hasAnyPermission: (permissions: string[]) => {
    const { permissions: userPermissions, user } = get()
    // Super admin has all permissions
    if (user?.role?.slug === 'super_admin') return true
    return permissions.some(p => userPermissions.includes(p))
  },

  hasAllPermissions: (permissions: string[]) => {
    const { permissions: userPermissions, user } = get()
    // Super admin has all permissions
    if (user?.role?.slug === 'super_admin') return true
    return permissions.every(p => userPermissions.includes(p))
  },

  hasRole: (roleSlug: string) => {
    const { user } = get()
    return user?.role?.slug === roleSlug
  },

  isSuperAdmin: () => {
    const { user } = get()
    return user?.role?.slug === 'super_admin'
  },

  login: (token, user, permissions = []) => {
    // Save to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('permissions', JSON.stringify(permissions))

    // Set state
    set({ user, token, permissions, hydrated: true })
  },

  setPermissions: (permissions: string[]) => {
    localStorage.setItem('permissions', JSON.stringify(permissions))
    set({ permissions })
  },

  logout: () => {
    // Clear from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')

    // Clear state
    set({ user: null, token: null, permissions: [], hydrated: true })

    // Redirect to login
    window.location.href = '/login'
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem('token')
    const userString = localStorage.getItem('user')
    const permissionsString = localStorage.getItem('permissions')

    if (token && userString) {
      try {
        const user = JSON.parse(userString) as User
        const permissions = permissionsString ? JSON.parse(permissionsString) : []
        set({ user, token, permissions, hydrated: true })
      } catch (error) {
        // Clear corrupted storage
        set({ hydrated: true })
        get().logout()
      }
    } else {
      set({ hydrated: true })
    }
  },

  setUser: (user) => {
    // Update user in both state and localStorage
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

// Load from storage immediately when the store is created (outside React lifecycle)
useAuthStore.getState().loadUserFromStorage()
