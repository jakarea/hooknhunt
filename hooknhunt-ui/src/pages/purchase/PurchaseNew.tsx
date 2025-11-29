import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PurchaseNew() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the actual CreatePurchaseOrder page
    navigate('/dashboard/purchase/create-order', { replace: true });
  }, [navigate]);

  return null;
}