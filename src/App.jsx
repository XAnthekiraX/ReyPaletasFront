import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import { CartProvider } from './context/CartContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminFranchises from './pages/admin/Franchises'
import SessionExpiryAlert from './components/SessionExpiryAlert'
import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ShoppingCart from './pages/public/ShoppingCart'
import QuiienesSomos from './pages/public/QuiienesSomos'
import PuntosDeVenta from './pages/public/PuntosDeVenta'
import Franquicias from './pages/public/Franquicias'

function PublicRoutes() {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/sabores" element={<Products />} />
      <Route path="/compras" element={<ShoppingCart />} />
      <Route path="/quienes-somos" element={<QuiienesSomos />} />
      <Route path="/puntos-de-venta" element={<PuntosDeVenta />} />
      <Route path="/franquicias" element={<Franquicias />} />
      <Route path="/contactanos" element={<div className="p-8"><h1 className="text-2xl font-bold">Contáctanos</h1><p className="text-gray-600 mt-2">Escríbenos - Coming Soon</p></div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  )
}

function AdminRoutes() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return (
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="productos" element={
          <ProtectedRoute>
            <AdminProducts />
          </ProtectedRoute>
        } />
        <Route path="avisos" element={
          <ProtectedRoute>
            <AdminAnnouncements />
          </ProtectedRoute>
        } />
        <Route path="franquicias" element={
          <ProtectedRoute>
            <AdminFranchises />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    )
  }

  return (
    <>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<Navigate to="/admin/login" replace />} />
    </>
  )
}

function AppContent() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        {PublicRoutes()}
        {AdminRoutes()}
      </Routes>
      <SessionExpiryAlert />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App