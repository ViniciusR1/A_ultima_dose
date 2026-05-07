import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ClientDashboard from './pages/client/Dashboard';
import ClientOrders from './pages/client/Orders';
import ClientProfile from './pages/client/Profile';
import ClientCatalog from './pages/client/Catalog';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminProfile from './pages/admin/Profile';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, profile, loading, isAdmin } = useAuth();
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'var(--font-display)',color:'var(--burgundy)',fontSize:'1.5rem' }}>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/cliente" replace />;
  return children;
}

function AppRoutes() {
  const { user, isAdmin } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/cliente'} /> : <LoginPage />} />
      <Route path="/cadastro" element={user ? <Navigate to="/cliente" /> : <RegisterPage />} />
      <Route path="/catalogo" element={<ClientCatalog />} />
      <Route path="/cliente" element={<PrivateRoute><ClientDashboard /></PrivateRoute>} />
      <Route path="/cliente/pedidos" element={<PrivateRoute><ClientOrders /></PrivateRoute>} />
      <Route path="/cliente/perfil" element={<PrivateRoute><ClientProfile /></PrivateRoute>} />
      <Route path="/cliente/catalogo" element={<PrivateRoute><ClientCatalog /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
      <Route path="/admin/produtos" element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />
      <Route path="/admin/pedidos" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
      <Route path="/admin/usuarios" element={<PrivateRoute adminOnly><AdminUsers /></PrivateRoute>} />
      <Route path="/admin/perfil" element={<PrivateRoute adminOnly><AdminProfile /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'var(--font-body)', background: 'var(--charcoal)', color: 'var(--cream)', border: '1px solid var(--gold)' } }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
