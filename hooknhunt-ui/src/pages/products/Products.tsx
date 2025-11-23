import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Search, Filter, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('📡 Fetching products from API...');
      const response = await api.get('/admin/products');
      console.log('✅ Products fetched:', response.data);

      // Handle Laravel pagination response
      const productsData = response.data.data || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error: any) {
      console.error('❌ Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    navigate('/dashboard/products/create');
  };

  const handleViewProduct = (id: number) => {
    navigate(`/dashboard/products/${id}`);
  };

  const handleEditProduct = (id: number) => {
    navigate(`/dashboard/products/${id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProducts = products.filter(product =>
    (product.base_name && product.base_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (product.slug && product.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Manage your product catalog and inventory</p>
            </div>
            <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
              <Button onClick={handleCreateProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </RoleGuard>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow group">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <ProductImage
                      src={product.base_thumbnail_url}
                      alt={product.base_name || product.name || 'Product'}
                      size="md"
                    />
                    <div className="flex-1">
                      <CardTitle
                        className="text-lg cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        {product.base_name || product.name}
                      </CardTitle>
                      <CardDescription className="mt-1">Slug: {product.slug}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(product.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                            <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Product
                            </DropdownMenuItem>
                          </RoleGuard>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-500">
                        {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    {product.meta_description && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-600">Description:</span>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {product.meta_description}
                        </p>
                      </div>
                    )}
                    <div className="pt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEditProduct(product.id)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </RoleGuard>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            // Empty state
            <div className="col-span-full">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first product'}
                    </p>
                    {!searchTerm && (
                      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                        <Button onClick={handleCreateProduct}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Product
                        </Button>
                      </RoleGuard>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;