import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Attributes from './pages/Attributes';
import Products from './pages/products/Products';
import ProductDetail from './pages/products/ProductDetail';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import Suppliers from './pages/purchase/Suppliers';
import { SupplierProfile } from './pages/purchase/SupplierProfile';
import { SupplierProducts } from './pages/purchase/SupplierProducts';
import { SupplierPurchaseHistory } from './pages/purchase/SupplierPurchaseHistory';
import SuppliersCreate from './pages/purchase/SuppliersCreate';
import SuppliersEdit from './pages/purchase/SuppliersEdit';
import { PurchaseNew } from './pages/purchase/PurchaseNew';
import { PurchaseList } from './pages/purchase/PurchaseList';
import { CreatePurchaseOrder } from './pages/purchase/CreatePurchaseOrder';
import { PurchaseOrderDetails } from './pages/purchase/PurchaseOrderDetails';
import { PurchaseOrderEdit } from './pages/purchase/PurchaseOrderEdit';
import { PurchaseOrderDemo } from './pages/purchase/PurchaseOrderDemo';
import { PurchaseReceiveList } from './pages/purchase/PurchaseReceiveList';
import { ReceiveStockNew } from './pages/inventory/ReceiveStockNew';
import ManualStockEntry from './pages/inventory/ManualStockEntry';
import { StockManagement } from './pages/products/StockManagement';
import { EditProductStock } from './pages/products/EditProductStock';
import CategoriesCreate from './pages/products/CategoriesCreate';
import CategoriesEdit from './pages/products/CategoriesEdit';
import Users from './pages/users/Users';
import UsersCreate from './pages/users/UsersCreate';
import UsersEdit from './pages/users/UsersEdit';
import { GeneralSettings } from './pages/settings/tabs/GeneralSettings';
import { PricingSettings } from './pages/settings/tabs/PricingSettings';
import { PaymentSettings } from './pages/settings/tabs/PaymentSettings';
import { TrackingSettings } from './pages/settings/tabs/TrackingSettings';
import { Settings } from './pages/settings/Settings';
import { SmsSettings } from './pages/settings/tabs/SmsSettings';
import SmsManagement from './pages/sms/SmsManagement';
import { MediaManagement } from './pages/media/MediaManagement';
import { Brands } from './pages/brands/Brands';
import { Toaster } from './components/ui/toaster';

