import { Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function PurchaseNew() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Plus className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Purchase</h1>
          <p className="text-gray-600">Create new purchase orders and procurement requests</p>
        </div>
      </div>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Purchase Order
          </CardTitle>
          <CardDescription>
            Create a new purchase order from suppliers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Plus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">New Purchase Order</h3>
            <p className="text-gray-600 mb-6">Purchase order creation form will be implemented here.</p>
            <div className="max-w-md mx-auto text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Planned features:</strong></p>
              <ul className="text-left space-y-1">
                <li>• Select supplier</li>
                <li>• Add products and quantities</li>
                <li>• Set pricing and terms</li>
                <li>• Generate purchase order</li>
                <li>• Track order status</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}