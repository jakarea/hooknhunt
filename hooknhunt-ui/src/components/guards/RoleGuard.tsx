import React from 'react';
import { useAuthStore } from '@/stores/authStore';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const userRole = useAuthStore((state) => state.user?.role);

  if (!userRole || !allowedRoles.includes(userRole)) {
    return null; // Or render a "Not Authorized" message
  }

  return <>{children}</>;
};
