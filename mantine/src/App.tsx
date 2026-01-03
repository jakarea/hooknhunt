import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@/lib/mantine-theme';
import ProtectedRoute from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/admin-layout'
import AdminDashboard from "@/app/admin/dashboard/page"
import Analytics from "@/app/admin/dashboard/analytics/page"
import Profile from "@/app/admin/profile/page"
import NotificationsPage from "@/app/admin/notifications/page"
import Products from "@/app/admin/catalog/products/page"
import CreateProduct from "@/app/admin/catalog/products/create/page"
import Variants from "@/app/admin/catalog/variants/page"
import Categories from "@/app/admin/catalog/categories/page"
import Brands from "@/app/admin/catalog/brands/page"
import Attributes from "@/app/admin/catalog/attributes/page"
import Units from "@/app/admin/catalog/units/page"
import PrintLabels from "@/app/admin/catalog/print-labels/page"
import PurchaseOrders from "@/app/admin/procurement/orders/page"
import CreatePO from "@/app/admin/procurement/create/page"
import Suppliers from "@/app/admin/procurement/suppliers/page"
import PurchaseReturns from "@/app/admin/procurement/returns/page"
import Shipments from "@/app/admin/shipments/page"
import CreateShipment from "@/app/admin/shipments/create/page"
import ViewShipment from "@/app/admin/shipments/view/page"
import ShipmentCosting from "@/app/admin/shipments/costing/page"
import ReceiveStock from "@/app/admin/shipments/receive/page"
import CurrentStock from "@/app/admin/inventory/stock/page"
import UnsortedStock from "@/app/admin/inventory/sorting/page"
import StockHistory from "@/app/admin/inventory/history/page"
import Warehouses from "@/app/admin/inventory/warehouses/page"
import Transfers from "@/app/admin/inventory/transfers/page"
import Adjustments from "@/app/admin/inventory/adjustments/page"
import StockTake from "@/app/admin/inventory/stock-take/page"
import SalesOrders from "@/app/admin/sales/orders/page"
import OrderDetails from "@/app/admin/sales/orders/[id]/page"
import CreateSalesOrder from "@/app/admin/sales/create/page"
import SalesReturns from "@/app/admin/sales/returns/page"
import Quotations from "@/app/admin/sales/quotations/page"
import POSTerminal from "@/app/admin/pos/page"
import POSHistory from "@/app/admin/pos/history/page"
import POSRegister from "@/app/admin/pos/register/page"
import HeldOrders from "@/app/admin/pos/held/page"
import CourierBooking from "@/app/admin/logistics/booking/page"
import TrackingHub from "@/app/admin/logistics/tracking/page"
import Couriers from "@/app/admin/logistics/couriers/page"
import Zones from "@/app/admin/logistics/zones/page"
import Customers from "@/app/admin/crm/customers/page"
import CustomerDetails from "@/app/admin/crm/customers/[id]/page"
import EditCustomer from "@/app/admin/crm/customers/[id]/edit/page"
import Leads from "@/app/admin/crm/leads/page"
import Wallet from "@/app/admin/crm/wallet/page"
import Campaigns from "@/app/admin/marketing/campaigns/page"
import Affiliates from "@/app/admin/marketing/affiliates/page"
import LoyaltyRules from "@/app/admin/crm/loyalty/page"
import Employees from "@/app/admin/hrm/employees/page"
import EmployeeProfile from "@/app/admin/hrm/employees/[id]/page"
import EditEmployee from "@/app/admin/hrm/employees/[id]/edit/page"
import CreateEmployeePage from "@/app/admin/hrm/employees/create/page"
import Departments from "@/app/admin/hrm/departments/page"
import Leaves from "@/app/admin/hrm/leaves/page"
import Attendance from "@/app/admin/hrm/attendance/page"
import Payroll from "@/app/admin/hrm/payroll/page"
import Transactions from "@/app/admin/finance/transactions/page"
import Expenses from "@/app/admin/finance/expenses/page"
import Accounts from "@/app/admin/finance/accounts/page"
import ProfitLoss from "@/app/admin/finance/reports/pl/page"
import Tickets from "@/app/admin/support/tickets/page"
import SupportCategories from "@/app/admin/support/categories/page"
import Banners from "@/app/admin/cms/banners/page"
import Menus from "@/app/admin/cms/menus/page"
import CMSPages from "@/app/admin/cms/pages/page"
import Blog from "@/app/admin/cms/blog/page"
import Media from "@/app/admin/cms/media/page"
import SalesReport from "@/app/admin/reports/sales/page"
import StockReport from "@/app/admin/reports/stock/page"
import ProductReport from "@/app/admin/reports/products/page"
import CustomerReport from "@/app/admin/reports/customers/page"
import TaxReport from "@/app/admin/reports/tax/page"
import Roles from "@/app/admin/roles/page"
import CreateRole from "@/app/admin/roles/create/page"
import EditRole from "@/app/admin/roles/edit/[id]/page"
import Permissions from "@/app/admin/permissions/page"
import AuditLogs from "@/app/admin/audit-logs/page"
import GeneralSettings from "@/app/admin/settings/general/page"
import PaymentSettings from "@/app/admin/settings/payments/page"
import SettingsRoles from "@/app/admin/hrm/roles/page"
import SettingsUsers from "@/app/admin/settings/users/page"
import SettingsPermissions from "@/app/admin/settings/permissions/page"
import APISettings from "@/app/admin/settings/api/page"
import Backup from "@/app/admin/settings/backup/page"
import TaxSettings from "@/app/admin/settings/taxes/page"

