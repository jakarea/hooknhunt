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
import SuppliersCreate from './pages/purchase/SuppliersCreate';
import SuppliersEdit from './pages/purchase/SuppliersEdit';
import Users from './pages/users/Users';
import UsersCreate from './pages/users/UsersCreate';
import UsersEdit from './pages/users/UsersEdit';
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
              <Route path="dashboard/suppliers/:id/edit" element={<SuppliersEdit />} />

              {/* User Routes */}
              <Route path="dashboard/users" element={<Users />} />
              <Route path="dashboard/users/create" element={<UsersCreate />} />
              <Route path="dashboard/users/:id/edit" element={<UsersEdit />} />

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
