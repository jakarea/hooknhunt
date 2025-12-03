import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Products from './pages/products/Products';
import ProductDetail from './pages/products/ProductDetail';
import ProductCreate from './pages/products/ProductCreate';
import ProductEdit from './pages/products/ProductEdit';
import Suppliers from './pages/purchase/Suppliers';
import { SupplierProfile } from './pages/purchase/SupplierProfile';
import SuppliersCreate from './pages/purchase/SuppliersCreate';
import SuppliersEdit from './pages/purchase/SuppliersEdit';
import { PurchaseNew } from './pages/purchase/PurchaseNew';
import { PurchaseList } from './pages/purchase/PurchaseList';
import { CreatePurchaseOrder } from './pages/purchase/CreatePurchaseOrder';
import { PurchaseOrderDetails } from './pages/purchase/PurchaseOrderDetails';
import { PurchaseOrderDemo } from './pages/purchase/PurchaseOrderDemo';
import Users from './pages/users/Users';
import UsersCreate from './pages/users/UsersCreate';
import UsersEdit from './pages/users/UsersEdit';
import { GlobalSettings } from './pages/settings/GlobalSettings';
import SmsManagement from './pages/sms/SmsManagement';
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
              <Route path="dashboard/categories" element={<Categories />} />

              {/* Product Routes */}
              <Route path="dashboard/products" element={<Products />} />
              <Route path="dashboard/products/create" element={<ProductCreate />} />
              <Route path="dashboard/products/:id" element={<ProductDetail />} />
              <Route path="dashboard/products/:id/edit" element={<ProductEdit />} />

              {/* Supplier Routes */}
              <Route path="dashboard/suppliers" element={<Suppliers />} />
              <Route path="dashboard/suppliers/create" element={<SuppliersCreate />} />
              <Route path="dashboard/suppliers/:id" element={<SupplierProfile />} />
              <Route path="dashboard/suppliers/:id/edit" element={<SuppliersEdit />} />

              {/* Purchase Routes */}
              <Route path="dashboard/purchase/new" element={<PurchaseNew />} />
              <Route path="dashboard/purchase/create-order" element={<CreatePurchaseOrder />} />
              <Route path="dashboard/purchase/list" element={<PurchaseList />} />
              <Route path="dashboard/purchase/demo" element={<PurchaseOrderDemo />} />
              <Route path="dashboard/purchase/:id" element={<PurchaseOrderDetails />} />

              {/* User Routes */}
              <Route path="dashboard/users" element={<Users />} />
              <Route path="dashboard/users/create" element={<UsersCreate />} />
              <Route path="dashboard/users/:id/edit" element={<UsersEdit />} />

              {/* Settings Routes */}
              <Route path="dashboard/settings" element={<GlobalSettings />} />

              {/* SMS Routes */}
              <Route path="dashboard/sms" element={<SmsManagement />} />

              {/* Add other protected routes here */}
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
