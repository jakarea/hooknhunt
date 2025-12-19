import {
    LayoutDashboard,
    ShoppingCart,
    Truck,
    Users,
    Settings,
    BarChart3,
    CreditCard,
    MessageSquare,
    Box,
    History,
    PlusCircle,
    List,
    DollarSign,
    Package,
    Layers,
    Tags,
    RefreshCw,
    ArrowLeftRight,
    CheckSquare,
    Printer,
    Image as ImageIcon,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
    title: string;
    icon: LucideIcon;
    href?: string;
    roles?: string[]; // If undefined/empty, accessible to all
    children?: MenuItem[];
}

export const menuConfig: MenuItem[] = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
        roles: [], // All
        children: [
            {
                title: 'Overview',
                icon: BarChart3,
                href: '/dashboard',
                roles: [],
            },
        ],
    },
    {
        title: 'Inventory Management',
        icon: Package,
        roles: ['super_admin', 'admin', 'store_keeper'],
        children: [
            {
                title: 'Products',
                icon: Package,
                href: '/products',
                roles: ['super_admin', 'admin', 'store_keeper', 'marketer'],
            },
            {
                title: 'Categories',
                icon: Layers,
                href: '/products/categories',
                roles: ['super_admin', 'admin', 'marketer'],
            },
            {
                title: 'Attributes',
                icon: Tags,
                href: '/products/attributes',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Stock Management',
                icon: Box,
                roles: ['super_admin', 'admin', 'store_keeper'],
                children: [
                    {
                        title: 'Manual Stock Entry',
                        icon: PlusCircle,
                        href: '/inventory/manual-entry',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Current Stock',
                        icon: Box,
                        href: '/products/stock',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Stock Adjustment',
                        icon: RefreshCw,
                        href: '/products/adjustment',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Stock Transfer',
                        icon: ArrowLeftRight,
                        href: '/products/transfer',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Stock Count / Audit',
                        icon: CheckSquare,
                        href: '/products/audit',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Print Labels',
                        icon: Printer,
                        href: '/products/labels',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                ],
            },
        ],
    },
    {
        title: 'Media Library',
        icon: ImageIcon,
        href: '/media',
        roles: ['super_admin', 'admin', 'store_keeper', 'marketer'],
    },
    {
        title: 'Sourcing & Purchase',
        icon: Truck,
        roles: ['super_admin', 'admin', 'store_keeper'],
        children: [
            {
                title: 'Procurement',
                icon: ShoppingCart,
                roles: ['super_admin', 'admin', 'store_keeper'],
                children: [
                    {
                        title: 'Create PO',
                        icon: PlusCircle,
                        href: '/purchase/create-order',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Purchase History',
                        icon: History,
                        href: '/purchase/list',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Receive Stock',
                        icon: Box,
                        href: '/purchase/receive',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                ],
            },
            {
                title: 'Supplier Hub',
                icon: Users,
                roles: ['super_admin', 'admin', 'store_keeper'],
                children: [
                    {
                        title: 'Supplier List',
                        icon: List,
                        href: '/purchase/suppliers',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                    {
                        title: 'Create Supplier',
                        icon: PlusCircle,
                        href: '/purchase/suppliers/create',
                        roles: ['super_admin', 'admin', 'store_keeper'],
                    },
                ],
            },
        ],
    },
    {
        title: 'Settings',
        icon: Settings,
        roles: ['super_admin'],
        children: [
            {
                title: 'Global Config',
                icon: Settings,
                href: '/settings/global',
                roles: ['super_admin'],
            },
            {
                title: 'Pricing Rules',
                icon: DollarSign,
                href: '/settings/pricing',
                roles: ['super_admin'],
            },
            {
                title: 'SMS Settings',
                icon: MessageSquare,
                href: '/settings/sms',
                roles: ['super_admin', 'admin', 'store_keeper', 'marketer'],
            },
            {
                title: 'Payment Settings',
                icon: CreditCard,
                href: '/settings/payment',
                roles: ['super_admin'],
            },
            {
                title: 'Tracking Settings',
                icon: BarChart3,
                href: '/settings/tracking',
                roles: ['super_admin'],
            },
        ],
    },
];

// Helper to check if a user has access to a menu item
export const hasAccess = (userRole: string | undefined, itemRoles?: string[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    if (!userRole) return false;
    return itemRoles.includes(userRole);
};