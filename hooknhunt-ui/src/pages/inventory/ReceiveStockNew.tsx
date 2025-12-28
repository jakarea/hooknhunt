// src/pages/inventory/ReceiveStockNew.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Package,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  X,
  DollarSign,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { ProductImage } from '@/components/ProductImage';
import api from '@/lib/api';
import { MediaLibrary } from '@/components/media/MediaLibrary';
import { transformMediaUrl } from '@/lib/config';

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

interface Product {
  id: number;
  base_name: string;
  slug: string;
  status: 'draft' | 'published';
  description?: string;
  base_thumbnail_url?: string;
  gallery_images?: string[];
  category_names?: string;
  category_ids?: number[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  created_at: string;
  updated_at: string;
}

interface PoItem {
  id: number;
  product_id: number;
  quantity: number;
  received_quantity?: number;
  stocked_quantity?: number;
  china_price?: number;
  final_unit_cost?: number;
  po_number?: number;
  product?: Product;
}

interface PurchaseOrder {
  id: number;
  po_number: string;
  status: string;
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

export function ReceiveStockNew() {
  // Simple translation fallback to avoid i18n issues
  const t = (key: string, options?: any) => {
    // Return the key with basic formatting for common cases
    if (options?.count) {
      return `${key} (${options.count})`;
    }
    return key;
  };
  const { poItemId } = useParams<{ poItemId: string }>();
  const navigate = useNavigate();

  // Add shake animation style
  useEffect(() => {
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
    daraz: true, // Enable Daraz by default
  });

  // Helper functions for profit calculations
  const calculateProfitMargin = (landedCost: number, sellingPrice: number): number => {
    if (!landedCost || landedCost <= 0) return 0;
    return ((sellingPrice - landedCost) / landedCost) * 100;
  };

  const calculateProfit = (landedCost: number, sellingPrice: number, quantity: number): number => {
    if (!landedCost || landedCost <= 0 || quantity <= 0) return 0;
    return (sellingPrice - landedCost) * quantity;
  };

  // Generate unique SKU based on formula:
  // [1st_letter][china_price]-[2nd_letter][final_unit_cost]-[3rd_letter][wholesale_price]-[profit_amount]-[margin][all_variation_letters]
  const generateUniqueSKU = (chinaPrice: number, finalUnitCost: number, wholesaleMargin: number, variantName?: string): string => {
    // CRITICAL: Convert all inputs to numbers first to handle string values from API
    const numChinaPrice = Number(chinaPrice) || 0;
    const numFinalUnitCost = Number(finalUnitCost) || numChinaPrice;
    const numWholesaleMargin = Number(wholesaleMargin) || 0;

    // Calculate wholesale price with margin (now using proper numbers)
    const wholesalePrice = numFinalUnitCost + (numFinalUnitCost * numWholesaleMargin / 100);

    // Calculate wholesale profit amount
    const wholesaleProfitAmount = wholesalePrice - numFinalUnitCost;

    // Convert all to integers (full digits only, no decimals)
    const chinaPriceInt = Math.round(numChinaPrice);
    const finalUnitCostInt = Math.round(numFinalUnitCost);
    const wholesalePriceInt = Math.round(wholesalePrice);
    const wholesaleProfitAmountInt = Math.round(wholesaleProfitAmount);

    // Extract first capital letters from each variation word as an array
    const variationLetters: string[] = [];
    if (variantName) {
      // Split by " - " to get all parts
      const parts = variantName.split(' - ');

      // If there's more than 1 part, the first is product name, rest are variation attributes
      // If only 1 part, use it as variation
      const variationParts = parts.length > 1 ? parts.slice(1) : parts;

      // Extract first capital letter from each variation part
      variationParts.forEach(part => {
        const match = part.trim().match(/[A-Z]/);
        if (match) {
          variationLetters.push(match[0]);
        }
      });
    }

    // Default to ['D'] if no variation letters found
    const letters = variationLetters.length > 0 ? variationLetters : ['D'];

    // Get individual letters for prefixing (use 'D' as fallback for missing positions)
    const letter1 = letters[0] || 'D';
    const letter2 = letters[1] || letter1;
    const letter3 = letters[2] || letter2;

    // Build SKU with variation letters prefixing each number
    const marginInt = Math.round(numWholesaleMargin);
    return `${letter1}${chinaPriceInt}-${letter2}${finalUnitCostInt}-${letter3}${wholesalePriceInt}-${wholesaleProfitAmountInt}-${marginInt}`;
  };

  // Get minimum date (today) for date inputs
  const getMinDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Attributes from API
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loadingAttributes, setLoadingAttributes] = useState<boolean>(true);

  // PO Item and Product data
  const [poItem, setPoItem] = useState<PoItem | null>(null);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Global profit margins from settings
  const [profitMargins, setProfitMargins] = useState({
    retail: 50,
    wholesale: 20,
    daraz: 60,
  });

  // Product Type Selection
  const [productType, setProductType] = useState<'simple' | 'variable'>('variable');

  // Attribute Selection (for variable products)
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

