import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { Package, Plus, Trash2, Image as ImageIcon, Wand2, AlertCircle, X, FolderOpen } from 'lucide-react';
import { useAttributeStore } from '@/stores/attributeStore';
import type { Attribute, AttributeOption } from '@/stores/attributeStore';
import api from '@/lib/api';
import { MediaLibrary } from '@/components/media/MediaLibrary';

// MediaFile interface for MediaLibrary
interface MediaFile {
  id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width?: number;
  height?: number;
  url: string;
  thumbnail_url?: string;
  path?: string;
}

interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
}

interface ProductVariant {
  id?: number;
  product_id: number;
  sku: string;
  landed_cost: number;

  // Retail
  retail_name: string;
  retail_price: number;
  retail_offer_discount_type?: 'flat' | 'percentage';
  retail_offer_discount_value?: number;

  // Wholesale
  wholesale_name: string;
  wholesale_price: number;
  moq_wholesale: number;
  wholesale_offer_discount_type?: 'flat' | 'percentage';
  wholesale_offer_discount_value?: number;

  // Daraz
  daraz_name: string;
  daraz_price: number;
  moq_daraz: number;
  daraz_offer_discount_type?: 'flat' | 'percentage';
  daraz_offer_discount_value?: number;

  // Image & Attributes
  variant_thumbnail_url?: string;
  variant_thumbnail?: MediaFile;
  attribute_options: number[]; // IDs of selected attribute options
  attribute_options_display?: AttributeOption[]; // For display purposes
}

interface ProductVariantsTabProps {
  product: Product;
  onVariantsUpdated?: () => void;
}

