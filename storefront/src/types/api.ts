// API Response Types
export interface OrderResponse {
  message: string;
  order: {
    id: number;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string | null;
    shipping_address: string;
    shipping_city: string;
    shipping_district: string;
    payment_method: string;
    payment_details: string;
    notes: string | null;
    subtotal: string;
    delivery_charge: string;
    service_charge: string;
    coupon_discount: string;
    total_amount: string;
    payable_amount: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  response?: Response;
}

export interface ApiError {
  status?: number;
  message: string;
  errors?: Record<string, string[]>;
  response?: Response;
}

// Currency Types
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbol_position: 'left' | 'right';
  decimal_places: number;
  is_default: boolean;
  exchange_rate: number | null;
  is_active: boolean;
  notes: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface CurrencyListResponse {
  success: boolean;
  data: Currency[];
}

export interface CurrencyResponse {
  success: boolean;
  data: Currency;
  message?: string;
}

export interface CurrencyConvertRequest {
  amount: number;
  from_currency: string;
  to_currency?: string;
  format?: boolean;
}

export interface CurrencyConvertResponse {
  success: boolean;
  data: {
    from: string;
    to: string;
    amount: number;
    converted_amount: number;
    exchange_rate: number;
    formatted_original?: string;
    formatted_converted?: string;
  };
}

export interface CurrencyCreateRequest {
  code: string;
  name: string;
  symbol: string;
  symbol_position: 'left' | 'right';
  decimal_places: number;
  exchange_rate?: number;
  is_active?: boolean;
  notes?: string;
}

export interface CurrencyUpdateRequest {
  name?: string;
  symbol?: string;
  symbol_position?: 'left' | 'right';
  decimal_places?: number;
  exchange_rate?: number;
  is_active?: boolean;
  is_default?: boolean;
  notes?: string;
}

// Financial Report Types
export interface FinancialReport {
  id: number;
  name: string;
  type: 'comparative' | 'ratio' | 'cash_flow' | 'fund_flow' | 'custom';
  description: string | null;
  template_id: number | null;
  start_date: string | null;
  end_date: string | null;
  compare_start_date: string | null;
  compare_end_date: string | null;
  period_type: 'monthly' | 'quarterly' | 'yearly' | 'custom' | null;
  config: Record<string, unknown> | null;
  columns: unknown[] | null;
  filters: Record<string, unknown> | null;
  data: Record<string, unknown> | null;
  summary: Record<string, unknown> | null;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  generated_at: string | null;
  generated_by: string | null;
  is_scheduled: boolean;
  schedule_frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | null;
  next_run_date: string | null;
  last_run_date: string | null;
  export_format: 'pdf' | 'excel' | 'csv';
  file_path: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReportTemplate {
  id: number;
  name: string;
  type: string;
  description: string | null;
  config: Record<string, unknown> | null;
  columns: unknown[] | null;
  filters: Record<string, unknown> | null;
  chart_config: Record<string, unknown> | null;
  is_system: boolean;
  category: string | null;
  is_active: boolean;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

export interface ReportCreateRequest {
  name: string;
  type: 'comparative' | 'ratio' | 'cash_flow' | 'fund_flow' | 'custom';
  description?: string;
  template_id?: number;
  start_date: string;
  end_date: string;
  compare_start_date?: string;
  compare_end_date?: string;
  period_type?: 'monthly' | 'quarterly' | 'yearly' | 'custom';
  config?: Record<string, unknown>;
  columns?: unknown[];
  filters?: Record<string, unknown>;
  is_scheduled?: boolean;
  schedule_frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  export_format?: 'pdf' | 'excel' | 'csv';
}

// Audit Trail Types
export interface AuditLog {
  id: number;
  entity_type: string;
  entity_id: number;
  entity_identifier: string | null;
  action: string;
  description: string | null;
  performed_by: number | null;
  performed_by_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  changed_fields: string[] | null;
  related_entity_type: string | null;
  related_entity_id: number | null;
  original_audit_id: number | null;
  reversal_reason: string | null;
  metadata: Record<string, unknown> | null;
  source: string;
  created_at: string;
  updated_at: string;
  documents?: DocumentAttachment[];
}

export interface DocumentAttachment {
  id: number;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  file_extension: string;
  entity_type: string | null;
  entity_id: number | null;
  audit_log_id: number | null;
  document_type: string | null;
  document_number: string | null;
  document_date: string | null;
  description: string | null;
  is_confidential: boolean;
  allowed_roles: string[] | null;
  uploaded_by: number | null;
  created_at: string;
  updated_at: string;
}