// src/pages/settings/tabs/TrackingSettings.tsx
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
import { Save, RefreshCw, AlertCircle, BarChart3, Facebook } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  facebook_pixel_id: z.string(),
  google_analytics_id: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const TrackingSettings = () => {
  const { t } = useTranslation('settings');
  const settings = useSettings();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { fetchSettings, updateSettings } = useSettingStore();

  const initialValue = useMemo(() => ({
    facebook_pixel_id: settings.facebook_pixel_id || '',
    google_analytics_id: settings.google_analytics_id || '',
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
        title: t('tracking_tab.toast.success_title'),
        description: t('tracking_tab.toast.success_description'),
      });
    } catch (err) {
      toast({
        title: t('tracking_tab.toast.error_title'),
        description: t('tracking_tab.toast.error_description'),
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
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{t('tracking_tab.error_loading')}</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button onClick={handleRetry} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('tracking_tab.retry_button')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Facebook Pixel Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5 text-blue-600" />
                {t('tracking_tab.facebook_card.title')}
              </CardTitle>
              <CardDescription>
                {t('tracking_tab.facebook_card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="facebook_pixel_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tracking_tab.facebook_card.pixel_id_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('tracking_tab.facebook_card.pixel_id_placeholder')}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('tracking_tab.facebook_card.pixel_id_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">{t('tracking_tab.facebook_card.info_title')}</p>
                    <ol className="list-decimal ml-4 space-y-1">
                      <li>{t('tracking_tab.facebook_card.info_step1')}</li>
                      <li>{t('tracking_tab.facebook_card.info_step2')}</li>
                      <li>{t('tracking_tab.facebook_card.info_step3')}</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Analytics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                {t('tracking_tab.google_card.title')}
              </CardTitle>
              <CardDescription>
                {t('tracking_tab.google_card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="google_analytics_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tracking_tab.google_card.measurement_id_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('tracking_tab.google_card.measurement_id_placeholder')}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('tracking_tab.google_card.measurement_id_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-medium mb-1">{t('tracking_tab.google_card.info_title')}</p>
                    <ul className="list-disc ml-4 space-y-1">
                      <li><strong>{t('tracking_tab.google_card.info_ga4')}</strong></li>
                      <li><strong>{t('tracking_tab.google_card.info_ua')}</strong></li>
                    </ul>
                    <p className="mt-2 text-xs">
                      {t('tracking_tab.google_card.info_footer')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-6 w-6 text-purple-600 shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">{t('tracking_tab.why_card.title')}</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{t('tracking_tab.why_card.item1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{t('tracking_tab.why_card.item2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{t('tracking_tab.why_card.item3')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span>{t('tracking_tab.why_card.item4')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className="w-full sm:w-auto"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? t('tracking_tab.form.saving') : t('tracking_tab.form.save_button')}
            </Button>

            {form.formState.isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                {t('tracking_tab.form.reset_button')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
