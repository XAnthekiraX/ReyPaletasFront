import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { useAuth } from '../store/AuthContext'
import { Toaster } from 'sileo'
import SessionExpiryAlert from '../components/SessionExpiryAlert'

const adminNavLinks = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Productos', path: '/admin/productos' },
  { name: 'Avisos', path: '/admin/avisos' },
  { name: 'Franquicias', path: '/admin/franquicias' },
]

function AdminSidebar({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  )
}

function AdminSidebarContent({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay sidebar */}
      <motion.aside
        className={`
          fixed inset-y-0 left-0 z-50
w-64 bg-primary text-white min-h-screen
          md:hidden
        `}
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="p-6 flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold text-secondary">
              Rey Paletas
            </Link>
            <p className="text-sm text-primary-muted mt-1">Admin Panel</p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white"
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
        <nav className="mt-6">
          {adminNavLinks.map((link, index) => {
            const isActive = location.pathname === link.path ||
              (link.path !== '/admin' && location.pathname.startsWith(link.path))
            return (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.path}
                  onClick={onClose}
                  className={`block px-6 py-3 text-sm transition-colors ${isActive
                    ? 'bg-primary text-white'
                    : 'text-white hover:bg-primary-hover'
                    }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            )
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-6 border-t border-primary-dark">
          <Link
            to="/"
            className="block text-white hover:text-secondary text-sm"
          >
            ← Volver al sitio
          </Link>
        </div>
      </motion.aside>

      {/* Desktop static sidebar */}
      <aside className="hidden md:flex md:flex-col fixed inset-y-0 left-0 w-64 bg-primary text-white min-h-screen">
        <div className="p-6">
          <Link to="/" className="text-2xl font-bold text-secondary">
            Rey Paletas
          </Link>
          <p className="text-sm text-primary-muted mt-1">Admin Panel</p>
        </div>
        <nav className="mt-6 flex-1">
          {adminNavLinks.map((link) => {
            const isActive = location.pathname === link.path ||
              (link.path !== '/admin' && location.pathname.startsWith(link.path))
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-6 py-3 text-sm transition-colors ${isActive
                  ? 'bg-primary text-white'
                  : 'text-white hover:bg-primary-hover'
                  }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-6 border-t border-primary-dark">
          <Link
            to="/"
            className="block text-white hover:text-secondary text-sm"
          >
            ← Volver al sitio
          </Link>
        </div>
      </aside>
    </>
  )
}

function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <header className="bg-white shadow-sm md:ml-64">
      <div className="flex justify-between items-center h-16 px-4 md:px-6">
        <motion.button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-primary hover:bg-secondary"
          aria-label="Open menu"
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </motion.button>
        <h1 className="text-xl font-semibold text-primary">Admin Panel</h1>
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="hidden sm:block text-sm text-primary">{user?.email || 'admin'}</span>
          <motion.button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cerrar sesión
          </motion.button>
        </div>
      </div>
    </header>
  )
}

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-primary/10">
      <Toaster 
        position="top-right"
        options={{
          fill: "#1f2937",
          roundness: 12,
          styles: {
            title: "text-white! text-sm font-semibold",
            description: "text-white/70! text-xs",
            badge: "bg-white/10!",
            button: "bg-primary! hover:bg-primary/80! text-white!",
          },
        }}
      />
      <SessionExpiryAlert />
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminSidebarContent isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <motion.main
        className="md:ml-64 p-4 md:p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Outlet />
      </motion.main>
    </div>
  )
}

export default AdminLayout