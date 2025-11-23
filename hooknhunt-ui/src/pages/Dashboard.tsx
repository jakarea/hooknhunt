import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Package, ShoppingCart, TrendingUp, Plus, ArrowRight, Activity, BarChart3, Users2, Settings } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      description: '+12% from last month',
      icon: <Users className="h-6 w-6 text-blue-600" />,
      bgColor: 'bg-blue-50',
      roles: ['super_admin', 'admin'],
    },
    {
      title: 'Total Products',
      value: '456',
      description: '+8% from last month',
      icon: <Package className="h-6 w-6 text-green-600" />,
      bgColor: 'bg-green-50',
      roles: ['super_admin', 'admin', 'store_keeper', 'seller'],
    },
    {
      title: 'Total Orders',
      value: '789',
      description: '+23% from last month',
      icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
      bgColor: 'bg-purple-50',
      roles: ['super_admin', 'admin', 'seller'],
    },
    {
      title: 'Revenue',
      value: '৳45,231',
      description: '+15% from last month',
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      bgColor: 'bg-orange-50',
      roles: ['super_admin', 'admin'],
    },
  ];

  const hasAccess = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const filteredStats = stats.filter((stat) => hasAccess(stat.roles));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your store today.</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {user?.role?.replace('_', ' ')?.charAt(0).toUpperCase() + user?.role?.replace('_', ' ')?.slice(1)}
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
                  Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-red-100">
                  You're logged in as <span className="font-semibold capitalize">{user?.role?.replace('_', ' ')}</span>
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
                  Quick Actions
                </CardTitle>
                <CardDescription>Frequently used features and shortcuts</CardDescription>
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
                      <a href="/dashboard/users">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Manage Users</div>
                            <div className="text-sm text-gray-600">Add, edit, or remove users</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </a>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'store_keeper', 'seller']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-green-50 hover:border-green-300"
                      asChild
                    >
                      <a href="/dashboard/products">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <Package className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Add Product</div>
                            <div className="text-sm text-gray-600">Add new products to inventory</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </a>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'seller']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-purple-50 hover:border-purple-300"
                      asChild
                    >
                      <a href="/dashboard/orders">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <ShoppingCart className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">View Orders</div>
                            <div className="text-sm text-gray-600">Check and manage customer orders</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </a>
                    </Button>
                  )}
                  {hasAccess(['super_admin', 'admin', 'store_keeper']) && (
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start hover:bg-orange-50 hover:border-orange-300"
                      asChild
                    >
                      <a href="/dashboard/suppliers">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-100 p-2 rounded-lg">
                            <Users2 className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900">Suppliers</div>
                            <div className="text-sm text-gray-600">Manage supplier contacts</div>
                          </div>
                          <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
                        </div>
                      </a>
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
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates in your system</CardDescription>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New order received</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Product added to catalog</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">User registered</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Supplier updated</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
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
