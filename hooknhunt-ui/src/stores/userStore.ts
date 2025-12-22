import { create } from 'zustand';
import type { User, CreateUserData, UpdateUserData, PaginatedUsersResponse } from '@/types/user';
import apiClient from '@/lib/apiClient';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  } | null;
  fetchUsers: (page?: number) => Promise<void>;
  addUser: (data: CreateUserData) => Promise<User>;
  updateUser: (id: number, data: UpdateUserData) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  fetchUser: (id: number) => Promise<User>;
  verifyPhone: (id: number) => Promise<User>;
  unverifyPhone: (id: number) => Promise<User>;
  clearUsers: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchUsers: async (page = 1) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await apiClient.get<PaginatedUsersResponse>('/admin/users', {
        params: { page }
      });

      set((state) => ({
        ...state,
        users: response.data.data,
        pagination: {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to,
        },
        isLoading: false,
      }));
    } catch (err: unknown) {
      console.error("Failed to fetch users:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch users';
      const apiError = err as ApiErrorResponse;

      // Handle validation errors
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        set((state) => ({
          ...state,
          error: errorMessages.join(', '),
          isLoading: false,
        }));
      } else {
        set((state) => ({
          ...state,
          error: apiError?.response?.data?.message || errorMessage,
          isLoading: false,
        }));
      }
    }
  },

  addUser: async (data: CreateUserData) => {
    try {
      const response = await apiClient.post<User>('/admin/users', data);
      const newUser = response.data;

      set((state) => ({
        ...state,
        users: [newUser, ...state.users],
        total: state.pagination ? state.pagination.total + 1 : state.users.length + 1,
      }));

      return newUser;
    } catch (err: unknown) {
      console.error("Failed to add user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to add user';
      const apiError = err as ApiErrorResponse;

      // Handle validation errors
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }

      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  updateUser: async (id: number, data: UpdateUserData) => {
    try {
      // Create FormData for file uploads (if needed in future)
      const formData = new FormData();

      // Add all fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'password' && !value) {
            // Skip empty password
            return;
          }
          formData.append(key, value.toString());
        }
      });

      const response = await apiClient.post<User>(`/admin/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT',
        },
        params: {
          _method: 'PUT'
        }
      });

      const updatedUser = response.data;

      set((state) => ({
        ...state,
        users: state.users.map((user) =>
          user.id === id ? updatedUser : user
        ),
      }));

      return updatedUser;
    } catch (err: unknown) {
      console.error("Failed to update user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to update user';
      const apiError = err as ApiErrorResponse;

      // Handle validation errors
      if (apiError?.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        throw new Error(errorMessages.join(', '));
      }

      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  deleteUser: async (id: number) => {
    try {
      await apiClient.delete(`/admin/users/${id}`);

      set((state) => ({
        ...state,
        users: state.users.filter((user) => user.id !== id),
        total: state.pagination ? state.pagination.total - 1 : state.users.length - 1,
      }));
    } catch (err: unknown) {
      console.error("Failed to delete user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete user';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  fetchUser: async (id: number) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await apiClient.get<User>(`/admin/users/${id}`);

      set((state) => ({
        ...state,
        currentUser: response.data,
        isLoading: false,
      }));

      return response.data;
    } catch (err: unknown) {
      console.error("Failed to fetch user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch user';
      const apiError = err as ApiErrorResponse;
      set((state) => ({
        ...state,
        error: apiError?.response?.data?.message || errorMessage,
        isLoading: false,
      }));
      throw err;
    }
  },

  verifyPhone: async (id: number) => {
    try {
      const response = await apiClient.post<{message: string, user: User}>(`/admin/users/${id}/verify-phone`);
      const updatedUser = response.data.user;

      set((state) => ({
        ...state,
        users: state.users.map((user) =>
          user.id === id ? updatedUser : user
        ),
      }));

      return updatedUser;
    } catch (err: unknown) {
      console.error("Failed to verify user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to verify user';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  unverifyPhone: async (id: number) => {
    try {
      const response = await apiClient.post<{message: string, user: User}>(`/admin/users/${id}/unverify-phone`);
      const updatedUser = response.data.user;

      set((state) => ({
        ...state,
        users: state.users.map((user) =>
          user.id === id ? updatedUser : user
        ),
      }));

      return updatedUser;
    } catch (err: unknown) {
      console.error("Failed to unverify user:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to unverify user';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  clearUsers: () => {
    set({
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
      pagination: null,
    });
  },
}));