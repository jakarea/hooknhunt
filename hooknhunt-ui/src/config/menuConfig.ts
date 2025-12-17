import {
    LayoutDashboard,
    Monitor,
    ShoppingCart,
    Package,
    Truck,
    Users,
    Settings,
    FileText,
    BarChart3,
    CreditCard,
    Megaphone,
    Gift,
    MessageSquare,
    MapPin,
    Box,
    ClipboardList,
    History,
    AlertCircle,
    PlusCircle,
    List,
    Tags,
    Layers,
    RefreshCw,
    ArrowLeftRight,
    CheckSquare,
    Printer,
    UserCheck,
    Globe,
    ShoppingBag,
    Undo2,
    Repeat,
    Send,
    Smartphone,
    Award,
    UserX,
    CalendarDays,
    DollarSign,
    PieChart,
    Sliders,
    Link,
    ShieldAlert,
    Zap
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
            // {
            //     title: 'Live Alerts',
            //     icon: AlertCircle,
            //     href: '/dashboard/alerts',
            //     roles: [],
            // },
        ],
    },
    // {
    //     title: 'POS',
    //     icon: Monitor,
    //     roles: ['super_admin', 'admin', 'seller'],
    //     children: [
    //         {
    //             title: 'POS Terminal',
    //             icon: Monitor,
    //             href: '/pos',
    //             roles: ['super_admin', 'admin', 'seller'],
    //         },
    //         {
    //             title: 'Register History',
    //             icon: History,
    //             href: '/pos/history',
    //             roles: ['super_admin', 'admin', 'seller'],
    //         },
    //         {
    //             title: 'Hold Orders',
    //             icon: ClipboardList,
    //             href: '/pos/hold',
    //             roles: ['super_admin', 'admin', 'seller'],
    //         },
    //     ],
    // },
    {
        title: 'Inventory & Products',
        icon: Package,
        roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
        children: [
            {
                title: 'Catalog Management',
                icon: List,
                roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
                children: [
                    {
                        title: 'Add Product',
                        icon: PlusCircle,
                        href: '/products/create',
                        roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
                    },
                    {
                        title: 'All Products',
                        icon: Box,
                        href: '/products',
                        roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
                    },
                    {
                        title: 'Variants & Attributes',
                        icon: Tags,
                        href: '/products/attributes',
                        roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
                    },
                    {
                        title: 'Categories & Brands',
                        icon: Layers,
                        href: '/products/categories',
                        roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
                    },
                ],
            },
            // {
            //     title: 'Stock Control',
            //     icon: RefreshCw,
            //     roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            //     children: [
            //         {
            //             title: 'Current Stock',
            //             icon: Box,
            //             href: '/inventory/stock',
            //             roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            //         },
            //         {
            //             title: 'Stock Adjustment',
            //             icon: Sliders,
            //             href: '/inventory/adjustment',
            //             roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            //         },
            //         {
            //             title: 'Stock Transfer',
            //             icon: ArrowLeftRight,
            //             href: '/inventory/transfer',
            //             roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            //         },
            //         {
            //             title: 'Stock Count / Audit',
            //             icon: CheckSquare,
            //             href: '/inventory/audit',
            //             roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            //         },
            //     ],
            // },
            // {
            //     title: 'Print Labels',
            //     icon: Printer,
            //     href: '/inventory/labels',
            //     roles: ['super_admin', 'admin', 'store_keeper', 'senior_staff'],
            // },
        ],
    },
    {
        title: 'Sourcing & Purchase',
        icon: Truck,
        roles: ['super_admin', 'admin', 'senior_staff'],
        children: [
            {
                title: 'Procurement',
                icon: ShoppingCart,
                roles: ['super_admin', 'admin', 'senior_staff'],
                children: [
                    {
                        title: 'Create PO',
                        icon: PlusCircle,
                        href: '/purchase/create-order',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                    {
                        title: 'Purchase History',
                        icon: History,
                        href: '/purchase/list',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                    {
                        title: 'Receive Stock',
                        icon: Box,
                        href: '/purchase/receive',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                ],
            },
            {
                title: 'Supplier Hub',
                icon: Users,
                roles: ['super_admin', 'admin', 'senior_staff'],
                children: [
                    {
                        title: 'Supplier List',
                        icon: List,
                        href: '/purchase/suppliers',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                    {
                        title: 'Supplier Transactions',
                        icon: DollarSign,
                        href: '/purchase/suppliers/transactions',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                    {
                        title: 'Product-Supplier Map',
                        icon: Link,
                        href: '/purchase/suppliers/map',
                        roles: ['super_admin', 'admin', 'senior_staff'],
                    },
                ],
            },
        ],
    },
    {
        title: 'Sales & Fulfillment',
        icon: ShoppingBag,
        roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
        children: [
            // {
            //     title: 'Order Management',
            //     icon: ClipboardList,
            //     roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //     children: [
            //         {
            //             title: 'All Orders',
            //             icon: List,
            //             href: '/sales/orders',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Verify Orders',
            //             icon: CheckSquare,
            //             href: '/sales/orders/verify',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Packaging List',
            //             icon: Box,
            //             href: '/sales/orders/packaging',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Ready to Ship',
            //             icon: Truck,
            //             href: '/sales/orders/ready',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //     ],
            // },
            // {
            //     title: 'Channels',
            //     icon: Globe,
            //     roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //     children: [
            //         {
            //             title: 'Website Orders',
            //             icon: Globe,
            //             href: '/sales/orders/website',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Wholesale Orders',
            //             icon: Users,
            //             href: '/sales/orders/wholesale',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Daraz Orders',
            //             icon: ShoppingBag,
            //             href: '/sales/orders/daraz',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //     ],
            // },
            // {
            //     title: 'After Sales',
            //     icon: Undo2,
            //     roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //     children: [
            //         {
            //             title: 'Returns & Refunds',
            //             icon: Undo2,
            //             href: '/sales/returns',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //         {
            //             title: 'Exchange Requests',
            //             icon: Repeat,
            //             href: '/sales/exchanges',
            //             roles: ['super_admin', 'admin', 'seller', 'store_keeper'],
            //         },
            //     ],
            // },
        ],
    },
    // {
    //     title: 'Delivery & Courier',
    //     icon: Truck,
    //     roles: ['super_admin', 'admin', 'store_keeper'],
    //     children: [
    //         {
    //             title: 'Shipment Handling',
    //             icon: Box,
    //             roles: ['super_admin', 'admin', 'store_keeper'],
    //             children: [
    //                 {
    //                     title: 'Create Consignment',
    //                     icon: PlusCircle,
    //                     href: '/delivery/create',
    //                     roles: ['super_admin', 'admin', 'store_keeper'],
    //                 },
    //                 {
    //                     title: 'Bulk Label Print',
    //                     icon: Printer,
    //                     href: '/delivery/labels',
    //                     roles: ['super_admin', 'admin', 'store_keeper'],
    //                 },
    //             ],
    //         },
    //         {
    //             title: 'Tracking',
    //             icon: MapPin,
    //             roles: ['super_admin', 'admin', 'store_keeper'],
    //             children: [
    //                 {
    //                     title: 'Live Tracking',
    //                     icon: MapPin,
    //                     href: '/delivery/tracking',
    //                     roles: ['super_admin', 'admin', 'store_keeper'],
    //                 },
    //                 {
    //                     title: 'Courier Payment Report',
    //                     icon: FileText,
    //                     href: '/delivery/payments',
    //                     roles: ['super_admin', 'admin', 'store_keeper'],
    //                 },
    //             ],
    //         },
    //     ],
    // },
    {
        title: 'Marketing & Loyalty',
        icon: Megaphone,
        roles: ['super_admin', 'admin', 'marketer'],
        children: [
            // {
            //     title: 'Promotions',
            //     icon: Gift,
            //     roles: ['super_admin', 'admin', 'marketer'],
            //     children: [
            //         {
            //             title: 'Coupons & Vouchers',
            //             icon: Tags,
            //             href: '/marketing/coupons',
            //             roles: ['super_admin', 'admin', 'marketer'],
            //         },
            //         {
            //             title: 'Flash Sales',
            //             icon: Zap,
            //             href: '/marketing/flash-sales',
            //             roles: ['super_admin', 'admin', 'marketer'],
            //         },
            //     ],
            // },
            {
                title: 'Communication',
                icon: MessageSquare,
                roles: ['super_admin', 'admin', 'marketer'],
                children: [
                    {
                        title: 'SMS Panel',
                        icon: Send,
                        href: '/marketing/sms',
                        roles: ['super_admin', 'admin', 'marketer'],
                    },
                    {
                        title: 'SMS Logs',
                        icon: List,
                        href: '/marketing/sms/logs',
                        roles: ['super_admin', 'admin', 'marketer'],
                    },
                ],
            },
            {
                title: 'Loyalty Program',
                icon: Award,
                roles: ['super_admin', 'admin', 'marketer'],
                children: [
                    {
                        title: 'Reward Rules',
                        icon: Sliders,
                        href: '/marketing/loyalty/rules',
                        roles: ['super_admin', 'admin', 'marketer'],
                    },
                    {
                        title: 'Points History',
                        icon: History,
                        href: '/marketing/loyalty/history',
                        roles: ['super_admin', 'admin', 'marketer'],
                    },
                ],
            },
        ],
    },
    {
        title: 'CRM',
        icon: UserCheck,
        roles: ['super_admin', 'admin'],
        children: [
            {
                title: 'Retail Customers',
                icon: Users,
                href: '/crm/retail-customers',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Wholesale Clients',
                icon: Users,
                href: '/crm/wholesale-clients',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Blacklisted',
                icon: UserX,
                href: '/crm/blacklisted',
                roles: ['super_admin', 'admin'],
            },
        ],
    },
    {
        title: 'HRM',
        icon: Users,
        roles: ['super_admin', 'admin'],
        children: [
            {
                title: 'Staff List',
                icon: List,
                href: '/hrm/staff',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Attendance',
                icon: CalendarDays,
                href: '/hrm/attendance',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Payroll',
                icon: DollarSign,
                href: '/hrm/payroll',
                roles: ['super_admin', 'admin'],
            },
        ],
    },
    {
        title: 'Accounts & Finance',
        icon: DollarSign,
        roles: ['super_admin', 'admin'],
        children: [
            {
                title: 'Income & Expense',
                icon: PieChart,
                roles: ['super_admin', 'admin'],
                children: [
                    {
                        title: 'Record Expense',
                        icon: PlusCircle,
                        href: '/finance/expense',
                        roles: ['super_admin', 'admin'],
                    },
                    {
                        title: 'Daily Sales Report',
                        icon: FileText,
                        href: '/finance/daily-sales',
                        roles: ['super_admin', 'admin'],
                    },
                ],
            },
            {
                title: 'Accounting',
                icon: BarChart3,
                roles: ['super_admin', 'admin'],
                children: [
                    {
                        title: 'Chart of Accounts',
                        icon: List,
                        href: '/finance/coa',
                        roles: ['super_admin', 'admin'],
                    },
                    {
                        title: 'Asset Management',
                        icon: Box,
                        href: '/finance/assets',
                        roles: ['super_admin', 'admin'],
                    },
                    {
                        title: 'Balance Sheet',
                        icon: FileText,
                        href: '/finance/balance-sheet',
                        roles: ['super_admin', 'admin'],
                    },
                ],
            },
        ],
    },
    {
        title: 'Reports & Analytics',
        icon: BarChart3,
        roles: ['super_admin', 'admin'],
        children: [
            {
                title: 'Inventory Reports',
                icon: Box,
                href: '/reports/inventory',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Sales Reports',
                icon: ShoppingBag,
                href: '/reports/sales',
                roles: ['super_admin', 'admin'],
            },
            {
                title: 'Financial Reports',
                icon: DollarSign,
                href: '/reports/finance',
                roles: ['super_admin', 'admin'],
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
                roles: ['super_admin'],
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
            // {
            //     title: 'Integrations',
            //     icon: Link,
            //     href: '/settings/integrations',
            //     roles: ['super_admin'],
            // },
            // {
            //     title: 'Access Control',
            //     icon: ShieldAlert,
            //     href: '/settings/rbac',
            //     roles: ['super_admin'],
            // },
        ],
    },
];

// Helper to check if a user has access to a menu item
export const hasAccess = (userRole: string | undefined, itemRoles?: string[]) => {
    if (!itemRoles || itemRoles.length === 0) return true;
    if (!userRole) return false;
    return itemRoles.includes(userRole);
};
