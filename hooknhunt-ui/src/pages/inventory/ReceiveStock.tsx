// src/pages/inventory/ReceiveStock.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus, Trash2, Save, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';
import { useSettingStore } from '@/stores/settingStore';

interface VariantRow {
  sku: string;
  qty: string;
  landed_cost: string;
  retail_price: string;
  wholesale_price: string;
  daraz_price: string;
  attributes: Record<string, string>;
}

interface PoItem {
  id: number;
  product_id: number;
  quantity: number;
  stocked_quantity?: number;
  china_price?: number;
  final_unit_cost?: number;
  purchase_order_id: number;
  product?: {
    id: number;
    base_name: string;
    base_thumbnail_url?: string;
  };
}

type ProductType = 'simple' | 'variable';

export function ReceiveStock() {
  const { poItemId } = useParams<{ poItemId: string }>();
  const navigate = useNavigate();
  const { settings, fetchSettings } = useSettingStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [poItem, setPoItem] = useState<PoItem | null>(null);

  // Step 1: Product Type & Basic Stock
  const [productType, setProductType] = useState<ProductType>('simple');
  const [simpleSku, setSimpleSku] = useState('');
  const [simpleQty, setSimpleQty] = useState('');
  const [simpleLandedCost, setSimpleLandedCost] = useState('');
  const [simpleRetailPrice, setSimpleRetailPrice] = useState('');
  const [simpleWholesalePrice, setSimpleWholesalePrice] = useState('');
  const [simpleDarazPrice, setSimpleDarazPrice] = useState('');

  // Step 2: Variants (only if variable product)
  const [variantRows, setVariantRows] = useState<VariantRow[]>([
    {
      sku: '',
      qty: '',
      landed_cost: '',
      retail_price: '',
      wholesale_price: '',
      daraz_price: '',
      attributes: {},
    },
  ]);
  const [attributeTypes, setAttributeTypes] = useState<string[]>(['Color', 'Size']);
  const [newAttributeType, setNewAttributeType] = useState('');

  // Step 3: Product Details
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');

  // Step 4: SEO & Meta
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const orderedQty = poItem?.quantity || 0;
  const stockedQty = poItem?.stocked_quantity || 0;
  const remainingQty = orderedQty - stockedQty;

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (poItemId) {
      fetchPoItem();
    }
  }, [poItemId]);

  // Helper function to calculate price based on landed cost and margin percentage
  const calculatePrice = (landedCost: number, marginPercent: number): string => {
    if (!landedCost || landedCost <= 0) return '';
    if (!marginPercent || marginPercent <= 0) return '';

    const margin = landedCost * (marginPercent / 100);
    const sellingPrice = landedCost + margin;
    // Use Math.ceil to round up to the nearest integer (no fractional BDT)
    return Math.ceil(sellingPrice).toString();
  };

  // Helper function to calculate actual margin percentage from price and cost
  const calculateMarginPercent = (sellingPrice: number, landedCost: number): number => {
    if (!landedCost || landedCost <= 0) return 0;
    if (!sellingPrice || sellingPrice <= 0) return 0;

    const profit = sellingPrice - landedCost;
    const marginPercent = (profit / landedCost) * 100;
    return marginPercent;
  };

  // Helper function to check if profit is zero or negative
  const isProfitInvalid = (sellingPrice: string, landedCost: string): boolean => {
    const price = parseFloat(sellingPrice);
    const cost = parseFloat(landedCost);

    if (!price || !cost) return false;
    return price <= cost;
  };

  // Auto-calculate prices when landed cost changes (for simple product)
  useEffect(() => {
    const landedCost = parseFloat(simpleLandedCost);
    if (landedCost > 0) {
      const retailMargin = parseFloat(settings.default_margin_retail || '0');
      const wholesaleMargin = parseFloat(settings.default_margin_wholesale || '0');
      const darazMargin = parseFloat(settings.default_margin_daraz || '0');

      // Only auto-fill if the field is empty (don't override user input)
      if (!simpleRetailPrice && retailMargin > 0) {
        setSimpleRetailPrice(calculatePrice(landedCost, retailMargin));
      }
      if (!simpleWholesalePrice && wholesaleMargin > 0) {
        setSimpleWholesalePrice(calculatePrice(landedCost, wholesaleMargin));
      }
      if (!simpleDarazPrice && darazMargin > 0) {
        setSimpleDarazPrice(calculatePrice(landedCost, darazMargin));
      }
    }
  }, [simpleLandedCost, settings]);

  const fetchPoItem = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/admin/purchase-orders`);
      const orders = response.data.data || response.data;

      let foundItem: PoItem | null = null;
      for (const order of orders) {
        const item = order.items?.find((i: any) => i.id === parseInt(poItemId!));
        if (item) {
          foundItem = { ...item, purchase_order_id: order.id };
          break;
        }
      }

      if (foundItem) {
        setPoItem(foundItem);
        // Pre-fill with product name
        if (foundItem.product?.base_name) {
          setMetaTitle(foundItem.product.base_name);
        }
        // Pre-fill simple quantity with remaining quantity
        setSimpleQty(remainingQty.toString());
        // Pre-fill landed cost from final_unit_cost (BDT) with 10% markup
        // This 10% covers operational costs, storage, handling, etc.
        if (foundItem.final_unit_cost && foundItem.final_unit_cost > 0) {
          const costWithMarkup = foundItem.final_unit_cost * 1.10; // Add 10%
          setSimpleLandedCost(Math.ceil(costWithMarkup).toString()); // Round up
        }
      } else {
        toast.error('Purchase order item not found');
        navigate('/purchase/list');
      }
    } catch (error) {
      console.error('Error fetching PO item:', error);
      toast.error('Failed to load purchase order item');
    } finally {
      setLoading(false);
    }
  };

  // Variant management functions
  const addVariantRow = () => {
    const landedCost = parseFloat(simpleLandedCost) || 0;
    const retailMargin = parseFloat(settings.default_margin_retail || '0');
    const wholesaleMargin = parseFloat(settings.default_margin_wholesale || '0');
    const darazMargin = parseFloat(settings.default_margin_daraz || '0');

    setVariantRows([
      ...variantRows,
      {
        sku: '',
        qty: '',
        landed_cost: simpleLandedCost, // Copy from simple product
        retail_price: landedCost > 0 && retailMargin > 0 ? calculatePrice(landedCost, retailMargin) : '',
        wholesale_price: landedCost > 0 && wholesaleMargin > 0 ? calculatePrice(landedCost, wholesaleMargin) : '',
        daraz_price: landedCost > 0 && darazMargin > 0 ? calculatePrice(landedCost, darazMargin) : '',
        attributes: {},
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variantRows.length === 1) {
      toast.error('At least one variant is required');
      return;
    }
    setVariantRows(variantRows.filter((_, i) => i !== index));
  };

  const updateVariantRow = (index: number, field: keyof VariantRow, value: any) => {
    const newRows = [...variantRows];
    newRows[index] = { ...newRows[index], [field]: value };
    setVariantRows(newRows);
  };

  const updateVariantAttribute = (variantIndex: number, attributeType: string, value: string) => {
    const newRows = [...variantRows];
    newRows[variantIndex].attributes[attributeType] = value;
    setVariantRows(newRows);
  };

  const addAttributeType = () => {
    if (!newAttributeType.trim()) return;
    if (attributeTypes.includes(newAttributeType.trim())) {
      toast.error('Attribute type already exists');
      return;
    }
    setAttributeTypes([...attributeTypes, newAttributeType.trim()]);
    setNewAttributeType('');
  };

  const removeAttributeType = (type: string) => {
    setAttributeTypes(attributeTypes.filter((t) => t !== type));
    // Also remove this attribute from all variant rows
    const newRows = variantRows.map((row) => {
      const newAttributes = { ...row.attributes };
      delete newAttributes[type];
      return { ...row, attributes: newAttributes };
    });
    setVariantRows(newRows);
  };

  // Validation functions
  const validateStep1 = (): boolean => {
    if (productType === 'simple') {
      if (!simpleSku.trim()) {
        toast.error('SKU is required');
        return false;
      }
      if (!simpleQty || parseInt(simpleQty) <= 0) {
        toast.error('Quantity must be greater than 0');
        return false;
      }
      if (parseInt(simpleQty) > remainingQty) {
        toast.error(`Quantity cannot exceed remaining quantity (${remainingQty})`);
        return false;
      }
      if (!simpleLandedCost || parseFloat(simpleLandedCost) <= 0) {
        toast.error('Landed cost must be greater than 0');
        return false;
      }
      if (!simpleRetailPrice || parseFloat(simpleRetailPrice) <= 0) {
        toast.error('Retail price must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (productType === 'simple') return true; // Skip validation for simple products

    // Check all variants have required fields
    for (let i = 0; i < variantRows.length; i++) {
      const row = variantRows[i];
      if (!row.sku.trim()) {
        toast.error(`Variant ${i + 1}: SKU is required`);
        return false;
      }
      if (!row.qty || parseInt(row.qty) <= 0) {
        toast.error(`Variant ${i + 1}: Quantity must be greater than 0`);
        return false;
      }
      if (!row.retail_price || parseFloat(row.retail_price) <= 0) {
        toast.error(`Variant ${i + 1}: Retail price is required`);
        return false;
      }
    }

    // Check total quantity doesn't exceed remaining
    const totalQty = variantRows.reduce((sum, row) => sum + (parseInt(row.qty) || 0), 0);
    if (totalQty > remainingQty) {
      toast.error(`Total variant quantity (${totalQty}) exceeds remaining quantity (${remainingQty})`);
      return false;
    }

    return true;
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      // If simple product, skip variants step
      if (productType === 'simple') {
        setCurrentStep(3);
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep === 3 && productType === 'simple') {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: any = {
        variants: [],
        product_details: {
          description: description || undefined,
          short_description: shortDescription || undefined,
          meta_title: metaTitle || undefined,
          meta_description: metaDescription || undefined,
          meta_keywords: metaKeywords || undefined,
          gallery_images: galleryImages.length > 0 ? galleryImages : undefined,
        },
      };

      if (productType === 'simple') {
        // Simple product - single variant
        payload.variants = [
          {
            sku: simpleSku,
            qty: parseInt(simpleQty),
            landed_cost: parseFloat(simpleLandedCost),
            retail_price: parseFloat(simpleRetailPrice),
            wholesale_price: simpleWholesalePrice ? parseFloat(simpleWholesalePrice) : undefined,
            daraz_price: simpleDarazPrice ? parseFloat(simpleDarazPrice) : undefined,
            attributes: {}, // No attributes for simple product
          },
        ];
      } else {
        // Variable product
        payload.variants = variantRows.map((row) => ({
          sku: row.sku,
          qty: parseInt(row.qty),
          landed_cost: parseFloat(row.landed_cost || simpleLandedCost),
          retail_price: parseFloat(row.retail_price),
          wholesale_price: row.wholesale_price ? parseFloat(row.wholesale_price) : undefined,
          daraz_price: row.daraz_price ? parseFloat(row.daraz_price) : undefined,
          attributes: row.attributes,
        }));
      }

      await apiClient.post(`/admin/purchase-orders/items/${poItemId}/receive`, payload);

      toast.success('Stock received and product configured successfully');
      navigate(`/purchase/${poItem?.purchase_order_id}`);
    } catch (error: any) {
      console.error('Error receiving stock:', error);

      // Handle validation errors
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : error.response.data.message;
        toast.error(errorMessage);
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to receive stock';
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!poItem) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Item not found</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalSteps = productType === 'simple' ? 3 : 4;

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/purchase/${poItem.purchase_order_id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Receive Stock & Configure Product</h1>
            <p className="text-muted-foreground mt-1">
              {poItem.product?.base_name || 'Unknown Product'}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto mb-8">
        <StepIndicator
          step={1}
          currentStep={currentStep}
          label="Stock Info"
          isCompleted={currentStep > 1}
        />
        {productType === 'variable' && (
          <>
            <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
            <StepIndicator
              step={2}
              currentStep={currentStep}
              label="Variants"
              isCompleted={currentStep > 2}
            />
          </>
        )}
        <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        <StepIndicator
          step={productType === 'simple' ? 3 : 3}
          currentStep={currentStep}
          label="Product Details"
          isCompleted={currentStep > 3}
        />
        <div className="flex-1 h-0.5 bg-gray-300 mx-2" />
        <StepIndicator
          step={productType === 'simple' ? 4 : 4}
          currentStep={currentStep}
          label="SEO & Meta"
          isCompleted={false}
        />
      </div>

      {/* Stock Summary - Always visible */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Ordered</div>
              <div className="text-2xl font-bold">{orderedQty}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Already Stocked</div>
              <div className="text-2xl font-bold">{stockedQty}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="text-2xl font-bold text-blue-600">{remainingQty}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Product Type & Basic Stock */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Stock Information</CardTitle>
            <CardDescription>
              Choose product type and enter basic stock information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Type Selection */}
            <div className="space-y-3">
              <Label>Product Type</Label>
              <RadioGroup className="grid grid-cols-2" value={productType} onValueChange={(value) => setProductType(value as ProductType)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Simple Product</div>
                    <div className="text-sm text-muted-foreground">
                      Product without variations (single SKU, price, stock)
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label htmlFor="variable" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Variable Product</div>
                    <div className="text-sm text-muted-foreground">
                      Product with variations (e.g., different colors, sizes)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Simple Product Form */}
            {productType === 'simple' && (
              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simpleSku">SKU *</Label>
                    <Input
                      id="simpleSku"
                      placeholder="e.g., PROD-001"
                      value={simpleSku}
                      onChange={(e) => setSimpleSku(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="simpleQty">Quantity * (Max: {remainingQty})</Label>
                    <Input
                      id="simpleQty"
                      type="number"
                      placeholder="0"
                      value={simpleQty}
                      onChange={(e) => setSimpleQty(e.target.value)}
                      min="1"
                      max={remainingQty}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simpleLandedCost">Landed Cost (BDT) *</Label>
                    <Input
                      id="simpleLandedCost"
                      type="number"
                      step="1"
                      placeholder="0.00"
                      value={simpleLandedCost}
                      onChange={(e) => {
                        setSimpleLandedCost(e.target.value);
                        // Clear prices to allow auto-calculation
                        setSimpleRetailPrice('');
                        setSimpleWholesalePrice('');
                        setSimpleDarazPrice('');
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Final unit cost in BDT (including shipping & all expenses)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="simpleRetailPrice">
                      Retail Price (BDT) *
                      {simpleLandedCost && simpleRetailPrice ? (
                        <span className={`text-xs font-semibold ml-1 ${
                          isProfitInvalid(simpleRetailPrice, simpleLandedCost)
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          ({calculateMarginPercent(parseFloat(simpleRetailPrice), parseFloat(simpleLandedCost)).toFixed(1)}% margin)
                        </span>
                      ) : settings.default_margin_retail ? (
                        <span className="text-xs text-muted-foreground ml-1">
                          (+{settings.default_margin_retail}% default)
                        </span>
                      ) : null}
                    </Label>
                    <Input
                      id="simpleRetailPrice"
                      type="number"
                      step="1"
                      placeholder="Auto-calculated"
                      value={simpleRetailPrice}
                      onChange={(e) => setSimpleRetailPrice(e.target.value)}
                      className={isProfitInvalid(simpleRetailPrice, simpleLandedCost) ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    <p className={`text-xs mt-1 ${
                      isProfitInvalid(simpleRetailPrice, simpleLandedCost)
                        ? 'text-red-600 font-semibold'
                        : 'text-muted-foreground'
                    }`}>
                      {simpleLandedCost && simpleRetailPrice
                        ? isProfitInvalid(simpleRetailPrice, simpleLandedCost)
                          ? `⚠ Loss: ৳${Math.abs(Math.ceil(parseFloat(simpleRetailPrice) - parseFloat(simpleLandedCost)))} - Price must be greater than cost!`
                          : `Profit: ৳${Math.ceil(parseFloat(simpleRetailPrice) - parseFloat(simpleLandedCost))}`
                        : 'Price will auto-calculate from landed cost'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simpleWholesalePrice">
                      Wholesale Price (BDT)
                      {simpleLandedCost && simpleWholesalePrice ? (
                        <span className={`text-xs font-semibold ml-1 ${
                          isProfitInvalid(simpleWholesalePrice, simpleLandedCost)
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          ({calculateMarginPercent(parseFloat(simpleWholesalePrice), parseFloat(simpleLandedCost)).toFixed(1)}% margin)
                        </span>
                      ) : settings.default_margin_wholesale ? (
                        <span className="text-xs text-muted-foreground ml-1">
                          (+{settings.default_margin_wholesale}% default)
                        </span>
                      ) : null}
                    </Label>
                    <Input
                      id="simpleWholesalePrice"
                      type="number"
                      step="1"
                      placeholder="Auto-calculated"
                      value={simpleWholesalePrice}
                      onChange={(e) => setSimpleWholesalePrice(e.target.value)}
                      className={isProfitInvalid(simpleWholesalePrice, simpleLandedCost) ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    <p className={`text-xs mt-1 ${
                      isProfitInvalid(simpleWholesalePrice, simpleLandedCost)
                        ? 'text-red-600 font-semibold'
                        : 'text-muted-foreground'
                    }`}>
                      {simpleLandedCost && simpleWholesalePrice
                        ? isProfitInvalid(simpleWholesalePrice, simpleLandedCost)
                          ? `⚠ Loss: ৳${Math.abs(Math.ceil(parseFloat(simpleWholesalePrice) - parseFloat(simpleLandedCost)))} - Price must be greater than cost!`
                          : `Profit: ৳${Math.ceil(parseFloat(simpleWholesalePrice) - parseFloat(simpleLandedCost))}`
                        : 'Price will auto-calculate from landed cost'}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="simpleDarazPrice">
                      Daraz Price (BDT)
                      {simpleLandedCost && simpleDarazPrice ? (
                        <span className={`text-xs font-semibold ml-1 ${
                          isProfitInvalid(simpleDarazPrice, simpleLandedCost)
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          ({calculateMarginPercent(parseFloat(simpleDarazPrice), parseFloat(simpleLandedCost)).toFixed(1)}% margin)
                        </span>
                      ) : settings.default_margin_daraz ? (
                        <span className="text-xs text-muted-foreground ml-1">
                          (+{settings.default_margin_daraz}% default)
                        </span>
                      ) : null}
                    </Label>
                    <Input
                      id="simpleDarazPrice"
                      type="number"
                      step="1"
                      placeholder="Auto-calculated"
                      value={simpleDarazPrice}
                      onChange={(e) => setSimpleDarazPrice(e.target.value)}
                      className={isProfitInvalid(simpleDarazPrice, simpleLandedCost) ? 'border-red-500 focus:border-red-500' : ''}
                    />
                    <p className={`text-xs mt-1 ${
                      isProfitInvalid(simpleDarazPrice, simpleLandedCost)
                        ? 'text-red-600 font-semibold'
                        : 'text-muted-foreground'
                    }`}>
                      {simpleLandedCost && simpleDarazPrice
                        ? isProfitInvalid(simpleDarazPrice, simpleLandedCost)
                          ? `⚠ Loss: ৳${Math.abs(Math.ceil(parseFloat(simpleDarazPrice) - parseFloat(simpleLandedCost)))} - Price must be greater than cost!`
                          : `Profit: ৳${Math.ceil(parseFloat(simpleDarazPrice) - parseFloat(simpleLandedCost))}`
                        : 'Price will auto-calculate from landed cost'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Variable Product Info */}
            {productType === 'variable' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  You'll configure variants (colors, sizes, etc.) in the next step.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Variants (only for variable products) */}
      {currentStep === 2 && productType === 'variable' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Step 2: Variants & Stock Split</CardTitle>
                <CardDescription>
                  Split the ordered quantity into specific variants with pricing
                </CardDescription>
              </div>
              <Button onClick={addVariantRow} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Attribute Type Management */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <Label className="text-sm font-semibold mb-2 block">Attribute Types</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {attributeTypes.map((type) => (
                  <div
                    key={type}
                    className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border"
                  >
                    <span className="text-sm">{type}</span>
                    <button
                      onClick={() => removeAttributeType(type)}
                      className="text-red-500 hover:text-red-700 ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add new attribute type (e.g., Material)"
                  value={newAttributeType}
                  onChange={(e) => setNewAttributeType(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAttributeType()}
                  className="max-w-xs"
                />
                <Button onClick={addAttributeType} size="sm" variant="secondary">
                  Add
                </Button>
              </div>
            </div>

            {/* Variant Rows */}
            <div className="space-y-4">
              {variantRows.map((row, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">Variant {index + 1}</span>
                    {variantRows.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariantRow(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  {/* Attributes */}
                  <div className="grid grid-cols-3 gap-3">
                    {attributeTypes.map((attrType) => (
                      <div key={attrType}>
                        <Label className="text-xs">{attrType}</Label>
                        <Input
                          placeholder={`e.g., ${attrType === 'Color' ? 'Red' : attrType === 'Size' ? 'L' : attrType}`}
                          value={row.attributes[attrType] || ''}
                          onChange={(e) =>
                            updateVariantAttribute(index, attrType, e.target.value)
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* SKU and Quantity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">SKU *</Label>
                      <Input
                        placeholder="e.g., PROD-001-RED-L"
                        value={row.sku}
                        onChange={(e) => updateVariantRow(index, 'sku', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Quantity *</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={row.qty}
                        onChange={(e) => updateVariantRow(index, 'qty', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Landed Cost (BDT)</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="0.00"
                        value={row.landed_cost}
                        onChange={(e) =>
                          updateVariantRow(index, 'landed_cost', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Retail Price (BDT) *</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Auto-calculated"
                        value={row.retail_price}
                        onChange={(e) =>
                          updateVariantRow(index, 'retail_price', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Wholesale Price (BDT)</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Auto-calculated"
                        value={row.wholesale_price}
                        onChange={(e) =>
                          updateVariantRow(index, 'wholesale_price', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Daraz Price (BDT)</Label>
                      <Input
                        type="number"
                        step="1"
                        placeholder="Auto-calculated"
                        value={row.daraz_price}
                        onChange={(e) =>
                          updateVariantRow(index, 'daraz_price', e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Quantity Summary */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Variant Quantity:</span>
                <span className="text-lg font-bold">
                  {variantRows.reduce((sum, row) => sum + (parseInt(row.qty) || 0), 0)} / {remainingQty}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Product Details */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Product Details</CardTitle>
            <CardDescription>
              Add product descriptions and images (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                placeholder="Brief product summary..."
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {shortDescription.length} / 200 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="galleryImages">Gallery Images (URLs, comma-separated)</Label>
              <Textarea
                id="galleryImages"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                value={galleryImages.join(', ')}
                onChange={(e) => setGalleryImages(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: SEO & Meta */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 4: SEO & Meta Information</CardTitle>
            <CardDescription>
              Optimize your product for search engines (optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                placeholder="SEO-friendly title"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {metaTitle.length} / 60 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                placeholder="SEO-friendly description"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {metaDescription.length} / 160 characters
              </p>
            </div>

            <div>
              <Label htmlFor="metaKeywords">Meta Keywords</Label>
              <Input
                id="metaKeywords"
                placeholder="keyword1, keyword2, keyword3"
                value={metaKeywords}
                onChange={(e) => setMetaKeywords(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Complete & Save
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// Step Indicator Component
interface StepIndicatorProps {
  step: number;
  currentStep: number;
  label: string;
  isCompleted: boolean;
}

function StepIndicator({ step, currentStep, label, isCompleted }: StepIndicatorProps) {
  const isActive = step === currentStep;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-300 text-gray-600'
        }`}
      >
        {isCompleted ? <Check className="h-5 w-5" /> : step}
      </div>
      <span
        className={`text-xs mt-1 font-medium ${
          isActive ? 'text-blue-600' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}
