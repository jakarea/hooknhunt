import { List, Package, Truck, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PurchaseList() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <List className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchase List</h1>
          <p className="text-gray-600">View and manage all purchase orders and procurement requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Purchase Orders
          </CardTitle>
          <CardDescription>
            List of all purchase orders with their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <List className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Purchase Orders Yet</h3>
            <p className="text-gray-600 mb-6">Purchase orders list will be displayed here once created.</p>
            <div className="max-w-md mx-auto text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              <p className="mb-2"><strong>Planned features:</strong></p>
              <ul className="text-left space-y-1">
                <li>• Filterable order list</li>
                <li>• Order status tracking</li>
                <li>• Search by supplier or product</li>
                <li>• Export to PDF/Excel</li>
                <li>• Bulk actions</li>
                <li>• Order analytics</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Legend</CardTitle>
          <CardDescription>Understanding purchase order status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Draft</Badge>
              <span className="text-sm text-gray-600">Order created but not submitted</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
              <span className="text-sm text-gray-600">Awaiting approval or payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">Confirmed</Badge>
              <span className="text-sm text-gray-600">Order confirmed by supplier</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">In Transit</Badge>
              <span className="text-sm text-gray-600">Items being shipped</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">Arrived</Badge>
              <span className="text-sm text-gray-600">Items reached destination</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
              <span className="text-sm text-gray-600">Order fully processed</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}