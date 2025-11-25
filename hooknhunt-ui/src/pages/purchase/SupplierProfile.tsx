import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ExternalLink, Package, User, Building, Mail, Phone, QrCode, Globe, Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
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

interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: string;
  pivot: {
    supplier_product_urls: string[];
  };
}

export function SupplierProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch supplier data and products
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

      // Fetch supplier products
      const productsResponse = await api.get(`/admin/suppliers/${id}/products`);
      console.log('📦 Supplier products fetched:', productsResponse.data);
      setProducts(productsResponse.data.products || []);
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
      navigate(`/dashboard/suppliers/${supplier.id}/edit`);
    }
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

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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
          <Button onClick={() => navigate('/dashboard/suppliers')}>
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
                onClick={() => navigate('/dashboard/suppliers')}
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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Supplier Information */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact Person</label>
                  <p className="font-medium">{supplier.name || '--'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Shop Name</label>
                  <p className="font-medium">{supplier.shop_name || '--'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </label>
                  <p className="font-medium">{supplier.email || '--'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Shop URL
                  </label>
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

                {/* Payment Information */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Payment Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">WeChat ID</label>
                      <p className="font-medium">{supplier.wechat_id || '--'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Alipay ID</label>
                      <p className="font-medium">{supplier.alipay_id || '--'}</p>
                    </div>
                  </div>
                </div>

                {supplier.contact_info && (
                  <div className="border-t pt-4">
                    <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      Additional Contact Info
                    </label>
                    <p className="font-medium">{supplier.contact_info}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Products
                  </div>
                  <Badge variant="secondary">
                    {products.length} product{products.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Products sourced from this supplier
                </CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">This supplier doesn't have any associated products yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-2">{product.base_name}</h4>
                            <div className="flex items-center gap-3 mb-3">
                              <Badge
                                variant={product.status === 'published' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {product.status}
                              </Badge>
                              <span className="text-xs text-gray-500">ID: {product.id}</span>
                              <span className="text-xs text-gray-500">Slug: {product.slug}</span>
                            </div>

                            {/* Supplier Product URLs */}
                            {product.pivot.supplier_product_urls && product.pivot.supplier_product_urls.length > 0 && (
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-600 mb-2">Supplier Product Links:</p>
                                <div className="flex flex-wrap gap-2">
                                  {product.pivot.supplier_product_urls.map((url, index) => (
                                    <a
                                      key={index}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                      Link {index + 1}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/dashboard/products/${product.id}`)}
                            className="ml-4"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Product
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}