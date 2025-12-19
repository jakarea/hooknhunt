import React from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@/lib/apiClient';

export function ReceiveStockTest() {
  const { poItemId } = useParams<{ poItemId: string }>();

  const [loading, setLoading] = React.useState(true);
  const [poItem, setPoItem] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const testData = async () => {
      try {
        console.log('Testing API call for PO item:', poItemId);

        // Test 1: Basic API call
        const response = await apiClient.get(`/admin/purchase-order-items/${poItemId}`);
        console.log('API Response:', response);

        setPoItem(response.data);
        setLoading(false);

      } catch (error: any) {
        console.error('Test API call failed:', error);
        setError(error.message || 'Unknown error');
        setLoading(false);
      }
    };

    if (poItemId) {
      testData();
    }
  }, [poItemId]);

  if (loading) {
    return (
      <div className="p-8">
        <h1>Loading test data...</h1>
        <p>PO Item ID: {poItemId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1>Error: {error}</h1>
        <p>PO Item ID: {poItemId}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1>Test Successful!</h1>
      <pre>{JSON.stringify(poItem, null, 2)}</pre>
    </div>
  );
}