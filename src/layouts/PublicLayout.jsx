import { Outlet, Link, useLocation } from 'react-router-dom'

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
                } px-3 py-2 text-sm font-medium`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <Link
            to="/compras"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
          >
            Carrito
          </Link>
        </div>
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
              <a href="#" className="text-gray-300 hover:text-primary">Instagram</a>
              <a href="#" className="text-gray-300 hover:text-primary">Facebook</a>
              <a href="#" className="text-gray-300 hover:text-primary">WhatsApp</a>
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