  // Media Library Modal
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [editingVariantThumbnailId, setEditingVariantThumbnailId] = useState<string | null>(null);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<{
    variants?: string[];
    variantSkus?: {[variantId: string]: string | undefined};
    variantLandedCosts?: {[variantId: string]: string | undefined};
    variantNames?: {[variantId: string]: string | undefined};
    variantQuantities?: {[variantId: string]: string | undefined};
  }>({});
  const [isSaveButtonShaking, setIsSaveButtonShaking] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Calculate quantities
  const orderedQty = poItem?.quantity || 0;
  const receivedQty = poItem?.received_quantity || 0;
  const stockedQty = poItem?.stocked_quantity || 0;
  const remainingToReceive = orderedQty - receivedQty;
  const remainingToStock = receivedQty - stockedQty;

  // Calculate total quantity being input
  const totalInputQty = variants.reduce((sum, variant) => {
    const qty = parseInt(variant.stockQty) || 0;
    return sum + qty;
  }, 0);

  // Check if landed cost is locked (PO is completed or completed_partially)
  const isLandedCostLocked = purchaseOrder?.status === 'completed' || purchaseOrder?.status === 'completed_partially';

  // ============================================================================
  // FETCH DATA ON MOUNT
  // ============================================================================

  useEffect(() => {
    if (!poItemId) return;

    const loadData = async () => {
      try {
        console.log('Starting data fetch for PO item:', poItemId);

        // Fetch PO item
        const poResponse = await apiClient.get(`/admin/purchase-order-items/${poItemId}`);
        console.log('✅ PO item loaded:', poResponse.data);
        setPoItem(poResponse.data);

        // Set initial loading to false since we got the PO item
        setLoading(false);

        // Fetch purchase order to get status
        if (poResponse.data.po_number) {
          try {
            const poDetailsResponse = await apiClient.get(`/admin/purchase-orders/${poResponse.data.po_number}`);
            console.log('✅ PO details loaded:', poDetailsResponse.data);
            setPurchaseOrder(poDetailsResponse.data);
          } catch (poError) {
            console.warn('Could not load PO details:', poError);
          }
        }

        // Load product data if available
        if (poResponse.data.product_id) {
          const productResponse = await apiClient.get(`/admin/products/${poResponse.data.product_id}`);
          console.log('✅ Product loaded:', productResponse.data);
          const product = productResponse.data;

          setProductData({
            galleryImages: product.gallery_images || [],
            metaTitle: product.meta_title || '',
            metaDescription: product.meta_description || '',
            metaKeywords: product.meta_keywords || '',
            seoSlug: product.slug || '',
          });
        }

        // Load global settings for profit margins
        try {
          const settingsResponse = await apiClient.get('/admin/settings');
          console.log('✅ Global settings loaded:', settingsResponse.data);

          // Extract profit margins from settings, using defaults if not found
          const settings = settingsResponse.data;
          setProfitMargins({
            retail: parseFloat(settings.default_margin_retail) || 50,
            wholesale: parseFloat(settings.default_margin_wholesale) || 20,
            daraz: parseFloat(settings.default_margin_daraz) || 60,
          });
        } catch (settingsError) {
          console.warn('Could not load global settings, using default profit margins');
          // Continue with default margins
        }

        // Load attributes
        try {
          const attributesResponse = await api.get('/admin/attributes?all=true');
          const attributesData = attributesResponse.data.data || attributesResponse.data || [];
          const attributesArray = Array.isArray(attributesData) ? attributesData : [];

          // Use test data if API returns empty
          const data = attributesArray.length > 0 ? attributesArray : [
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

          console.log('✅ Attributes loaded:', data.length, 'attributes');
          setAttributes(data);
        } catch (attrError) {
          console.warn('Could not load attributes, using fallback');
          // Continue without attributes
        }

        setLoadingAttributes(false);

      } catch (error) {
        console.error('❌ Failed to load data:', error);
        if (error.response) {
          console.error('API Error:', error.response.status, error.response.data);
        }
        setLoading(false);
        setLoadingAttributes(false);
      }
    };

    loadData();
  }, [poItemId]);

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
    if (!poItem?.product) return;

        
    const newVariants: VariantRow[] = [];

    if (productType === 'simple') {
      // Create single variant
      const defaultName = poItem.product.base_name || 'Default';
      const chinaPrice = poItem.china_price || 0;
      const finalUnitCost = poItem.final_unit_cost || chinaPrice;

      newVariants.push({
        id: '1',
        internalName: defaultName,
        sku: generateUniqueSKU(chinaPrice, finalUnitCost, profitMargins.wholesale, defaultName),
        thumbnail: poItem.product?.base_thumbnail_url || '',
        stockQty: '',
        landedCost: finalUnitCost.toString(),
        // Initialize all platform names with the same value
        retailName: defaultName,
        wholesaleName: defaultName,
        darazName: defaultName,
        retailThumb: '',
        wholesaleThumb: '',
        darazThumb: '',
        retailPrice: calculatePrice(finalUnitCost.toString() || '0', profitMargins.retail),
        retailOfferPrice: '',
        retailOfferStart: '',
        retailOfferEnd: '',
        wholesalePrice: calculatePrice(finalUnitCost.toString() || '0', profitMargins.wholesale),
        wholesaleOfferPrice: '',
        wholesaleOfferStart: '',
        wholesaleOfferEnd: '',
        darazPrice: calculatePrice(finalUnitCost.toString() || '0', profitMargins.daraz),
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
        const displayValues = combination.map(opt => opt.display_value || opt.value || 'Unknown').join(' - ');
        // Include product name with variant attributes for better identification
        const variantFullName = poItem.product?.base_name ? `${poItem.product.base_name} - ${displayValues}` : displayValues;

        const chinaPrice = poItem.china_price || 0;
        const finalUnitCost = poItem.final_unit_cost || chinaPrice;
        const landedCost = finalUnitCost.toString();

        newVariants.push({
          id: idCounter.toString(),
          internalName: variantFullName,
          sku: generateUniqueSKU(chinaPrice, finalUnitCost, profitMargins.wholesale, variantFullName),
          thumbnail: poItem.product?.base_thumbnail_url || '',
          stockQty: '',
          landedCost: landedCost,
          // Initialize all platform names with the same value (from internal name)
          retailName: variantFullName,
          wholesaleName: variantFullName,
          darazName: variantFullName,
          retailThumb: '',
          wholesaleThumb: '',
          darazThumb: '',
          retailPrice: calculatePrice(landedCost, profitMargins.retail),
          retailOfferPrice: '',
          retailOfferStart: '',
          retailOfferEnd: '',
          wholesalePrice: calculatePrice(landedCost, profitMargins.wholesale),
          wholesaleOfferPrice: '',
          wholesaleOfferStart: '',
          wholesaleOfferEnd: '',
          darazPrice: calculatePrice(landedCost, profitMargins.daraz),
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
    // Prevent updating landed cost if PO is completed or completed_partially
    if (field === 'landedCost' && isLandedCostLocked) {
      return;
    }

    setVariants(prev =>
      prev.map(variant => {
        if (variant.id === id) {
          const updated = { ...variant, [field]: value };

          // Auto-calculate prices when landed cost changes
          if (field === 'landedCost') {
            if (channels.retail) updated.retailPrice = calculatePrice(value, profitMargins.retail);
            if (channels.wholesale) updated.wholesalePrice = calculatePrice(value, profitMargins.wholesale);
            if (channels.daraz) updated.darazPrice = calculatePrice(value, profitMargins.daraz);
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

  const removeProductGalleryImage = (imageIndex: number) => {
    updateProductData(
      'galleryImages',
      productData.galleryImages.filter((_, idx) => idx !== imageIndex)
    );
  };

  // Handle media selection from media library
  const handleMediaSelect = (files: any[]) => {
    // Extract URLs from selected media files and transform them
    const urls = files.map(file => transformMediaUrl(file.url));
    // Combine with existing gallery images (avoid duplicates)
    const combinedUrls = [...new Set([...productData.galleryImages, ...urls])];
    updateProductData('galleryImages', combinedUrls);
    setShowMediaModal(false);
    toast.success(`Added ${files.length} image(s) to gallery`);
  };

  // Handle variant thumbnail selection from media library
  const handleVariantThumbnailSelect = (files: any[]) => {
    if (files.length > 0 && editingVariantThumbnailId) {
      // Use the first selected file as thumbnail and transform the URL
      updateVariant(editingVariantThumbnailId, 'thumbnail', transformMediaUrl(files[0].url));
      setEditingVariantThumbnailId(null);
      toast.success('Thumbnail updated successfully');
    }
  };

  const canSave = () => {
    const allValid = variants.every(variant =>
      variant.stockQty.trim() &&
      parseInt(variant.stockQty) > 0 &&
      variant.landedCost.trim() &&
      parseFloat(variant.landedCost) > 0
    );

    const quantityValid = totalInputQty > 0 && totalInputQty <= remainingToStock;
    return allValid && quantityValid && variants.length > 0;
  };

  const handleSave = async () => {
    // Clear previous errors
    setValidationErrors({});

    const errors: typeof validationErrors = {};

    // Validate variants exist
    if (variants.length === 0) {
      errors.variants = [t('validation.generate_variants')];
    }

    // Validate Landed Cost for each variant (SKU is auto-generated, no need to validate)
    const landedCostErrors: {[variantId: string]: string} = {};
    variants.forEach(variant => {
      // Landed Cost validation - skip if PO is locked (completed/partially completed)
      if (!isLandedCostLocked) {
        if (!variant.landedCost || variant.landedCost.trim() === '' || parseFloat(variant.landedCost) < 0) {
          landedCostErrors[variant.id] = t('api_errors.landed_cost_required');
        }
      }
    });

    // Only add landed cost errors if not locked
    if (!isLandedCostLocked && Object.keys(landedCostErrors).length > 0) {
      errors.variantLandedCosts = landedCostErrors;
    }

    // If there are errors, show them and shake button
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSaveButtonShaking(true);
      setTimeout(() => setIsSaveButtonShaking(false), 500);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        po_item_id: parseInt(poItemId!),
        product_type: productType,
        product_data: {
          gallery_images: productData.galleryImages,
          meta_title: productData.metaTitle,
          meta_description: productData.metaDescription,
          meta_keywords: productData.metaKeywords,
          seo_slug: productData.seoSlug,
        },
        variants: variants.map(variant => ({
          variant_name: variant.internalName,
          sku: variant.sku, // Required field
          thumbnail: variant.thumbnail || null,
          quantity: parseInt(variant.stockQty) || 0,
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

      await apiClient.post('/admin/inventory/receive-stock', payload);
      toast.success('Stock received successfully');

      // Navigate to stock management page
      setTimeout(() => {
        navigate('/products/stock');
      }, 1500);

    } catch (error: any) {
      console.error('Failed to save stock entry:', error);
      const errorResponse = error.response;

      if (errorResponse?.status === 422 && errorResponse?.data?.errors) {
        // Validation errors from Laravel
        const laravelErrors = errorResponse.data.errors;

        // Convert Laravel validation errors to our format
        const fieldErrors: {
          variantSkus?: {[variantId: string]: string};
          variantLandedCosts?: {[variantId: string]: string};
          variantNames?: {[variantId: string]: string};
          variantQuantities?: {[variantId: string]: string};
        } = {};

        const skuErrors: {[variantId: string]: string} = {};
        const landedCostErrors: {[variantId: string]: string} = {};
        const variantNameErrors: {[variantId: string]: string} = {};
        const variantQuantityErrors: {[variantId: string]: string} = {};

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
                // Only add landed cost errors if PO is not locked
                if (!isLandedCostLocked) {
                  landedCostErrors[variant.id] = laravelErrors[key][0];
                }
              } else if (key.includes('.variant_name')) {
                variantNameErrors[variant.id] = laravelErrors[key][0];
              } else if (key.includes('.quantity')) {
                variantQuantityErrors[variant.id] = laravelErrors[key][0];
              }
            }
          }
        });

        // Set field-specific errors
        if (Object.keys(skuErrors).length > 0) {
          fieldErrors.variantSkus = skuErrors;
        }
        // Only add landed cost errors if PO is not locked
        if (!isLandedCostLocked && Object.keys(landedCostErrors).length > 0) {
          fieldErrors.variantLandedCosts = landedCostErrors;
        }
        if (Object.keys(variantNameErrors).length > 0) {
          fieldErrors.variantNames = variantNameErrors;
        }
        if (Object.keys(variantQuantityErrors).length > 0) {
          fieldErrors.variantQuantities = variantQuantityErrors;
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
        // Other errors (database, server, etc.)
        let errorMessage = 'Failed to save stock entry';

        if (errorResponse?.data?.error) {
          // Show actual database error message
          errorMessage = errorResponse.data.error;
        } else if (errorResponse?.data?.message) {
          // Show general error message
          errorMessage = errorResponse.data.message;
        } else if (error.message) {
          // Show network or other error message
          errorMessage = error.message;
        }

        // Log the full error for debugging
        console.error('Full error details:', {
          status: errorResponse?.status,
          data: errorResponse?.data,
          message: error.message
        });

        setSaveError(errorMessage);
      }

      setIsSaveButtonShaking(true);
      setTimeout(() => setIsSaveButtonShaking(false), 500);
    } finally {
      setSubmitting(false);
    }
  };

  // Reset when product type changes
  useEffect(() => {
    setVariants([]);
    setSelectedAttributeOptions({});
  }, [productType]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!poItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Purchase order item not found</p>
            <Link to="/purchase/list">
              <Button className="mt-4">Back to Purchase Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if item is already fully stocked
  const isFullyStocked = remainingToStock <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={`/purchase/${poItem.po_number}`}>
                <Button variant="ghost" size="sm" className="rounded-lg">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to PO
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="h-6 w-6 text-blue-600" />
                  Receive Stock
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Adding inventory for <span className="font-medium text-gray-900">{poItem.product?.base_name}</span>
                </p>
              </div>
            </div>

            {/* Stock Progress Card */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-sm min-w-80">
              <CardContent className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-blue-100">
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ordered</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">{orderedQty}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-green-100">
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Received</p>
                      <p className="text-lg font-bold text-green-600 mt-1">{receivedQty}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg p-2 shadow-sm border border-blue-100">
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Stocked</p>
                      <p className="text-lg font-bold text-blue-600 mt-1">{stockedQty}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`rounded-lg p-2 shadow-sm border ${
                      isFullyStocked ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
                    }`}>
                      <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Remaining</p>
                      <p className={`text-lg font-bold mt-1 ${
                        isFullyStocked ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {remainingToStock}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Stock Progress</span>
                    <span className="text-sm font-bold text-blue-600">{Math.round((stockedQty / orderedQty) * 100)}%</span>
                  </div>
                  <Progress
                    value={orderedQty > 0 ? (stockedQty / orderedQty) * 100 : 0}
                    className="h-3 bg-blue-100"
                  />
                  {isFullyStocked && (
                    <Alert className="mt-3 border-red-200 bg-red-50">
                      <CheckCircle2 className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-700">
                        All items have been stocked. No more inventory can be added for this purchase item.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Validation Summary Banner */}
        {(validationErrors.variants || validationErrors.variantSkus || (!isLandedCostLocked && validationErrors.variantLandedCosts)) && (
          <Alert className="border-red-200 bg-red-50">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <AlertTitle className="text-red-800 font-bold">Please fix the following errors</AlertTitle>
            <AlertDescription className="text-red-700">
              <ul className="space-y-1 text-sm mt-2">
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
                    {!isLandedCostLocked && validationErrors.variantLandedCosts && Object.keys(validationErrors.variantLandedCosts).length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {t('validation.landed_cost_missing', { count: Object.keys(validationErrors.variantLandedCosts).length })}
                      </li>
                    )}
                  </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Landed Cost Locked Warning Banner */}
        {isLandedCostLocked && (
          <Alert className="border-amber-200 bg-amber-50">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <AlertTitle className="text-amber-800 font-bold">Landed Cost is Locked</AlertTitle>
            <AlertDescription className="text-amber-700 text-sm">
              This purchase order is <strong>{purchaseOrder?.status === 'completed' ? 'Completed' : 'Partially Completed'}</strong>.
              The landed cost cannot be modified at this stage. All costs have been finalized.
            </AlertDescription>
          </Alert>
        )}

        {/* Product Information Section */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
              <Package className="h-5 w-5" />
              Product Information
            </CardTitle>
            <CardDescription className="text-blue-700">
              Basic product details and purchase information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Product Image */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-700 mb-6">Product Image</h3>
                  <div className="relative inline-block group">
                    <ProductImage
                      src={poItem.product?.base_thumbnail_url}
                      alt={poItem.product?.base_name}
                      size="xl"
                      className="rounded-2xl border-2 border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-blue-400 bg-white"
                    />
                    <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-100">
                        <span className="text-xs font-medium text-gray-700 flex items-center gap-1.5">
                          <Package className="h-3 w-3" />
                          View Product
                        </span>
                      </div>
                    </div>
                  </div>
                  {poItem.product?.status && (
                    <div className="mt-4">
                      <Badge
                        variant={poItem.product?.status === 'published' ? 'default' : 'secondary'}
                        className="text-xs px-3 py-1"
                      >
                        {poItem.product?.status === 'published' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Product Title </Label>
                                   <h3 className="text-xl font-bold text-gray-900">{poItem.product?.base_name}</h3>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Categories</Label>
                      <div className="mt-1">
                        {poItem.product?.category_ids?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {poItem.product.category_ids.map((categoryId, index) => (
                              <Badge key={index} variant="outline" className="text-xs bg-white border-gray-300">
                                Category {categoryId}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-lg font-semibold text-gray-900">No categories</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <Label className="text-xs font-medium text-green-600 uppercase tracking-wide">Landed Cost</Label>
                      <p className="text-lg font-bold text-green-700 mt-1">
                        ৳{typeof poItem.final_unit_cost === 'number' ? poItem.final_unit_cost.toFixed(2) :
                            (parseFloat(poItem.final_unit_cost || '0')).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <Label className="text-xs font-medium text-blue-600 uppercase tracking-wide">Status</Label>
                      <div className="mt-2">
                        <Badge variant={poItem.product?.status === 'published' ? 'default' : 'secondary'} className="text-sm">
                          {poItem.product?.status || 'Draft'}
                        </Badge>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <Label className="text-xs font-medium text-orange-600 uppercase tracking-wide">Quantity</Label>
                      <p className="text-lg font-bold text-orange-700 mt-1">{orderedQty} units</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Description     </Label>             <p className="text-gray-600 leading-relaxed">
                    {poItem.product?.description || poItem.product?.meta_description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Type Selection - Only show if not fully stocked */}
        {!isFullyStocked && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                <Layers className="h-5 w-5" />
                Product Type Selection
              </CardTitle>
              <CardDescription className="text-purple-700">
                Choose how you want to organize your product inventory
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup
                value={productType}
                onValueChange={(value) => setProductType(value as 'simple' | 'variable')}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label htmlFor="simple" className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-purple-50 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-50">
                  <RadioGroupItem value="simple" id="simple" />
                  <div className="flex-1">
                    <div className="font-medium text-purple-900">Simple Product</div>
                    <div className="text-sm text-gray-600">Single item with no variations (e.g., one size, one color)</div>
                  </div>
                </Label>
                <Label htmlFor="variable" className="flex items-center space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:bg-purple-50 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-50">
                  <RadioGroupItem value="variable" id="variable" />
                  <div className="flex-1">
                    <div className="font-medium text-purple-900">Variable Product</div>
                    <div className="text-sm text-gray-600">Multiple variations (e.g., different sizes, colors)</div>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

       

        {/* Variant Generator - for variable products */}
        {productType === 'variable' && !isFullyStocked && (
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Variant Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {loadingAttributes ? (
                <div className="text-center py-3">
                  <p className="text-sm font-medium text-gray-700">Loading attributes...</p>
                </div>
              ) : attributes.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-sm font-medium text-gray-700">No attributes available</p>
                </div>
              ) : (
                <>
                  {attributes.map(attribute => (
                    <div key={attribute.id}>
                      <Label className="text-xs mb-1 block font-medium text-gray-900">{attribute.name || attribute.display_name}</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {attribute.options.map(option => {
                          const isSelected = selectedAttributeOptions[attribute.id]?.includes(option.id) || false;

                          return (
                            <Button
                              key={option.id}
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleAttributeOption(attribute.id, option.id)}
                              className="flex items-center gap-1 h-7 px-2 text-xs"
                            >
                              {attribute.type === 'color' && option.color_code && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full border"
                                  style={{
                                    backgroundColor: option.color_code,
                                    borderColor: option.color_code === '#FFFFFF' ? '#000' : option.color_code,
                                  }}
                                />
                              )}
                              <span className="truncate">{option.display_value || option.value}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Generate Button */}
                  <Button onClick={generateVariants} className="w-full mt-2" size="sm">
                    <Layers className="h-3.5 w-3.5 mr-1.5" />
                    Generate Variants
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Generate Simple Product Button */}
        {productType === 'simple' && variants.length === 0 && !isFullyStocked && (
          <Button onClick={generateVariants} className="w-full" size="sm">
            <Package className="h-4 w-4 mr-2" />
            Create Product Entry
          </Button>
        )}

        {/* Error message for missing variants when validation fails */}
        {variants.length === 0 && validationErrors.variants && (
          <Card className="shadow-sm border-red-500 border-2 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-600 text-sm font-semibold">Validation Error</p>
                  <p className="text-red-600 text-sm">{validationErrors.variants[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        
        {/* Variants Table */}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {poItem.product?.base_name} - Stock & Pricing
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {variants.length > 1 ? `${variants.length} variants` : `${variants.length} variant`}
                </Badge>
              </div>

              {/* Compact Platform Selection */}
              {!isFullyStocked && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <span className="text-xs font-medium text-gray-600">Platforms:</span>
                  <div className="flex items-center gap-4">
                    {/* Wholesale - Always enabled */}
                    <div className="flex items-center gap-1.5">
                      <Switch
                        id="platform-wholesale"
                        checked={true}
                        disabled
                        className="scale-75"
                      />
                      <Label htmlFor="platform-wholesale" className="text-xs font-medium text-blue-700">
                        Wholesale
                      </Label>
                    </div>

                    {/* Retail */}
                    <div className="flex items-center gap-1.5">
                      <Switch
                        id="platform-retail"
                        checked={channels.retail}
                        onCheckedChange={() => toggleChannel('retail')}
                        className="scale-75"
                      />
                      <Label htmlFor="platform-retail" className="text-xs font-medium text-gray-700">
                        Retail
                      </Label>
                    </div>

                    {/* Daraz */}
                    <div className="flex items-center gap-1.5">
                      <Switch
                        id="platform-daraz"
                        checked={channels.daraz}
                        onCheckedChange={() => toggleChannel('daraz')}
                        className="scale-75"
                      />
                      <Label htmlFor="platform-daraz" className="text-xs font-medium text-gray-700">
                        Daraz
                      </Label>
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 py-2 text-center font-medium text-gray-700 w-12"></th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-16">Thumb</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-28">Variant</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">SKU</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">Stock</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">Cost</th>
                        {channels.wholesale && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-blue-700 border-l border-blue-200" colSpan={5}>
                              Wholesale
                            </th>
                          </>
                        )}
                        {channels.retail && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-red-700 border-l border-red-200" colSpan={5}>
                              Retail
                            </th>
                          </>
                        )}
                        {channels.daraz && (
                          <>
                            <th className="px-3 py-2 text-left font-medium text-orange-700 border-l border-orange-200" colSpan={5}>
                              Daraz
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
                        <th className="px-3 py-1.5"></th>
                        {channels.wholesale && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-blue-200">Name</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Price</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Offer</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Start</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">End</th>
                          </>
                        )}
                        {channels.retail && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-red-200">Name</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Price</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Offer</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Start</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">End</th>
                          </>
                        )}
                        {channels.daraz && (
                          <>
                            <th className="px-3 py-1.5 text-left text-gray-600 border-l border-orange-200">Name</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Price</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Offer</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">Start</th>
                            <th className="px-3 py-1.5 text-left text-gray-600">End</th>
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
                              title="Remove variant"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>

                          {/* Variant Thumbnail */}
                          <td className="px-3 py-2">
                            <div className="relative group">
                              <button
                                type="button"
                                onClick={() => setEditingVariantThumbnailId(variant.id)}
                                className="cursor-pointer block w-full"
                                title={variant.thumbnail ? "Click to change thumbnail" : "Click to select thumbnail"}
                              >
                                {variant.thumbnail ? (
                                  <div className="relative">
                                    <img
                                      src={variant.thumbnail}
                                      alt={variant.internalName}
                                      className="w-12 h-12 object-cover rounded border-2 border-gray-300 hover:border-blue-500 transition-colors"
                                      style={{ display: 'block' }}
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                                      <ImageIcon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center">
                                    <div className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-gray-300 rounded hover:border-blue-500 transition-colors mx-auto">
                                      <ImageIcon className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <p className="text-xs text-blue-600 mt-1 font-medium">Select Image</p>
                                  </div>
                                )}
                              </button>
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
                                value={variant.sku}
                                disabled
                                readOnly
                                className="h-8 text-xs w-48 bg-gray-100 cursor-not-allowed text-gray-600"
                                title="SKU is auto-generated and cannot be modified"
                              />
                              <p className="text-[9px] text-gray-500 mt-1">Auto-generated</p>
                            </div>
                          </td>

                          {/* Stock */}
                          <td className="px-3 py-2">
                            <div>
                              <Input
                                type="number"
                                placeholder="0"
                                value={variant.stockQty}
                                onChange={(e) => {
                                  updateVariant(variant.id, 'stockQty', e.target.value);
                                  // Clear error when user starts typing
                                  if (validationErrors.variantQuantities?.[variant.id]) {
                                    setValidationErrors(prev => ({
                                      ...prev,
                                      variantQuantities: {
                                        ...prev.variantQuantities,
                                        [variant.id]: undefined
                                      }
                                    }));
                                  }
                                }}
                                className={`h-8 text-xs w-20 ${validationErrors.variantQuantities?.[variant.id] ? 'border-red-500 border-2 ring-2 ring-red-200 bg-red-50' : ''}`}
                                required
                              />
                              {validationErrors.variantQuantities?.[variant.id] && (
                                <div className="mt-1.5 p-1.5 bg-red-100 border border-red-300 rounded flex items-start gap-1 min-w-max">
                                  <svg className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-red-700 text-xs font-semibold leading-tight whitespace-nowrap">{validationErrors.variantQuantities[variant.id]}</p>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Landed Cost */}
                          <td className="px-3 py-2 align-top">
                            <div>
                              <Input
                                type="number"
                                placeholder="Required"
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
                                className={`h-8 text-xs w-24 ${
                                  isLandedCostLocked
                                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                    : validationErrors.variantLandedCosts?.[variant.id]
                                    ? 'border-red-500 border-2 ring-2 ring-red-200 bg-red-50'
                                    : ''
                                }`}
                                disabled={isLandedCostLocked}
                                required={!isLandedCostLocked}
                                min="0"
                                step="0.01"
                              />
                              {!isLandedCostLocked && validationErrors.variantLandedCosts?.[variant.id] && (
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
                                  placeholder="Optional"
                                  value={variant.wholesaleName}
                                  onChange={(e) => updateVariant(variant.id, 'wholesaleName', e.target.value)}
                                  className="h-8 text-xs w-32"
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
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={variant.wholesaleOfferPrice}
                                    onChange={(e) => updateVariant(variant.id, 'wholesaleOfferPrice', e.target.value)}
                                    className="h-8 text-xs w-20"
                                  />
                                  {variant.wholesaleOfferPrice && parseFloat(variant.wholesaleOfferPrice) > 0 && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.wholesaleOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'border-red-500 text-red-600 bg-red-50'
                                            : ''
                                        }`}
                                      >
                                        {(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.wholesaleOfferPrice) || 0;
                                          const margin = calculateProfitMargin(landedCost, offerPrice);
                                          return `${margin.toFixed(1)}%`;
                                        })()}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.wholesaleOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'bg-red-100 text-red-700 border-red-300'
                                            : ''
                                        }`}
                                      >
                                        ৳{(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.wholesaleOfferPrice) || 0;
                                          if (!offerPrice || !landedCost) return '0';
                                          return (offerPrice - landedCost).toFixed(2);
                                        })()}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.wholesaleOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'wholesaleOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="Start"
                                  minDate={getMinDate()}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.wholesaleOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'wholesaleOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="End"
                                  minDate={variant.wholesaleOfferStart || getMinDate()}
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
                                  placeholder="Optional"
                                  value={variant.retailName}
                                  onChange={(e) => updateVariant(variant.id, 'retailName', e.target.value)}
                                  className="h-8 text-xs w-32"
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
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={variant.retailOfferPrice}
                                    onChange={(e) => updateVariant(variant.id, 'retailOfferPrice', e.target.value)}
                                    className="h-8 text-xs w-20"
                                  />
                                  {variant.retailOfferPrice && parseFloat(variant.retailOfferPrice) > 0 && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.retailOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'border-red-500 text-red-600 bg-red-50'
                                            : ''
                                        }`}
                                      >
                                        {(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.retailOfferPrice) || 0;
                                          const margin = calculateProfitMargin(landedCost, offerPrice);
                                          return `${margin.toFixed(1)}%`;
                                        })()}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.retailOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'bg-red-100 text-red-700 border-red-300'
                                            : ''
                                        }`}
                                      >
                                        ৳{(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.retailOfferPrice) || 0;
                                          if (!offerPrice || !landedCost) return '0';
                                          return (offerPrice - landedCost).toFixed(2);
                                        })()}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.retailOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'retailOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="Start"
                                  minDate={getMinDate()}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.retailOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'retailOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="End"
                                  minDate={variant.retailOfferStart || getMinDate()}
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
                                  placeholder="Optional"
                                  value={variant.darazName}
                                  onChange={(e) => updateVariant(variant.id, 'darazName', e.target.value)}
                                  className="h-8 text-xs w-32"
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
                                <div>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={variant.darazOfferPrice}
                                    onChange={(e) => updateVariant(variant.id, 'darazOfferPrice', e.target.value)}
                                    className="h-8 text-xs w-20"
                                  />
                                  {variant.darazOfferPrice && parseFloat(variant.darazOfferPrice) > 0 && (
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Badge
                                        variant="outline"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.darazOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'border-red-500 text-red-600 bg-red-50'
                                            : ''
                                        }`}
                                      >
                                        {(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.darazOfferPrice) || 0;
                                          const margin = calculateProfitMargin(landedCost, offerPrice);
                                          return `${margin.toFixed(1)}%`;
                                        })()}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className={`text-[10px] px-1 py-0 ${
                                          parseFloat(variant.darazOfferPrice) < parseFloat(variant.landedCost)
                                            ? 'bg-red-100 text-red-700 border-red-300'
                                            : ''
                                        }`}
                                      >
                                        ৳{(() => {
                                          const landedCost = parseFloat(variant.landedCost) || 0;
                                          const offerPrice = parseFloat(variant.darazOfferPrice) || 0;
                                          if (!offerPrice || !landedCost) return '0';
                                          return (offerPrice - landedCost).toFixed(2);
                                        })()}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.darazOfferStart}
                                  onChange={(date) => updateVariant(variant.id, 'darazOfferStart', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="Start"
                                  minDate={getMinDate()}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <DatePicker
                                  value={variant.darazOfferEnd}
                                  onChange={(date) => updateVariant(variant.id, 'darazOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                  placeholder="End"
                                  minDate={variant.darazOfferStart || getMinDate()}
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

        {/* Total Quantity */}
        {variants.length > 0 && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Quantity:</span>
              <span className={`font-bold text-lg ${
                totalInputQty > remainingToStock ? 'text-red-600' : 'text-blue-600'
              }`}>
                {totalInputQty}
              </span>
            </div>
            {totalInputQty > remainingToStock && (
              <p className="text-sm text-red-600 mt-1">
                Exceeds available quantity to stock ({remainingToStock})
              </p>
            )}
          </div>
        )}

        {/* Product Gallery - Shared across all variants */}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Product Gallery
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Shared across all variants
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {productData.galleryImages.length} / 8 Images
                  </Badge>
                  <Button
                    onClick={() => setShowMediaModal(true)}
                    disabled={productData.galleryImages.length >= 8}
                    size="sm"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Select Images
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {productData.galleryImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {productData.galleryImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-colors">
                        <img
                          src={imageUrl}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                        onClick={() => removeProductGalleryImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-2 left-2 bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {productData.galleryImages.length === 0 && (
                <div className="text-center py-12">
                  <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Gallery Images</h3>
                  <p className="text-gray-500 mb-4">Add images to showcase your product from different angles</p>
                  <Button
                    onClick={() => setShowMediaModal(true)}
                    variant="outline"
                  >
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Add Gallery Images
                  </Button>
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
                  SEO Settings
                </CardTitle>
                <div className="flex items-center gap-2">
                  {poItem?.product && (productData.metaTitle || productData.metaDescription || productData.metaKeywords) && (
                    <Badge variant="secondary" className="text-xs">
                      Loaded from product
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Global
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-xs">
                Shared across all platforms (Wholesale, Retail, Daraz)
                {poItem?.product && productData.metaTitle && ` • SEO data loaded from "${poItem.product.base_name}"`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title" className="text-sm">
                    Meta Title
                  </Label>
                  <Input
                    id="meta-title"
                    type="text"
                    placeholder="Enter meta title for SEO..."
                    value={productData.metaTitle}
                    onChange={(e) => updateProductData('metaTitle', e.target.value)}
                    className="h-9 text-sm"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {productData.metaTitle.length}/60 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-slug" className="text-sm">
                    SEO Slug
                  </Label>
                  <Input
                    id="seo-slug"
                    type="text"
                    placeholder="product-url-slug"
                    value={productData.seoSlug}
                    onChange={(e) => updateProductData('seoSlug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="h-9 text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    URL-friendly slug (lowercase, hyphens)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description" className="text-sm">
                  Meta Description
                </Label>
                <Textarea
                  id="meta-description"
                  placeholder="Enter meta description for search engines..."
                  value={productData.metaDescription}
                  onChange={(e) => updateProductData('metaDescription', e.target.value)}
                  className="min-h-20 text-sm resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {productData.metaDescription.length}/160 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords" className="text-sm">
                  Meta Keywords
                </Label>
                <Input
                  id="meta-keywords"
                  type="text"
                  placeholder="keyword1, keyword2, keyword3..."
                  value={productData.metaKeywords}
                  onChange={(e) => updateProductData('metaKeywords', e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500">
                  Comma-separated keywords for SEO
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Action Buttons */}
        {variants.length > 0 && !isFullyStocked && (
          <div className="flex justify-end gap-3 bg-white border-t shadow-lg p-3 rounded-t-lg">
            <Link to={`/purchase/${poItem.po_number}`}>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              onClick={handleSave}
              className={`bg-green-600 hover:bg-green-700 ${isSaveButtonShaking ? 'shake' : ''} ${saveSuccess ? 'bg-green-700' : ''}`}
              size="sm"
              disabled={!canSave() || submitting}
            >
              {submitting ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Stock & Pricing
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
                  <p className="text-red-700 text-base font-bold mb-1">❌ Failed to Save</p>
                  <p className="text-red-600 text-sm">{saveError}</p>
                  <p className="text-red-500 text-xs mt-2">Please check the form for errors and try again.</p>
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

        {/* Media Library Modal for Product Gallery */}
        <MediaLibrary
          open={showMediaModal}
          onOpenChange={setShowMediaModal}
          onSelect={handleMediaSelect}
          multiple={true}
          maxSelections={8 - productData.galleryImages.length}
          acceptedTypes={['image/*']}
        />

        {/* Media Library Modal for Variant Thumbnails */}
        <MediaLibrary
          open={editingVariantThumbnailId !== null}
          onOpenChange={() => setEditingVariantThumbnailId(null)}
          onSelect={handleVariantThumbnailSelect}
          multiple={false}
          maxSelections={1}
          acceptedTypes={['image/*']}
        />
      </div>
    </div>
  );
}