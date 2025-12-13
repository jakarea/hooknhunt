import { Purchase } from '@/types';

export const purchases: Purchase[] = [
  { id: 1, supplier_id: 1, invoice_no: 'INV-1001', date: '2025-10-01', tracking_no: 'TRK12345', courier_name: 'DHL', received_at_china: '2025-10-03', received_at_bd: '2025-10-15', exchange_rate: 15.3, shipping_cost: 500, note: '', created_at: '', updated_at: '' },
  { id: 2, supplier_id: 2, invoice_no: 'INV-1002', date: '2025-10-05', tracking_no: 'TRK67890', courier_name: 'FedEx', received_at_china: '2025-10-06', received_at_bd: '2025-10-18', exchange_rate: 15.4, shipping_cost: 600, note: '', created_at: '', updated_at: '' }
];
