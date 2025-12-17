import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, User, Building, Mail, Phone, QrCode, Globe, Edit, Package, Calendar, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { SupplierImage } from '@/components/SupplierImage';
import api from '@/lib/api';

// Define the Supplier interface
interface Supplier {
  id: number;
  name: string;
  shop_name: string | null;
  email: string | null;
  shop_url: string | null;
  wechat_id: string | null;
  wechat_qr_url: string | null;
  alipay_id: string | null;
  alipay_qr_url: string | null;
  contact_info: string | null;
  created_at?: string;
  updated_at?: string;
}

export function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch supplier data
  useEffect(() => {
    if (id) {
      fetchSupplierData();
    }
  }, [id]);

  const fetchSupplierData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // Fetch supplier details
      const supplierResponse = await api.get(`/admin/suppliers/${id}`);
      const supplierData = supplierResponse.data;
      setSupplier(supplierData);

      // Fetch supplier products for summary
      const productsResponse = await api.get(`/admin/suppliers/${id}/products`);
      setProducts(productsResponse.data.products || []);

      // Fetch all purchase orders and filter by supplier for summary
      const purchaseResponse = await api.get('/admin/purchase-orders');
      const allOrders = purchaseResponse.data.data || purchaseResponse.data || [];
      const supplierOrders = Array.isArray(allOrders)
        ? allOrders.filter(order => order.supplier_id === parseInt(id))
        : [];
      setPurchaseOrders(supplierOrders);
    } catch (error: any) {
      console.error('❌ Error fetching supplier data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supplier data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSupplier = () => {
    if (supplier) {
      navigate(`/purchase/suppliers/${supplier.id}/edit`);
    }
  };

  // Helper functions for summary calculations
  const getPublishedProductsCount = () => {
    return products.filter(product => product.status === 'published').length;
  };

  const getDraftProductsCount = () => {
    return products.filter(product => product.status === 'draft').length;
  };

  const getTotalItemsOrdered = () => {
    return purchaseOrders.reduce((total, order) => {
      if (!order.items) return total;
      return total + order.items.reduce((itemTotal, item) => itemTotal + (item.quantity || 0), 0);
    }, 0);
  };

  const getTotalChinaValue = () => {
    return purchaseOrders.reduce((total, order) => {
      if (!order.items) return total;
      return total + order.items.reduce((itemTotal, item) => {
        return itemTotal + ((item.china_price || 0) * (item.quantity || 0));
      }, 0);
    }, 0);
  };

  const getTotalAmount = () => {
    return purchaseOrders.reduce((total, order) => {
      const amount = parseFloat(order.total_amount?.toString() || '0');
      return total + (isNaN(amount) ? 0 : amount);
    }, 0);
  };

  const getCompletedOrdersCount = () => {
    return purchaseOrders.filter(order =>
      order.status === 'completed' || order.status === 'completed_partially'
    ).length;
  };

  const getActiveOrdersCount = () => {
    return purchaseOrders.filter(order =>
      ['draft', 'payment_confirmed', 'supplier_dispatched', 'shipped_bd', 'arrived_bd', 'in_transit_bogura', 'received_hub'].includes(order.status)
    ).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Skeleton */}
        <div className="container mx-auto px-6 py-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-20 w-20 mx-auto rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards Skeleton */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Supplier Not Found</h2>
          <p className="text-gray-600 mb-6">The supplier you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/purchase/suppliers')}>
            Back to Suppliers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/purchase/suppliers')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Suppliers
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{supplier.shop_name || supplier.name}</h1>
                <p className="text-gray-600 mt-1">Supplier Profile</p>
              </div>
            </div>
            <Button onClick={handleEditSupplier}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Supplier
            </Button>
          </div>
        </div>
      </div>

      {/* Contact Information - Full Width */}
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Complete contact and payment details for this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Contact Person</label>
                      <p className="font-medium">{supplier.name || '--'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Shop Name</label>
                      <p className="font-medium">{supplier.shop_name || '--'}</p>
                    </div>
                    {supplier.contact_info && (
                      <div>
                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Additional Contact
                        </label>
                        <p className="font-medium">{supplier.contact_info}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Online Presence */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Online Presence
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        Email
                      </label>
                      <p className="font-medium">{supplier.email || '--'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Shop URL</label>
                      {supplier.shop_url ? (
                        <a
                          href={supplier.shop_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          Visit Shop
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="font-medium">--</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* WeChat Payment */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    WeChat Payment
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">WeChat ID</label>
                      <p className="font-medium">{supplier.wechat_id || '--'}</p>
                    </div>
                    <div className="flex justify-center">
                      {supplier.wechat_qr_url ? (
                        <SupplierImage
                          src={supplier.wechat_qr_url}
                          alt="WeChat QR Code"
                          size="md"
                          className="w-24 h-24 border border-gray-200 rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <QrCode className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alipay Payment */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Alipay Payment
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Alipay ID</label>
                      <p className="font-medium">{supplier.alipay_id || '--'}</p>
                    </div>
                    <div className="flex justify-center">
                      {supplier.alipay_qr_url ? (
                        <SupplierImage
                          src={supplier.alipay_qr_url}
                          alt="Alipay QR Code"
                          size="md"
                          className="w-24 h-24 border border-gray-200 rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <QrCode className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Products Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Products Summary
              </CardTitle>
              <CardDescription>
                Overview of products sourced from this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{products.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getPublishedProductsCount()}</div>
                  <div className="text-sm text-green-600">Published</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{getDraftProductsCount()}</div>
                  <div className="text-sm text-yellow-600">Draft</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">
                      {products.length > 0 ? Math.round((getPublishedProductsCount() / products.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-sm text-blue-600">Published Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase History Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Purchase History Summary
              </CardTitle>
              <CardDescription>
                Overview of purchase orders and financial summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getCompletedOrdersCount()}</div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getTotalItemsOrdered()}</div>
                  <div className="text-sm text-blue-600">Total Items</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">¥{getTotalChinaValue().toFixed(0)}</div>
                  <div className="text-sm text-purple-600">China Value</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span className="text-2xl font-bold text-orange-600">{getActiveOrdersCount()}</span>
                  </div>
                  <div className="text-sm text-orange-600">Active Orders</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span className="text-2xl font-bold text-emerald-600">৳{getTotalAmount().toFixed(0)}</span>
                  </div>
                  <div className="text-sm text-emerald-600">Total Amount (BDT)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/purchase/suppliers/${id}/products`)}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Products</h3>
                  <p className="text-gray-600">View all products sourced from this supplier</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/purchase/suppliers/${id}/purchase`)}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
                  <p className="text-gray-600">View all purchase orders and invoices from this supplier</p>
                </div>
                <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}