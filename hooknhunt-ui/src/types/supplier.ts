// src/types/supplier.ts
export interface Supplier {
  id: number;
  name: string; // Contact person name
  shop_name: string | null;
  email: string | null;
  shop_url: string | null;
  wechat_id: string | null;
  wechat_qr_url: string | null; // QR code image URL
  alipay_id: string | null;
  alipay_qr_url: string | null; // QR code image URL
  contact_info: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSupplierData {
  name: string;
  shop_name?: string;
  email?: string;
  shop_url?: string;
  wechat_id?: string;
  wechat_qr_file?: File;
  alipay_id?: string;
  alipay_qr_file?: File;
  contact_info?: string;
}

export interface UpdateSupplierData extends Partial<CreateSupplierData> {
  wechat_qr_url?: string; // For direct URL updates
  alipay_qr_url?: string; // For direct URL updates
}