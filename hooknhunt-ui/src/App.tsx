import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Suppliers from './pages/purchase/Suppliers';
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
              <Route path="dashboard/suppliers" element={<Suppliers />} />
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
