import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Search, Filter, Edit, Eye, MoreHorizontal, X, Loader2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
  categories?: Category[]; // Multiple categories support
  suppliers?: Supplier[]; // Include suppliers data
  created_at: string;
  updated_at: string;
}

const Products = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
    from: 0,
    to: 0,
  });

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

  // Get current page from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch products from API
  const fetchProducts = async (page: number = 1) => {
    try {
      setIsLoading(true);
      console.log('📡 Fetching products from API...');

      // Build query string based on filters
      const queryParams = new URLSearchParams();
      queryParams.append('include', 'categories,suppliers');
      queryParams.append('page', page.toString());

      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (selectedCategory && selectedCategory !== 'all') {
        queryParams.append('category_ids', selectedCategory);
      }
      if (selectedSupplier && selectedSupplier !== 'all') {
        queryParams.append('supplier_id', selectedSupplier);
      }

      const response = await api.get(`/admin/products?${queryParams.toString()}`);
      console.log('✅ Products fetched:', response.data);

      // Handle Laravel pagination response
      const paginationData = response.data;
      const productsData = paginationData.data || response.data;
      const productsArray = Array.isArray(productsData) ? productsData : [];

      // Process products to ensure data structure
      const processedProducts = productsArray.map((product: any) => ({
        ...product,
        categories: product.categories || [], // Multiple categories
        suppliers: product.suppliers || []
      }));

      setProducts(processedProducts);

      // Set pagination metadata
      setPagination({
        currentPage: paginationData.current_page || 1,
        lastPage: paginationData.last_page || 1,
        perPage: paginationData.per_page || 15,
        total: paginationData.total || 0,
        from: paginationData.from || 0,
        to: paginationData.to || 0,
      });
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
  }, []);

  useEffect(() => {
    // Reset to page 1 and fetch products when filters change
    const timer = setTimeout(() => {
      // Get current params to preserve other URL parameters
      const currentParams = Object.fromEntries(searchParams.entries());

      // Update params with new filter values and reset page to 1
      const updatedParams = {
        ...currentParams,
        page: '1'
      };

      // Remove search param if search term is empty
      if (!searchTerm) {
        delete updatedParams.search;
      } else {
        updatedParams.search = searchTerm;
      }

      // Remove category_ids param if 'all' is selected
      if (selectedCategory === 'all') {
        delete updatedParams.category_ids;
      } else {
        updatedParams.category_ids = selectedCategory;
      }

      // Remove supplier_id param if 'all' is selected
      if (selectedSupplier === 'all') {
        delete updatedParams.supplier_id;
      } else {
        updatedParams.supplier_id = selectedSupplier;
      }

      setSearchParams(updatedParams);
    }, searchTerm ? 500 : 0); // Debounce search, immediate for other filters

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSupplier, searchTerm]);

  useEffect(() => {
    // Fetch products when page changes
    fetchProducts(currentPage);
  }, [currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    // Get current params to preserve filters
    const currentParams = Object.fromEntries(searchParams.entries());

    // Update only the page parameter, keep others
    const updatedParams = {
      ...currentParams,
      page: page.toString()
    };

    // Remove empty search term if it exists
    if (updatedParams.search === '') {
      delete updatedParams.search;
    }

    setSearchParams(updatedParams);
  };

  const handleCreateProduct = () => {
    navigate('/inventory/products/create');
  };

  const handleViewProduct = (id: number) => {
    navigate(`/inventory/products/${id}`);
  };

  const handleEditProduct = (id: number) => {
    navigate(`/inventory/products/${id}/edit`);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSupplier('all');
    setSearchTerm('');
    setSearchParams({ page: '1' }); // Reset to page 1
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedSupplier !== 'all' || searchTerm !== '';

  return (
    <div className="flex flex-col h-full">
      {/* Compact Header */}
      <div className="border-b bg-white">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <h1 className="text-xl font-semibold">Products</h1>
              <p className="text-xs text-muted-foreground">
                {pagination.total} {pagination.total === 1 ? 'product' : 'products'}
                {hasActiveFilters && ' (filtered)'}
              </p>
            </div>
          </div>
          <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
            <Button onClick={handleCreateProduct} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </RoleGuard>
        </div>
      </div>

      {/* Compact Filters */}
      <div className="border-b bg-white px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Category" />
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

          {/* Supplier Filter */}
          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Supplier" />
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

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Image</TableHead>
              <TableHead className="min-w-[200px]">Product</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="min-w-[150px]">Category</TableHead>
              <TableHead className="min-w-[150px]">Suppliers</TableHead>
              <TableHead className="w-[120px]">Created</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={7} className="h-16">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gray-200 rounded animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                        <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse" />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
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
                    {product.suppliers && product.suppliers.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.suppliers.slice(0, 2).map((supplier) => (
                          <Badge key={supplier.id} variant="outline" className="text-xs">
                            {supplier.shop_name || supplier.name}
                          </Badge>
                        ))}
                        {product.suppliers.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{product.suppliers.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {new Date(product.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-64">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No products found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {hasActiveFilters
                        ? 'Try adjusting your filters'
                        : 'Get started by adding your first product'}
                    </p>
                    {!hasActiveFilters && (
                      <RoleGuard allowedRoles={['super_admin', 'admin', 'store_keeper']}>
                        <Button onClick={handleCreateProduct} size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Product
                        </Button>
                      </RoleGuard>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && products.length > 0 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {pagination.from} to {pagination.to} of {pagination.total} products
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
                    let pageNumber;
                    if (pagination.lastPage <= 5) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (pagination.currentPage >= pagination.lastPage - 2) {
                      pageNumber = pagination.lastPage - 4 + i;
                    } else {
                      pageNumber = pagination.currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={pagination.currentPage === pageNumber ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handlePageChange(pageNumber)}
                        className="h-8 w-8 p-0"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.lastPage)}
                  disabled={pagination.currentPage === pagination.lastPage}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;