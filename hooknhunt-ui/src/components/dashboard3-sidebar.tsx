"use client"

import * as React from "react"
import {
  Home,
  ShoppingCart,
  Users,
  BarChart3,
  Package,
  Settings,
  ChevronRight,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@hooknhunt.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard3",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard3",
        },
        {
          title: "Analytics",
          url: "/dashboard3/analytics",
        },
        {
          title: "Reports",
          url: "/dashboard3/reports",
        },
      ],
    },
    {
      title: "Orders",
      url: "/dashboard3/orders",
      icon: ShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/dashboard3/orders",
        },
        {
          title: "Pending",
          url: "/dashboard3/orders/pending",
        },
        {
          title: "Completed",
          url: "/dashboard3/orders/completed",
        },
        {
          title: "Cancelled",
          url: "/dashboard3/orders/cancelled",
        },
      ],
    },
    {
      title: "Customers",
      url: "/dashboard3/customers",
      icon: Users,
      items: [
        {
          title: "All Customers",
          url: "/dashboard3/customers",
        },
        {
          title: "Add Customer",
          url: "/dashboard3/customers/new",
        },
        {
          title: "Segments",
          url: "/dashboard3/customers/segments",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard3/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/dashboard3/products",
        },
        {
          title: "Inventory",
          url: "/dashboard3/products/inventory",
        },
        {
          title: "Categories",
          url: "/dashboard3/products/categories",
        },
        {
          title: "Add Product",
          url: "/dashboard3/products/new",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard3/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/dashboard3/analytics",
        },
        {
          title: "Sales",
          url: "/dashboard3/analytics/sales",
        },
        {
          title: "Traffic",
          url: "/dashboard3/analytics/traffic",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard3/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard3/settings",
        },
        {
          title: "Account",
          url: "/dashboard3/settings/account",
        },
        {
          title: "Billing",
          url: "/dashboard3/settings/billing",
        },
      ],
    },
  ],
}

export function Dashboard3Sidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
            <span className="text-base font-bold text-white">H</span>
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">Hook & Hunt</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 py-4">
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={false}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className="px-3 py-3 h-auto">
                      {item.icon && <item.icon className="mr-3" />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-6 mt-1 mb-1 gap-1">
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild className="px-3 py-2 h-auto">
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
     
    </Sidebar>
  )
}
