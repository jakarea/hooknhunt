import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Plus, Edit, Trash2, AlertCircle, X } from 'lucide-react';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import apiClient from '@/lib/apiClient';
import { toast } from '@/components/ui/use-toast';

interface Brand {
  id: number;
  name: string;
  slug: string;
  logo?: string;
  logo_media_id?: number;
  created_at: string;
  updated_at: string;
  products_count?: number;
}

export function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [selectedMediaUrl, setSelectedMediaUrl] = useState<string | null>(null);
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    logo_media_id: null as number | null,
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/brands');
      setBrands(response.data);
    } catch (error: any) {
      console.error('Failed to fetch brands:', error);
      setError('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

  const getLogoUrl = (logo: string | undefined): string | undefined => {
    if (!logo) return undefined;
    if (logo.startsWith('http://') || logo.startsWith('https://')) {
      return logo;
    }
    if (logo.startsWith('/storage/')) {
      return `http://localhost:8000${logo}`;
    }
    if (!logo.startsWith('/')) {
      return `http://localhost:8000/storage/${logo}`;
    }
    return `http://localhost:8000${logo}`;
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Handle name change to auto-generate slug
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  // Handle media selection from Media Library
  const handleMediaSelect = (selectedFiles: any[]) => {
    if (selectedFiles.length > 0) {
      const file = selectedFiles[0]; // Take only first file for brand logo
      setFormData(prev => ({ ...prev, logo_media_id: file.id }));
      setSelectedMediaId(file.id);
      setSelectedMediaUrl(file.url);
    }
    setIsMediaLibraryOpen(false);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      logo_media_id: null,
    });
    setSelectedMediaId(null);
    setSelectedMediaUrl(null);
    setIsMediaLibraryOpen(false);
    setSelectedBrand(null);
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      logo_media_id: brand.logo_media_id || null,
    });
    setSelectedMediaId(brand.logo_media_id || null);
    setSelectedMediaUrl(brand.logo ? getLogoUrl(brand.logo) : null);
    setIsEditDialogOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsDeleteDialogOpen(true);
  };

  // Create brand
  const handleCreateBrand = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Brand name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        logo_media_id: formData.logo_media_id,
      };

      const response = await apiClient.post('/admin/brands', payload);

      toast({
        title: 'Success',
        description: 'Brand created successfully',
      });

      setIsCreateDialogOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      console.error('Failed to create brand:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create brand',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Update brand
  const handleUpdateBrand = async () => {
    if (!selectedBrand || !formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Brand name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        logo_media_id: formData.logo_media_id,
      };

      const response = await apiClient.post(`/admin/brands/${selectedBrand.id}?_method=PUT`, payload);

      toast({
        title: 'Success',
        description: 'Brand updated successfully',
      });

      setIsEditDialogOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      console.error('Failed to update brand:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update brand',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  // Delete brand
  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;

    try {
      setProcessing(true);
      await apiClient.delete(`/admin/brands/${selectedBrand.id}`);

      toast({
        title: 'Success',
        description: 'Brand deleted successfully',
      });

      setIsDeleteDialogOpen(false);
      resetForm();
      fetchBrands();
    } catch (error: any) {
      console.error('Failed to delete brand:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete brand',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Loading Brands
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Brand Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchBrands} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600">Manage product brands</p>
        </div>
        <Button onClick={openCreateDialog} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {brand.logo ? (
                    <img
                      src={getLogoUrl(brand.logo)}
                      alt={brand.name}
                      className="h-12 w-12 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'h-12 w-12 bg-gray-100 rounded border flex items-center justify-center';
                          placeholder.innerHTML = '<span class="text-gray-400 text-xs">No Logo</span>';
                          parent.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded border flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{brand.name}</h3>
                    <p className="text-xs text-gray-500">{brand.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => openEditDialog(brand)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    onClick={() => openDeleteDialog(brand)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {brand.products_count || 0} Products
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(brand.created_at).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Brand Card */}
        <Card
          className="border-dashed border-2 hover:border-gray-400 transition-colors cursor-pointer"
          onClick={openCreateDialog}
        >
          <CardContent className="flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <Plus className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Add New Brand</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {brands.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Brands Found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first brand.</p>
            <Button onClick={openCreateDialog} className="flex items-center gap-2 mx-auto">
              <Plus className="h-4 w-4" />
              Add Brand
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Brand Dialog */}
      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false);
          setIsEditDialogOpen(false);
          resetForm();
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Brand' : 'Add New Brand'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen
                ? 'Update the brand information and logo.'
                : 'Create a new brand with a name and optional logo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Brand Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter brand name"
                className="col-span-3"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, slug: e.target.value }))
                }
                placeholder="brand-url-friendly-name"
                className="col-span-3"
              />
              <p className="text-xs text-gray-500">
                Auto-generated from brand name (lowercase, hyphens only)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Brand Logo</Label>
              <div className="space-y-3">
                {selectedMediaUrl ? (
                  <div className="relative inline-block">
                    <img
                      src={selectedMediaUrl}
                      alt="Brand logo preview"
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => {
                        setSelectedMediaId(null);
                        setSelectedMediaUrl(null);
                        setFormData(prev => ({ ...prev, logo_media_id: null }));
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="h-16 w-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsMediaLibraryOpen(true)}
                  className="w-full"
                >
                  Select from Media Library
                </Button>

                <p className="text-xs text-gray-500">
                  Optional: Select brand logo from Media Library (Max 300KB)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false);
                setIsEditDialogOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={isEditDialogOpen ? handleUpdateBrand : handleCreateBrand}
              disabled={processing || !formData.name.trim()}
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  {isEditDialogOpen ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditDialogOpen ? 'Update Brand' : 'Create Brand'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsDeleteDialogOpen(false);
          setSelectedBrand(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Brand
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedBrand?.name}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedBrand(null);
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBrand}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Brand'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Media Library Modal */}
      <MediaLibrary
        open={isMediaLibraryOpen}
        onOpenChange={setIsMediaLibraryOpen}
        onSelect={handleMediaSelect}
        multiple={false}
        acceptedTypes={['image/*']}
        maxSelections={1}
      />
    </div>
  );
}