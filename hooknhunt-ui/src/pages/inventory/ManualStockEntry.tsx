import { useState, useEffect } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import {
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  Upload,
  X,
  DollarSign,
  FileText,
} from 'lucide-react';
import api from '@/lib/api';

// ============================================================================
// TYPES FOR API DATA
// ============================================================================

interface AttributeOption {
  id: number;
  attribute_id: number;
  value: string;
  display_value: string;
  color_code?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_default: boolean;
}

interface Attribute {
  id: number;
  name: string;
  display_name: string;
  type: string;
  is_required: boolean;
  is_visible: boolean;
  sort_order: number;
  options: AttributeOption[];
}

// ============================================================================
// TYPES FOR PRODUCTS
// ============================================================================

interface Product {
  id: number;
  base_name: string;
  slug: string;
}

const DEFAULT_MARGINS = {
  retail: 50,
  wholesale: 20,
  daraz: 60,
};

// ============================================================================
// TYPES
// ============================================================================

interface Channel {
  retail: boolean;
  wholesale: boolean;
  daraz: boolean;
}

interface VariantRow {
  id: string;
  internalName: string;
  sku: string;
  color?: string;
  size?: string;
  thumbnail: string; // Main thumbnail for the variant
  stockQty: string;
  landedCost: string;

  // Platform-wise names (optional)
  retailName: string;
  wholesaleName: string;
  darazName: string;

  // Platform-wise thumbnails (optional, for future use)
  retailThumb: string;
  wholesaleThumb: string;
  darazThumb: string;

  // Platform-wise pricing
  retailPrice: string;
  retailOfferPrice: string;
  retailOfferStart: string;
  retailOfferEnd: string;

  wholesalePrice: string;
  wholesaleOfferPrice: string;
  wholesaleOfferStart: string;
  wholesaleOfferEnd: string;

  darazPrice: string;
  darazOfferPrice: string;
  darazOfferStart: string;
  darazOfferEnd: string;
}

interface ProductLevelData {
  // Product Gallery (shared across all variants)
  galleryImages: string[];
  // Global SEO Data (shared across all platforms)
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  seoSlug: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculatePrice = (landedCost: string, marginPercent: number): string => {
  const cost = parseFloat(landedCost);
  if (!cost || cost <= 0 || !marginPercent || marginPercent <= 0) return '';
  const margin = cost * (marginPercent / 100);
  return Math.ceil(cost + margin).toString();
};

const calculateProfitPercent = (sellingPrice: string, landedCost: string): string => {
  const price = parseFloat(sellingPrice);
  const cost = parseFloat(landedCost);
  if (!price || !cost || cost === 0) return '0';
  return (((price - cost) / cost) * 100).toFixed(1);
};

const calculateProfitAmount = (sellingPrice: string, landedCost: string): string => {
  const price = parseFloat(sellingPrice);
  const cost = parseFloat(landedCost);
  if (!price || !cost) return '0';
  return (price - cost).toFixed(2);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ManualStockEntry = () => {
  const { t } = useTranslation('manual-stock-entry');
  // Add shake animation style
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
        20%, 40%, 60%, 80% { transform: translateX(2px); }
      }
      .shake {
        animation: shake 0.5s ease-in-out;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Channel toggles (wholesale always on)
  const [channels, setChannels] = useState<Channel>({
    retail: true,
    wholesale: true, // Always true
    daraz: false,
  });

  // Attributes from API
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState<boolean>(true);

  // Products from API
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Step 1: Product Selection
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productType, setProductType] = useState<'simple' | 'variable'>('variable');

  // Step 2: Attribute Selection (for variable products)
  const [selectedAttributeOptions, setSelectedAttributeOptions] = useState<{[attributeId: number]: number[]}>({});

  // Step 3: Variant Data
  const [variants, setVariants] = useState<VariantRow[]>([]);

  // Product Level Data
  const [productData, setProductData] = useState<ProductLevelData>({
    galleryImages: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    seoSlug: '',
  });

  // Selected product for preview
  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    selectedProduct?: string;
    variants?: string[];
    variantSkus?: {[variantId: string]: string | undefined};
    variantLandedCosts?: {[variantId: string]: string | undefined};
  }>({});
  const [isSaveButtonShaking, setIsSaveButtonShaking] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ============================================================================
  // FETCH DATA ON MOUNT AND WHEN PRODUCT CHANGES
  // ============================================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attributes
        setLoadingAttributes(true);
        const attributesResponse = await api.get('/admin/attributes?all=true');
        console.log('Raw API response:', attributesResponse);
        console.log('Attributes data:', attributesResponse.data);
        console.log('Number of attributes:', attributesResponse.data?.length || 0);

