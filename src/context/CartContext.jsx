import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, variant = null) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.id === product.id && item.variant?.id === variant?.id
      )

      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].quantity += 1
        return updated
      }

      return [...prev, { 
        ...product, 
        variant, 
        quantity: 1,
        price: variant ? variant.price : product.price 
      }]
    })
  }

  const removeFromCart = (productId, variantId = null) => {
    setCart(prev => prev.filter(
      item => !(item.id === productId && item.variant?.id === variantId)
    ))
  }

  const updateQuantity = (productId, variantId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setCart(prev => prev.map(item => 
      item.id === productId && item.variant?.id === variantId
        ? { ...item, quantity }
        : item
    ))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartItemCount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
