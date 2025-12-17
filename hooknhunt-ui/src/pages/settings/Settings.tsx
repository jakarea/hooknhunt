// src/pages/settings/Settings.tsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, DollarSign, MessageSquare, Bell, Shield, Package, Percent, CreditCard, BarChart3 } from 'lucide-react';
import { GeneralSettings } from './tabs/GeneralSettings';
import { PricingSettings } from './tabs/PricingSettings';
import { PaymentSettings } from './tabs/PaymentSettings';
import { TrackingSettings } from './tabs/TrackingSettings';
import { SmsSettings } from './tabs/SmsSettings';


export const Settings = () => {
  const { t } = useTranslation('settings');
  const [activeTab, setActiveTab] = useState('general');

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <SettingsIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-gray-600 mt-1">{t('description')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 lg:grid-cols-7 mb-8">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.general')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.pricing')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.payment')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="tracking" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.tracking')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.sms')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2" disabled>
                    <Bell className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.notifications')}</span>
                  </TabsTrigger>
                  <TabsTrigger value="inventory" className="flex items-center gap-2" disabled>
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">{t('tabs.inventory')}</span>
                  </TabsTrigger>
                </TabsList>

                {/* General Settings Tab */}
                <TabsContent value="general" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{t('general.title')}</h2>
                    <p className="text-gray-600">{t('general.description')}</p>
                  </div>
                  <GeneralSettings />
                </TabsContent>

                {/* Pricing Settings Tab */}
                <TabsContent value="pricing" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{t('pricing.title')}</h2>
                    <p className="text-gray-600">{t('pricing.description')}</p>
                  </div>
                  <PricingSettings />
                </TabsContent>

                {/* Payment Gateway Settings Tab */}
                <TabsContent value="payment" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{t('payment.title')}</h2>
                    <p className="text-gray-600">{t('payment.description')}</p>
                  </div>
                  <PaymentSettings />
                </TabsContent>

                {/* Tracking & Analytics Settings Tab */}
                <TabsContent value="tracking" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{t('tracking.title')}</h2>
                    <p className="text-gray-600">{t('tracking.description')}</p>
                  </div>
                  <TrackingSettings />
                </TabsContent>

                {/* SMS Settings Tab */}
                <TabsContent value="sms" className="space-y-4">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{t('sms.title')}</h2>
                    <p className="text-gray-600">{t('sms.description')}</p>
                  </div>
                  <SmsSettings />
                </TabsContent>

                {/* Notifications Settings Tab (Placeholder) */}
                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('notifications_tab.title')}</CardTitle>
                      <CardDescription>{t('notifications_tab.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">{t('notifications_tab.coming_soon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Settings Tab (Placeholder) */}
                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('security.title')}</CardTitle>
                      <CardDescription>{t('security.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">{t('notifications_tab.coming_soon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Inventory Settings Tab (Placeholder) */}
                <TabsContent value="inventory" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('inventory_tab.title')}</CardTitle>
                      <CardDescription>{t('inventory_tab.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">{t('notifications_tab.coming_soon')}</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
  );
};
