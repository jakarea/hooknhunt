// src/pages/settings/tabs/PaymentSettings.tsx
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
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Save, RefreshCw, AlertCircle, CreditCard, Wallet } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  sslcommerz_store_id: z.string(),
  sslcommerz_store_password: z.string(),
  sslcommerz_is_sandbox: z.boolean(),
  bkash_app_key: z.string(),
  bkash_app_secret: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const PaymentSettings = () => {
  const { t } = useTranslation('settings');
  const settings = useSettings();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { fetchSettings, updateSettings } = useSettingStore();

  const initialValue = useMemo(() => ({
    sslcommerz_store_id: settings.sslcommerz_store_id || '',
    sslcommerz_store_password: settings.sslcommerz_store_password || '',
    sslcommerz_is_sandbox: settings.sslcommerz_is_sandbox === '1' || settings.sslcommerz_is_sandbox === true,
    bkash_app_key: settings.bkash_app_key || '',
    bkash_app_secret: settings.bkash_app_secret || '',
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
      // Convert boolean to string for backend
      const submitData = {
        ...data,
        sslcommerz_is_sandbox: data.sslcommerz_is_sandbox ? '1' : '0',
      };
      await updateSettings(submitData);
      toast({
        title: t('payment_tab.toast.success_title'),
        description: t('payment_tab.toast.success_description'),
      });
    } catch (err) {
      toast({
        title: t('payment_tab.toast.error_title'),
        description: t('payment_tab.toast.error_description'),
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
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
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
              <p className="font-semibold text-red-900">{t('payment_tab.error_loading')}</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button onClick={handleRetry} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('payment_tab.retry_button')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* SSLCOMMERZ Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                {t('payment_tab.ssl_card.title')}
              </CardTitle>
              <CardDescription>
                {t('payment_tab.ssl_card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="sslcommerz_store_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment_tab.ssl_card.store_id_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('payment_tab.ssl_card.store_id_placeholder')}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('payment_tab.ssl_card.store_id_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sslcommerz_store_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment_tab.ssl_card.store_password_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••••"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('payment_tab.ssl_card.store_password_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sslcommerz_is_sandbox"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">{t('payment_tab.ssl_card.sandbox_label')}</FormLabel>
                      <FormDescription>
                        {t('payment_tab.ssl_card.sandbox_description')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* bKash Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-pink-600" />
                {t('payment_tab.bkash_card.title')}
              </CardTitle>
              <CardDescription>
                {t('payment_tab.bkash_card.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="bkash_app_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment_tab.bkash_card.app_key_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t('payment_tab.bkash_card.app_key_placeholder')}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('payment_tab.bkash_card.app_key_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bkash_app_secret"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('payment_tab.bkash_card.app_secret_label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••••"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      {t('payment_tab.bkash_card.app_secret_description')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="font-medium">{t('payment_tab.bkash_card.info_title')}</p>
                    <p className="mt-1">
                      {t('payment_tab.bkash_card.info_description')}
                    </p>
                  </div>
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
              {isLoading ? t('payment_tab.form.saving') : t('payment_tab.form.save_button')}
            </Button>

            {form.formState.isDirty && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
              >
                {t('payment_tab.form.reset_button')}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};
