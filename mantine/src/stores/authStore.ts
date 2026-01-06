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
  permissionObjects: Permission[] // Array of full permission objects with group_name
  hydrated: boolean // Track if we've loaded from localStorage
  isAuthenticated: () => boolean
  hasPermission: (permission: string) => boolean
  hasAnyPermission: (permissions: string[]) => boolean
  hasAllPermissions: (permissions: string[]) => boolean
  hasRole: (roleSlug: string) => boolean
  isSuperAdmin: () => boolean
  hasAccessToGroup: (groupName: string) => boolean
  getPermissionGroups: () => string[]
  login: (token: string, user: User, permissions?: string[], permissionObjects?: Permission[]) => void
  setPermissions: (permissions: string[], permissionObjects?: Permission[]) => void
  logout: () => void
  loadUserFromStorage: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  permissions: [],
  permissionObjects: [],
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

  // Check if user has access to any permission in a group
  hasAccessToGroup: (groupName: string) => {
    const { permissionObjects, user } = get()
    // Super admin has access to all groups
    if (user?.role?.slug === 'super_admin') return true
    return permissionObjects.some(p => p.group_name === groupName)
  },

  // Get all unique permission groups the user has access to
  getPermissionGroups: () => {
    const { permissionObjects, user } = get()
    // Super admin has access to all groups
    if (user?.role?.slug === 'super_admin') return ['Dashboard', 'HRM', 'Operations', 'Finance', 'Settings']
    const groups = new Set(permissionObjects.map(p => p.group_name).filter((g): g is string => Boolean(g)))
    return Array.from(groups)
  },

  login: (token, user, permissions = [], permissionObjects = []) => {
    // Save to localStorage
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('permissions', JSON.stringify(permissions))
    localStorage.setItem('permissionObjects', JSON.stringify(permissionObjects))

    // Set state
    set({ user, token, permissions, permissionObjects, hydrated: true })
  },

  setPermissions: (permissions: string[], permissionObjects = []) => {
    localStorage.setItem('permissions', JSON.stringify(permissions))
    localStorage.setItem('permissionObjects', JSON.stringify(permissionObjects))
    set({ permissions, permissionObjects })
  },

  logout: () => {
    // Clear from localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
    localStorage.removeItem('permissionObjects')

    // Clear state
    set({ user: null, token: null, permissions: [], permissionObjects: [], hydrated: true })

    // Redirect to login
    window.location.href = '/login'
  },

  loadUserFromStorage: () => {
    const token = localStorage.getItem('token')
    const userString = localStorage.getItem('user')
    const permissionsString = localStorage.getItem('permissions')
    const permissionObjectsString = localStorage.getItem('permissionObjects')

    if (token && userString) {
      try {
        const user = JSON.parse(userString) as User
        const permissions = permissionsString ? JSON.parse(permissionsString) : []
        const permissionObjects = permissionObjectsString ? JSON.parse(permissionObjectsString) : []
        set({ user, token, permissions, permissionObjects, hydrated: true })
      } catch {
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