        // Force set with test data if API returns empty
        const data = attributesResponse.data?.length > 0 ? attributesResponse.data : [
          {
            id: 1,
            name: 'color',
            display_name: 'Color',
            type: 'color',
            is_required: true,
            is_visible: true,
            sort_order: 1,
            options: [
              { id: 1, attribute_id: 1, value: 'red', display_value: 'Red', color_code: '#FF0000', sort_order: 1, is_default: false },
              { id: 2, attribute_id: 1, value: 'blue', display_value: 'Blue', color_code: '#0000FF', sort_order: 2, is_default: false },
              { id: 3, attribute_id: 1, value: 'green', display_value: 'Green', color_code: '#00FF00', sort_order: 3, is_default: false }
            ]
          },
          {
            id: 2,
            name: 'size',
            display_name: 'Size',
            type: 'select',
            is_required: true,
            is_visible: true,
            sort_order: 2,
            options: [
              { id: 4, attribute_id: 2, value: 's', display_value: 'S', color_code: null, sort_order: 1, is_default: false },
              { id: 5, attribute_id: 2, value: 'm', display_value: 'M', color_code: null, sort_order: 2, is_default: false },
              { id: 6, attribute_id: 2, value: 'l', display_value: 'L', color_code: null, sort_order: 3, is_default: false }
            ]
          }
        ];

        console.log('Final data being set:', data);
        setAttributes(data);
        setLoadingAttributes(false);

