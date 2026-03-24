import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  return (
    <BrowserRouter>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowAdmin(!showAdmin)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 text-sm"
        >
          {showAdmin ? 'Ver Público' : 'Ver Admin'}
        </button>
      </div>
      <Routes>
        {showAdmin ? (
          <>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-600 mt-2">Panel de administración - Coming Soon</p></div>} />
              <Route path="productos" element={<div className="p-8"><h1 className="text-2xl font-bold">Productos</h1><p className="text-gray-600 mt-2">Gestión de productos - Coming Soon</p></div>} />
              <Route path="categorias" element={<div className="p-8"><h1 className="text-2xl font-bold">Categorías</h1><p className="text-gray-600 mt-2">Gestión de categorías - Coming Soon</p></div>} />
              <Route path="avisos" element={<div className="p-8"><h1 className="text-2xl font-bold">Avisos</h1><p className="text-gray-600 mt-2">Gestión de avisos - Coming Soon</p></div>} />
              <Route path="franquicias" element={<div className="p-8"><h1 className="text-2xl font-bold">Franquicias</h1><p className="text-gray-600 mt-2">Gestión de franquicias - Coming Soon</p></div>} />
              <Route path="productos-futuros" element={<div className="p-8"><h1 className="text-2xl font-bold">Productos Futuros</h1><p className="text-gray-600 mt-2">Gestión de productos futuros - Coming Soon</p></div>} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<div className="p-8"><h1 className="text-2xl font-bold">Home</h1><p className="text-gray-600 mt-2">Página de inicio - Coming Soon</p></div>} />
              <Route path="/sabores" element={<div className="p-8"><h1 className="text-2xl font-bold">Sabores</h1><p className="text-gray-600 mt-2">Catálogo de productos - Coming Soon</p></div>} />
              <Route path="/quienes-somos" element={<div className="p-8"><h1 className="text-2xl font-bold">Quiénes Somos</h1><p className="text-gray-600 mt-2">Nuestra historia - Coming Soon</p></div>} />
              <Route path="/puntos-de-venta" element={<div className="p-8"><h1 className="text-2xl font-bold">Puntos de Venta</h1><p className="text-gray-600 mt-2">Dónde encontrarnos - Coming Soon</p></div>} />
              <Route path="/franquicias" element={<div className="p-8"><h1 className="text-2xl font-bold">Franquicias</h1><p className="text-gray-600 mt-2">Franquicias disponibles - Coming Soon</p></div>} />
              <Route path="/contactanos" element={<div className="p-8"><h1 className="text-2xl font-bold">Contáctanos</h1><p className="text-gray-600 mt-2">Escríbenos - Coming Soon</p></div>} />
              <Route path="/compras" element={<div className="p-8"><h1 className="text-2xl font-bold">Compras</h1><p className="text-gray-600 mt-2">Tu carrito - Coming Soon</p></div>} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App