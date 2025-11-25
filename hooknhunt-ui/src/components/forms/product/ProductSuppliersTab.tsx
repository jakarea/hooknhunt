// src/components/forms/product/ProductSuppliersTab.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Plus, Trash2, ExternalLink, Building, Link } from 'lucide-react';
import { useProductStore } from '@/stores/productStore';
import { useSupplierStore } from '@/stores/supplierStore';
import type { Supplier } from '@/types/supplier';

// Define Product interface inline to avoid import issues
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
  suppliers?: ProductSupplier[];
  created_at: string;
  updated_at: string;
}

interface ProductSupplier {
  supplier_id: number;
  supplier_product_urls: string[];
  supplier?: Supplier;
}

interface ProductSuppliersTabProps {
  product: Product; // The full product object, which includes suppliers
  onSuppliersUpdated?: () => void; // Callback to refresh product data
}

export const ProductSuppliersTab: React.FC<ProductSuppliersTabProps> = ({
  product,
  onSuppliersUpdated
}) => {
  // Local state as specified in requirements
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [urls, setUrls] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  // Store hooks as specified in requirements
  const { attachSupplier, detachSupplier } = useProductStore();
  const { suppliers, fetchSuppliers } = useSupplierStore();

  // Force local state to track suppliers and trigger re-render
  const [localSuppliers, setLocalSuppliers] = useState(product.suppliers || []);

  // Update local suppliers when product prop changes
  useEffect(() => {
    setLocalSuppliers(product.suppliers || []);
  }, [product.suppliers]);

  // Effect: On mount, call fetchSuppliers() from useSupplierStore so the dropdown is populated
  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  // Add another URL input field
  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  // Remove a URL input field
  const removeUrlField = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  // Update a specific URL
  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  // Handle supplier attachment
  const handleAttachSupplier = async () => {
    if (!selectedSupplierId) {
      toast({
        title: "Error",
        description: "Please select a supplier",
        variant: "destructive"
      });
      return;
    }

    // Filter out empty URLs and validate
    const validUrls = urls.filter(url => url.trim() !== '');
    if (validUrls.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one product URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await attachSupplier(product.id, parseInt(selectedSupplierId), validUrls);

      // Reset form as specified: On click -> validate -> call attachSupplier -> reset form
      setSelectedSupplierId('');
      setUrls(['']);

      // Callback to refresh product data in parent component
      onSuppliersUpdated?.();

      toast({
        title: "Success",
        description: "Supplier attached successfully"
      });

    } catch (error: any) {
      console.error('Failed to attach supplier:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to attach supplier',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle supplier detachment
  const handleDetachSupplier = async (supplierId: number) => {
    setIsLoading(true);
    try {
      await detachSupplier(product.id, supplierId);

      // Callback to refresh product data in parent component
      onSuppliersUpdated?.();

      toast({
        title: "Success",
        description: "Supplier detached successfully"
      });

    } catch (error: any) {
      console.error('Failed to detach supplier:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to detach supplier',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentSuppliers = localSuppliers;

  // Debug logging to understand the data structure
  useEffect(() => {
    console.log('🔍 ProductSuppliersTab Debug:');
    console.log('Product ID:', product.id);
    console.log('Product suppliers:', product.suppliers);
    console.log('Local suppliers:', localSuppliers);
    if (localSuppliers && localSuppliers.length > 0) {
      console.log('Suppliers count:', localSuppliers.length);
      localSuppliers.forEach((supplier, index) => {
        console.log(`Supplier ${index}:`, {
          supplier_id: supplier.supplier_id,
          supplier_name: supplier.supplier?.name,
          shop_name: supplier.supplier?.shop_name,
          urls: supplier.supplier_product_urls,
          full_structure: supplier
        });
      });
    }
  }, [product, localSuppliers]);

  return (
    <div className="space-y-6">
      {/* Card 1: Add Supplier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Add Supplier
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select Dropdown: 'Select a Supplier' (map over supplierStore.suppliers) */}
          <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.shop_name || supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dynamic URL Inputs: Map over urls. Add 'Plus' button to add new line, 'Trash' to remove line */}
          <div className="space-y-2">
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Product URL"
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  className="flex-1"
                />
                {urls.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeUrlField(index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addUrlField}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add URL
            </Button>
          </div>

          {/* Button: 'Attach Supplier'. On click -> validate -> call attachSupplier -> reset form */}
          <Button
            onClick={handleAttachSupplier}
            disabled={!selectedSupplierId || urls.filter(u => u.trim()).length === 0 || isLoading}
            className="w-full"
          >
            {isLoading ? 'Attaching...' : 'Attach Supplier'}
          </Button>
        </CardContent>
      </Card>

      {/* Card 2: Attached Suppliers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Attached Suppliers ({currentSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentSuppliers.length === 0 ? (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No suppliers attached to this product yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSuppliers.map((productSupplier) => (
                  <TableRow key={productSupplier.supplier_id}>
                    <TableCell>
                      <div className="font-medium">
                        {productSupplier.supplier?.shop_name ||
                         productSupplier.supplier?.name ||
                         `Supplier #${productSupplier.supplier_id}`}
                      </div>
                      {productSupplier.supplier?.email && (
                        <div className="text-sm text-gray-500">{productSupplier.supplier.email}</div>
                      )}
                      {!productSupplier.supplier && (
                        <div className="text-sm text-yellow-600">Loading supplier details...</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Array.isArray(productSupplier.supplier_product_urls) && productSupplier.supplier_product_urls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                            </a>
                          </div>
                        ))}
                        {!Array.isArray(productSupplier.supplier_product_urls) || productSupplier.supplier_product_urls.length === 0 ? (
                          <span className="text-gray-400">No URLs provided</span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDetachSupplier(productSupplier.supplier_id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Detach
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
  );
};