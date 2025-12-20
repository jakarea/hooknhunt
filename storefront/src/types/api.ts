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