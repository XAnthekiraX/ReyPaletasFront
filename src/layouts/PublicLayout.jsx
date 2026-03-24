import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'

const navLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Sabores', path: '/sabores' },
  { name: 'Quiénes Somos', path: '/quienes-somos' },
  { name: 'Puntos de Venta', path: '/puntos-de-venta' },
  { name: 'Franquicias', path: '/franquicias' },
  { name: 'Contáctanos', path: '/contactanos' },
]

function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              Rey Paletas
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-700 hover:text-primary'
                } px-3 py-2 text-sm font-medium transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/compras"
              className="hidden md:inline-flex bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
            >
              Carrito
            </Link>

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden"
            >
              <nav className="flex flex-col space-y-2 py-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`${
                        location.pathname === link.path
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-700 hover:bg-gray-50'
                      } px-3 py-2 rounded-md text-sm font-medium block`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                >
                  <Link
                    to="/compras"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium text-center mt-2 block"
                  >
                    Carrito
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-quaternary text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Rey Paletas</h3>
            <p className="text-gray-300 text-sm">Helados artesanales de la mejor calidad</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p className="text-gray-300 text-sm">info@reypaletas.com</p>
            <p className="text-gray-300 text-sm">+1 234 567 890</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                Instagram
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                Facebook
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                WhatsApp
              </motion.a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          © 2026 Rey Paletas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout