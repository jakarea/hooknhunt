import React from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Navigate } from 'react-router-dom';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  /**
   * If true, will hide content instead of redirecting to dashboard.
   * Useful for conditional UI elements (e.g., dropdown menu items, buttons).
   */
  hide?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children, hide = false }) => {
  const userRole = useAuthStore((state) => state.user?.role);

  console.log('🔐 RoleGuard checking permissions...');
  console.log('🔐 User role:', userRole);
  console.log('🔐 Allowed roles:', allowedRoles);
  console.log('🔐 Hide mode:', hide);

  if (!userRole) {
    if (hide) {
      console.log('❌ No user role found, hiding content');
      return null;
    }
    console.log('❌ No user role found, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    if (hide) {
      console.log('❌ User role not in allowed roles, hiding content');
      console.log('🔐 Role check failed:', { userRole, allowedRoles });
      return null;
    }
    console.log('❌ User role not in allowed roles, redirecting to dashboard');
    console.log('🔐 Role check failed:', { userRole, allowedRoles });
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ User has required permissions');
  return <>{children}</>;
};
