// src/pages/settings/tabs/PricingSettings.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingStore, useSettings, useSettingsLoading, useSettingsError } from '@/stores/settingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Save, RefreshCw, AlertCircle, Percent } from 'lucide-react';

export const PricingSettings = () => {
  const { t } = useTranslation('settings');

  // Validation Schema
  const formSchema = useMemo(() => z.object({
    default_margin_retail: z
      .string()
      .min(1, { message: t('pricing_tab.validation.retail_margin_required') })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: t('pricing_tab.validation.percentage_range'),
      }),
    default_margin_wholesale: z
      .string()
      .min(1, { message: t('pricing_tab.validation.wholesale_margin_required') })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: t('pricing_tab.validation.percentage_range'),
      }),
    default_margin_daraz: z
      .string()
      .min(1, { message: t('pricing_tab.validation.daraz_margin_required') })
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100, {
        message: t('pricing_tab.validation.percentage_range'),
      }),
  }), [t]);

  type FormData = z.infer<typeof formSchema>;

  const settings = useSettings();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { fetchSettings, updateSettings } = useSettingStore();

  const initialValue = useMemo(() => ({
    default_margin_retail: settings.default_margin_retail || '50',
    default_margin_wholesale: settings.default_margin_wholesale || '20',
    default_margin_daraz: settings.default_margin_daraz || '60',
  }), [settings]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue,
    mode: 'onBlur',
  });

  const resetForm = useCallback(() => {
    form.reset(initialValue);
  }, [form, initialValue]);

  useEffect(() => {
    const hasSettings = Object.keys(settings).length > 0;
    if (!hasSettings && !isLoading) {
      fetchSettings();
    } else if (hasSettings) {
      resetForm();
    }
  }, [settings, isLoading, fetchSettings, resetForm]);

  const onSubmit = useCallback(async (data: FormData) => {
    try {
      await updateSettings(data);
      toast({
        title: t('pricing_tab.toast.success_title'),
        description: t('pricing_tab.toast.success_description'),
      });
    } catch (err) {
      toast({
        title: t('pricing_tab.toast.error_title'),
        description: t('pricing_tab.toast.error_description'),
        variant: 'destructive',
      });
    }
  }, [updateSettings, t]);

  const handleRetry = useCallback(() => {
    fetchSettings(true);
  }, [fetchSettings]);

  const hasSettings = Object.keys(settings).length > 0;

  if ((isLoading || !hasSettings) && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('pricing_tab.title')}</CardTitle>
          <CardDescription>{t('pricing_tab.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{t('pricing_tab.error_loading')}</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button onClick={handleRetry} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('pricing_tab.retry_button')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-blue-600" />
            {t('pricing_tab.title')}
          </CardTitle>
          <CardDescription>
            {t('pricing_tab.long_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Retail Margin */}
                <FormField
                  control={form.control}
                  name="default_margin_retail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pricing_tab.form.retail_label')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            placeholder="50"
                            disabled={isLoading}
                            className="pr-8"
                          />
                          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('pricing_tab.form.retail_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Wholesale Margin */}
                <FormField
                  control={form.control}
                  name="default_margin_wholesale"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pricing_tab.form.wholesale_label')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            placeholder="20"
                            disabled={isLoading}
                            className="pr-8"
                          />
                          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('pricing_tab.form.wholesale_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Daraz Margin */}
                <FormField
                  control={form.control}
                  name="default_margin_daraz"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('pricing_tab.form.daraz_label')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type="number"
                            step="0.5"
                            min="0"
                            max="100"
                            placeholder="60"
                            disabled={isLoading}
                            className="pr-8"
                          />
                          <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t('pricing_tab.form.daraz_description')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">{t('pricing_tab.info_box.title')}</p>
                    <p>
                      <strong>{t('pricing_tab.info_box.formula')}</strong>
                    </p>
                    <p className="mt-2 text-xs text-blue-700">
                      {t('pricing_tab.info_box.example')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? t('pricing_tab.form.saving') : t('pricing_tab.form.save_button')}
                </Button>

                {form.formState.isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    {t('pricing_tab.form.reset_button')}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
