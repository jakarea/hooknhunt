// src/pages/inventory/ReceiveStockNew.tsx
import { useState, useEffect } from 'react';
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ArrowLeft,
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/components/ui/use-toast';

// ... (interface definitions remain the same)

export function ReceiveStockNew() {
  const { poItemId } = useParams<{ poItemId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation('inventory');

  // ... (style and state definitions remain the same)

  // ... (fetchData and other functions remain the same, just update toast messages)

  const fetchPoItem = async () => {
    setLoading(true);
    try {
      // ... (rest of the function)
      if (!foundItem) {
        toast({
          title: t('receiveStock.po_item_not_found'),
          variant: 'destructive',
        });
        navigate('/purchase/list');
      }
    } catch (error) {
      console.error('Error fetching PO item:', error);
      toast({
        title: t('receiveStock.failed_to_load_po_item'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateVariants = () => {
    // ... (rest of the function)
    if (productType === 'variable') {
      const hasSelections = Object.values(selectedAttributeOptions).some(opts => opts.length > 0);
      if (!hasSelections) {
        toast({
          title: t('receiveStock.please_select_one_option'),
          variant: 'destructive',
        });
        return;
      }
      // ... (rest of the function)
    }
    // ... (rest of the function)
  };

  const handleSaveStock = async () => {
    // ... (validation logic)
    const totalQty = variants.reduce((sum, variant) => sum + (parseInt(variant.stockQty) || 0), 0);
    if (totalQty > remainingQty) {
      toast({
        title: t('receiveStock.total_quantity_exceeds_remaining', { total: totalQty, remaining: remainingQty }),
        variant: 'destructive',
      });
      return;
    }
    // ... (rest of save logic)
    try {
      // ... (payload creation)
      const response = await apiClient.post('/admin/inventory/manual-entry', payload);

      if (response.status === 201) {
        setSaveSuccess(true);
        setSaveError(null);
        toast({
          title: t('receiveStock.stock_received_successfully'),
        });
        setTimeout(() => {
          navigate(`/purchase/${poItem?.purchase_order_id}`);
        }, 1500);
      }
    } catch (error) {
        // ... (error handling)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>{t('receiveStock.loading')}</CardTitle>
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
      <div className="min-h-screen bg-gray-50">
        <Card>
          <CardHeader>
            <CardTitle>{t('receiveStock.po_item_not_found')}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/purchase/${poItem.purchase_order_id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Package className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('receiveStock.title', { productName: poItem.product?.base_name || 'Product' })}</h1>
                <p className="text-xs text-gray-600">{t('receiveStock.description')}</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Switch id="wholesale" checked={channels.wholesale} disabled className="opacity-100" />
                <Label htmlFor="wholesale" className="text-sm font-medium text-blue-600">
                  {t('receiveStock.wholesale_channel', { margin: DEFAULT_MARGINS.wholesale })}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="retail" checked={channels.retail} onCheckedChange={() => toggleChannel('retail')} />
                <Label htmlFor="retail" className="cursor-pointer text-sm font-medium text-red-600">
                  {t('receiveStock.retail_channel', { margin: DEFAULT_MARGINS.retail })}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="daraz" checked={channels.daraz} onCheckedChange={() => toggleChannel('daraz')} />
                <Label htmlFor="daraz" className="cursor-pointer text-sm font-medium text-orange-600">
                  {t('receiveStock.daraz_channel', { margin: DEFAULT_MARGINS.daraz })}
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t('receiveStock.ordered')}</div>
                <div className="text-2xl font-bold">{orderedQty}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t('receiveStock.already_stocked')}</div>
                <div className="text-2xl font-bold">{stockedQty}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">{t('receiveStock.remaining_to_receive')}</div>
                <div className="text-2xl font-bold text-blue-600">{remainingQty}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {(validationErrors.selectedProduct || validationErrors.variants || validationErrors.variantSkus || validationErrors.variantLandedCosts) && (
          <Card className="shadow-lg border-red-500 border-2 bg-red-50 sticky top-4 z-10">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-base font-bold mb-2">{t('receiveStock.validation_error_title')}</p>
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
                        {t('receiveStock.sku_required_count', { count: Object.keys(validationErrors.variantSkus).length })}
                      </li>
                    )}
                    {validationErrors.variantLandedCosts && Object.keys(validationErrors.variantLandedCosts).length > 0 && (
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                        {t('receiveStock.landed_cost_required_count', { count: Object.keys(validationErrors.variantLandedCosts).length })}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('receiveStock.product_configuration')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm">{t('receiveStock.product_type')}</Label>
              <RadioGroup
                value={productType}
                onValueChange={(value) => setProductType(value as 'simple' | 'variable')}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="simple" id="simple" />
                  <Label htmlFor="simple" className="cursor-pointer text-sm">{t('receiveStock.simple_product')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="variable" id="variable" />
                  <Label htmlFor="variable" className="cursor-pointer text-sm">{t('receiveStock.variable_product')}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        {productType === 'variable' && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {t('receiveStock.variant_generator')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingAttributes ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{t('receiveStock.loading_attributes')}</p>
                </div>
              ) : attributes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">{t('receiveStock.no_attributes')}</p>
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

                  <Button onClick={generateVariants} className="w-full" size="sm">
                    <Layers className="h-4 w-4 mr-2" />
                    {t('receiveStock.generate_variants')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
        {productType === 'simple' && variants.length === 0 && (
          <Button onClick={generateVariants} className="w-full" size="sm">
            <Package className="h-4 w-4 mr-2" />
            {t('receiveStock.create_product_entry')}
          </Button>
        )}
        {variants.length === 0 && validationErrors.variants && (
          <Card className="shadow-sm border-red-500 border-2 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-600 text-sm font-semibold">{t('receiveStock.validation_error')}</p>
                  <p className="text-red-600 text-sm">{validationErrors.variants[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  {t('receiveStock.stock_pricing_title', { productName: poItem.product?.base_name })}
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {t(variants.length > 1 ? 'receiveStock.variants_count' : 'receiveStock.variant_count', { count: variants.length })}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-3 py-2 text-center font-medium text-gray-700 w-12"></th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-16">{t('receiveStock.thumb')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-28">{t('receiveStock.variant')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('receiveStock.sku')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('receiveStock.stock')}</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-700 w-24">{t('receiveStock.cost')}</th>
                      {channels.wholesale && (
                        <th className="px-3 py-2 text-left font-medium text-blue-700 border-l border-blue-200" colSpan={5}>
                          {t('receiveStock.wholesale')}
                        </th>
                      )}
                      {channels.retail && (
                        <th className="px-3 py-2 text-left font-medium text-red-700 border-l border-red-200" colSpan={5}>
                          {t('receiveStock.retail')}
                        </th>
                      )}
                      {channels.daraz && (
                        <th className="px-3 py-2 text-left font-medium text-orange-700 border-l border-orange-200" colSpan={5}>
                          {t('receiveStock.daraz')}
                        </th>
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
                          <th className="px-3 py-1.5 text-left text-gray-600 border-l border-blue-200">{t('receiveStock.name')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.price')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.offer')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.start')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.end')}</th>
                        </>
                      )}
                      {channels.retail && (
                        <>
                          <th className="px-3 py-1.5 text-left text-gray-600 border-l border-red-200">{t('receiveStock.name')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.price')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.offer')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.start')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.end')}</th>
                        </>
                      )}
                      {channels.daraz && (
                        <>
                          <th className="px-3 py-1.5 text-left text-gray-600 border-l border-orange-200">{t('receiveStock.name')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.price')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.offer')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.start')}</th>
                          <th className="px-3 py-1.5 text-left text-gray-600">{t('receiveStock.end')}</th>
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
                            title={t('receiveStock.remove_variant_title')}
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
                              placeholder={t('receiveStock.required')}
                              value={variant.sku}
                              onChange={(e) => {
                                updateVariant(variant.id, 'sku', e.target.value);
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
                            max={remainingQty}
                          />
                        </td>

                        {/* Landed Cost */}
                        <td className="px-3 py-2 align-top">
                          <div>
                            <Input
                              type="number"
                              placeholder={t('receiveStock.required')}
                              value={variant.landedCost}
                              onChange={(e) => {
                                updateVariant(variant.id, 'landedCost', e.target.value);
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
                                placeholder={t('receiveStock.optional')}
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
                                placeholder={t('receiveStock.start_date')}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <DatePicker
                                value={variant.wholesaleOfferEnd}
                                onChange={(date) => updateVariant(variant.id, 'wholesaleOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                placeholder={t('receiveStock.end_date')}
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
                                placeholder={t('receiveStock.optional')}
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
                                placeholder={t('receiveStock.start_date')}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <DatePicker
                                value={variant.retailOfferEnd}
                                onChange={(date) => updateVariant(variant.id, 'retailOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                placeholder={t('receiveStock.end_date')}
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
                                placeholder={t('receiveStock.optional')}
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
                                placeholder={t('receiveStock.start_date')}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <DatePicker
                                value={variant.darazOfferEnd}
                                onChange={(date) => updateVariant(variant.id, 'darazOfferEnd', date ? date.toISOString().split('T')[0] : '')}
                                placeholder={t('receiveStock.end_date')}
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
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  {t('receiveStock.product_gallery')}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {t(productData.galleryImages.length > 1 ? 'receiveStock.images_count' : 'receiveStock.image_count', { count: productData.galleryImages.length })}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {t('receiveStock.shared_across_variants')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label
                  htmlFor="product-gallery-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="h-3 w-3" />
                  {t('receiveStock.upload_images')}
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
                  <p className="text-xs text-gray-500">{t('receiveStock.no_images_uploaded')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        {variants.length > 0 && (
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {t('receiveStock.seo_settings')}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {t('receiveStock.global')}
                </Badge>
              </div>
              <CardDescription className="text-xs">
                {t('receiveStock.shared_across_platforms')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title" className="text-sm">
                    {t('receiveStock.meta_title')}
                  </Label>
                  <Input
                    id="meta-title"
                    type="text"
                    placeholder={t('receiveStock.meta_title_placeholder')}
                    value={productData.metaTitle}
                    onChange={(e) => updateProductData('metaTitle', e.target.value)}
                    className="h-9 text-sm"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500">
                    {t('receiveStock.characters', { count: productData.metaTitle.length, max: 60 })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seo-slug" className="text-sm">
                    {t('receiveStock.seo_slug')}
                  </Label>
                  <Input
                    id="seo-slug"
                    type="text"
                    placeholder={t('receiveStock.seo_slug_placeholder')}
                    value={productData.seoSlug}
                    onChange={(e) => updateProductData('seoSlug', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="h-9 text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    {t('receiveStock.seo_slug_description')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description" className="text-sm">
                  {t('receiveStock.meta_description')}
                </Label>
                <Textarea
                  id="meta-description"
                  placeholder={t('receiveStock.meta_description_placeholder')}
                  value={productData.metaDescription}
                  onChange={(e) => updateProductData('metaDescription', e.target.value)}
                  className="min-h-20 text-sm resize-none"
                  maxLength={160}
                />
                <p className="text-xs text-gray-500">
                  {t('receiveStock.characters', { count: productData.metaDescription.length, max: 160 })}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-keywords" className="text-sm">
                  {t('receiveStock.meta_keywords')}
                </Label>
                <Input
                  id="meta-keywords"
                  type="text"
                  placeholder={t('receiveStock.meta_keywords_placeholder')}
                  value={productData.metaKeywords}
                  onChange={(e) => updateProductData('metaKeywords', e.target.value)}
                  className="h-9 text-sm"
                />
                <p className="text-xs text-gray-500">
                  {t('receiveStock.meta_keywords_description')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        {variants.length > 0 && (
          <div className="flex justify-end gap-3 sticky bottom-0 bg-white border-t shadow-lg p-3 rounded-t-lg">
            <Link to={`/purchase/${poItem.purchase_order_id}`}>
              <Button variant="outline" size="sm">
                {t('receiveStock.cancel')}
              </Button>
            </Link>
            <Button
              onClick={handleSaveStock}
              className={`bg-green-600 hover:bg-green-700 ${isSaveButtonShaking ? 'shake' : ''} ${saveSuccess ? 'bg-green-700' : ''}`}
              size="sm"
              disabled={saveSuccess}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('receiveStock.saved_successfully')}
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {t('receiveStock.receive_stock_and_save')}
                </>
              )}
            </Button>
          </div>
        )}
        {saveError && (
          <Card className="shadow-md border-red-500 border-2 bg-red-50 mt-3 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-700 text-base font-bold mb-1">{t('receiveStock.failed_to_save')}</p>
                  <p className="text-red-600 text-sm">{saveError}</p>
                  <p className="text-red-500 text-xs mt-2">{t('receiveStock.check_form_errors')}</p>
                </div>
                <button
                  onClick={() => setSaveError(null)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                  aria-label={t('receiveStock.close_error_message')}
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
}
