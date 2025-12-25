import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Settings, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '@/lib/api';

interface Spec {
  key: string;
  value: string;
}

interface ProductSpecsTabProps {
  product: {
    id: number;
    base_name: string;
    specifications?: Record<string, any> | null;
  };
  onSpecsUpdated: () => void;
}

export const ProductSpecsTab: React.FC<ProductSpecsTabProps> = ({ product, onSpecsUpdated }) => {
  const [specs, setSpecs] = useState<Spec[]>(() => {
    if (!product.specifications || typeof product.specifications !== 'object') {
      return [{ key: '', value: '' }];
    }
    const entries = Object.entries(product.specifications);
    return entries.length > 0
      ? entries.map(([key, value]) => ({
          key,
          value: typeof value === 'object' ? JSON.stringify(value) : String(value ?? ''),
        }))
      : [{ key: '', value: '' }];
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpec = (index: number) => {
    if (specs.length > 1) {
      setSpecs(specs.filter((_, i) => i !== index));
    }
  };

  const updateSpec = (index: number, field: keyof Spec, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = value;
    setSpecs(newSpecs);
  };

  const onSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Convert specs array to object
      const specifications: Record<string, any> = {};
      specs.forEach((spec) => {
        if (spec.key.trim()) {
          specifications[spec.key.trim()] = spec.value.trim();
        }
      });

      const formData = new FormData();
      formData.append('specifications', JSON.stringify(specifications));

      const response = await api.post(`/admin/products/${product.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success",
        description: "Product specifications updated successfully!",
      });

      if (onSpecsUpdated) {
        onSpecsUpdated();
      }
    } catch (error: any) {
      console.error('❌ Error updating specifications:', error);
      toast({
        title: "Error",
        description: "Failed to update specifications. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {/* Specifications Editor */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Product Specifications</CardTitle>
          </div>
          <CardDescription>
            Add key-value pairs to define product specifications (e.g., material, dimensions, weight)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {specs.map((spec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 border rounded-lg bg-gray-50">
              <div className="flex-1 space-y-3">
                <div>
                  <Label htmlFor={`spec-key-${index}`} className="text-sm font-medium">
                    Specification Name
                  </Label>
                  <Input
                    id={`spec-key-${index}`}
                    type="text"
                    placeholder="e.g., material, weight, dimensions"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, 'key', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`spec-value-${index}`} className="text-sm font-medium">
                    Value
                  </Label>
                  <Input
                    id={`spec-value-${index}`}
                    type="text"
                    placeholder="e.g., Cotton, 500g, 10x5x2 inches"
                    value={spec.value}
                    onChange={(e) => updateSpec(index, 'value', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSpec(index)}
                disabled={specs.length === 1}
                className="mt-6 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addSpec}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Specification
          </Button>
        </CardContent>
      </Card>

      {/* Current Specs Preview */}
      {specs.some(s => s.key.trim() && s.value.trim()) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Preview</CardTitle>
            <CardDescription>
              How your specifications will appear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specs
                .filter(s => s.key.trim() && s.value.trim())
                .map((spec, index) => (
                  <div key={index} className="flex justify-between items-start border-b pb-3">
                    <p className="text-sm font-medium capitalize">{spec.key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-gray-600 text-right max-w-xs">{spec.value}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">Save your changes</p>
            <p className="text-xs text-gray-500">
              Update product specifications for detailed product information
            </p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="px-8"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Save Specifications
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