export const ProductVariantsTab: React.FC<ProductVariantsTabProps> = ({ product, onVariantsUpdated }) => {
  const { attributes, fetchAttributes } = useAttributeStore();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: number]: number[] }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Media library state for variant images
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [currentVariantIndex, setCurrentVariantIndex] = useState<number | null>(null);

  // Load attributes and existing variants
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchAttributes(true); // visible only
        // TODO: Load existing variants from API
        // const response = await api.get(`/admin/products/${product.id}/variants`);
        // setVariants(response.data.data || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [product.id, fetchAttributes]);

  // Generate variant combinations from selected attributes
  const generateVariants = () => {
    setIsGenerating(true);

    // Get selected attribute options
    const selectedAttrOptions: AttributeOption[][] = [];
    const selectedAttrNames: string[] = [];

    Object.entries(selectedAttributes).forEach(([attrId, optionIds]) => {
      const attribute = attributes.find(a => a.id === parseInt(attrId));
      if (attribute && optionIds.length > 0) {
        const options = attribute.options?.filter(opt => optionIds.includes(opt.id)) || [];
        if (options.length > 0) {
          selectedAttrOptions.push(options);
          selectedAttrNames.push(attribute.name);
        }
      }
    });

    if (selectedAttrOptions.length === 0) {
      toast({
        title: "No Attributes Selected",
        description: "Please select at least one attribute option to generate variants.",
        variant: "destructive"
      });
      setIsGenerating(false);
      return;
    }

    // Generate all combinations using cartesian product
    const combinations = cartesianProduct(selectedAttrOptions);

    // Create variants from combinations
    const newVariants: ProductVariant[] = combinations.map((combination, index) => {
      const optionNames = combination.map(opt => opt.value).join(' / ');
      const variantName = `${product.base_name} - ${optionNames}`;
      const sku = `${product.slug}-${index + 1}`.toUpperCase();

      return {
        product_id: product.id,
        sku: sku,
        landed_cost: 0,
        retail_name: variantName,
        retail_price: 0,
        wholesale_name: variantName,
        wholesale_price: 0,
        moq_wholesale: 10,
        daraz_name: variantName,
        daraz_price: 0,
        moq_daraz: 1,
        attribute_options: combination.map(opt => opt.id),
        attribute_options_display: combination,
      };
    });

    setVariants(newVariants);
    setIsGenerating(false);

    toast({
      title: "Variants Generated",
      description: `${newVariants.length} variant${newVariants.length > 1 ? 's' : ''} created successfully!`,
    });
  };

  // Cartesian product helper
  const cartesianProduct = (arrays: AttributeOption[][]): AttributeOption[][] => {
    return arrays.reduce(
      (acc, curr) => acc.flatMap(a => curr.map(c => [...a, c])),
      [[]] as AttributeOption[][]
    );
  };

  // Handle attribute selection
  const handleAttributeSelect = (attributeId: number, optionId: number) => {
    setSelectedAttributes(prev => {
      const current = prev[attributeId] || [];
      const exists = current.includes(optionId);

      return {
        ...prev,
        [attributeId]: exists
          ? current.filter(id => id !== optionId)
          : [...current, optionId]
      };
    });
  };

  // Handle variant field update
  const handleVariantUpdate = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle variant image upload
  const handleVariantImageChange = (index: number, mediaFile: MediaFile | null) => {
    setVariants(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], variant_thumbnail: mediaFile, variant_thumbnail_url: undefined };
      return updated;
    });
  };

  // Open media modal for variant image
  const openMediaModal = (index: number) => {
    setCurrentVariantIndex(index);
    setShowMediaModal(true);
  };

  // Handle media selection from modal
  const handleMediaSelect = (files: MediaFile[]) => {
    if (currentVariantIndex !== null && files.length > 0) {
      handleVariantImageChange(currentVariantIndex, files[0]);
    }
    setShowMediaModal(false);
    setCurrentVariantIndex(null);
  };

  // Remove variant
  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  // Save variants
  const saveVariants = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save variants
      // for (const variant of variants) {
      //   const formData = new FormData();
      //   Object.entries(variant).forEach(([key, value]) => {
      //     if (key === 'variant_thumbnail' && value instanceof MediaFile) {
      //       formData.append('media_file_id', value.id.toString());
      //       if (value.path) {
      //         formData.append('variant_thumbnail_url', value.path);
      //       }
      //     } else if (key === 'attribute_options') {
      //       formData.append(key, JSON.stringify(value));
      //     } else if (value !== undefined && value !== null) {
      //       formData.append(key, value.toString());
      //     }
      //   });
      //   await api.post(`/admin/products/${product.id}/variants`, formData);
      // }

      toast({
        title: "Variants Saved",
        description: `${variants.length} variant${variants.length > 1 ? 's' : ''} saved successfully!`,
      });

      onVariantsUpdated?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save variants",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-gray-500">Loading attributes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Select Attributes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Step 1: Select Attribute Options
          </CardTitle>
          <CardDescription>
            Choose which attribute options (e.g., colors, sizes) you want to create variants for.
            You can select multiple options per attribute.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {attributes.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="font-medium text-yellow-900">No Attributes Found</p>
              <p className="text-sm text-yellow-800 mt-1">
                Please create attributes (like Color, Size) in the Attributes module first.
              </p>
            </div>
          ) : (
            attributes.map(attribute => (
              <div key={attribute.id} className="space-y-3">
                <Label className="text-base font-semibold">
                  {attribute.display_name || attribute.name}
                </Label>
                <div className="flex flex-wrap gap-2">
                  {attribute.options && attribute.options.length > 0 ? (
                    attribute.options.map(option => {
                      const isSelected = selectedAttributes[attribute.id]?.includes(option.id);

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleAttributeSelect(attribute.id, option.id)}
                          className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all
                            ${isSelected
                              ? 'border-primary bg-primary text-white shadow-md'
                              : 'border-gray-300 bg-white hover:border-primary hover:bg-primary/5'
                            }
                          `}
                        >
                          {attribute.type === 'color' && option.color_code && (
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300"
                              style={{ backgroundColor: option.color_code }}
                            />
                          )}
                          {attribute.type === 'image' && option.image_url && (
                            <img
                              src={option.image_url}
                              alt={option.value}
                              className="w-6 h-6 rounded object-cover"
                            />
                          )}
                          <span className="font-medium">
                            {option.display_value || option.value}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No options available for this attribute
                    </p>
                  )}
                </div>
              </div>
            ))
          )}

          {attributes.length > 0 && (
            <div className="pt-4">
              <Button
                onClick={generateVariants}
                disabled={isGenerating || Object.keys(selectedAttributes).length === 0}
                className="w-full md:w-auto"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Variants'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Configure Variants */}
      {variants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Step 2: Configure Variants ({variants.length})
            </CardTitle>
            <CardDescription>
              Set pricing, SKU, and upload images for each variant. Names are pre-filled based on the product name and selected attributes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {variants.map((variant, index) => (
              <Card key={index} className="border-2 border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {variant.attribute_options_display?.map((opt, optIdx) => {
                          const attr = attributes.find(a =>
                            a.options?.some(o => o.id === opt.id)
                          );

                          return (
                            <Badge key={optIdx} variant="outline" className="gap-1">
                              {attr?.type === 'color' && opt.color_code && (
                                <span
                                  className="w-3 h-3 rounded-full border"
                                  style={{ backgroundColor: opt.color_code }}
                                />
                              )}
                              {opt.display_value || opt.value}
                            </Badge>
                          );
                        })}
                      </div>
                      <h4 className="font-semibold text-lg">{variant.retail_name}</h4>
                      <p className="text-sm text-gray-500">SKU: {variant.sku}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`sku-${index}`}>SKU *</Label>
                      <Input
                        id={`sku-${index}`}
                        value={variant.sku}
                        onChange={(e) => handleVariantUpdate(index, 'sku', e.target.value)}
                        placeholder="PRODUCT-SKU-001"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`landed-cost-${index}`}>Landed Cost (৳)</Label>
                      <Input
                        id={`landed-cost-${index}`}
                        type="number"
                        step="0.01"
                        value={variant.landed_cost}
                        disabled
                        placeholder="0.00"
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-[10px] text-gray-500 mt-1">
                        Managed through purchase orders
                      </p>
                    </div>
                  </div>

                  {/* Variant Image */}
                  <div>
                    <Label>Variant Image (Optional)</Label>
                    <div className="mt-2">
                      {variant.variant_thumbnail || variant.variant_thumbnail_url ? (
                        <div className="flex items-center gap-4">
                          <img
                            src={variant.variant_thumbnail
                              ? variant.variant_thumbnail.url
                              : variant.variant_thumbnail_url
                            }
                            alt="Variant"
                            className="h-20 w-20 object-cover rounded border-2 border-gray-200"
                          />
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openMediaModal(index)}
                            >
                              <FolderOpen className="h-4 w-4 mr-1" />
                              Change
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVariantImageChange(index, null)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => openMediaModal(index)}
                          className="w-full border-dashed"
                        >
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Select from Media Library
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Channel Pricing */}
                  <div className="space-y-6">
                    {/* Retail */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-primary">Retail Channel</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor={`retail-name-${index}`}>Retail Name *</Label>
                          <Input
                            id={`retail-name-${index}`}
                            value={variant.retail_name}
                            onChange={(e) => handleVariantUpdate(index, 'retail_name', e.target.value)}
                            placeholder="Product name for retail customers"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`retail-price-${index}`}>Retail Price *</Label>
                          <Input
                            id={`retail-price-${index}`}
                            type="number"
                            step="0.01"
                            value={variant.retail_price}
                            onChange={(e) => handleVariantUpdate(index, 'retail_price', parseFloat(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Wholesale */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-blue-600">Wholesale Channel</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                          <Label htmlFor={`wholesale-name-${index}`}>Wholesale Name *</Label>
                          <Input
                            id={`wholesale-name-${index}`}
                            value={variant.wholesale_name}
                            onChange={(e) => handleVariantUpdate(index, 'wholesale_name', e.target.value)}
                            placeholder="Product name for wholesale customers"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`wholesale-price-${index}`}>Wholesale Price *</Label>
                          <Input
                            id={`wholesale-price-${index}`}
                            type="number"
                            step="0.01"
                            value={variant.wholesale_price}
                            onChange={(e) => handleVariantUpdate(index, 'wholesale_price', parseFloat(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`moq-wholesale-${index}`}>MOQ *</Label>
                          <Input
                            id={`moq-wholesale-${index}`}
                            type="number"
                            value={variant.moq_wholesale}
                            onChange={(e) => handleVariantUpdate(index, 'moq_wholesale', parseInt(e.target.value))}
                            placeholder="10"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Daraz */}
                    <div className="space-y-3">
                      <h5 className="font-semibold text-orange-600">Daraz Channel</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-3">
                          <Label htmlFor={`daraz-name-${index}`}>Daraz Name *</Label>
                          <Input
                            id={`daraz-name-${index}`}
                            value={variant.daraz_name}
                            onChange={(e) => handleVariantUpdate(index, 'daraz_name', e.target.value)}
                            placeholder="Product name for Daraz marketplace"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`daraz-price-${index}`}>Daraz Price *</Label>
                          <Input
                            id={`daraz-price-${index}`}
                            type="number"
                            step="0.01"
                            value={variant.daraz_price}
                            onChange={(e) => handleVariantUpdate(index, 'daraz_price', parseFloat(e.target.value))}
                            placeholder="0.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`moq-daraz-${index}`}>MOQ *</Label>
                          <Input
                            id={`moq-daraz-${index}`}
                            type="number"
                            value={variant.moq_daraz}
                            onChange={(e) => handleVariantUpdate(index, 'moq_daraz', parseInt(e.target.value))}
                            placeholder="1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setVariants([])}
                disabled={isSaving}
              >
                Clear All
              </Button>
              <Button
                onClick={saveVariants}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4 mr-2" />
                    Save Variants
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {variants.length === 0 && (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No Variants Generated Yet
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              Select attribute options above and click "Generate Variants" to create product variations.
              Each combination will become a separate variant with its own SKU and pricing.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Media Library Modal */}
      <MediaLibrary
        open={showMediaModal}
        onOpenChange={setShowMediaModal}
        onSelect={handleMediaSelect}
        multiple={false}
        acceptedTypes={['image/*']}
      />
    </div>
  );
};
