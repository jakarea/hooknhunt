import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Package, Building, Eye, Calendar, Link, TrendingUp, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';
import api from '@/lib/api';

// Define the Product interface
interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: string;
  base_thumbnail_url?: string | null;
  categories?: Array<{
    id: number;
    name: string;
  }>;
  pivot: {
    supplier_product_urls: string[];
  };
  created_at: string;
}

export function SupplierProducts() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch supplier products
  useEffect(() => {
    if (id) {
      fetchSupplierProducts();
    }
  }, [id]);

  const fetchSupplierProducts = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // Fetch supplier details for header
      const supplierResponse = await api.get(`/admin/suppliers/${id}`);
      setSupplier(supplierResponse.data);

      // Fetch supplier products
      const productsResponse = await api.get(`/admin/suppliers/${id}/products`);
      setProducts(productsResponse.data.products || []);
    } catch (error: any) {
      console.error('❌ Error fetching supplier products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supplier products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProduct = (productId: number) => {
    navigate(`/inventory/products/${productId}`);
  };

  // Helper functions for summary calculations
  const getPublishedProductsCount = () => {
    return products.filter(product => product.status === 'published').length;
  };

  const getDraftProductsCount = () => {
    return products.filter(product => product.status === 'draft').length;
  };

  const getProductsByCategoryCount = () => {
    const categoryMap = new Map();
    products.forEach(product => {
      if (product.categories && product.categories.length > 0) {
        product.categories.forEach(category => {
          categoryMap.set(category.name, (categoryMap.get(category.name) || 0) + 1);
        });
      }
    });
    return categoryMap.size;
  };

  const getProductsLinksCount = () => {
    return products.filter(product =>
      product.pivot.supplier_product_urls && product.pivot.supplier_product_urls.length > 0
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

        {/* Products Summary Skeleton */}
        <div className="container mx-auto px-6 py-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                    <Skeleton className="h-8 w-16 mx-auto mb-2" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-2 gap-4">
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

        {/* Products Table Skeleton */}
        <div className="container mx-auto px-6 py-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
                onClick={() => navigate(`/purchase/suppliers/${id}`)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {supplier?.shop_name || supplier?.name || 'Supplier'} - Products
                </h1>
                <p className="text-gray-600 mt-1">All products sourced from this supplier</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Summary */}
      <div className="container mx-auto px-6 py-4">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{getProductsByCategoryCount()}</div>
                <div className="text-sm text-purple-600">Categories</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <Link className="h-4 w-4 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">{getProductsLinksCount()}</span>
                </div>
                <div className="text-sm text-orange-600">With Links</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table */}
      <div className="container mx-auto px-6 py-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
            <CardDescription>
              Complete list of products sourced from this supplier
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">This supplier doesn't have any associated products yet.</p>
                <Button
                  className="mt-4"
                  onClick={() => navigate(`/purchase/suppliers/${id}`)}
                >
                  Return to Supplier Profile
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="w-[120px]">Status</TableHead>
                    <TableHead className="w-[150px]">Categories</TableHead>
                    <TableHead className="w-[200px]">Supplier Links</TableHead>
                    <TableHead className="w-[120px]">Added Date</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="group">
                      <TableCell>
                        <ProductImage
                          src={product.base_thumbnail_url}
                          alt={product.base_name || 'Product'}
                          size="sm"
                          className="rounded border"
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="font-medium hover:text-primary transition-colors text-left"
                        >
                          {product.base_name}
                        </button>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.status === 'published' ? 'default' : 'secondary'}>
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {product.categories && product.categories.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.categories.slice(0, 2).map((category) => (
                              <Badge key={category.id} variant="outline" className="text-xs">
                                {category.name}
                              </Badge>
                            ))}
                            {product.categories.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {product.pivot.supplier_product_urls && product.pivot.supplier_product_urls.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.pivot.supplier_product_urls.slice(0, 2).map((url, index) => (
                              <a
                                key={index}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                              >
                                <Link className="h-3 w-3" />
                                Link {index + 1}
                              </a>
                            ))}
                            {product.pivot.supplier_product_urls.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.pivot.supplier_product_urls.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">No links</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(product.created_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewProduct(product.id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}