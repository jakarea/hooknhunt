import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, TrendingUp } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-blue-100">
          You're logged in as <span className="font-semibold capitalize">{user?.role.replace('_', ' ')}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
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
              <p className="text-xs text-green-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hasAccess(['super_admin', 'admin']) && (
              <a
                href="/dashboard/users"
                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-600">Add, edit, or remove users</div>
              </a>
            )}
            {hasAccess(['super_admin', 'admin', 'store_keeper', 'seller']) && (
              <a
                href="/dashboard/products"
                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">Add Product</div>
                <div className="text-sm text-gray-600">Add new products to inventory</div>
              </a>
            )}
            {hasAccess(['super_admin', 'admin', 'seller']) && (
              <a
                href="/dashboard/orders"
                className="block p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">View Orders</div>
                <div className="text-sm text-gray-600">Check and manage customer orders</div>
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates in your system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New order received</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Product added to catalog</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-purple-500 mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">User registered</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
