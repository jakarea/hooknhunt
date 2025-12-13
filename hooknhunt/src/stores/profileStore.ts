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

export const useProfileStore = create<ProfileState>((set, get) => ({
  user: null,
  loading: false,
  updating: false,
  error: null,
  validationErrors: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getMe();

      // Check both possible response structures: {data: {user: ...}} or {user: ...}
      const user = response.data?.user || response.user;

      if (user) {
        set({ user, loading: false });
      } else {
        throw new Error('Failed to fetch profile - no user data in response');
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch profile',
        loading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ updating: true, error: null, validationErrors: null });
    try {
      const response = await api.updateProfile(data);

      if (response.data?.user) {
        set({
          user: response.data.user,
          updating: false,
          error: null,
          validationErrors: null,
        });
      }
    } catch (error: any) {
      // Handle validation errors
      if (error.status === 422 && error.errors) {
        set({
          validationErrors: error.errors,
          updating: false,
        });
      } else {
        set({
          error: error.message || 'Failed to update profile',
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
