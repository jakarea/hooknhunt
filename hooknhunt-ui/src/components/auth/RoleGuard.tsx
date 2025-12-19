import { React } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles = [], fallback = null }: RoleGuardProps) {
  const { user } = useAuthStore();

  // If no roles specified, allow all authenticated users
  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has required role
  if (user && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }

  // Return fallback if user doesn't have access
  return <>{fallback}</>;
}