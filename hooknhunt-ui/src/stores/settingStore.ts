import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import apiClient from '@/lib/apiClient';

// Cache settings in localStorage to reduce API calls
const SETTINGS_CACHE_KEY = 'hooknhunt_settings_cache';
const CACHE_TIMESTAMP_KEY = 'hooknhunt_settings_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper to get cached settings
const getCachedSettings = (): Record<string, string> | null => {
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);

    if (cached && timestamp) {
      const now = Date.now();
      const cacheTime = parseInt(timestamp, 10);

      // Return cached data if still valid
      if (now - cacheTime < CACHE_DURATION) {
        return JSON.parse(cached);
      } else {
        // Clear expired cache
        localStorage.removeItem(SETTINGS_CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
      }
    }
  } catch (error) {
    console.warn('Failed to parse cached settings:', error);
    localStorage.removeItem(SETTINGS_CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  }
  return null;
};

// Helper to cache settings
const cacheSettings = (settings: Record<string, string>): void => {
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to cache settings:', error);
  }
};

interface SettingState {
  settings: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isInitialized: boolean;

  // Optimized actions
  fetchSettings: (force?: boolean) => Promise<void>;
  updateSettings: (data: Record<string, string>) => Promise<void>;
  updateSingleSetting: (key: string, value: string) => Promise<void>;
  getSetting: (key: string) => string | undefined;
  clearCache: () => void;
}

export const useSettingStore = create<SettingState>()(
  subscribeWithSelector((set, get) => {
    // Initialize with cached data if available
    const cachedSettings = getCachedSettings();

    return {
      settings: cachedSettings || {},
      isLoading: false, // Initialize as false so components can trigger fetch if needed
      error: null,
      lastFetched: cachedSettings ? Date.now() : null,
      isInitialized: !!cachedSettings,

      fetchSettings: async (force = false) => {
        const state = get();

        // Skip if already loading
        if (state.isLoading && !force) {
          console.log('SettingStore - Skipping fetch (already loading)');
          return;
        }

        // Skip if we have fresh data (unless forced)
        const now = Date.now();
        if (!force && state.lastFetched && (now - state.lastFetched < CACHE_DURATION)) {
          console.log('SettingStore - Skipping fetch (cache still fresh)');
          return;
        }

        console.log('SettingStore - Fetching settings...');
        set((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
          const response = await apiClient.get<Record<string, string>>('/admin/settings');
          const newSettings = response.data;
          console.log('SettingStore - Fetch successful:', newSettings);

          set((prevState) => ({
            ...prevState,
            settings: newSettings,
            isLoading: false,
            error: null,
            lastFetched: now,
            isInitialized: true,
          }));

          // Cache the fresh data
          cacheSettings(newSettings);
        } catch (err: unknown) {
          const errorMessage = (err instanceof Error) ? err.message : 'Failed to fetch settings';
          console.error('Settings fetch error:', err);

          set((prevState) => ({
            ...prevState,
            error: errorMessage,
            isLoading: false,
            isInitialized: true, // Mark as initialized even on error to prevent retry loops
          }));
        }
      },

      updateSettings: async (data: Record<string, string>) => {
        const state = get();
        if (state.isLoading) return; // Skip if already loading

        set((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
          const response = await apiClient.post<Record<string, string>>('/admin/settings', data);
          const updatedSettings = response.data;

          set((prevState) => ({
            ...prevState,
            settings: updatedSettings,
            isLoading: false,
            lastFetched: Date.now(),
          }));

          // Update cache with fresh data
          cacheSettings(updatedSettings);
        } catch (err: unknown) {
          const errorMessage = (err instanceof Error) ? err.message : 'Failed to update settings';
          console.error('Settings update error:', err);

          set((prevState) => ({
            ...prevState,
            error: errorMessage,
            isLoading: false,
          }));
          throw err; // Re-throw to allow component to handle the error
        }
      },

      updateSingleSetting: async (key: string, value: string) => {
        const state = get();
        if (state.isLoading) return;

        set((prevState) => ({ ...prevState, isLoading: true, error: null }));

        try {
          const updateData = { [key]: value };
          const response = await apiClient.post<Record<string, string>>('/admin/settings', updateData);
          const updatedSettings = response.data;

          set((prevState) => ({
            ...prevState,
            settings: updatedSettings,
            isLoading: false,
            lastFetched: Date.now(),
          }));

          // Update cache
          cacheSettings(updatedSettings);
        } catch (err: unknown) {
          const errorMessage = (err instanceof Error) ? err.message : `Failed to update ${key}`;
          console.error(`Single setting update error (${key}):`, err);

          set((prevState) => ({
            ...prevState,
            error: errorMessage,
            isLoading: false,
          }));
          throw err;
        }
      },

      getSetting: (key: string) => {
        return get().settings[key];
      },

      clearCache: () => {
        localStorage.removeItem(SETTINGS_CACHE_KEY);
        localStorage.removeItem(CACHE_TIMESTAMP_KEY);
        set((prevState) => ({
          ...prevState,
          settings: {},
          lastFetched: null,
          isInitialized: false,
        }));
      },
    };
  })
);

// Selector hooks for optimized re-renders
export const useSettings = () => useSettingStore((state) => state.settings);
export const useSettingsLoading = () => useSettingStore((state) => state.isLoading);
export const useSettingsError = () => useSettingStore((state) => state.error);
export const useSetting = (key: string) =>
  useSettingStore((state) => state.settings[key]);