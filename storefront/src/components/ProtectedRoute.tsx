'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if we're certain the user is not authenticated
    // and we've completed the authentication check
    if (!isLoading && !isAuthenticated && !isRedirecting) {
      // Add a small delay to prevent flickering during page reload
      const timer = setTimeout(() => {
        setIsRedirecting(true);
        router.replace('/login');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router, isRedirecting]);

  // Show loading spinner while checking authentication or redirecting
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
