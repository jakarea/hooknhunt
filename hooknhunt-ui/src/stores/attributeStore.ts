import { create } from 'zustand';
import apiClient from '@/lib/apiClient';

export interface AttributeOption {
  id: number;
  attribute_id: number;
  value: string;
  display_value?: string;
  color_code?: string;
  image_url?: string;
  sort_order?: number;
  is_default?: boolean;
}

export interface Attribute {
  id: number;
  name: string;
  display_name?: string;
  type?: 'select' | 'color' | 'image';
  is_required?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  options?: AttributeOption[];
}

export interface CreateAttributeData {
  name: string;
  display_name?: string;
  type?: 'select' | 'color' | 'image';
  is_required?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface UpdateAttributeData {
  name?: string;
  display_name?: string;
  type?: 'select' | 'color' | 'image';
  is_required?: boolean;
  is_visible?: boolean;
  sort_order?: number;
}

export interface CreateOptionData {
  attribute_id: number;
  value: string;
  display_value?: string;
  color_code?: string;
  image?: File;
  sort_order?: number;
  is_default?: boolean;
}

export interface UpdateOptionData {
  value?: string;
  display_value?: string;
  color_code?: string;
  image?: File;
  sort_order?: number;
  is_default?: boolean;
}

interface AttributeState {
  attributes: Attribute[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchAttributes: (visibleOnly?: boolean) => Promise<void>;
  createAttribute: (data: CreateAttributeData) => Promise<Attribute>;
  updateAttribute: (id: number, data: UpdateAttributeData) => Promise<void>;
  deleteAttribute: (id: number) => Promise<void>;
  reorderAttributes: (reorderedIds: { id: number; sort_order: number }[]) => Promise<void>;

  // Attribute Options Actions
  addOption: (data: CreateOptionData) => Promise<void>;
  updateOption: (optionId: number, data: UpdateOptionData) => Promise<void>;
  deleteOption: (attributeId: number, optionId: number) => Promise<void>;
  reorderOptions: (reorderedIds: { id: number; sort_order: number }[]) => Promise<void>;
}

export const useAttributeStore = create<AttributeState>((set, get) => ({
  attributes: [],
  loading: false,
  error: null,

  fetchAttributes: async (visibleOnly = false) => {
    set({ loading: true, error: null });
    try {
      const params = visibleOnly ? { visible_only: 1, all: 1 } : { all: 1 };
      const response = await apiClient.get('/admin/attributes', { params });
      const data = response.data.data || response.data;
      set({ attributes: data, loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch attributes',
        loading: false,
      });
      throw error;
    }
  },

  createAttribute: async (data: CreateAttributeData) => {
    try {
      const response = await apiClient.post('/admin/attributes', data);
      const newAttribute = response.data;

      set((state) => ({
        attributes: [...state.attributes, newAttribute],
      }));

      return newAttribute;
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.name?.[0] || error.response?.data?.message || 'Failed to create attribute';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateAttribute: async (id: number, data: UpdateAttributeData) => {
    try {
      const response = await apiClient.put(`/admin/attributes/${id}`, data);
      const updatedAttribute = response.data;

      set((state) => ({
        attributes: state.attributes.map((attr) =>
          attr.id === id ? updatedAttribute : attr
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.errors?.name?.[0] || error.response?.data?.message || 'Failed to update attribute';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteAttribute: async (id: number) => {
    try {
      await apiClient.delete(`/admin/attributes/${id}`);

      set((state) => ({
        attributes: state.attributes.filter((attr) => attr.id !== id),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete attribute';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  reorderAttributes: async (reorderedIds: { id: number; sort_order: number }[]) => {
    try {
      await apiClient.post('/admin/attributes/reorder', {
        attributes: reorderedIds,
      });

      // Optimistically update local state
      set((state) => ({
        attributes: state.attributes.map((attr) => {
          const reordered = reorderedIds.find((r) => r.id === attr.id);
          return reordered ? { ...attr, sort_order: reordered.sort_order } : attr;
        }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reorder attributes';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  // Attribute Options
  addOption: async (data: CreateOptionData) => {
    try {
      const formData = new FormData();
      formData.append('attribute_id', data.attribute_id.toString());
      formData.append('value', data.value);

      if (data.display_value) formData.append('display_value', data.display_value);
      if (data.color_code) formData.append('color_code', data.color_code);
      if (data.image) formData.append('image', data.image);
      if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
      if (data.is_default !== undefined) formData.append('is_default', data.is_default ? '1' : '0');

      const response = await apiClient.post('/admin/attribute-options', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newOption = response.data;

      set((state) => ({
        attributes: state.attributes.map((attr) =>
          attr.id === data.attribute_id
            ? { ...attr, options: [...(attr.options || []), newOption] }
            : attr
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to add option';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  updateOption: async (optionId: number, data: UpdateOptionData) => {
    try {
      const formData = new FormData();

      if (data.value) formData.append('value', data.value);
      if (data.display_value) formData.append('display_value', data.display_value);
      if (data.color_code) formData.append('color_code', data.color_code);
      if (data.image) formData.append('image', data.image);
      if (data.sort_order !== undefined) formData.append('sort_order', data.sort_order.toString());
      if (data.is_default !== undefined) formData.append('is_default', data.is_default ? '1' : '0');

      const response = await apiClient.post(`/admin/attribute-options/${optionId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT'
        },
      });
      const updatedOption = response.data;

      set((state) => ({
        attributes: state.attributes.map((attr) => ({
          ...attr,
          options: attr.options?.map((opt) =>
            opt.id === optionId ? updatedOption : opt
          ),
        })),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update option';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  deleteOption: async (attributeId: number, optionId: number) => {
    try {
      await apiClient.delete(`/admin/attribute-options/${optionId}`);

      set((state) => ({
        attributes: state.attributes.map((attr) =>
          attr.id === attributeId
            ? {
                ...attr,
                options: attr.options?.filter((opt) => opt.id !== optionId),
              }
            : attr
        ),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete option';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },

  reorderOptions: async (reorderedIds: { id: number; sort_order: number }[]) => {
    try {
      await apiClient.post('/admin/attribute-options/reorder', {
        options: reorderedIds,
      });

      // Optimistically update local state
      set((state) => ({
        attributes: state.attributes.map((attr) => ({
          ...attr,
          options: attr.options?.map((opt) => {
            const reordered = reorderedIds.find((r) => r.id === opt.id);
            return reordered ? { ...opt, sort_order: reordered.sort_order } : opt;
          }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
        })),
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to reorder options';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    }
  },
}));