        // Fetch products
        setLoadingProducts(true);
        const productsResponse = await api.get('/admin/products?all=true');
        setProducts(productsResponse.data);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);

        // More detailed error logging
        if (error.response) {
          console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Request setup error:', error.message);
        }

        setLoadingAttributes(false);
        setLoadingProducts(false);
      }
    };

    fetchData();
  }, []);

  // Debug: Track attributes state changes
  useEffect(() => {
    console.log('Attributes state changed:', {
      length: attributes.length,
      data: attributes
    });
  }, [attributes]);

  // Fetch product SEO data when product is selected
  useEffect(() => {
    if (selectedProductId) {
      const fetchProductSEOData = async () => {
        try {
          const response = await api.get(`/admin/products/${selectedProductId}`);
          const product = response.data;

          // Update product data with existing SEO information
          setProductData({
            galleryImages: product.gallery_images || [],
            metaTitle: product.meta_title || '',
            metaDescription: product.meta_description || '',
            metaKeywords: product.meta_keywords || '',
            seoSlug: product.slug || '',
          });
        } catch (error) {
          console.error('Failed to fetch product SEO data:', error);
          // Reset to empty on error
          setProductData({
            galleryImages: [],
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            seoSlug: '',
          });
        }
      };

      fetchProductSEOData();
    }
  }, [selectedProductId]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleChannel = (channel: keyof Channel) => {
    // Wholesale is always enabled, don't allow toggling it
    if (channel === 'wholesale') return;
    setChannels(prev => ({ ...prev, [channel]: !prev[channel] }));
  };

  const toggleAttributeOption = (attributeId: number, optionId: number) => {
    setSelectedAttributeOptions(prev => {
      const currentOptions = prev[attributeId] || [];
      const newOptions = currentOptions.includes(optionId)
        ? currentOptions.filter(id => id !== optionId)
        : [...currentOptions, optionId];

      return {
        ...prev,
        [attributeId]: newOptions,
      };
    });
  };

  const generateVariants = () => {
    if (!selectedProduct) return;

    const newVariants: VariantRow[] = [];

    if (productType === 'simple') {
      // Create single variant
      const defaultName = selectedProduct?.base_name || 'Default';
      newVariants.push({
        id: '1',
        internalName: defaultName,
        sku: '', // SKU is required - must be entered by user
        thumbnail: '',
        stockQty: '',
        landedCost: '',
        // Initialize all platform names with the same value
        retailName: defaultName,
        wholesaleName: defaultName,
        darazName: defaultName,
        retailThumb: '',
        wholesaleThumb: '',
        darazThumb: '',
        retailPrice: '',
        retailOfferPrice: '',
        retailOfferStart: '',
        retailOfferEnd: '',
        wholesalePrice: '',
        wholesaleOfferPrice: '',
        wholesaleOfferStart: '',
        wholesaleOfferEnd: '',
        darazPrice: '',
        darazOfferPrice: '',
        darazOfferStart: '',
        darazOfferEnd: '',
      });
    } else {
      // Check if any attribute options are selected
      const hasSelections = Object.values(selectedAttributeOptions).some(opts => opts.length > 0);
      if (!hasSelections) {
        alert(t('variant_generator.select_option_alert'));
        return;
      }

      // Get all selected attribute options
      const selectedOptions: AttributeOption[][] = [];
      Object.entries(selectedAttributeOptions).forEach(([attributeIdStr, optionIds]) => {
        if (optionIds.length > 0) {
          const attributeId = parseInt(attributeIdStr);
          const attribute = attributes.find(a => a.id === attributeId);
          if (attribute) {
            const options = attribute.options.filter(opt => optionIds.includes(opt.id));
            if (options.length > 0) {
              selectedOptions.push(options);
            }
          }
        }
      });

      // Generate all combinations
      const combinations = generateCombinations(selectedOptions);

      let idCounter = 1;
      combinations.forEach(combination => {
        const displayValues = combination.map(opt => opt.display_value).join(' - ');
        // Include product name with variant attributes for better identification
        const variantFullName = selectedProduct?.base_name ? `${selectedProduct.base_name} - ${displayValues}` : displayValues;

        newVariants.push({
          id: idCounter.toString(),
          internalName: variantFullName,
          sku: '', // SKU is required - must be entered by user
          thumbnail: '',
          stockQty: '',
          landedCost: '',
          // Initialize all platform names with the same value (from internal name)
          retailName: variantFullName,
          wholesaleName: variantFullName,
          darazName: variantFullName,
          retailThumb: '',
          wholesaleThumb: '',
          darazThumb: '',
          retailPrice: '',
          retailOfferPrice: '',
          retailOfferStart: '',
          retailOfferEnd: '',
          wholesalePrice: '',
          wholesaleOfferPrice: '',
          wholesaleOfferStart: '',
          wholesaleOfferEnd: '',
          darazPrice: '',
          darazOfferPrice: '',
          darazOfferStart: '',
          darazOfferEnd: '',
        });
        idCounter++;
      });
    }

    setVariants(newVariants);
  };

  // Helper function to generate all combinations of attribute options
  const generateCombinations = (arrays: AttributeOption[][]): AttributeOption[][] => {
    if (arrays.length === 0) return [[]];
    if (arrays.length === 1) return arrays[0].map(item => [item]);

    const result: AttributeOption[][] = [];
    const restCombinations = generateCombinations(arrays.slice(1));

    arrays[0].forEach(item => {
      restCombinations.forEach(combination => {
        result.push([item, ...combination]);
      });
    });

    return result;
  };

  const updateVariant = (id: string, field: keyof VariantRow, value: string) => {
    setVariants(prev =>
      prev.map(variant => {
        if (variant.id === id) {
          const updated = { ...variant, [field]: value };

          // Auto-calculate prices when landed cost changes
          if (field === 'landedCost') {
            if (channels.retail) updated.retailPrice = calculatePrice(value, DEFAULT_MARGINS.retail);
            if (channels.wholesale) updated.wholesalePrice = calculatePrice(value, DEFAULT_MARGINS.wholesale);
            if (channels.daraz) updated.darazPrice = calculatePrice(value, DEFAULT_MARGINS.daraz);
          }

          return updated;
        }
        return variant;
      })
    );
  };

  const removeVariant = (id: string) => {
    setVariants(prev => prev.filter(variant => variant.id !== id));
  };

  const updateProductData = (field: keyof ProductLevelData, value: string[] | string) => {
    setProductData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductGalleryUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImageUrls: string[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImageUrls.push(reader.result as string);
        if (newImageUrls.length === files.length) {
          updateProductData('galleryImages', [...productData.galleryImages, ...newImageUrls]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeProductGalleryImage = (imageIndex: number) => {
    updateProductData(
      'galleryImages',
      productData.galleryImages.filter((_, idx) => idx !== imageIndex)
    );
  };

  const handleVariantThumbnailUpload = (variantId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateVariant(variantId, 'thumbnail', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveStock = async () => {
    // Clear previous errors
    setValidationErrors({});

    const errors: typeof validationErrors = {};

    // Validate product selection
    if (!selectedProductId) {
      errors.selectedProduct = t('validation.select_product');
    }

    // Validate variants exist
    if (variants.length === 0) {
      errors.variants = [t('validation.generate_variants')];
    }

    // Validate SKU and Landed Cost for each variant
    const skuErrors: {[variantId: string]: string} = {};
    const landedCostErrors: {[variantId: string]: string} = {};
    variants.forEach(variant => {
      // SKU validation
      if (!variant.sku || variant.sku.trim() === '') {
        skuErrors[variant.id] = t('api_errors.sku_required');
      }
      // Landed Cost validation
      if (!variant.landedCost || variant.landedCost.trim() === '' || parseFloat(variant.landedCost) < 0) {
        landedCostErrors[variant.id] = t('api_errors.landed_cost_required');
      }
    });

    if (Object.keys(skuErrors).length > 0) {
      errors.variantSkus = skuErrors;
    }
    if (Object.keys(landedCostErrors).length > 0) {
      errors.variantLandedCosts = landedCostErrors;
    }

    // If there are errors, show them and shake button
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSaveButtonShaking(true);
      setTimeout(() => setIsSaveButtonShaking(false), 500);
      return;
    }

    try {
      // Prepare payload
      const payload = {
        product_id: parseInt(selectedProductId),
        product_data: {
          gallery_images: productData.galleryImages,
          meta_title: productData.metaTitle,
          meta_description: productData.metaDescription,
          meta_keywords: productData.metaKeywords,
          seo_slug: productData.seoSlug,
        },
        variants: variants.map(variant => ({
          internal_name: variant.internalName,
          sku: variant.sku, // Required field
          thumbnail: variant.thumbnail || null,
          stock_qty: parseInt(variant.stockQty) || 0,
          landed_cost: parseFloat(variant.landedCost) || 0,
          // Wholesale
          wholesale_name: variant.wholesaleName || variant.internalName,
          wholesale_price: parseFloat(variant.wholesalePrice) || 0,
          wholesale_offer_price: variant.wholesaleOfferPrice ? parseFloat(variant.wholesaleOfferPrice) : null,
          wholesale_offer_start: variant.wholesaleOfferStart || null,
          wholesale_offer_end: variant.wholesaleOfferEnd || null,
          // Retail
          retail_name: variant.retailName || variant.internalName,
          retail_price: parseFloat(variant.retailPrice) || 0,
          retail_offer_price: variant.retailOfferPrice ? parseFloat(variant.retailOfferPrice) : null,
          retail_offer_start: variant.retailOfferStart || null,
          retail_offer_end: variant.retailOfferEnd || null,
          // Daraz
          daraz_name: variant.darazName || variant.internalName,
          daraz_price: parseFloat(variant.darazPrice) || 0,
          daraz_offer_price: variant.darazOfferPrice ? parseFloat(variant.darazOfferPrice) : null,
          daraz_offer_start: variant.darazOfferStart || null,
          daraz_offer_end: variant.darazOfferEnd || null,
        })),
      };

      const response = await api.post('/admin/inventory/manual-entry', payload);

      if (response.status === 201) {
        setSaveSuccess(true);
        setSaveError(null);
        // Reset form after a delay
        setTimeout(() => {
          setVariants([]);
          setSelectedProductId('');
          setSelectedAttributeOptions({});
          setProductData({
            galleryImages: [],
            metaTitle: '',
            metaDescription: '',
            metaKeywords: '',
            seoSlug: '',
          });
          setSaveSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to save stock entry:', error);
      const errorResponse = (error as any).response;

      if (errorResponse?.status === 422 && errorResponse?.data?.errors) {
        // Validation errors from Laravel
        const laravelErrors = errorResponse.data.errors;

        // Convert Laravel validation errors to our format
        const fieldErrors: {
          variantSkus?: {[variantId: string]: string};
          variantLandedCosts?: {[variantId: string]: string};
        } = {};

        const skuErrors: {[variantId: string]: string} = {};
        const landedCostErrors: {[variantId: string]: string} = {};

        // Process all Laravel validation errors
        Object.keys(laravelErrors).forEach(key => {
          // Extract variant index from Laravel error keys like "variants.0.sku" or "variants.1.landed_cost"
          const variantIndexMatch = key.match(/variants\.(\d+)\./);

          if (variantIndexMatch) {
            const variantIndex = parseInt(variantIndexMatch[1]);
            const variant = variants[variantIndex];

            if (variant) {
              // Map to specific field errors
              if (key.includes('.sku')) {
                skuErrors[variant.id] = laravelErrors[key][0];
              } else if (key.includes('.landed_cost')) {
                landedCostErrors[variant.id] = laravelErrors[key][0];
              }
            }
          }
        });

        // Set field-specific errors
        if (Object.keys(skuErrors).length > 0) {
          fieldErrors.variantSkus = skuErrors;
        }
        if (Object.keys(landedCostErrors).length > 0) {
          fieldErrors.variantLandedCosts = landedCostErrors;
        }

        // Only show general error if there are no field-specific errors
        if (Object.keys(fieldErrors).length > 0) {
          setValidationErrors(fieldErrors);
          setSaveError(null); // Don't show general error when we have field errors
        } else {
          // Show general error only if no field errors were found
          const errorMessage = errorResponse.data.message || 'Validation failed';
          setSaveError(errorMessage);
        }
      } else {
        // Other errors (network, server, etc.)
        const errorMessage = errorResponse?.data?.message || 'Failed to save stock entry';
        setSaveError(errorMessage);
      }

      setIsSaveButtonShaking(true);
      setTimeout(() => setIsSaveButtonShaking(false), 500);
    }
  };

  // Reset when product type changes (but keep SEO data if product is selected)
  useEffect(() => {
    setVariants([]);
    setSelectedAttributeOptions({});
    // Only reset SEO data if no product is selected
    if (!selectedProductId) {
      setProductData({
        galleryImages: [],
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        seoSlug: '',
      });
    }
  }, [productType, selectedProductId]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('header.title')}</h1>
                <p className="text-xs text-gray-600">{t('header.subtitle')}</p>
              </div>
            </div>

            {/* Channel Switches */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch id="wholesale" checked={channels.wholesale} disabled className="opacity-100" />
                <Label htmlFor="wholesale" className="text-sm font-medium text-blue-600">
                  {t('channels.wholesale', { margin: DEFAULT_MARGINS.wholesale })}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="retail" checked={channels.retail} onCheckedChange={() => toggleChannel('retail')} />
                <Label htmlFor="retail" className="cursor-pointer text-sm font-medium text-red-600">
                  {t('channels.retail', { margin: DEFAULT_MARGINS.retail })}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="daraz" checked={channels.daraz} onCheckedChange={() => toggleChannel('daraz')} />
                <Label htmlFor="daraz" className="cursor-pointer text-sm font-medium text-orange-600">
                  {t('channels.daraz', { margin: DEFAULT_MARGINS.daraz })}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-4">
        {/* Validation Summary Banner */}
        {(validationErrors.selectedProduct || validationErrors.variants || validationErrors.variantSkus || validationErrors.variantLandedCosts) && (
          <Card className="shadow-lg border-red-500 border-2 bg-red-50 sticky top-4 z-10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-base font-bold mb-2">{t('validation.errors_title')}</p>
                  <ul className="space-y-1 text-sm text-red-600">
                    {validationErrors.selectedProduct && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {validationErrors.selectedProduct}
                      </li>
                    )}
                    {validationErrors.variants && validationErrors.variants.map((error, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {error}
                      </li>
                    ))}
                    {validationErrors.variantSkus && Object.keys(validationErrors.variantSkus).length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {t('validation.sku_missing', { count: Object.keys(validationErrors.variantSkus).length })}
                      </li>
                    )}
                    {validationErrors.variantLandedCosts && Object.keys(validationErrors.variantLandedCosts).length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {t('validation.landed_cost_missing', { count: Object.keys(validationErrors.variantLandedCosts).length })}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Product Selection - Compact */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('product_selection.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="product" className="text-sm">{t('product_selection.product_label')}</Label>
                  <Select value={selectedProductId} onValueChange={setSelectedProductId} disabled={loadingProducts}>
                    <SelectTrigger id="product" className={`h-9 ${validationErrors.selectedProduct ? 'border-red-500 border-2 focus:ring-red-500 bg-red-50' : ''}`}>
                      <SelectValue placeholder={loadingProducts ? t('product_selection.product_placeholder_loading') : t('product_selection.product_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.base_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.selectedProduct && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm font-medium">{validationErrors.selectedProduct}</p>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-sm">{t('product_selection.type_label')}</Label>
                  <RadioGroup
                    value={productType}
                    onValueChange={(value) => setProductType(value as 'simple' | 'variable')}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="simple" id="simple" />
                      <Label htmlFor="simple" className="cursor-pointer text-sm">{t('product_selection.simple_type')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="variable" id="variable" />
                      <Label htmlFor="variable" className="cursor-pointer text-sm">{t('product_selection.variable_type')}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* Step 2: Variant Generator - Compact */}
        {productType === 'variable' && selectedProduct && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {t('variant_generator.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingAttributes ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{t('variant_generator.loading_attributes')}</p>
                </div>
              ) : attributes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{t('variant_generator.no_attributes')}</p>
                  <p className="text-xs text-gray-400 mt-1">{t('variant_generator.check_console')}</p>
                </div>
              ) : (
                <>
                  {attributes.map(attribute => (
                    <div key={attribute.id}>
                      <Label className="text-sm mb-2 block">{attribute.display_name}</Label>
                      <div className="flex flex-wrap gap-2">
                        {attribute.options.map(option => {
                          const isSelected = selectedAttributeOptions[attribute.id]?.includes(option.id) || false;

                          return (
                            <button
                              key={option.id}
                              onClick={() => toggleAttributeOption(attribute.id, option.id)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-all ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50 font-medium'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {attribute.type === 'color' && option.color_code && (
                                <span
                                  className="w-3 h-3 rounded-full border"
                                  style={{
                                    backgroundColor: option.color_code,
                                    borderColor: option.color_code === '#FFFFFF' ? '#000' : option.color_code,
                                  }}
                                />
                              )}
                              {option.display_value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Generate Button */}
                  <Button onClick={generateVariants} className="w-full" size="sm" disabled={!selectedProduct}>
                    <Layers className="h-4 w-4 mr-2" />
                    {t('variant_generator.generate_button')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generate Simple Product Button */}
        {productType === 'simple' && selectedProduct && variants.length === 0 && (
          <Button onClick={generateVariants} className="w-full" size="sm">
            <Package className="h-4 w-4 mr-2" />
            {t('simple_product.create_button')}
          </Button>
        )}

        {/* Error message for missing variants when validation fails */}
        {selectedProduct && variants.length === 0 && validationErrors.variants && (
          <Card className="shadow-sm border-red-500 border-2 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-600 text-sm font-semibold">{t('validation.validation_error')}</p>
                  <p className="text-red-600 text-sm">{validationErrors.variants[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Variants Table - Compact */}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('variants_table.title', { productName: selectedProduct?.base_name })}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {t(variants.length > 1 ? 'variants_table.count_plural' : 'variants_table.count_single', { count: variants.length })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 py-2 text-center font-medium text-gray-700 w-12"></th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-16">{t('variants_table.header.thumb')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-28">{t('variants_table.header.variant')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('variants_table.header.sku')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('variants_table.header.stock')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('variants_table.header.cost')}</th>
                        {channels.wholesale && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-blue-700 border-l border-blue-200" colSpan={5}>
                              {t('variants_table.header.wholesale')}
                            </th>
                          </>
                        )}
                        {channels.retail && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-red-700 border-l border-red-200" colSpan={5}>
                              {t('variants_table.header.retail')}
                            </th>
                          </>
                        )}
                        {channels.daraz && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-orange-700 border-l border-orange-200" colSpan={5}>
                              {t('variants_table.header.daraz')}
                            </th>
                          </>
                        )}
                      </tr>
                      <tr className="bg-gray-50 border-b text-xs">
                        <th className="px-3 py-1.5"></th>
                        <th className="px-3 py-1.5"></th>
                        <th className="px-3 py-1.5"></th>
                        <th className="px-3 py-1.5"></th>
                        <th className="px-3 py-1.5"></th>
                        {channels.wholesale && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-blue-200">{t('variants_table.header.name')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.price')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.offer')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.start')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.end')}</th>
                          </>
                        )}
                        {channels.retail && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-red-200">{t('variants_table.header.name')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.price')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.offer')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.start')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.end')}</th>
                          </>
                        )}
                        {channels.daraz && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-orange-200">{t('variants_table.header.name')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.price')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.offer')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.start')}</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">{t('variants_table.header.end')}</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {variants.map((variant, idx) => (
                        <tr key={variant.id} className={`border-b hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                          {/* Remove Variant */}
                          <td className="px-3 py-2 text-center">
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              onClick={() => removeVariant(variant.id)}
                              title={t('variants_table.remove_variant_tooltip')}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>

                          {/* Variant Thumbnail */}
                          <td className="px-3 py-2">
                            <div className="relative group">
                              <label htmlFor={`thumb-${variant.id}`} className="cursor-pointer block">
                                {variant.thumbnail ? (
                                  <img
                                    src={variant.thumbnail}
                                    alt={variant.internalName}
                                    className="w-12 h-12 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                                  />
                                ) : (
                                  <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-blue-500 transition-colors">
                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </label>
                              <input
                                id={`thumb-${variant.id}`}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleVariantThumbnailUpload(variant.id, e)}
                              />
                              {variant.thumbnail && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-4 w-4 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => updateVariant(variant.id, 'thumbnail', '')}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </td>

                          {/* Variant Info */}
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium truncate" title={variant.internalName}>
                                {productType === 'simple' ? variant.internalName : variant.internalName.split(' - ').slice(1).join(' - ')}
                              </span>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="px-3 py-2 align-top">
                            <div>
                              <Input
                                type="text"
                                placeholder={t('variants_table.required_placeholder')}
                                value={variant.sku}
                                onChange={(e) => {
                                  updateVariant(variant.id, 'sku', e.target.value);
                                  // Clear error when user starts typing
                                  if (validationErrors.variantSkus?.[variant.id]) {
                                    setValidationErrors(prev => ({
                                      ...prev,
                                      variantSkus: {
                                        ...prev.variantSkus,
                                        [variant.id]: undefined
                                      }
                                    }));
                                  }
                                }}
                                className={`h-8 text-xs w-24 ${validationErrors.variantSkus?.[variant.id] ? 'border-red-500 border-2 ring-2 ring-red-200 bg-red-50' : ''}`}
                                required
                              />
                              {validationErrors.variantSkus?.[variant.id] && (
                                <div className="mt-1.5 p-1.5 bg-red-100 border border-red-300 rounded flex items-start gap-1 min-w-max">
                                  <svg className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-red-700 text-xs font-semibold leading-tight whitespace-nowrap">{validationErrors.variantSkus[variant.id]}</p>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              placeholder="0"
                              value={variant.stockQty}
                              onChange={(e) => updateVariant(variant.id, 'stockQty', e.target.value)}
                              className="h-8 text-xs w-19"
                            />
                          </td>

                          {/* Landed Cost */}
                          <td className="px-3 py-2 align-top">
                            <div>
                              <Input
                                type="number"
                                placeholder={t('variants_table.required_placeholder')}
                                value={variant.landedCost}
                                onChange={(e) => {
                                  updateVariant(variant.id, 'landedCost', e.target.value);
                                  // Clear error when user starts typing
                                  if (validationErrors.variantLandedCosts?.[variant.id]) {
                                    setValidationErrors(prev => ({
                                      ...prev,
                                      variantLandedCosts: {
                                        ...prev.variantLandedCosts,
                                        [variant.id]: undefined
                                      }
                                    }));
                                  }
                                }}
                                className={`h-8 text-xs w-24 ${validationErrors.variantLandedCosts?.[variant.id] ? 'border-red-500 border-2 ring-2 ring-red-200 bg-red-50' : ''}`}
                                required
                                min="0"
                                step="0.01"
                              />
                              {validationErrors.variantLandedCosts?.[variant.id] && (
                                <div className="mt-1.5 p-1.5 bg-red-100 border border-red-300 rounded flex items-start gap-1 min-w-max">
                                  <svg className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-red-700 text-xs font-semibold leading-tight whitespace-nowrap">{validationErrors.variantLandedCosts[variant.id]}</p>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Wholesale Channel */}
                          {channels.wholesale && (
                            <>
                              <td className="px-3 py-2 border-l border-blue-100">
                                <Input
                                  type="text"
                                  placeholder={t('variants_table.optional_placeholder')}
                                  value={variant.wholesaleName}
                                  onChange={(e) => updateVariant(variant.id, 'wholesaleName', e.target.value)}
                                  className="h-8 text-xs w-40"
                                />
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.wholesalePrice}
                                  onChange={(e) => updateVariant(variant.id, 'wholesalePrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.wholesalePrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.wholesalePrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.wholesalePrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.wholesalePrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.wholesalePrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.wholesaleOfferPrice}
                                  onChange={(e) => updateVariant(variant.id, 'wholesaleOfferPrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.wholesaleOfferPrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.wholesaleOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.wholesaleOfferPrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.wholesaleOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.wholesaleOfferPrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.wholesaleOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'wholesaleOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.start')}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.wholesaleOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'wholesaleOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.end')}
                                />
                              </td>
                            </>
                          )}

                          {/* Retail Channel */}
                          {channels.retail && (
                            <>
                              <td className="px-3 py-2 border-l border-red-100">
                                <Input
                                  type="text"
                                  placeholder={t('variants_table.optional_placeholder')}
                                  value={variant.retailName}
                                  onChange={(e) => updateVariant(variant.id, 'retailName', e.target.value)}
                                  className="h-8 text-xs w-40"
                                />
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.retailPrice}
                                  onChange={(e) => updateVariant(variant.id, 'retailPrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.retailPrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.retailPrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.retailPrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.retailPrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.retailPrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.retailOfferPrice}
                                  onChange={(e) => updateVariant(variant.id, 'retailOfferPrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.retailOfferPrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.retailOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.retailOfferPrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.retailOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.retailOfferPrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.retailOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'retailOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.start')}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.retailOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'retailOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.end')}
                                />
                              </td>
                            </>
                          )}

                          {/* Daraz Channel */}
                          {channels.daraz && (
                            <>
                              <td className="px-3 py-2 border-l border-orange-100">
                                <Input
                                  type="text"
                                  placeholder={t('variants_table.optional_placeholder')}
                                  value={variant.darazName}
                                  onChange={(e) => updateVariant(variant.id, 'darazName', e.target.value)}
                                  className="h-8 text-xs w-40"
                                />
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.darazPrice}
                                  onChange={(e) => updateVariant(variant.id, 'darazPrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.darazPrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.darazPrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.darazPrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.darazPrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.darazPrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-2 py-2">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={variant.darazOfferPrice}
                                  onChange={(e) => updateVariant(variant.id, 'darazOfferPrice', e.target.value)}
                                  className="h-8 text-xs w-20"
                                />
                                {variant.landedCost && variant.darazOfferPrice && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.darazOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'border-red-500 text-red-600 bg-red-50'
                                          : ''
                                      }`}
                                    >
                                      {calculateProfitPercent(variant.darazOfferPrice, variant.landedCost)}%
                                    </Badge>
                                    <Badge
                                      variant="secondary"
                                      className={`text-[10px] px-1 py-0 ${
                                        parseFloat(variant.darazOfferPrice) < parseFloat(variant.landedCost)
                                          ? 'bg-red-100 text-red-700 border-red-300'
                                          : ''
                                      }`}
                                    >
                                      ৳{calculateProfitAmount(variant.darazOfferPrice, variant.landedCost)}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.darazOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'darazOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.start')}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.darazOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'darazOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder={t('variants_table.header.end')}
                                />
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Gallery - Shared across all variants */}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {t('product_gallery.title')}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {t(productData.galleryImages.length > 1 ? 'product_gallery.image_count_plural' : 'product_gallery.image_count_single', { count: productData.galleryImages.length })}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {t('product_gallery.shared_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label
                  htmlFor="product-gallery-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="h-3 w-3" />
                  {t('product_gallery.upload_button')}
                </Label>
                <Input
                  id="product-gallery-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleProductGalleryUpload}
                />
              </div>

              {productData.galleryImages.length > 0 && (
                <div className="grid grid-cols-6 gap-2">
                  {productData.galleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-24 object-cover rounded border-2 border-gray-300"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeProductGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <Badge variant="secondary" className="absolute bottom-1 left-1 text-[10px] px-1 py-0">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              {productData.galleryImages.length === 0 && (
                <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">{t('product_gallery.no_images')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Global SEO - Shared across all platforms */}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('seo_settings.title')}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedProduct && (productData.metaTitle || productData.metaDescription || productData.metaKeywords) && (
                    <Badge variant="secondary" className="text-xs">
                      {t('seo_settings.loaded_from_product')}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {t('seo_settings.global_badge')}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs">
                {t('seo_settings.shared_description')}
                {selectedProduct && productData.metaTitle && t('seo_settings.loaded_from', { productName: selectedProduct.base_name })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title" className="text-sm">
                    {t('seo_settings.meta_title_label')}
                  </Label>
                  <Input
                    id="meta-title"
                    type="text"
                    placeholder={t('seo_settings.meta_title_placeholder')}
                    value={productData.metaTitle}
                    onChange={(e) => updateProductData('metaTitle', e.target.value)}
                    className="h-9 text-sm"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {t('seo_settings.meta_title_chars', { count: productData.metaTitle.length })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-slug" className="text-sm">
                    {t('seo_settings.seo_slug_label')}
                  </Label>
                  <Input
                    id="seo-slug"
                    type="text"
                    placeholder={t('seo_settings.seo_slug_placeholder')}
                    value={productData.seoSlug}
                    onChange={(e) => updateProductData('seoSlug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="h-9 text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {t('seo_settings.seo_slug_description')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description" className="text-sm">
                  {t('seo_settings.meta_description_label')}
                </Label>
                <Textarea
                  id="meta-description"
                  placeholder={t('seo_settings.meta_description_placeholder')}
                  value={productData.metaDescription}
                  onChange={(e) => updateProductData('metaDescription', e.target.value)}
                  className="min-h-20 text-sm resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {t('seo_settings.meta_description_chars', { count: productData.metaDescription.length })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords" className="text-sm">
                  {t('seo_settings.meta_keywords_label')}
                </Label>
                <Input
                  id="meta-keywords"
                  type="text"
                  placeholder={t('seo_settings.meta_keywords_placeholder')}
                  value={productData.metaKeywords}
                  onChange={(e) => updateProductData('metaKeywords', e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500">
                  {t('seo_settings.meta_keywords_description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Action Buttons */}
        {variants.length > 0 && (
          <div className="flex justify-end gap-3 sticky bottom-0 bg-white border-t shadow-lg p-3 rounded-t-lg">
            <Button variant="outline" onClick={() => setVariants([])} size="sm">
              {t('actions.clear_all')}
            </Button>
            <Button
              onClick={handleSaveStock}
              className={`bg-green-600 hover:bg-green-700 ${isSaveButtonShaking ? 'shake' : ''} ${saveSuccess ? 'bg-green-700' : ''}`}
              size="sm"
              disabled={saveSuccess}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('actions.save_success')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('actions.save_button')}
                </>
              )}
            </Button>
          </div>
        )}

        {/* Error message for save errors */}
        {saveError && (
          <Card className="shadow-md border-red-500 border-2 bg-red-50 mt-3 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-base font-bold mb-1">{t('validation.save_failed')}</p>
                  <p className="text-red-600 text-sm">{saveError}</p>
                  <p className="text-red-500 text-xs mt-2">{t('validation.check_form')}</p>
                </div>
                <button
                  onClick={() => setSaveError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label="Close error message"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ManualStockEntry;
