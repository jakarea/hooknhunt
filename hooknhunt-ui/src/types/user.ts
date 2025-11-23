export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  whatsapp_number: string | null;
  role: 'super_admin' | 'admin' | 'seller' | 'store_keeper' | 'marketer' | 'retail_customer' | 'wholesale_customer';
  email_verified_at: string | null;
  phone_verified_at: string | null;
  otp_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  phone_number: string;
  whatsapp_number?: string;
  password: string;
  password_confirmation: string;
  role: 'super_admin' | 'admin' | 'seller' | 'store_keeper' | 'marketer';
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone_number?: string;
  whatsapp_number?: string;
  password?: string;
  password_confirmation?: string;
  role?: 'super_admin' | 'admin' | 'seller' | 'store_keeper' | 'marketer';
}

export interface PaginatedUsersResponse {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}