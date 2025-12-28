import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard3Layout from './components/layouts/Dashboard3Layout';
import { Toaster } from './components/ui/toaster';
import { Loader2 } from 'lucide-react';

// Lazy load all route components for code splitting
// For default exports: use direct import
// For named exports: use .then() to convert to default
const LoginForm = lazy(() => import('./pages/Login').then(m => ({ default: m.LoginForm })));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Dashboard3 = lazy(() => import('./pages/Dashboard3'));
const Categories = lazy(() => import('./pages/Categories'));
const Attributes = lazy(() => import('./pages/Attributes'));
const Products = lazy(() => import('./pages/products/Products'));
const ProductDetail = lazy(() => import('./pages/products/ProductDetail'));
const ProductCreate = lazy(() => import('./pages/products/ProductCreate'));
const ProductEdit = lazy(() => import('./pages/products/ProductEdit'));
const StockManagement = lazy(() => import('./pages/products/StockManagement').then(m => ({ default: m.StockManagement })));
const EditProductStock = lazy(() => import('./pages/products/EditProductStock').then(m => ({ default: m.EditProductStock })));
const CategoriesCreate = lazy(() => import('./pages/products/CategoriesCreate'));
const CategoriesEdit = lazy(() => import('./pages/products/CategoriesEdit'));
const Suppliers = lazy(() => import('./pages/purchase/Suppliers'));
const SupplierProfile = lazy(() => import('./pages/purchase/SupplierProfile').then(m => ({ default: m.SupplierProfile })));
const SupplierProducts = lazy(() => import('./pages/purchase/SupplierProducts').then(m => ({ default: m.SupplierProducts })));
const SupplierPurchaseHistory = lazy(() => import('./pages/purchase/SupplierPurchaseHistory').then(m => ({ default: m.SupplierPurchaseHistory })));
const SuppliersCreate = lazy(() => import('./pages/purchase/SuppliersCreate'));
const SuppliersEdit = lazy(() => import('./pages/purchase/SuppliersEdit'));
const PurchaseNew = lazy(() => import('./pages/purchase/PurchaseNew').then(m => ({ default: m.PurchaseNew })));
const PurchaseList = lazy(() => import('./pages/purchase/PurchaseList').then(m => ({ default: m.PurchaseList })));
const CreatePurchaseOrder = lazy(() => import('./pages/purchase/CreatePurchaseOrder').then(m => ({ default: m.CreatePurchaseOrder })));
const PurchaseOrderDetails = lazy(() => import('./pages/purchase/PurchaseOrderDetails').then(m => ({ default: m.PurchaseOrderDetails })));
const PurchaseOrderEdit = lazy(() => import('./pages/purchase/PurchaseOrderEdit').then(m => ({ default: m.PurchaseOrderEdit })));
const PurchaseOrderDemo = lazy(() => import('./pages/purchase/PurchaseOrderDemo').then(m => ({ default: m.PurchaseOrderDemo })));
const PurchaseReceiveList = lazy(() => import('./pages/purchase/PurchaseReceiveList').then(m => ({ default: m.PurchaseReceiveList })));
const ReceiveStockNew = lazy(() => import('./pages/inventory/ReceiveStockNew').then(m => ({ default: m.ReceiveStockNew })));
const ManualStockEntry = lazy(() => import('./pages/inventory/ManualStockEntry'));
const Users = lazy(() => import('./pages/users/Users'));
const UsersCreate = lazy(() => import('./pages/users/UsersCreate'));
const UsersEdit = lazy(() => import('./pages/users/UsersEdit'));
const GeneralSettings = lazy(() => import('./pages/settings/tabs/GeneralSettings').then(m => ({ default: m.GeneralSettings })));
const PricingSettings = lazy(() => import('./pages/settings/tabs/PricingSettings').then(m => ({ default: m.PricingSettings })));
const PaymentSettings = lazy(() => import('./pages/settings/tabs/PaymentSettings').then(m => ({ default: m.PaymentSettings })));
const TrackingSettings = lazy(() => import('./pages/settings/tabs/TrackingSettings').then(m => ({ default: m.TrackingSettings })));
const Settings = lazy(() => import('./pages/settings/Settings').then(m => ({ default: m.Settings })));
const SmsSettings = lazy(() => import('./pages/settings/tabs/SmsSettings').then(m => ({ default: m.SmsSettings })));
const SmsManagement = lazy(() => import('./pages/sms/SmsManagement'));
const MediaManagement = lazy(() => import('./pages/media/MediaManagement').then(m => ({ default: m.MediaManagement })));
const Brands = lazy(() => import('./pages/brands/Brands').then(m => ({ default: m.Brands })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
  </div>
);

function App() {
  // Note: authStore auto-loads from localStorage on creation (see authStore.ts line 101)

  return (
    <>
      <Router>
        <Suspense fallback={<PageLoader />}>
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
                <Route path="products/stock/:id/edit" element={<EditProductStock />} />

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
                <Route path="purchase/suppliers/:id/edit" element={<SuppliersEdit />} />
                <Route path="purchase/suppliers/:id/products" element={<SupplierProducts />} />
                <Route path="purchase/suppliers/:id/purchase-history" element={<SupplierPurchaseHistory />} />

                {/* User Management Routes */}
                <Route path="users" element={<Users />} />
                <Route path="users/create" element={<UsersCreate />} />
                <Route path="users/:id" element={<UsersEdit />} />
                <Route path="users/:id/edit" element={<UsersEdit />} />

                {/* Settings Routes */}
                <Route path="settings" element={<Settings />} />
                <Route path="settings/general" element={<GeneralSettings />} />
                <Route path="settings/pricing" element={<PricingSettings />} />
                <Route path="settings/payment" element={<PaymentSettings />} />
                <Route path="settings/tracking" element={<TrackingSettings />} />

                {/* SMS Routes */}
                <Route path="settings/sms" element={<SmsSettings />} />
                <Route path="sms" element={<SmsManagement />} />
              </Route>

              {/* Dashboard 3 Routes with separate layout */}
              <Route element={<Dashboard3Layout />}>
                <Route path="dashboard3" element={<Dashboard3 />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
