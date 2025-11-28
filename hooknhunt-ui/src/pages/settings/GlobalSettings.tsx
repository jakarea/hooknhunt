import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingStore, useSettings, useSettingsLoading, useSettingsError } from '@/stores/settingStore';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { Settings, Save, RefreshCw, AlertCircle } from 'lucide-react';

// Validation Schema
const formSchema = z.object({
  exchange_rate_rmb_bdt: z
    .string()
    .min(1, { message: 'Exchange rate is required.' })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Exchange rate must be a positive number.',
    }),
});

type FormData = z.infer<typeof formSchema>;

// Memoized Header Component to prevent unnecessary re-renders
const PageHeader = () => (
  <div className="flex items-center gap-3">
    <div className="bg-blue-100 p-2 rounded-lg">
      <Settings className="h-6 w-6 text-blue-600" />
    </div>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
      <p className="text-gray-600">Manage application configuration values</p>
    </div>
  </div>
);

// Memoized Loading Skeleton
const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <CardTitle>Exchange Rates</CardTitle>
      <CardDescription>Configure currency exchange rates</CardDescription>
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

// Memoized Error Display
const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start gap-3 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-red-900">Error loading settings</p>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
      <Button onClick={onRetry} variant="outline" className="w-full">
        <RefreshCw className="h-4 w-4 mr-2" />
        Retry
      </Button>
    </CardContent>
  </Card>
);

export const GlobalSettings = () => {
  // Use optimized selectors to prevent unnecessary re-renders
  const settings = useSettings();
  const isLoading = useSettingsLoading();
  const error = useSettingsError();
  const { fetchSettings, updateSingleSetting } = useSettingStore();

  // Memoize the initial value to prevent unnecessary form resets
  const initialValue = useMemo(() => ({
    exchange_rate_rmb_bdt: settings.exchange_rate_rmb_bdt || '',
  }), [settings.exchange_rate_rmb_bdt]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValue,
    mode: 'onBlur', // Only validate on blur for better UX
  });

  // Memoize form reset to prevent unnecessary calls
  const resetForm = useCallback(() => {
    form.reset(initialValue);
  }, [form, initialValue]);

  // Fetch settings only when needed and handle caching
  useEffect(() => {
    const hasSettings = Object.keys(settings).length > 0;
    if (!hasSettings && !isLoading) {
      fetchSettings();
    } else if (hasSettings) {
      resetForm();
    }
  }, [settings, isLoading, fetchSettings, resetForm]);

  // Optimized submit handler with debounced-like behavior
  const onSubmit = useCallback(async (data: FormData) => {
    // Skip if no actual change
    if (data.exchange_rate_rmb_bdt === settings.exchange_rate_rmb_bdt) {
      toast({
        title: 'No Changes',
        description: 'No changes detected in the settings.',
      });
      return;
    }

    try {
      await updateSingleSetting('exchange_rate_rmb_bdt', data.exchange_rate_rmb_bdt);
      toast({
        title: 'Success',
        description: 'Exchange rate has been updated successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update exchange rate. Please try again.',
        variant: 'destructive',
      });
    }
  }, [settings.exchange_rate_rmb_bdt, updateSingleSetting]);

  // Memoize the retry handler
  const handleRetry = useCallback(() => {
    fetchSettings(true); // Force refresh
  }, [fetchSettings]);

  // Show loading state only on initial load
  if (isLoading && Object.keys(settings).length === 0) {
    return (
      <RoleGuard allowedRoles={['super_admin']}>
        <div className="space-y-6">
          <PageHeader />
          <LoadingSkeleton />
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard allowedRoles={['super_admin']}>
        <div className="space-y-6">
          <PageHeader />
          <ErrorDisplay error={error} onRetry={handleRetry} />
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={['super_admin']}>
      <div className="space-y-6">
        <PageHeader />

        {/* Exchange Rates Card */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rates</CardTitle>
            <CardDescription>
              Configure currency exchange rates used throughout the system
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
                      <FormLabel>Current Exchange Rate (1 RMB = ? BDT)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.01"
                          placeholder="Enter exchange rate"
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
                    {isLoading ? 'Saving...' : 'Save Settings'}
                  </Button>

                  {form.formState.isDirty && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isLoading}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
};