import Login from "@/app/login/page"
import ForgotPassword from "@/app/forgot-password/page"
import SignUp from "@/app/register/page"
import VerifyOtpPage from "@/app/verify-otp/page"

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ModalsProvider>
        <Notifications />
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            {/* Admin routes with layout */}
            <Route path="/admin/*" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="dashboard/analytics" element={<Analytics />} />
              <Route path="profile" element={<Profile />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="catalog/products" element={<Products />} />
              <Route path="catalog/products/create" element={<CreateProduct />} />
              <Route path="catalog/variants" element={<Variants />} />
              <Route path="catalog/categories" element={<Categories />} />
              <Route path="catalog/brands" element={<Brands />} />
              <Route path="catalog/attributes" element={<Attributes />} />
              <Route path="catalog/units" element={<Units />} />
              <Route path="catalog/print-labels" element={<PrintLabels />} />
              <Route path="procurement/orders" element={<PurchaseOrders />} />
              <Route path="procurement/create" element={<CreatePO />} />
              <Route path="procurement/suppliers" element={<Suppliers />} />
              <Route path="procurement/returns" element={<PurchaseReturns />} />
              <Route path="shipments" element={<Shipments />} />
              <Route path="shipments/create" element={<CreateShipment />} />
              <Route path="shipments/view" element={<ViewShipment />} />
              <Route path="shipments/costing" element={<ShipmentCosting />} />
              <Route path="shipments/receive" element={<ReceiveStock />} />
              <Route path="inventory/stock" element={<CurrentStock />} />
              <Route path="inventory/sorting" element={<UnsortedStock />} />
              <Route path="inventory/history" element={<StockHistory />} />
              <Route path="inventory/warehouses" element={<Warehouses />} />
              <Route path="inventory/transfers" element={<Transfers />} />
              <Route path="inventory/adjustments" element={<Adjustments />} />
              <Route path="inventory/stock-take" element={<StockTake />} />
              <Route path="sales/orders" element={<SalesOrders />} />
              <Route path="sales/orders/:id" element={<OrderDetails />} />
              <Route path="sales/create" element={<CreateSalesOrder />} />
              <Route path="sales/returns" element={<SalesReturns />} />
              <Route path="sales/quotations" element={<Quotations />} />
              <Route path="pos" element={<POSTerminal />} />
              <Route path="pos/history" element={<POSHistory />} />
              <Route path="pos/register" element={<POSRegister />} />
              <Route path="pos/held" element={<HeldOrders />} />
              <Route path="logistics/booking" element={<CourierBooking />} />
              <Route path="logistics/tracking" element={<TrackingHub />} />
              <Route path="logistics/couriers" element={<Couriers />} />
              <Route path="logistics/zones" element={<Zones />} />
              <Route path="crm/customers" element={<Customers />} />
              <Route path="crm/customers/:id" element={<CustomerDetails />} />
              <Route path="crm/customers/:id/edit" element={<EditCustomer />} />
              <Route path="crm/leads" element={<Leads />} />
              <Route path="crm/wallet" element={<Wallet />} />
              <Route path="marketing/campaigns" element={<Campaigns />} />
              <Route path="marketing/affiliates" element={<Affiliates />} />
              <Route path="crm/loyalty" element={<LoyaltyRules />} />
              <Route path="hrm/employees" element={<Employees />} />
              <Route path="hrm/employees/create" element={<CreateEmployeePage />} />
              <Route path="hrm/employees/:id" element={<EmployeeProfile />} />
              <Route path="hrm/employees/:id/edit" element={<EditEmployee />} />
              <Route path="hrm/departments" element={<Departments />} />
              <Route path="hrm/leaves" element={<Leaves />} />
              <Route path="hrm/attendance" element={<Attendance />} />
              <Route path="hrm/payroll" element={<Payroll />} />
              <Route path="hrm/roles" element={<SettingsRoles />} />
              <Route path="finance/transactions" element={<Transactions />} />
              <Route path="finance/expenses" element={<Expenses />} />
              <Route path="finance/accounts" element={<Accounts />} />
              <Route path="finance/reports/pl" element={<ProfitLoss />} />
              <Route path="support/tickets" element={<Tickets />} />
              <Route path="support/categories" element={<SupportCategories />} />
              <Route path="cms/banners" element={<Banners />} />
              <Route path="cms/menus" element={<Menus />} />
              <Route path="cms/pages" element={<CMSPages />} />
              <Route path="cms/blog" element={<Blog />} />
              <Route path="cms/media" element={<Media />} />
              <Route path="reports/sales" element={<SalesReport />} />
              <Route path="reports/stock" element={<StockReport />} />
              <Route path="reports/products" element={<ProductReport />} />
              <Route path="reports/customers" element={<CustomerReport />} />
              <Route path="reports/tax" element={<TaxReport />} />
              <Route path="roles" element={<Roles />} />
              <Route path="roles/create" element={<CreateRole />} />
              <Route path="roles/:id/edit" element={<EditRole />} />
              <Route path="permissions" element={<Permissions />} />
              <Route path="audit-logs" element={<AuditLogs />} />
              <Route path="settings/general" element={<GeneralSettings />} />
              <Route path="settings/payments" element={<PaymentSettings />} />
              <Route path="settings/users" element={<SettingsUsers />} />
              <Route path="settings/permissions" element={<SettingsPermissions />} />
              <Route path="settings/api" element={<APISettings />} />
              <Route path="settings/backup" element={<Backup />} />
              <Route path="settings/taxes" element={<TaxSettings />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default App
