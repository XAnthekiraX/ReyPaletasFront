import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './store/AuthContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLogin from './pages/admin/AdminLogin'
import SessionExpiryAlert from './components/SessionExpiryAlert'

function PublicRoutes() {
  return (
    <Route element={<PublicLayout />}>
      <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Home</h1><p className="text-gray-600 mt-2">Página de inicio - Coming Soon</p></div>} />
      <Route path="/sabores" element={<div className="p-8"><h1 className="text-2xl font-bold">Sabores</h1><p className="text-gray-600 mt-2">Catálogo de productos - Coming Soon</p></div>} />
      <Route path="/quienes-somos" element={<div className="p-8"><h1 className="text-2xl font-bold">Quiénes Somos</h1><p className="text-gray-600 mt-2">Nuestra historia - Coming Soon</p></div>} />
      <Route path="/puntos-de-venta" element={<div className="p-8"><h1 className="text-2xl font-bold">Puntos de Venta</h1><p className="text-gray-600 mt-2">Dónde encontrarnos - Coming Soon</p></div>} />
      <Route path="/franquicias" element={<div className="p-8"><h1 className="text-2xl font-bold">Franquicias</h1><p className="text-gray-600 mt-2">Franquicias disponibles - Coming Soon</p></div>} />
      <Route path="/contactanos" element={<div className="p-8"><h1 className="text-2xl font-bold">Contáctanos</h1><p className="text-gray-600 mt-2">Escríbenos - Coming Soon</p></div>} />
      <Route path="/compras" element={<div className="p-8"><h1 className="text-2xl font-bold">Compras</h1><p className="text-gray-600 mt-2">Tu carrito - Coming Soon</p></div>} />
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
            <div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-600 mt-2">Panel de administración</p></div>
          </ProtectedRoute>
        } />
        <Route path="productos" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Productos</h1><p className="text-gray-600 mt-2">Gestión de productos</p></div>
          </ProtectedRoute>
        } />
        <Route path="categorias" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Categorías</h1><p className="text-gray-600 mt-2">Gestión de categorías</p></div>
          </ProtectedRoute>
        } />
        <Route path="avisos" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Avisos</h1><p className="text-gray-600 mt-2">Gestión de avisos</p></div>
          </ProtectedRoute>
        } />
        <Route path="franquicias" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Franquicias</h1><p className="text-gray-600 mt-2">Gestión de franquicias</p></div>
          </ProtectedRoute>
        } />
        <Route path="productos-futuros" element={
          <ProtectedRoute>
            <div className="p-8"><h1 className="text-2xl font-bold">Productos Futuros</h1><p className="text-gray-600 mt-2">Gestión de productos futuros</p></div>
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App