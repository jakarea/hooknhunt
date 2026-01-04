/**
 * ENHANCED PERMISSIONS HOOK
 * Provides permission checking with auto-refresh capability
 */

import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import api from '@/lib/api'
import { notifications } from '@mantine/notifications'
import { getRoutePermission } from '@/config/permissions'

export function usePermissions() {
  const {
    user,
    permissions,
    token,
    setPermissions,
    hasPermission: storeHasPermission,
    hasAnyPermission: storeHasAnyPermission,
    hasAllPermissions: storeHasAllPermissions,
    hasRole,
    isSuperAdmin,
  } = useAuthStore()

  /**
   * Refresh permissions from API
   * Call this when you suspect permissions might be stale
   */
  const refreshPermissions = useCallback(async () => {
    if (!user?.id || !token) {
      console.warn('Cannot refresh permissions: No user or token')
      return false
    }

    try {
      // Fetch fresh user data with permissions
      const response = await api.get(`/auth/me`)

      if (response.data?.data?.user) {
        const userData = response.data.data.user
        const rolePermissions = userData.role?.permissions || []
        const newPermissions = rolePermissions.map((p: any) => p.slug)

        // Update store
        setPermissions(newPermissions)

        console.log('✅ Permissions refreshed:', {
          total: newPermissions.length,
          permissions: newPermissions.slice(0, 5), // Show first 5
        })

        return true
      }
    } catch (error) {
      console.error('Failed to refresh permissions:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to refresh permissions',
        color: 'red',
      })
      return false
    }

    return false
  }, [user?.id, token, setPermissions])

  /**
   * Check if user has a specific permission
   * Super admins always have all permissions
   */
  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      // Super admins have all permissions
      if (isSuperAdmin()) {
        return true
      }

      if (typeof permission === 'string') {
        return storeHasPermission(permission)
      }
      // Array of permissions - check if user has any
      return storeHasAnyPermission(permission)
    },
    [storeHasPermission, storeHasAnyPermission, isSuperAdmin]
  )

  /**
   * Check if user can access a specific route
   * Super admins can access all routes
   */
  const canAccessRoute = useCallback(
    (route: string): boolean => {
      // Super admins can access all routes
      if (isSuperAdmin()) {
        return true
      }

      const requiredPermission = getRoutePermission(route)

      // No permission required = public route
      if (!requiredPermission) return true

      return hasPermission(requiredPermission)
    },
    [hasPermission, isSuperAdmin]
  )

  /**
   * Check if user can EDIT a specific employee's profile
   * Super admins can edit any profile
   * Users can always edit their own profile, otherwise need permission
   */
  const canEditProfile = useCallback(
    (targetUserId: number | string): boolean => {
      // Super admins can edit any profile
      if (isSuperAdmin()) {
        return true
      }

      // Convert to number if string
      const targetId = typeof targetUserId === 'string' ? parseInt(targetUserId) : targetUserId
      const currentUserId = user?.id

      // User can always edit their own profile
      if (currentUserId && currentUserId === targetId) {
        return true
      }

      // Otherwise, check for employee.edit permission
      return hasPermission('employee.edit')
    },
    [user?.id, hasPermission, isSuperAdmin]
  )

  /**
   * Check if user can VIEW a specific employee's profile
   * Super admins can view any profile
   * Users can always view their own profile, otherwise need permission
   */
  const canViewProfile = useCallback(
    (targetUserId: number | string): boolean => {
      // Super admins can view any profile
      if (isSuperAdmin()) {
        return true
      }

      // Convert to number if string
      const targetId = typeof targetUserId === 'string' ? parseInt(targetUserId) : targetUserId
      const currentUserId = user?.id

      // User can always view their own profile
      if (currentUserId && currentUserId === targetId) {
        return true
      }

      // Otherwise, check for employee.view permission (or employee.index)
      return hasPermission('employee.view') || hasPermission('employee.index')
    },
    [user?.id, hasPermission, isSuperAdmin]
  )

  /**
   * Check if user is viewing their own profile
   */
  const isOwnProfile = useCallback(
    (targetUserId: number | string): boolean => {
      const targetId = typeof targetUserId === 'string' ? parseInt(targetUserId) : targetUserId
      const currentUserId = user?.id
      return currentUserId !== undefined && currentUserId === targetId
    },
    [user?.id]
  )

  /**
   * Check if user has ALL specified permissions
   */
  const hasAllPermissions = useCallback(
    (perms: string[]): boolean => {
      return storeHasAllPermissions(perms)
    },
    [storeHasAllPermissions]
  )

  /**
   * Check if user has ANY of the specified permissions
   */
  const hasAnyPermission = useCallback(
    (perms: string[]): boolean => {
      return storeHasAnyPermission(perms)
    },
    [storeHasAnyPermission]
  )

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isSuperAdmin,
    canAccessRoute,
    canEditProfile,
    canViewProfile,
    isOwnProfile,
    refreshPermissions,
  }
}

/**
 * Hook to auto-refresh permissions on mount
 * Use this in apps that need up-to-date permissions
 */
export function useAutoRefreshPermissions(intervalMs: number = 5 * 60 * 1000) {
  const { refreshPermissions } = usePermissions()

  useEffect(() => {
    // Initial refresh
    refreshPermissions()

    // Set up interval
    const interval = setInterval(() => {
      refreshPermissions()
    }, intervalMs)

    return () => clearInterval(interval)
  }, [refreshPermissions, intervalMs])
}
