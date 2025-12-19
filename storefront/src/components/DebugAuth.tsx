'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface DebugInfo {
  token?: string;
  cachedUser?: string;
  tokenLength?: number;
  userFromAuth?: unknown;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  allLocalStorage?: Record<string, string>;
}

export default function DebugAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const cachedUser = localStorage.getItem('cached_user');

    setDebugInfo({
      token: token ? `${token.substring(0, 20)}... (length: ${token.length})` : 'NOT FOUND',
      cachedUser: cachedUser ? 'EXISTS' : 'NOT FOUND',
      tokenLength: token ? token.length : 0,
      userFromAuth: user,
      isAuthenticated,
      isLoading,
      allLocalStorage: { ...localStorage }
    });
  }, [user, isAuthenticated, isLoading]);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">🐛 Debug Auth Info</h4>
      <pre className="whitespace-pre-wrap break-words">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-xs"
      >
        Reload
      </button>
    </div>
  );
}