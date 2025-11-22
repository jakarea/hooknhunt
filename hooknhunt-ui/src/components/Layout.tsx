import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown, // Import ChevronDown for expandable menus
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
    icon: <Settings className="h-5 w-5" />,
    roles: ['super_admin', 'admin'],
  },
  {
    name: 'Purchase', // Parent menu item
    icon: <Truck className="h-5 w-5" />, // Using Truck icon for Purchase for now
    roles: ['super_admin', 'admin', 'store_keeper'], // Roles for Purchase section
    children: [
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
];

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({}); // State to manage open/closed nested menus

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Hook & Hunt" className="h-10 w-10" />
            <span className="font-bold text-lg">Hook & Hunt</span>
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
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
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
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
    </div>
  );
};

export default Layout;
