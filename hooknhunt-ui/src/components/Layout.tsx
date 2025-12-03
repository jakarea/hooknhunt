import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  Settings,
  Settings2,
  LogOut,
  Menu,
  ChevronDown,
  ArrowRightFromLine,
  Plus,
  List,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  MessageSquare,
} from 'lucide-react';

interface MenuItem {
  name: string;
  path?: string; // Path is optional for parent items
  icon: React.ReactNode;
  roles: string[];
  children?: MenuItem[]; // For nested menu items
}

const menuItems: MenuItem[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['super_admin', 'admin', 'seller', 'store_keeper', 'marketer'],
  },
  {
    name: 'Users',
    path: '/dashboard/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['super_admin', 'admin'],
  },

  {
    name: 'Attributes',
    path: '/dashboard/attributes',
    icon: <Settings2 className="h-5 w-5" />,
    roles: ['super_admin', 'admin'],
  },
  {
    name: 'Purchase', // Parent menu item
    icon: <Truck className="h-5 w-5" />, // Using Truck icon for Purchase for now
    roles: ['super_admin', 'admin', 'store_keeper'], // Roles for Purchase section
    children: [
      {
        name: 'New',
        path: '/dashboard/purchase/new',
        icon: <Plus className="h-5 w-5" />, // Icon for New
        roles: ['super_admin', 'admin', 'store_keeper'],
      },
      {
        name: 'List',
        path: '/dashboard/purchase/list',
        icon: <List className="h-5 w-5" />, // Icon for List
        roles: ['super_admin', 'admin', 'store_keeper'],
      },
      {
        name: 'Suppliers',
        path: '/dashboard/suppliers',
        icon: <Truck className="h-5 w-5" />, // Icon for Suppliers
        roles: ['super_admin', 'admin', 'store_keeper'],
      },
      {
        name: 'Categories',
        path: '/dashboard/categories',
        icon: <Tag className="h-5 w-5" />,
        roles: ['super_admin', 'admin', 'marketer'],
      },
    ],
  },
  {
    name: 'Products',
    path: '/dashboard/products',
    icon: <Package className="h-5 w-5" />,
    roles: ['super_admin', 'admin', 'store_keeper', 'seller'],
  },
  {
    name: 'Orders',
    path: '/dashboard/orders',
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ['super_admin', 'admin', 'seller'],
  },
  {
    name: 'SMS',
    path: '/dashboard/sms',
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ['super_admin', 'admin', 'store_keeper', 'marketer'],
  },
  {
    name: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['super_admin'], // Only super_admin can access Global Settings
  },
];

// Notification interface
interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Static notification list
const staticNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Order Completed',
    message: 'Purchase order #PO-202511-10 has been completed successfully',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'info',
    title: 'New Product Added',
    message: 'Product "Fishing Rod Pro X1" has been added to inventory',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Product "Fishing Hook Set" is running low on stock (5 units left)',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'Payment Confirmed',
    message: 'Purchase order #PO-202511-09 payment has been confirmed',
    time: '5 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'error',
    title: 'Shipment Delayed',
    message: 'Purchase order #PO-202511-08 shipment has been delayed',
    time: '1 day ago',
    read: true,
  },
];

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({}); // State to manage open/closed nested menus
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(staticNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close menus when navigating away from their children
  useEffect(() => {
    const newOpenMenus: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => child.path && location.pathname.startsWith(child.path));
        if (hasActiveChild) {
          newOpenMenus[item.name] = true;
        }
      }
    });
    setOpenMenus(newOpenMenus);
  }, [location.pathname]);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const hasAccess = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.children) {
      // If parent has children, check if any child is accessible
      return item.children.some((child) => hasAccess(child.roles));
    }
    return hasAccess(item.roles);
  });

  const toggleMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gradient-to-b from-red-700 to-red-900 text-white transition-all duration-300 overflow-hidden flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="p-6 flex flex-col items-center justify-center border-b border-red-800 bg-black/20">
          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg mb-3">
            <span className="text-2xl font-bold text-red-700">H&H</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">Hook & Hunt</h1>
            <p className="text-xs text-red-200">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {filteredMenuItems.map((item) => {
              // Use exact match for Dashboard, startsWith for others
              const isActive = item.path && (item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path));
              // Check if any child is currently active
              const hasActiveChild = item.children && item.children.some(child => child.path && location.pathname.startsWith(child.path));
              // Menu is open if manually toggled OR has an active child
              const isOpen = openMenus[item.name] !== undefined ? openMenus[item.name] : hasActiveChild;

              return (
                <li key={item.name}>
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors ${
                          isOpen
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'text-red-100 hover:bg-red-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isOpen && (
                        <ul className="ml-6 mt-1 space-y-1">
                          {item.children.filter(child => hasAccess(child.roles)).map((child) => {
                            const isChildActive = child.path && location.pathname.startsWith(child.path);
                            return (
                              <li key={child.path}>
                                <Link
                                  to={child.path || '#'} // Fallback for path if somehow missing
                                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    isChildActive
                                      ? 'bg-red-600 text-white shadow-lg'
                                      : 'text-red-100 hover:bg-red-800 hover:text-white'
                                  }`}
                                >
                                  {child.icon}
                                  <span className="font-medium">{child.name}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path || '#'} // Fallback for path if somehow missing
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white shadow-lg'
                          : 'text-red-100 hover:bg-red-800 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-red-800 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-red-400/50">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-red-200 capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            className="w-full bg-red-600/20 border-red-500/50 text-red-100 hover:bg-red-600/30 hover:border-red-400 hover:text-white transition-all duration-200 group"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <ArrowRightFromLine className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5 text-gray-600" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Mark all read
                      </Button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <Bell className="h-12 w-12 mb-3 opacity-30" />
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm text-gray-900">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  {notification.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <>
                      <Separator />
                      <div className="p-2">
                        <Button
                          variant="ghost"
                          className="w-full text-sm text-gray-600 hover:text-gray-900"
                        >
                          View all notifications
                        </Button>
                      </div>
                    </>
                  )}
                </PopoverContent>
              </Popover>

              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-semibold text-gray-900">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              <ArrowRightFromLine className="h-4 w-4 mr-2" />
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
