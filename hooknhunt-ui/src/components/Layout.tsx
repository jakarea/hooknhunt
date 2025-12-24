import { useState, useEffect, useMemo } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  LogOut,
  Menu,
  ChevronDown,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Clock,
  Globe,
  ArrowRightFromLine
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { menuConfig, hasAccess as checkAccess } from '@/config/menuConfig';
import type { MenuItem } from '@/config/menuConfig';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Layout = () => {
  const { user, logout } = useAuthStore();
  const { t, i18n } = useTranslation(['navigation', 'login']);
  const location = useLocation();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Filter menu items based on user role
  const filteredMenuItems = useMemo(() => {
    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items.reduce((acc: MenuItem[], item) => {
        if (checkAccess(user?.role, item.roles)) {
          const newItem = { ...item };
          if (newItem.children) {
            newItem.children = filterItems(newItem.children);
            // Only include parent if it has accessible children or if it's a direct link
            if (newItem.children.length > 0 || newItem.href) {
              acc.push(newItem);
            }
          } else {
            acc.push(newItem);
          }
        }
        return acc;
      }, []);
    };
    return filterItems(menuConfig);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const [activeMenuKey, setActiveMenuKey] = useState<string>('Dashboard'); // Default to Dashboard title
  const [panelOpen, setPanelOpen] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({});

  // Update active menu based on path
  useEffect(() => {
    // Helper to find active item recursively
    const findActiveKey = (items: MenuItem[], depth = 0): string | undefined => {
      for (const item of items) {
        // Check children first (Strict matching for children)
        if (item.children) {
          const childMatch = findActiveKey(item.children, depth + 1);
          if (childMatch) return item.title;
        }

        // Check item itself
        if (item.href) {
          let isMatch = false;
          if (depth === 0) {
            // Level 1: Loose matching
            isMatch = item.href === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname.startsWith(item.href);
          } else {
            // Level 2+: Strict matching
            isMatch = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          }

          if (isMatch) return item.title;
        }
      }
      return undefined;
    };

    const key = findActiveKey(filteredMenuItems);
    if (key) {
      // Find the top-level parent of this key
      const findParentKey = (items: MenuItem[]): string | undefined => {
        for (const item of items) {
          if (item.title === key) return item.title;
          if (item.children) {
            // Check if key is in children
            const isChild = (node: MenuItem): boolean => {
              if (node.title === key) return true;
              return node.children ? node.children.some(isChild) : false;
            };
            if (item.children.some(isChild)) return item.title;
          }
        }
        return undefined;
      };

      const parentKey = findParentKey(filteredMenuItems);
      if (parentKey) setActiveMenuKey(parentKey);
    }
  }, [location.pathname, filteredMenuItems]);

  const handleMenuClick = (key: string) => {
    if (activeMenuKey === key) {
      setPanelOpen(!panelOpen);
    } else {
      setActiveMenuKey(key);
      setPanelOpen(true);
    }
  };

  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const activeMenuItem = filteredMenuItems.find(item => item.title === activeMenuKey);

  // Recursive renderer for sidebar items
  const renderSidebarItem = (item: MenuItem, depth = 0) => {
    // Determine active state based on depth
    let isChildActive = false;
    if (item.href) {
      if (depth === 0) {
        // Level 1: Loose matching
        isChildActive = item.href === '/dashboard'
          ? location.pathname === '/dashboard'
          : location.pathname.startsWith(item.href);
      } else {
        // Level 2+: Strict matching
        isChildActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
      }
    }

    // Check if any descendant is active to auto-expand (Strict matching)
    const hasActiveDescendant = item.children && item.children.some(child => {
      // Recursive check helper
      const checkRecursive = (node: MenuItem): boolean => {
        if (node.href && (location.pathname === node.href || location.pathname.startsWith(node.href + '/'))) {
          return true;
        }
        if (node.children) {
          return node.children.some(checkRecursive);
        }
        return false;
      };
      return checkRecursive(child);
    });

    const isExpanded = expandedKeys[item.title] !== undefined ? expandedKeys[item.title] : hasActiveDescendant;
    const isActive = isChildActive || hasActiveDescendant;

    if (item.children && item.children.length > 0) {
      return (
        <div key={item.title} className="mb-2">
          <button
            onClick={(e) => toggleExpand(item.title, e)}
            className={`flex items-center justify-between w-full gap-3 px-2 py-3 rounded-xl transition-all duration-200 group ${isActive
              ? 'bg-red-50/80 text-red-700 font-semibold'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-3'
              }`}
            style={{ paddingLeft: `${depth * 10 + 4}px` }}
          >
            <div className="flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full transition-all duration-300 ${isActive ? 'bg-red-600 scale-110 shadow-sm shadow-red-500/50' : 'bg-gray-300 group-hover:bg-gray-400'
                }`} />
              <span className="text-sm tracking-wide">{item.title}</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-red-500' : ''}`}
            />
          </button>

          {/* Sub-menu (Accordion) */}
          <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="mt-1 space-y-1 border-l-2 border-gray-100 ml-[11px]">
                {item.children.map(child => renderSidebarItem(child, depth + 1))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.title}
        to={item.href || '#'}
        className={`flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-200 group mb-1 ${isChildActive
          ? 'bg-red-50 text-red-700 font-semibold shadow-sm shadow-red-100'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-3'
          }`}
        style={{ paddingLeft: `${depth * 10 + 4}px` }}
      >
        <span className={`h-2 w-2 rounded-full transition-all duration-300 ${isChildActive ? 'bg-red-600 scale-110 shadow-sm shadow-red-500/50' : 'bg-gray-300 group-hover:bg-gray-400'
          }`} />
        <span className="text-sm tracking-wide">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Multi-level Sidebar Container */}
      <div className="flex shrink-0 h-full shadow-2xl shadow-gray-200/50 z-30">

        {/* Level 1: Icon Rail */}
        <aside className="w-[72px] bg-[#0f172a] flex flex-col items-center py-6 z-20 text-white relative overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 pointer-events-none" />

          {/* Logo / Brand */}
          <div className="mb-8 relative z-10">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-900/40 ring-1 ring-white/10">
              HH
            </div>
          </div>

          {/* Icon Navigation */}
          <nav className="flex-1 w-full flex flex-col items-center space-y-3 overflow-y-auto no-scrollbar relative z-10 px-2">
            {filteredMenuItems.map((item) => {
              const isActive = activeMenuKey === item.title;
              return (
                <div key={item.title} className="relative group">
                  <button
                    onClick={() => {
                      handleMenuClick(item.title);
                      setPanelOpen(true);
                      setActiveMenuKey(item.title);
                    }}
                    className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <item.icon className={`transition-all duration-300 ${isActive ? 'h-5 w-5' : 'h-5 w-5 group-hover:scale-110'}`} />

                    {/* Active Indicator Dot (Subtle) */}
                    {isActive && (
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/20 rounded-l-full blur-[1px]" />
                    )}
                  </button>

                  {/* Custom Tooltip */}
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="mt-auto w-full flex flex-col items-center space-y-4 pt-6 border-t border-white/5 relative z-10">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="h-10 w-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 hover:scale-105"
              title={t('logout_button', { ns: 'login' })}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </aside>

        {/* Level 2: Sidebar Panel (Subitems with Accordion for Level 3) */}
        <aside
          className={`${panelOpen ? 'w-[200px] translate-x-0' : 'w-0 -translate-x-10 opacity-0 overflow-hidden'
            } bg-white border-r border-gray-100 flex flex-col transition-all duration-500 ease-out relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]`}
        >
          {/* Only show panel content when panel is open AND clicked (not just hovered) */}
          {panelOpen && activeMenuItem ? (
            <>
              {/* Panel Header */}
              <div className="h-24 flex items-end pb-6 px-4 border-b border-gray-50 shrink-0 bg-gradient-to-b from-white to-gray-50/30">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-red-600 tracking-widest uppercase opacity-80">Menu</span>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight capitalize">
                    {activeMenuItem.title || 'Dashboard'}
                  </h2>
                </div>
              </div>

              {/* Subitems List */}
              <div className="flex-1 overflow-y-auto py-8 px-2">
                <div className="space-y-1">
                  {activeMenuItem.children ? (
                    // Render Children recursively
                    activeMenuItem.children.map(child => renderSidebarItem(child))
                  ) : (
                    // Render Parent as Link if no children
                    renderSidebarItem(activeMenuItem)
                  )}
                </div>
              </div>
              {/* User Profile Snippet in Panel */}
              <div className="p-4 border-t border-gray-50 bg-gray-50/30 backdrop-blur-sm">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center text-red-600 font-bold text-lg shadow-sm ring-2 ring-white group-hover:scale-105 transition-transform duration-300">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate group-hover:text-red-700 transition-colors">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </aside>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50/50">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 z-10 sticky top-0">
          <div className="flex items-center justify-between px-8 py-5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPanelOpen(!panelOpen)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-900">
                    <Globe className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="end">
                  <div className="grid gap-1">
                    <Button
                      variant={i18n.language === 'en' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => i18n.changeLanguage('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={i18n.language === 'bn' ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => i18n.changeLanguage('bn')}
                    >
                      বাংলা (Bengali)
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Notification Bell */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs ring-2 ring-white"
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
                            className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/50' : ''
                              }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 shrink-0">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium text-sm text-gray-900">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-1.5" />
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

             
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-red-600" />
              {t('confirm_logout', { ns: 'login' })}
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
              {t('logout_button', { ns: 'login' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Layout;
