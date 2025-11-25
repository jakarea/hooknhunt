import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Search, Filter, Edit, Eye, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';
import { ProductImage } from '@/components/ProductImage';

// Inline type definition to avoid import issues
interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id?: number;
  parent?: Category; // For breadcrumb support
}

interface Supplier {
  id: number;
  name: string;
  shop_name?: string;
  email?: string;
}

interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
  base_thumbnail_url?: string | null;
  gallery_images?: string[] | null;
  category_id?: number;
  category?: Category; // Include category data
  suppliers?: Supplier[]; // Include suppliers data
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      console.log('📡 Fetching categories from API...');
      const response = await api.get('/admin/categories');
      console.log('✅ Categories fetched:', response.data);

      const categoriesData = response.data.data || response.data;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error: any) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    try {
      console.log('📡 Fetching suppliers from API...');
      const response = await api.get('/admin/suppliers');
      console.log('✅ Suppliers fetched:', response.data);

      const suppliersData = response.data.data || response.data;
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : []);
    } catch (error: any) {
      console.error('❌ Error fetching suppliers:', error);
    }
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('📡 Fetching products from API...');

      // Build query string based on filters
      const queryParams = new URLSearchParams();
      queryParams.append('include', 'category,suppliers');

      if (selectedCategory && selectedCategory !== 'all') {
        queryParams.append('category_id', selectedCategory);
      }
      if (selectedSupplier && selectedSupplier !== 'all') {
        queryParams.append('supplier_id', selectedSupplier);
      }

      const response = await api.get(`/admin/products?${queryParams.toString()}`);
      console.log('✅ Products fetched:', response.data);

      // Handle Laravel pagination response
      const productsData = response.data.data || response.data;
      const productsArray = Array.isArray(productsData) ? productsData : [];

      // Process products to ensure data structure
      const processedProducts = productsArray.map((product: any) => ({
        ...product,
        category: product.category || null,
        suppliers: product.suppliers || []
      }));

      setProducts(processedProducts);
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
    fetchCategories();
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSupplier]);

  const handleCreateProduct = () => {
    navigate('/dashboard/products/create');
  };

  const handleViewProduct = (id: number) => {
    navigate(`/dashboard/products/${id}`);
  };

  const handleEditProduct = (id: number) => {
    navigate(`/dashboard/products/${id}/edit`);
  };

  // Helper function to create category breadcrumb
  const getCategoryBreadcrumb = (category?: Category) => {
    if (!category) return null;

    const breadcrumbParts: string[] = [];
    let currentCategory: Category | undefined = category;

    // Build breadcrumb by traversing up the parent chain
    while (currentCategory) {
      breadcrumbParts.unshift(currentCategory.name);
      currentCategory = currentCategory.parent;
    }

    return (
      <div className="flex items-center gap-1 text-sm text-gray-600">
        {breadcrumbParts.length > 1 ? (
          <>
            {breadcrumbParts.map((name, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-400">›</span>}
                <span className={index === breadcrumbParts.length - 1 ? 'font-medium text-gray-800' : 'text-gray-500'}>
                  {name}
                </span>
              </React.Fragment>
            ))}
          </>
        ) : (
          <span className="font-medium text-gray-800">{breadcrumbParts[0]}</span>
        )}
      </div>
    );
  };

  const filteredProducts = products.filter(product => {
    // Text search filter
    const matchesSearch = !searchTerm ||
      (product.base_name && product.base_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.slug && product.slug.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategory === 'all' ||
      (product.category && product.category.id.toString() === selectedCategory);

    // Supplier filter
    const matchesSupplier = selectedSupplier === 'all' ||
      (product.suppliers && product.suppliers.some(supplier =>
        supplier.id.toString() === selectedSupplier
      ));

    return matchesSearch && matchesCategory && matchesSupplier;
  });

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
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 min-w-0">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-0">
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Filter by Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id.toString()}>
                          {supplier.shop_name || supplier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedSupplier('all');
                    setSearchTerm('');
                  }}
                  disabled={selectedCategory === 'all' && selectedSupplier === 'all' && !searchTerm}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
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
                      alt={product.base_name || 'Product'}
                      size="md"
                    />
                    <div className="flex-1">
                      <CardTitle
                        className="text-lg cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleViewProduct(product.id)}
                      >
                        {product.base_name}
                      </CardTitle>
                      <CardDescription className="mt-1">Slug: {product.slug}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
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
                    {product.category && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Category:</span>
                        {getCategoryBreadcrumb(product.category)}
                      </div>
                    )}
                    {product.suppliers && product.suppliers.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Suppliers:</span>
                        <div className="flex flex-wrap gap-1">
                          {product.suppliers.slice(0, 2).map((supplier) => (
                            <span
                              key={supplier.id}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                            >
                              {supplier.shop_name || supplier.name}
                            </span>
                          ))}
                          {product.suppliers.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              +{product.suppliers.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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