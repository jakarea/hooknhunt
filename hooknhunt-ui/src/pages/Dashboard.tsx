import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Package, ShoppingCart, TrendingUp, Plus, ArrowRight, Activity, BarChart3, Users2, Settings, Loader2 } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  recent_activity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    relative_time: string;
    color: string;
  }>;
}

const Dashboard = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num).replace('BDT', '৳');
  };

  // Translated stats config using useMemo for performance
  const statsConfig = useMemo(() => [
    {
      title: t('total_users'),
      value: stats ? formatNumber(stats.total_users) : '---',
      description: t('from_last_month', { percent: 12 }),
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      roles: ['super_admin', 'admin'],
    },
    {
      title: t('total_products'),
      value: stats ? formatNumber(stats.total_products) : '---',
      description: t('from_last_month', { percent: 8 }),
      icon: <Package className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-50',
      roles: ['super_admin', 'admin', 'store_keeper', 'seller'],
    },
    {
      title: t('total_orders'),
      value: stats ? formatNumber(stats.total_orders) : '---',
      description: t('from_last_month', { percent: 23 }),
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      roles: ['super_admin', 'admin', 'seller'],
    },
    {
      title: t('revenue'),
      value: stats ? formatCurrency(stats.total_revenue) : '---',
      description: t('from_last_month', { percent: 15 }),
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      bgColor: 'bg-orange-50',
      roles: ['super_admin', 'admin'],
    },
  ], [t, stats]);

  const getActivityColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const hasAccess = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const filteredStats = statsConfig.filter((stat) => hasAccess(stat.roles));

  // Get translated role name
  const getRoleName = (role: string) => {
    return t(`roles.${role}`, role);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('welcome_message')}</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {getRoleName(user?.role || '')}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <Card className="bg-gradient-to-r from-red-600 to-red-800 border-none shadow-lg mb-8">
          <CardContent className="p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {t('welcome_back', { name: user?.name })}
                </h2>
                <p className="text-red-100">
                  {t('logged_in_as')} <span className="font-semibold capitalize">{getRoleName(user?.role || '')}</span>
                </p>
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <Activity className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {filteredStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('quick_actions')}
                </CardTitle>
                <CardDescription>{t('quick_actions_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hasAccess(['super_admin', 'admin']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-blue-50 hover:border-blue-300"
                      asChild
                    >
                      <Link to="/users">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{t('manage_users')}</div>
                            <div className="text-sm text-gray-600">{t('manage_users_desc')}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </Link>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'store_keeper', 'seller']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-green-50 hover:border-green-300"
                      asChild
                    >
                      <Link to="/products">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{t('view_products')}</div>
                            <div className="text-sm text-gray-600">{t('view_products_desc')}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </Link>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'seller']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-purple-50 hover:border-purple-300"
                      asChild
                    >
                      <Link to="/purchase/list">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{t('purchase_orders')}</div>
                            <div className="text-sm text-gray-600">{t('purchase_orders_desc')}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </Link>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'store_keeper']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-orange-50 hover:border-orange-300"
                      asChild
                    >
                      <Link to="/purchase/suppliers">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Users2 className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">{t('suppliers')}</div>
                            <div className="text-sm text-gray-600">{t('suppliers_desc')}</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('recent_activity')}
                </CardTitle>
                <CardDescription>{t('recent_activity_desc')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  {stats && stats.recent_activity && stats.recent_activity.length > 0 ? (
                    stats.recent_activity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <div className={`h-2 w-2 rounded-full ${getActivityColor(activity.color)} mt-2 flex-shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.relative_time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">{t('no_recent_activity')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
