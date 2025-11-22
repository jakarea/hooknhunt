// src/types/supplier.ts
export interface Supplier {
  id: number;
  name: string; // Contact person name
  shop_name: string | null;
  email: string | null;
  shop_url: string | null;
  wechat_id: string | null;
  alipay_id: string | null;
  // Add other fields if needed (e.g., QR codes)
  contact_info: string | null;
  created_at?: string;
  updated_at?: string;
}