import { create } from 'zustand';
import api from '@/lib/api';

interface User {
  id: number;
  name: string | null;
  phone_number: string;
  email: string | null;
  whatsapp_number: string | null;
  role: string;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data?: {
    user?: T;
  };
  user?: T;
}

interface ApiError {
  status?: number;
  message?: string;
  errors?: Record<string, string[]>;
}

interface ProfileState {
  user: User | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  validationErrors: Record<string, string[]> | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'whatsapp_number'>>) => Promise<void>;
  clearErrors: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  user: null,
  loading: false,
  updating: false,
  error: null,
  validationErrors: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getMe() as ApiResponse<User> | { user: User };

      // Check both possible response structures: {data: {user: ...}} or {user: ...}
      const user = (response as ApiResponse<User>).data?.user || (response as { user: User }).user;

      if (user) {
        set({ user, loading: false });
      } else {
        throw new Error('Failed to fetch profile - no user data in response');
      }
    } catch (error: unknown) {
      const err = error as Error;
      set({
        error: err.message || 'Failed to fetch profile',
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ updating: true, error: null, validationErrors: null });
    try {
      const response = await api.updateProfile(data as { name?: string; email?: string; whatsapp_number?: string }) as ApiResponse<User>;

      if (response.data?.user) {
        set({
          user: response.data.user,
          updating: false,
          error: null,
          validationErrors: null,
        });
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.status === 422 && err.errors) {
        set({
          validationErrors: err.errors,
          updating: false,
        });
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
        set({
          error: errorMessage,
          updating: false,
        });
      }
      throw error;
    }
  },

  clearErrors: () => {
    set({ error: null, validationErrors: null });
  },
}));
