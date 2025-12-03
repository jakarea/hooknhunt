import { create } from 'zustand';
import api from '@/lib/api';

interface SmsLog {
  id: number;
  user_id: number;
  request_id: string | null;
  message: string;
  recipients: string;
  sender_id: string | null;
  status: string;
  charge: number;
  scheduled_at: string | null;
  response_data: any;
  delivery_report: any;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface SmsStatistics {
  total_sent: number;
  total_failed: number;
  total_cost: number;
  today_sent: number;
  this_month_sent: number;
  this_month_cost: number;
}

interface SendSmsData {
  message: string;
  recipients: string[];
  sender_id?: string;
  schedule?: string;
}

interface SmsState {
  logs: SmsLog[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  balance: string | null;
  balanceLoading: boolean;
  statistics: SmsStatistics | null;
  statsLoading: boolean;

  // Actions
  fetchLogs: (page?: number, status?: string, search?: string) => Promise<void>;
  sendSms: (data: SendSmsData) => Promise<void>;
  getBalance: () => Promise<void>;
  getStatistics: () => Promise<void>;
  getReport: (id: number) => Promise<void>;
  refreshReports: () => Promise<void>;
}

export const useSmsStore = create<SmsState>((set, get) => ({
  logs: [],
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  balance: null,
  balanceLoading: false,
  statistics: null,
  statsLoading: false,

  fetchLogs: async (page = 1, status?: string, search?: string) => {
    set({ loading: true, error: null });
    try {
      const params: any = { page };
      if (status) params.status = status;
      if (search) params.search = search;

      const response = await api.get('/admin/sms', { params });
      set({
        logs: response.data.data,
        currentPage: response.data.current_page,
        totalPages: response.data.last_page,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || 'Failed to fetch SMS logs',
        loading: false,
      });
    }
  },

  sendSms: async (data: SendSmsData) => {
    set({ loading: true, error: null });
    try {
      await api.post('/admin/sms/send', data);
      set({ loading: false });
      // Refresh logs after sending
      await get().fetchLogs();
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || 'Failed to send SMS',
        loading: false,
      });
      throw error;
    }
  },

  getBalance: async () => {
    set({ balanceLoading: true });
    try {
      const response = await api.get('/admin/sms/balance');
      if (response.data.error === 0) {
        set({ balance: response.data.data.balance, balanceLoading: false });
      } else {
        set({ balance: null, balanceLoading: false });
      }
    } catch (error) {
      set({ balance: null, balanceLoading: false });
    }
  },

  getStatistics: async () => {
    set({ statsLoading: true });
    try {
      const response = await api.get('/admin/sms/statistics');
      if (response.data.error === 0) {
        set({ statistics: response.data.data, statsLoading: false });
      } else {
        set({ statistics: null, statsLoading: false });
      }
    } catch (error) {
      set({ statistics: null, statsLoading: false });
    }
  },

  getReport: async (id: number) => {
    try {
      await api.get(`/admin/sms/${id}/report`);
      // Refresh logs to show updated status
      await get().fetchLogs(get().currentPage);
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || 'Failed to get delivery report',
      });
    }
  },

  refreshReports: async () => {
    set({ loading: true });
    try {
      await api.post('/admin/sms/refresh-reports');
      // Refresh logs to show updated statuses
      await get().fetchLogs(get().currentPage);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.msg || 'Failed to refresh reports',
        loading: false,
      });
    }
  },
}));
