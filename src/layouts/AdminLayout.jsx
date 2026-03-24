import { Outlet, Link, useLocation } from 'react-router-dom'

const adminNavLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Productos', path: '/admin/productos' },
  { name: 'Categorías', path: '/admin/categorias' },
  { name: 'Avisos', path: '/admin/avisos' },
  { name: 'Franquicias', path: '/admin/franquicias' },
  { name: 'Productos Futuros', path: '/admin/productos-futuros' },
]

function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-quaternary text-white min-h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link to="/" className="text-2xl font-bold text-primary">
          Rey Paletas
        </Link>
        <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
      </div>
      <nav className="mt-6">
        {adminNavLinks.map((link) => {
          const isActive = location.pathname === link.path ||
            (link.path !== '/admin' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-6 py-3 text-sm ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          )
        })}
      </nav>
      <div className="absolute bottom-0 w-full p-6 border-t border-gray-700">
        <Link
          to="/"
          className="block text-gray-300 hover:text-white text-sm"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  )
}

function AdminHeader() {
  return (
    <header className="bg-white shadow-sm ml-64">
      <div className="flex justify-between items-center h-16 px-6">
        <h1 className="text-xl font-semibold text-gray-800">Admin Panel</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">admin@reypaletas.com</span>
          <button className="text-sm text-red-600 hover:text-red-700">
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <AdminHeader />
      <main className="ml-64 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout