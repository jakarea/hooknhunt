import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import api from '@/lib/api';

// SEO Schema
const seoSchema = z.object({
  meta_title: z.string().min(1, 'Meta title is required').max(60, 'Meta title should be max 60 characters'),
  meta_description: z.string().min(1, 'Meta description is required').max(160, 'Meta description should be max 160 characters'),
});

interface ProductSeoTabProps {
  product: {
    id: number;
    base_name: string;
    meta_title?: string;
    meta_description?: string;
    base_thumbnail_url?: string | null;
    gallery_images?: string[] | null;
  };
  onSeoUpdated: () => void;
}

export const ProductSeoTab: React.FC<ProductSeoTabProps> = ({ product, onSeoUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      meta_title: product.meta_title || product.base_name || '',
      meta_description: product.meta_description || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof seoSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('meta_title', values.meta_title);
      formData.append('meta_description', values.meta_description);

      const response = await api.post(`/admin/products/${product.id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: "Success",
        description: "SEO information updated successfully!",
      });

      if (onSeoUpdated) {
        onSeoUpdated();
      }
    } catch (error: any) {
      console.error('❌ Error updating SEO:', error);
      toast({
        title: "Error",
        description: "Failed to update SEO information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentTitle = form.watch('meta_title');
  const currentDescription = form.watch('meta_description');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* SEO Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">SEO Information</CardTitle>
            </div>
            <CardDescription>
              Optimize your product for search engines and improve visibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Meta Title */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="meta_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Meta Title</span>
                      <span className={`text-xs ${
                        currentTitle.length > 60 ? 'text-red-500' :
                        currentTitle.length > 50 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {currentTitle.length}/60
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter meta title for SEO"
                        className={currentTitle.length > 60 ? 'border-red-500' : ''}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      Recommended: 50-60 characters. This appears in search engine results.
                    </p>
                  </FormItem>
                )}
              />
            </div>

            {/* Meta Description */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="meta_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      <span>Meta Description</span>
                      <span className={`text-xs ${
                        currentDescription.length > 160 ? 'text-red-500' :
                        currentDescription.length > 150 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {currentDescription.length}/160
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter meta description for SEO"
                        rows={4}
                        className={`resize-none ${
                          currentDescription.length > 160 ? 'border-red-500' : ''
                        }`}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      Recommended: 150-160 characters. This appears in search engine results.
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* SEO Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Google Search Preview</CardTitle>
            <CardDescription>
              See how your product will appear in Google search results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-white max-w-2xl">
              <div className="space-y-2">
                {/* URL */}
                <div className="text-sm text-green-700">
                  https://yourstore.com/products/{product.id}
                </div>

                {/* Title */}
                <div className="text-lg text-blue-800 font-medium hover:underline cursor-pointer">
                  {currentTitle || product.base_name || 'Product Title'}
                </div>

                {/* Description */}
                <div className="text-sm text-gray-600 leading-relaxed">
                  {currentDescription || 'No meta description available'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Save your changes</p>
              <p className="text-xs text-gray-500">
                Update SEO metadata for better search visibility
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
                Save SEO
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};