function App() {
  // Note: authStore auto-loads from localStorage on creation (see authStore.ts line 101)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route element={<Layout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/alerts" element={<div>Live Alerts</div>} />

              {/* POS Routes */}
              <Route path="pos" element={<div>POS Terminal</div>} />
              <Route path="pos/history" element={<div>Register History</div>} />
              <Route path="pos/hold" element={<div>Hold Orders</div>} />

              {/* Inventory Management Routes */}
              <Route path="inventory/manual-entry" element={<ManualStockEntry />} />
              <Route path="inventory/receive/:poItemId" element={<ReceiveStockNew />} />
              <Route path="inventory/stock" element={<div>Current Stock</div>} />
              <Route path="inventory/adjustment" element={<div>Stock Adjustment</div>} />
              <Route path="inventory/transfer" element={<div>Stock Transfer</div>} />
              <Route path="inventory/audit" element={<div>Stock Count / Audit</div>} />
              <Route path="inventory/labels" element={<div>Print Labels</div>} />

              {/* Product Management Routes */}
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="products/categories" element={<Categories />} />
              <Route path="products/categories/create" element={<CategoriesCreate />} />
              <Route path="products/categories/:id/edit" element={<CategoriesEdit />} />
              <Route path="products/attributes" element={<Attributes />} />
              <Route path="products/stock" element={<StockManagement />} />
              <Route path="products/edit/:id" element={<EditProductStock />} />

              {/* Brand Management Routes */}
              <Route path="brands" element={<Brands />} />

              {/* Media Routes */}
              <Route path="media" element={<MediaManagement />} />

              {/* Purchase Routes */}
              <Route path="purchase/new" element={<PurchaseNew />} />
              <Route path="purchase/create-order" element={<CreatePurchaseOrder />} />
              <Route path="purchase/list" element={<PurchaseList />} />
              <Route path="purchase/demo" element={<PurchaseOrderDemo />} />
              <Route path="purchase/:id" element={<PurchaseOrderDetails />} />
              <Route path="purchase/:id/edit" element={<PurchaseOrderEdit />} />
              <Route path="purchase/receive" element={<PurchaseReceiveList />} />

              {/* Supplier Routes */}
              <Route path="purchase/suppliers" element={<Suppliers />} />
              <Route path="purchase/suppliers/create" element={<SuppliersCreate />} />
              <Route path="purchase/suppliers/:id" element={<SupplierProfile />} />
              <Route path="purchase/suppliers/:id/products" element={<SupplierProducts />} />
              <Route path="purchase/suppliers/:id/purchase" element={<SupplierPurchaseHistory />} />
              <Route path="purchase/suppliers/:id/edit" element={<SuppliersEdit />} />
              <Route path="purchase/suppliers/transactions" element={<div>Supplier Transactions</div>} />
              <Route path="purchase/suppliers/map" element={<div>Product-Supplier Map</div>} />

              {/* Sales Routes */}
              <Route path="sales/orders" element={<div>All Orders</div>} />
              <Route path="sales/orders/verify" element={<div>Verify Orders</div>} />
              <Route path="sales/orders/packaging" element={<div>Packaging List</div>} />
              <Route path="sales/orders/ready" element={<div>Ready to Ship</div>} />
              <Route path="sales/orders/website" element={<div>Website Orders</div>} />
              <Route path="sales/orders/wholesale" element={<div>Wholesale Orders</div>} />
              <Route path="sales/orders/daraz" element={<div>Daraz Orders</div>} />
              <Route path="sales/returns" element={<div>Returns & Refunds</div>} />
              <Route path="sales/exchanges" element={<div>Exchange Requests</div>} />

              {/* Delivery Routes */}
              <Route path="delivery/create" element={<div>Create Consignment</div>} />
              <Route path="delivery/labels" element={<div>Bulk Label Print</div>} />
              <Route path="delivery/tracking" element={<div>Live Tracking</div>} />
              <Route path="delivery/payments" element={<div>Courier Payment Report</div>} />

              {/* Marketing Routes */}
              <Route path="marketing/coupons" element={<div>Coupons & Vouchers</div>} />
              <Route path="marketing/flash-sales" element={<div>Flash Sales</div>} />
              <Route path="marketing/sms" element={<SmsManagement />} />
              <Route path="marketing/sms/logs" element={<div>SMS Logs</div>} />
              <Route path="marketing/loyalty/rules" element={<div>Reward Rules</div>} />
              <Route path="marketing/loyalty/history" element={<div>Points History</div>} />

              {/* User Management Routes */}
              <Route path="users" element={<Users />} />
              <Route path="users/create" element={<UsersCreate />} />
              <Route path="users/:id/edit" element={<UsersEdit />} />

              {/* CRM Routes */}
              <Route path="crm/retail-customers" element={<Users />} />
              <Route path="crm/retail-customers/create" element={<UsersCreate />} />
              <Route path="crm/retail-customers/:id/edit" element={<UsersEdit />} />
              <Route path="crm/wholesale-clients" element={<div>Wholesale Clients</div>} />
              <Route path="crm/blacklisted" element={<div>Blacklisted</div>} />

              {/* HRM Routes */}
              <Route path="hrm/staff" element={<div>Staff List</div>} />
              <Route path="hrm/attendance" element={<div>Attendance</div>} />
              <Route path="hrm/payroll" element={<div>Payroll</div>} />

              {/* Finance Routes */}
              <Route path="finance/expense" element={<div>Record Expense</div>} />
              <Route path="finance/daily-sales" element={<div>Daily Sales Report</div>} />
              <Route path="finance/coa" element={<div>Chart of Accounts</div>} />
              <Route path="finance/assets" element={<div>Asset Management</div>} />
              <Route path="finance/balance-sheet" element={<div>Balance Sheet</div>} />

              {/* Reports Routes */}
              <Route path="reports/inventory" element={<div>Inventory Reports</div>} />
              <Route path="reports/sales" element={<div>Sales Reports</div>} />
              <Route path="reports/finance" element={<div>Financial Reports</div>} />

              {/* Settings Routes */}
              <Route path="settings" element={<Settings />} />
              <Route path="settings/global" element={<GeneralSettings />} />
              <Route path="settings/pricing" element={<PricingSettings />} />
              <Route path="settings/payment" element={<PaymentSettings />} />
              <Route path="settings/tracking" element={<TrackingSettings />} />
              <Route path="settings/sms" element={<SmsSettings />} />
              <Route path="settings/integrations" element={<div>Integrations</div>} />
              <Route path="settings/rbac" element={<div>Access Control</div>} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
