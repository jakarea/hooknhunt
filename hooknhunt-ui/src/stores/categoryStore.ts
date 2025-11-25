// src/stores/categoryStore.ts
import { create } from 'zustand';
import type { Category } from '@/types/category'; // Assuming this exists from 8.b.1
import apiClient from '@/lib/apiClient';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  addCategory: (data: CategoryFormData) => Promise<void>;
  updateCategory: (id: number, data: CategoryFormData) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

// Form data type
export type CategoryFormData = {
  name: string;
  slug: string;
  parent_id: number | null;
  image?: File;
};

export const useCategoryStore = create<CategoryState>((set: (fn: (state: CategoryState) => CategoryState) => void) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set((state: CategoryState) => ({ ...state, isLoading: true, error: null }));
    try {
      const response = await apiClient.get<{ data: Category[] }>('/admin/categories');
      set((state: CategoryState) => ({ ...state, categories: response.data.data, isLoading: false }));
    } catch (err: unknown) {
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch categories';
      set((state: CategoryState) => ({ ...state, error: errorMessage, isLoading: false }));
    }
  },

  addCategory: async (data: CategoryFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.parent_id) {
        formData.append('parent_id', data.parent_id.toString());
      }
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await apiClient.post<{ data: Category }>('/admin/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      set((state: CategoryState) => ({
        ...state,
        categories: [...state.categories, response.data.data],
      }));
    } catch (err: unknown) {
      console.error("Failed to add category:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to add category';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  updateCategory: async (id: number, data: CategoryFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('slug', data.slug);
      if (data.parent_id) {
        formData.append('parent_id', data.parent_id.toString());
      }
      if (data.image) {
        formData.append('image', data.image);
      }

      const response = await apiClient.post<{ data: Category }>(`/admin/categories/${id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const updatedCategory = response.data.data;
      set((state: CategoryState) => ({
        ...state,
        categories: state.categories.map((cat: Category) =>
          cat.id === id ? updatedCategory : cat
        ),
      }));
    } catch (err: unknown) {
      console.error("Failed to update category:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to update category';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },

  deleteCategory: async (id: number) => {
    try {
      await apiClient.delete(`/admin/categories/${id}`);
      set((state: CategoryState) => ({
        ...state,
        categories: state.categories.filter((cat: Category) => cat.id !== id),
      }));
    } catch (err: unknown) {
      console.error("Failed to delete category:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'Failed to delete category';
      const apiError = err as ApiErrorResponse;
      throw new Error(apiError?.response?.data?.message || errorMessage);
    }
  },
}));
