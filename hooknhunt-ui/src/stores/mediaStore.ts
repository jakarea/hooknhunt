import { create } from 'zustand';
import api from '@/lib/api';

interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  url: string;
  thumbnail_url?: string;
  folder?: {
    id: number;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface MediaFolder {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  sort_order: number;
  is_public: boolean;
  allowed_roles?: string[];
  media_files_count: number;
  created_at: string;
  updated_at: string;
}

interface MediaPagination {
  page: number;
  lastPage: number;
  total: number;
  perPage: number;
}

interface MediaState {
  // Files
  files: MediaFile[];
  folders: MediaFolder[];
  loading: boolean;
  error: string | null;

  // Pagination
  pagination: MediaPagination;

  // Filters
  searchQuery: string;
  selectedFolder: string | null;
  selectedType: string | null;
  viewMode: 'grid' | 'list';

  // Actions
  fetchFiles: (params?: {
    page?: number;
    search?: string;
    folder_id?: string | null;
    mime_type?: string | null;
  }) => Promise<void>;
  fetchFolders: () => Promise<void>;
  uploadFiles: (files: File[], folderId?: number) => Promise<MediaFile[]>;
  deleteFile: (fileId: number) => Promise<void>;
  updateFile: (fileId: number, data: Partial<MediaFile>) => Promise<void>;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (folderId: string | null) => void;
  setSelectedType: (type: string | null) => void;
  setViewMode: (mode: 'grid' | 'list') => void;

  // Utility actions
  resetFilters: () => void;
  clearFiles: () => void;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  // Initial state
  files: [],
  folders: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    lastPage: 1,
    total: 0,
    perPage: 24,
  },
  searchQuery: '',
  selectedFolder: null,
  selectedType: null,
  viewMode: 'grid',

  // Fetch files
  fetchFiles: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const queryParams = new URLSearchParams({
        page: (params.page ?? get().pagination.page).toString(),
        per_page: get().pagination.perPage.toString(),
      });

      if (params.search || get().searchQuery) {
        queryParams.append('search', params.search || get().searchQuery);
      }
      if (params.folder_id || get().selectedFolder) {
        queryParams.append('folder_id', params.folder_id || get().selectedFolder!);
      }
      if (params.mime_type || get().selectedType) {
        queryParams.append('mime_type', params.mime_type || get().selectedType!);
      }

      const response = await api.get(`/admin/media?${queryParams}`);

      set({
        files: response.data.data || response.data,
        pagination: {
          page: response.data.current_page || 1,
          lastPage: response.data.last_page || 1,
          total: response.data.total || 0,
          perPage: response.data.per_page || 24,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch files',
        loading: false,
      });
      throw error;
    }
  },

  // Fetch folders
  fetchFolders: async () => {
    try {
      const response = await api.get('/admin/media/folders');
      set({ folders: response.data.flat || response.data });
    } catch (error: any) {
      console.error('Failed to fetch folders:', error);
      // Don't set error state for folders as it's not critical
    }
  },

  // Upload files
  uploadFiles: async (files: File[], folderId?: number) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) {
        formData.append('folder_id', folderId.toString());
      }

      const response = await api.post('/admin/media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.media_file;
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);

      // Refresh files to get the latest list
      await get().fetchFiles();

      return uploadedFiles;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed';
      set({ error: message });
      throw new Error(message);
    }
  },

  // Delete file
  deleteFile: async (fileId: number) => {
    try {
      await api.delete(`/admin/media/${fileId}`);

      // Remove from local state
      set(state => ({
        files: state.files.filter(file => file.id !== fileId),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete file';
      set({ error: message });
      throw new Error(message);
    }
  },

  // Update file
  updateFile: async (fileId: number, data: Partial<MediaFile>) => {
    try {
      const response = await api.put(`/admin/media/${fileId}`, data);
      const updatedFile = response.data.media_file;

      // Update local state
      set(state => ({
        files: state.files.map(file =>
          file.id === fileId ? { ...file, ...updatedFile } : file
        ),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update file';
      set({ error: message });
      throw new Error(message);
    }
  },

  // Filter actions
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedFolder: (folderId: string | null) => {
    set({ selectedFolder: folderId });
  },

  setSelectedType: (type: string | null) => {
    set({ selectedType: type });
  },

  setViewMode: (mode: 'grid' | 'list') => {
    set({ viewMode: mode });
  },

  // Utility actions
  resetFilters: () => {
    set({
      searchQuery: '',
      selectedFolder: null,
      selectedType: null,
      pagination: { ...get().pagination, page: 1 },
    });
  },

  clearFiles: () => {
    set({
      files: [],
      pagination: { ...get().pagination, page: 1, total: 0 },
    });
  },
}));