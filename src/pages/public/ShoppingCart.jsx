import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { Icon } from '@iconify/react'

function CartItem({ item, onUpdateQuantity, onRemove }) {
  const total = item.price * item.quantity

  return (
    <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Icon icon="mdi:ice-cream" className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
        {item.variantName && (
          <p className="text-sm text-gray-500">{item.variantName}</p>
        )}
        <p className="text-primary font-medium">${item.price.toFixed(2)} c/u</p>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors disabled:opacity-50"
              disabled={item.quantity <= 1}
            >
              <Icon icon="mdi:minus" className="w-4 h-4 text-gray-700" />
            </button>

            <span className="w-8 text-center font-medium text-gray-800">
              {item.quantity}
            </span>

            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:plus" className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <p className="font-bold text-gray-800">${total.toFixed(2)}</p>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="self-start p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Icon icon="mdi:delete" className="w-5 h-5" />
      </button>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
        <Icon icon="mdi:cart-off" className="w-12 h-12 text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
      <p className="text-gray-500 mb-6">¡Añade algunos productos para comenzar!</p>
      <Link
        to="/sabores"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        <Icon icon="mdi:ice-cream" className="w-5 h-5" />
        Ver productos
      </Link>
    </div>
  )
}

export default function ShoppingCart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  const generateWhatsAppMessage = () => {
    const cartDetail = cartItems
      .map(item => {
        const variant = item.variantName ? ` (${item.variantName})` : ''
        return `- ${item.name}${variant} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      })
      .join('\n')

    return `*Mi pedido es:*\n\n${cartDetail}\n\n*Total: $${subtotal.toFixed(2)}*`
  }

  const whatsappNumber = '593998044059'
  const whatsappMessage = encodeURIComponent(generateWhatsAppMessage())
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">
            Tu Carrito
          </h1>
          <EmptyCart />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary text-center mb-8">
          Tu Carrito
        </h1>

        <div className="flex justify-end mb-4">
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <Icon icon="mdi:delete-outline" className="w-4 h-4" />
            Vaciar carrito
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <CartItem
              key={index}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Productos ({totalItems})</span>
            <span className="text-gray-800">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Envío</span>
            <span className="text-red-600 font-medium">No Incluye</span>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-2xl font-bold text-primary">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <Icon icon="ic:baseline-whatsapp" className="w-5 h-5" />
            Hacer pedido
          </a>

          <Link
            to="/sabores"
            className="block text-center mt-4 text-gray-600 hover:text-primary transition-colors"
          >
            <Icon icon="mdi:arrow-left" className="inline w-5 h-5 mr-1" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
