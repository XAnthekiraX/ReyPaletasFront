import { Link, Outlet } from 'react-router-dom'
import { useCart } from '../../context/CartContext'

export default function PublicLayout() {
  const { cartItemCount } = useCart()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-pink-600">
            Rey Paletas
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/menu" className="hover:text-pink-600 transition">
              Menu
            </Link>
            <Link to="/locations" className="hover:text-pink-600 transition">
              Locations
            </Link>
            <Link to="/contact" className="hover:text-pink-600 transition">
              Contact
            </Link>
            <Link 
              to="/shop" 
              className="relative p-2 hover:text-pink-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Rey Paletas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
