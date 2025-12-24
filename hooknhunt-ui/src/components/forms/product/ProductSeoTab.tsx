import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Search, Globe, Link as LinkIcon, RefreshCw, Loader2, CheckCircle, AlertTriangle, Tag } from 'lucide-react';
import api from '@/lib/api';

// SEO Schema
const seoSchema = z.object({
  meta_title: z.string().min(1, 'Meta title is required').max(60, 'Meta title should be max 60 characters'),
  meta_description: z.string().min(1, 'Meta description is required').max(160, 'Meta description should be max 160 characters'),
  meta_keywords: z.string().optional(),
  canonical_url: z.string().url('Invalid URL format').optional().or(z.literal('')),
});

interface ProductSeoTabProps {
  product: {
    id: number;
    base_name: string;
    slug?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    canonical_url?: string;
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
      meta_keywords: product.meta_keywords || '',
      canonical_url: product.canonical_url || '',
    },
  });

  const currentTitle = form.watch('meta_title');
  const currentDescription = form.watch('meta_description');
  const currentKeywords = form.watch('meta_keywords');

  // Calculate SEO Score
  const seoScore = useMemo(() => {
    let score = 0;
    const maxScore = 100;

    // Title checks
    if (currentTitle.length >= 30 && currentTitle.length <= 60) score += 25;
    else if (currentTitle.length > 0) score += 10;

    // Description checks
    if (currentDescription.length >= 120 && currentDescription.length <= 160) score += 25;
    else if (currentDescription.length > 0) score += 10;

    // Get first keyword from comma-separated list
    const primaryKeyword = currentKeywords.split(',')[0]?.trim().toLowerCase();

    // Keyphrase in title
    if (primaryKeyword && currentTitle.toLowerCase().includes(primaryKeyword)) {
      score += 15;
    }

    // Keyphrase in description
    if (primaryKeyword && currentDescription.toLowerCase().includes(primaryKeyword)) {
      score += 15;
    }

    // Keyphrase exists
    if (currentKeywords.length >= 3) score += 10;

    // Content length check (assuming product has description)
    if (product.base_name || product.meta_description) score += 10;

    return score;
  }, [currentTitle, currentDescription, currentKeywords, product]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Okay';
    return 'Needs Work';
  };

  const onSubmit = async (values: z.infer<typeof seoSchema>) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('meta_title', values.meta_title);
      formData.append('meta_description', values.meta_description);
      formData.append('meta_keywords', values.meta_keywords || '');
      if (values.canonical_url) {
        formData.append('canonical_url', values.canonical_url);
      }

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main SEO Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Preview Snippet - RankMath Style */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">Google Preview</span>
                  </div>
                </div>

                {/* Google Preview */}
                <div className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="space-y-1">
                    {/* Site Name */}
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold">
                        H
                      </div>
                      <span className="text-sm text-gray-700">Your Store</span>
                      <span className="text-xs text-gray-500">▼</span>
                    </div>

                    {/* URL */}
                    <div className="text-sm text-green-800 truncate">
                      https://yourstore.com › products › {product.slug || product.id}
                    </div>

                    {/* Title */}
                    <div className="text-xl text-blue-900 font-normal leading-tight">
                      {currentTitle || product.base_name || 'Product Title'}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-gray-600 leading-snug">
                      {currentDescription || 'No meta description available. Add a compelling description to improve your click-through rate.'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Keywords */}
            <Card>
              <CardContent className="p-6">
                <FormField
                  control={form.control}
                  name="meta_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <Tag className="h-4 w-4 text-primary" />
                        Focus Keyphrase / Search Keywords
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g., men's running shoes, athletic shoes, jogging shoes"
                          rows={2}
                          className="border-gray-300 focus:border-primary resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter comma-separated keywords. The first keyword will be used as your primary focus keyphrase for SEO analysis.
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Title & Description */}
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Meta Title */}
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        SEO Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter SEO title"
                          className={`border-gray-300 focus:border-primary ${
                            currentTitle.length > 60 ? 'border-red-500' :
                            currentTitle.length > 50 ? 'border-yellow-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-colors ${
                                currentTitle.length > 60 ? 'bg-red-500' :
                                currentTitle.length > 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((currentTitle.length / 60) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            currentTitle.length > 60 ? 'text-red-600' :
                            currentTitle.length > 50 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {currentTitle.length}/60
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Recommended: 50-60 characters</span>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Meta Description */}
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Meta Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter meta description"
                          rows={3}
                          className={`border-gray-300 focus:border-primary resize-none ${
                            currentDescription.length > 160 ? 'border-red-500' :
                            currentDescription.length > 150 ? 'border-yellow-500' : ''
                          }`}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-colors ${
                                currentDescription.length > 160 ? 'bg-red-500' :
                                currentDescription.length > 150 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${Math.min((currentDescription.length / 160) * 100, 100)}%` }}
                            />
                          </div>
                          <span className={`text-xs font-medium ${
                            currentDescription.length > 160 ? 'text-red-600' :
                            currentDescription.length > 150 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {currentDescription.length}/160
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Recommended: 150-160 characters</span>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Advanced Settings */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Advanced</h3>

                <FormField
                  control={form.control}
                  name="canonical_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-sm font-medium text-gray-600">
                        <LinkIcon className="h-4 w-4" />
                        Canonical URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://yourstore.com/products/your-product"
                          className="border-gray-300 focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-gray-500 mt-1">
                        The canonical URL is used to tell search engines which version of a page should be indexed.
                      </p>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - SEO Score & Analysis */}
          <div className="space-y-6">
            {/* SEO Score Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">SEO Score</h3>

                <div className={`rounded-lg border-2 p-4 text-center ${getScoreColor(seoScore)}`}>
                  <div className="text-4xl font-bold mb-1">{seoScore}</div>
                  <div className="text-sm font-medium mb-2">{getScoreLabel(seoScore)}/100</div>

                  {seoScore >= 80 ? (
                    <CheckCircle className="h-6 w-6 mx-auto" />
                  ) : seoScore >= 50 ? (
                    <RefreshCw className="h-6 w-6 mx-auto" />
                  ) : (
                    <AlertTriangle className="h-6 w-6 mx-auto" />
                  )}
                </div>

                {/* SEO Checklist */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-semibold text-gray-600 uppercase">Basic SEO</h4>

                  <div className="flex items-center gap-2 text-xs">
                    {currentKeywords.length >= 3 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={currentKeywords.length >= 3 ? 'text-gray-700' : 'text-gray-400'}>
                      Focus keyphrase set
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {currentTitle.length >= 30 && currentTitle.length <= 60 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={currentTitle.length >= 30 && currentTitle.length <= 60 ? 'text-gray-700' : 'text-gray-400'}>
                      SEO title length
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {currentDescription.length >= 120 && currentDescription.length <= 160 ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={currentDescription.length >= 120 && currentDescription.length <= 160 ? 'text-gray-700' : 'text-gray-400'}>
                      Meta description length
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {(() => {
                      const primaryKeyword = currentKeywords.split(',')[0]?.trim().toLowerCase();
                      return primaryKeyword && currentTitle.toLowerCase().includes(primaryKeyword) ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                      );
                    })()}
                    <span className={(() => {
                      const primaryKeyword = currentKeywords.split(',')[0]?.trim().toLowerCase();
                      return primaryKeyword && currentTitle.toLowerCase().includes(primaryKeyword) ? 'text-gray-700' : 'text-gray-400';
                    })()}>
                      Keyphrase in SEO title
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {(() => {
                      const primaryKeyword = currentKeywords.split(',')[0]?.trim().toLowerCase();
                      return primaryKeyword && currentDescription.toLowerCase().includes(primaryKeyword) ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <div className="h-3 w-3 rounded-full border-2 border-gray-300" />
                      );
                    })()}
                    <span className={(() => {
                      const primaryKeyword = currentKeywords.split(',')[0]?.trim().toLowerCase();
                      return primaryKeyword && currentDescription.toLowerCase().includes(primaryKeyword) ? 'text-gray-700' : 'text-gray-400';
                    })()}>
                      Keyphrase in meta description
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Save SEO Settings
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
