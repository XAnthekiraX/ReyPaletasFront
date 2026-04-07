import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AuthProvider, useAuth } from './store/AuthContext'
import { CartProvider } from './context/CartContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import Home from './pages/public/Home'
import Products from './pages/public/Products'
import ShoppingCart from './pages/public/ShoppingCart'
import QuienesSomos from './pages/public/QuienesSomos'
import PuntosDeVenta from './pages/public/PuntosDeVenta'
import Franquicias from './pages/public/Franquicias'
import Contact from './pages/public/Contact'

const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('./pages/admin/Products'))
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements'))
const AdminFranchises = lazy(() => import('./pages/admin/Franchises'))

function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

function PublicRoutes() {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/sabores" element={<Products />} />
      <Route path="/compras" element={<ShoppingCart />} />
      <Route path="/quienes-somos" element={<QuienesSomos />} />
      <Route path="/puntos-de-venta" element={<PuntosDeVenta />} />
      <Route path="/franquicias" element={<Franquicias />} />
      <Route path="/contactanos" element={<Contact />} />
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
            <Suspense fallback={<AdminLoading />}>
              <Dashboard />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="productos" element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoading />}>
              <AdminProducts />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="avisos" element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoading />}>
              <AdminAnnouncements />
            </Suspense>
          </ProtectedRoute>
        } />
        <Route path="franquicias" element={
          <ProtectedRoute>
            <Suspense fallback={<AdminLoading />}>
              <AdminFranchises />
            </Suspense>
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