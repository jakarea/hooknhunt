import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
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
    name: 'Categories',
    path: '/dashboard/categories',
    icon: <Tag className="h-5 w-5" />,
    roles: ['super_admin', 'admin', 'marketer'],
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
    name: 'Settings',
    path: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['super_admin'], // Only super_admin can access Global Settings
  },
];

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({}); // State to manage open/closed nested menus
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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
              const isActive = item.path && location.pathname.startsWith(item.path);
              const isOpen = openMenus[item.name] || (item.children && item.children.some(child => child.path && location.pathname.startsWith(child.path)));

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
