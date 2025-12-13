import { Sale } from '@/types';

export const sales: Sale[] = [
  { id: 1, customer_id: 1, order_no: 'ORD-5001', date: '2025-10-20', tracking_code: 'SF123456', courier_name: 'Steadfast', cod_charge: 100, discount: 200, shipping_charge: 150, status: 'shipped', created_at: '', updated_at: '' },
  { id: 2, customer_id: 2, order_no: 'ORD-5002', date: '2025-10-21', tracking_code: 'SF987654', courier_name: 'Steadfast', cod_charge: 120, discount: 100, shipping_charge: 180, status: 'pending', created_at: '', updated_at: '' }
];
