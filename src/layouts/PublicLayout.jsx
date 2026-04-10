import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import SVG from "../assets/logo.svg?react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@iconify/react'
import { useCart } from '../context/CartContext'

const socialNetworks = [
  {
    link: "https://www.facebook.com/reypaletas.ecu/",
    icon: "mdi:facebook"
  },
  {
    link: "https://www.instagram.com/reypaletas.ecu/",
    icon: "mdi:instagram"
  },
  {
    link: "",
    icon: "mdi:whatsapp"
  }
]

const contactOptions = [
  {
    name: "info@reypaletas.com",
    icon: "iconamoon:email"
  },
  {
    name: "+593 99 804 4059",
    icon: "tabler:phone"
  },
  {
    name: "Ambato, Ecuador",
    icon: "tdesign:location"
  },
]

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
  const { cartCount } = useCart()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold text-primary">
              <SVG className="fill-primary h-10" />
            </Link>
          </div>

          <nav className="hidden md:flex justify-center items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${location.pathname === link.path
                  ? 'text-primary font-bold '
                  : 'text-gray-700 font-medium hover:text-primary'
                  } px-3 py-2 text-sm  transition-all`}
              >
                {link.name}
                <div className={`${location.pathname === link.path
                  ? 'border border-primary w-full '
                  : 'w-0'
                  } transition-all`}></div>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {cartCount > 0 && (
              <Link
                to="/compras"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <Icon icon="mdi:cart" className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </Link>
            )}

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
                      className={`${location.pathname === link.path
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-700 hover:bg-gray-50'
                        } px-3 py-2 rounded-md flex text-sm font-medium `}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {cartCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                  >
                    <Link
                      to="/compras"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium mt-2"
                    >
                      <Icon icon="mdi:cart" className="w-5 h-5" />
                      Carrito ({cartCount})
                    </Link>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}

function Footer() {
  const location = useLocation()
  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
          <div className='flex flex-col justify-center items-center lg:items-start gap-2'>
            <SVG className="fill-secondary h-8" />
            <p className="text-tertiary text-2xl font-handwriting">El relleno de tu vida</p>
            <div className='flex w-auto justify-center lg:items-start items-center gap-2.5'>
              {
                socialNetworks.map((items, index) => {
                  return (
                    <a key={index} href={items.link} className='text-2xl text-tertiary bg-secondary/15 p-1.5 rounded-full hover:scale-110 transition-all'>
                      <Icon icon={items.icon} />
                    </a>
                  );
                })
              }
            </div>
          </div>
          <div className='flex flex-col justify-center items-center lg:items-start gap-2'>
            <h3 className="text-lg font-semibold mb-4">EXPLORAR</h3>
            <div className='grid grid-cols-3 lg:grid-cols-2 gap-1 lg:2.5'>
              {
                navLinks.map((nav, index) => {
                  return (
                    <Link to={nav.path} key={index} className={`${location.pathname === nav.path
                      ? 'text-tertiary font-bold'
                      : ''
                      } transition-all`}>
                      {nav.name}
                    </Link>
                  )
                })
              }
            </div>
          </div>
          <div className='flex flex-col justify-center items-center lg:items-start gap-2'>
            <h3 className="text-lg font-semibold mb-4">CONTACTANOS</h3>
            <div className='gap-1.5 flex flex-col text-sm'>
              {
                contactOptions.map((option, index) => {
                  return (
                    <div key={index} className='flex justify-start items-center gap-2.5'>
                      <Icon icon={option.icon} className='text-lg text-tertiary' />
                      <p>{option.name}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 t gray-700 text-center text-gray-400 text-sm">
          © 2026 Rey Paletas. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
