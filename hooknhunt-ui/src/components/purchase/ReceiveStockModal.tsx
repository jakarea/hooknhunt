// src/components/purchase/ReceiveStockModal.tsx
import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePurchaseStore } from '@/stores/purchaseStore';
import { toast } from 'sonner';

interface ProductVariant {
  id: number;
  sku: string;
  attributes: any;
  stock_quantity: number;
}

interface PoItem {
  id: number;
  product_id: number;
  quantity: number;
  stocked_quantity?: number;
  product?: {
    id: number;
    base_name: string;
  };
}

interface VariantRow {
  product_variant_id: string;
  quantity: string;
  unit_cost: string;
}

interface ReceiveStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  poItem: PoItem;
  orderId: number;
}

export function ReceiveStockModal({ isOpen, onClose, poItem, orderId }: ReceiveStockModalProps) {
  const { receiveStock, fetchProductVariants } = usePurchaseStore();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [rows, setRows] = useState<VariantRow[]>([
    { product_variant_id: '', quantity: '', unit_cost: '' }
  ]);

  // Calculate remaining quantity
  const orderedQty = poItem.quantity;
  const stockedQty = poItem.stocked_quantity || 0;
  const remainingQty = orderedQty - stockedQty;

  // Load variants when modal opens and reset form
  useEffect(() => {
    if (isOpen && poItem.product_id) {
      loadVariants();
      // Reset rows to initial state when modal opens
      setRows([{ product_variant_id: '', quantity: '', unit_cost: '' }]);
    }
  }, [isOpen, poItem.product_id]);

  const loadVariants = async () => {
    setLoadingVariants(true);
    try {
      const data = await fetchProductVariants(poItem.product_id);
      setVariants(data);
    } catch (error) {
      toast.error('Failed to load product variants');
      console.error(error);
    } finally {
      setLoadingVariants(false);
    }
  };

  const addRow = () => {
    setRows([...rows, { product_variant_id: '', quantity: '', unit_cost: '' }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const updateRow = (index: number, field: keyof VariantRow, value: string) => {
    setRows(prevRows => {
      const newRows = [...prevRows];
      newRows[index] = { ...newRows[index], [field]: value };
      return newRows;
    });
  };

  // Calculate total quantity being input
  const totalInputQty = rows.reduce((sum, row) => {
    const qty = parseInt(row.quantity) || 0;
    return sum + qty;
  }, 0);

  // Validate if save should be enabled
  const canSave = () => {
    // All rows must have variant and quantity
    const allRowsValid = rows.every(row => row.variant_id && row.quantity && parseInt(row.quantity) > 0);
    // Total quantity must not exceed remaining
    const quantityValid = totalInputQty > 0 && totalInputQty <= remainingQty;
    return allRowsValid && quantityValid;
  };

  const handleSave = async () => {
    if (!canSave()) return;

    setSubmitting(true);
    try {
      const payload = {
        po_item_id: poItem.id,
        items: rows.map(row => ({
          product_variant_id: parseInt(row.product_variant_id),
          quantity: parseInt(row.quantity),
          unit_cost: row.unit_cost ? parseFloat(row.unit_cost) : undefined,
        })),
      };

      await receiveStock(orderId, payload);
      toast.success('Stock received successfully');
      onClose();

      // Reset form
      setRows([{ product_variant_id: '', quantity: '', unit_cost: '' }]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to receive stock');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const getVariantDisplay = (variant: ProductVariant) => {
    const attributes = variant.attributes || {};
    const attributeStr = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    return `${variant.sku} ${attributeStr ? `(${attributeStr})` : ''}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Receive Stock for {poItem.product?.base_name || 'Product'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Ordered:</span>
              <span className="font-semibold">{orderedQty}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Already Stocked:</span>
              <span className="font-semibold">{stockedQty}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-gray-600 font-medium">Remaining:</span>
              <span className="font-bold text-blue-600">{remainingQty}</span>
            </div>
          </div>

          {/* Loading state */}
          {loadingVariants && (
            <div className="text-center py-4 text-gray-500">
              Loading variants...
            </div>
          )}

          {/* No variants available */}
          {!loadingVariants && variants.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              No variants available for this product. Please create variants first.
            </div>
          )}

          {/* Variant Rows */}
          {!loadingVariants && variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Add Variants</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
              </div>

              {rows.map((row, index) => (
                <div key={`row-${index}-${row.product_variant_id}`} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`variant-${index}`} className="text-xs">
                      Variant
                    </Label>
                    <Select
                      value={row.product_variant_id}
                      onValueChange={(value) => updateRow(index, 'variant_id', value)}
                    >
                      <SelectTrigger id={`variant-${index}`}>
                        <SelectValue placeholder="Select variant" />
                      </SelectTrigger>
                      <SelectContent>
                        {variants.map((variant) => (
                          <SelectItem key={variant.id} value={variant.id.toString()}>
                            {getVariantDisplay(variant)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-32">
                    <Label htmlFor={`quantity-${index}`} className="text-xs">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      disabled={submitting}
                    />
                  </div>

                  <div className="w-32">
                    <Label htmlFor={`cost-${index}`} className="text-xs">
                      Unit Cost (Optional)
                    </Label>
                    <Input
                      id={`cost-${index}`}
                      type="number"
                      min="0"
                      step="0.5"
                      value={row.unit_cost}
                      onChange={(e) => updateRow(index, 'unit_cost', e.target.value)}
                      placeholder="Cost"
                      disabled={submitting}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1 || submitting}
                    className="mb-0"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}

              {/* Total Quantity Display */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-md">
                <span className="font-medium text-gray-700">Total Quantity:</span>
                <span className={`font-bold text-lg ${
                  totalInputQty > remainingQty ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {totalInputQty}
                </span>
              </div>

              {/* Validation Message */}
              {totalInputQty > remainingQty && (
                <div className="text-sm text-red-600 text-center">
                  Total quantity ({totalInputQty}) exceeds remaining quantity ({remainingQty})
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canSave() || submitting || variants.length === 0}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
