// src/pages/inventory/ReceiveStockCompact.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import apiClient from '@/lib/apiClient';

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

interface VariantRow {
  id: string;
  sku: string;
  variant_name: string;
  quantity: string;
  landed_cost: string;
  retail_price: string;
  wholesale_price: string;
  daraz_price: string;
}

export function ReceiveStockCompact() {
  const { poItemId } = useParams<{ poItemId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [poItem, setPoItem] = useState<PoItem | null>(null);

  const [variants, setVariants] = useState<VariantRow[]>([
    {
      id: '1',
      sku: '',
      variant_name: 'Default Variant',
      quantity: '',
      landed_cost: '',
      retail_price: '',
      wholesale_price: '',
      daraz_price: ''
    }
  ]);

  // Calculate quantities
  const orderedQty = poItem?.quantity || 0;
  const stockedQty = poItem?.stocked_quantity || 0;
  const remainingQty = orderedQty - stockedQty;

  // Calculate total quantity being input
  const totalInputQty = variants.reduce((sum, variant) => {
    const qty = parseInt(variant.quantity) || 0;
    return sum + qty;
  }, 0);

  useEffect(() => {
    if (poItemId) {
      fetchPoItem();
    }
  }, [poItemId]);

  const fetchPoItem = async () => {
    try {
      setLoading(true);
      // poItemId is actually a purchase order item ID, not purchase order ID
      const response = await apiClient.get(`/admin/purchase-order-items/${poItemId}`);
      setPoItem(response.data);
    } catch (error) {
      console.error('Error fetching PO item:', error);
      toast.error('Failed to load purchase order item');
    } finally {
      setLoading(false);
    }
  };

  const addVariant = () => {
    const newId = (variants.length + 1).toString();
    setVariants([
      ...variants,
      {
        id: newId,
        sku: '',
        variant_name: `Variant ${newId}`,
        quantity: '',
        landed_cost: '',
        retail_price: '',
        wholesale_price: '',
        daraz_price: ''
      }
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 1) {
      setVariants(variants.filter(v => v.id !== id));
    }
  };

  const updateVariant = (id: string, field: keyof VariantRow, value: string) => {
    setVariants(prevVariants =>
      prevVariants.map(variant =>
        variant.id === id ? { ...variant, [field]: value } : variant
      )
    );
  };

  const calculatePrices = (landedCost: string) => {
    const cost = parseFloat(landedCost) || 0;
    if (cost <= 0) return { retail: '', wholesale: '', daraz: '' };

    return {
      retail: (cost * 1.5).toFixed(2),  // 50% margin
      wholesale: (cost * 1.2).toFixed(2), // 20% margin
      daraz: (cost * 1.6).toFixed(2)      // 60% margin
    };
  };

  const handleLandedCostChange = (id: string, value: string) => {
    updateVariant(id, 'landed_cost', value);

    const prices = calculatePrices(value);
    updateVariant(id, 'retail_price', prices.retail);
    updateVariant(id, 'wholesale_price', prices.wholesale);
    updateVariant(id, 'daraz_price', prices.daraz);
  };

  const canSave = () => {
    const allValid = variants.every(variant =>
      variant.sku.trim() &&
      variant.quantity.trim() &&
      parseInt(variant.quantity) > 0 &&
      variant.landed_cost.trim() &&
      parseFloat(variant.landed_cost) > 0
    );

    const quantityValid = totalInputQty > 0 && totalInputQty <= remainingQty;
    return allValid && quantityValid;
  };

  const handleSave = async () => {
    if (!canSave() || !poItem) return;

    setSubmitting(true);
    try {
      const payload = {
        po_item_id: parseInt(poItemId!),
        variants: variants.map(variant => ({
          sku: variant.sku,
          variant_name: variant.variant_name,
          quantity: parseInt(variant.quantity),
          landed_cost: parseFloat(variant.landed_cost),
          retail_price: parseFloat(variant.retail_price) || undefined,
          wholesale_price: parseFloat(variant.wholesale_price) || undefined,
          daraz_price: parseFloat(variant.daraz_price) || undefined,
        }))
      };

      await apiClient.post('/admin/inventory/receive-stock', payload);
      toast.success('Stock received successfully');

      // Navigate back to purchase order
      setTimeout(() => {
        navigate(`/purchase/${poItem.purchase_order_id}`);
      }, 1500);

    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to receive stock');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/purchase/${poItem.purchase_order_id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <Package className="h-6 w-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Receive Stock: {poItem.product?.base_name || 'Product'}
                </h1>
                <p className="text-xs text-gray-600">Add variants and set pricing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Quantity Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Ordered</p>
                <p className="text-2xl font-bold">{orderedQty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Already Stocked</p>
                <p className="text-2xl font-bold">{stockedQty}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining</p>
                <p className={`text-2xl font-bold ${totalInputQty > remainingQty ? 'text-red-600' : 'text-blue-600'}`}>
                  {remainingQty}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Variants Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Variants
                </CardTitle>
                <CardDescription>
                  Add SKU, quantities, and set prices for each variant
                </CardDescription>
              </div>
              <Button onClick={addVariant} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-700">
                    <th className="pb-3">Variant Name</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Quantity</th>
                    <th className="pb-3">Landed Cost</th>
                    <th className="pb-3 text-blue-600">Retail Price</th>
                    <th className="pb-3 text-green-600">Wholesale Price</th>
                    <th className="pb-3 text-orange-600">Daraz Price</th>
                    <th className="pb-3 text-center w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((variant, index) => (
                    <tr key={variant.id} className="border-b">
                      <td className="py-3">
                        <Input
                          value={variant.variant_name}
                          onChange={(e) => updateVariant(variant.id, 'variant_name', e.target.value)}
                          placeholder="Variant name"
                          className="w-40"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          value={variant.sku}
                          onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                          placeholder="SKU"
                          className="w-32"
                          required
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={variant.quantity}
                          onChange={(e) => updateVariant(variant.id, 'quantity', e.target.value)}
                          placeholder="Qty"
                          className="w-24"
                          min="1"
                          required
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={variant.landed_cost}
                          onChange={(e) => handleLandedCostChange(variant.id, e.target.value)}
                          placeholder="Cost"
                          className="w-28"
                          min="0"
                          step="0.01"
                          required
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={variant.retail_price}
                          onChange={(e) => updateVariant(variant.id, 'retail_price', e.target.value)}
                          placeholder="Price"
                          className="w-28"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={variant.wholesale_price}
                          onChange={(e) => updateVariant(variant.id, 'wholesale_price', e.target.value)}
                          placeholder="Price"
                          className="w-28"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3">
                        <Input
                          type="number"
                          value={variant.daraz_price}
                          onChange={(e) => updateVariant(variant.id, 'daraz_price', e.target.value)}
                          placeholder="Price"
                          className="w-28"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="py-3 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariant(variant.id)}
                          disabled={variants.length === 1}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Quantity */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Quantity:</span>
                <span className={`font-bold text-lg ${
                  totalInputQty > remainingQty ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {totalInputQty}
                </span>
              </div>
              {totalInputQty > remainingQty && (
                <p className="text-sm text-red-600 mt-1">
                  Exceeds remaining quantity ({remainingQty})
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Link to={`/purchase/${poItem.purchase_order_id}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            onClick={handleSave}
            disabled={!canSave() || submitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {submitting ? 'Saving...' : 'Receive Stock'}
          </Button>
        </div>
      </div>
    </div>
  );
}