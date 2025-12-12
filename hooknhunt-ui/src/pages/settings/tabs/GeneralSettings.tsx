// src/pages/settings/tabs/GeneralSettings.tsx
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingStore, useSettings, useSettingsLoading, useSettingsError } from '@/stores/settingStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Save, RefreshCw, AlertCircle } from 'lucide-react';

export const GeneralSettings = () => {
  const { t } = useTranslation('settings');

  // Validation Schema
  const formSchema = useMemo(() => z.object({
    exchange_rate_rmb_bdt: z
      .string()
      .min(1, { message: t('general_tab.validation.exchange_rate_required') })
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t('general_tab.validation.exchange_rate_positive'),
      }),
  }), [t]);

  type FormData = z.infer<typeof formSchema>;

  const settings = useSettings();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { fetchSettings, updateSingleSetting } = useSettingStore();

  const initialValue = useMemo(() => {
    const value = settings.exchange_rate_rmb_bdt || settings.exchange_rate || '';
    return {
      exchange_rate_rmb_bdt: value,
    };
  }, [settings.exchange_rate_rmb_bdt, settings.exchange_rate]);

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
    if (data.exchange_rate_rmb_bdt === settings.exchange_rate_rmb_bdt) {
      toast({
        title: t('general_tab.toast.no_changes_title'),
        description: t('general_tab.toast.no_changes_description'),
      });
      return;
    }

    try {
      await updateSingleSetting('exchange_rate_rmb_bdt', data.exchange_rate_rmb_bdt);
      toast({
        title: t('general_tab.toast.success_title'),
        description: t('general_tab.toast.success_description'),
      });
    } catch (err) {
      toast({
        title: t('general_tab.toast.error_title'),
        description: t('general_tab.toast.error_description'),
        variant: 'destructive',
      });
    }
  }, [settings.exchange_rate_rmb_bdt, updateSingleSetting, t]);

  const handleRetry = useCallback(() => {
    fetchSettings(true);
  }, [fetchSettings]);

  const hasSettings = Object.keys(settings).length > 0;

  if ((isLoading || !hasSettings) && !error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('general_tab.exchange_rates_card.title')}</CardTitle>
          <CardDescription>{t('general_tab.exchange_rates_card.description_skeleton')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
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
              <p className="font-semibold text-red-900">{t('general_tab.error_loading')}</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button onClick={handleRetry} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('general_tab.retry_button')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Exchange Rates Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('general_tab.exchange_rates_card.title')}</CardTitle>
          <CardDescription>
            {t('general_tab.exchange_rates_card.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="exchange_rate_rmb_bdt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('general_tab.form.label')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        step="0.5"
                        placeholder={t('general_tab.form.placeholder')}
                        disabled={isLoading}
                        className="transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? t('general_tab.form.saving') : t('general_tab.form.save_button')}
                </Button>

                {form.formState.isDirty && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    {t('general_tab.form.reset_button')}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Additional General Settings can be added here */}
      <Card>
        <CardHeader>
          <CardTitle>{t('general_tab.app_settings_card.title')}</CardTitle>
          <CardDescription>{t('general_tab.app_settings_card.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">{t('general_tab.app_settings_card.coming_soon')}</p>
        </CardContent>
      </Card>
    </div>
  );
};
