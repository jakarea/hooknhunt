import { useAuthStore } from '@/stores/authStore'

/**
 * Custom hook for checking user permissions
 * Provides easy access to permission checking methods
 */
export const usePermissions = () => {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isSuperAdmin } = useAuthStore()

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isSuperAdmin,
  }
}
